<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Admission Pathways ────────────────────────────────────────────────
        Schema::create('admission_pathways', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();        // kuccps | ug_self | masters | phd
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('level', 20);                // undergraduate | masters | phd
            $table->boolean('requires_payment')->default(true);
            $table->boolean('requires_kuccps_verification')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ── Intake Scheduling ─────────────────────────────────────────────────
        Schema::create('admissions_intakes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);                // "September 2026 Intake"
            $table->string('academic_year', 20);        // "2026/2027"
            $table->string('intake_period', 20);        // january | may | september
            $table->timestamp('open_at')->nullable();
            $table->timestamp('close_at')->nullable();
            $table->string('status', 30)->default('draft');
            // draft | scheduled | open | closing_soon | closed | extended | archived
            $table->boolean('is_published')->default(false);
            $table->decimal('application_fee_undergraduate', 10, 2)->default(1000.00);
            $table->decimal('application_fee_masters',       10, 2)->default(1500.00);
            $table->decimal('application_fee_phd',           10, 2)->default(2000.00);
            $table->boolean('allow_kuccps')->default(true);
            $table->boolean('allow_self_sponsored_ug')->default(true);
            $table->boolean('allow_masters')->default(true);
            $table->boolean('allow_phd')->default(true);
            $table->boolean('allow_late_applications')->default(false);
            $table->timestamp('late_application_close_at')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        // ── Programme Catalogue ───────────────────────────────────────────────
        Schema::create('admission_programmes', function (Blueprint $table) {
            $table->id();
            $table->string('programme_code', 30)->unique();
            $table->string('programme_name');
            $table->string('school_code', 20);          // SESS | SBE | SCIT | SOS | SHS
            $table->string('department')->nullable();
            $table->string('level', 20);                // certificate|diploma|undergraduate|masters|phd
            $table->string('duration', 30)->default('4 years');
            $table->string('mode', 30)->default('full_time');
            $table->string('campus')->default('Main Campus');
            $table->text('minimum_requirements')->nullable();
            $table->json('available_intakes')->nullable();   // ["january","may","september"]
            $table->json('available_pathways')->nullable();  // ["kuccps","ug_self"]
            $table->json('required_documents')->nullable();  // ["national_id","kcse_cert",...]
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ── Intake × Programme Availability ──────────────────────────────────
        Schema::create('intake_programme_availability', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('intake_id');
            $table->unsignedBigInteger('programme_id');
            $table->unsignedBigInteger('pathway_id')->nullable();
            $table->decimal('application_fee_override', 10, 2)->nullable();
            $table->integer('capacity')->nullable();
            $table->boolean('is_open')->default(true);
            $table->timestamps();
        });

        // ── Applicants (portal accounts, separate from CMS users) ────────────
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('phone', 20)->nullable();
            $table->string('password_hash');
            $table->string('full_name');
            $table->string('gender', 10)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('nationality')->default('Kenyan');
            $table->string('id_document_type', 20)->default('national_id');
            $table->string('id_document_number', 50)->nullable();
            $table->string('county')->nullable();
            $table->string('sub_county')->nullable();
            $table->text('postal_address')->nullable();
            $table->text('physical_address')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone', 20)->nullable();
            $table->boolean('has_disability')->default(false);
            $table->string('disability_description')->nullable();
            $table->boolean('email_verified')->default(false);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('otp_code', 10)->nullable();
            $table->timestamp('otp_expires_at')->nullable();
            $table->string('portal_token', 80)->nullable()->unique();
            $table->timestamps();
        });

        // ── Applications ──────────────────────────────────────────────────────
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_number', 40)->unique()->nullable();
            $table->string('reference', 36)->unique(); // UUID for public reference
            $table->unsignedBigInteger('applicant_id');
            $table->unsignedBigInteger('intake_id');
            $table->unsignedBigInteger('programme_id');
            $table->unsignedBigInteger('pathway_id');
            $table->string('level', 20);
            $table->string('status', 40)->default('draft');
            // draft|awaiting_documents|awaiting_payment|ready|submitted
            // under_review|documents_queried|eligible|rejected|offered|offer_accepted|deferred|cancelled|archived
            $table->string('payment_status', 30)->default('pending');
            // pending|initiated|paid|failed|cancelled|reversed|manually_verified
            $table->boolean('declarations_accepted')->default(false);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('locked_at')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->string('decision', 20)->nullable();
            $table->text('decision_reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        // ── Academic Qualifications ───────────────────────────────────────────
        Schema::create('academic_qualifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id');
            $table->string('qualification_level', 30); // kcse|diploma|undergraduate|masters
            $table->string('institution_name')->nullable();
            $table->string('programme_name')->nullable();
            $table->string('completion_year', 10)->nullable();
            $table->string('grade_or_classification', 50)->nullable();
            $table->string('kcse_index_number', 30)->nullable();
            $table->string('kcse_year', 10)->nullable();
            $table->string('mean_grade', 5)->nullable();
            $table->json('subject_grades')->nullable();
            $table->string('school_attended')->nullable();
            $table->timestamps();
        });

        // ── Application Documents ─────────────────────────────────────────────
        Schema::create('application_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id');
            $table->string('document_type', 60);
            // national_id|passport|kcse_cert|kcse_result_slip|transcript|degree_cert
            // masters_cert|concept_note|referee_letter|passport_photo|birth_cert
            $table->string('document_label', 120)->nullable();
            $table->string('file_path', 500)->nullable();
            $table->string('original_filename', 255)->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->integer('file_size_kb')->default(0);
            $table->string('checksum', 64)->nullable();
            $table->string('status', 20)->default('pending');
            // pending|verified|rejected|queried
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });

        // ── Payments ──────────────────────────────────────────────────────────
        Schema::create('application_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id');
            $table->string('payment_reference', 50)->unique();
            $table->string('external_transaction_id', 100)->nullable();
            $table->string('method', 30)->default('mpesa');
            // mpesa|bank|card|manual
            $table->decimal('amount_expected', 10, 2);
            $table->decimal('amount_paid', 10, 2)->nullable();
            $table->string('status', 30)->default('pending');
            // pending|initiated|paid|failed|cancelled|reversed|manually_verified
            $table->timestamp('paid_at')->nullable();
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->string('mpesa_phone', 20)->nullable();
            $table->json('gateway_metadata')->nullable();
            $table->text('manual_notes')->nullable();
            $table->timestamps();
        });

        // ── KUCCPS Placements ─────────────────────────────────────────────────
        Schema::create('kuccps_placements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('import_batch_id');
            $table->string('kuccps_reference', 50)->nullable();
            $table->string('kcse_index_number', 30);
            $table->string('kcse_year', 10);
            $table->string('applicant_name');
            $table->string('id_document_number', 50)->nullable();
            $table->string('programme_code', 30);
            $table->unsignedBigInteger('programme_id')->nullable();
            $table->string('academic_year', 20);
            $table->unsignedBigInteger('intake_id')->nullable();
            $table->string('placement_category', 30)->nullable();
            // category_a|category_b|parallel
            $table->string('status', 30)->default('unverified');
            // unverified|verified|claimed|rejected
            $table->unsignedBigInteger('matched_application_id')->nullable();
            $table->timestamps();
        });

        // ── KUCCPS Import Batches ─────────────────────────────────────────────
        Schema::create('kuccps_import_batches', function (Blueprint $table) {
            $table->id();
            $table->string('filename', 255);
            $table->string('academic_year', 20);
            $table->string('intake_period', 20)->nullable();
            $table->string('status', 30)->default('draft');
            // draft|validated|imported|failed|rolled_back
            $table->integer('total_rows')->default(0);
            $table->integer('valid_rows')->default(0);
            $table->integer('invalid_rows')->default(0);
            $table->json('validation_errors')->nullable();
            $table->unsignedBigInteger('imported_by');
            $table->timestamp('imported_at')->nullable();
            $table->timestamps();
        });

        // ── Application Status Audit Log ──────────────────────────────────────
        Schema::create('application_status_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id');
            $table->string('from_status', 40)->nullable();
            $table->string('to_status', 40);
            $table->unsignedBigInteger('changed_by')->nullable();
            $table->string('changed_by_type', 20)->default('system');
            // admin|applicant|system
            $table->text('reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_status_logs');
        Schema::dropIfExists('kuccps_import_batches');
        Schema::dropIfExists('kuccps_placements');
        Schema::dropIfExists('application_payments');
        Schema::dropIfExists('application_documents');
        Schema::dropIfExists('academic_qualifications');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('applicants');
        Schema::dropIfExists('intake_programme_availability');
        Schema::dropIfExists('admission_programmes');
        Schema::dropIfExists('admissions_intakes');
        Schema::dropIfExists('admission_pathways');
    }
};
