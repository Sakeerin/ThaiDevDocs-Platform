<?php

namespace App\Http\Controllers;

use App\Services\AiQaService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AiQaController extends Controller
{
    public function __construct(private readonly AiQaService $aiQa)
    {
    }

    public function __invoke(Request $request): StreamedResponse
    {
        $user = $request->user();

        if (! $user || ! $user->is_pro) {
            abort(403, 'pro_required');
        }

        $validated = $request->validate([
            'question' => ['required', 'string', 'max:2000'],
            'article_slug' => ['nullable', 'string'],
        ]);

        return response()->stream(function () use ($user, $validated) {
            $this->aiQa->streamAnswer(
                $user,
                $validated['question'],
                $validated['article_slug'] ?? null,
                fn ($chunk) => echo $chunk
            );
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
