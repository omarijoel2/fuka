<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsContent;
use App\Models\ContentReview;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class ContentFreshnessController extends Controller
{
    private function guard(Request $request): void
    {
        if (!$request->user() || !$request->user()->canAccessWebmasterConsole()) {
            abort(403, 'Webmaster console access required.');
        }
    }

    /**
     * Classify a content row by freshness.
     * fresh (<=90d) | warning (91-180d) | stale (>180d) | critical (published & very old or review overdue)
     */
    public static function classify($content, ?ContentReview $review = null): string
    {
        $days = $content->updated_at ? $content->updated_at->diffInDays(now()) : 9999;

        $reviewOverdue = $review && $review->next_review_due && $review->next_review_due->isPast();

        if (($content->status === 'published' && $days > 365) || $reviewOverdue) {
            return 'critical';
        }
        if ($days > 180) return 'stale';
        if ($days > 90)  return 'warning';
        return 'fresh';
    }

    public function index(Request $request)
    {
        $this->guard($request);

        $q = CmsContent::query()->where('is_deleted', false);
        if ($request->filled('type'))       $q->where('type', $request->type);
        if ($request->filled('department'))  $q->where('department', $request->department);
        if ($request->filled('status'))      $q->where('status', $request->status);
        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $q->where(fn ($w) => $w->where('title', 'like', $s)->orWhere('slug', 'like', $s));
        }

        $items = $q->orderBy('updated_at')->get();

        $reviews = ContentReview::whereIn('content_id', $items->pluck('id'))
            ->get()->keyBy('content_id');
        $authors = User::whereIn('id', $items->pluck('author_id')->filter()->unique())
            ->pluck('name', 'id');

        $counts = ['fresh' => 0, 'warning' => 0, 'stale' => 0, 'critical' => 0];

        $rows = $items->map(function ($c) use ($reviews, $authors, &$counts) {
            $review = $reviews->get($c->id);
            $bucket = self::classify($c, $review);
            $counts[$bucket]++;
            return [
                'id'              => $c->id,
                'title'           => $c->title,
                'slug'            => $c->slug,
                'type'            => $c->type,
                'status'          => $c->status,
                'department'      => $c->department,
                'owner'           => $c->author_id ? ($authors[$c->author_id] ?? 'Unknown') : 'Unassigned',
                'owner_id'        => $c->author_id,
                'updated_at'      => $c->updated_at,
                'days_since_update' => $c->updated_at ? (int) $c->updated_at->diffInDays(now()) : null,
                'last_reviewed_at'  => $review?->last_reviewed_at,
                'next_review_due'   => $review?->next_review_due,
                'review_frequency_days' => $review?->review_frequency_days,
                'freshness'       => $bucket,
            ];
        });

        $filterBucket = $request->get('bucket');
        if ($filterBucket && in_array($filterBucket, ['fresh', 'warning', 'stale', 'critical'])) {
            $rows = $rows->where('freshness', $filterBucket)->values();
        }

        return response()->json([
            'counts' => $counts,
            'total'  => $items->count(),
            'items'  => $rows->values(),
        ]);
    }

    /**
     * Create/update the review schedule for a content item.
     */
    public function setSchedule(Request $request, int $contentId)
    {
        $this->guard($request);

        $data = $request->validate([
            'review_frequency_days' => 'required|integer|min:1|max:3650',
            'next_review_due'       => 'nullable|date',
            'owner_id'              => 'nullable|integer|exists:users,id',
            'notes'                 => 'nullable|string',
        ]);

        $content = CmsContent::findOrFail($contentId);

        $review = ContentReview::firstOrNew(['content_id' => $contentId]);
        $review->review_frequency_days = $data['review_frequency_days'];
        $review->owner_id = $data['owner_id'] ?? $review->owner_id ?? $content->author_id;
        $review->notes = $data['notes'] ?? $review->notes;
        $review->next_review_due = $data['next_review_due']
            ?? now()->addDays($data['review_frequency_days'])->toDateString();
        $review->save();

        AuditLog::record($request->user(), 'update', 'content_review', $contentId, $content->title, [
            'notes' => 'Set review schedule (' . $data['review_frequency_days'] . ' days)',
        ]);

        return response()->json($review);
    }

    /**
     * Mark a content item as reviewed now; rolls the next due date forward.
     */
    public function markReviewed(Request $request, int $contentId)
    {
        $this->guard($request);

        $content = CmsContent::findOrFail($contentId);
        $review = ContentReview::firstOrNew(['content_id' => $contentId]);
        $freq = $review->review_frequency_days ?: 180;

        $review->last_reviewed_at = now()->toDateString();
        $review->next_review_due  = now()->addDays($freq)->toDateString();
        $review->review_frequency_days = $freq;
        $review->owner_id = $review->owner_id ?? $content->author_id;
        $review->save();

        AuditLog::record($request->user(), 'review', 'content_review', $contentId, $content->title, [
            'notes' => 'Marked content as reviewed',
        ]);

        return response()->json($review);
    }
}
