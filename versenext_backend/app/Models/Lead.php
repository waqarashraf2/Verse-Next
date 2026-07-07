<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'source',
        'name',
        'email',
        'phone',
        'whatsapp',
        'service',
        'budget',
        'timeline',
        'notes',
        'metadata',
        'status',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}
