<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Best-effort backfill: link each school's Dean to an existing staff profile
     * by matching the legacy loose-text dean name against staff profile titles.
     * Schools with no confident match are left unlinked (Position Vacant).
     */
    public function up(): void
    {
        try {
            $schools = DB::table('cms_content')
                ->where('type', 'school')
                ->where('is_deleted', 0)
                ->get();

            foreach ($schools as $school) {
                $sd = json_decode($school->structured_data ?? '{}', true) ?: [];
                if (!empty($sd['dean_staff_slug'])) continue;

                $deanName = trim($sd['dean'] ?? '');
                if ($deanName === '') continue;

                // Strip common honorifics so the name matches staff titles.
                $needle = trim(preg_replace('/^(prof\.?|dr\.?|mr\.?|mrs\.?|ms\.?|madam|sir)\s+/i', '', $deanName));
                if ($needle === '') continue;

                $match = DB::table('cms_content')
                    ->where('type', 'staff_profile')
                    ->where('is_deleted', 0)
                    ->where('title', 'like', '%' . $needle . '%')
                    ->first();

                if (!$match) {
                    // Fall back to surname-only matching.
                    $parts = preg_split('/\s+/', $needle);
                    $surname = is_array($parts) ? end($parts) : '';
                    if ($surname && strlen($surname) > 2) {
                        $match = DB::table('cms_content')
                            ->where('type', 'staff_profile')
                            ->where('is_deleted', 0)
                            ->where('title', 'like', '%' . $surname . '%')
                            ->first();
                    }
                }

                if ($match) {
                    $sd['dean_staff_slug'] = $match->slug;
                    DB::table('cms_content')
                        ->where('id', $school->id)
                        ->update(['structured_data' => json_encode($sd)]);
                }
            }
        } catch (\Throwable $e) {
            // Best-effort: ignore failures so the migration never blocks deploys.
        }
    }

    public function down(): void
    {
        // No-op: backfilled links are not removed on rollback.
    }
};
