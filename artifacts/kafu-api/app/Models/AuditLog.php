<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_logs';
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'user_name', 'user_role', 'action',
        'entity_type', 'entity_id', 'entity_title',
        'before', 'after', 'ip_address', 'user_agent', 'notes', 'created_at',
    ];

    protected $casts = [
        'before' => 'array',
        'after' => 'array',
        'created_at' => 'datetime',
    ];

    public static function record(
        ?User $user,
        string $action,
        ?string $entityType = null,
        ?int $entityId = null,
        ?string $entityTitle = null,
        ?array $before = null,
        ?array $after = null,
        ?string $notes = null
    ): void {
        static::create([
            'user_id'      => $user?->id,
            'user_name'    => $user?->name,
            'user_role'    => $user?->role,
            'action'       => $action,
            'entity_type'  => $entityType,
            'entity_id'    => $entityId,
            'entity_title' => $entityTitle,
            'before'       => $before,
            'after'        => $after,
            'ip_address'   => request()->ip(),
            'user_agent'   => substr(request()->userAgent() ?? '', 0, 200),
            'notes'        => $notes,
            'created_at'   => now(),
        ]);
    }
}
