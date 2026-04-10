<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchPartner extends Model
{
    protected $fillable = [
        'name', 'slug', 'type', 'country', 'country_code', 'description',
        'logo_url', 'website_url', 'collaboration_areas', 'is_active', 'is_featured',
    ];

    protected $casts = [
        'collaboration_areas' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];
}
