<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Redirect extends Model
{
    protected $fillable = [
        'source_path',
        'destination_url',
        'type',
        'is_active',
        'hit_count',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'type' => 'integer',
        'hit_count' => 'integer',
    ];
}
