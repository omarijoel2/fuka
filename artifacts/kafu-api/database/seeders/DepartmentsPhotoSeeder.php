<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentsPhotoSeeder extends Seeder
{
    /**
     * Set hod_photo_url for all departments to local /images/uploads/ paths.
     * Safe to run on production — only updates the photo field.
     */
    public function run(): void
    {
        $photos = [
            // SBE
            'business-administration-management'            => '/images/uploads/Obed-Tanda.jpg',
            'accounting-finance'                            => '/images/uploads/Opanyi.jpg',
            'economics'                                     => '/images/uploads/Dr.-Mackton.jpg',
            // SCIT
            'computer-science'                              => '/images/uploads/Dr.-Ronoh.jpg',
            'information-technology'                        => '/images/uploads/Mr.-Shirandula.jpg',
            // SESS
            'educational-foundations-psychology-management' => '/images/uploads/Dr.-Constance.jpg',
            'curriculum-instruction'                        => '/images/uploads/Dr.-Amugune.jpg',
            'languages-literature'                          => '/images/uploads/Thangwa.jpg',
            'social-sciences'                               => '/images/uploads/Wangara.jpg',
            // SHS
            'optometry-vision-sciences'                     => '/images/uploads/Dr.-Mabonga.jpg',
            'nursing'                                       => '/images/uploads/Dr.-Asiko.jpg',
            'clinical-medicine-community-health'            => '/images/uploads/Dr.-Papa.jpg',
            // SOS
            'physical-biological-sciences'                  => '/images/uploads/Dr.-Saouma.jpg',
            'mathematics-statistics'                        => '/images/uploads/Dr.-Apima.jpg',
        ];

        $updated = 0;
        $skipped = 0;

        foreach ($photos as $slug => $photoUrl) {
            $rows = DB::table('departments')->where('slug', $slug)->update([
                'hod_photo_url' => $photoUrl,
                'updated_at'    => now(),
            ]);

            if ($rows > 0) {
                $this->command->line("  <info>Updated</info> : $slug → $photoUrl");
                $updated++;
            } else {
                $this->command->line("  <comment>Skipped</comment> : $slug (not found)");
                $skipped++;
            }
        }

        $this->command->info("Department HOD photos done — {$updated} updated, {$skipped} skipped.");
    }
}
