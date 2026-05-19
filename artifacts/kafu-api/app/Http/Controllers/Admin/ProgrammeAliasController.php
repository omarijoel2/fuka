<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProgrammeAlias;
use App\Models\AdmissionProgramme;
use App\Services\DataNormalizerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgrammeAliasController extends Controller
{
    public function __construct(private DataNormalizerService $normalizer) {}

    public function index(Request $request): JsonResponse
    {
        $aliases = ProgrammeAlias::with('programme')
            ->when($request->programme_id, fn($q, $id) => $q->where('programme_id', $id))
            ->when($request->active !== null, fn($q) => $q->where('is_active', $request->boolean('active')))
            ->orderBy('alias_name')
            ->paginate(50);

        return response()->json($aliases);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'programme_id' => 'required|integer',
            'alias_name'   => 'required|string|max:255',
            'source'       => 'nullable|string',
            'confidence_default' => 'nullable|integer|min:1|max:100',
        ]);

        $normalized = $this->normalizer->normalizeProgrammeName($request->alias_name);

        $exists = ProgrammeAlias::where('normalized_alias', $normalized)->first();
        if ($exists) {
            return response()->json(['message' => 'Alias already exists for this normalized form'], 422);
        }

        $alias = ProgrammeAlias::create([
            'programme_id'       => $request->programme_id,
            'alias_name'         => $request->alias_name,
            'normalized_alias'   => $normalized,
            'source'             => $request->input('source', 'manual'),
            'confidence_default' => $request->input('confidence_default', 90),
            'is_active'          => true,
            'approved_by'        => $request->user()?->id ?? 1,
            'approved_at'        => now(),
        ]);

        return response()->json(['alias' => $alias->load('programme')], 201);
    }

    public function update(Request $request, ProgrammeAlias $alias): JsonResponse
    {
        $request->validate([
            'programme_id'       => 'nullable|integer',
            'alias_name'         => 'nullable|string|max:255',
            'confidence_default' => 'nullable|integer|min:1|max:100',
            'is_active'          => 'nullable|boolean',
        ]);

        $data = $request->only(['programme_id', 'alias_name', 'confidence_default', 'is_active']);
        if (isset($data['alias_name'])) {
            $data['normalized_alias'] = $this->normalizer->normalizeProgrammeName($data['alias_name']);
        }

        $alias->update($data);
        return response()->json(['alias' => $alias->load('programme')]);
    }

    public function destroy(ProgrammeAlias $alias): JsonResponse
    {
        $alias->delete();
        return response()->json(['message' => 'Alias deleted']);
    }
}
