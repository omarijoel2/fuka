<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdmissionLetterDownloadLog extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'admission_letter_id', 'placement_id', 'ip_address',
        'user_agent', 'verification_method', 'downloaded_at',
    ];

    protected $casts = ['downloaded_at' => 'datetime'];

    public function letter(): BelongsTo
    {
        return $this->belongsTo(AdmissionLetter::class, 'admission_letter_id');
    }
}
