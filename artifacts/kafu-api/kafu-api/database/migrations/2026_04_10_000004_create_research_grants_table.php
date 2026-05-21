<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('research_grants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('funder');
            $table->string('funder_type')->nullable();
            $table->string('funder_country')->nullable();
            $table->decimal('amount', 16, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'completed', 'pending'])->default('active');
            $table->foreignId('project_id')->nullable()->constrained('research_projects')->nullOnDelete();
            $table->string('grant_number')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('research_grants');
    }
};
