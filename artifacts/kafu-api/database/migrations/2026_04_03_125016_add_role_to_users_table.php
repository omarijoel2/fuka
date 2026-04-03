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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('staff_user')->after('email');
            $table->string('department')->nullable()->after('role');
            $table->string('school_code')->nullable()->after('department');
            $table->string('status')->default('active')->after('school_code');
            $table->timestamp('last_login_at')->nullable()->after('status');
            $table->string('avatar_url')->nullable()->after('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'department', 'school_code', 'status', 'last_login_at', 'avatar_url']);
        });
    }
};
