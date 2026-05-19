<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KuccpsMappingTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KuccpsMappingTemplateController extends Controller
{
    public function index(): JsonResponse
    {
        $templates = KuccpsMappingTemplate::where('is_active', true)
            ->orderByDesc('last_used_at')
            ->get();
        return response()->json(['templates' => $templates]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'template_name'  => 'required|string|max:100',
            'field_mappings' => 'required|array',
            'header_aliases' => 'nullable|array',
            'default_academic_year' => 'nullable|string',
        ]);

        $template = KuccpsMappingTemplate::create([
            'template_name'         => $request->template_name,
            'template_code'         => Str::slug($request->template_name) . '-' . date('YmdHis'),
            'source_type'           => $request->input('source_type', 'KUCCPS Placement List'),
            'header_aliases'        => $request->input('header_aliases', []),
            'field_mappings'        => $request->field_mappings,
            'default_intake_period' => $request->default_intake_period,
            'default_academic_year' => $request->default_academic_year,
            'created_by'            => $request->user()?->id ?? 1,
            'is_active'             => true,
        ]);

        return response()->json(['template' => $template], 201);
    }

    public function update(Request $request, KuccpsMappingTemplate $template): JsonResponse
    {
        $template->update($request->only([
            'template_name', 'source_type', 'header_aliases',
            'field_mappings', 'default_intake_period', 'default_academic_year', 'is_active',
        ]));
        return response()->json(['template' => $template]);
    }

    public function destroy(KuccpsMappingTemplate $template): JsonResponse
    {
        $template->update(['is_active' => false]);
        return response()->json(['message' => 'Template deactivated']);
    }
}
