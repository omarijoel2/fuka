<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\CmsContent;
use App\Models\ProfileSubmission;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Pushes an approved staff portal submission into the CMS staff profile.
 * The linking point between the staff portal account and the CMS profile is
 * the email address. An existing profile is updated in place (preserving its
 * current workflow status, so a published profile goes live immediately on
 * reviewer approval); when no profile exists one is created as a draft for the
 * communications team to publish.
 */
class StaffProfileSync
{
    public static function syncFromSubmission(ProfileSubmission $submission, ?User $actor = null): ?CmsContent
    {
        $user = $submission->user ?: User::find($submission->user_id);
        if (!$user) {
            return null;
        }

        $pd       = $submission->profile_data ?? [];
        $personal = $pd['personal'] ?? [];
        $bio      = $pd['bio'] ?? [];
        $quals    = $pd['qualifications'] ?? [];
        $teaching = $pd['teaching'] ?? [];
        $research = $pd['research'] ?? [];
        $contact  = $pd['contact'] ?? [];
        $uploads  = $pd['uploads'] ?? [];

        // Linking point: email. Prefer the submitted contact email, fall back to the account
        // email. Normalised (trim + lowercase) so case differences never create duplicates.
        $email = strtolower(trim((string) ($contact['contact_email'] ?? '')) ?: (string) $user->email);
        if ($email === '') {
            return null;
        }

        $fullName = trim((string) ($personal['name'] ?? '')) ?: (string) ($user->name ?? '');

        // Match the public, canonical staff profile type by email (case-insensitive).
        $profile = CmsContent::where('type', 'staff_profile')
            ->where('is_deleted', false)
            ->whereRaw("lower(json_extract(structured_data, '$.email')) = ?", [$email])
            ->first();

        $isNew = !$profile;
        $sd    = $profile?->structured_data ?? [];

        // ── Identity ──
        $sd['email'] = $email;
        if ($fullName !== '') {
            [$first, $middle, $last] = self::splitName($fullName);
            $sd['first_name']  = $first;
            $sd['middle_name'] = $middle;
            $sd['last_name']   = $last;
        }
        if (!empty($personal['title'])) {
            $sd['prefix']       = $personal['title'];
            $sd['title_prefix'] = $personal['title'];
        }
        if (!empty($personal['job_title'])) {
            $sd['designation'] = $personal['job_title'];
        }
        if (array_key_exists('tagline', $bio)) {
            $sd['tagline'] = $bio['tagline'];
        }

        // ── List fields: portal stores newline text; the public profile renders arrays ──
        if (array_key_exists('research_interests', $research)) {
            $sd['research_interests'] = self::lines($research['research_interests']);
        }
        if (array_key_exists('teaching_areas', $teaching)) {
            $sd['teaching_areas'] = self::lines($teaching['teaching_areas']);
        }
        if (array_key_exists('awards', $teaching)) {
            $sd['awards'] = self::lines($teaching['awards']);
        }
        if (array_key_exists('memberships', $quals)) {
            $sd['memberships'] = self::lines($quals['memberships']);
        }
        if (array_key_exists('qualifications', $quals)) {
            $sd['qualifications'] = self::parseQualifications($quals['qualifications']);
        }
        if (array_key_exists('publications', $research)) {
            $sd['publications'] = self::parsePublications($research['publications']);
        }

        // ── Research identifiers ──
        foreach ([
            'orcid'            => 'orcid_id',
            'scopus_id'        => 'scopus_id',
            'scholar_url'      => 'google_scholar_url',
            'researchgate_url' => 'researchgate_url',
        ] as $src => $dst) {
            if (!empty($research[$src])) {
                $sd[$dst] = $research[$src];
            }
        }

        // ── Contact ──
        if (!empty($contact['office_phone'])) {
            $sd['phone'] = $contact['office_phone'];
        }
        if (!empty($contact['office_location'])) {
            $sd['office'] = $contact['office_location'];
        }
        if (!empty($contact['website'])) {
            $sd['linkedin_url'] = $contact['website'];
        }

        // ── Uploads ──
        $photo = $uploads['photo_url'] ?? null;
        if (!empty($uploads['cv_url'])) {
            $sd['cv_url'] = $uploads['cv_url'];
        }
        if (!empty($photo)) {
            $sd['photo'] = $photo;
        }

        $biography = trim((string) ($bio['biography'] ?? ''));
        if ($biography !== '') {
            $sd['biography'] = $biography;
        }

        $department = trim((string) ($personal['department'] ?? ''))
            ?: (string) ($profile?->department ?? $user->department ?? '');

        if ($isNew) {
            $profile = new CmsContent();
            $profile->type       = 'staff_profile';
            $profile->slug       = self::uniqueSlug($fullName !== '' ? $fullName : $email);
            $profile->status     = 'draft';
            $profile->is_deleted = false;
            $profile->author_id  = $actor?->id ?? $user->id;
            if (!empty($user->school_code)) {
                $profile->school_code = $user->school_code;
            }
        }

        if ($fullName !== '') {
            $profile->title = $fullName;
        }
        if ($department !== '') {
            $profile->department = $department;
        }
        if ($biography !== '') {
            $profile->body    = $biography;
            $profile->summary = Str::limit(strip_tags($biography), 280);
        }
        if (!empty($photo)) {
            $profile->featured_image = $photo;
        }
        $profile->structured_data = $sd;
        $profile->save();

        AuditLog::record(
            $actor,
            $isNew ? 'auto_created' : 'auto_synced',
            'staff_profile',
            $profile->id,
            $profile->title,
            ['source' => 'staff_portal_submission', 'submission_id' => $submission->id],
            ['email' => $email, 'status' => $profile->status],
            $isNew
                ? 'Staff profile auto-created in CMS from an approved portal submission (matched by email).'
                : 'Staff profile auto-updated in CMS from an approved portal submission (matched by email).'
        );

        return $profile;
    }

    /** Split a newline/array value into a clean list of non-empty entries. */
    private static function lines($val): array
    {
        if (is_array($val)) {
            $out = [];
            foreach ($val as $v) {
                $v = is_string($v) ? trim($v) : $v;
                if ($v !== '' && $v !== null) {
                    $out[] = $v;
                }
            }
            return array_values($out);
        }
        if (!is_string($val)) {
            return [];
        }
        $parts = preg_split('/\r\n|\r|\n/', $val) ?: [];
        return array_values(array_filter(array_map('trim', $parts), fn ($l) => $l !== ''));
    }

    /** Each line becomes {qualification, institution, year} for the public profile renderer. */
    private static function parseQualifications($val): array
    {
        $out = [];
        foreach (self::lines($val) as $line) {
            if (is_array($line)) {
                $out[] = $line;
                continue;
            }
            $year = '';
            if (preg_match('/\b(?:19|20)\d{2}\b/', $line, $m)) {
                $year = $m[0];
            }
            $clean = trim(preg_replace('/[,\s]*\b(?:19|20)\d{2}\b[,\s]*/', ' ', $line));
            $bits  = array_values(array_filter(array_map('trim', explode(',', $clean)), fn ($b) => $b !== ''));
            $out[] = [
                'qualification' => $bits[0] ?? $clean,
                'institution'   => count($bits) > 1 ? implode(', ', array_slice($bits, 1)) : '',
                'year'          => $year,
            ];
        }
        return $out;
    }

    /** Each line becomes {citation, url?} to match the public profile renderer's contract. */
    private static function parsePublications($val): array
    {
        $out = [];
        foreach (self::lines($val) as $line) {
            if (is_array($line)) {
                $out[] = $line;
                continue;
            }
            $entry = ['citation' => $line];
            if (preg_match('|https?://[^\s]+|', $line, $m)) {
                $entry['url'] = rtrim($m[0], '.,;)');
            }
            $out[] = $entry;
        }
        return $out;
    }

    /** Split a full name (after stripping any honorific) into first/middle/last. */
    private static function splitName(string $full): array
    {
        $full  = trim(preg_replace('/^(Prof\.?|Professor|Assoc\.?\s*Prof\.?|Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Rev\.?)\s+/i', '', $full));
        $parts = preg_split('/\s+/', $full, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return match (count($parts)) {
            0       => ['', '', ''],
            1       => [$parts[0], '', ''],
            2       => [$parts[0], '', $parts[1]],
            default => [array_shift($parts), implode(' ', array_slice($parts, 0, -1)), end($parts)],
        };
    }

    private static function uniqueSlug(string $base): string
    {
        $slug = Str::slug($base) ?: ('staff-' . Str::lower(Str::random(6)));
        $orig = $slug;
        $i    = 1;
        while (CmsContent::where('slug', $slug)->exists()) {
            $slug = $orig . '-' . (++$i);
        }
        return $slug;
    }
}
