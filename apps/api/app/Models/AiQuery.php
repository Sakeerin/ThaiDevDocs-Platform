<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiQuery extends Model
{
    protected $fillable = [
        'user_id',
        'question',
        'article_slug',
        'tokens_used',
        'response_time_ms',
        'sources',
    ];

    protected function casts(): array
    {
        return [
            'sources' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
