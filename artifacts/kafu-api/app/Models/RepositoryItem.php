<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepositoryItem extends Model
{
    protected $fillable = [
        'slug', 'title', 'type', 'abstract', 'authors', 'keywords',
        'department', 'research_theme', 'year', 'publisher', 'journal_name',
        'volume', 'issue', 'pages', 'doi', 'isbn_issn', 'file_url',
        'file_size_kb', 'language', 'license', 'access', 'embargo_until',
        'funded_by', 'student_name', 'supervisor', 'degree',
        'citation_count', 'downloads', 'views', 'status',
    ];

    protected $casts = [
        'authors'  => 'array',
        'keywords' => 'array',
        'embargo_until' => 'date',
    ];

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
