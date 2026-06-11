<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentReview extends Model
{
    protected $fillable = [
        'content_id', 'last_reviewed_at', 'next_review_due',
        'review_frequency_days', 'owner_id', 'notes',
    ];

    protected $casts = [
        'last_reviewed_at' => 'date',
        'next_review_due'  => 'date',
        'review_frequency_days' => 'integer',
    ];

    public function content()
    {
        return $this->belongsTo(CmsContent::class, 'content_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
