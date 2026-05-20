<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('school_code', 20);        // SESS | SBE | SCIT | SOS | SHS
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('vision')->nullable();
            // HOD details
            $table->string('hod_name')->nullable();
            $table->string('hod_title')->default('Head of Department');
            $table->string('hod_email')->nullable();
            $table->string('hod_phone')->nullable();
            $table->string('hod_photo_url')->nullable();
            $table->text('hod_bio')->nullable();
            // Contact
            $table->string('office_location')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('school_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
