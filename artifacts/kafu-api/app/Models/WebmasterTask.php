<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebmasterTask extends Model
{
    protected $fillable = [
        'title', 'description', 'type', 'priority', 'status',
        'assigned_to', 'assigned_by', 'content_id', 'due_date', 'completed_at',
    ];

    protected $casts = [
        'due_date'     => 'date',
        'completed_at' => 'datetime',
    ];

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function content()
    {
        return $this->belongsTo(CmsContent::class, 'content_id');
    }
}
