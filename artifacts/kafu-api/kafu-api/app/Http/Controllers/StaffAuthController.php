<?php

namespace App\Http\Controllers;

use App\Models\StaffPasswordReset;
use App\Models\StaffSecurityEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffAuthController extends Controller
{
    private const MAX_FAILED = 5;
    private const LOCK_MINUTES = 30;

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();
        $ip = $request->ip();
        $ua = $request->userAgent();

        if (!$user) {
            StaffSecurityEvent::log('login_failure', null, $data['email'], ['reason' => 'user_not_found'], $ip, $ua);
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if ($user->status === 'inactive') {
            return response()->json(['message' => 'Account is inactive. Contact ICT.'], 403);
        }

        if ($user->isLocked()) {
            $unlockAt = $user->locked_at?->addMinutes(self::LOCK_MINUTES);
            if ($unlockAt && now()->greaterThan($unlockAt)) {
                $user->update(['locked_at' => null, 'failed_login_count' => 0]);
            } else {
                StaffSecurityEvent::log('login_failure', $user->id, $data['email'], ['reason' => 'account_locked'], $ip, $ua);
                return response()->json(['message' => 'Account is locked. Try again later or contact ICT.'], 403);
            }
        }

        if (!Hash::check($data['password'], $user->password)) {
            $failed = $user->failed_login_count + 1;
            $updates = ['failed_login_count' => $failed];
            if ($failed >= self::MAX_FAILED) {
                $updates['locked_at'] = now();
                $updates['status'] = 'locked';
            }
            $user->update($updates);
            StaffSecurityEvent::log('login_failure', $user->id, $data['email'], ['attempts' => $failed], $ip, $ua);
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        // Successful login
        $user->update([
            'last_login_at' => now(),
            'failed_login_count' => 0,
            'locked_at' => null,
        ]);

        $token = $user->createToken('staff-portal', ['staff'])->plainTextToken;

        StaffSecurityEvent::log('login_success', $user->id, $user->email, [], $ip, $ua);

        return response()->json([
            'token' => $token,
            'user'  => $this->userPayload($user),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out.']);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update([
            'password'               => Hash::make($data['new_password']),
            'first_login_completed'  => true,
        ]);

        StaffSecurityEvent::log('password_change', $user->id, $user->email, [], $request->ip(), $request->userAgent());

        return response()->json(['message' => 'Password changed successfully.', 'user' => $this->userPayload($user->fresh())]);
    }

    public function resetRequest(Request $request)
    {
        $data = $request->validate(['email' => 'required|email']);
        $user = User::where('email', $data['email'])->first();

        if ($user) {
            DB::table('staff_password_resets')->where('email', $data['email'])->delete();
            $token = Str::random(64);
            DB::table('staff_password_resets')->insert([
                'email'      => $data['email'],
                'token'      => Hash::make($token),
                'expires_at' => now()->addHours(2),
                'used'       => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            StaffSecurityEvent::log('password_reset_request', $user->id, $user->email, [], $request->ip(), $request->userAgent());
            // In production: dispatch email with $token
        }

        return response()->json(['message' => 'If that email is registered, a reset link has been sent.']);
    }

    public function resetConfirm(Request $request)
    {
        $data = $request->validate([
            'email'        => 'required|email',
            'token'        => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $record = DB::table('staff_password_resets')
            ->where('email', $data['email'])
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record || !Hash::check($data['token'], $record->token)) {
            return response()->json(['message' => 'Invalid or expired reset token.'], 422);
        }

        $user = User::where('email', $data['email'])->firstOrFail();
        $user->update(['password' => Hash::make($data['new_password']), 'first_login_completed' => true]);

        DB::table('staff_password_resets')->where('email', $data['email'])->update(['used' => true]);

        StaffSecurityEvent::log('password_reset_complete', $user->id, $user->email, [], $request->ip(), $request->userAgent());

        return response()->json(['message' => 'Password has been reset. You may now log in.']);
    }

    private function userPayload(User $user): array
    {
        return [
            'id'                    => $user->id,
            'name'                  => $user->name,
            'email'                 => $user->email,
            'title'                 => $user->title,
            'job_title'             => $user->job_title,
            'department'            => $user->department,
            'school_code'           => $user->school_code,
            'role'                  => $user->role,
            'status'                => $user->status,
            'avatar_url'            => $user->avatar_url,
            'first_login_completed' => $user->first_login_completed,
            'has_consent'           => $user->hasAcceptedConsent('profile_publication'),
            'last_login_at'         => $user->last_login_at?->toIso8601String(),
        ];
    }
}
