<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('research_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('abstract');
            $table->string('department')->nullable();
            $table->string('lead_researcher_slug')->nullable();
            $table->string('lead_researcher_name')->nullable();
            $table->json('co_researchers')->nullable();
            $table->foreignId('theme_id')->nullable()->constrained('research_themes')->nullOnDelete();
            $table->enum('status', ['planned', 'active', 'completed', 'suspended'])->default('active');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('funding_source')->nullable();
            $table->string('grant_id')->nullable();
            $table->decimal('budget', 14, 2)->nullable();
            $table->string('currency', 3)->default('KES');
            $table->json('sdg_goals')->nullable();
            $table->string('featured_image_url')->nullable();
            $table->json('outputs')->nullable();
            $table->boolean('is_published')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('research_projects');
    }
};
