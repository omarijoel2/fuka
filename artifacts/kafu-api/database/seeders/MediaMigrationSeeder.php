<?php

namespace Database\Seeders;

use App\Models\MediaFile;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Registers all known site media assets into the media_files table.
 * Assets are external URLs hosted on kafu.ac.ke — we record the URL,
 * folder, alt text, and mime type without downloading the files.
 */
class MediaMigrationSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@kafu.ac.ke')->value('id') ?? 1;

        $assets = [
            // ── Logos ────────────────────────────────────────────────
            [
                'folder'        => 'logos',
                'filename'      => 'logo-updated-750x126.png',
                'original_name' => 'KAFU Main Logo (Wide)',
                'mime_type'     => 'image/png',
                'extension'     => 'png',
                'url'           => '/images/uploads/logo-updated-750x126.png',
                'alt_text'      => 'Kaimosi Friends University footer logo',
                'caption'       => 'White variant of the KAFU logo used in the footer',
            ],

            // ── Campus Life ───────────────────────────────────────────
            [
                'folder'        => 'campus',
                'filename'      => 'IMG_6424-scaled.jpg',
                'original_name' => 'KAFU Main Campus (Aerial)',
                'mime_type'     => 'image/jpeg',
                'extension'     => 'jpg',
                'url'           => '/images/uploads/IMG_6424-scaled.jpg',
                'alt_text'      => 'Undergraduate students at Kaimosi Friends University',
                'caption'       => 'Undergraduate students on the KAFU campus. Used in the Campus Life section on the homepage.',
            ],
            [
                'folder'        => 'campus',
                'filename'      => 'posgraduate.jpg',
                'original_name' => 'Postgraduate Students on Campus',
                'mime_type'     => 'image/jpeg',
                'extension'     => 'jpg',
                'url'           => '/images/uploads/posgraduate.jpg',
                'alt_text'      => 'Arts and culture activities at Kaimosi Friends University',
                'caption'       => 'Cultural activities on the KAFU campus. Used in the Campus Life section on the homepage.',
            ],
            [
                'folder'        => 'campus',
                'filename'      => 'sports.jpg',
                'original_name' => 'KAFU Sports Activities',
                'mime_type'     => 'image/jpeg',
                'extension'     => 'jpg',
                'url'           => '/images/uploads/sports.jpg',
                'alt_text'      => 'Kaimosi Friends University campus',
                'caption'       => 'General campus photograph used across the KAFU website.',
            ],

            // ── Marketing / CTAs ─────────────────────────────────────
            [
                'folder'        => 'marketing',
                'filename'      => 'apply-now.jpg',
                'original_name' => 'Apply Now — CTA Background',
                'mime_type'     => 'image/jpeg',
                'extension'     => 'jpg',
                'url'           => '/images/uploads/apply-now.jpg',
                'alt_text'      => 'Students at Kaimosi Friends University — apply now',
                'caption'       => 'Background image for the Apply Now call-to-action section on the homepage.',
            ],

            // ── News & Events ─────────────────────────────────────────
            [
                'folder'        => 'news',
                'filename'      => 'IMG_8696.jpg',
                'original_name' => 'VC Prof. Peter Mwita — Address',
                'mime_type'     => 'image/jpeg',
                'extension'     => 'jpg',
                'url'           => '/images/uploads/IMG_8696.jpg',
                'alt_text'      => 'Vice-Chancellor Prof. Peter Mwita addresses teacher trainees during the CBE training at KAFU',
                'caption'       => 'VC Prof. Peter Mwita opening the Competency-Based Education (CBE) training workshop for fourth-year teacher trainees at Kaimosi Friends University.',
            ],
        ];

        $now = now();
        foreach ($assets as $asset) {
            // For external assets, use the URL as the path (no local file stored)
            $path = 'external/' . $asset['folder'] . '/' . $asset['filename'];
            MediaFile::firstOrCreate(
                ['url' => $asset['url']],
                array_merge($asset, [
                    'path'        => $path,
                    'size'        => 0,
                    'uploaded_by' => $admin,
                    'is_public'   => true,
                    'status'      => 'active',
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ])
            );
        }

        $count = MediaFile::where('status', 'active')->count();
        $this->command->info("Media migration complete. {$count} assets now in library.");
    }
}
