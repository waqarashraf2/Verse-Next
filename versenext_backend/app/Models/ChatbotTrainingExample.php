<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ChatbotTrainingExample extends Model
{
    protected $fillable = [
        'question',
        'normalized_question',
        'answer',
        'intent',
        'service',
        'source',
        'hit_count',
        'last_used_at',
        'is_active',
        'metadata',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
