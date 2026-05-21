<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchTheme extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'sdg_goals', 'colour', 'icon', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'sdg_goals' => 'array',
        'is_active' => 'boolean',
    ];

    public function projects()
    {
        return $this->hasMany(ResearchProject::class, 'theme_id');
    }
}
