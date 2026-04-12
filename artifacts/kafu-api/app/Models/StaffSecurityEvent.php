<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffSecurityEvent extends Model
{
    protected $fillable = [
        'user_id', 'email', 'event_type',
        'ip_address', 'user_agent', 'metadata',
    ];

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function log(string $type, ?int $userId, ?string $email, array $meta = [], ?string $ip = null, ?string $ua = null): void
    {
        static::create([
            'user_id' => $userId,
            'email' => $email,
            'event_type' => $type,
            'ip_address' => $ip,
            'user_agent' => $ua,
            'metadata' => $meta ?: null,
        ]);
    }
}
