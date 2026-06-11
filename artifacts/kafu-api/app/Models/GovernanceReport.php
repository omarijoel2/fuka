<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GovernanceReport extends Model
{
    protected $fillable = [
        'type', 'title', 'period_start', 'period_end',
        'payload', 'generated_by', 'status',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end'   => 'date',
        'payload'      => 'array',
    ];

    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
