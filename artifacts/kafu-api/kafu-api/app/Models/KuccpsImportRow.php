<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KuccpsImportRow extends Model
{
    protected $fillable = [
        'batch_id', 'row_number', 'raw_row_json', 'normalized_row_json',
        'mapped_fields_json', 'row_hash', 'validation_status',
        'validation_errors_json', 'validation_warnings_json',
        'programme_match_status', 'matched_programme_id', 'uploaded_programme_name',
        'programme_match_confidence', 'duplicate_status', 'existing_record_id',
        'import_status', 'imported_record_id', 'import_error',
    ];

    protected $casts = [
        'raw_row_json'            => 'array',
        'normalized_row_json'     => 'array',
        'mapped_fields_json'      => 'array',
        'validation_errors_json'  => 'array',
        'validation_warnings_json'=> 'array',
    ];

    public function batch(): BelongsTo
    {
        return $this->belongsTo(KuccpsImportBatch::class, 'batch_id');
    }

    public function matchedProgramme(): BelongsTo
    {
        return $this->belongsTo(AdmissionProgramme::class, 'matched_programme_id');
    }
}
