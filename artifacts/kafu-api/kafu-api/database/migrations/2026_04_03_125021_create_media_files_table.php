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
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('original_name');
            $table->string('mime_type');
            $table->string('extension');
            $table->unsignedBigInteger('size');
            $table->string('path');
            $table->string('url');
            $table->string('folder')->default('general');
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->json('meta')->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->boolean('is_public')->default(true);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('folder');
            $table->index('mime_type');
            $table->index('uploaded_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
