<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_consent_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('policy_version')->default('v1.0');
            $table->string('consent_type')->default('profile_publication'); // profile_publication | privacy_policy
            $table->timestamp('accepted_at');
            $table->string('accepted_ip', 45)->nullable();
            $table->text('accepted_user_agent')->nullable();
            $table->boolean('is_current')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'consent_type', 'is_current']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_consent_records');
    }
};
