<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicCalendarEvent extends Model
{
    protected $table = 'academic_calendar_events';

    protected $fillable = [
        'title', 'description', 'start_date', 'end_date',
        'category', 'academic_year', 'semester',
        'is_allday', 'is_published', 'sort_order',
    ];

    protected $casts = [
        'start_date'   => 'date',
        'end_date'     => 'date',
        'is_allday'    => 'boolean',
        'is_published' => 'boolean',
    ];
}
