<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectoratesPhotoSeeder extends Seeder
{
    /**
     * Set director_photo_url for all 9 directorates.
     * Uses real confirmed photos where available; NULL elsewhere (shows initials fallback).
     *
     * Confirmed real photos (non-placeholder):
     *   - Prof.-Ojwang.jpg   (22 KB JPEG)  — Graduate Studies
     *   - Dr.-Ronoh.jpg      (11 KB JPEG)  — ODeL
     *   - Dr.-Sulungai.jpg   (13 KB JPEG)  — Planning & Performance Contracting
     *
     * Safe to re-run on production — only the photo column is touched.
     */
    public function run(): void
    {
        $photos = [
            'graduate-studies'                   => '/images/uploads/Prof.-Ojwang.jpg',
            'open-distance-elearning'            => '/images/uploads/Dr.-Ronoh.jpg',
            'planning-performance-contracting'   => '/images/uploads/Dr.-Sulungai.jpg',

            // No confirmed real photos available for these — show initials avatar
            'research-innovation'                => null,
            'ict'                                => null,
            'quality-assurance'                  => null,
            'corporate-affairs'                  => null,
            'university-linkages-alumni-career'  => null,
            'enterprises-resource-mobilization'  => null,
        ];

        $updated = 0;
        $skipped = 0;

        foreach ($photos as $slug => $photoUrl) {
            $rows = DB::table('directorates')->where('slug', $slug)->update([
                'director_photo_url' => $photoUrl,
                'updated_at'         => now(),
            ]);

            if ($rows > 0) {
                $label = $photoUrl ?? 'NULL (initials)';
                $this->command->line("  <info>Updated</info> : $slug → $label");
                $updated++;
            } else {
                $this->command->line("  <comment>Skipped</comment> : $slug (not found in DB)");
                $skipped++;
            }
        }

        $this->command->info("Done — {$updated} updated, {$skipped} skipped.");
    }
}
