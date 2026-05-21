<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cms_content', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->longText('body')->nullable();
            $table->string('status')->default('draft');
            $table->string('department')->nullable();
            $table->string('school_code')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->unsignedBigInteger('reviewer_id')->nullable();
            $table->unsignedBigInteger('approver_id')->nullable();
            $table->string('category')->nullable();
            $table->string('featured_image')->nullable();
            $table->boolean('featured')->default(false);
            $table->json('seo_meta')->nullable();
            $table->json('structured_data')->nullable();
            $table->json('tags')->nullable();
            $table->json('related_ids')->nullable();
            $table->timestamp('publish_date')->nullable();
            $table->timestamp('expiry_date')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->unsignedBigInteger('current_version')->default(1);
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->index('type');
            $table->index('status');
            $table->index('author_id');
            $table->index('publish_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cms_content');
    }
};
