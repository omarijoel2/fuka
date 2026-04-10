<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchGrant extends Model
{
    protected $fillable = [
        'name', 'funder', 'funder_type', 'funder_country', 'amount', 'currency',
        'start_date', 'end_date', 'description', 'status', 'project_id',
        'grant_number', 'is_visible',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_visible' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function project()
    {
        return $this->belongsTo(ResearchProject::class, 'project_id');
    }
}
