<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    protected $fillable = [
        'name', 'slug', 'summary', 'description', 'address', 'county', 'region',
        'latitude', 'longitude', 'hero_image', 'gallery_images',
        'contact_email', 'contact_phone', 'visitor_notes', 'transport_notes',
        'sort_order', 'status',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'latitude'       => 'float',
        'longitude'      => 'float',
    ];

    public function servicePoints()
    {
        return $this->hasMany(ServicePoint::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
