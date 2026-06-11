<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsContent;
use App\Models\ContentReview;
use App\Models\GovernanceReport;
use App\Models\WebmasterTask;
use App\Models\WebmasterAlert;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class GovernanceReportController extends Controller
{
    private function guard(Request $request): void
    {
        if (!$request->user() || !$request->user()->canAccessWebmasterConsole()) {
            abort(403, 'Webmaster console access required.');
        }
    }

    const TYPES = [
        'monthly_webmaster' => 'Monthly Webmaster Report',
        'quarterly_ict'     => 'Quarterly ICT Governance Report',
        'content_health'    => 'Content Health Report',
        'content_freshness' => 'Content Freshness Report',
        'seo'               => 'SEO Performance Report',
        'accessibility'     => 'Accessibility Compliance Report',
        'performance'       => 'Website Performance Report',
        'admissions'        => 'Admissions Conversion Report',
        'research'          => 'Research Visibility Report',
    ];

    public function index(Request $request)
    {
        $this->guard($request);

        $reports = GovernanceReport::orderByDesc('created_at')->limit(100)->get()
            ->map(fn ($r) => [
                'id'           => $r->id,
                'type'         => $r->type,
                'type_label'   => self::TYPES[$r->type] ?? $r->type,
                'title'        => $r->title,
                'period_start' => $r->period_start,
                'period_end'   => $r->period_end,
                'status'       => $r->status,
                'created_at'   => $r->created_at,
            ]);

        return response()->json([
            'data'  => $reports,
            'types' => collect(self::TYPES)->map(fn ($label, $key) => ['key' => $key, 'label' => $label])->values(),
        ]);
    }

    public function show(Request $request, int $id)
    {
        $this->guard($request);
        return response()->json(GovernanceReport::findOrFail($id));
    }

    public function destroy(Request $request, int $id)
    {
        $this->guard($request);
        $report = GovernanceReport::findOrFail($id);
        $report->delete();
        AuditLog::record($request->user(), 'delete', 'governance_report', $id, $report->title);
        return response()->json(['success' => true]);
    }

    public function generate(Request $request)
    {
        $this->guard($request);

        $data = $request->validate([
            'type'         => 'required|in:' . implode(',', array_keys(self::TYPES)),
            'period_start' => 'nullable|date',
            'period_end'   => 'nullable|date',
        ]);

        $start = $data['period_start'] ?? now()->startOfMonth()->toDateString();
        $end   = $data['period_end'] ?? now()->toDateString();

        $payload = $this->buildPayload($data['type'], $start, $end);

        $report = GovernanceReport::create([
            'type'         => $data['type'],
            'title'        => self::TYPES[$data['type']] . ' — ' . date('d M Y', strtotime($start)) . ' to ' . date('d M Y', strtotime($end)),
            'period_start' => $start,
            'period_end'   => $end,
            'payload'      => $payload,
            'generated_by' => $request->user()->id,
            'status'       => 'final',
        ]);

        AuditLog::record($request->user(), 'create', 'governance_report', $report->id, $report->title);

        return response()->json($report, 201);
    }

    /**
     * Compose the structured report payload from live data.
     */
    private function buildPayload(string $type, string $start, string $end): array
    {
        $now = now();
        $all = CmsContent::where('is_deleted', false);

        $totalContent = (clone $all)->count();
        $published    = (clone $all)->where('status', 'published')->count();
        $drafts       = (clone $all)->where('status', 'draft')->count();
        $pending      = (clone $all)->whereIn('status', ['submitted', 'under_review', 'approved'])->count();
        $expired      = (clone $all)->whereNotNull('expiry_date')->where('expiry_date', '<', $now)->where('status', '!=', 'archived')->count();

        // Freshness
        $stale = (clone $all)->where('status', 'published')->where('updated_at', '<', $now->copy()->subDays(180))->count();
        $critical = (clone $all)->where('status', 'published')->where('updated_at', '<', $now->copy()->subDays(365))->count();

        // SEO gaps (basic, on-site)
        $missingSeo = (clone $all)->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('seo_meta')->orWhere('seo_meta', '')->orWhere('seo_meta', '[]')->orWhere('seo_meta', '{}');
            })->count();

        $publishedInPeriod = (clone $all)->where('status', 'published')
            ->whereBetween('published_at', [$start, $end . ' 23:59:59'])->count();

        $openTasks = WebmasterTask::whereIn('status', ['open', 'in_progress', 'escalated'])->count();
        $resolvedTasks = WebmasterTask::where('status', 'done')
            ->whereBetween('completed_at', [$start, $end . ' 23:59:59'])->count();
        $activeAlerts = WebmasterAlert::where('status', '!=', 'resolved')->count();
        $criticalAlerts = WebmasterAlert::where('status', '!=', 'resolved')->where('severity', 'critical')->count();

        $risks = [];
        if ($expired > 0)      $risks[] = "$expired published items are past their expiry date and may show outdated information.";
        if ($critical > 0)     $risks[] = "$critical published pages have not been updated in over a year (public-facing risk).";
        if ($missingSeo > 0)   $risks[] = "$missingSeo published pages are missing SEO metadata, reducing search visibility.";
        if ($criticalAlerts > 0) $risks[] = "$criticalAlerts critical alerts are currently unresolved.";
        if (empty($risks))     $risks[] = "No major governance risks detected for this period.";

        $recommendations = [];
        if ($stale > 0)      $recommendations[] = "Assign review tasks for the $stale stale published pages to their content owners.";
        if ($missingSeo > 0) $recommendations[] = "Complete SEO metadata for the $missingSeo pages lacking it.";
        if ($expired > 0)    $recommendations[] = "Archive or refresh the $expired expired items.";
        if (empty($recommendations)) $recommendations[] = "Maintain current review cadence; no urgent actions required.";

        $summary = "During this period, $publishedInPeriod item(s) were published. "
            . "The site holds $totalContent content records ($published published, $drafts drafts, $pending pending review). "
            . "$stale published pages are stale (>180 days) and $expired are expired. "
            . "$resolvedTasks task(s) were resolved; $openTasks remain open.";

        $base = [
            'executive_summary'   => $summary,
            'key_risks'           => $risks,
            'resolved_issues'     => ["$resolvedTasks governance task(s) completed in period."],
            'pending_issues'      => [
                "$openTasks open task(s)",
                "$activeAlerts active alert(s)",
                "$pending content item(s) awaiting review/approval",
            ],
            'recommendations'     => $recommendations,
            'responsible_offices' => ['ICT Directorate', 'Corporate Communications', 'Content Owners (per department)'],
            'timelines'           => 'Recommended remediation within 30 days; review cadence ongoing.',
            'metrics'             => [
                'total_content'        => $totalContent,
                'published'            => $published,
                'drafts'               => $drafts,
                'pending_review'       => $pending,
                'published_in_period'  => $publishedInPeriod,
                'expired'              => $expired,
                'stale'                => $stale,
                'critical_freshness'   => $critical,
                'missing_seo'          => $missingSeo,
                'open_tasks'           => $openTasks,
                'resolved_tasks'       => $resolvedTasks,
                'active_alerts'        => $activeAlerts,
                'critical_alerts'      => $criticalAlerts,
            ],
        ];

        return $base;
    }
}
