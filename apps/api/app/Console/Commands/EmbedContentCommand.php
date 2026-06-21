<?php

namespace App\Console\Commands;

use App\Jobs\EmbedContentJob;
use Illuminate\Console\Command;

class EmbedContentCommand extends Command
{
    protected $signature = 'content:embed {--sync : Run synchronously instead of queue}';

    protected $description = 'Embed all MDX content sections for AI Q&A search';

    public function handle(): int
    {
        if ($this->option('sync')) {
            (new EmbedContentJob())->handle(app(\App\Services\EmbeddingService::class));
            $this->info('Content embedded synchronously.');
            return self::SUCCESS;
        }

        EmbedContentJob::dispatch();
        $this->info('EmbedContentJob dispatched.');
        return self::SUCCESS;
    }
}
