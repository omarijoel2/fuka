<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('payroll_number')->nullable()->unique()->after('id');
            $table->string('staff_number')->nullable()->unique()->after('payroll_number');
            $table->string('title')->nullable()->after('name'); // Mr, Dr, Prof etc
            $table->string('job_title')->nullable()->after('title');
            $table->boolean('first_login_completed')->default(false)->after('last_login_at');
            $table->integer('failed_login_count')->default(0)->after('first_login_completed');
            $table->timestamp('locked_at')->nullable()->after('failed_login_count');
            $table->boolean('mfa_ready')->default(false)->after('locked_at');
            $table->string('phone')->nullable()->after('mfa_ready');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'payroll_number', 'staff_number', 'title', 'job_title',
                'first_login_completed', 'failed_login_count', 'locked_at',
                'mfa_ready', 'phone',
            ]);
        });
    }
};
