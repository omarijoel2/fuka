<?php

namespace App\Http\Controllers;

use App\Models\CmsContent;
use App\Models\ProfileSubmission;
use App\Models\ProfileSubmissionComment;
use App\Models\StaffConsentRecord;
use App\Models\StaffSecurityEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

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

    public function extractCv(Request $request)
    {
        $request->validate(['cv' => 'required|file|mimes:pdf|max:10240']);

        // Extract raw text from PDF
        $pdfFile = $request->file('cv');
        $text = '';
        try {
            $parser = new \Smalot\PdfParser\Parser();
            $pdf    = $parser->parseFile($pdfFile->getRealPath());
            $text   = $pdf->getText();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not read PDF: ' . $e->getMessage()], 422);
        }

        if (strlen(trim($text)) < 50) {
            return response()->json(['error' => 'PDF appears to be image-based or empty. Please supply a text-based PDF.'], 422);
        }

        // Truncate to avoid exceeding token limits (~12 000 chars ≈ 3 000 tokens)
        $textSnippet = mb_substr($text, 0, 12000);

        $baseUrl = env('AI_INTEGRATIONS_OPENAI_BASE_URL');
        $apiKey  = env('AI_INTEGRATIONS_OPENAI_API_KEY');

        if (!$baseUrl || !$apiKey) {
            return response()->json(['error' => 'AI extraction service not configured.'], 503);
        }

        $systemPrompt = <<<PROMPT
You are a CV parser for a Kenyan university staff profile system. Extract structured information from the provided CV text.

Return ONLY valid JSON with these exact keys (omit keys you cannot find):
{
  "personal": {
    "title": "Dr./Prof./Mr./Mrs./Ms./Rev.",
    "name": "Full name",
    "job_title": "Current designation at the university",
    "department": "Department or School name",
    "staff_number": "Staff/Employee ID if present"
  },
  "bio": {
    "biography": "Professional biography paragraph (200-400 words, third person)",
    "tagline": "One-line professional tagline"
  },
  "qualifications": {
    "qualifications": "Academic qualifications, one per line, format: Degree — Institution, Year",
    "certifications": "Professional certifications or short courses, one per line",
    "memberships": "Professional body memberships, one per line"
  },
  "teaching": {
    "teaching_areas": "Teaching subjects/areas, one per line",
    "supervision": "Postgraduate supervision summary",
    "awards": "Academic awards and recognition, one per line"
  },
  "research": {
    "research_interests": "Research interest areas, one per line",
    "publications": "Selected publications in APA format, one per line (max 10)",
    "orcid": "ORCID iD if present (format: 0000-0000-0000-0000)",
    "scopus_id": "Scopus Author ID if present (numeric string, e.g. 57218934765)",
    "scholar_url": "Google Scholar URL if present",
    "researchgate_url": "ResearchGate URL if present"
  },
  "contact": {
    "contact_email": "Institutional email address",
    "office_phone": "Office phone number",
    "office_location": "Office building and room number",
    "website": "Personal or institutional website URL"
  }
}

Do not include markdown fences. Return only the JSON object.
PROMPT;

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ])->timeout(60)->post(rtrim($baseUrl, '/') . '/chat/completions', [
                'model'                => 'gpt-5-mini',
                'max_completion_tokens' => 2048,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user',   'content' => "Here is the CV text:\n\n" . $textSnippet],
                ],
            ]);

            if (!$response->successful()) {
                return response()->json(['error' => 'AI service error: ' . $response->status()], 502);
            }

            $content = $response->json('choices.0.message.content', '');
            // Strip any accidental markdown fences
            $content = preg_replace('/^```json\s*/i', '', trim($content));
            $content = preg_replace('/```\s*$/', '', $content);

            $extracted = json_decode($content, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['error' => 'AI returned invalid JSON.', 'raw' => $content], 502);
            }

            return response()->json(['extracted' => $extracted]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Extraction failed: ' . $e->getMessage()], 500);
        }
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
