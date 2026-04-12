<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfileSubmissionComment extends Model
{
    protected $fillable = [
        'submission_id', 'author_id', 'section', 'comment', 'comment_type',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ProfileSubmission::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
