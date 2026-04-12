<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Redirect;
use Illuminate\Http\Request;

class RedirectController extends Controller
{
    public function index(Request $request)
    {
        $q = Redirect::query();
        if ($request->has('search') && $request->search) {
            $s = $request->search;
            $q->where(function ($qb) use ($s) {
                $qb->where('source_path', 'like', "%{$s}%")
                   ->orWhere('destination_url', 'like', "%{$s}%");
            });
        }
        if ($request->has('is_active') && $request->is_active !== '') {
            $q->where('is_active', (bool) $request->is_active);
        }
        $perPage = (int) ($request->per_page ?? 25);
        return response()->json($q->orderBy('created_at', 'desc')->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'source_path'     => 'required|string|max:512|unique:redirects',
            'destination_url' => 'required|string|max:1024',
            'type'            => 'in:301,302',
            'is_active'       => 'boolean',
            'notes'           => 'nullable|string',
        ]);
        $redirect = Redirect::create($validated);
        return response()->json($redirect, 201);
    }

    public function show(int $id)
    {
        return response()->json(Redirect::findOrFail($id));
    }

    public function update(Request $request, int $id)
    {
        $redirect = Redirect::findOrFail($id);
        $validated = $request->validate([
            'source_path'     => "sometimes|string|max:512|unique:redirects,source_path,{$id}",
            'destination_url' => 'sometimes|string|max:1024',
            'type'            => 'sometimes|in:301,302',
            'is_active'       => 'sometimes|boolean',
            'notes'           => 'nullable|string',
        ]);
        $redirect->update($validated);
        return response()->json($redirect);
    }

    public function destroy(int $id)
    {
        Redirect::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function bulkToggle(Request $request)
    {
        $ids = $request->input('ids', []);
        $is_active = (bool) $request->input('is_active', true);
        Redirect::whereIn('id', $ids)->update(['is_active' => $is_active]);
        return response()->json(['message' => 'Updated', 'count' => count($ids)]);
    }
}
