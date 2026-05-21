<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KuccpsImportBatch extends Model
{
    protected $fillable = [
        'batch_reference', 'original_filename', 'stored_file_path', 'file_type',
        'file_hash', 'selected_sheet_name', 'header_row_number', 'skip_top_rows',
        'academic_year', 'intake_id', 'pathway_id', 'programme_level',
        'admission_letter_template_id', 'reporting_date_text',
        'mapping_json', 'mapping_template_id', 'validation_summary_json',
        'error_report_path', 'status',
        'total_rows', 'valid_rows', 'warning_rows', 'invalid_rows',
        'duplicate_rows', 'unmatched_programme_rows', 'imported_rows',
        'uploaded_by', 'approved_by', 'approved_at', 'approval_comments',
        'imported_by', 'imported_at',
        'rolled_back_by', 'rolled_back_at', 'rollback_reason',
    ];

    protected $casts = [
        'mapping_json'            => 'array',
        'validation_summary_json' => 'array',
        'approved_at'             => 'datetime',
        'imported_at'             => 'datetime',
        'rolled_back_at'          => 'datetime',
    ];

    public function rows(): HasMany
    {
        return $this->hasMany(KuccpsImportRow::class, 'batch_id');
    }

    public function intake(): BelongsTo
    {
        return $this->belongsTo(AdmissionIntake::class, 'intake_id');
    }

    public function letterTemplate(): BelongsTo
    {
        return $this->belongsTo(AdmissionLetterTemplate::class, 'admission_letter_template_id');
    }
}
