<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exchange_programmes', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->enum('type', ['student_exchange', 'staff_exchange', 'joint_degree', 'summer_school', 'research_fellowship', 'internship'])->default('student_exchange');
            $table->foreignId('partnership_id')->nullable()->constrained('international_partnerships')->nullOnDelete();
            $table->string('partner_name')->nullable(); // fallback if no DB partnership
            $table->string('partner_country')->nullable();
            $table->text('description');
            $table->integer('duration_weeks')->nullable();
            $table->string('duration_label')->nullable(); // e.g. "One semester (4 months)"
            $table->date('application_deadline')->nullable();
            $table->string('next_intake')->nullable(); // e.g. "September 2026"
            $table->integer('slots_available')->nullable();
            $table->decimal('stipend_amount', 10, 2)->nullable();
            $table->string('stipend_currency', 3)->default('USD');
            $table->json('eligibility')->nullable(); // ['Year 2+','Min GPA 3.0',...]
            $table->json('benefits')->nullable(); // ['Tuition waiver','Housing','Stipend',...]
            $table->json('required_documents')->nullable();
            $table->enum('status', ['open', 'closed', 'upcoming', 'suspended'])->default('open');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exchange_programmes');
    }
};
