<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GalleryAlbum extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'category',
        'cover_image_url', 'album_date', 'is_published', 'sort_order',
    ];

    protected $casts = [
        'album_date'   => 'date',
        'is_published' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(GalleryItem::class, 'album_id');
    }

    public function publishedItems(): HasMany
    {
        return $this->hasMany(GalleryItem::class, 'album_id')
                    ->where('is_published', true)
                    ->orderBy('sort_order');
    }
}
