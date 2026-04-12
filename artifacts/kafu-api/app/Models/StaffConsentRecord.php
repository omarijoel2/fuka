<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffConsentRecord extends Model
{
    protected $fillable = [
        'user_id', 'policy_version', 'consent_type',
        'accepted_at', 'accepted_ip', 'accepted_user_agent', 'is_current',
    ];

    protected function casts(): array
    {
        return [
            'accepted_at' => 'datetime',
            'is_current' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
