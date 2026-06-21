<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'github_id',
        'github_login',
        'avatar_url',
        'is_pro',
        'pro_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'pro_expires_at' => 'datetime',
            'is_pro' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function aiQueries(): HasMany
    {
        return $this->hasMany(AiQuery::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}
