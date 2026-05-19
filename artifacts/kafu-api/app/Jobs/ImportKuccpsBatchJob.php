<?php

namespace App\Jobs;

use App\Models\KuccpsImportBatch;
use App\Models\KuccpsImportRow;
use App\Models\KuccpsPlacement;
use App\Models\AdmissionApplicant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ImportKuccpsBatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $batchId) {}

    public function handle(): void
    {
        $batch = KuccpsImportBatch::findOrFail($this->batchId);

        if ($batch->status !== 'approved') {
            Log::warning("ImportKuccpsBatch: batch {$this->batchId} is not approved (status: {$batch->status})");
            return;
        }

        $batch->update(['status' => 'importing']);
        $importedCount = 0;

        // Import rows that are valid or warning, not system_duplicate or file_duplicate hard errors
        $rows = KuccpsImportRow::where('batch_id', $batch->id)
            ->whereIn('validation_status', ['valid', 'warning'])
            ->where('import_status', 'pending')
            ->get();

        foreach ($rows as $row) {
            try {
                DB::transaction(function () use ($row, $batch, &$importedCount) {
                    $norm = $row->normalized_row_json ?? [];

                    // Idempotent: check if already imported by row_hash
                    $existing = KuccpsPlacement::where('batch_id', $batch->id)
                        ->where('kcse_index_number', $norm['kcse_index_number'] ?? '')
                        ->where('kcse_year', $norm['kcse_year'] ?? '')
                        ->first();

                    if ($existing) {
                        $row->update(['import_status' => 'skipped', 'import_error' => 'Already imported']);
                        return;
                    }

                    // Ensure applicant stub exists
                    $applicant = null;
                    if (!empty($norm['email'])) {
                        $applicant = AdmissionApplicant::firstOrCreate(
                            ['email' => $norm['email']],
                            [
                                'full_name'   => $norm['full_name'] ?? '',
                                'phone'       => $norm['phone_number'] ?? '',
                                'password'    => bcrypt(Str::random(16)),
                                'is_verified' => false,
                            ]
                        );
                    }

                    $placement = KuccpsPlacement::create([
                        'batch_id'                  => $batch->id,
                        'source_row_id'             => $row->id,
                        'kuccps_reference'          => $norm['kuccps_reference'] ?? null,
                        'kcse_index_number'         => $norm['kcse_index_number'] ?? '',
                        'kcse_year'                 => $norm['kcse_year'] ?? '',
                        'full_name'                 => $norm['full_name'] ?? '',
                        'gender'                    => $norm['gender'] ?? null,
                        'national_id_number'        => $norm['national_id_number'] ?? null,
                        'birth_certificate_number'  => $norm['birth_certificate_number'] ?? null,
                        'phone_number'              => $norm['phone_number'] ?? null,
                        'email'                     => $norm['email'] ?? null,
                        'county'                    => $norm['county'] ?? null,
                        'secondary_school_name'     => $norm['secondary_school_name'] ?? null,
                        'mean_grade'                => $norm['mean_grade'] ?? null,
                        'cluster_points'            => $norm['cluster_points'] ?? null,
                        'programme_id'              => $row->matched_programme_id,
                        'uploaded_programme_name'   => $row->uploaded_programme_name,
                        'academic_year'             => $batch->academic_year ?? '',
                        'intake_id'                 => $batch->intake_id,
                        'placement_category'        => $norm['placement_category'] ?? 'government',
                        'admission_status'          => 'placed',
                        'verification_token'        => Str::random(48),
                        'applicant_id'              => $applicant?->id,
                    ]);

                    $row->update([
                        'import_status'     => 'imported',
                        'imported_record_id'=> $placement->id,
                    ]);

                    $importedCount++;
                });
            } catch (\Exception $e) {
                Log::error("Row import failed (batch {$this->batchId}, row {$row->id}): " . $e->getMessage());
                $row->update(['import_status' => 'failed', 'import_error' => $e->getMessage()]);
            }
        }

        $failedCount = KuccpsImportRow::where('batch_id', $batch->id)->where('import_status', 'failed')->count();
        $newStatus   = $failedCount > 0 ? 'imported_with_exceptions' : 'imported';

        $batch->update([
            'status'        => $newStatus,
            'imported_rows' => $importedCount,
            'imported_at'   => now(),
        ]);
    }
}
