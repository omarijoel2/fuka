<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgrammeAlias extends Model
{
    protected $fillable = [
        'programme_id', 'alias_name', 'normalized_alias', 'source',
        'confidence_default', 'is_active', 'approved_by', 'approved_at',
    ];

    protected $casts = [
        'is_active'   => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function programme(): BelongsTo
    {
        return $this->belongsTo(AdmissionProgramme::class, 'programme_id');
    }
}
