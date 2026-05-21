<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CmsContent;
use App\Models\AuditLog;

class ArchiveExpiredContent extends Command
{
    protected $signature   = 'content:archive-expired {--dry-run : List items that would be archived without making changes}';
    protected $description = 'Archive published news and announcements whose expiry_date has passed';

    public function handle(): int
    {
        $types = ['news', 'announcement'];

        $query = CmsContent::whereIn('type', $types)
            ->where('status', 'published')
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<', now())
            ->where('is_deleted', false);

        $items = $query->get();

        if ($items->isEmpty()) {
            $this->info('No expired content found.');
            return self::SUCCESS;
        }

        $this->info("Found {$items->count()} item(s) to archive:");

        foreach ($items as $item) {
            $this->line("  [{$item->type}] {$item->title} (expired: {$item->expiry_date})");
        }

        if ($this->option('dry-run')) {
            $this->warn('Dry-run mode — no changes made.');
            return self::SUCCESS;
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

        $this->info("Archived {$archived} item(s) successfully.");
        return self::SUCCESS;
    }
}
