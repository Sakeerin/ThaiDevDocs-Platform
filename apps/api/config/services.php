<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'thaidevdocs' => [
        'sync_secret' => env('API_SYNC_SECRET'),
    ],

    'embeddings' => [
        'provider' => env('EMBEDDING_PROVIDER', 'mock'),
        'model' => env('EMBEDDING_MODEL', 'text-embedding-3-small'),
        'key' => env('OPENAI_API_KEY'),
    ],

    'anthropic' => [
        'key' => env('ANTHROPIC_API_KEY'),
        'model' => env('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514'),
    ],

    'ai' => [
        'daily_limit' => env('AI_DAILY_QUERY_LIMIT', 20),
    ],

    'github' => [
        'webhook_secret' => env('GITHUB_WEBHOOK_SECRET'),
    ],

    'lemonsqueezy' => [
        'webhook_secret' => env('LEMON_SQUEEZY_WEBHOOK_SECRET'),
    ],

];
