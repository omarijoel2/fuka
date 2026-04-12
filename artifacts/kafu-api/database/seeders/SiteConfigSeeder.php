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
            'hero_image_url'       => 'https://kafu.ac.ke/wp-content/uploads/2024/07/campus-hero.jpg',
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
            'default_og_image'      => 'https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png',
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
    }
}
