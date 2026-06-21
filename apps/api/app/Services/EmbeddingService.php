<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class EmbeddingService
{
    public function embed(string $text): array
    {
        $provider = config('services.embeddings.provider', 'openai');
        $model = config('services.embeddings.model', 'text-embedding-3-small');

        if ($provider === 'mock' || ! config('services.embeddings.key')) {
            return $this->mockEmbedding($text);
        }

        $response = Http::withToken(config('services.embeddings.key'))
            ->post('https://api.openai.com/v1/embeddings', [
                'model' => $model,
                'input' => $text,
            ])
            ->throw()
            ->json();

        return $response['data'][0]['embedding'];
    }

    private function mockEmbedding(string $text): array
    {
        $hash = crc32($text);
        $vector = [];

        for ($i = 0; $i < 1536; $i++) {
            $vector[] = sin(($hash + $i) / 97);
        }

        return $vector;
    }
}
