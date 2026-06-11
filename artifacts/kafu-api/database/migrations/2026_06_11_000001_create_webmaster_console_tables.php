<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Freshness / review tracking per content item
        Schema::create('content_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('content_id');
            $table->date('last_reviewed_at')->nullable();
            $table->date('next_review_due')->nullable();
            $table->unsignedInteger('review_frequency_days')->default(180);
            $table->unsignedBigInteger('owner_id')->nullable(); // responsible content owner
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index('content_id');
            $table->index('next_review_due');
        });

        // Webmaster tasks (review assignments, remediation, escalations)
        Schema::create('webmaster_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('review'); // review|content_update|seo|accessibility|escalation|other
            $table->string('priority')->default('medium'); // low|medium|high|urgent
            $table->string('status')->default('open'); // open|in_progress|done|escalated|cancelled
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->unsignedBigInteger('assigned_by')->nullable();
            $table->unsignedBigInteger('content_id')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('assigned_to');
        });

        // System-generated alerts
        Schema::create('webmaster_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // stale_content|expired_content|inactive_owner|missing_seo|review_overdue|...
            $table->string('severity')->default('minor'); // critical|major|minor|info
            $table->string('title');
            $table->text('message')->nullable();
            $table->unsignedBigInteger('content_id')->nullable();
            $table->string('status')->default('active'); // active|acknowledged|resolved
            $table->unsignedBigInteger('resolved_by')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('type');
        });

        // Generated governance reports
        Schema::create('governance_reports', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // monthly_webmaster|quarterly_ict|content_health|seo|accessibility|performance|admissions|research
            $table->string('title');
            $table->date('period_start')->nullable();
            $table->date('period_end')->nullable();
            $table->json('payload')->nullable(); // full structured report
            $table->unsignedBigInteger('generated_by')->nullable();
            $table->string('status')->default('final'); // draft|final
            $table->timestamps();
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('governance_reports');
        Schema::dropIfExists('webmaster_alerts');
        Schema::dropIfExists('webmaster_tasks');
        Schema::dropIfExists('content_reviews');
    }
};
