<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'service',
        'preferred_date',
        'preferred_time',
        'meeting_type',
        'notes',
        'status',
    ];

    protected $casts = [
        'preferred_date' => 'date',
    ];
}
