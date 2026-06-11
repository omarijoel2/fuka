<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsContent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WebmasterGovernanceController extends Controller
{
    private function guard(Request $request): void
    {
        if (!$request->user() || !$request->user()->canAccessWebmasterConsole()) {
            abort(403, 'Webmaster console access required.');
        }
    }

    /**
     * Apply shared filters to a CmsContent query.
     */
    private function applyFilters($q, Request $request)
    {
        if ($request->filled('type'))       $q->where('type', $request->type);
        if ($request->filled('department'))  $q->where('department', $request->department);
        if ($request->filled('status'))      $q->where('status', $request->status);
        if ($request->filled('owner_id'))    $q->where('author_id', $request->owner_id);
        if ($request->filled('updated_before')) $q->where('updated_at', '<', $request->updated_before);
        if ($request->filled('updated_after'))  $q->where('updated_at', '>=', $request->updated_after);
        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $q->where(fn ($w) => $w->where('title', 'like', $s)->orWhere('slug', 'like', $s));
        }
        return $q;
    }

    public function overview(Request $request)
    {
        $this->guard($request);

        $base = fn () => $this->applyFilters(
            CmsContent::query()->where('is_deleted', false),
            $request
        );

        $now = now();

        $pendingApprovals = $base()
            ->whereIn('status', ['submitted', 'under_review', 'approved'])
            ->count();

        $awaitingReview = $base()
            ->where('status', 'under_review')
            ->count();

        $drafts = $base()
            ->where('status', 'draft')
            ->count();

        $recentlyPublished = $base()
            ->where('status', 'published')
            ->where('published_at', '>=', $now->copy()->subDays(30))
            ->count();

        $expired = $base()
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<', $now)
            ->where('status', '!=', 'archived')
            ->count();

        // Ownership breakdown by department
        $byDepartment = $base()
            ->select('department', DB::raw('count(*) as total'))
            ->groupBy('department')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($r) => [
                'department' => $r->department ?: 'Unassigned',
                'total'      => (int) $r->total,
            ]);

        // Ownership breakdown by school
        $bySchool = $base()
            ->select('school_code', DB::raw('count(*) as total'))
            ->groupBy('school_code')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($r) => [
                'school_code' => $r->school_code ?: 'Unassigned',
                'total'       => (int) $r->total,
            ]);

        // Content type breakdown
        $byType = $base()
            ->select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($r) => ['type' => $r->type, 'total' => (int) $r->total]);

        // Ownership by content owner (author)
        $byOwner = $base()
            ->select('author_id', DB::raw('count(*) as total'))
            ->whereNotNull('author_id')
            ->groupBy('author_id')
            ->orderByDesc('total')
            ->limit(50)
            ->get();
        $ownerNames = User::whereIn('id', $byOwner->pluck('author_id'))->pluck('name', 'id');
        $byOwner = $byOwner->map(fn ($r) => [
            'owner_id'   => $r->author_id,
            'owner_name' => $ownerNames[$r->author_id] ?? 'Unknown',
            'total'      => (int) $r->total,
        ]);

        // Inactive content owners: owner roles with no content updated in 90 days
        $ownerRoles = [
            'department_content_owner', 'department_editor', 'admissions_owner',
            'academic_owner', 'procurement_owner', 'hr_owner',
            'research_owner', 'student_affairs_owner',
        ];
        $owners = User::whereIn('role', $ownerRoles)->where('status', 'active')->get();
        $recentAuthorIds = CmsContent::where('is_deleted', false)
            ->where('updated_at', '>=', $now->copy()->subDays(90))
            ->whereNotNull('author_id')
            ->distinct()
            ->pluck('author_id')
            ->flip();
        $inactiveOwners = $owners
            ->filter(fn ($u) => !$recentAuthorIds->has($u->id))
            ->map(fn ($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'role'       => $u->role,
                'role_label' => User::roles()[$u->role] ?? $u->role,
                'department' => $u->department,
                'last_login_at' => $u->last_login_at,
            ])
            ->values();

        return response()->json([
            'summary' => [
                'pending_approvals'  => $pendingApprovals,
                'awaiting_review'    => $awaitingReview,
                'drafts'             => $drafts,
                'recently_published' => $recentlyPublished,
                'expired'            => $expired,
                'inactive_owners'    => $inactiveOwners->count(),
            ],
            'by_department'   => $byDepartment,
            'by_school'       => $bySchool,
            'by_type'         => $byType,
            'by_owner'        => $byOwner,
            'inactive_owners' => $inactiveOwners,
        ]);
    }

    /**
     * Paginated, filterable content list for the governance table.
     */
    public function content(Request $request)
    {
        $this->guard($request);

        $bucket = $request->get('bucket'); // pending|drafts|expired|recent|review
        $q = $this->applyFilters(
            CmsContent::query()->where('is_deleted', false),
            $request
        );

        $now = now();
        switch ($bucket) {
            case 'pending':
                $q->whereIn('status', ['submitted', 'under_review', 'approved']);
                break;
            case 'review':
                $q->where('status', 'under_review');
                break;
            case 'drafts':
                $q->where('status', 'draft');
                break;
            case 'recent':
                $q->where('status', 'published')->where('published_at', '>=', $now->copy()->subDays(30));
                break;
            case 'expired':
                $q->whereNotNull('expiry_date')->where('expiry_date', '<', $now)->where('status', '!=', 'archived');
                break;
        }

        $perPage = max(5, min(100, (int) $request->get('per_page', 25)));
        $result = $q->orderByDesc('updated_at')->paginate($perPage);

        $authorIds = collect($result->items())->pluck('author_id')->filter()->unique();
        $authors = User::whereIn('id', $authorIds)->pluck('name', 'id');

        $items = collect($result->items())->map(fn ($c) => [
            'id'          => $c->id,
            'title'       => $c->title,
            'slug'        => $c->slug,
            'type'        => $c->type,
            'status'      => $c->status,
            'department'  => $c->department,
            'school_code' => $c->school_code,
            'owner'       => $c->author_id ? ($authors[$c->author_id] ?? 'Unknown') : 'Unassigned',
            'owner_id'    => $c->author_id,
            'updated_at'  => $c->updated_at,
            'expiry_date' => $c->expiry_date,
            'published_at'=> $c->published_at,
        ]);

        return response()->json([
            'data'         => $items,
            'current_page' => $result->currentPage(),
            'last_page'    => $result->lastPage(),
            'total'        => $result->total(),
            'per_page'     => $result->perPage(),
        ]);
    }

    /**
     * Filter option metadata for the UI.
     */
    public function filters(Request $request)
    {
        $this->guard($request);

        return response()->json([
            'types'       => CmsContent::query()->distinct()->orderBy('type')->pluck('type'),
            'departments' => CmsContent::query()->whereNotNull('department')->distinct()->orderBy('department')->pluck('department'),
            'statuses'    => ['draft', 'submitted', 'under_review', 'approved', 'scheduled', 'published', 'unpublished', 'archived'],
            'owners'      => User::whereIn('role', array_keys(User::roles()))
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name', 'role'])
                ->map(fn ($u) => ['id' => $u->id, 'name' => $u->name]),
        ]);
    }
}
