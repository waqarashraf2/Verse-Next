<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class KnowledgeBaseEntry extends Model
{
    protected $fillable = [
        'type',
        'title',
        'slug',
        'summary',
        'content',
        'data',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'data' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(function (KnowledgeBaseEntry $entry) {
            if (!$entry->slug) {
                $entry->slug = Str::slug($entry->type.' '.$entry->title);
            }
        });
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order')->orderBy('title');
    }
}
