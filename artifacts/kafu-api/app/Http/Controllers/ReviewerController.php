<?php

namespace App\Http\Controllers;

use App\Models\ProfileSubmission;
use App\Models\ProfileSubmissionComment;
use App\Models\StaffSecurityEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ReviewerController extends Controller
{
    public function queue(Request $request)
    {
        $reviewer = $request->user();
        $status = $request->get('status', 'submitted');
        $dept   = $request->get('department');

        $query = ProfileSubmission::with(['user', 'comments.author'])
            ->whereIn('workflow_status', ['submitted', 'under_review', 'revision_requested', 'approved']);

        if ($status !== 'all') {
            $query->where('workflow_status', $status);
        }

        if ($dept) {
            $query->whereHas('user', fn($q) => $q->where('department', $dept));
        }

        // Department reviewer scoped to their department
        if ($reviewer->role === 'reviewer' && $reviewer->department) {
            $query->whereHas('user', fn($q) => $q->where('department', $reviewer->department));
        }

        $submissions = $query->orderBy('submitted_at')->paginate(20);
        return response()->json($submissions);
    }

    public function show(Request $request, int $id)
    {
        $submission = ProfileSubmission::with(['user', 'comments.author', 'approvedByUser', 'reviewedByUser'])->findOrFail($id);
        return response()->json(['submission' => $submission]);
    }

    public function review(Request $request, int $id)
    {
        $submission = ProfileSubmission::findOrFail($id);

        if ($submission->workflow_status !== 'submitted') {
            return response()->json(['message' => 'Submission must be in submitted status to start review.'], 422);
        }

        $submission->update([
            'workflow_status' => 'under_review',
            'reviewed_by'     => $request->user()->id,
            'reviewed_at'     => now(),
        ]);

        return response()->json(['submission' => $submission->fresh()->load('user', 'comments.author')]);
    }

    public function approve(Request $request, int $id)
    {
        $data = $request->validate(['notes' => 'nullable|string|max:2000']);
        $submission = ProfileSubmission::with('user')->findOrFail($id);

        if (!in_array($submission->workflow_status, ['submitted', 'under_review'])) {
            return response()->json(['message' => 'Submission is not in a reviewable state.'], 422);
        }

        $submission->update([
            'workflow_status' => 'approved',
            'approved_by'     => $request->user()->id,
            'approved_at'     => now(),
            'reviewer_summary'=> $data['notes'] ?? null,
        ]);

        if ($data['notes'] ?? null) {
            ProfileSubmissionComment::create([
                'submission_id' => $submission->id,
                'author_id'     => $request->user()->id,
                'comment'       => $data['notes'],
                'comment_type'  => 'approval',
            ]);
        }

        StaffSecurityEvent::log('profile_approved', $submission->user_id, $submission->user->email,
            ['submission_id' => $id, 'reviewer_id' => $request->user()->id]);

        return response()->json(['submission' => $submission->fresh()->load('user', 'comments.author'), 'message' => 'Profile approved.']);
    }

    public function requestRevision(Request $request, int $id)
    {
        $data = $request->validate([
            'notes'   => 'required|string|max:3000',
            'section' => 'nullable|string|max:50',
        ]);

        $submission = ProfileSubmission::with('user')->findOrFail($id);

        if (!in_array($submission->workflow_status, ['submitted', 'under_review'])) {
            return response()->json(['message' => 'Submission is not in a reviewable state.'], 422);
        }

        $submission->update(['workflow_status' => 'revision_requested', 'reviewer_summary' => $data['notes']]);

        ProfileSubmissionComment::create([
            'submission_id' => $submission->id,
            'author_id'     => $request->user()->id,
            'section'       => $data['section'] ?? null,
            'comment'       => $data['notes'],
            'comment_type'  => 'revision_request',
        ]);

        StaffSecurityEvent::log('revision_requested', $submission->user_id, $submission->user->email,
            ['submission_id' => $id, 'reviewer_id' => $request->user()->id]);

        return response()->json(['submission' => $submission->fresh()->load('user', 'comments.author'), 'message' => 'Revision requested.']);
    }

    public function reject(Request $request, int $id)
    {
        $data = $request->validate(['notes' => 'required|string|max:2000']);
        $submission = ProfileSubmission::with('user')->findOrFail($id);

        $submission->update(['workflow_status' => 'draft', 'reviewer_summary' => $data['notes']]);

        ProfileSubmissionComment::create([
            'submission_id' => $submission->id,
            'author_id'     => $request->user()->id,
            'comment'       => $data['notes'],
            'comment_type'  => 'rejection',
        ]);

        StaffSecurityEvent::log('profile_rejected', $submission->user_id, $submission->user->email,
            ['submission_id' => $id]);

        return response()->json(['submission' => $submission->fresh()->load('user', 'comments.author'), 'message' => 'Submission rejected.']);
    }

    public function addComment(Request $request, int $id)
    {
        $data = $request->validate([
            'comment'      => 'required|string|max:3000',
            'section'      => 'nullable|string|max:50',
            'comment_type' => 'nullable|in:note,revision_request,approval,rejection',
        ]);

        $submission = ProfileSubmission::findOrFail($id);

        $comment = ProfileSubmissionComment::create([
            'submission_id' => $submission->id,
            'author_id'     => $request->user()->id,
            'section'       => $data['section'] ?? null,
            'comment'       => $data['comment'],
            'comment_type'  => $data['comment_type'] ?? 'note',
        ]);

        return response()->json(['comment' => $comment->load('author')]);
    }

    // ─── Staff Profile CRUD (reviewer full access) ────────────────────────────

    private const PROFILE_SECTIONS = [
        'personal'       => ['name', 'title', 'job_title', 'department'],
        'bio'            => ['biography'],
        'qualifications' => ['qualifications'],
        'teaching'       => ['teaching_areas'],
        'research'       => ['research_interests'],
        'contact'        => ['contact_email'],
        'uploads'        => ['photo_url'],
    ];

    public function staffIndex(Request $request)
    {
        $query = User::where('role', 'staff_user')->orderBy('name');

        if ($s = $request->get('search')) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%$s%")
                ->orWhere('email', 'like', "%$s%")
                ->orWhere('department', 'like', "%$s%")
                ->orWhere('staff_number', 'like', "%$s%")
            );
        }
        if ($dept = $request->get('department')) {
            $query->where('department', $dept);
        }
        if ($status = $request->get('status')) {
            if ($status === 'no_profile') {
                $query->doesntHave('profileSubmissions');
            } else {
                $query->whereHas('profileSubmissions', fn ($q) => $q->where('workflow_status', $status));
            }
        }
        if ($accountStatus = $request->get('account_status')) {
            $query->where('status', $accountStatus);
        }

        $users = $query->paginate(40);

        // Batch-load latest submission per user (avoids N+1)
        $userIds = $users->pluck('id');
        $latestSubIds = ProfileSubmission::selectRaw('MAX(id) as id, user_id')
            ->whereIn('user_id', $userIds)
            ->groupBy('user_id')
            ->pluck('id');

        $submissionsMap = ProfileSubmission::whereIn('id', $latestSubIds)
            ->get(['id', 'user_id', 'workflow_status', 'completeness_score', 'submitted_at', 'updated_at'])
            ->keyBy('user_id');

        $users->getCollection()->transform(function ($user) use ($submissionsMap) {
            $sub = $submissionsMap->get($user->id);
            $arr = $user->only([
                'id', 'name', 'email', 'title', 'job_title', 'department',
                'staff_number', 'status', 'role', 'school_code',
            ]);
            $arr['submission'] = $sub ? [
                'id'                 => $sub->id,
                'workflow_status'    => $sub->workflow_status,
                'completeness_score' => $sub->completeness_score,
                'submitted_at'       => $sub->submitted_at,
                'updated_at'         => $sub->updated_at,
            ] : null;
            return $arr;
        });

        // Return distinct department list alongside
        $departments = User::where('role', 'staff_user')
            ->whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->sort()
            ->values();

        return response()->json([
            'staff'       => $users,
            'departments' => $departments,
        ]);
    }

    public function staffShow(int $id)
    {
        $user = User::findOrFail($id);
        $submission = ProfileSubmission::where('user_id', $id)
            ->orderByDesc('version_number')
            ->with(['comments.author'])
            ->first();

        return response()->json([
            'user'       => $user,
            'submission' => $submission,
        ]);
    }

    public function staffUpdateSection(Request $request, int $id, string $section)
    {
        if (!array_key_exists($section, self::PROFILE_SECTIONS)) {
            return response()->json(['message' => 'Invalid section.'], 422);
        }

        $user = User::findOrFail($id);
        $data = $request->validate(['data' => 'required|array']);

        $submission = ProfileSubmission::firstOrCreate(
            ['user_id' => $id],
            [
                'workflow_status'    => 'draft',
                'profile_data'       => [],
                'section_completion' => [],
                'completeness_score' => 0,
                'version_number'     => 1,
            ]
        );

        $profileData = $submission->profile_data ?? [];
        $profileData[$section] = array_merge($profileData[$section] ?? [], $data['data']);

        // Recalculate completeness
        $sectionCompletion = [];
        foreach (self::PROFILE_SECTIONS as $sec => $required) {
            $secData = $profileData[$sec] ?? [];
            $filled  = count(array_filter($required, fn ($f) => !empty($secData[$f])));
            $sectionCompletion[$sec] = count($required)
                ? (int) round(($filled / count($required)) * 100)
                : 0;
        }
        $overallScore = count(self::PROFILE_SECTIONS)
            ? (int) round(array_sum($sectionCompletion) / count(self::PROFILE_SECTIONS))
            : 0;

        $submission->update([
            'profile_data'       => $profileData,
            'section_completion' => $sectionCompletion,
            'completeness_score' => $overallScore,
        ]);

        StaffSecurityEvent::log('profile_edited_by_reviewer', $id, $user->email, [
            'section'     => $section,
            'reviewer_id' => $request->user()->id,
        ]);

        return response()->json(['submission' => $submission->fresh()]);
    }

    public function staffProvision(Request $request)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email',
            'staff_number'   => 'nullable|string|max:50|unique:users,staff_number',
            'payroll_number' => 'nullable|string|max:50',
            'title'          => 'nullable|string|max:20',
            'job_title'      => 'nullable|string|max:150',
            'department'     => 'nullable|string|max:150',
            'school_code'    => 'nullable|string|max:20',
        ]);

        $tempPassword = ucfirst(Str::random(8)) . Str::random(4) . '!';

        $user = User::create([
            ...$data,
            'password'              => Hash::make($tempPassword),
            'role'                  => 'staff_user',
            'status'                => 'active',
            'must_change_password'  => true,
            'first_login_completed' => false,
            'failed_login_count'    => 0,
        ]);

        StaffSecurityEvent::log('account_provisioned', $user->id, $user->email, [
            'provisioned_by' => $request->user()->id,
        ]);

        return response()->json([
            'user'          => $user,
            'temp_password' => $tempPassword,
            'message'       => 'Staff account created.',
        ], 201);
    }

    public function staffUploadCv(Request $request, int $id)
    {
        $request->validate(['cv' => 'required|file|mimes:pdf|max:10240']);
        $user = User::findOrFail($id);

        $path = $request->file('cv')->store('staff-cvs', 'public');
        $url  = \Illuminate\Support\Facades\Storage::disk('public')->url($path);

        $submission = ProfileSubmission::firstOrCreate(
            ['user_id' => $id],
            [
                'workflow_status'    => 'draft',
                'profile_data'       => [],
                'section_completion' => [],
                'completeness_score' => 0,
                'version_number'     => 1,
            ]
        );

        $profileData                     = $submission->profile_data ?? [];
        $profileData['uploads']          = array_merge($profileData['uploads'] ?? [], ['cv_url' => $url]);
        $submission->update(['profile_data' => $profileData]);

        StaffSecurityEvent::log('cv_uploaded_by_reviewer', $id, $user->email, [
            'reviewer_id' => $request->user()->id,
        ]);

        return response()->json(['url' => $url]);
    }

    public function staffUploadPhoto(Request $request, int $id)
    {
        $request->validate(['photo' => 'required|image|max:3072']);
        $user = User::findOrFail($id);

        $path = $request->file('photo')->store('staff-photos', 'public');
        $url  = \Illuminate\Support\Facades\Storage::disk('public')->url($path);

        $user->update(['avatar_url' => $url]);

        $submission = ProfileSubmission::firstOrCreate(
            ['user_id' => $id],
            [
                'workflow_status'    => 'draft',
                'profile_data'       => [],
                'section_completion' => [],
                'completeness_score' => 0,
                'version_number'     => 1,
            ]
        );

        $profileData                     = $submission->profile_data ?? [];
        $profileData['uploads']          = array_merge($profileData['uploads'] ?? [], ['photo_url' => $url]);
        $submission->update(['profile_data' => $profileData]);

        StaffSecurityEvent::log('photo_uploaded_by_reviewer', $id, $user->email, [
            'reviewer_id' => $request->user()->id,
        ]);

        return response()->json(['url' => $url]);
    }

    public function staffDeactivate(int $id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'inactive']);
        return response()->json(['message' => 'Account deactivated.', 'user' => $user->fresh()]);
    }

    public function staffReactivate(int $id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'active']);
        return response()->json(['message' => 'Account reactivated.', 'user' => $user->fresh()]);
    }
}
