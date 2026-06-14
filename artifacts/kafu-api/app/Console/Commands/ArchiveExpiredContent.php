<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CmsContent;
use App\Models\AuditLog;

class ArchiveExpiredContent extends Command
{
    protected $signature   = 'content:archive-expired {--dry-run : List items that would be archived without making changes}';
    protected $description = 'Archive published news/announcements whose expiry_date has passed and close opportunities whose deadline has passed';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $archived = $this->archiveExpiredContent($dryRun);
        $closed   = $this->closeExpiredOpportunities($dryRun);

        if ($dryRun) {
            $this->warn('Dry-run mode — no changes made.');
        }

        $this->info("Archived {$archived} news/announcement item(s); closed {$closed} expired opportunity(ies).");
        return self::SUCCESS;
    }

    /**
     * Archive published news/announcements whose expiry_date has passed.
     */
    private function archiveExpiredContent(bool $dryRun): int
    {
        $items = CmsContent::whereIn('type', ['news', 'announcement'])
            ->where('status', 'published')
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<', now())
            ->where('is_deleted', false)
            ->get();

        if ($items->isEmpty()) {
            $this->info('No expired news/announcements found.');
            return 0;
        }

        $this->info("Found {$items->count()} news/announcement item(s) to archive:");
        foreach ($items as $item) {
            $this->line("  [{$item->type}] {$item->title} (expired: {$item->expiry_date})");
        }

        if ($dryRun) {
            return 0;
        }

        $archived = 0;
        foreach ($items as $item) {
            $item->update([
                'status'      => 'archived',
                'archived_at' => now(),
            ]);

            AuditLog::record(
                null,
                'auto_archived',
                $item->type,
                $item->id,
                $item->title,
                ['status' => 'published'],
                ['status' => 'archived'],
                'Auto-archived by scheduler: expiry_date passed.'
            );

            $archived++;
        }

        return $archived;
    }

    /**
     * Close opportunities whose deadline has passed, persisting
     * structured_data.opportunity_status = 'closed'. Closed opportunities stay
     * visible in the listing (marked "Closed"); they are not hidden/archived.
     */
    private function closeExpiredOpportunities(bool $dryRun): int
    {
        // Deadline lives inside the JSON structured_data column, so filter in PHP
        // for database portability (SQLite in dev, MySQL/MariaDB in production).
        $items = CmsContent::where('type', 'opportunity')
            ->where('status', 'published')
            ->where('is_deleted', false)
            ->get()
            ->filter(function (CmsContent $item) {
                $sd       = $item->structured_data ?? [];
                $status   = $sd['opportunity_status'] ?? 'open';
                $deadline = $sd['deadline'] ?? null;
                if ($status === 'closed' || empty($deadline)) {
                    return false;
                }
                try {
                    return \Carbon\Carbon::parse($deadline)->endOfDay()->isPast();
                } catch (\Throwable $e) {
                    return false;
                }
            });

        if ($items->isEmpty()) {
            $this->info('No expired opportunities found.');
            return 0;
        }

        $this->info("Found {$items->count()} expired opportunity(ies) to close:");
        foreach ($items as $item) {
            $deadline = $item->structured_data['deadline'] ?? '';
            $this->line("  [opportunity] {$item->title} (deadline: {$deadline})");
        }

        if ($dryRun) {
            return 0;
        }

        $closed = 0;
        foreach ($items as $item) {
            $sd        = $item->structured_data ?? [];
            $oldStatus = $sd['opportunity_status'] ?? 'open';
            $sd['opportunity_status'] = 'closed';
            $item->structured_data    = $sd;
            $item->save();

            AuditLog::record(
                null,
                'auto_archived',
                'opportunity',
                $item->id,
                $item->title,
                ['opportunity_status' => $oldStatus],
                ['opportunity_status' => 'closed'],
                'Auto-closed by scheduler: deadline passed.'
            );

            $closed++;
        }

        return $closed;
    }
}
