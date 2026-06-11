<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rankings', function (Blueprint $table) {
            $table->id();
            $table->string('organization');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('rank_value')->nullable();
            $table->unsignedInteger('rank_numeric')->nullable();
            $table->string('category')->default('national');
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('scope')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('source_url')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rankings');
    }
};
