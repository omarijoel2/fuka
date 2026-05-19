<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class KuccpsPlacement extends Model
{
    protected $table = 'kuccps_placements';

    protected $fillable = [
        'batch_id', 'source_row_id', 'applicant_id',
        'kuccps_reference', 'kcse_index_number', 'kcse_year',
        'full_name', 'gender', 'national_id_number', 'birth_certificate_number',
        'phone_number', 'email', 'county', 'secondary_school_name',
        'mean_grade', 'cluster_points', 'programme_id', 'uploaded_programme_name',
        'academic_year', 'intake_id', 'intake_period', 'placement_category',
        'admission_status', 'admission_letter_id', 'verification_token',
        'verified_at', 'biodata_completed_at', 'documents_completed_at', 'rolled_back_at',
    ];

    protected $casts = [
        'verified_at'            => 'datetime',
        'biodata_completed_at'   => 'datetime',
        'documents_completed_at' => 'datetime',
        'rolled_back_at'         => 'datetime',
    ];

    public function programme(): BelongsTo
    {
        return $this->belongsTo(AdmissionProgramme::class, 'programme_id');
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(KuccpsImportBatch::class, 'batch_id');
    }

    public function admissionLetter(): HasOne
    {
        return $this->hasOne(AdmissionLetter::class, 'placement_id');
    }

    public function intake(): BelongsTo
    {
        return $this->belongsTo(AdmissionIntake::class, 'intake_id');
    }
}
