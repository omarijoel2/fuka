<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstitutionalKpi extends Model
{
    protected $fillable = [
        'label', 'slug', 'category', 'value', 'display_value', 'unit',
        'period_year', 'trend', 'trend_value', 'icon', 'description',
        'series', 'sort_order', 'is_featured', 'is_published',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'period_year' => 'integer',
        'trend_value' => 'decimal:2',
        'series' => 'array',
        'sort_order' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];
}
