<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GraduateOutcome extends Model
{
    protected $fillable = [
        'programme', 'programme_slug', 'school_code', 'cohort_year',
        'employment_rate', 'further_study_rate', 'entrepreneurship_rate',
        'avg_time_to_employment_months', 'sample_size', 'top_employers',
        'top_sectors', 'notes', 'is_published',
    ];

    protected $casts = [
        'cohort_year' => 'integer',
        'employment_rate' => 'decimal:2',
        'further_study_rate' => 'decimal:2',
        'entrepreneurship_rate' => 'decimal:2',
        'avg_time_to_employment_months' => 'integer',
        'sample_size' => 'integer',
        'top_employers' => 'array',
        'top_sectors' => 'array',
        'is_published' => 'boolean',
    ];
}
