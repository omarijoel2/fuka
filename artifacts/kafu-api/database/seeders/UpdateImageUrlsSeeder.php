<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Replaces all https://kafu.ac.ke/wp-content/uploads/[any/subdirs/]filename.ext
 * image URLs stored in the database with local /images/uploads/filename.ext paths
 * that are bundled and served by the frontend build.
 *
 * Handles both plain string columns and JSON array columns.
 * Safe to re-run — only rows containing the old external host are touched.
 *
 * Usage (production):
 *   php artisan db:seed --class=UpdateImageUrlsSeeder
 */
class UpdateImageUrlsSeeder extends Seeder
{
    /**
     * Convert an external kafu.ac.ke wp-content/uploads URL to a local path.
     * Returns null if the URL does not match the expected pattern.
     */
    private function localise(string $url): ?string
    {
        if (preg_match(
            '#https?://kafu\.ac\.ke/wp-content/uploads/(?:[^/]+/)*([^/"\'>\s]+\.(?:jpe?g|png|webp|gif))#i',
            $url,
            $m
        )) {
            return '/images/uploads/' . $m[1];
        }
        return null;
    }

    /**
     * Replace all external image URLs within a string (handles plain strings
     * and inline occurrences inside JSON).
     */
    private function replaceInString(string $value): string
    {
        return preg_replace_callback(
            '#https?://kafu\.ac\.ke/wp-content/uploads/(?:[^/]+/)*([^/"\'>\s]+\.(?:jpe?g|png|webp|gif))#i',
            fn($m) => '/images/uploads/' . $m[1],
            $value
        );
    }

    /**
     * Process a JSON-encoded array column, replacing all external image URLs
     * inside it and returning the updated JSON string (or null if unchanged).
     */
    private function replaceInJson(?string $json): ?string
    {
        if (!$json || !str_contains($json, 'kafu.ac.ke')) {
            return null;
        }
        $updated = $this->replaceInString($json);
        return $updated !== $json ? $updated : null;
    }

    // -------------------------------------------------------------------------
    // Table/column definitions
    // -------------------------------------------------------------------------

    /** [table, string_columns, json_columns] */
    private const SCHEMA = [
        // Campuses
        ['campuses',        ['hero_image'],                          ['gallery_images']],
        // Schools
        ['schools',         ['hero_image', 'dean_photo_url', 'thumbnail', 'image'], []],
        // Directorates
        ['directorates',    ['director_photo_url', 'hero_image'],    []],
        // Departments
        ['departments',     ['head_photo_url', 'image'],             []],
        // Staff profiles
        ['staff_profiles',  ['profile_photo', 'photo'],              []],
        // University council
        ['university_council', ['photo_url', 'photo'],               []],
        // News / events / announcements
        ['news',            ['image_url', 'hero_image', 'thumbnail'], ['gallery_images']],
        ['events',          ['image_url', 'hero_image', 'thumbnail'], ['gallery_images']],
        ['announcements',   ['image_url', 'thumbnail'],              []],
        // CMS content — structured_data is a large JSON blob
        ['cms_content',     ['featured_image'],                      ['structured_data', 'gallery']],
        // Site config — value can be a URL string
        ['site_config',     ['value'],                               []],
        // Media / gallery
        ['media_items',     ['url', 'thumbnail_url', 'media_url'],   []],
        ['gallery_items',   ['media_url', 'url', 'thumbnail'],       []],
        // Research
        ['research_projects',   ['image', 'hero_image'],             []],
        ['research_publications', ['cover_image'],                   []],
        // International
        ['international_programs', ['image', 'hero_image'],          []],
        ['international_partnerships', ['logo', 'image'],            []],
    ];

    public function run(): void
    {
        $totalRows = 0;

        foreach (self::SCHEMA as [$table, $stringCols, $jsonCols]) {
            // Skip tables that don't exist (fresh install may lack some)
            if (!$this->tableExists($table)) {
                $this->command->line("  <comment>Skipped</comment>  (table missing): $table");
                continue;
            }

            $allCols    = array_merge($stringCols, $jsonCols);
            $existingCols = $this->existingColumns($table, $allCols);

            if (empty($existingCols)) {
                continue;
            }

            // Build WHERE clause: at least one column contains 'kafu.ac.ke'
            $conditions = implode(' OR ', array_map(
                fn($c) => DB::getQueryGrammar()->wrap($c) . " LIKE '%kafu.ac.ke%'",
                $existingCols
            ));

            $rows = DB::table($table)->whereRaw($conditions)->get();

            if ($rows->isEmpty()) {
                continue;
            }

            $updated = 0;
            foreach ($rows as $row) {
                $changes = [];

                // String columns
                foreach (array_intersect($stringCols, $existingCols) as $col) {
                    $val = $row->$col ?? null;
                    if (!$val || !str_contains($val, 'kafu.ac.ke')) continue;
                    $new = $this->replaceInString($val);
                    if ($new !== $val) $changes[$col] = $new;
                }

                // JSON columns
                foreach (array_intersect($jsonCols, $existingCols) as $col) {
                    $val = $row->$col ?? null;
                    if (!$val) continue;
                    // The value may already be a decoded PHP array (depends on Eloquent vs DB::)
                    $json = is_array($val) ? json_encode($val) : $val;
                    $new  = $this->replaceInJson($json);
                    if ($new !== null) $changes[$col] = $new;
                }

                if (!empty($changes)) {
                    DB::table($table)->where('id', $row->id)->update($changes);
                    $updated++;
                }
            }

            if ($updated > 0) {
                $this->command->line("  <info>Updated</info>  $table: $updated row(s)");
                $totalRows += $updated;
            }
        }

        $this->command->info("\nDone — $totalRows row(s) updated. All images now reference /images/uploads/.");
    }

    private function tableExists(string $table): bool
    {
        try {
            DB::table($table)->limit(1)->get();
            return true;
        } catch (\Exception) {
            return false;
        }
    }

    private function existingColumns(string $table, array $cols): array
    {
        try {
            $actual = array_map(
                fn($c) => $c->name ?? $c->Field ?? null,
                DB::select('PRAGMA table_info(' . $table . ')') ?: []
            );
            // PRAGMA returns nothing for MySQL; fall back to attempting the query
            if (empty($actual)) {
                return $cols; // trust the schema definition on MySQL
            }
            return array_values(array_filter($cols, fn($c) => in_array($c, $actual)));
        } catch (\Exception) {
            return $cols;
        }
    }
}
