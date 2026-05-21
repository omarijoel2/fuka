<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateAdmissionLettersJob;
use App\Jobs\ImportKuccpsBatchJob;
use App\Jobs\ValidateKuccpsBatchJob;
use App\Models\KuccpsImportBatch;
use App\Models\KuccpsImportRow;
use App\Models\KuccpsMappingTemplate;
use App\Models\KuccpsPlacement;
use App\Models\AdmissionLetter;
use App\Services\KuccpsParserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class KuccpsImportController extends Controller
{
    public function __construct(private KuccpsParserService $parser) {}

    // POST /api/admin/kuccps/import-batches/upload
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls|max:10240',
        ]);

        $file     = $request->file('file');
        $ext      = strtolower($file->getClientOriginalExtension());
        $hash     = hash_file('sha256', $file->getRealPath());
        $ref      = 'KUCCPS-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        $storedPath = $file->storeAs('kuccps_uploads', $ref . '.' . $ext, 'local');

        // Detect sheets
        $fullPath   = Storage::disk('local')->path($storedPath);
        $sheetInfo  = $this->parser->detectSheets($fullPath, $ext);

        $batch = KuccpsImportBatch::create([
            'batch_reference'   => $ref,
            'original_filename' => $file->getClientOriginalName(),
            'stored_file_path'  => $storedPath,
            'file_type'         => $ext,
            'file_hash'         => $hash,
            'status'            => 'uploaded',
            'uploaded_by'       => $request->user()?->id ?? 1,
        ]);

        return response()->json([
            'batch'   => $batch,
            'sheets'  => $sheetInfo['sheets'],
            'message' => 'File uploaded successfully',
        ], 201);
    }

    // GET /api/admin/kuccps/import-batches/{batch}/sheets
    public function sheets(KuccpsImportBatch $batch): JsonResponse
    {
        $fullPath  = Storage::disk('local')->path($batch->stored_file_path);
        $sheetInfo = $this->parser->detectSheets($fullPath, $batch->file_type);
        return response()->json(['sheets' => $sheetInfo['sheets'], 'batch' => $batch]);
    }

    // POST /api/admin/kuccps/import-batches/{batch}/select-sheet
    public function selectSheet(Request $request, KuccpsImportBatch $batch): JsonResponse
    {
        $request->validate([
            'sheet_name'      => 'required|string',
            'header_row'      => 'integer|min:1|max:20',
            'skip_top_rows'   => 'integer|min:0|max:20',
        ]);

        $batch->update([
            'selected_sheet_name' => $request->sheet_name,
            'header_row_number'   => $request->input('header_row', 1),
            'skip_top_rows'       => $request->input('skip_top_rows', 0),
            'status'              => 'mapping_in_progress',
        ]);

        $fullPath  = Storage::disk('local')->path($batch->stored_file_path);
        $sheetData = $this->parser->readSheet(
            $fullPath, $batch->file_type,
            $batch->selected_sheet_name,
            $batch->header_row_number,
            $batch->skip_top_rows
        );

        $suggestions = $this->parser->autoSuggestMappings($sheetData['headers']);

        return response()->json([
            'batch'       => $batch,
            'headers'     => $sheetData['headers'],
            'preview'     => array_slice($sheetData['rows'], 0, 30),
            'total_rows'  => $sheetData['total_data_rows'],
            'suggestions' => $suggestions,
        ]);
    }

    // GET /api/admin/kuccps/import-batches/{batch}/preview
    public function preview(KuccpsImportBatch $batch): JsonResponse
    {
        $fullPath  = Storage::disk('local')->path($batch->stored_file_path);
        $sheetData = $this->parser->readSheet(
            $fullPath, $batch->file_type,
            $batch->selected_sheet_name ?? 'Sheet1',
            $batch->header_row_number,
            $batch->skip_top_rows
        );

        $suggestions = $this->parser->autoSuggestMappings($sheetData['headers']);

        return response()->json([
            'headers'     => $sheetData['headers'],
            'preview'     => array_slice($sheetData['rows'], 0, 50),
            'total_rows'  => $sheetData['total_data_rows'],
            'suggestions' => $suggestions,
        ]);
    }

    // POST /api/admin/kuccps/import-batches/{batch}/map-columns
    public function mapColumns(Request $request, KuccpsImportBatch $batch): JsonResponse
    {
        $request->validate([
            'mapping'               => 'required|array',
            'academic_year'         => 'required|string',
            'intake_id'             => 'nullable|integer',
            'admission_letter_template_id' => 'nullable|integer',
            'reporting_date_text'   => 'nullable|string',
            'save_template'         => 'boolean',
            'template_name'         => 'nullable|string',
        ]);

        $batch->update([
            'mapping_json'                  => $request->mapping,
            'academic_year'                 => $request->academic_year,
            'intake_id'                     => $request->intake_id,
            'admission_letter_template_id'  => $request->admission_letter_template_id,
            'reporting_date_text'           => $request->reporting_date_text,
            'status'                        => 'mapped',
        ]);

        // Optionally save as template
        if ($request->boolean('save_template') && $request->filled('template_name')) {
            $fullPath  = Storage::disk('local')->path($batch->stored_file_path);
            $sheetData = $this->parser->readSheet(
                $fullPath, $batch->file_type,
                $batch->selected_sheet_name ?? 'Sheet1',
                $batch->header_row_number, $batch->skip_top_rows
            );
            KuccpsMappingTemplate::create([
                'template_name'          => $request->template_name,
                'template_code'          => Str::slug($request->template_name) . '-' . date('YmdHis'),
                'source_type'            => 'KUCCPS Placement List',
                'header_aliases'         => $sheetData['headers'],
                'field_mappings'         => $request->mapping,
                'default_intake_period'  => null,
                'default_academic_year'  => $request->academic_year,
                'created_by'             => $request->user()?->id ?? 1,
                'is_active'              => true,
            ]);
        }

        return response()->json(['message' => 'Mapping saved', 'batch' => $batch]);
    }

    // POST /api/admin/kuccps/import-batches/{batch}/validate
    public function validate(Request $request, KuccpsImportBatch $batch): JsonResponse
    {
        if (!in_array($batch->status, ['mapped', 'validation_failed', 'validation_passed', 'awaiting_approval'])) {
            return response()->json(['message' => 'Batch must be mapped before validation'], 422);
        }

        ValidateKuccpsBatchJob::dispatchSync($batch->id);
        $batch->refresh();

        return response()->json([
            'message' => 'Validation complete',
            'batch'   => $batch,
        ]);
    }

    // GET /api/admin/kuccps/import-batches/{batch}/validation-report
    public function validationReport(KuccpsImportBatch $batch): JsonResponse
    {
        $rows = KuccpsImportRow::where('batch_id', $batch->id)->get();

        $byStatus = $rows->groupBy('validation_status');
        $invalidRows = ($byStatus['invalid'] ?? collect())->take(100)->map(fn($r) => [
            'row_number'            => $r->row_number,
            'full_name'             => $r->normalized_row_json['full_name'] ?? '',
            'kcse_index_number'     => $r->normalized_row_json['kcse_index_number'] ?? '',
            'uploaded_programme'    => $r->uploaded_programme_name,
            'errors'                => $r->validation_errors_json,
            'warnings'              => $r->validation_warnings_json,
            'programme_match_status'=> $r->programme_match_status,
            'programme_confidence'  => $r->programme_match_confidence,
        ])->values();

        $unmatchedProgrammes = $rows->filter(fn($r) => in_array($r->programme_match_status, ['unmatched', 'fuzzy_low']))
            ->map(fn($r) => [
                'row_number'          => $r->row_number,
                'id'                  => $r->id,
                'full_name'           => $r->normalized_row_json['full_name'] ?? '',
                'uploaded_programme'  => $r->uploaded_programme_name,
                'match_status'        => $r->programme_match_status,
                'confidence'          => $r->programme_match_confidence,
            ])->values();

        $duplicates = $rows->filter(fn($r) => $r->duplicate_status !== 'none')
            ->map(fn($r) => [
                'row_number'         => $r->row_number,
                'full_name'          => $r->normalized_row_json['full_name'] ?? '',
                'kcse_index_number'  => $r->normalized_row_json['kcse_index_number'] ?? '',
                'duplicate_status'   => $r->duplicate_status,
            ])->values();

        return response()->json([
            'batch'               => $batch,
            'summary'             => $batch->validation_summary_json,
            'invalid_rows'        => $invalidRows,
            'unmatched_programmes'=> $unmatchedProgrammes,
            'duplicates'          => $duplicates,
        ]);
    }

    // POST /api/admin/kuccps/import-batches/{batch}/resolve-programme
    public function resolveProgramme(Request $request, KuccpsImportBatch $batch): JsonResponse
    {
        $request->validate([
            'row_id'        => 'required|integer',
            'programme_id'  => 'required|integer',
            'save_alias'    => 'boolean',
        ]);

        $row = KuccpsImportRow::where('batch_id', $batch->id)->findOrFail($request->row_id);

        $row->update([
            'matched_programme_id'    => $request->programme_id,
            'programme_match_status'  => 'manual',
            'programme_match_confidence' => 100,
        ]);

        // Clear programme errors for this row
        $errors = array_filter($row->validation_errors_json ?? [], fn($e) => $e['field'] !== 'assigned_programme');
        $row->update([
            'validation_errors_json' => array_values($errors),
            'validation_status'      => empty($errors) ? (empty($row->validation_warnings_json) ? 'valid' : 'warning') : 'invalid',
        ]);

        // Save as alias
        if ($request->boolean('save_alias') && !empty($row->uploaded_programme_name)) {
            $normalizer = app(\App\Services\DataNormalizerService::class);
            $normalized = $normalizer->normalizeProgrammeName($row->uploaded_programme_name);
            \App\Models\ProgrammeAlias::firstOrCreate(
                ['normalized_alias' => $normalized],
                [
                    'programme_id'       => $request->programme_id,
                    'alias_name'         => $row->uploaded_programme_name,
                    'source'             => 'import',
                    'confidence_default' => 95,
                    'is_active'          => true,
                    'approved_by'        => $request->user()?->id,
                    'approved_at'        => now(),
                ]
            );
        }

        // Recount batch stats
        $this->recountBatchStats($batch);

        return response()->json(['message' => 'Programme resolved', 'row' => $row]);
    }

    // POST /api/admin/kuccps/import-batches/{batch}/approve
    public function approve(Request $request, KuccpsImportBatch $batch): JsonResponse
    {
        if (!in_array($batch->status, ['validation_passed', 'awaiting_approval'])) {
            return response()->json(['message' => 'Batch must pass validation before approval. Current status: ' . $batch->status], 422);
        }

        $batch->update([
            'status'            => 'approved',
            'approved_by'       => $request->user()?->id ?? 1,
            'approved_at'       => now(),
            'approval_comments' => $request->input('comments'),
        ]);

        return response()->json(['message' => 'Batch approved for import', 'batch' => $batch]);
    }

    // POST /api/admin/kuccps/import-batches/{batch}/import
    public function import(Request $request, KuccpsImportBatch $batch): JsonResponse
    {
        if ($batch->status !== 'approved') {
            return response()->json(['message' => 'Batch must be approved before import'], 422);
        }

        $batch->update([
            'status'      => 'import_queued',
            'imported_by' => $request->user()?->id ?? 1,
        ]);

        ImportKuccpsBatchJob::dispatchSync($batch->id);
        $batch->refresh();

        return response()->json(['message' => 'Import complete', 'batch' => $batch]);
    }

    // POST /api/admin/kuccps/import-batches/{batch}/rollback
    public function rollback(Request $request, KuccpsImportBatch $batch): JsonResponse
    {
        $request->validate(['reason' => 'required|string|min:10']);

        if (!in_array($batch->status, ['imported', 'imported_with_exceptions'])) {
            return response()->json(['message' => 'Only imported batches can be rolled back'], 422);
        }

        // Mark placements as rolled back
        KuccpsPlacement::where('batch_id', $batch->id)
            ->update(['rolled_back_at' => now(), 'admission_status' => 'rolled_back']);

        // Revoke any generated letters
        AdmissionLetter::whereIn('placement_id', KuccpsPlacement::where('batch_id', $batch->id)->pluck('id'))
            ->update([
                'status'       => 'revoked',
                'revoked_at'   => now(),
                'revoked_by'   => $request->user()?->id ?? 1,
                'revoke_reason'=> 'Batch rollback: ' . $request->reason,
            ]);

        $batch->update([
            'status'          => 'rolled_back',
            'rolled_back_by'  => $request->user()?->id ?? 1,
            'rolled_back_at'  => now(),
            'rollback_reason' => $request->reason,
        ]);

        return response()->json(['message' => 'Batch rolled back successfully', 'batch' => $batch]);
    }

    // GET /api/admin/kuccps/import-batches
    public function index(Request $request): JsonResponse
    {
        $batches = KuccpsImportBatch::orderByDesc('created_at')
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->academic_year, fn($q, $y) => $q->where('academic_year', $y))
            ->paginate(20);

        return response()->json($batches);
    }

    // GET /api/admin/kuccps/import-batches/{batch}
    public function show(KuccpsImportBatch $batch): JsonResponse
    {
        $batch->load('intake', 'letterTemplate');
        return response()->json(['batch' => $batch]);
    }

    // POST /api/admin/kuccps/import-batches/{batch}/generate-letters
    public function generateLetters(Request $request, KuccpsImportBatch $batch): JsonResponse
    {
        if (!in_array($batch->status, ['imported', 'imported_with_exceptions'])) {
            return response()->json(['message' => 'Letters can only be generated for imported batches'], 422);
        }

        GenerateAdmissionLettersJob::dispatchSync(
            $batch->id,
            $request->input('template_id') ?? $batch->admission_letter_template_id,
            $request->user()?->id ?? 1
        );

        return response()->json(['message' => 'Admission letters generated']);
    }

    // GET /api/admin/kuccps/import-batches/{batch}/placements
    public function placements(Request $request, KuccpsImportBatch $batch): JsonResponse
    {
        $placements = KuccpsPlacement::where('batch_id', $batch->id)
            ->with('programme', 'admissionLetter')
            ->orderBy('full_name')
            ->paginate(50);

        return response()->json($placements);
    }

    private function recountBatchStats(KuccpsImportBatch $batch): void
    {
        $rows = KuccpsImportRow::where('batch_id', $batch->id)->get();
        $invalid  = $rows->where('validation_status', 'invalid')->count();
        $warning  = $rows->where('validation_status', 'warning')->count();
        $valid    = $rows->where('validation_status', 'valid')->count();
        $unmatched = $rows->whereIn('programme_match_status', ['unmatched', 'fuzzy_low'])->count();

        $newStatus = $invalid > 0 ? 'validation_failed'
            : ($warning > 0 ? 'validation_passed' : 'awaiting_approval');

        $batch->update([
            'valid_rows'               => $valid,
            'warning_rows'             => $warning,
            'invalid_rows'             => $invalid,
            'unmatched_programme_rows' => $unmatched,
            'status'                   => $newStatus,
        ]);
    }
}
