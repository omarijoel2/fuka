<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->json('authors');
            $table->smallInteger('year');
            $table->string('journal')->nullable();
            $table->string('publisher')->nullable();
            $table->string('doi')->nullable()->unique();
            $table->string('url')->nullable();
            $table->enum('type', ['journal', 'conference', 'book_chapter', 'thesis', 'report', 'book', 'preprint'])->default('journal');
            $table->text('abstract')->nullable();
            $table->json('indexed_in')->nullable();
            $table->string('volume')->nullable();
            $table->string('issue')->nullable();
            $table->string('pages')->nullable();
            $table->string('citation_key')->nullable();
            $table->foreignId('project_id')->nullable()->constrained('research_projects')->nullOnDelete();
            $table->boolean('is_published')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
