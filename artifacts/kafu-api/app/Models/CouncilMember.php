<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CouncilMember extends Model
{
    protected $fillable = [
        'name', 'title', 'photo_url', 'bio', 'credentials',
        'category', 'position_order', 'is_active',
    ];

    protected $casts = [
        'credentials' => 'array',
        'is_active'   => 'boolean',
    ];
}
