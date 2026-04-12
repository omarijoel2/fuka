<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExchangeProgramme extends Model
{
    protected $fillable = [
        'slug', 'title', 'type', 'partnership_id', 'partner_name', 'partner_country',
        'description', 'duration_weeks', 'duration_label', 'application_deadline',
        'next_intake', 'slots_available', 'stipend_amount', 'stipend_currency',
        'eligibility', 'benefits', 'required_documents', 'status', 'is_featured',
    ];

    protected $casts = [
        'eligibility' => 'array',
        'benefits' => 'array',
        'required_documents' => 'array',
        'application_deadline' => 'date',
        'is_featured' => 'boolean',
        'stipend_amount' => 'decimal:2',
    ];

    public function partnership(): BelongsTo
    {
        return $this->belongsTo(InternationalPartnership::class, 'partnership_id');
    }
}
