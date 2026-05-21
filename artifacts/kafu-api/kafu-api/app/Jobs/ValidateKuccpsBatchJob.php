<?php

namespace App\Jobs;

use App\Models\KuccpsImportBatch;
use App\Models\KuccpsImportRow;
use App\Models\KuccpsPlacement;
use App\Services\DataNormalizerService;
use App\Services\KuccpsParserService;
use App\Services\ProgrammeMatcherService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ValidateKuccpsBatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $batchId) {}

    public function handle(
        KuccpsParserService    $parser,
        DataNormalizerService  $normalizer,
        ProgrammeMatcherService $matcher
    ): void {
        $batch = KuccpsImportBatch::findOrFail($this->batchId);
        $batch->update(['status' => 'importing']); // reuse status temporarily

        try {
            $filePath = Storage::disk('local')->path($batch->stored_file_path);
            $sheetData = $parser->readSheet(
                $filePath,
                $batch->file_type,
                $batch->selected_sheet_name ?? 'Sheet1',
                $batch->header_row_number,
                $batch->skip_top_rows
            );

            $mapping     = $batch->mapping_json ?? [];
            $academicYear = $batch->academic_year ?? '';
            $rows        = $sheetData['rows'];
            $seenIndexes = [];  // within-file duplicate tracking

            $totals = ['total' => 0, 'valid' => 0, 'warning' => 0, 'invalid' => 0, 'duplicate' => 0, 'unmatched_programme' => 0];

            // Delete existing rows for this batch before re-validation
            KuccpsImportRow::where('batch_id', $batch->id)->delete();

            foreach ($rows as $rowNum => $rawRow) {
                $totals['total']++;
                $rowNumber = $rowNum + 1;

                $mapped  = $parser->applyMapping($rawRow, $mapping);
                $errors  = [];
                $warnings = [];

                // ── Normalize ─────────────────────────────────────────────
                $fullName   = $normalizer->normalizeName($mapped['full_name'] ?? '');
                $rawIndex   = $mapped['kcse_index_number'] ?? '';
                $rawYear    = $mapped['kcse_year'] ?? $batch->academic_year ?? '';
                $idxData    = $normalizer->normalizeKcseIndex($rawIndex);
                $indexNum   = $idxData['index'];
                $kcseYear   = $idxData['year'] ?? $rawYear;
                $phone      = $normalizer->normalizePhone($mapped['phone_number'] ?? null);
                $email      = $normalizer->normalizeEmail($mapped['email'] ?? null);
                $gender     = $normalizer->normalizeGender($mapped['gender'] ?? null);
                $programme  = trim($mapped['assigned_programme'] ?? '');

                // ── Critical field validation ──────────────────────────────
                if ($err = $normalizer->validateName($fullName)) $errors[] = ['field' => 'full_name', 'message' => $err];
                if ($err = $normalizer->validateKcseIndex($indexNum)) $errors[] = ['field' => 'kcse_index_number', 'message' => $err];
                if (empty($kcseYear)) $errors[] = ['field' => 'kcse_year', 'message' => 'KCSE year is required'];
                if (empty($programme)) $errors[] = ['field' => 'assigned_programme', 'message' => 'Programme/course is required'];

                // ── Warning-level validation ───────────────────────────────
                if (empty($gender))  $warnings[] = ['field' => 'gender',  'message' => 'Gender not provided'];
                if (empty($phone))   $warnings[] = ['field' => 'phone',   'message' => 'Phone number not provided'];
                if (empty($email))   $warnings[] = ['field' => 'email',   'message' => 'Email not provided'];
                if ($err = $normalizer->validatePhone($mapped['phone_number'] ?? null)) $warnings[] = ['field' => 'phone', 'message' => $err];
                if ($err = $normalizer->validateEmail($email)) $warnings[] = ['field' => 'email', 'message' => $err];
                if ($err = $normalizer->validateGender($mapped['gender'] ?? null)) $warnings[] = ['field' => 'gender', 'message' => $err];

                // ── Programme matching (only if index/programme present) ───
                $matchResult = ['status' => 'unmatched', 'programme_id' => null, 'confidence' => 0, 'suggestions' => []];
                if (!empty($programme) && empty(array_filter($errors, fn($e) => $e['field'] === 'assigned_programme'))) {
                    $matchResult = $matcher->match($programme);
                    if ($matchResult['status'] === 'unmatched' || $matchResult['confidence'] < 60) {
                        $errors[] = ['field' => 'assigned_programme', 'message' => "Programme not matched: {$programme}"];
                        $totals['unmatched_programme']++;
                    } elseif ($matchResult['confidence'] < 80) {
                        $warnings[] = ['field' => 'assigned_programme', 'message' => "Low-confidence programme match ({$matchResult['confidence']}%): {$programme}"];
                    }
                }

                // ── Duplicate detection ────────────────────────────────────
                $duplicateStatus = 'none';
                $existingRecordId = null;
                $dupKey = $indexNum . '/' . $kcseYear;

                if (!empty($indexNum)) {
                    if (isset($seenIndexes[$dupKey])) {
                        $duplicateStatus = 'file_duplicate';
                        $errors[] = ['field' => 'kcse_index_number', 'message' => "Duplicate index number in this file: {$indexNum}"];
                        $totals['duplicate']++;
                    } else {
                        $seenIndexes[$dupKey] = $rowNumber;
                        // Check system
                        $existing = KuccpsPlacement::where('kcse_index_number', $indexNum)
                            ->where('kcse_year', $kcseYear)
                            ->where('academic_year', $academicYear)
                            ->whereNull('rolled_back_at')
                            ->first();
                        if ($existing) {
                            $duplicateStatus  = 'system_duplicate';
                            $existingRecordId = $existing->id;
                            $warnings[] = ['field' => 'kcse_index_number', 'message' => "Student already placed in system for this intake"];
                            $totals['duplicate']++;
                        }
                    }
                }

                // ── Row status ─────────────────────────────────────────────
                $validationStatus = 'valid';
                if (!empty($errors)) {
                    $validationStatus = 'invalid';
                    $totals['invalid']++;
                } elseif (!empty($warnings)) {
                    $validationStatus = 'warning';
                    $totals['warning']++;
                } else {
                    $totals['valid']++;
                }

                $rowHash = $normalizer->rowHash($indexNum, (string)$kcseYear, $academicYear);

                KuccpsImportRow::create([
                    'batch_id'                    => $batch->id,
                    'row_number'                  => $rowNumber,
                    'raw_row_json'                => $rawRow,
                    'normalized_row_json'         => [
                        'full_name'           => $fullName,
                        'kcse_index_number'   => $indexNum,
                        'kcse_year'           => $kcseYear,
                        'assigned_programme'  => $programme,
                        'phone_number'        => $phone,
                        'email'               => $email,
                        'gender'              => $gender,
                        'national_id_number'  => $mapped['national_id_number'] ?? null,
                        'birth_certificate_number' => $mapped['birth_certificate_number'] ?? null,
                        'county'              => $mapped['county'] ?? null,
                        'secondary_school_name' => $mapped['secondary_school_name'] ?? null,
                        'mean_grade'          => $mapped['mean_grade'] ?? null,
                        'kuccps_reference'    => $mapped['kuccps_reference'] ?? null,
                        'placement_category'  => $mapped['placement_category'] ?? null,
                        'cluster_points'      => $mapped['cluster_points'] ?? null,
                    ],
                    'mapped_fields_json'          => $mapped,
                    'row_hash'                    => $rowHash,
                    'validation_status'           => $validationStatus,
                    'validation_errors_json'      => $errors,
                    'validation_warnings_json'    => $warnings,
                    'programme_match_status'      => $matchResult['status'],
                    'matched_programme_id'        => $matchResult['programme_id'],
                    'uploaded_programme_name'     => $programme,
                    'programme_match_confidence'  => $matchResult['confidence'],
                    'duplicate_status'            => $duplicateStatus,
                    'existing_record_id'          => $existingRecordId,
                    'import_status'               => 'pending',
                ]);
            }

            $hasInvalid   = $totals['invalid'] > 0;
            $hasWarnings  = $totals['warning'] > 0;
            $newStatus    = $hasInvalid ? 'validation_failed' : ($hasWarnings ? 'validation_passed' : 'awaiting_approval');

            $batch->update([
                'status'                  => $newStatus,
                'total_rows'              => $totals['total'],
                'valid_rows'              => $totals['valid'],
                'warning_rows'            => $totals['warning'],
                'invalid_rows'            => $totals['invalid'],
                'duplicate_rows'          => $totals['duplicate'],
                'unmatched_programme_rows'=> $totals['unmatched_programme'],
                'validation_summary_json' => $totals,
            ]);
        } catch (\Exception $e) {
            Log::error("KUCCPS batch validation failed: " . $e->getMessage());
            $batch->update(['status' => 'validation_failed']);
            throw $e;
        }
    }
}
