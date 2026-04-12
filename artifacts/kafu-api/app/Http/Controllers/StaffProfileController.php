<?php

namespace App\Http\Controllers;

use App\Models\CmsContent;
use App\Models\ProfileSubmission;
use App\Models\ProfileSubmissionComment;
use App\Models\StaffConsentRecord;
use App\Models\StaffSecurityEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StaffProfileController extends Controller
{
    // Sections and their required fields for completeness calculation
    private const SECTIONS = [
        'personal'         => ['name', 'title', 'job_title', 'department'],
        'bio'              => ['biography'],
        'qualifications'   => ['qualifications'],
        'teaching'         => ['teaching_areas'],
        'research'         => ['research_interests'],
        'contact'          => ['contact_email'],
        'uploads'          => ['photo_url'],
    ];

    public function getProfile(Request $request)
    {
        $user = $request->user();
        $submission = $this->getOrCreateDraft($user);
        return response()->json([
            'submission' => $submission->load('comments.author'),
            'has_consent' => $user->hasAcceptedConsent('profile_publication'),
        ]);
    }

    public function updateSection(Request $request, string $section)
    {
        $user = $request->user();
        $allowed = array_keys(self::SECTIONS);
        if (!in_array($section, $allowed)) {
            return response()->json(['message' => 'Invalid section.'], 422);
        }

        $submission = $this->getOrCreateDraft($user);

        if (!in_array($submission->workflow_status, ['draft', 'revision_requested'])) {
            return response()->json(['message' => 'Cannot edit a submitted profile. Withdraw first.'], 422);
        }

        $profileData = $submission->profile_data ?? [];
        $profileData[$section] = $request->input('data', []);

        $sectionCompletion = $submission->section_completion ?? [];
        $sectionCompletion[$section] = $this->calculateSectionScore($section, $profileData[$section]);

        $overallScore = count($sectionCompletion) > 0
            ? (int) round(array_sum($sectionCompletion) / count(self::SECTIONS))
            : 0;

        $submission->update([
            'profile_data' => $profileData,
            'section_completion' => $sectionCompletion,
            'completeness_score' => $overallScore,
        ]);

        return response()->json(['submission' => $submission->fresh(), 'section' => $section]);
    }

    public function acceptConsent(Request $request)
    {
        $user = $request->user();
        $data = $request->validate(['policy_version' => 'string|max:20']);

        StaffConsentRecord::where('user_id', $user->id)
            ->where('consent_type', 'profile_publication')
            ->update(['is_current' => false]);

        StaffConsentRecord::create([
            'user_id'            => $user->id,
            'policy_version'     => $data['policy_version'] ?? 'v1.0',
            'consent_type'       => 'profile_publication',
            'accepted_at'        => now(),
            'accepted_ip'        => $request->ip(),
            'accepted_user_agent'=> $request->userAgent(),
            'is_current'         => true,
        ]);

        StaffSecurityEvent::log('consent_accepted', $user->id, $user->email, ['type' => 'profile_publication'], $request->ip(), $request->userAgent());

        return response()->json(['message' => 'Consent recorded.', 'has_consent' => true]);
    }

    public function submit(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAcceptedConsent('profile_publication')) {
            return response()->json(['message' => 'You must accept the publication consent before submitting.'], 422);
        }

        $submission = $this->getOrCreateDraft($user);

        if (!in_array($submission->workflow_status, ['draft', 'revision_requested'])) {
            return response()->json(['message' => 'Profile is already submitted or under review.'], 422);
        }

        if ($submission->completeness_score < 40) {
            return response()->json(['message' => 'Profile must be at least 40% complete before submitting.'], 422);
        }

        $submission->update([
            'workflow_status' => 'submitted',
            'submitted_by'    => $user->id,
            'submitted_at'    => now(),
        ]);

        StaffSecurityEvent::log('profile_submitted', $user->id, $user->email, ['submission_id' => $submission->id], $request->ip(), $request->userAgent());

        return response()->json(['submission' => $submission->fresh(), 'message' => 'Profile submitted for review.']);
    }

    public function withdraw(Request $request)
    {
        $user = $request->user();
        $submission = $this->getOrCreateDraft($user);

        if ($submission->workflow_status === 'approved' || $submission->workflow_status === 'published') {
            return response()->json(['message' => 'Cannot withdraw an approved or published profile.'], 422);
        }

        $submission->update(['workflow_status' => 'draft']);
        return response()->json(['submission' => $submission->fresh(), 'message' => 'Submission withdrawn.']);
    }

    public function getSubmissions(Request $request)
    {
        $user = $request->user();
        $submissions = ProfileSubmission::where('user_id', $user->id)
            ->with('comments.author')
            ->orderByDesc('version_number')
            ->get();
        return response()->json(['submissions' => $submissions]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:3072']);
        $path = $request->file('photo')->store('staff-photos', 'public');
        $url = '/storage/' . $path;

        $user = $request->user();
        $user->update(['avatar_url' => $url]);

        $submission = $this->getOrCreateDraft($user);
        $profileData = $submission->profile_data ?? [];
        $profileData['uploads'] = array_merge($profileData['uploads'] ?? [], ['photo_url' => $url]);
        $submission->update(['profile_data' => $profileData]);

        return response()->json(['url' => $url]);
    }

    public function uploadCv(Request $request)
    {
        $request->validate(['cv' => 'required|file|mimes:pdf|max:10240']);
        $path = $request->file('cv')->store('staff-cvs', 'public');
        $url = '/storage/' . $path;

        $user = $request->user();
        $submission = $this->getOrCreateDraft($user);
        $profileData = $submission->profile_data ?? [];
        $profileData['uploads'] = array_merge($profileData['uploads'] ?? [], ['cv_url' => $url]);
        $submission->update(['profile_data' => $profileData]);

        return response()->json(['url' => $url]);
    }

    // --- Internal helpers ---

    private function getOrCreateDraft(\App\Models\User $user): ProfileSubmission
    {
        $existing = ProfileSubmission::where('user_id', $user->id)
            ->whereNotIn('workflow_status', ['published'])
            ->orderByDesc('version_number')
            ->first();

        if ($existing) return $existing;

        return ProfileSubmission::create([
            'user_id'          => $user->id,
            'workflow_status'  => 'draft',
            'version_number'   => 1,
            'profile_data'     => [],
            'section_completion' => [],
            'completeness_score' => 0,
        ]);
    }

    private function calculateSectionScore(string $section, array $data): int
    {
        $required = self::SECTIONS[$section] ?? [];
        if (empty($required)) return 100;
        $filled = 0;
        foreach ($required as $field) {
            $val = $data[$field] ?? null;
            if (!empty($val)) $filled++;
        }
        return (int) round(($filled / count($required)) * 100);
    }
}
