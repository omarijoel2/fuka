<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdmissionLetter;
use App\Models\AdmissionLetterTemplate;
use App\Models\KuccpsPlacement;
use App\Services\AdmissionLetterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AdmissionLetterAdminController extends Controller
{
    public function __construct(private AdmissionLetterService $service) {}

    // GET /api/admin/admission-letter-templates
    public function templates(): JsonResponse
    {
        $templates = AdmissionLetterTemplate::where('is_active', true)->orderBy('template_name')->get();
        return response()->json(['templates' => $templates]);
    }

    // POST /api/admin/admission-letter-templates
    public function storeTemplate(Request $request): JsonResponse
    {
        $request->validate([
            'template_name'       => 'required|string|max:100',
            'template_code'       => 'required|string|max:50|unique:admission_letter_templates',
            'body_html'           => 'required|string',
            'header_html'         => 'nullable|string',
            'footer_html'         => 'nullable|string',
            'registrar_name'      => 'nullable|string',
            'reporting_date_text' => 'nullable|string',
            'intake_period'       => 'nullable|string',
        ]);

        $template = AdmissionLetterTemplate::create($request->only([
            'template_name', 'template_code', 'body_html', 'header_html', 'footer_html',
            'variables_json', 'registrar_name', 'reporting_date_text', 'intake_period',
        ]) + ['is_active' => true]);

        return response()->json(['template' => $template], 201);
    }

    // PATCH /api/admin/admission-letter-templates/{template}
    public function updateTemplate(Request $request, AdmissionLetterTemplate $template): JsonResponse
    {
        $template->update($request->only([
            'template_name', 'body_html', 'header_html', 'footer_html',
            'registrar_name', 'reporting_date_text', 'intake_period', 'is_active',
        ]));
        return response()->json(['template' => $template]);
    }

    // POST /api/admin/admission-letters/generate/{placement}
    public function generateForPlacement(Request $request, KuccpsPlacement $placement): JsonResponse
    {
        $request->validate(['template_id' => 'required|integer']);
        $template = AdmissionLetterTemplate::findOrFail($request->template_id);

        $letter = $this->service->generateForPlacement($placement, $template, $request->user()?->id ?? 1);
        return response()->json(['letter' => $letter]);
    }

    // GET /api/admin/admission-letters/{letter}
    public function show(AdmissionLetter $letter): JsonResponse
    {
        $letter->load('placement', 'template', 'downloadLogs');
        return response()->json(['letter' => $letter]);
    }

    // POST /api/admin/admission-letters/{letter}/revoke
    public function revoke(Request $request, AdmissionLetter $letter): JsonResponse
    {
        $request->validate(['reason' => 'required|string|min:5']);
        $letter->update([
            'status'       => 'revoked',
            'revoked_at'   => now(),
            'revoked_by'   => $request->user()?->id ?? 1,
            'revoke_reason'=> $request->reason,
        ]);
        return response()->json(['message' => 'Letter revoked', 'letter' => $letter]);
    }

    // GET /api/admin/admission-letters/{letter}/download
    public function download(AdmissionLetter $letter): Response|JsonResponse
    {
        if ($letter->status === 'revoked') {
            return response()->json(['message' => 'This admission letter has been revoked'], 403);
        }

        $pdf = $this->service->getLetterStream($letter);
        if (!$pdf) {
            return response()->json(['message' => 'Letter file not found — regenerate it'], 404);
        }

        $letter->increment('downloaded_count');
        $letter->update(['last_downloaded_at' => now(), 'status' => 'downloaded']);

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $letter->letter_reference . '.pdf"',
        ]);
    }
}
