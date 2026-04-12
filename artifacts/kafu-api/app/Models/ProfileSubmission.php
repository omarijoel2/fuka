<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfileSubmission extends Model
{
    protected $fillable = [
        'user_id', 'content_id', 'workflow_status', 'version_number',
        'profile_data', 'section_completion', 'completeness_score',
        'submitted_by', 'submitted_at',
        'reviewed_by', 'reviewed_at',
        'approved_by', 'approved_at',
        'published_by', 'published_at',
        'reviewer_summary',
    ];

    protected function casts(): array
    {
        return [
            'profile_data' => 'array',
            'section_completion' => 'array',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'approved_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function content(): BelongsTo
    {
        return $this->belongsTo(CmsContent::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ProfileSubmissionComment::class, 'submission_id')->orderBy('created_at', 'asc');
    }

    public function submittedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function reviewedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function approvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
