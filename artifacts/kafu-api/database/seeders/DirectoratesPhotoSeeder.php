<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectoratesPhotoSeeder extends Seeder
{
    /**
     * Set director_photo_url for all directorates.
     * Uses real unique staff photos where available; NULL elsewhere (shows initials fallback).
     * Safe to run on production — only updates the photo field.
     *
     * NOTE: /images/directors/*.jpg files on the live server are all identical placeholders
     * (same 242 KB file under different names). Only /imgs/staff/ paths contain real photos.
     */
    public function run(): void
    {
        $photos = [
            // Real unique photos confirmed on server
            'graduate-studies'        => '/imgs/staff/Prof.-Ojwang.jpg',
            'open-distance-elearning' => '/imgs/staff/Dr.-Ronoh.jpg',

            // All /images/directors/ files are identical placeholders — set NULL so
            // the frontend shows the initials avatar instead of a wrong face.
            'research-innovation'      => null,
            'ict'                      => null,   // /imgs/yohon.jpg is also the same placeholder
            'quality-assurance'        => null,
            'international-relations'  => null,
            'corporate-communications' => null,
            'student-affairs'          => null,
            'finance'                  => null,
            'procurement'              => null,
        ];

        $updated = 0;
        $skipped = 0;

        foreach ($photos as $slug => $photoUrl) {
            $rows = DB::table('directorates')->where('slug', $slug)->update([
                'director_photo_url' => $photoUrl,
                'updated_at'         => now(),
            ]);

            if ($rows > 0) {
                $label = $photoUrl ?? 'NULL (initials fallback)';
                $this->command->line("  <info>Updated</info> : $slug → $label");
                $updated++;
            } else {
                $this->command->line("  <comment>Skipped</comment> : $slug (not found)");
                $skipped++;
            }
        }

        $this->command->info("Director photos done — {$updated} updated, {$skipped} skipped.");
    }
}
