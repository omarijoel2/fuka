<?php

namespace Database\Seeders;

use App\Models\CmsContent;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Provisions login accounts so each school can manage its own content and each
 * staff member can update their own profile via the staff portal.
 *
 *  - One school content-editor account per school (role academic_owner, scoped
 *    by school_code). These own/author their school's content and submit it for
 *    review.
 *  - One staff_user portal account per staff profile that has an email. The
 *    staff portal links a User to its cms_content profile by matching the email
 *    inside the profile's structured_data, so the email must match exactly.
 *
 * All accounts are created with first_login_completed = false, which forces the
 * onboarding password change on first login. The seeded password is a temporary
 * default only — it is unusable until the holder completes onboarding.
 *
 * Idempotent: firstOrCreate keyed on email; safe to re-run.
 */
class AccountProvisioningSeeder extends Seeder
{
    private const TEMP_PASSWORD = 'KafuTemp@2026';

    public function run(): void
    {
        $this->backfillStaffSchoolCodes();
        $this->provisionSchoolEditors();
        $this->provisionStaffPortalAccounts();
    }

    /**
     * Backfill blank school_code on staff profiles by inferring from department,
     * so school editors and grouping see a complete picture. Only fills blanks.
     */
    private function backfillStaffSchoolCodes(): void
    {
        $map = [
            'SESS' => ['education', 'social science', 'curriculum', 'instruction', 'psychology', 'humanities'],
            'SBE'  => ['business', 'economics', 'commerce', 'accounting', 'finance', 'management'],
            'SCIT' => ['computing', 'information technology', 'computer science', 'ict', 'informatics'],
            'SOS'  => ['science', 'biological', 'physical', 'mathematics', 'chemistry', 'physics', 'biology', 'technology'],
            'SHS'  => ['health', 'nursing', 'public health', 'medicine', 'clinical'],
        ];

        $profiles = CmsContent::whereIn('type', ['staff', 'staff_profile'])
            ->where(function ($q) {
                $q->whereNull('school_code')->orWhere('school_code', '');
            })
            ->get(['id', 'department', 'school_code']);

        $filled = 0;
        foreach ($profiles as $p) {
            $dept = strtolower((string) $p->department);
            if ($dept === '') {
                continue;
            }
            foreach ($map as $code => $keywords) {
                foreach ($keywords as $kw) {
                    if (str_contains($dept, $kw)) {
                        $p->school_code = $code;
                        $p->save();
                        $filled++;
                        continue 3;
                    }
                }
            }
        }
        $this->command?->info("Backfilled school_code on {$filled} staff profiles.");
    }

    private function provisionSchoolEditors(): void
    {
        $schools = CmsContent::where('type', 'school')->get(['title', 'slug', 'school_code']);
        $created = 0;
        foreach ($schools as $school) {
            $code = $school->school_code ?: strtoupper($school->slug);
            $email = strtolower($school->slug) . '.editor@kafu.ac.ke';

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name'                  => $school->title . ' Content Editor',
                    'password'              => Hash::make(self::TEMP_PASSWORD),
                    'role'                  => 'academic_owner',
                    'school_code'           => $code,
                    'department'            => $school->title,
                    'job_title'             => 'School Content Editor',
                    'status'                => 'active',
                    'first_login_completed' => false,
                ]
            );
            if ($user->wasRecentlyCreated) {
                $created++;
            }
        }
        $this->command?->info("School editor accounts: {$created} created (" . $schools->count() . ' schools).');
    }

    private function provisionStaffPortalAccounts(): void
    {
        $profiles = CmsContent::whereIn('type', ['staff', 'staff_profile'])
            ->whereNotNull('structured_data')
            ->get(['id', 'title', 'department', 'school_code', 'structured_data']);

        $created = 0;
        $skipped = 0;
        foreach ($profiles as $profile) {
            $data = $profile->structured_data;
            if (is_string($data)) {
                $data = json_decode($data, true) ?: [];
            }
            $email = isset($data['email']) ? trim(strtolower($data['email'])) : '';

            if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $skipped++;
                continue;
            }

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name'                  => $profile->title,
                    'password'              => Hash::make(self::TEMP_PASSWORD),
                    'role'                  => 'staff_user',
                    'school_code'           => $profile->school_code ?: null,
                    'department'            => $profile->department ?: ($data['department'] ?? null),
                    'title'                 => $data['title_prefix'] ?? $data['prefix'] ?? null,
                    'job_title'             => $data['designation'] ?? $data['rank'] ?? null,
                    'status'                => 'active',
                    'first_login_completed' => false,
                ]
            );
            if ($user->wasRecentlyCreated) {
                $created++;
            }
        }
        $this->command?->info("Staff portal accounts: {$created} created, {$skipped} skipped (no valid email).");
    }
}
