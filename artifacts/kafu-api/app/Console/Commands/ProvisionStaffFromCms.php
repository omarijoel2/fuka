<?php

namespace App\Console\Commands;

use App\Models\CmsContent;
use App\Models\User;
use App\Models\StaffSecurityEvent;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ProvisionStaffFromCms extends Command
{
    protected $signature = 'staff:provision-from-cms
                            {--password=Kafu.2025 : Default password for new accounts}
                            {--force : Re-provision accounts that already exist (resets password)}
                            {--dry-run : Show what would be created without making changes}';

    protected $description = 'Create staff portal accounts for all CMS staff profiles that have an email address';

    public function handle(): int
    {
        $defaultPassword = $this->option('password');
        $force           = $this->option('force');
        $dryRun          = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('DRY RUN — no changes will be made.');
        }

        $profiles = CmsContent::where('type', 'staff')
            ->where('is_deleted', 0)
            ->whereRaw("json_extract(structured_data, '$.email') IS NOT NULL")
            ->whereRaw("json_extract(structured_data, '$.email') != ''")
            ->get();

        if ($profiles->isEmpty()) {
            $this->warn('No CMS staff profiles with email addresses found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$profiles->count()} CMS staff profile(s) with email addresses.");
        $this->newLine();

        $created  = 0;
        $skipped  = 0;
        $updated  = 0;
        $errors   = 0;

        $rows = [];

        foreach ($profiles as $cms) {
            $sd    = $cms->structured_data ?? [];
            $email = trim($sd['email'] ?? '');

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $rows[] = [$cms->title, $email, 'SKIP', 'Invalid email format'];
                $errors++;
                continue;
            }

            $existing = User::where('email', $email)->first();

            if ($existing && !$force) {
                $rows[] = [$cms->title, $email, 'SKIP', 'Account exists (use --force to reset)'];
                $skipped++;
                continue;
            }

            $name       = $cms->title ?? ($sd['first_name'] ?? '') . ' ' . ($sd['last_name'] ?? '');
            $title      = $sd['title_prefix'] ?? null;
            $jobTitle   = $sd['designation'] ?? ($sd['rank'] ?? null);
            $department = $cms->department ?? null;
            $phone      = $sd['phone'] ?? null;

            if ($dryRun) {
                $action = $existing ? 'RESET' : 'CREATE';
                $rows[] = [$cms->title, $email, $action, $defaultPassword];
                $existing ? $updated++ : $created++;
                continue;
            }

            try {
                if ($existing) {
                    $existing->update([
                        'password'               => Hash::make($defaultPassword),
                        'first_login_completed'  => false,
                        'name'                   => $name,
                        'title'                  => $title,
                        'job_title'              => $jobTitle,
                        'department'             => $department,
                        'phone'                  => $phone,
                    ]);
                    StaffSecurityEvent::log(
                        'account_provisioned',
                        $existing->id,
                        $existing->email,
                        ['provisioned_by' => 'cli:staff:provision-from-cms', 'action' => 'reset']
                    );
                    $rows[] = [$cms->title, $email, 'RESET', 'Password reset, first_login reset'];
                    $updated++;
                } else {
                    $user = User::create([
                        'name'                   => $name,
                        'email'                  => $email,
                        'password'               => Hash::make($defaultPassword),
                        'role'                   => 'staff',
                        'title'                  => $title,
                        'job_title'              => $jobTitle,
                        'department'             => $department,
                        'phone'                  => $phone,
                        'first_login_completed'  => false,
                        'failed_login_count'     => 0,
                    ]);
                    StaffSecurityEvent::log(
                        'account_provisioned',
                        $user->id,
                        $user->email,
                        ['provisioned_by' => 'cli:staff:provision-from-cms', 'action' => 'create']
                    );
                    $rows[] = [$cms->title, $email, 'CREATED', 'Default password set'];
                    $created++;
                }
            } catch (\Throwable $e) {
                $rows[] = [$cms->title, $email, 'ERROR', $e->getMessage()];
                $errors++;
            }
        }

        $this->table(['Name', 'Email', 'Status', 'Note'], $rows);
        $this->newLine();

        $label = $dryRun ? ' (dry run)' : '';
        $this->info("Done{$label}: {$created} created, {$updated} reset, {$skipped} skipped, {$errors} errors.");

        if (!$dryRun && ($created + $updated) > 0) {
            $this->newLine();
            $this->line("Default password: <comment>{$defaultPassword}</comment>");
            $this->line('All new accounts will be prompted to change their password on first login.');
        }

        return Command::SUCCESS;
    }
}
