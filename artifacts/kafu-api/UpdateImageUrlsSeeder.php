<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Replaces all kafu.ac.ke/wp-content/uploads/ image URLs in the database
 * with local /imgs/ paths that are bundled with the frontend.
 *
 * Safe to run on any live database — only updates rows containing the old URLs.
 *
 * Usage:
 *   php artisan db:seed --class=UpdateImageUrlsSeeder
 */
class UpdateImageUrlsSeeder extends Seeder
{
    /** Map of old absolute URL → new relative local path */
    private const MAP = [
        // Campus / scene photos
        'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg'          => '/imgs/campus-main.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/posgraduate.jpg'              => '/imgs/posgraduate.jpg',
        'https://kafu.ac.ke/wp-content/uploads/image-94.jpeg'                        => '/imgs/image-94.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/image-93.jpeg'                        => '/imgs/image-93.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/undergraduate-fin.jpg'        => '/imgs/undergraduate.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg' => '/imgs/vc-lecture.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/sports.jpg'                   => '/imgs/sports.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/art-culture.jpg'              => '/imgs/art-culture.jpg',
        'https://kafu.ac.ke/wp-content/uploads/image-99.jpeg'                        => '/imgs/image-99.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/2021/01/1.-Student-visual-acuity.jpg' => '/imgs/visual-acuity.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/apply-now.jpg'                => '/imgs/apply-now.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/arial-view-e-1.jpg'           => '/imgs/aerial-1.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/arial-view-e-2-602x400.jpg'   => '/imgs/aerial-2.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/arial-view-e-2.jpg'           => '/imgs/aerial-2.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2021/01/picture2.png'                 => '/imgs/picture2.png',
        'https://kafu.ac.ke/wp-content/uploads/health.jpg'                            => '/imgs/health.jpg',
        'https://kafu.ac.ke/wp-content/uploads/image-31.jpeg'                        => '/imgs/image-31.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/image-39.jpeg'                        => '/imgs/image-39.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/image-43.jpeg'                        => '/imgs/image-43.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/image-82.jpeg'                        => '/imgs/image-82.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/image-87.jpeg'                        => '/imgs/image-87.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/image-15.jpeg'                        => '/imgs/image-15.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/image-22.jpeg'                        => '/imgs/image-22.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/image-97.jpeg'                        => '/imgs/image-97.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/IMG_8696.jpg'                          => '/imgs/IMG_8696.jpg',
        'https://kafu.ac.ke/wp-content/uploads/IMGPSP_001.png'                        => '/imgs/IMGPSP_001.png',
        'https://kafu.ac.ke/wp-content/uploads/IMG_5225-scaled.jpg'                  => '/imgs/IMG_5225.jpg',
        'https://kafu.ac.ke/wp-content/uploads/PIC1.jpg'                              => '/imgs/PIC1.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/logo-footer.png'              => '/imgs/logo-footer.png',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png'     => '/imgs/logo-updated.png',
        'https://kafu.ac.ke/wp-content/uploads/Dr.-Munda-1.jpg'                      => '/imgs/Dr.-Munda-1.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Nursing.jpg'                          => '/imgs/Nursing.jpg',
        'https://kafu.ac.ke/wp-content/uploads/nursing-week.jpg'                     => '/imgs/nursing-week.jpg',
        'https://kafu.ac.ke/wp-content/uploads/tt1.jpg'                              => '/imgs/tt1.jpg',
        'https://kafu.ac.ke/wp-content/uploads/vc.jpeg'                              => '/imgs/vc.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/Prof.-Omieno-1.jpg'                   => '/imgs/Prof.-Omieno-1.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/student.jpg'                  => '/imgs/student.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/apply.jpg'                    => '/imgs/apply.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2024/07/campus-hero.jpg'              => '/imgs/campus-hero.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/campus-1-scaled.jpg'          => '/imgs/campus-1.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/art-kafu.jpg'                 => '/imgs/art-kafu.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/IMG-20251014-WA0070.jpg'      => '/imgs/IMG-20251014.jpg',
        'https://kafu.ac.ke/wp-content/uploads/WhatsApp-Image-2026-05-18-at-18.39.27.jpeg' => '/imgs/whatsapp-may2026.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/yohon.jpeg'                           => '/imgs/yohon.jpeg',
        // Staff headshots
        'https://kafu.ac.ke/wp-content/uploads/2025/10/Dr.-Sangili-Dean-Sess-300x300.jpg'    => '/imgs/staff/Dr.-Sangili.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/Dr.-Jane-300x300.png'                 => '/imgs/staff/Dr.-Jane.png',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/Dr.-Mackton-COD-Economics-300x300.jpg'=> '/imgs/staff/Dr.-Mackton.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/Dr.-Mulinya-Caroline-300x300.jpeg'    => '/imgs/staff/Dr.-Mulinya.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/Dr.-Tom-Mongare-COD-Social-Sciences-300x300.jpg' => '/imgs/staff/Dr.-Mongare.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/Obed-Tanda-COD-BAMs-300x300.jpg'     => '/imgs/staff/Obed-Tanda.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2025/10/Opanyi-COD-Accounting-300x300.jpg'   => '/imgs/staff/Opanyi.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/CPA-Gilbert-K-Kangogo-1.jpg'         => '/imgs/staff/CPA-Kangogo.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Dr.-Agesa.jpg'                       => '/imgs/staff/Dr.-Agesa.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Dr.-Milton-Njuki.jpg'                => '/imgs/staff/Dr.-Njuki.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Dr.-Moses-Osia-Mwanje.jpg'           => '/imgs/staff/Dr.-Mwanje.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Dr.-Thaddaeus-W.-Egondi.jpg'         => '/imgs/staff/Dr.-Egondi.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/image-8-1.jpeg'                      => '/imgs/staff/image-8-1.jpeg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Kipkurgat.jpg'                       => '/imgs/staff/Kipkurgat.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Monanti.jpg'                         => '/imgs/staff/Monanti.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Mr.-David-Mongosi-member.jpg'        => '/imgs/staff/Mr.-Mongosi.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Mr._Shirandula_-COD-ITI-300x300.jpg' => '/imgs/staff/Mr.-Shirandula.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Mr.-Yusuf-Kala.jpg'                 => '/imgs/staff/Mr.-Kala.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Ms.-Rose-Chepkoech-Langat-.jpg'     => '/imgs/staff/Ms.-Langat.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Prof.-Amimo.jpg'                    => '/imgs/staff/Prof.-Amimo.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/prof-ojwang-DIRECTOR-DGS-300x300.jpg'=> '/imgs/staff/Prof.-Ojwang.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Prof.-Peter-Mwita-Sec-to-Council.jpg'=> '/imgs/staff/Prof.-Mwita-council.jpg',
        'https://kafu.ac.ke/wp-content/uploads/2026/02/Prof.-Stanley-O.-Khainga-Council-Chair.jpg' => '/imgs/staff/Prof.-Khainga.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Dr.-Apima-300x300.jpg'                      => '/imgs/staff/Dr.-Apima.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Dr.-Asiko-Nursing-300x300.jpg'              => '/imgs/staff/Dr.-Asiko.jpg',
        'https://kafu.ac.ke/wp-content/uploads/DR.-CONSTANCE-300x300.jpg'                  => '/imgs/staff/Dr.-Constance.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Dr.-Lilian-Ronoh-1-300x300.jpg'             => '/imgs/staff/Dr.-Ronoh.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Dr.-Lindah-Mangeni-300x300.jpg'             => '/imgs/staff/Dr.-Mangeni.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Dr.-Mabonga-300x300.jpg'                    => '/imgs/staff/Dr.-Mabonga.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Dr.-Margaret-Atieno-1-300x300.jpg'          => '/imgs/staff/Dr.-Atieno.jpg',
        'https://kafu.ac.ke/wp-content/uploads/DR.-METRINE-SULUNGAI-DIRECTOR-PLANNING-AND-PERFOMANCE-CONTRACTING-300x300.jpg' => '/imgs/staff/Dr.-Sulungai.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Dr.-Munda-1-300x300.jpg'                    => '/imgs/staff/Dr.-Munda.jpg',
        'https://kafu.ac.ke/wp-content/uploads/DR.-OKWAKO-300x300.jpg'                     => '/imgs/staff/Dr.-Okwako.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Dr.-Stella-Papa-300x300.jpg'                => '/imgs/staff/Dr.-Papa.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Kodipo-300x300.jpg'                         => '/imgs/staff/Kodipo.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Maragia-300x300.jpg'                        => '/imgs/staff/Maragia.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Prof.-Shiundu-300x300.jpg'                  => '/imgs/staff/Prof.-Shiundu.jpg',
        'https://kafu.ac.ke/wp-content/uploads/Simon-Irungu-300x300.jpg'                   => '/imgs/staff/Simon-Irungu.jpg',
    ];

    public function run(): void
    {
        $this->command->info('Updating image URLs in database tables...');

        // ── 1. departments.hod_photo_url ────────────────────────────────
        $deptFixed = 0;
        foreach (self::MAP as $old => $new) {
            $deptFixed += DB::table('departments')
                ->where('hod_photo_url', $old)
                ->update(['hod_photo_url' => $new]);
        }
        $this->command->info("departments.hod_photo_url: {$deptFixed} row(s) updated.");

        // ── 2. cms_content.structured_data (JSON text replace) ──────────
        $contentFixed = 0;
        $rows = DB::table('cms_content')
            ->whereRaw("structured_data LIKE '%kafu.ac.ke/wp-content%'")
            ->get(['id', 'structured_data']);

        foreach ($rows as $row) {
            $data = json_decode($row->structured_data, true);
            if (!is_array($data)) continue;

            $json = $row->structured_data;
            $newJson = $json;
            foreach (self::MAP as $old => $new) {
                $newJson = str_replace($old, $new, $newJson);
            }
            if ($newJson !== $json) {
                DB::table('cms_content')->where('id', $row->id)
                    ->update(['structured_data' => $newJson]);
                $contentFixed++;
            }
        }
        $this->command->info("cms_content: {$contentFixed} row(s) updated.");

        // ── 3. cms_media.url ────────────────────────────────────────────
        $mediaFixed = 0;
        if (DB::getSchemaBuilder()->hasTable('cms_media')) {
            foreach (self::MAP as $old => $new) {
                $mediaFixed += DB::table('cms_media')
                    ->where('url', $old)
                    ->update(['url' => $new]);
                // Also fix thumbnail_url if column exists
                if (DB::getSchemaBuilder()->hasColumn('cms_media', 'thumbnail_url')) {
                    DB::table('cms_media')->where('thumbnail_url', $old)
                        ->update(['thumbnail_url' => $new]);
                }
            }
        }
        $this->command->info("cms_media: {$mediaFixed} row(s) updated.");

        // ── 4. site_config values ────────────────────────────────────────
        $configFixed = 0;
        if (DB::getSchemaBuilder()->hasTable('site_config')) {
            $configs = DB::table('site_config')
                ->whereRaw("value LIKE '%kafu.ac.ke/wp-content%'")
                ->get(['id', 'value']);
            foreach ($configs as $cfg) {
                $newVal = $cfg->value;
                foreach (self::MAP as $old => $new) {
                    $newVal = str_replace($old, $new, $newVal);
                }
                if ($newVal !== $cfg->value) {
                    DB::table('site_config')->where('id', $cfg->id)
                        ->update(['value' => $newVal]);
                    $configFixed++;
                }
            }
        }
        $this->command->info("site_config: {$configFixed} row(s) updated.");

        $this->command->info('Done. All image URLs updated to local /imgs/ paths.');
        $this->command->info('Make sure the kafu-foundation/public/imgs/ folder is deployed alongside the site files.');
    }
}
