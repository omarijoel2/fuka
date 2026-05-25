<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectoratesPhotoSeeder extends Seeder
{
    /**
     * Set director_photo_url for all directorates.
     * Safe to run on production — only updates the photo field; leaves all other columns untouched.
     */
    public function run(): void
    {
        $photos = [
            'graduate-studies'        => '/images/directors/benson-ojwang.jpg',
            'research-innovation'     => '/images/directors/victor-shikuku.jpg',
            'ict'                     => '/imgs/yohon.jpg',
            'quality-assurance'       => '/images/directors/nicholas-khasoha.jpg',
            'international-relations' => '/images/directors/sylvia-omondi.jpg',
            'corporate-communications'=> '/images/directors/brian-momanyi.jpg',
            'student-affairs'         => '/images/directors/paul-simiyu.jpg',
            'finance'                 => '/images/directors/peter-odhiambo.jpg',
            'procurement'             => '/images/directors/joseph-barasa.jpg',
            'open-distance-elearning' => '/images/directors/hillan-ronoh.jpg',
        ];

        $updated = 0;
        $skipped = 0;

        foreach ($photos as $slug => $photoUrl) {
            $rows = DB::table('directorates')->where('slug', $slug)->update([
                'director_photo_url' => $photoUrl,
                'updated_at'         => now(),
            ]);

            if ($rows > 0) {
                $this->command->line("  <info>Updated</info> : $slug → $photoUrl");
                $updated++;
            } else {
                $this->command->line("  <comment>Skipped</comment> : $slug (not found)");
                $skipped++;
            }
        }

        $this->command->info("Director photos done — {$updated} updated, {$skipped} skipped.");
    }
}
