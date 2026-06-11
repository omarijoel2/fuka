<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('accreditations', function (Blueprint $table) {
            $table->id();
            $table->string('body_name');
            $table->string('slug')->unique();
            $table->string('accreditation_type')->default('institutional');
            $table->string('programme')->nullable();
            $table->string('school_code')->nullable();
            $table->string('status')->default('accredited');
            $table->date('award_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('certificate_url')->nullable();
            $table->string('logo_url')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accreditations');
    }
};
