<?php

namespace App\Jobs;

use App\Models\KuccpsImportBatch;
use App\Models\KuccpsPlacement;
use App\Models\AdmissionLetterTemplate;
use App\Services\AdmissionLetterService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateAdmissionLettersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int  $batchId,
        public ?int $templateId = null,
        public ?int $generatedBy = null
    ) {}

    public function handle(AdmissionLetterService $service): void
    {
        $batch    = KuccpsImportBatch::findOrFail($this->batchId);
        $template = AdmissionLetterTemplate::find($this->templateId ?? $batch->admission_letter_template_id);

        if (!$template) {
            Log::error("GenerateAdmissionLetters: no template for batch {$this->batchId}");
            return;
        }

        $placements = KuccpsPlacement::where('batch_id', $this->batchId)
            ->whereNull('rolled_back_at')
            ->whereNull('admission_letter_id')
            ->get();

        foreach ($placements as $placement) {
            try {
                $service->generateForPlacement($placement, $template, $this->generatedBy);
            } catch (\Exception $e) {
                Log::error("Letter gen failed for placement {$placement->id}: " . $e->getMessage());
            }
        }
    }
}
