<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsContent extends Model
{
    protected $table = 'cms_content';

    protected $fillable = [
        'type', 'title', 'slug', 'summary', 'body', 'status',
        'department', 'school_code', 'author_id', 'reviewer_id', 'approver_id',
        'category', 'featured_image', 'featured', 'seo_meta', 'structured_data',
        'tags', 'related_ids', 'publish_date', 'expiry_date',
        'reviewed_at', 'approved_at', 'published_at', 'archived_at',
        'current_version', 'is_deleted',
    ];

    protected $casts = [
        'seo_meta' => 'array',
        'structured_data' => 'array',
        'tags' => 'array',
        'related_ids' => 'array',
        'featured' => 'boolean',
        'is_deleted' => 'boolean',
        'publish_date' => 'datetime',
        'expiry_date' => 'datetime',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'published_at' => 'datetime',
        'archived_at' => 'datetime',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function revisions()
    {
        return $this->hasMany(CmsRevision::class, 'content_id')->orderByDesc('version');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type)->where('is_deleted', false);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')->where('is_deleted', false);
    }

    public function scopeForRole($query, User $user)
    {
        if (in_array($user->role, ['super_admin', 'ict_admin', 'communications_admin'])) {
            return $query;
        }
        if (in_array($user->role, ['reviewer'])) {
            return $query->where(function ($q) use ($user) {
                $q->where('author_id', $user->id)
                  ->orWhere('reviewer_id', $user->id)
                  ->orWhere('department', $user->department);
            });
        }
        return $query->where('author_id', $user->id);
    }

    public static function allowedTransitions(): array
    {
        return [
            'draft'         => ['submitted'],
            'submitted'     => ['under_review', 'draft'],
            'under_review'  => ['approved', 'draft'],
            'approved'      => ['scheduled', 'published', 'draft'],
            'scheduled'     => ['published', 'draft'],
            'published'     => ['unpublished', 'archived'],
            'unpublished'   => ['published', 'archived', 'draft'],
            'archived'      => [],
        ];
    }

    public static function roleTransitionPermissions(): array
    {
        return [
            'draft'        => ['super_admin', 'ict_admin', 'communications_admin', 'department_editor', 'admissions_owner', 'academic_owner', 'procurement_owner', 'hr_owner', 'research_owner', 'student_affairs_owner', 'staff_user'],
            'submitted'    => ['super_admin', 'ict_admin', 'communications_admin', 'reviewer'],
            'under_review' => ['super_admin', 'ict_admin', 'communications_admin', 'reviewer'],
            'approved'     => ['super_admin', 'ict_admin', 'communications_admin'],
            'scheduled'    => ['super_admin', 'ict_admin', 'communications_admin'],
            'published'    => ['super_admin', 'ict_admin', 'communications_admin'],
            'unpublished'  => ['super_admin', 'ict_admin', 'communications_admin'],
            'archived'     => ['super_admin', 'ict_admin', 'communications_admin'],
        ];
    }
}
