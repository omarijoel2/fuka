<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdmissionLetter extends Model
{
    protected $fillable = [
        'placement_id', 'application_id', 'template_id', 'letter_reference',
        'file_path', 'status', 'verification_code',
        'generated_at', 'generated_by',
        'downloaded_count', 'last_downloaded_at',
        'revoked_at', 'revoked_by', 'revoke_reason',
    ];

    protected $casts = [
        'generated_at'       => 'datetime',
        'last_downloaded_at' => 'datetime',
        'revoked_at'         => 'datetime',
    ];

    public function placement(): BelongsTo
    {
        return $this->belongsTo(KuccpsPlacement::class, 'placement_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(AdmissionLetterTemplate::class, 'template_id');
    }

    public function downloadLogs(): HasMany
    {
        return $this->hasMany(AdmissionLetterDownloadLog::class, 'admission_letter_id');
    }
}
