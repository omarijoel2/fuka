<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePoint extends Model
{
    protected $fillable = [
        'name', 'slug', 'category', 'campus_id', 'building',
        'contact_person', 'public_phone', 'public_email', 'whatsapp',
        'physical_location', 'latitude', 'longitude',
        'operating_hours', 'summary', 'support_scope', 'related_links',
        'hero_image', 'sort_order', 'status', 'seo_meta',
    ];

    protected $casts = [
        'operating_hours' => 'array',
        'related_links'   => 'array',
        'seo_meta'        => 'array',
        'latitude'        => 'float',
        'longitude'       => 'float',
    ];

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
