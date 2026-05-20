<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManagementProfile extends Model
{
    protected $fillable = [
        'name', 'title', 'photo_url', 'bio', 'email',
        'office', 'phone', 'category', 'position_order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
