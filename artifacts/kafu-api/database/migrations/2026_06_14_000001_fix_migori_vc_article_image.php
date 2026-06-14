<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * The "KAFU VC Represents Education CS" article was seeded with the same
     * image as the Vokoli health-sciences article (image-93.jpeg). Point it at
     * the matching CBE-training photo. Idempotent: only updates the row while it
     * still holds the wrong image, so a manually-set image is never clobbered.
     */
    public function up(): void
    {
        DB::table('cms_content')
            ->where('slug', 'kafu-vc-represents-education-cs-migori')
            ->where('featured_image', '/images/uploads/image-93.jpeg')
            ->update(['featured_image' => '/images/uploads/vc-cbe-training.jpg']);
    }

    public function down(): void
    {
        DB::table('cms_content')
            ->where('slug', 'kafu-vc-represents-education-cs-migori')
            ->where('featured_image', '/images/uploads/vc-cbe-training.jpg')
            ->update(['featured_image' => '/images/uploads/image-93.jpeg']);
    }
};
