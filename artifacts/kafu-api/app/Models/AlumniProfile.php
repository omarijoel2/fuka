<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlumniProfile extends Model
{
    protected $fillable = [
        'name', 'slug', 'programme', 'school_code', 'graduation_year',
        'current_role', 'current_organization', 'country', 'industry', 'sector',
        'achievements', 'bio', 'photo_url', 'linkedin_url', 'featured_category',
        'visibility', 'is_featured', 'is_published', 'seo_meta',
    ];

    protected $casts = [
        'graduation_year' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'seo_meta' => 'array',
    ];

    public function stories()
    {
        return $this->hasMany(AlumniStory::class, 'alumni_id');
    }
}
