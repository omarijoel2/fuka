<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdmissionApplicant extends Model
{
    protected $table = 'applicants';

    protected $fillable = [
        'email', 'phone', 'password_hash', 'full_name', 'gender',
        'date_of_birth', 'nationality', 'id_document_type', 'id_document_number',
        'county', 'sub_county', 'postal_address', 'physical_address',
        'emergency_contact_name', 'emergency_contact_phone',
        'has_disability', 'disability_description',
        'email_verified', 'email_verified_at', 'otp_code', 'otp_expires_at',
        'portal_token',
    ];

    protected $hidden = ['password_hash'];

    protected $casts = [
        'email_verified'     => 'boolean',
        'has_disability'     => 'boolean',
        'email_verified_at'  => 'datetime',
        'otp_expires_at'     => 'datetime',
    ];
}
