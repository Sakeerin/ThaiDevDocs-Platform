<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'provider',
        'provider_subscription_id',
        'variant_name',
        'status',
        'renews_at',
        'ends_at',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'renews_at' => 'datetime',
            'ends_at' => 'datetime',
            'meta' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
