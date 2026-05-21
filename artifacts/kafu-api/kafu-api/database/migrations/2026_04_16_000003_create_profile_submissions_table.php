<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('content_id')->nullable()->constrained('cms_content')->nullOnDelete();
            $table->string('workflow_status')->default('draft');
            // draft | submitted | under_review | revision_requested | approved | published | withdrawn
            $table->integer('version_number')->default(1);
            $table->json('profile_data')->nullable(); // full profile snapshot
            $table->json('section_completion')->nullable(); // {personal: 100, bio: 80, ...}
            $table->integer('completeness_score')->default(0);
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->text('reviewer_summary')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'workflow_status']);
            $table->index('workflow_status');
        });

        Schema::create('profile_submission_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('profile_submissions')->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('section')->nullable(); // null = overall comment
            $table->text('comment');
            $table->string('comment_type')->default('note'); // note | revision_request | approval | rejection
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_submission_comments');
        Schema::dropIfExists('profile_submissions');
    }
};
