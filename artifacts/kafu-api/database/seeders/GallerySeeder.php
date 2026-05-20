<?php

namespace Database\Seeders;

use App\Models\GalleryAlbum;
use App\Models\GalleryItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $albums = [
            [
                'title'           => 'Graduation Ceremony 2025',
                'slug'            => 'graduation-2025',
                'description'     => 'KAFU\'s 2025 graduation ceremony celebrated over 800 graduates across all schools. The colourful ceremony was held at the KAFU Main Campus grounds and presided over by the Vice-Chancellor, Prof. Peter Mwita.',
                'category'        => 'graduation',
                'cover_image_url' => 'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg',
                'album_date'      => '2025-11-28',
                'sort_order'      => 1,
                'items'           => [
                    ['type' => 'image', 'title' => 'Procession', 'caption' => 'Academic staff and graduands in procession', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'VC Address', 'caption' => 'Vice-Chancellor Prof. Mwita addressing the graduands', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg', 'sort_order' => 2],
                    ['type' => 'image', 'title' => 'Graduates Celebrating', 'caption' => 'Graduates celebrate after the ceremony', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/posgraduate.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Campus Grounds', 'caption' => 'The beautifully set grounds for the ceremony', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/arial-view-e-1.jpg', 'sort_order' => 4],
                    ['type' => 'video', 'title' => 'Graduation Highlights', 'caption' => 'Video highlights from the 2025 graduation ceremony', 'youtube_id' => 'dQw4w9WgXcQ', 'thumbnail_url' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 'sort_order' => 5],
                ],
            ],
            [
                'title'           => 'Founder\'s Day 2025',
                'slug'            => 'founders-day-2025',
                'description'     => 'Kaimosi Friends University marked Founder\'s Day 2025 with academic symposia, cultural performances, and recognition of outstanding staff and students.',
                'category'        => 'events',
                'cover_image_url' => 'https://kafu.ac.ke/wp-content/uploads/IMG_8696.jpg',
                'album_date'      => '2025-09-15',
                'sort_order'      => 2,
                'items'           => [
                    ['type' => 'image', 'title' => 'Opening Ceremony', 'caption' => 'Official opening of Founder\'s Day celebrations', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/IMG_8696.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Cultural Display', 'caption' => 'Students showcasing Kenyan cultural heritage', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/undergraduate-fin.jpg', 'sort_order' => 2],
                    ['type' => 'image', 'title' => 'Awards Ceremony', 'caption' => 'Outstanding staff and students honoured', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/PIC1.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Group Photo', 'caption' => 'Leadership and staff group photo', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg', 'sort_order' => 4],
                ],
            ],
            [
                'title'           => 'Campus Life',
                'slug'            => 'campus-life',
                'description'     => 'A glimpse into everyday life at Kaimosi Friends University — from the lush highland scenery to student activities, labs, and learning spaces.',
                'category'        => 'campus',
                'cover_image_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/arial-view-e-1.jpg',
                'album_date'      => '2025-10-01',
                'sort_order'      => 3,
                'items'           => [
                    ['type' => 'image', 'title' => 'Aerial View', 'caption' => 'Aerial view of the KAFU main campus', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/arial-view-e-1.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Library', 'caption' => 'Students studying in the university library', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/PIC1.jpg', 'sort_order' => 2],
                    ['type' => 'image', 'title' => 'Lecture Theatre', 'caption' => 'Main lecture theatre in use', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/posgraduate.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Campus Gardens', 'caption' => 'The serene highland campus environment', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/IMG_8696.jpg', 'sort_order' => 4],
                    ['type' => 'video', 'title' => 'Campus Tour', 'caption' => 'A virtual tour of the KAFU campus', 'youtube_id' => 'dQw4w9WgXcQ', 'thumbnail_url' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 'sort_order' => 5],
                ],
            ],
            [
                'title'           => 'Research & Innovation Week 2025',
                'slug'            => 'research-week-2025',
                'description'     => 'KAFU\'s annual Research and Innovation Week showcased groundbreaking projects from students and faculty, attracting local and international partners.',
                'category'        => 'research',
                'cover_image_url' => 'https://kafu.ac.ke/wp-content/uploads/health.jpg',
                'album_date'      => '2025-07-10',
                'sort_order'      => 4,
                'items'           => [
                    ['type' => 'image', 'title' => 'Exhibition Stands', 'caption' => 'Research exhibition stands by different schools', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/health.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Guest Lecture', 'caption' => 'Keynote address by invited researcher', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg', 'sort_order' => 2],
                    ['type' => 'image', 'title' => 'Lab Demonstrations', 'caption' => 'Health Sciences students demonstrating research', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/posgraduate.jpg', 'sort_order' => 3],
                    ['type' => 'video', 'title' => 'Innovation Week Recap', 'caption' => 'Highlights from Research & Innovation Week 2025', 'youtube_id' => 'dQw4w9WgXcQ', 'thumbnail_url' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 'sort_order' => 4],
                ],
            ],
            [
                'title'           => 'International Exchange Programme 2025',
                'slug'            => 'international-exchange-2025',
                'description'     => 'KAFU welcomed international students and staff from partner universities across Europe, Asia, and the Americas as part of its growing exchange programme.',
                'category'        => 'international',
                'cover_image_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/undergraduate-fin.jpg',
                'album_date'      => '2025-06-20',
                'sort_order'      => 5,
                'items'           => [
                    ['type' => 'image', 'title' => 'Welcome Reception', 'caption' => 'International students welcomed at KAFU', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/undergraduate-fin.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Cultural Exchange', 'caption' => 'Cultural exchange activities on campus', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg', 'sort_order' => 2],
                    ['type' => 'image', 'title' => 'Partner MOU Signing', 'caption' => 'Signing of MOU with international partner university', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/IMG_8696.jpg', 'sort_order' => 3],
                ],
            ],
            [
                'title'           => 'Sports Day 2025',
                'slug'            => 'sports-day-2025',
                'description'     => 'KAFU\'s annual Sports Day brought together students and staff for a day of athletics, team sports, and inter-school competitions.',
                'category'        => 'sports',
                'cover_image_url' => 'https://kafu.ac.ke/wp-content/uploads/PIC1.jpg',
                'album_date'      => '2025-08-05',
                'sort_order'      => 6,
                'items'           => [
                    ['type' => 'image', 'title' => 'Opening March', 'caption' => 'Students march during the Sports Day opening', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/PIC1.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Athletics', 'caption' => 'Track and field events in progress', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/arial-view-e-1.jpg', 'sort_order' => 2],
                    ['type' => 'image', 'title' => 'Team Sports', 'caption' => 'Inter-school football competition', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/undergraduate-fin.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Prize Giving', 'caption' => 'Sports Day prize giving ceremony', 'media_url' => 'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg', 'sort_order' => 4],
                ],
            ],
        ];

        foreach ($albums as $albumData) {
            $items = $albumData['items'];
            unset($albumData['items']);

            $album = GalleryAlbum::create($albumData);

            foreach ($items as $item) {
                $album->items()->create($item);
            }
        }
    }
}
