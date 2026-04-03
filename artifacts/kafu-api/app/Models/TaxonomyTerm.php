<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaxonomyTerm extends Model
{
    protected $table = 'taxonomy_terms';

    protected $fillable = [
        'vocabulary', 'name', 'slug', 'description', 'parent_id',
        'is_controlled', 'created_by_role',
    ];

    protected $casts = [
        'is_controlled' => 'boolean',
    ];

    public static function vocabularies(): array
    {
        return [
            'section'           => 'Site Section',
            'category'          => 'Category',
            'department'        => 'Department / Office',
            'school'            => 'School / Faculty',
            'programme_level'   => 'Programme Level',
            'opportunity_type'  => 'Opportunity Type',
            'news_tag'          => 'News Tag',
            'event_type'        => 'Event Type',
            'audience'          => 'Audience Type',
            'status_label'      => 'Status Label',
            'campus'            => 'Campus / Location',
            'research_theme'    => 'Research Theme',
        ];
    }
}
