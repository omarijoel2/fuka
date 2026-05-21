<?php

namespace App\Http\Controllers;

use App\Models\StaffSecurityEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminStaffController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q');
        $role = $request->get('role', 'staff_user');
        $status = $request->get('status');
        $dept = $request->get('department');

        $query = User::query();

        if ($role !== 'all') {
            $query->where('role', $role);
        }

        if ($status) $query->where('status', $status);
        if ($dept)   $query->where('department', $dept);
        if ($q)      $query->where(fn($q2) => $q2->where('name', 'like', "%$q%")->orWhere('email', 'like', "%$q%")->orWhere('payroll_number', 'like', "%$q%"));

        $users = $query->orderBy('name')->paginate(25);
        return response()->json($users);
    }

    public function show(int $id)
    {
        $user = User::findOrFail($id);
        $user->load('profileSubmissions', 'consentRecords');
        return response()->json(['user' => $user]);
    }

    public function provision(Request $request)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:200',
            'email'          => 'required|email|unique:users,email',
            'payroll_number' => 'nullable|string|max:50|unique:users,payroll_number',
            'staff_number'   => 'nullable|string|max:50|unique:users,staff_number',
            'title'          => 'nullable|string|max:20',
            'job_title'      => 'nullable|string|max:200',
            'department'     => 'nullable|string|max:100',
            'school_code'    => 'nullable|string|max:50',
            'role'           => 'nullable|string|in:' . implode(',', array_keys(User::roles())),
        ]);

        $tempPassword = Str::random(12);
        $user = User::create([
            ...$data,
            'password' => Hash::make($tempPassword),
            'role' => $data['role'] ?? 'staff_user',
            'status' => 'active',
            'first_login_completed' => false,
        ]);

        StaffSecurityEvent::log('account_provisioned', $user->id, $user->email,
            ['provisioned_by' => $request->user()->id]);

        return response()->json([
            'user' => $user,
            'temp_password' => $tempPassword, // shown once — send via secure channel
            'message' => 'Account provisioned. Share the temporary password securely.',
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'name'        => 'sometimes|string|max:200',
            'title'       => 'nullable|string|max:20',
            'job_title'   => 'nullable|string|max:200',
            'department'  => 'nullable|string|max:100',
            'school_code' => 'nullable|string|max:50',
            'role'        => 'nullable|string|in:' . implode(',', array_keys(User::roles())),
            'phone'       => 'nullable|string|max:30',
        ]);
        $user->update($data);
        return response()->json(['user' => $user]);
    }

    public function lock(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'locked', 'locked_at' => now()]);
        StaffSecurityEvent::log('account_locked', $user->id, $user->email, ['locked_by' => $request->user()->id]);
        return response()->json(['user' => $user, 'message' => 'Account locked.']);
    }

    public function unlock(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'active', 'locked_at' => null, 'failed_login_count' => 0]);
        StaffSecurityEvent::log('account_unlocked', $user->id, $user->email, ['unlocked_by' => $request->user()->id]);
        return response()->json(['user' => $user, 'message' => 'Account unlocked.']);
    }

    public function deactivate(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'inactive']);
        // Revoke all tokens
        $user->tokens()->delete();
        StaffSecurityEvent::log('account_deactivated', $user->id, $user->email, ['by' => $request->user()->id]);
        return response()->json(['message' => 'Account deactivated.']);
    }

    public function resetPassword(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $temp = Str::random(12);
        $user->update([
            'password' => Hash::make($temp),
            'first_login_completed' => false,
            'failed_login_count' => 0,
            'locked_at' => null,
            'status' => 'active',
        ]);
        StaffSecurityEvent::log('password_reset_admin', $user->id, $user->email, ['reset_by' => $request->user()->id]);
        return response()->json([
            'temp_password' => $temp,
            'message' => 'Password reset. Share the new password securely.',
        ]);
    }

    public function securityEvents(Request $request)
    {
        $userId = $request->get('user_id');
        $type = $request->get('type');

        $query = StaffSecurityEvent::with('user')->orderByDesc('created_at');
        if ($userId) $query->where('user_id', $userId);
        if ($type)   $query->where('event_type', $type);

        return response()->json($query->paginate(50));
    }
}
