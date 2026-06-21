<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('github_id')->nullable()->unique()->after('id');
            $table->string('github_login')->nullable()->unique()->after('github_id');
            $table->string('avatar_url')->nullable()->after('email');
            $table->boolean('is_pro')->default(false)->after('avatar_url');
            $table->timestamp('pro_expires_at')->nullable()->after('is_pro');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['github_id', 'github_login', 'avatar_url', 'is_pro', 'pro_expires_at']);
        });
    }
};
