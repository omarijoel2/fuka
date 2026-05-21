<?php

namespace App\Http\Controllers;

use App\Models\AdmissionLetter;
use App\Models\AdmissionLetterDownloadLog;
use App\Models\KuccpsPlacement;
use App\Services\AdmissionLetterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class KuccpsVerificationController extends Controller
{
    public function __construct(private AdmissionLetterService $service) {}

    /**
     * POST /api/kuccps/verify-placement
     * Rate limited. Returns masked placement data on success.
     */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'kcse_index_number'   => 'required|string',
            'kcse_year'           => 'required|string',
            'id_number'           => 'nullable|string',
            'phone_number'        => 'nullable|string',
        ]);

        $normalizer = app(\App\Services\DataNormalizerService::class);
        $idxData    = $normalizer->normalizeKcseIndex($request->kcse_index_number);
        $indexNum   = $idxData['index'];
        $kcseYear   = $idxData['year'] ?? $request->kcse_year;

        $query = KuccpsPlacement::where('kcse_index_number', $indexNum)
            ->where('kcse_year', $kcseYear)
            ->whereNull('rolled_back_at');

        $candidates = $query->get();

        if ($candidates->isEmpty()) {
            // Log failed attempt
            \Log::info("KUCCPS verification failed: index={$indexNum}, year={$kcseYear}, ip=" . $request->ip());
            return response()->json([
                'verified' => false,
                'message'  => 'We could not verify your placement using the details provided. Please confirm your KUCCPS details or contact Admissions.',
            ], 404);
        }

        // Additional verification if multiple matches
        $placement = $candidates->first();

        if ($candidates->count() > 1) {
            // Try to narrow by ID or phone
            if ($request->filled('id_number')) {
                $byId = $candidates->firstWhere('national_id_number', $request->id_number);
                if ($byId) $placement = $byId;
            } elseif ($request->filled('phone_number')) {
                $byPhone = $candidates->first(fn($p) => str_contains($p->phone_number ?? '', substr($request->phone_number, -6)));
                if ($byPhone) $placement = $byPhone;
            } else {
                return response()->json([
                    'verified'          => false,
                    'multiple_matches'  => true,
                    'message'           => 'Multiple records found. Please provide your ID number or phone for additional verification.',
                ]);
            }
        }

        // Check letter status
        $letter = AdmissionLetter::where('placement_id', $placement->id)
            ->where('status', '!=', 'revoked')
            ->first();

        $letterReady = $letter && in_array($letter->status, ['generated', 'downloaded']);

        $programme = $placement->programme;

        return response()->json([
            'verified'          => true,
            'verification_token'=> $placement->verification_token,
            'student'           => [
                'full_name'         => $placement->full_name,
                'programme_name'    => $programme?->programme_name ?? $placement->uploaded_programme_name,
                'school_name'       => $programme?->school_code,
                'academic_year'     => $placement->academic_year,
                'admission_status'  => $placement->admission_status,
                'index_number_masked' => substr($placement->kcse_index_number, 0, 4) . '****' . substr($placement->kcse_index_number, -3),
            ],
            'letter_ready'      => $letterReady,
            'message'           => $letterReady
                ? 'Placement verified. Your admission letter is ready for download.'
                : 'Your placement has been verified, but your admission letter is being prepared. Please check again later.',
        ]);
    }

    // GET /api/kuccps/placement/{token}
    public function placementDetails(string $token): JsonResponse
    {
        $placement = KuccpsPlacement::where('verification_token', $token)->whereNull('rolled_back_at')->first();
        if (!$placement) {
            return response()->json(['message' => 'Invalid or expired verification token'], 404);
        }

        $programme = $placement->programme;
        $letter    = AdmissionLetter::where('placement_id', $placement->id)
            ->where('status', '!=', 'revoked')->first();

        return response()->json([
            'full_name'        => $placement->full_name,
            'kcse_index_number'=> substr($placement->kcse_index_number, 0, 4) . '****' . substr($placement->kcse_index_number, -3),
            'programme'        => $programme?->programme_name ?? $placement->uploaded_programme_name,
            'school'           => $programme?->school_code,
            'academic_year'    => $placement->academic_year,
            'admission_status' => $placement->admission_status,
            'letter_ready'     => $letter && in_array($letter->status, ['generated', 'downloaded']),
            'letter_reference' => $letter?->letter_reference,
        ]);
    }

    // GET /api/kuccps/admission-letter/{token}/download
    public function downloadLetter(Request $request, string $token): Response|JsonResponse
    {
        $placement = KuccpsPlacement::where('verification_token', $token)->whereNull('rolled_back_at')->first();
        if (!$placement) {
            return response()->json(['message' => 'Invalid token'], 404);
        }

        $letter = AdmissionLetter::where('placement_id', $placement->id)
            ->whereIn('status', ['generated', 'downloaded'])
            ->first();

        if (!$letter) {
            return response()->json(['message' => 'Admission letter is not yet ready. Please contact Admissions.'], 404);
        }

        $pdf = $this->service->getLetterStream($letter);
        if (!$pdf) {
            return response()->json(['message' => 'Letter file unavailable. Please contact Admissions.'], 404);
        }

        // Log download
        AdmissionLetterDownloadLog::create([
            'admission_letter_id' => $letter->id,
            'placement_id'        => $placement->id,
            'ip_address'          => $request->ip(),
            'user_agent'          => substr($request->userAgent() ?? '', 0, 500),
            'verification_method' => 'token',
            'downloaded_at'       => now(),
        ]);

        $letter->increment('downloaded_count');
        $letter->update(['last_downloaded_at' => now(), 'status' => 'downloaded']);

        $placement->update(['verified_at' => now()]);

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="KAFU-Admission-Letter-' . $placement->kcse_index_number . '.pdf"',
        ]);
    }
}
