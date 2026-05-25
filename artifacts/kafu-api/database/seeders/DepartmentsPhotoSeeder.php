<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentsPhotoSeeder extends Seeder
{
    /**
     * Set hod_photo_url for all departments to local /imgs/staff/ paths.
     * Safe to run on production — only updates the photo field.
     */
    public function run(): void
    {
        $photos = [
            // SBE
            'business-administration-management'            => '/imgs/staff/Obed-Tanda.jpg',
            'accounting-finance'                            => '/imgs/staff/Opanyi.jpg',
            'economics'                                     => '/imgs/staff/Dr.-Mackton.jpg',
            // SCIT
            'computer-science'                              => '/imgs/staff/Dr.-Ronoh.jpg',
            'information-technology'                        => '/imgs/staff/Mr.-Shirandula.jpg',
            // SESS
            'educational-foundations-psychology-management' => '/imgs/staff/Dr.-Constance.jpg',
            'curriculum-instruction'                        => '/imgs/staff/Dr.-Amugune.jpg',
            'languages-literature'                          => '/imgs/staff/Thangwa.jpg',
            'social-sciences'                               => '/imgs/staff/Wangara.jpg',
            // SHS
            'optometry-vision-sciences'                     => '/imgs/staff/Dr.-Mabonga.jpg',
            'nursing'                                       => '/imgs/staff/Dr.-Asiko.jpg',
            'clinical-medicine-community-health'            => '/imgs/staff/Dr.-Papa.jpg',
            // SOS
            'physical-biological-sciences'                  => '/imgs/staff/Dr.-Saouma.jpg',
            'mathematics-statistics'                        => '/imgs/staff/Dr.-Apima.jpg',
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
