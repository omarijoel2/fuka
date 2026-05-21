<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InternationalPartnership extends Model
{
    protected $fillable = [
        'slug', 'name', 'short_name', 'country', 'country_code', 'type', 'status',
        'description', 'logo_url', 'website_url', 'mou_date', 'mou_expiry',
        'collaboration_areas', 'contact_person', 'is_featured', 'sort_order',
    ];

    protected $casts = [
        'collaboration_areas' => 'array',
        'contact_person' => 'array',
        'mou_date' => 'date',
        'mou_expiry' => 'date',
        'is_featured' => 'boolean',
    ];

    public function exchangeProgrammes(): HasMany
    {
        return $this->hasMany(ExchangeProgramme::class, 'partnership_id');
    }
}
