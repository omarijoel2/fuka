<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'file_url',
        'file_name',
        'file_size',
        'issued_date',
        'is_active',
    ];

    protected $casts = [
        'issued_date' => 'date',
        'is_active'   => 'boolean',
    ];
}
