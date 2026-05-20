<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('council_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title');
            $table->string('photo_url')->nullable();
            $table->text('bio')->nullable();
            $table->json('credentials')->nullable();
            $table->string('category')->default('member');
            $table->integer('position_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('management_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title');
            $table->string('photo_url')->nullable();
            $table->text('bio')->nullable();
            $table->string('email')->nullable();
            $table->string('office')->nullable();
            $table->string('phone')->nullable();
            $table->enum('category', ['vc', 'dvc', 'registrar', 'finance', 'library', 'ict', 'other'])->default('other');
            $table->integer('position_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('directorates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('director_name')->nullable();
            $table->string('director_title')->nullable();
            $table->string('director_photo_url')->nullable();
            $table->text('director_bio')->nullable();
            $table->string('director_email')->nullable();
            $table->string('director_phone')->nullable();
            $table->json('functions')->nullable();
            $table->json('services')->nullable();
            $table->json('quick_links')->nullable();
            $table->integer('position_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('directorates');
        Schema::dropIfExists('management_profiles');
        Schema::dropIfExists('council_members');
    }
};
