<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ranking extends Model
{
    protected $fillable = [
        'organization', 'title', 'slug', 'rank_value', 'rank_numeric',
        'category', 'year', 'scope', 'logo_url', 'source_url',
        'description', 'sort_order', 'is_featured', 'is_published',
    ];

    protected $casts = [
        'rank_numeric' => 'integer',
        'year' => 'integer',
        'sort_order' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];
}
