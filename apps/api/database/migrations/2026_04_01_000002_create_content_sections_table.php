<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS vector');
        }

        Schema::create('content_sections', function (Blueprint $table) {
            $table->id();
            $table->string('slug');
            $table->string('section_id');
            $table->string('title');
            $table->text('content');
            $table->string('topic')->nullable();
            $table->string('url')->nullable();
            $table->json('embedding')->nullable();
            $table->timestamps();

            $table->unique(['slug', 'section_id']);
            $table->index(['topic', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_sections');
    }
};
