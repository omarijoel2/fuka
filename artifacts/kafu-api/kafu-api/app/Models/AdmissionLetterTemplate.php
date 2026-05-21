<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmissionLetterTemplate extends Model
{
    protected $fillable = [
        'template_name', 'template_code', 'intake_period',
        'body_html', 'header_html', 'footer_html', 'variables_json',
        'registrar_name', 'reporting_date_text',
        'is_active', 'approved_by', 'approved_at',
    ];

    protected $casts = [
        'variables_json' => 'array',
        'is_active'      => 'boolean',
        'approved_at'    => 'datetime',
    ];
}
