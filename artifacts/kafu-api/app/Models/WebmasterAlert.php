<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebmasterAlert extends Model
{
    protected $fillable = [
        'type', 'severity', 'title', 'message', 'content_id',
        'status', 'resolved_by', 'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function content()
    {
        return $this->belongsTo(CmsContent::class, 'content_id');
    }

    public function resolver()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
