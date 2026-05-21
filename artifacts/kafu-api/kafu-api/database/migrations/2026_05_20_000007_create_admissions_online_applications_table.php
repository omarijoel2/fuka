<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('admissions_online_applications', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number', 20)->unique();
            $table->string('applicant_type', 30); // kuccps, direct, self_sponsored, masters, phd
            $table->string('status', 30)->default('submitted'); // draft, submitted, under_review, offered, rejected

            // Personal
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('other_names', 100)->nullable();
            $table->string('gender', 10)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('nationality', 80)->nullable()->default('Kenyan');
            $table->string('id_passport_number', 40)->nullable();
            $table->string('phone', 20);
            $table->string('email', 150);
            $table->text('postal_address')->nullable();
            $table->string('county', 80)->nullable();

            // Academic (UG)
            $table->string('kcse_index_number', 30)->nullable();
            $table->string('kcse_year', 4)->nullable();
            $table->string('mean_grade', 5)->nullable();

            // Academic (PG)
            $table->string('degree_institution', 200)->nullable();
            $table->string('degree_class', 80)->nullable();
            $table->string('degree_year', 4)->nullable();
            $table->string('degree_field', 150)->nullable();

            // Programme
            $table->string('school_code', 10)->nullable();
            $table->string('programme_code', 20)->nullable();
            $table->string('programme_name', 200)->nullable();
            $table->string('second_choice_code', 20)->nullable();
            $table->string('second_choice_name', 200)->nullable();

            // Payment
            $table->string('payment_status', 20)->default('pending'); // pending, paid, waived
            $table->string('payment_reference', 50)->nullable();
            $table->decimal('payment_amount', 10, 2)->nullable();
            $table->string('payment_phone', 20)->nullable();
            $table->timestamp('payment_at')->nullable();

            // JSON storage for any extra fields
            $table->text('extra_data')->nullable();

            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admissions_online_applications');
    }
};
