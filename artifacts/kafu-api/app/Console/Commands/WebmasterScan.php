<?php

namespace App\Console\Commands;

use App\Models\CmsContent;
use App\Models\ContentReview;
use App\Models\WebmasterAlert;
use Illuminate\Console\Command;

class WebmasterScan extends Command
{
    protected $signature = 'webmaster:scan {--dry-run : Report findings without creating alerts}';

    protected $description = 'Scan content for stale, expired, missing-SEO and review-overdue issues; raise Webmaster alerts.';

    public function handle(): int
    {
        $dry = $this->option('dry-run');
        $now = now();
        $created = 0;

        $rank = ['info' => 0, 'minor' => 1, 'major' => 2, 'critical' => 3];

        $raise = function (string $type, string $severity, string $title, ?string $message, ?int $contentId) use ($dry, &$created, $rank) {
            // One active alert per (type, content). Escalate severity if the condition worsened.
            $existing = WebmasterAlert::where('type', $type)
                ->where('content_id', $contentId)
                ->where('status', '!=', 'resolved')
                ->first();

            if ($existing) {
                if (($rank[$severity] ?? 0) > ($rank[$existing->severity] ?? 0)) {
                    $this->line("[escalate -> $severity] $title");
                    if (!$dry) {
                        $existing->update(['severity' => $severity, 'title' => $title, 'message' => $message]);
                    }
                }
                return;
            }

            $this->line("[$severity] $title");
            if (!$dry) {
                WebmasterAlert::create([
                    'type' => $type, 'severity' => $severity, 'title' => $title,
                    'message' => $message, 'content_id' => $contentId, 'status' => 'active',
                ]);
                $created++;
            }
        };

        // Expired published content
        CmsContent::where('is_deleted', false)
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<', $now)
            ->where('status', '!=', 'archived')
            ->get()
            ->each(fn ($c) => $raise(
                'expired_content', 'major',
                "Expired: {$c->title}",
                "This {$c->type} expired on " . optional($c->expiry_date)->format('d M Y') . ' but is not archived.',
                $c->id
            ));

        // Critically stale published content (>365 days)
        CmsContent::where('is_deleted', false)
            ->where('status', 'published')
            ->where('updated_at', '<', $now->copy()->subDays(365))
            ->get()
            ->each(fn ($c) => $raise(
                'stale_content', 'critical',
                "Outdated >1yr: {$c->title}",
                "This published {$c->type} has not been updated since " . $c->updated_at->format('d M Y') . '.',
                $c->id
            ));

        // Stale published content (180-365 days)
        CmsContent::where('is_deleted', false)
            ->where('status', 'published')
            ->whereBetween('updated_at', [$now->copy()->subDays(365), $now->copy()->subDays(180)])
            ->get()
            ->each(fn ($c) => $raise(
                'stale_content', 'minor',
                "Stale: {$c->title}",
                "This published {$c->type} has not been updated in over 180 days.",
                $c->id
            ));

        // Review overdue
        ContentReview::whereNotNull('next_review_due')
            ->where('next_review_due', '<', $now)
            ->get()
            ->each(function ($r) use ($raise) {
                $c = CmsContent::find($r->content_id);
                if (!$c || $c->is_deleted) return;
                $raise(
                    'review_overdue', 'major',
                    "Review overdue: {$c->title}",
                    'Scheduled review was due on ' . optional($r->next_review_due)->format('d M Y') . '.',
                    $c->id
                );
            });

        // Missing SEO on published content
        CmsContent::where('is_deleted', false)
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('seo_meta')->orWhere('seo_meta', '')->orWhere('seo_meta', '[]')->orWhere('seo_meta', '{}');
            })
            ->get()
            ->each(fn ($c) => $raise(
                'missing_seo', 'minor',
                "Missing SEO: {$c->title}",
                "This published {$c->type} has no SEO metadata.",
                $c->id
            ));

        $this->info($dry ? 'Dry run complete (no alerts created).' : "Scan complete. {$created} new alert(s) created.");
        return self::SUCCESS;
    }
}
