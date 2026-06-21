<?php

use App\Http\Controllers\AiQaController;
use App\Http\Controllers\AiUsageController;
use App\Http\Controllers\AuthSyncController;
use App\Http\Controllers\GitHubWebhookController;
use App\Http\Controllers\LemonSqueezyWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/sync', AuthSyncController::class);
Route::post('/webhooks/github', GitHubWebhookController::class);
Route::post('/webhooks/lemonsqueezy', LemonSqueezyWebhookController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ai/usage', AiUsageController::class);
    Route::post('/ai/qa', AiQaController::class);
});
