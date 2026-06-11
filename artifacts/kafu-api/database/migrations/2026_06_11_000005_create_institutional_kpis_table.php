<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('institutional_kpis', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('slug')->unique();
            $table->string('category')->default('overview');
            $table->decimal('value', 14, 2)->nullable();
            $table->string('display_value')->nullable();
            $table->string('unit')->nullable();
            $table->unsignedSmallInteger('period_year')->nullable();
            $table->string('trend')->nullable();
            $table->decimal('trend_value', 8, 2)->nullable();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->json('series')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institutional_kpis');
    }
};
