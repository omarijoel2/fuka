<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebmasterTask;
use App\Models\User;
use App\Models\CmsContent;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class WebmasterTaskController extends Controller
{
    private function guard(Request $request): void
    {
        if (!$request->user() || !$request->user()->canAccessWebmasterConsole()) {
            abort(403, 'Webmaster console access required.');
        }
    }

    public function index(Request $request)
    {
        $this->guard($request);

        $q = WebmasterTask::query();
        if ($request->filled('status'))      $q->where('status', $request->status);
        if ($request->filled('priority'))    $q->where('priority', $request->priority);
        if ($request->filled('type'))        $q->where('type', $request->type);
        if ($request->filled('assigned_to')) $q->where('assigned_to', $request->assigned_to);

        $tasks = $q->orderByRaw("CASE status WHEN 'escalated' THEN 0 WHEN 'open' THEN 1 WHEN 'in_progress' THEN 2 WHEN 'done' THEN 3 ELSE 4 END")
            ->orderByDesc('created_at')
            ->get();

        $userIds = $tasks->pluck('assigned_to')->merge($tasks->pluck('assigned_by'))->filter()->unique();
        $names = User::whereIn('id', $userIds)->pluck('name', 'id');
        $contentTitles = CmsContent::whereIn('id', $tasks->pluck('content_id')->filter()->unique())->pluck('title', 'id');

        $items = $tasks->map(fn ($t) => [
            'id'            => $t->id,
            'title'         => $t->title,
            'description'   => $t->description,
            'type'          => $t->type,
            'priority'      => $t->priority,
            'status'        => $t->status,
            'assigned_to'   => $t->assigned_to,
            'assignee_name' => $t->assigned_to ? ($names[$t->assigned_to] ?? 'Unknown') : null,
            'assigned_by'   => $t->assigned_by,
            'assigner_name' => $t->assigned_by ? ($names[$t->assigned_by] ?? null) : null,
            'content_id'    => $t->content_id,
            'content_title' => $t->content_id ? ($contentTitles[$t->content_id] ?? null) : null,
            'due_date'      => $t->due_date,
            'completed_at'  => $t->completed_at,
            'created_at'    => $t->created_at,
        ]);

        $counts = [
            'open'        => WebmasterTask::where('status', 'open')->count(),
            'in_progress' => WebmasterTask::where('status', 'in_progress')->count(),
            'escalated'   => WebmasterTask::where('status', 'escalated')->count(),
            'done'        => WebmasterTask::where('status', 'done')->count(),
        ];

        return response()->json(['data' => $items, 'counts' => $counts]);
    }

    public function store(Request $request)
    {
        $this->guard($request);

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'required|in:review,content_update,seo,accessibility,escalation,other',
            'priority'    => 'required|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'content_id'  => 'nullable|integer|exists:cms_content,id',
            'due_date'    => 'nullable|date',
        ]);
        $data['assigned_by'] = $request->user()->id;
        $data['status'] = 'open';

        $task = WebmasterTask::create($data);
        AuditLog::record($request->user(), 'create', 'webmaster_task', $task->id, $task->title);

        return response()->json($task, 201);
    }

    public function update(Request $request, int $id)
    {
        $this->guard($request);

        $task = WebmasterTask::findOrFail($id);
        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'sometimes|in:review,content_update,seo,accessibility,escalation,other',
            'priority'    => 'sometimes|in:low,medium,high,urgent',
            'status'      => 'sometimes|in:open,in_progress,done,escalated,cancelled',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'content_id'  => 'nullable|integer|exists:cms_content,id',
            'due_date'    => 'nullable|date',
        ]);

        if (($data['status'] ?? null) === 'done' && !$task->completed_at) {
            $data['completed_at'] = now();
        }
        if (($data['status'] ?? null) && $data['status'] !== 'done') {
            $data['completed_at'] = null;
        }

        $task->update($data);
        AuditLog::record($request->user(), 'update', 'webmaster_task', $task->id, $task->title);

        return response()->json($task);
    }

    public function destroy(Request $request, int $id)
    {
        $this->guard($request);

        $task = WebmasterTask::findOrFail($id);
        $title = $task->title;
        $task->delete();
        AuditLog::record($request->user(), 'delete', 'webmaster_task', $id, $title);

        return response()->json(['success' => true]);
    }
}
