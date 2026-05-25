<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteConfig;

class SiteConfigSeeder extends Seeder
{
    public function run(): void
    {
        // Homepage configuration
        SiteConfig::setGroup('homepage', [
            'hero_title'           => 'Transforming Lives Through Education',
            'hero_subtitle'        => 'Kaimosi Friends University — Rooted in Quaker values, driven by excellence. Join a community that shapes leaders for Kenya and the world.',
            'hero_cta_primary'     => 'Apply Now',
            'hero_cta_secondary'   => 'Explore Programmes',
            'hero_image_url'       => '/images/uploads/campus-hero.jpg',
            'featured_programme_ids' => [1, 2, 3, 4],
            'featured_research_ids'  => [],
            'stats' => [
                ['label' => 'Students Enrolled', 'value' => '8,500+'],
                ['label' => 'Academic Programmes', 'value' => '60+'],
                ['label' => 'Research Projects', 'value' => '40+'],
                ['label' => 'Years of Excellence', 'value' => '15+'],
            ],
            'quick_links' => [
                ['label' => 'Admissions',      'url' => '/admissions'],
                ['label' => 'Student Portal',  'url' => 'https://portal.kafu.ac.ke'],
                ['label' => 'E-Learning',      'url' => 'https://elearning.kafu.ac.ke'],
                ['label' => 'Library',         'url' => '/research/publications'],
                ['label' => 'Research',        'url' => '/research'],
                ['label' => 'News & Events',   'url' => '/news'],
            ],
            'show_admissions_banner' => true,
            'admissions_banner_text' => 'Undergraduate & Postgraduate Applications Now Open for 2026/2027',
        ]);

        // Navigation
        SiteConfig::setGroup('navigation', [
            'primary_nav' => [
                ['label' => 'About', 'url' => '/about', 'children' => []],
                ['label' => 'Academics', 'url' => '/schools', 'children' => [
                    ['label' => 'Schools & Faculties', 'url' => '/schools'],
                    ['label' => 'Programmes', 'url' => '/programmes'],
                    ['label' => 'Staff Directory', 'url' => '/staff'],
                ]],
                ['label' => 'Admissions', 'url' => '/admissions', 'children' => []],
                ['label' => 'Research', 'url' => '/research', 'children' => [
                    ['label' => 'Overview', 'url' => '/research'],
                    ['label' => 'Projects', 'url' => '/research/projects'],
                    ['label' => 'Publications', 'url' => '/research/publications'],
                ]],
                ['label' => 'International', 'url' => '/international', 'children' => []],
                ['label' => 'News', 'url' => '/news', 'children' => [
                    ['label' => 'Latest News', 'url' => '/news'],
                    ['label' => 'Events', 'url' => '/events'],
                    ['label' => 'Announcements', 'url' => '/announcements'],
                ]],
                ['label' => 'Contact', 'url' => '/contact', 'children' => []],
            ],
            'utility_nav' => [
                ['label' => 'Student Portal', 'url' => 'https://portal.kafu.ac.ke'],
                ['label' => 'E-Learning',     'url' => 'https://elearning.kafu.ac.ke'],
                ['label' => 'Staff Login',    'url' => '/kafu-staff/'],
            ],
            'footer_nav' => [
                [
                    'group' => 'Quick Links',
                    'items' => [
                        ['label' => 'About KAFU',   'url' => '/about'],
                        ['label' => 'Admissions',   'url' => '/admissions'],
                        ['label' => 'Programmes',   'url' => '/programmes'],
                        ['label' => 'Staff',        'url' => '/staff'],
                        ['label' => 'Research',     'url' => '/research'],
                    ],
                ],
                [
                    'group' => 'Student Life',
                    'items' => [
                        ['label' => 'Student Portal', 'url' => 'https://portal.kafu.ac.ke'],
                        ['label' => 'E-Learning',     'url' => 'https://elearning.kafu.ac.ke'],
                        ['label' => 'Opportunities',  'url' => '/opportunities'],
                        ['label' => 'Events',         'url' => '/events'],
                    ],
                ],
                [
                    'group' => 'Information',
                    'items' => [
                        ['label' => 'News',          'url' => '/news'],
                        ['label' => 'Announcements', 'url' => '/announcements'],
                        ['label' => 'Contact',       'url' => '/contact'],
                        ['label' => 'International', 'url' => '/international'],
                    ],
                ],
            ],
        ]);

        // Site-wide controls
        SiteConfig::setGroup('site', [
            'site_name'                => 'Kaimosi Friends University',
            'site_tagline'             => 'Transforming Lives Through Education',
            'emergency_banner_active'  => false,
            'emergency_banner_text'    => '',
            'emergency_banner_type'    => 'warning',
            'announcement_bar_active'  => false,
            'announcement_bar_text'    => '',
            'announcement_bar_url'     => '',
            'maintenance_mode'         => false,
            'social_facebook'          => 'https://facebook.com/KafuUniversity',
            'social_twitter'           => 'https://twitter.com/KafuUniversity',
            'social_linkedin'          => '',
            'social_youtube'           => '',
            'social_instagram'         => '',
            'footer_copyright'         => '© 2026 Kaimosi Friends University. All rights reserved.',
            'footer_tagline'           => 'P.O BOX 385 – 50309, Kaimosi, Kenya',
            'partner_logos'            => [],
        ]);

        // SEO defaults
        SiteConfig::setGroup('seo', [
            'default_title_suffix'  => ' | Kaimosi Friends University',
            'default_description'   => 'Kaimosi Friends University (KAFU) — Quaker-founded public university in Western Kenya. Excellence in education, research, and community service.',
            'default_og_image'      => '/images/uploads/logo-updated-750x126.png',
            'google_analytics_id'   => '',
            'google_site_verification' => '',
            'robots_default'        => 'index,follow',
            'canonical_base_url'    => 'https://kafu.ac.ke',
        ]);

        // Contact defaults
        SiteConfig::setGroup('contact', [
            'phone'           => '+254 777 373 633',
            'email'           => 'info@kafu.ac.ke',
            'vc_email'        => 'vc@kafu.ac.ke',
            'address_line1'   => 'P.O BOX 385 – 50309',
            'address_line2'   => 'Kaimosi, Kenya',
            'office_hours'    => 'Monday – Friday: 8:00 AM – 5:00 PM',
            'main_campus_lat' => '0.1295',
            'main_campus_lng' => '34.9085',
        ]);

        // About page content
        SiteConfig::setGroup('about', [
            'hero_heading'      => 'About KAFU',
            'hero_description'  => 'Discover the history, mission, and vision of Kaimosi Friends University — a Quaker-founded institution at the heart of Western Kenya.',
            'hero_image_url'    => '/images/uploads/IMG_8696.jpg',
            'history_heading'   => 'Our History',
            'history_p1'        => 'Kaimosi Friends University (KAFU) was established in 2014, rooted deeply in the Quaker heritage of truth and service. What began as a constituent college has rapidly grown into a fully-fledged, independent public university in Western Kenya.',
            'history_p2'        => 'The university stands as a testament to the pioneering educational efforts of the Friends Church (Quakers) in the region. Since its inception, KAFU has been dedicated to providing quality higher education, fostering research, and promoting innovation that addresses societal needs.',
            'history_p3'        => 'Today, KAFU serves thousands of students across its five distinct schools, offering over 38 academic programmes ranging from certificates to doctoral degrees.',
            'vision'            => 'To be a premier university in training, research, innovation and community service.',
            'mission'           => 'To provide quality education and training, promote research and innovation for sustainable development.',
            'quaker_heritage'   => 'KAFU draws from the rich Quaker tradition of Friends Church East Africa, which established the first school at Kaimosi in 1902. This heritage of service, integrity, and education without discrimination remains at the core of every programme, policy, and partnership the university pursues.',
            'vc_name'           => 'Prof. Peter Nyamuhanga Mwita',
            'vc_title'          => 'Vice-Chancellor',
            'vc_bio'            => 'Prof. Mwita was officially appointed Vice-Chancellor of Kaimosi Friends University on 14 May 2025, having served in an acting capacity since February 2024. Under his leadership, KAFU continues to advance its mission of quality education, research, and community engagement.',
            'vc_email'          => 'vc@kafu.ac.ke',
            'vc_photo_url'      => '/images/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg',
            'core_values'       => ['Integrity and Professionalism', 'Quality and Excellence', 'Equity and Inclusivity', 'Innovation and Creativity', 'Teamwork and Collaboration'],
            'sidebar_stats'     => [
                ['label' => 'Location',        'value' => 'Kaimosi, Western Kenya'],
                ['label' => 'Academic Breadth', 'value' => '5 Schools, 38+ Programmes'],
                ['label' => 'Founded',          'value' => '2014'],
                ['label' => 'Programmes',       'value' => 'Certificate to PhD level'],
                ['label' => 'Unique Offering',  'value' => 'One of 2 universities in Kenya offering Optometry to PhD'],
            ],
        ]);

        // Student services page content
        SiteConfig::setGroup('student-services', [
            'hero_heading'        => 'Student Life & Services',
            'hero_description'    => 'We are committed to providing a holistic university experience that nurtures the mind, body, and spirit.',
            'intro_text'          => 'At Kaimosi Friends University, learning goes beyond the classroom. Since our establishment in 2014, we have continuously developed support systems and extracurricular facilities to ensure our students thrive academically and personally.',
            'digital_title'       => 'Digital Services',
            'digital_description' => 'Access your timetables, exam results, and online classes through our centralized portals.',
            'portal_url'          => 'https://portal.kafu.ac.ke',
            'elearning_url'       => 'https://elearning.kafu.ac.ke',
            'services'            => [
                ['icon' => 'Activity',      'title' => 'Games & Sports',      'description' => 'Established alongside the university in 2014, our sports department offers football, basketball, athletics, and indoor games. We actively participate in regional university leagues.'],
                ['icon' => 'Library',       'title' => 'University Library',  'description' => 'A quiet, resourceful environment with extensive physical collections and access to thousands of e-journals and academic databases for research.'],
                ['icon' => 'ShieldCheck',   'title' => 'Accommodation',       'description' => 'Secure, affordable on-campus hostels for students. Off-campus private hostels around Kaimosi are also vetted by our accommodation office.'],
                ['icon' => 'HeartHandshake','title' => 'Counselling Services','description' => 'Professional, confidential psychological support and mentorship to help students navigate academic stress and personal challenges.'],
                ['icon' => 'Users',         'title' => 'Student Government',  'description' => 'The KAFU Students Organization advocates for student welfare, organizes cultural events, and provides leadership development opportunities.'],
            ],
        ]);
    }
}
