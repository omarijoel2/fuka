<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\GalleryAlbum;
use Carbon\Carbon;

/**
 * Adds the "Kobujoi Campus" gallery album.
 * This seeder is idempotent — it skips if the album slug already exists.
 */
class KobujoiGallerySeeder extends Seeder
{
    public function run(): void
    {
        if (GalleryAlbum::where('slug', 'kobujoi-campus')->exists()) {
            return;
        }

        $album = GalleryAlbum::create([
            'title'           => 'Kobujoi Campus',
            'slug'            => 'kobujoi-campus',
            'description'     => 'A photo gallery of the KAFU Kobujoi Campus — featuring facilities, student activities, and the University Council\'s familiarization and induction tour of May 2026.',
            'category'        => 'campus',
            'cover_image_url' => 'https://kafu.ac.ke/wp-content/uploads/Members-of-the-University-Council-tour-Kaimosi-Friends-Universitys-Kobujoi-Campus-during-the-three-day-familiarization-and-induction-programme.jpeg',
            'album_date'      => '2026-05-18',
            'is_published'    => true,
            'sort_order'      => 2,
        ]);

        $items = [
            [
                'title'     => 'University Council — Campus Familiarization Tour',
                'caption'   => 'Members of the University Council tour Kobujoi Campus during the three-day familiarization and induction programme.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/Members-of-the-University-Council-tour-Kaimosi-Friends-Universitys-Kobujoi-Campus-during-the-three-day-familiarization-and-induction-programme.jpeg',
                'sort_order' => 1,
            ],
            [
                'title'     => 'Council at Proposed Moses Mudavadi College Site',
                'caption'   => 'University Council at Moi Girls Vokoli — proposed site for the Moses Mudavadi College of Health Sciences.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/Members-of-the-University-Council-pose-for-a-group-photo-at-Moi-Girls-Vokoli-during-the-familiarization-tour-of-the-proposed-site-for-the-Moses-Mudavadi-College-of-Health-Sciences.jpeg',
                'sort_order' => 2,
            ],
            [
                'title'     => 'Council at Health Sciences Anatomy Laboratory',
                'caption'   => 'University Council with students at the School of Health Sciences Anatomy Laboratory during the induction tour.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/Members-of-the-University-Council-pose-for-a-group-photo-with-students-at-the-School-of-Health-Sciences-Anatomy-Laboratory-Kaimosi-Friends-University-during-the-familiarization-and-induction-tour.jpeg',
                'sort_order' => 3,
            ],
            [
                'title'     => 'Kobujoi Campus — May 2026',
                'caption'   => 'Campus scenes at Kobujoi during the 2025/2026 academic year.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/image-113-480x320.jpeg',
                'sort_order' => 4,
            ],
            [
                'title'     => 'Campus Grounds',
                'caption'   => 'Kobujoi Campus grounds and facilities.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/image-110-480x320.jpeg',
                'sort_order' => 5,
            ],
            [
                'title'     => 'Academic Facilities',
                'caption'   => 'Academic and learning facilities at Kobujoi Campus.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/image-108-480x320.jpeg',
                'sort_order' => 6,
            ],
            [
                'title'     => 'Campus Life — May 2026',
                'caption'   => 'Student activities at Kobujoi Campus.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/WhatsApp-Image-2026-05-18-at-18.39.27-480x320.jpeg',
                'sort_order' => 7,
            ],
            [
                'title'     => 'Student Engagement',
                'caption'   => 'Students engaged in academic activities at Kobujoi.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/image-94-480x320.jpeg',
                'sort_order' => 8,
            ],
            [
                'title'     => 'Campus Activities',
                'caption'   => 'Vibrant campus life at KAFU Kobujoi.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/image-93-480x320.jpeg',
                'sort_order' => 9,
            ],
            [
                'title'     => 'Kobujoi Facilities',
                'caption'   => 'University facilities at Kobujoi Campus.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/image-87-480x320.jpeg',
                'sort_order' => 10,
            ],
            [
                'title'     => 'Learning Environment',
                'caption'   => 'The learning environment at KAFU Kobujoi Campus.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/image-82-480x320.jpeg',
                'sort_order' => 11,
            ],
            [
                'title'     => 'Campus Overview',
                'caption'   => 'An overview of the Kobujoi Campus.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/image-2-480x320.png',
                'sort_order' => 12,
            ],
            [
                'title'     => 'Kobujoi Community',
                'caption'   => 'Community and student life at Kobujoi Campus.',
                'media_url' => 'https://kafu.ac.ke/wp-content/uploads/image-80-480x320.jpeg',
                'sort_order' => 13,
            ],
        ];

        foreach ($items as $item) {
            $album->items()->create(array_merge($item, [
                'type'         => 'image',
                'is_published' => true,
            ]));
        }
    }
}
