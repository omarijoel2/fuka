<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('institutional_reports', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('report_type')->default('annual_report');
            $table->unsignedSmallInteger('year')->nullable();
            $table->text('description')->nullable();
            $table->string('file_url')->nullable();
            $table->string('file_size')->nullable();
            $table->date('published_date')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institutional_reports');
    }
};
