<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('research_projects', function (Blueprint $table) {
            $table->json('seo_meta')->nullable()->after('is_featured');
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->json('seo_meta')->nullable()->after('is_featured');
        });
    }

    public function down(): void
    {
        Schema::table('research_projects', function (Blueprint $table) {
            $table->dropColumn('seo_meta');
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->dropColumn('seo_meta');
        });
    }
};
