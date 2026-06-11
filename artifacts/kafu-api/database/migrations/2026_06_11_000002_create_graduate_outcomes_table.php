<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('graduate_outcomes', function (Blueprint $table) {
            $table->id();
            $table->string('programme');
            $table->string('programme_slug')->nullable();
            $table->string('school_code')->nullable();
            $table->unsignedSmallInteger('cohort_year')->nullable();
            $table->decimal('employment_rate', 5, 2)->nullable();
            $table->decimal('further_study_rate', 5, 2)->nullable();
            $table->decimal('entrepreneurship_rate', 5, 2)->nullable();
            $table->unsignedSmallInteger('avg_time_to_employment_months')->nullable();
            $table->unsignedInteger('sample_size')->nullable();
            $table->json('top_employers')->nullable();
            $table->json('top_sectors')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('graduate_outcomes');
    }
};
