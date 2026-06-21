<?php

namespace App\Services;

use App\Models\ContentSection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ContentSearchService
{
    public function __construct(private readonly EmbeddingService $embeddings)
    {
    }

    public function search(string $question, int $limit = 5): Collection
    {
        $queryEmbedding = $this->embeddings->embed($question);

        if (DB::getDriverName() === 'pgsql') {
            return collect(DB::select(
                'SELECT title, content, slug, topic, url
                 FROM content_sections
                 WHERE embedding IS NOT NULL
                 ORDER BY embedding <=> ?::vector
                 LIMIT ?',
                [json_encode($queryEmbedding), $limit]
            ));
        }

        return ContentSection::query()
            ->whereNotNull('embedding')
            ->get()
            ->map(function (ContentSection $section) use ($queryEmbedding) {
                $score = $this->cosineSimilarity($queryEmbedding, $section->embedding ?? []);

                return [
                    'title' => $section->title,
                    'content' => $section->content,
                    'slug' => $section->slug,
                    'topic' => $section->topic,
                    'url' => $section->url,
                    'score' => $score,
                ];
            })
            ->sortByDesc('score')
            ->take($limit)
            ->values();
    }

    private function cosineSimilarity(array $a, array $b): float
    {
        if ($a === [] || $b === []) {
            return 0.0;
        }

        $dot = 0.0;
        $normA = 0.0;
        $normB = 0.0;
        $length = min(count($a), count($b));

        for ($i = 0; $i < $length; $i++) {
            $dot += $a[$i] * $b[$i];
            $normA += $a[$i] ** 2;
            $normB += $b[$i] ** 2;
        }

        if ($normA == 0.0 || $normB == 0.0) {
            return 0.0;
        }

        return $dot / (sqrt($normA) * sqrt($normB));
    }
}
