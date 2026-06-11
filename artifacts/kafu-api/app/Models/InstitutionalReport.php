<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstitutionalReport extends Model
{
    protected $fillable = [
        'title', 'slug', 'report_type', 'year', 'description',
        'file_url', 'file_size', 'published_date', 'sort_order',
        'is_featured', 'is_published',
    ];

    protected $casts = [
        'year' => 'integer',
        'published_date' => 'date',
        'sort_order' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];
}
