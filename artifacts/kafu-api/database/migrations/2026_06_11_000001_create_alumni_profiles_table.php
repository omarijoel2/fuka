<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('alumni_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('programme')->nullable();
            $table->string('school_code')->nullable();
            $table->unsignedSmallInteger('graduation_year')->nullable();
            $table->string('current_role')->nullable();
            $table->string('current_organization')->nullable();
            $table->string('country')->nullable();
            $table->string('industry')->nullable();
            $table->enum('sector', [
                'employed', 'self_employed', 'entrepreneur', 'public_sector',
                'ngo_sector', 'academic_sector', 'further_study', 'leadership',
            ])->nullable();
            $table->text('achievements')->nullable();
            $table->text('bio')->nullable();
            $table->string('photo_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('featured_category')->nullable();
            $table->enum('visibility', ['public', 'private'])->default('public');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->json('seo_meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumni_profiles');
    }
};
