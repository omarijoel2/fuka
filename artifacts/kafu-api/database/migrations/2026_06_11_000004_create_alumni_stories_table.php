<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('alumni_stories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('alumni_id')->nullable()->constrained('alumni_profiles')->nullOnDelete();
            $table->string('alumni_name')->nullable();
            $table->string('programme')->nullable();
            $table->unsignedSmallInteger('graduation_year')->nullable();
            $table->text('summary');
            $table->longText('body')->nullable();
            $table->string('video_url')->nullable();
            $table->string('photo_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->json('seo_meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumni_stories');
    }
};
