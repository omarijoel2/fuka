<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->text('director_message')->nullable()->after('director_bio');
            $table->json('staff_roster')->nullable()->after('quick_links');
        });
    }

    public function down(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->dropColumn(['director_message', 'staff_roster']);
        });
    }
};
