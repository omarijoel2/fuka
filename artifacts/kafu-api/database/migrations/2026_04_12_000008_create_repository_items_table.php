<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repository_items', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('type'); // thesis|dissertation|journal_article|conference_paper|book_chapter|research_report|working_paper|dataset
            $table->text('abstract');
            $table->json('authors');         // [{name, staff_slug?, role}]
            $table->json('keywords');        // string[]
            $table->string('department')->nullable();   // SBE|SCIT|SOS|SHS|SESS
            $table->string('research_theme')->nullable();
            $table->year('year');
            $table->string('publisher')->nullable();
            $table->string('journal_name')->nullable();
            $table->string('volume')->nullable();
            $table->string('issue')->nullable();
            $table->string('pages')->nullable();
            $table->string('doi')->nullable();
            $table->string('isbn_issn')->nullable();
            $table->string('file_url')->nullable();     // PDF link
            $table->integer('file_size_kb')->default(0);
            $table->string('language', 10)->default('en');
            $table->string('license')->default('cc_by'); // cc_by|cc_by_nc|cc_by_sa|all_rights_reserved|open_access
            $table->string('access')->default('open');   // open|restricted|embargo
            $table->date('embargo_until')->nullable();
            $table->string('funded_by')->nullable();
            // Thesis-specific
            $table->string('student_name')->nullable();
            $table->string('supervisor')->nullable();    // comma-sep names
            $table->string('degree')->nullable();        // PhD|Masters|Postgrad Diploma
            // Stats
            $table->unsignedInteger('citation_count')->default(0);
            $table->unsignedInteger('downloads')->default(0);
            $table->unsignedInteger('views')->default(0);
            // Workflow
            $table->string('status')->default('published'); // draft|under_review|approved|published|withdrawn
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repository_items');
    }
};
