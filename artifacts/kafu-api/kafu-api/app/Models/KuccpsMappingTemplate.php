<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KuccpsMappingTemplate extends Model
{
    protected $fillable = [
        'template_name', 'template_code', 'source_type',
        'header_aliases', 'field_mappings',
        'default_intake_period', 'default_academic_year',
        'created_by', 'approved_by', 'approved_at', 'last_used_at',
        'is_active',
    ];

    protected $casts = [
        'header_aliases'  => 'array',
        'field_mappings'  => 'array',
        'is_active'       => 'boolean',
        'approved_at'     => 'datetime',
        'last_used_at'    => 'datetime',
    ];
}
