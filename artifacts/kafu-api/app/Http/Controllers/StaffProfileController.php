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
        $user       = $request->user();
        $cmsProfile = $this->findCmsProfile($user);
        $submission = $this->getOrCreateDraft($user, $cmsProfile);

        return response()->json([
            'submission'  => $submission->load('comments.author'),
            'has_consent' => $user->hasAcceptedConsent('profile_publication'),
            'cms_source'  => $cmsProfile ? [
                'id'   => $cmsProfile->id,
                'name' => $cmsProfile->title,
                'slug' => $cmsProfile->slug,
            ] : null,
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
            'profile_data'       => $profileData,
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
            'user_id'             => $user->id,
            'policy_version'      => $data['policy_version'] ?? 'v1.0',
            'consent_type'        => 'profile_publication',
            'accepted_at'         => now(),
            'accepted_ip'         => $request->ip(),
            'accepted_user_agent' => $request->userAgent(),
            'is_current'          => true,
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
        $url  = Storage::disk('public')->url($path);

        $user = $request->user();
        $user->update(['avatar_url' => $url]);

        $submission  = $this->getOrCreateDraft($user);
        $profileData = $submission->profile_data ?? [];
        $profileData['uploads'] = array_merge($profileData['uploads'] ?? [], ['photo_url' => $url]);
        $submission->update(['profile_data' => $profileData]);

        return response()->json(['url' => $url]);
    }

    public function uploadCv(Request $request)
    {
        $request->validate(['cv' => 'required|file|mimes:pdf|max:10240']);
        $path = $request->file('cv')->store('staff-cvs', 'public');
        $url  = Storage::disk('public')->url($path);

        $user        = $request->user();
        $submission  = $this->getOrCreateDraft($user);
        $profileData = $submission->profile_data ?? [];
        $profileData['uploads'] = array_merge($profileData['uploads'] ?? [], ['cv_url' => $url]);
        $submission->update(['profile_data' => $profileData]);

        return response()->json(['url' => $url]);
    }

    public function extractCv(Request $request)
    {
        $request->validate(['cv' => 'required|file|mimes:pdf|max:10240']);

        $pdfFile = $request->file('cv');
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

        $extracted = $this->parseTextCv($text);
        return response()->json(['extracted' => $extracted]);
    }

    // ─── CMS profile lookup ──────────────────────────────────────────────────

    private function findCmsProfile(\App\Models\User $user): ?CmsContent
    {
        return CmsContent::where('type', 'staff_profile')
            ->where('is_deleted', 0)
            ->whereRaw("lower(json_extract(structured_data, '$.email')) = ?", [strtolower((string) $user->email)])
            ->first();
    }

    private function buildProfileDataFromCms(CmsContent $cms, \App\Models\User $user): array
    {
        $sd = $cms->structured_data ?? [];

        // Convert arrays/objects to readable text
        $toText = function ($val): string {
            if (is_null($val) || $val === '' || $val === []) return '';
            if (is_string($val)) return trim($val);
            if (is_array($val)) {
                $lines = [];
                foreach ($val as $item) {
                    if (is_string($item)) {
                        $lines[] = trim($item);
                    } elseif (is_array($item)) {
                        // Qualification-style object: degree, field, institution, year
                        $parts = array_filter([
                            $item['degree']      ?? ($item['award'] ?? ''),
                            $item['field']       ?? ($item['specialization'] ?? ''),
                            $item['institution'] ?? ($item['university'] ?? ''),
                            $item['year']        ?? ($item['completion_year'] ?? ''),
                        ], fn($v) => $v !== '' && $v !== null);
                        if ($parts) $lines[] = implode(', ', $parts);
                    }
                }
                return implode("\n", array_filter($lines));
            }
            return '';
        };

        // Supervision: may be {masters_count, phd_count, current_students[]}
        $supervisionRaw = $sd['supervision'] ?? [];
        if (is_array($supervisionRaw) && array_key_exists('masters_count', $supervisionRaw)) {
            $supParts = [];
            if (($supervisionRaw['masters_count'] ?? 0) > 0) {
                $supParts[] = "Masters students: {$supervisionRaw['masters_count']}";
            }
            if (($supervisionRaw['phd_count'] ?? 0) > 0) {
                $supParts[] = "PhD students: {$supervisionRaw['phd_count']}";
            }
            if (!empty($supervisionRaw['current_students'])) {
                $supParts[] = implode("\n", (array) $supervisionRaw['current_students']);
            }
            $supervisionText = implode("\n", $supParts);
        } else {
            $supervisionText = $toText($supervisionRaw);
        }

        // Publications: may be structured objects
        $pubsRaw = $sd['publications'] ?? [];
        if (is_array($pubsRaw) && !empty($pubsRaw) && is_array($pubsRaw[0] ?? null)) {
            $pubLines = [];
            foreach ($pubsRaw as $pub) {
                $parts = array_filter([
                    $pub['authors']      ?? '',
                    $pub['year']         ?? '',
                    $pub['title']        ?? '',
                    $pub['journal']      ?? ($pub['journal_name'] ?? ''),
                ], fn($v) => $v !== '' && $v !== null);
                if ($parts) $pubLines[] = implode('. ', $parts);
            }
            $pubsText = implode("\n", $pubLines);
        } else {
            $pubsText = $toText($pubsRaw);
        }

        $profile = [
            'personal' => [
                'title'        => $sd['title_prefix'] ?? ($sd['prefix'] ?? ($user->title ?? '')),
                'name'         => $cms->title ?? ($user->name ?? ''),
                'job_title'    => $sd['designation'] ?? ($sd['rank'] ?? ($user->job_title ?? '')),
                'department'   => $cms->department ?? ($user->department ?? ''),
                'staff_number' => $user->staff_number ?? '',
            ],
            'bio' => [
                'biography' => $cms->body ?: ($cms->summary ?? ''),
                'tagline'   => $sd['tagline'] ?? '',
            ],
            'qualifications' => [
                'qualifications' => $toText($sd['qualifications'] ?? []),
                'certifications' => $toText($sd['certifications'] ?? []),
                'memberships'    => $toText($sd['memberships'] ?? []),
            ],
            'teaching' => [
                'teaching_areas' => $toText($sd['teaching_areas'] ?? []),
                'supervision'    => $supervisionText,
                'awards'         => $toText($sd['awards'] ?? []),
            ],
            'research' => [
                'research_interests' => $toText($sd['research_interests'] ?? ($sd['specializations'] ?? [])),
                'publications'       => $pubsText,
                'orcid'              => $sd['orcid_id'] ?? ($sd['personal']['orcid'] ?? ''),
                'scopus_id'          => $sd['scopus_id'] ?? ($sd['research']['scopus_id'] ?? ''),
                'scholar_url'        => $sd['google_scholar_url'] ?? ($sd['research']['scholar_url'] ?? ''),
                'researchgate_url'   => $sd['researchgate_url'] ?? ($sd['research']['researchgate_url'] ?? ''),
            ],
            'contact' => [
                'contact_email'   => $sd['email'] ?? $user->email,
                'office_phone'    => $sd['phone'] ?? ($sd['office_phone'] ?? ''),
                'office_location' => $sd['office'] ?? ($sd['office_location'] ?? ''),
                'website'         => $sd['linkedin_url'] ?? ($sd['website'] ?? ''),
            ],
            'uploads' => [
                'photo_url' => $cms->featured_image ?: ($sd['photo'] ?? ''),
                'cv_url'    => $sd['cv_url'] ?? '',
            ],
        ];

        // Strip blank strings from each section
        foreach ($profile as $sec => &$fields) {
            $fields = array_filter($fields, fn($v) => $v !== '' && $v !== null);
        }
        unset($fields);

        return array_filter($profile, fn($v) => !empty($v));
    }

    // ─── Internal helpers ────────────────────────────────────────────────────

    private function getOrCreateDraft(\App\Models\User $user, ?CmsContent $cmsProfile = null): ProfileSubmission
    {
        $existing = ProfileSubmission::where('user_id', $user->id)
            ->whereNotIn('workflow_status', ['published'])
            ->orderByDesc('version_number')
            ->first();

        if ($existing) return $existing;

        // Pre-populate from CMS if a linked profile was found
        $profileData       = $cmsProfile ? $this->buildProfileDataFromCms($cmsProfile, $user) : [];
        $sectionCompletion = [];

        if (!empty($profileData)) {
            foreach (array_keys(self::SECTIONS) as $sec) {
                if (!empty($profileData[$sec])) {
                    $sectionCompletion[$sec] = $this->calculateSectionScore($sec, $profileData[$sec]);
                }
            }
        }

        $overallScore = count($sectionCompletion) > 0
            ? (int) round(array_sum($sectionCompletion) / count(self::SECTIONS))
            : 0;

        return ProfileSubmission::create([
            'user_id'            => $user->id,
            'workflow_status'    => 'draft',
            'version_number'     => 1,
            'profile_data'       => $profileData,
            'section_completion' => $sectionCompletion,
            'completeness_score' => $overallScore,
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

    // ─── Rule-based CV parser ────────────────────────────────────────────────

    private function parseTextCv(string $rawText): array
    {
        $text  = str_replace(["\r\n", "\r"], "\n", $rawText);
        $lines = explode("\n", $text);
        $lines = array_map('trim', $lines);

        $full     = implode(' ', $lines);
        $nonEmpty = array_values(array_filter($lines, fn($l) => strlen($l) > 1));

        $result = [
            'personal'       => [],
            'bio'            => [],
            'qualifications' => [],
            'teaching'       => [],
            'research'       => [],
            'contact'        => [],
        ];

        // ── Regex extractions (whole-document) ────────────────────────────

        if (preg_match('/[\w.+\-]+@[\w\-]+(?:\.[\w\-]+)+/i', $full, $m)) {
            $result['contact']['contact_email'] = $m[0];
        }

        if (preg_match('/(?:\+?254|0)[17]\d{8}/', $full, $m)) {
            $result['contact']['office_phone'] = $m[0];
        }

        if (preg_match('/\b(\d{4}-\d{4}-\d{4}-\d{3}[\dX])\b/', $full, $m)) {
            $result['research']['orcid'] = $m[1];
        }

        if (preg_match('/[Ss]copus\s+(?:[Aa]uthor\s+)?ID[:\s#]*(\d{8,})/i', $full, $m)) {
            $result['research']['scopus_id'] = $m[1];
        }

        if (preg_match('|https?://scholar\.google\.com/citations\?[^\s,"\'<>]+|i', $full, $m)) {
            $result['research']['scholar_url'] = rtrim($m[0], '.,;)');
        }

        if (preg_match('|https?://(?:www\.)?researchgate\.net/profile/[^\s,"\'<>]+|i', $full, $m)) {
            $result['research']['researchgate_url'] = rtrim($m[0], '.,;)');
        }

        if (preg_match('|https?://(?:www\.)?linkedin\.com/in/[^\s,"\'<>]+|i', $full, $m)) {
            $result['contact']['website'] = rtrim($m[0], '.,;)');
        }

        // ── Name & title ──────────────────────────────────────────────────
        $headLines = array_slice($nonEmpty, 0, 20);
        $titleRx   = '(Prof\.?|Professor|Assoc\.\s*Prof\.?|Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Rev\.?)';
        $nameRx    = '([A-Z][a-zA-Z\'\-]+(?:\s+[A-Z][a-zA-Z\'\-]+){1,4})';

        foreach ($headLines as $line) {
            if (preg_match("/^{$titleRx}\s+{$nameRx}/", $line, $m)) {
                $result['personal']['title'] = rtrim($m[1], '.') . '.';
                $result['personal']['name']  = trim($m[1] . ' ' . $m[2]);
                break;
            }
        }
        if (empty($result['personal']['name'])) {
            foreach (array_slice($headLines, 0, 5) as $line) {
                $wc = str_word_count($line);
                if ($wc >= 2 && $wc <= 5 && preg_match("/^{$nameRx}$/", $line, $m)) {
                    $result['personal']['name'] = $m[1];
                    break;
                }
            }
        }
        if (empty($result['personal']['title'])) {
            foreach ($headLines as $line) {
                if (preg_match("/\b{$titleRx}\b/", $line, $m)) {
                    $result['personal']['title'] = rtrim($m[1], '.') . '.';
                    break;
                }
            }
        }

        // ── Job title ─────────────────────────────────────────────────────
        $desigRx = '/\b(Vice[\s\-]Chancellor|Deputy\s+Vice[\s\-]Chancellor|Registrar|Dean|Director|Professor|Associate\s+Professor|Senior\s+Lecturer|Lecturer|Tutorial\s+Fellow|Assistant\s+Lecturer)\b/i';
        foreach ($headLines as $line) {
            if (preg_match($desigRx, $line, $m)) {
                $result['personal']['job_title'] = $m[0];
                break;
            }
        }

        // ── Department ────────────────────────────────────────────────────
        if (preg_match('/\bDepartment\s+of\s+([A-Z][^\n,;]{3,60})/i', implode(' ', $headLines), $m)) {
            $result['personal']['department'] = 'Department of ' . trim($m[1]);
        } elseif (preg_match('/\bSchool\s+of\s+([A-Z][^\n,;]{3,60})/i', implode(' ', $headLines), $m)) {
            $result['personal']['department'] = 'School of ' . trim($m[1]);
        }

        // ── Section blocks ────────────────────────────────────────────────
        $sectionHeaders = [
            'education'      => '/^(?:education|qualifications?|academic\s+(?:background|qualifications?)|degrees?\s+(?:held|obtained))/i',
            'research'       => '/^(?:research\s+interests?|areas?\s+of\s+(?:interest|research|specialization)|research\s+focus|research\s+areas?)/i',
            'publications'   => '/^(?:publications?|selected\s+publications?|journal\s+articles?|books?\s+(?:&\s+)?chapters?|scholarly\s+works?|refereed\s+publications?)/i',
            'teaching'       => '/^(?:teaching|courses?\s+taught|teaching\s+(?:areas?|experience|responsibilities)|subjects?\s+taught|units?\s+taught)/i',
            'experience'     => '/^(?:(?:work\s+)?experience|employment(?:\s+history)?|professional\s+background|career\s+(?:history|summary))/i',
            'awards'         => '/^(?:awards?|honors?|honours?|recognition|achievements?|scholarships?\s+(?:and\s+)?awards?)/i',
            'memberships'    => '/^(?:memberships?|professional\s+(?:bodies|memberships?|affiliations?)|associations?|affiliations?)/i',
            'summary'        => '/^(?:profile\s+summary|professional\s+summary|executive\s+summary|about\s+me|biography|professional\s+profile|career\s+objective)/i',
            'certifications' => '/^(?:certifications?|professional\s+certifications?|short\s+courses?|training)/i',
        ];

        $sectionMap = [];
        foreach ($lines as $i => $line) {
            if (strlen($line) > 1 && strlen($line) < 80) {
                foreach ($sectionHeaders as $key => $rx) {
                    if (preg_match($rx, $line)) {
                        $sectionMap[$i] = $key;
                        break;
                    }
                }
            }
        }

        $sectionLineIdxs = array_keys($sectionMap);
        $totalLines      = count($lines);

        foreach ($sectionLineIdxs as $pos => $startIdx) {
            $sectionKey = $sectionMap[$startIdx];
            $endIdx     = isset($sectionLineIdxs[$pos + 1]) ? $sectionLineIdxs[$pos + 1] : $totalLines;
            $block      = array_slice($lines, $startIdx + 1, $endIdx - $startIdx - 1);
            $block      = array_values(array_filter($block, fn($l) => strlen(trim($l)) > 0));

            switch ($sectionKey) {
                case 'education':
                    $quals = [];
                    foreach ($block as $line) {
                        if (preg_match('/\b(PhD|Ph\.D\.?|DPhil|MD|MSc|M\.Sc\.?|MBA|MA\b|MEd|MPhil|BSc|B\.Sc\.?|BA\b|BEd|LLB|PGDip|Diploma|Certificate)/i', $line)) {
                            $quals[] = $line;
                        }
                    }
                    $picked = $quals ?: array_slice($block, 0, 10);
                    if ($picked) $result['qualifications']['qualifications'] = implode("\n", $picked);
                    break;

                case 'research':
                    $interests = array_filter(
                        array_slice($block, 0, 20),
                        fn($l) => strlen($l) < 120 && !preg_match('/\(\d{4}\)/', $l)
                    );
                    if ($interests) $result['research']['research_interests'] = implode("\n", array_values($interests));
                    break;

                case 'publications':
                    $pubs = [];
                    foreach ($block as $line) {
                        if (strlen($line) > 40 && (
                            preg_match('/\(\d{4}\)\.?/', $line) ||
                            preg_match('/\b(?:Journal|Vol\.|pp\.|doi:|ISBN|https?:)/i', $line) ||
                            strlen($line) > 80
                        )) {
                            $pubs[] = $line;
                        }
                    }
                    if ($pubs) $result['research']['publications'] = implode("\n", array_slice($pubs, 0, 15));
                    break;

                case 'teaching':
                    $areas = array_filter($block, fn($l) => strlen($l) > 3 && strlen($l) < 120);
                    if ($areas) $result['teaching']['teaching_areas'] = implode("\n", array_slice(array_values($areas), 0, 15));
                    break;

                case 'awards':
                    if ($block) $result['teaching']['awards'] = implode("\n", array_slice($block, 0, 10));
                    break;

                case 'memberships':
                    if ($block) $result['qualifications']['memberships'] = implode("\n", array_slice($block, 0, 10));
                    break;

                case 'certifications':
                    if ($block) $result['qualifications']['certifications'] = implode("\n", array_slice($block, 0, 10));
                    break;

                case 'summary':
                    $bio = trim(implode(' ', array_slice($block, 0, 10)));
                    if (strlen($bio) > 50) $result['bio']['biography'] = $bio;
                    break;

                case 'experience':
                    if (empty($result['personal']['job_title']) && !empty($block[0])) {
                        if (preg_match($desigRx, $block[0], $m)) {
                            $result['personal']['job_title'] = $m[0];
                        }
                    }
                    break;
            }
        }

        foreach ($result as $section => $fields) {
            $result[$section] = array_filter((array) $fields, fn($v) => !empty(trim((string) $v)));
        }
        return array_filter($result, fn($v) => !empty($v));
    }
}
