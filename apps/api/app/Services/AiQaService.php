<?php

namespace App\Services;

use App\Models\AiQuery;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class AiQaService
{
    public function __construct(
        private readonly ContentSearchService $search,
    ) {
    }

    public function streamAnswer(User $user, string $question, ?string $articleSlug, callable $onChunk): array
    {
        $startedAt = microtime(true);
        $sections = $this->search->search($question, 5);

        if ($sections->isEmpty()) {
            throw new \RuntimeException('no_relevant_content');
        }

        $context = $sections
            ->map(function ($section) {
                $title = data_get($section, 'title');
                $content = data_get($section, 'content');

                return "### {$title}\n{$content}";
            })
            ->implode("\n\n---\n\n");

        $systemPrompt = <<<'PROMPT'
        คุณคือ AI assistant ของ ThaiDevDocs — docs ภาษาไทยสำหรับ Laravel และ Vue.js developer

        กฎสำคัญ:
        - ตอบเป็นภาษาไทยเสมอ (ยกเว้น code ที่เป็นภาษา programming)
        - ตอบจาก context ที่ได้รับเท่านั้น
        - ถ้าไม่มีข้อมูลใน context ให้บอกตรงๆ ว่า "ยังไม่มี article เรื่องนี้ใน ThaiDevDocs"
        - แนะนำ article ที่เกี่ยวข้องเสมอ
        PROMPT;

        $response = Http::withHeaders([
            'x-api-key' => config('services.anthropic.key'),
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->withOptions(['stream' => true])->post('https://api.anthropic.com/v1/messages', [
            'model' => config('services.anthropic.model', 'claude-sonnet-4-20250514'),
            'max_tokens' => 1024,
            'stream' => true,
            'system' => $systemPrompt,
            'messages' => [[
                'role' => 'user',
                'content' => "Context จาก ThaiDevDocs:\n\n{$context}\n\n---\n\nคำถาม: {$question}",
            ]],
        ]);

        $tokensUsed = 0;

        foreach ($response->toPsrResponse()->getBody() as $chunk) {
            $onChunk($chunk);
            $tokensUsed += strlen($chunk);
        }

        $responseTimeMs = (int) ((microtime(true) - $startedAt) * 1000);

        AiQuery::create([
            'user_id' => $user->id,
            'question' => $question,
            'article_slug' => $articleSlug,
            'tokens_used' => $tokensUsed,
            'response_time_ms' => $responseTimeMs,
            'sources' => $sections->map(fn ($section) => [
                'title' => data_get($section, 'title'),
                'url' => data_get($section, 'url'),
            ])->all(),
        ]);

        return [
            'sources' => $sections->all(),
            'response_time_ms' => $responseTimeMs,
        ];
    }
}
