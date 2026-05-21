<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkflowQueueController extends Controller
{
    public function index(Request $request)
    {
        $q = DB::table('cms_content as c')
            ->leftJoin('users as author', 'c.author_id', '=', 'author.id')
            ->leftJoin('users as reviewer', 'c.reviewer_id', '=', 'reviewer.id')
            ->where('c.is_deleted', false)
            ->whereIn('c.status', ['submitted', 'under_review', 'revision_requested', 'approved', 'scheduled'])
            ->select(
                'c.id', 'c.title', 'c.type', 'c.status', 'c.slug',
                'c.updated_at', 'c.published_at',
                'author.name as author_name', 'author.email as author_email',
                'reviewer.name as reviewer_name'
            );

        if ($request->has('status') && $request->status) {
            $q->where('c.status', $request->status);
        }
        if ($request->has('type') && $request->type) {
            $q->where('c.type', $request->type);
        }
        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $q->where(function ($qb) use ($s) {
                $qb->where('c.title', 'like', "%{$s}%")
                   ->orWhere('author.name', 'like', "%{$s}%");
            });
        }

        $perPage = (int) ($request->per_page ?? 20);
        $items = $q->orderBy('c.updated_at', 'asc')->paginate($perPage);

        // Status counts
        $counts = DB::table('cms_content')
            ->where('is_deleted', false)
            ->whereIn('status', ['submitted', 'under_review', 'revision_requested', 'approved', 'scheduled'])
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        return response()->json([
            'items'  => $items,
            'counts' => $counts,
        ]);
    }

    public function assign(Request $request, int $id)
    {
        $validated = $request->validate([
            'reviewer_id' => 'required|exists:users,id',
        ]);
        DB::table('cms_content')->where('id', $id)->update([
            'reviewer_id' => $validated['reviewer_id'],
            'updated_at'  => now(),
        ]);
        return response()->json(['message' => 'Reviewer assigned']);
    }
}
