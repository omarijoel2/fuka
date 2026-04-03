<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsRevision extends Model
{
    protected $table = 'cms_revisions';

    protected $fillable = [
        'content_id', 'version', 'status', 'snapshot', 'created_by', 'change_summary',
    ];

    protected $casts = [
        'snapshot' => 'array',
    ];

    public function content()
    {
        return $this->belongsTo(CmsContent::class, 'content_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
