<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LemonSqueezyWebhookController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $secret = config('services.lemonsqueezy.webhook_secret');
        $signature = hash_hmac('sha256', $request->getContent(), $secret);

        if (! hash_equals($signature, $request->header('X-Signature', ''))) {
            return response()->json(['error' => 'invalid signature'], 401);
        }

        $payload = $request->json()->all();
        $event = $payload['meta']['event_name'] ?? null;
        $attributes = $payload['data']['attributes'] ?? [];
        $email = $attributes['user_email'] ?? null;

        if (! $email) {
            return response()->json(['ok' => true]);
        }

        $user = User::where('email', $email)->first();
        if (! $user) {
            return response()->json(['ok' => true]);
        }

        if (in_array($event, ['subscription_created', 'subscription_updated', 'subscription_payment_success'], true)) {
            $user->update(['is_pro' => true, 'pro_expires_at' => $attributes['renews_at'] ?? null]);
            Subscription::updateOrCreate(
                ['provider_subscription_id' => (string) ($payload['data']['id'] ?? '')],
                [
                    'user_id' => $user->id,
                    'provider' => 'lemonsqueezy',
                    'variant_name' => $attributes['variant_name'] ?? null,
                    'status' => $attributes['status'] ?? 'active',
                    'renews_at' => $attributes['renews_at'] ?? null,
                    'ends_at' => $attributes['ends_at'] ?? null,
                    'meta' => $payload,
                ]
            );
        }

        if (in_array($event, ['subscription_cancelled', 'subscription_expired'], true)) {
            $user->update(['is_pro' => false]);
            Subscription::where('user_id', $user->id)->update(['status' => 'cancelled']);
        }

        return response()->json(['ok' => true]);
    }
}
