<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'school_code', 'name', 'slug', 'description', 'vision',
        'hod_name', 'hod_title', 'hod_email', 'hod_phone',
        'hod_photo_url', 'hod_bio',
        'office_location', 'email', 'phone',
        'is_active', 'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
