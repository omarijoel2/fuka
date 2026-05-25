<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Directorate extends Model
{
    protected $fillable = [
        'name', 'slug', 'tagline', 'description',
        'director_name', 'director_title', 'director_photo_url',
        'director_bio', 'director_message', 'director_email', 'director_phone',
        'functions', 'services', 'quick_links', 'staff_roster',
        'position_order', 'is_active',
    ];

    protected $casts = [
        'functions'    => 'array',
        'services'     => 'array',
        'quick_links'  => 'array',
        'staff_roster' => 'array',
        'is_active'    => 'boolean',
    ];
}
