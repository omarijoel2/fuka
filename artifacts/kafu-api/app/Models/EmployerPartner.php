<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployerPartner extends Model
{
    protected $fillable = [
        'name', 'slug', 'industry', 'partnership_status', 'internship_opportunities',
        'graduate_hires', 'logo_url', 'website_url', 'description', 'is_featured', 'is_published',
    ];

    protected $casts = [
        'internship_opportunities' => 'boolean',
        'graduate_hires' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];
}
