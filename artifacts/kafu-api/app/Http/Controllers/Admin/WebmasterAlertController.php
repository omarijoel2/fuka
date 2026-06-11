<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebmasterAlert;
use App\Models\CmsContent;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class WebmasterAlertController extends Controller
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

        $q = WebmasterAlert::query();
        if ($request->filled('status'))   $q->where('status', $request->status);
        else                              $q->where('status', '!=', 'resolved');
        if ($request->filled('severity')) $q->where('severity', $request->severity);
        if ($request->filled('type'))     $q->where('type', $request->type);

        $alerts = $q->orderByRaw("CASE severity WHEN 'critical' THEN 0 WHEN 'major' THEN 1 WHEN 'minor' THEN 2 ELSE 3 END")
            ->orderByDesc('created_at')
            ->limit(200)
            ->get();

        $titles = CmsContent::whereIn('id', $alerts->pluck('content_id')->filter()->unique())->pluck('title', 'id');

        $items = $alerts->map(fn ($a) => [
            'id'            => $a->id,
            'type'          => $a->type,
            'severity'      => $a->severity,
            'title'         => $a->title,
            'message'       => $a->message,
            'content_id'    => $a->content_id,
            'content_title' => $a->content_id ? ($titles[$a->content_id] ?? null) : null,
            'status'        => $a->status,
            'created_at'    => $a->created_at,
        ]);

        $counts = [
            'critical' => WebmasterAlert::where('status', '!=', 'resolved')->where('severity', 'critical')->count(),
            'major'    => WebmasterAlert::where('status', '!=', 'resolved')->where('severity', 'major')->count(),
            'minor'    => WebmasterAlert::where('status', '!=', 'resolved')->where('severity', 'minor')->count(),
            'active'   => WebmasterAlert::where('status', 'active')->count(),
        ];

        return response()->json(['data' => $items, 'counts' => $counts]);
    }

    public function update(Request $request, int $id)
    {
        $this->guard($request);

        $alert = WebmasterAlert::findOrFail($id);
        $data = $request->validate([
            'status' => 'required|in:active,acknowledged,resolved',
        ]);

        $alert->status = $data['status'];
        if ($data['status'] === 'resolved') {
            $alert->resolved_by = $request->user()->id;
            $alert->resolved_at = now();
        }
        $alert->save();

        AuditLog::record($request->user(), 'update', 'webmaster_alert', $alert->id, $alert->title, [
            'notes' => 'Alert ' . $data['status'],
        ]);

        return response()->json($alert);
    }
}
