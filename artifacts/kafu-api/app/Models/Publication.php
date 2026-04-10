<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $fillable = [
        'title', 'slug', 'authors', 'year', 'journal', 'publisher', 'doi', 'url',
        'type', 'abstract', 'indexed_in', 'volume', 'issue', 'pages',
        'citation_key', 'project_id', 'is_published', 'is_featured',
    ];

    protected $casts = [
        'authors' => 'array',
        'indexed_in' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'year' => 'integer',
    ];

    public function project()
    {
        return $this->belongsTo(ResearchProject::class, 'project_id');
    }

    public function getCitationAttribute(): string
    {
        $authors = collect($this->authors ?? [])->map(function ($a) {
            if (is_array($a)) {
                return ($a['last_name'] ?? '') . ', ' . ($a['first_initial'] ?? '');
            }
            return $a;
        })->implode('; ');

        $parts = array_filter([
            $authors,
            "({$this->year})",
            $this->title ? "\"{$this->title}\"" : null,
            $this->journal ?? $this->publisher,
            $this->volume ? "Vol. {$this->volume}" : null,
            $this->issue ? "No. {$this->issue}" : null,
            $this->pages ? "pp. {$this->pages}" : null,
            $this->doi ? "DOI: {$this->doi}" : null,
        ]);

        return implode('. ', $parts) . '.';
    }
}
