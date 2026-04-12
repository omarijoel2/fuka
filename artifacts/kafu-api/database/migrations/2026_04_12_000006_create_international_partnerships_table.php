<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('international_partnerships', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('short_name')->nullable();
            $table->string('country');
            $table->string('country_code', 3)->nullable();
            $table->enum('type', ['university', 'research_institute', 'government', 'ngo', 'development_agency', 'quaker', 'professional_body'])->default('university');
            $table->enum('status', ['active', 'inactive', 'pending'])->default('active');
            $table->text('description')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('website_url')->nullable();
            $table->date('mou_date')->nullable();
            $table->date('mou_expiry')->nullable();
            $table->json('collaboration_areas')->nullable(); // ['student_exchange','research','joint_degrees','staff_mobility',...]
            $table->json('contact_person')->nullable(); // {name, email, title}
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('international_partnerships');
    }
};
