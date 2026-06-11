<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlumniStory extends Model
{
    protected $fillable = [
        'title', 'slug', 'alumni_id', 'alumni_name', 'programme', 'graduation_year',
        'summary', 'body', 'video_url', 'photo_url', 'is_featured', 'is_published', 'seo_meta',
    ];

    protected $casts = [
        'graduation_year' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'seo_meta' => 'array',
    ];

    public function alumni()
    {
        return $this->belongsTo(AlumniProfile::class, 'alumni_id');
    }
}
