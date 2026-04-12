<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ContentHealthController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $staleThresholdDays = 180;

        // Stale content (published but not updated in 6+ months)
        $staleContent = DB::table('cms_content')
            ->where('status', 'published')
            ->where('updated_at', '<', $now->copy()->subDays($staleThresholdDays))
            ->where('is_deleted', false)
            ->count();

        // Draft count older than 30 days
        $staleDrafts = DB::table('cms_content')
            ->where('status', 'draft')
            ->where('updated_at', '<', $now->copy()->subDays(30))
            ->where('is_deleted', false)
            ->count();

        // Opportunities expired but still published (using expiry_date)
        $expiredOpportunities = DB::table('cms_content')
            ->where('type', 'opportunity')
            ->whereIn('status', ['published', 'scheduled'])
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<', $now)
            ->where('is_deleted', false)
            ->count();

        // Media missing alt text
        $missingAlt = DB::table('media_files')
            ->where(function ($q) {
                $q->whereNull('alt_text')->orWhere('alt_text', '');
            })
            ->count();

        // Staff profiles with low completeness (< 40%)
        $incompleteProfiles = 0;
        try {
            $incompleteProfiles = DB::table('users')
                ->where('role', 'staff_user')
                ->where('is_active', true)
                ->whereRaw("COALESCE(profile_completeness, 0) < 40")
                ->count();
        } catch (\Exception $e) {
            // column may not exist
        }

        // Content missing SEO meta (null seo_meta)
        $missingSeo = DB::table('cms_content')
            ->where('status', 'published')
            ->where('is_deleted', false)
            ->whereNull('seo_meta')
            ->count();

        // Content pending review > 3 days
        $overdueReview = DB::table('cms_content')
            ->whereIn('status', ['submitted', 'under_review'])
            ->where('updated_at', '<', $now->copy()->subDays(3))
            ->where('is_deleted', false)
            ->count();

        // Stale content list (top 10 oldest)
        $staleContentList = DB::table('cms_content')
            ->where('status', 'published')
            ->where('updated_at', '<', $now->copy()->subDays($staleThresholdDays))
            ->where('is_deleted', false)
            ->select('id', 'title', 'type', 'updated_at', 'author_id')
            ->orderBy('updated_at', 'asc')
            ->limit(10)
            ->get();

        // Stale drafts list (top 10 oldest)
        $staleDraftsList = DB::table('cms_content')
            ->where('status', 'draft')
            ->where('updated_at', '<', $now->copy()->subDays(30))
            ->where('is_deleted', false)
            ->select('id', 'title', 'type', 'updated_at', 'author_id')
            ->orderBy('updated_at', 'asc')
            ->limit(10)
            ->get();

        // Overdue review items
        $overdueList = DB::table('cms_content')
            ->whereIn('status', ['submitted', 'under_review'])
            ->where('updated_at', '<', $now->copy()->subDays(3))
            ->where('is_deleted', false)
            ->select('id', 'title', 'type', 'status', 'updated_at')
            ->orderBy('updated_at', 'asc')
            ->limit(10)
            ->get();

        // Expired (still published) opportunities list
        $expiredList = DB::table('cms_content')
            ->where('type', 'opportunity')
            ->whereIn('status', ['published', 'scheduled'])
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<', $now)
            ->where('is_deleted', false)
            ->select('id', 'title', 'status', 'expiry_date')
            ->orderBy('expiry_date', 'asc')
            ->limit(10)
            ->get();

        // Content by status summary
        $statusSummary = DB::table('cms_content')
            ->where('is_deleted', false)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        // Content by type summary
        $typeSummary = DB::table('cms_content')
            ->where('is_deleted', false)
            ->selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->get()
            ->pluck('count', 'type');

        // Recently published (last 30 days)
        $recentlyPublished = DB::table('cms_content')
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '>=', $now->copy()->subDays(30))
            ->where('is_deleted', false)
            ->count();

        $score = $this->calculateHealthScore(
            $staleContent, $staleDrafts, $expiredOpportunities,
            $missingAlt, $incompleteProfiles, $missingSeo, $overdueReview
        );

        return response()->json([
            'health_score' => $score,
            'summary' => [
                'stale_content'              => $staleContent,
                'stale_drafts'               => $staleDrafts,
                'expired_opportunities'      => $expiredOpportunities,
                'missing_alt_text'           => $missingAlt,
                'incomplete_staff_profiles'  => $incompleteProfiles,
                'missing_seo'                => $missingSeo,
                'overdue_reviews'            => $overdueReview,
                'recently_published'         => $recentlyPublished,
            ],
            'status_breakdown'     => $statusSummary,
            'type_breakdown'       => $typeSummary,
            'stale_content_list'   => $staleContentList,
            'stale_drafts_list'    => $staleDraftsList,
            'overdue_review_list'  => $overdueList,
            'expired_list'         => $expiredList,
        ]);
    }

    private function calculateHealthScore(
        int $stale, int $staleDrafts, int $expired,
        int $missingAlt, int $incompleteProfiles, int $missingSeo, int $overdue
    ): int {
        $deductions = 0;
        $deductions += min($stale * 2, 20);
        $deductions += min($staleDrafts * 1, 10);
        $deductions += min($expired * 5, 15);
        $deductions += min($missingAlt * 0.5, 10);
        $deductions += min($incompleteProfiles * 1, 15);
        $deductions += min($missingSeo * 1, 15);
        $deductions += min($overdue * 3, 15);
        return max(0, 100 - (int) round($deductions));
    }
}
