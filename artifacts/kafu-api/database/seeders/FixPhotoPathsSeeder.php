<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Fixes broken relative photo paths left in the database from an earlier seed.
 * Safe to run on any live database — only touches rows with /staff/ paths.
 *
 * Usage:
 *   php artisan db:seed --class=FixPhotoPathsSeeder
 */
class FixPhotoPathsSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Fix departments.hod_photo_url ─────────────────────────────────
        $deptFixed = DB::table('departments')
            ->where('hod_photo_url', 'like', '/staff/%')
            ->update(['hod_photo_url' => null]);

        $this->command->info("departments.hod_photo_url: {$deptFixed} row(s) cleared.");

        // ── 2. Fix cms_content.structured_data (staff member photo field) ─────
        // Fetch rows where structured_data contains a /staff/ photo path
        $staffRows = DB::table('cms_content')
            ->whereRaw("structured_data LIKE '%/staff/%'")
            ->whereIn('type', ['staff'])
            ->get(['id', 'structured_data']);

        $contentFixed = 0;
        foreach ($staffRows as $row) {
            $data = json_decode($row->structured_data, true);
            if (!is_array($data)) continue;

            if (isset($data['photo']) && str_starts_with((string)$data['photo'], '/staff/')) {
                $data['photo'] = null;
                DB::table('cms_content')
                    ->where('id', $row->id)
                    ->update(['structured_data' => json_encode($data)]);
                $contentFixed++;
            }
        }

        $this->command->info("cms_content staff photos: {$contentFixed} row(s) cleared.");

        // ── 3. Fix staff_profiles.photo (direct column if it exists) ─────────
        $hasColumn = DB::getSchemaBuilder()->hasColumn('staff_profiles', 'photo');
        if ($hasColumn) {
            $profileFixed = DB::table('staff_profiles')
                ->where('photo', 'like', '/staff/%')
                ->update(['photo' => null]);
            $this->command->info("staff_profiles.photo: {$profileFixed} row(s) cleared.");
        }

        $this->command->info('Done. Broken /staff/ photo paths have been nulled out.');
        $this->command->info('Staff cards will now show initials instead of broken image icons.');
    }
}
