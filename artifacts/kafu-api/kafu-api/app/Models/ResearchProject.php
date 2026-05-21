<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchProject extends Model
{
    protected $fillable = [
        'title', 'slug', 'abstract', 'department', 'lead_researcher_slug',
        'lead_researcher_name', 'co_researchers', 'theme_id', 'status',
        'start_date', 'end_date', 'funding_source', 'grant_id', 'budget', 'currency',
        'sdg_goals', 'featured_image_url', 'outputs', 'is_published', 'is_featured',
        'seo_meta',
    ];

    protected $casts = [
        'co_researchers' => 'array',
        'sdg_goals' => 'array',
        'outputs' => 'array',
        'seo_meta' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
    ];

    public function theme()
    {
        return $this->belongsTo(ResearchTheme::class, 'theme_id');
    }

    public function publications()
    {
        return $this->hasMany(Publication::class, 'project_id');
    }

    public function grant()
    {
        return $this->hasOne(ResearchGrant::class, 'project_id');
    }
}
