<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop old lightweight tables created in the admissions module migration
        Schema::dropIfExists('kuccps_placements');
        Schema::dropIfExists('kuccps_import_batches');

        // ── Mapping templates ───────────────────────────────────────────────────
        Schema::create('kuccps_mapping_templates', function (Blueprint $table) {
            $table->id();
            $table->string('template_name');
            $table->string('template_code')->unique();
            $table->string('source_type')->nullable();
            $table->json('header_aliases');
            $table->json('field_mappings');
            $table->string('default_intake_period')->nullable();
            $table->string('default_academic_year')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ── Programme aliases ───────────────────────────────────────────────────
        Schema::create('programme_aliases', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('programme_id');
            $table->string('alias_name');
            $table->string('normalized_alias');
            $table->string('source')->default('manual');
            $table->unsignedTinyInteger('confidence_default')->default(90);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->index('normalized_alias');
            $table->index(['programme_id', 'is_active']);
        });

        // ── Admission letter templates ─────────────────────────────────────────
        Schema::create('admission_letter_templates', function (Blueprint $table) {
            $table->id();
            $table->string('template_name');
            $table->string('template_code')->unique();
            $table->string('intake_period')->nullable();
            $table->text('body_html');
            $table->text('header_html')->nullable();
            $table->text('footer_html')->nullable();
            $table->json('variables_json')->nullable();
            $table->string('registrar_name')->nullable();
            $table->string('reporting_date_text')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });

        // ── KUCCPS import batches (full spec) ──────────────────────────────────
        Schema::create('kuccps_import_batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_reference')->unique();
            $table->string('original_filename');
            $table->string('stored_file_path')->nullable();
            $table->string('file_type')->default('csv');
            $table->string('file_hash')->nullable();
            $table->string('selected_sheet_name')->nullable();
            $table->unsignedSmallInteger('header_row_number')->default(1);
            $table->unsignedSmallInteger('skip_top_rows')->default(0);
            $table->string('academic_year')->nullable();
            $table->unsignedBigInteger('intake_id')->nullable();
            $table->unsignedBigInteger('pathway_id')->nullable();
            $table->string('programme_level')->default('undergraduate');
            $table->unsignedBigInteger('admission_letter_template_id')->nullable();
            $table->string('reporting_date_text')->nullable();
            $table->json('mapping_json')->nullable();
            $table->unsignedBigInteger('mapping_template_id')->nullable();
            $table->json('validation_summary_json')->nullable();
            $table->string('error_report_path')->nullable();
            $table->string('status')->default('uploaded');
            $table->unsignedInteger('total_rows')->default(0);
            $table->unsignedInteger('valid_rows')->default(0);
            $table->unsignedInteger('warning_rows')->default(0);
            $table->unsignedInteger('invalid_rows')->default(0);
            $table->unsignedInteger('duplicate_rows')->default(0);
            $table->unsignedInteger('unmatched_programme_rows')->default(0);
            $table->unsignedInteger('imported_rows')->default(0);
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_comments')->nullable();
            $table->unsignedBigInteger('imported_by')->nullable();
            $table->timestamp('imported_at')->nullable();
            $table->unsignedBigInteger('rolled_back_by')->nullable();
            $table->timestamp('rolled_back_at')->nullable();
            $table->text('rollback_reason')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('academic_year');
        });

        // ── KUCCPS import rows ─────────────────────────────────────────────────
        Schema::create('kuccps_import_rows', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('batch_id');
            $table->unsignedInteger('row_number');
            $table->json('raw_row_json');
            $table->json('normalized_row_json')->nullable();
            $table->json('mapped_fields_json')->nullable();
            $table->string('row_hash')->nullable();
            $table->string('validation_status')->default('pending');
            $table->json('validation_errors_json')->nullable();
            $table->json('validation_warnings_json')->nullable();
            $table->string('programme_match_status')->default('unmatched');
            $table->unsignedBigInteger('matched_programme_id')->nullable();
            $table->string('uploaded_programme_name')->nullable();
            $table->unsignedTinyInteger('programme_match_confidence')->default(0);
            $table->string('duplicate_status')->default('none');
            $table->unsignedBigInteger('existing_record_id')->nullable();
            $table->string('import_status')->default('pending');
            $table->unsignedBigInteger('imported_record_id')->nullable();
            $table->text('import_error')->nullable();
            $table->timestamps();
            $table->index('batch_id');
            $table->index(['batch_id', 'validation_status']);
            $table->index(['batch_id', 'import_status']);
        });

        // ── KUCCPS placements (full spec) ──────────────────────────────────────
        Schema::create('kuccps_placements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('batch_id')->nullable();
            $table->unsignedBigInteger('source_row_id')->nullable();
            $table->unsignedBigInteger('applicant_id')->nullable();
            $table->string('kuccps_reference', 50)->nullable();
            $table->string('kcse_index_number', 30);
            $table->string('kcse_year', 10);
            $table->string('full_name');
            $table->string('gender', 10)->nullable();
            $table->string('national_id_number', 50)->nullable();
            $table->string('birth_certificate_number', 50)->nullable();
            $table->string('phone_number', 25)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('county', 60)->nullable();
            $table->string('secondary_school_name')->nullable();
            $table->string('mean_grade', 5)->nullable();
            $table->decimal('cluster_points', 5, 2)->nullable();
            $table->unsignedBigInteger('programme_id')->nullable();
            $table->string('uploaded_programme_name')->nullable();
            $table->string('academic_year', 20);
            $table->unsignedBigInteger('intake_id')->nullable();
            $table->string('intake_period', 20)->nullable();
            $table->string('placement_category', 30)->nullable();
            $table->string('admission_status', 30)->default('placed');
            $table->unsignedBigInteger('admission_letter_id')->nullable();
            $table->string('verification_token', 64)->nullable()->unique();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('biodata_completed_at')->nullable();
            $table->timestamp('documents_completed_at')->nullable();
            $table->timestamp('rolled_back_at')->nullable();
            $table->timestamps();

            $table->index(['kcse_index_number', 'kcse_year']);
            $table->index('batch_id');
            $table->index('admission_status');
        });

        // ── Admission letters ──────────────────────────────────────────────────
        Schema::create('admission_letters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('placement_id');
            $table->unsignedBigInteger('application_id')->nullable();
            $table->unsignedBigInteger('template_id');
            $table->string('letter_reference')->unique();
            $table->string('file_path')->nullable();
            $table->string('status')->default('not_generated');
            $table->string('verification_code', 16)->nullable()->unique();
            $table->timestamp('generated_at')->nullable();
            $table->unsignedBigInteger('generated_by')->nullable();
            $table->unsignedInteger('downloaded_count')->default(0);
            $table->timestamp('last_downloaded_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->unsignedBigInteger('revoked_by')->nullable();
            $table->text('revoke_reason')->nullable();
            $table->timestamps();
            $table->index('placement_id');
            $table->index('status');
        });

        // ── Admission letter download logs ─────────────────────────────────────
        Schema::create('admission_letter_download_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admission_letter_id');
            $table->unsignedBigInteger('placement_id');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('verification_method')->default('index_number');
            $table->timestamp('downloaded_at')->useCurrent();
            $table->index('placement_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admission_letter_download_logs');
        Schema::dropIfExists('admission_letters');
        Schema::dropIfExists('kuccps_placements');
        Schema::dropIfExists('kuccps_import_rows');
        Schema::dropIfExists('kuccps_import_batches');
        Schema::dropIfExists('admission_letter_templates');
        Schema::dropIfExists('programme_aliases');
        Schema::dropIfExists('kuccps_mapping_templates');
    }
};
