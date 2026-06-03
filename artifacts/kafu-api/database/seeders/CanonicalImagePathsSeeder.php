<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CanonicalImagePathsSeeder extends Seeder
{
    public function run(): void
    {
        $people = [
            // Management
            'Prof. Peter N. Mwita' => '/images/uploads/prof-peter-mwita.jpg',
            'Prof. Fred. A. Amimo' => '/images/uploads/Prof.-Amimo.jpg',
            'Prof. Thomas Kipkurgat' => '/images/uploads/Kipkurgat.jpg',
            'Dr. Samuel Munda' => '/images/uploads/Dr.-Munda-1.jpg',
            'Dr. Patrick Agesa' => '/images/uploads/Dr.-Agesa.jpg',
            'CPA Emmanuel M. Momanyi' => '/images/uploads/IMGPSP_001.png',
            'Dr. Fredrick M. Nyambane' => '/images/uploads/dean-nyambane.jpg',

            // Department HODs / staff
            'Dr. Constance Amusala' => '/images/uploads/Dr.-Constance.jpg',
            'Dr. Felix Saouma' => '/images/uploads/saouma.jpg',
            'Dr. Aggrey A. Amugune' => '/images/uploads/Dr.-Amugune.jpg',
            "Ms. Margaret Thang'wa" => '/images/uploads/Thangwa.jpg',
            'Mr. Ahmed K. Wangara' => '/images/uploads/Wangara.jpg',
            'Mr. Obed Tanda Monayo' => '/images/uploads/Obed-Tanda.jpg',
            'Dr. Lilian Ronoh' => '/images/uploads/Dr.-Ronoh.jpg',
            'Dr. Ayub H. Shirandula' => '/images/uploads/Mr.-Shirandula.jpg',
            'Dr. Cyprian Mabonga' => '/images/uploads/Dr.-Mabonga.jpg',
            'Dr. Stella Papa' => '/images/uploads/Dr.-Papa.jpg',
            'Dr. Samuel B. Apima' => '/images/uploads/Dr.-Apima.jpg',
            'Dr. Asiko' => '/images/uploads/Dr.-Asiko.jpg',
            'Dr. Mackton' => '/images/uploads/Dr.-Mackton.jpg',
        ];

        foreach ($people as $name => $photo) {
            DB::table('management_profiles')
                ->where('name', 'like', "%$name%")
                ->update(['photo_url' => $photo, 'updated_at' => now()]);

            DB::table('departments')
                ->where('hod_name', 'like', "%$name%")
                ->update(['hod_photo_url' => $photo, 'updated_at' => now()]);

            DB::table('council_members')
                ->where('name', 'like', "%$name%")
                ->update(['photo_url' => $photo, 'updated_at' => now()]);
        }

        // Normalize common local image columns to /images/uploads/<filename>
        $tables = [
            'management_profiles' => ['photo_url'],
            'council_members' => ['photo_url'],
            'departments' => ['hod_photo_url'],
            'directorates' => ['director_photo_url'],
            'campuses' => ['image_url', 'photo_url', 'cover_image_url'],
            'gallery_items' => ['media_url', 'thumbnail_url'],
            'gallery_albums' => ['cover_image_url'],
            'schools' => ['image_url', 'dean_photo_url'],
        ];

        foreach ($tables as $table => $cols) {
            if (!DB::getSchemaBuilder()->hasTable($table)) continue;

            foreach ($cols as $col) {
                if (!DB::getSchemaBuilder()->hasColumn($table, $col)) continue;

                foreach (DB::table($table)->whereNotNull($col)->get() as $row) {
                    $url = $row->$col;
                    if (!$url) continue;

                    $path = parse_url($url, PHP_URL_PATH) ?: $url;
                    $base = basename($path);

                    if (!$base || !preg_match('/\.(jpg|jpeg|png|webp)$/i', $base)) continue;

                    if (
                        str_starts_with($url, '/staff/') ||
                        str_starts_with($url, '/imgs/') ||
                        str_contains($url, 'kafu.ac.ke/wp-content/uploads')
                    ) {
                        DB::table($table)->where('id', $row->id)->update([
                            $col => '/images/uploads/' . $base,
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }

        // Normalize cms_content featured_image + structured_data.photo
        if (DB::getSchemaBuilder()->hasTable('cms_content')) {
            foreach (DB::table('cms_content')->get() as $row) {
                $updates = [];
                $sd = json_decode($row->structured_data ?? '{}', true) ?: [];

                if (!empty($row->featured_image)) {
                    $path = parse_url($row->featured_image, PHP_URL_PATH) ?: $row->featured_image;
                    $base = basename($path);
                    if ($base && preg_match('/\.(jpg|jpeg|png|webp)$/i', $base)) {
                        if (str_starts_with($row->featured_image, '/staff/') || str_starts_with($row->featured_image, '/imgs/') || str_contains($row->featured_image, 'kafu.ac.ke/wp-content/uploads')) {
                            $updates['featured_image'] = '/images/uploads/' . $base;
                        }
                    }
                }

                if (!empty($sd['photo'])) {
                    $path = parse_url($sd['photo'], PHP_URL_PATH) ?: $sd['photo'];
                    $base = basename($path);
                    if ($base && preg_match('/\.(jpg|jpeg|png|webp)$/i', $base)) {
                        if (str_starts_with($sd['photo'], '/staff/') || str_starts_with($sd['photo'], '/imgs/') || str_contains($sd['photo'], 'kafu.ac.ke/wp-content/uploads')) {
                            $sd['photo'] = '/images/uploads/' . $base;
                            $updates['structured_data'] = json_encode($sd);
                        }
                    }
                }

                if ($updates) {
                    $updates['updated_at'] = now();
                    DB::table('cms_content')->where('id', $row->id)->update($updates);
                }
            }
        }


        // Department alias fixes
        DB::table('departments')
            ->where('slug', 'information-technology')
            ->update([
                'hod_name' => 'Dr. Ayub H. Shirandula',
                'hod_title' => 'Chair, Department of Information Technology',
                'hod_email' => 'dept.it@kafu.ac.ke',
                'hod_phone' => '+254 700 100 415',
                'hod_photo_url' => '/images/uploads/Mr.-Shirandula.jpg',
                'updated_at' => now(),
            ]);


        // Directorate photo fixes
        DB::table('directorates')
            ->where('director_name', 'like', '%Hillan%')
            ->update([
                'director_photo_url' => '/images/uploads/Dr.-Ronoh.jpg',
                'updated_at' => now(),
            ]);

        $this->command?->info('Canonical image paths applied.');
    }
}
