<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdmissionProgramme extends Model
{
    protected $table = 'admission_programmes';

    protected $fillable = [
        'programme_code', 'programme_name', 'school_code', 'department',
        'level', 'duration', 'mode', 'campus',
        'minimum_requirements', 'available_intakes', 'available_pathways',
        'required_documents', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'available_intakes'   => 'array',
        'available_pathways'  => 'array',
        'required_documents'  => 'array',
        'is_active'           => 'boolean',
    ];

    public function aliases(): HasMany
    {
        return $this->hasMany(ProgrammeAlias::class, 'programme_id');
    }

    public function placements(): HasMany
    {
        return $this->hasMany(KuccpsPlacement::class, 'programme_id');
    }
}
