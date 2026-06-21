<?php

namespace App\Jobs;

use App\Models\ContentSection;
use App\Services\EmbeddingService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;

class EmbedContentJob implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly ?string $contentRoot = null)
    {
    }

    public function handle(EmbeddingService $embeddings): void
    {
        $root = $this->contentRoot ?? base_path('../../content/docs');

        if (! File::isDirectory($root)) {
            return;
        }

        foreach (File::allFiles($root) as $file) {
            if ($file->getExtension() !== 'mdx') {
                continue;
            }

            $raw = File::get($file->getPathname());
            if (! preg_match('/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/', $raw, $matches)) {
                continue;
            }

            $frontmatter = $matches[1];
            $body = $matches[2];
            $relative = str_replace('\\', '/', str_replace($root.DIRECTORY_SEPARATOR, '', $file->getPathname()));
            $slug = preg_replace('/\.mdx$/', '', $relative);
            $title = $this->parseField($frontmatter, 'title') ?? $slug;
            $topic = $this->parseField($frontmatter, 'topic') ?? 'general';
            $url = $slug === 'index' ? '/docs' : '/docs/'.$slug;

            foreach ($this->splitSections($body, $title) as $index => $section) {
                $embedding = $embeddings->embed($section['text']);

                ContentSection::updateOrCreate(
                    ['slug' => $slug, 'section_id' => (string) $index],
                    [
                        'title' => $title,
                        'content' => $section['text'],
                        'topic' => $topic,
                        'url' => $url,
                        'embedding' => $embedding,
                    ]
                );
            }
        }
    }

    private function parseField(string $frontmatter, string $field): ?string
    {
        if (! preg_match('/^'.preg_quote($field, '/').':\s*(.+)$/m', $frontmatter, $match)) {
            return null;
        }

        return trim($match[1], " \"'");
    }

    private function splitSections(string $body, string $title): array
    {
        $sections = [];
        $currentHeading = $title;
        $buffer = [];
        $index = 0;

        $flush = function () use (&$sections, &$buffer, &$currentHeading, &$index, $title) {
            $text = trim(implode("\n", $buffer));
            if ($text === '') {
                return;
            }

            $sections[] = [
                'heading' => $currentHeading,
                'text' => $text,
            ];
            $index++;
        };

        foreach (preg_split('/\r?\n/', $body) as $line) {
            if (preg_match('/^##+\s+(.+)$/', $line, $match)) {
                $flush();
                $currentHeading = trim($match[1]);
                $buffer = [$line];
                continue;
            }

            $buffer[] = $line;
        }

        $flush();

        if ($sections === []) {
            $sections[] = ['heading' => $title, 'text' => trim($body)];
        }

        return $sections;
    }
}
