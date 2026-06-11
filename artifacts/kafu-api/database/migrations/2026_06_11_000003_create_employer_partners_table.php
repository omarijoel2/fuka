<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employer_partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('industry')->nullable();
            $table->enum('partnership_status', ['active', 'prospective', 'mou_signed', 'inactive'])->default('active');
            $table->boolean('internship_opportunities')->default(false);
            $table->unsignedInteger('graduate_hires')->default(0);
            $table->string('logo_url')->nullable();
            $table->string('website_url')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employer_partners');
    }
};
