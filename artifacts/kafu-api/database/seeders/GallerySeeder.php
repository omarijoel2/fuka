<?php

namespace Database\Seeders;

use App\Models\GalleryAlbum;
use App\Models\GalleryItem;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        GalleryItem::query()->delete();
        GalleryAlbum::query()->delete();

        $albums = [

            // 1. Graduation Ceremony 2025
            [
                'title'           => 'Graduation Ceremony 2025',
                'slug'            => 'graduation-2025',
                'description'     => 'KAFU\'s 2025 graduation ceremony celebrated over 800 graduates across all five schools. The colourful event was held at the Main Campus grounds and presided over by the Vice-Chancellor, Prof. Peter N. Mwita.',
                'category'        => 'graduation',
                'cover_image_url' => '/images/uploads/IMG_6424-scaled.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Postgraduate Graduates', 'caption' => 'Postgraduate graduands ready to receive their degrees', 'media_url' => '/images/uploads/posgraduate.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'VC Address', 'caption' => 'Vice-Chancellor Prof. Peter N. Mwita addresses the graduating class', 'media_url' => '/images/uploads/vc.jpeg', 'sort_order' => 5],
                    ['type' => 'image', 'title' => 'Ceremony Moments', 'caption' => 'Highlights from the main ceremony stage', 'media_url' => '/images/uploads/image-93.jpeg', 'sort_order' => 6],
                ],
            ],

            // 2. Founder's Day 2025
            [
                'title'           => 'Founder\'s Day 2025',
                'slug'            => 'founders-day-2025',
                'description'     => 'Kaimosi Friends University marked Founder\'s Day 2025 with academic symposia, cultural performances, and recognition of outstanding staff and students celebrating the institution\'s Quaker heritage.',
                'category'        => 'events',
                'cover_image_url' => '/images/uploads/IMG_8696.jpg',
                'album_date'      => '2025-09-15',
                'sort_order'      => 2,
                'items'           => [
                    ['type' => 'image', 'title' => 'Opening Ceremony', 'caption' => 'Official opening of Founder\'s Day 2025 celebrations', 'media_url' => '/images/uploads/IMG_8696.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Leadership Group Photo', 'caption' => 'University leadership and senior staff mark Founder\'s Day', 'media_url' => '/images/uploads/IMG_6424-scaled.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Cultural Display', 'caption' => 'Students showcase Kenyan cultural heritage and Quaker traditions', 'media_url' => '/images/uploads/art-culture.jpg', 'sort_order' => 5],
                ],
            ],

            // 3. Campus Life
            [
                'title'           => 'Campus Life',
                'slug'            => 'campus-life',
                'description'     => 'A glimpse into everyday life at Kaimosi Friends University — from the lush highland scenery to student activities, learning spaces, and the vibrant community on campus.',
                'category'        => 'campus',
                'cover_image_url' => '/images/uploads/arial-view-e-1.jpg',
                'album_date'      => '2025-10-01',
                'sort_order'      => 3,
                'items'           => [
                    ['type' => 'image', 'title' => 'Aerial View — Main Campus', 'caption' => 'Bird\'s-eye view of the KAFU main campus nestled in the Western Kenya highlands', 'media_url' => '/images/uploads/arial-view-e-1.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Aerial View — Campus East', 'caption' => 'Eastern section of the Kaimosi Friends University campus', 'media_url' => '/images/uploads/arial-view-e-2.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Campus Grounds', 'caption' => 'The serene highland environment of the KAFU campus', 'media_url' => '/images/uploads/IMG_5225-scaled.jpg', 'sort_order' => 5],
                    ['type' => 'image', 'title' => 'Campus Community', 'caption' => 'Students and staff on the KAFU campus', 'media_url' => '/images/uploads/image-15.jpeg', 'sort_order' => 7],
                    ['type' => 'image', 'title' => 'Campus Moments', 'caption' => 'Students and staff connect across campus', 'media_url' => '/images/uploads/tt1.jpg', 'sort_order' => 9],
                ],
            ],

            // 4. CBE Teacher Training
            [
                'title'           => 'CBE Teacher Training Programme 2025',
                'slug'            => 'cbe-teacher-training-2025',
                'description'     => 'KAFU hosted fourth-year teacher trainees for the Competency-Based Education (CBE) training programme. The VC officially opened the training, which prepares future educators for Kenya\'s reformed curriculum.',
                'category'        => 'events',
                'cover_image_url' => '/images/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Teacher Trainees', 'caption' => 'Final-year education students during CBE workshop sessions', 'media_url' => '/images/uploads/image-94.jpeg', 'sort_order' => 4],
                ],
            ],

            // 5. Arts & Culture Festival
            [
                'title'           => 'Arts & Culture Festival 2025',
                'slug'            => 'arts-culture-festival-2025',
                'description'     => 'KAFU\'s annual Arts and Culture Festival brought together students to celebrate Kenya\'s rich cultural diversity through performance, visual arts, traditional dance, and creative expression.',
                'category'        => 'events',
                'cover_image_url' => '/images/uploads/art-culture.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'KAFU Arts', 'caption' => 'Visual arts exhibition by students from the School of Education and Social Sciences', 'media_url' => '/images/uploads/art-kafu.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Community Celebration', 'caption' => 'The Kaimosi community joins students in cultural celebration', 'media_url' => '/images/uploads/image-99.jpeg', 'sort_order' => 5],
                ],
            ],

            // 6. Health Sciences Week
            [
                'title'           => 'Health Sciences Week 2025',
                'slug'            => 'health-sciences-week-2025',
                'description'     => 'The School of Health Sciences hosted its annual awareness week featuring free community health screenings, nursing demonstrations, public health talks, and student-led outreach across Western Kenya.',
                'category'        => 'other',
                'cover_image_url' => '/images/uploads/health.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Nursing Students', 'caption' => 'KAFU nursing students during clinical skills demonstration', 'media_url' => '/images/uploads/Nursing.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Community Outreach', 'caption' => 'Health Sciences students conduct free screening for the Kaimosi community', 'media_url' => '/images/uploads/image-8-1.jpeg', 'sort_order' => 4],
                ],
            ],

            // 7. Sports Day 2025
            [
                'title'           => 'Sports Day 2025',
                'slug'            => 'sports-day-2025',
                'description'     => 'KAFU\'s annual Sports Day brought together students, staff, and alumni for a day of athletics, team sports, and inter-school competitions on the campus grounds.',
                'category'        => 'sports',
                'cover_image_url' => '/images/uploads/sports.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Opening March', 'caption' => 'Students and teams march during the official opening of Sports Day', 'media_url' => '/images/uploads/PIC1.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Prize Giving', 'caption' => 'Top athletes and winning teams honoured at the closing ceremony', 'media_url' => '/images/uploads/IMG_8696.jpg', 'sort_order' => 4],
                ],
            ],

            // 8. Research & Innovation Week 2025
            [
                'title'           => 'Research & Innovation Week 2025',
                'slug'            => 'research-week-2025',
                'description'     => 'KAFU\'s annual Research and Innovation Week showcased groundbreaking projects from students and faculty, attracting local and international partners to the Kaimosi campus.',
                'category'        => 'research',
                'cover_image_url' => '/images/uploads/image-8-1.jpeg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Guest Keynote', 'caption' => 'Keynote address delivered by invited researcher from a partner institution', 'media_url' => '/images/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Tech Showcase', 'caption' => 'SCIT students showcase digital innovations and software prototypes', 'media_url' => '/images/uploads/image-99.jpeg', 'sort_order' => 5],
                ],
            ],

            // 9. International Exchange Programme 2025
            [
                'title'           => 'International Exchange Programme 2025',
                'slug'            => 'international-exchange-2025',
                'description'     => 'KAFU welcomed international students and visiting scholars from partner universities across Europe, Asia, and the Americas as part of its growing global exchange and partnership programme.',
                'category'        => 'international',
                'cover_image_url' => '/images/uploads/undergraduate-fin.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'MOU Signing', 'caption' => 'Formal signing of a Memorandum of Understanding with an international partner university', 'media_url' => '/images/uploads/IMG_8696.jpg', 'sort_order' => 2],
                    ['type' => 'image', 'title' => 'Joint Activities', 'caption' => 'Cultural exchange activities and joint academic sessions on campus', 'media_url' => '/images/uploads/arial-view-e-1.jpg', 'sort_order' => 4],
                ],
            ],

            // 10. Admissions Open Day 2025
            [
                'title'           => 'Admissions Open Day 2025',
                'slug'            => 'admissions-open-day-2025',
                'description'     => 'Thousands of prospective students and parents visited the KAFU campus for the annual Admissions Open Day — exploring academic programmes, meeting faculty, and experiencing university life firsthand.',
                'category'        => 'events',
                'cover_image_url' => '/images/uploads/apply-now.jpg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Apply to KAFU', 'caption' => 'Information stands guide students through the KAFU application process', 'media_url' => '/images/uploads/apply.jpg', 'sort_order' => 3],
                    ['type' => 'image', 'title' => 'Student Ambassadors', 'caption' => 'Current students serve as campus ambassadors during Open Day', 'media_url' => '/images/uploads/student.jpg', 'sort_order' => 5],
                ],
            ],

            // 11. May 2026 Campus Update
            [
                'title'           => 'Campus Activities — May 2026',
                'slug'            => 'campus-may-2026',
                'description'     => 'Recent photos capturing the vibrant activity and growth at Kaimosi Friends University in the second semester of the 2025/2026 academic year.',
                'category'        => 'campus',
                'cover_image_url' => '/images/uploads/WhatsApp-Image-2026-05-18-at-18.39.27.jpeg', 'sort_order' => 1],
                    ['type' => 'image', 'title' => 'Academic Calendar', 'caption' => 'Students engaged in academic activities during the second semester', 'media_url' => '/images/uploads/image-94.jpeg', 'sort_order' => 2],
                    ['type' => 'image', 'title' => 'Campus Life 2026', 'caption' => 'Everyday campus life at KAFU in the 2025/2026 academic year', 'media_url' => '/images/uploads/tt1.jpg', 'sort_order' => 4],
                ],
            ],

        ];

        foreach ($albums as $albumData) {
            $items = $albumData['items'];
            unset($albumData['items']);

            $album = GalleryAlbum::create(array_merge($albumData, ['is_published' => true]));

            foreach ($items as $item) {
                $album->items()->create(array_merge($item, ['is_published' => true]));
            }
        }
    }
}
