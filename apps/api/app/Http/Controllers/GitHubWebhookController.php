<?php

namespace App\Http\Controllers;

use App\Jobs\EmbedContentJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GitHubWebhookController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        if ($request->header('X-Hub-Signature-256')) {
            $secret = config('services.github.webhook_secret');
            $signature = 'sha256='.hash_hmac('sha256', $request->getContent(), $secret);
            if (! hash_equals($signature, $request->header('X-Hub-Signature-256'))) {
                return response()->json(['error' => 'invalid signature'], 401);
            }
        }

        $event = $request->header('X-GitHub-Event');
        if ($event === 'push' && ($request->input('ref') === 'refs/heads/main')) {
            EmbedContentJob::dispatch();
        }

        return response()->json(['ok' => true]);
    }
}
