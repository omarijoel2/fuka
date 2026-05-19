<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmissionIntake extends Model
{
    protected $table = 'admissions_intakes';

    protected $fillable = [
        'name', 'academic_year', 'intake_period', 'open_at', 'close_at',
        'status', 'is_published',
        'application_fee_undergraduate', 'application_fee_masters', 'application_fee_phd',
        'allow_kuccps', 'allow_self_sponsored_ug', 'allow_masters', 'allow_phd',
        'allow_late_applications', 'late_application_close_at', 'notes', 'created_by',
    ];

    protected $casts = [
        'open_at'                  => 'datetime',
        'close_at'                 => 'datetime',
        'late_application_close_at'=> 'datetime',
        'is_published'             => 'boolean',
        'allow_kuccps'             => 'boolean',
        'allow_self_sponsored_ug'  => 'boolean',
        'allow_masters'            => 'boolean',
        'allow_phd'                => 'boolean',
        'allow_late_applications'  => 'boolean',
    ];
}
