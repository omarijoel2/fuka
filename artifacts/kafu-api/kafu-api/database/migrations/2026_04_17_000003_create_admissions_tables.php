<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Certificate uploads tracking
        Schema::create('admissions_uploads', function (Blueprint $table) {
            $table->id();
            $table->string('reference_id', 36)->unique();
            $table->string('file_name');
            $table->string('stored_path');
            $table->string('document_type', 60)->default('certificate');
            $table->float('size_kb')->default(0);
            $table->string('status', 20)->default('pending'); // pending, verified, rejected
            $table->string('reviewed_by')->nullable();
            $table->text('reviewer_notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });

        // Managed postgraduate programmes
        Schema::create('admissions_pg_programmes', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('name');
            $table->string('level', 20); // masters | doctoral
            $table->string('school', 10);
            $table->string('duration', 30)->default('2 years');
            $table->string('min_qual');
            $table->string('min_class', 20)->default('lower_second');
            $table->string('career_hint')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Admissions settings / deadlines
        Schema::create('admissions_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 80)->unique();
            $table->text('value');
            $table->string('label')->nullable();
            $table->string('type', 20)->default('text'); // text | date | boolean | number
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admissions_settings');
        Schema::dropIfExists('admissions_pg_programmes');
        Schema::dropIfExists('admissions_uploads');
    }
};
