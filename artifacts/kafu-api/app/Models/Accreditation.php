<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accreditation extends Model
{
    protected $fillable = [
        'body_name', 'slug', 'accreditation_type', 'programme', 'school_code',
        'status', 'award_date', 'expiry_date', 'certificate_url', 'logo_url',
        'description', 'sort_order', 'is_published',
    ];

    protected $casts = [
        'award_date' => 'date',
        'expiry_date' => 'date',
        'sort_order' => 'integer',
        'is_published' => 'boolean',
    ];
}
