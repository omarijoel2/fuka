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
            'digital_services' => [
                ['icon' => 'monitor', 'label' => 'Student Portal',       'desc' => 'Registration, results, fee statements and more', 'url' => 'https://portal.kafu.ac.ke', 'external' => true],
                ['icon' => 'book',    'label' => 'E-Learning',           'desc' => 'Online classes, course materials and assignments', 'url' => 'https://elearning.kafu.ac.ke', 'external' => true],
                ['icon' => 'library', 'label' => 'Library',              'desc' => 'Digital resources, research databases and journals', 'url' => '#', 'external' => false],
                ['icon' => 'mail',    'label' => 'Institutional Email',   'desc' => 'Official KAFU email for students and staff', 'url' => 'mailto:info@kafu.ac.ke', 'external' => false],
                ['icon' => 'users',   'label' => 'Staff Portal',         'desc' => 'HR, payroll and administrative services for staff', 'url' => '#', 'external' => false],
                ['icon' => 'file',    'label' => 'Document Downloads',    'desc' => 'Forms, joining instructions, fee structures', 'url' => '/admissions', 'external' => false],
            ],
            'show_admissions_banner' => true,
            'admissions_banner_text' => 'Undergraduate & Postgraduate Applications Now Open for 2026/2027',
        ]);

        // Navigation
        SiteConfig::setGroup('navigation', [
            'primary_nav' => [
                ['label' => 'Home', 'url' => '/', 'type' => 'link'],
                ['label' => 'About Us', 'url' => '/about', 'type' => 'mega', 'mega_width' => 520, 'mega_cols' => 2,
                    'mega_groups' => [
                        ['heading' => 'The University', 'links' => [
                            ['label' => 'About KAFU',            'url' => '/about'],
                            ['label' => 'Vice-Chancellor',       'url' => '/about/vice-chancellor'],
                            ['label' => 'University Management',  'url' => '/about/management'],
                            ['label' => 'University Council',     'url' => '/about/council'],
                            ['label' => 'Strategic Plan',        'url' => '/about/strategic-plan'],
                        ]],
                        ['heading' => 'Governance & More', 'links' => [
                            ['label' => 'Service Charter',                 'url' => '/about/service-charter'],
                            ['label' => 'Policies & Regulations',          'url' => '/about/policies'],
                            ['label' => 'Our Campuses',                    'url' => '/campuses'],
                            ['label' => 'Directorates',                    'url' => '/directorates'],
                            ['label' => 'Corporate Social Responsibility', 'url' => '/about/csr'],
                        ]],
                    ],
                    'mega_footer' => [
                        ['label' => 'Facts & Figures', 'url' => '/institutional-data'],
                        ['label' => 'Contact Us',      'url' => '/contact'],
                    ],
                ],
                ['label' => 'Academics', 'url' => '/schools', 'type' => 'mega', 'mega_width' => 720, 'mega_cols' => 3,
                    'mega_groups' => [
                        ['heading' => 'Schools & Faculties', 'links' => [
                            ['label' => 'All Schools',                  'url' => '/schools'],
                            ['label' => 'Education & Social Sciences',   'url' => '/schools/SESS'],
                            ['label' => 'Business & Economics',         'url' => '/schools/SBE'],
                            ['label' => 'Computing & IT',               'url' => '/schools/SCIT'],
                            ['label' => 'Science',                      'url' => '/schools/SOS'],
                            ['label' => 'Health Sciences',              'url' => '/schools/SHS'],
                        ]],
                        ['heading' => 'Programmes', 'links' => [
                            ['label' => 'Programme Catalogue',         'url' => '/programmes'],
                            ['label' => 'Compare Programmes',          'url' => '/programmes/compare'],
                            ['label' => 'Postgraduate',                'url' => '/programmes?level=postgraduate'],
                            ['label' => 'Open, Distance & e-Learning', 'url' => '/directorates/open-distance-elearning'],
                        ]],
                        ['heading' => 'Resources', 'links' => [
                            ['label' => 'Academic Calendar',   'url' => '/admissions/calendar'],
                            ['label' => 'Timetables',          'url' => '/admissions/timetables'],
                            ['label' => 'Library & Repository','url' => '/repository'],
                            ['label' => 'E-Learning',          'url' => 'https://elearning.kafu.ac.ke', 'external' => true],
                        ]],
                    ],
                    'mega_footer' => [['label' => 'All Programmes', 'url' => '/programmes']],
                ],
                ['label' => 'Admission', 'url' => '/admissions', 'type' => 'mega', 'mega_width' => 520, 'mega_cols' => 2,
                    'mega_groups' => [
                        ['heading' => 'Apply', 'links' => [
                            ['label' => 'Admissions Overview',     'url' => '/admissions'],
                            ['label' => 'Apply Online',            'url' => '/admissions/apply'],
                            ['label' => 'Track Application',       'url' => '/admissions/track'],
                            ['label' => 'International Admissions', 'url' => '/international/study'],
                            ['label' => 'Visa & Immigration',      'url' => '/international/visa'],
                        ]],
                        ['heading' => 'Information', 'links' => [
                            ['label' => 'Entry Requirements',    'url' => '/admissions/eligibility'],
                            ['label' => 'Fees & Financing',      'url' => '/admissions/fees'],
                            ['label' => 'Access to Funding',     'url' => '/admissions/funding'],
                            ['label' => 'Intake Calendar',       'url' => '/admissions/calendar'],
                            ['label' => 'Joining Instructions',  'url' => '/admissions/joining-instructions'],
                        ]],
                    ],
                    'mega_footer' => [['label' => 'Apply Now', 'url' => '/admissions']],
                ],
                ['label' => 'Research', 'url' => '/research', 'type' => 'mega', 'mega_width' => 520, 'mega_cols' => 2,
                    'mega_groups' => [
                        ['heading' => 'Research', 'links' => [
                            ['label' => 'Research Overview', 'url' => '/research'],
                            ['label' => 'Research Projects', 'url' => '/research/projects'],
                            ['label' => 'Publications',      'url' => '/research/publications'],
                            ['label' => 'KAFU Journal',      'url' => '/research/journal'],
                        ]],
                        ['heading' => 'Innovation & More', 'links' => [
                            ['label' => 'Partnerships & Grants',       'url' => '/research/partnerships'],
                            ['label' => 'Institutional Repository',    'url' => '/repository'],
                            ['label' => 'Ethics Review Committee',      'url' => '/research/ethics'],
                            ['label' => 'Innovation & Incubation Hub',  'url' => 'https://kafu-iihub.com', 'external' => true],
                        ]],
                    ],
                    'mega_footer' => [['label' => 'Research & Innovation', 'url' => '/research']],
                ],
                ['label' => 'Info', 'url' => '/news', 'type' => 'mega', 'mega_width' => 720, 'mega_cols' => 3,
                    'mega_groups' => [
                        ['heading' => 'News & Media', 'links' => [
                            ['label' => 'Latest News',     'url' => '/news'],
                            ['label' => 'Events Calendar', 'url' => '/events'],
                            ['label' => 'Announcements',   'url' => '/announcements'],
                            ['label' => 'Journal',         'url' => '/journal'],
                            ['label' => 'Media Gallery',   'url' => '/media'],
                            ['label' => 'Photo Gallery',   'url' => '/gallery'],
                        ]],
                        ['heading' => 'Student Life', 'links' => [
                            ['label' => 'Student Services',  'url' => '/student-services'],
                            ['label' => 'Dean of Students',  'url' => '/students/affairs'],
                            ['label' => 'Student Council',   'url' => '/students/council'],
                            ['label' => 'Alumni & Outcomes', 'url' => '/alumni'],
                            ['label' => 'Opportunities',     'url' => '/opportunities'],
                        ]],
                        ['heading' => 'Quick Links', 'links' => [
                            ['label' => 'Student Portal', 'url' => 'https://portal.kafu.ac.ke',    'external' => true],
                            ['label' => 'E-Learning',     'url' => 'https://elearning.kafu.ac.ke', 'external' => true],
                            ['label' => 'Staff Login',    'url' => 'https://kafu.ac.ke/staff',     'external' => true],
                            ['label' => 'Downloads',      'url' => '/media/downloads'],
                            ['label' => 'International',   'url' => '/international'],
                            ['label' => 'Contact',        'url' => '/contact'],
                        ]],
                    ],
                    'mega_footer' => [['label' => 'All News', 'url' => '/news']],
                ],
            ],
            'utility_nav' => [
                ['label' => 'Student Portal', 'url' => 'https://portal.kafu.ac.ke'],
                ['label' => 'E-Learning',     'url' => 'https://elearning.kafu.ac.ke'],
                ['label' => 'Staff Login',    'url' => 'https://kafu.ac.ke/staff'],
                ['label' => 'Library',        'url' => '/repository'],
                ['label' => 'Downloads',      'url' => '/media/downloads'],
                ['label' => 'Alumni',         'url' => '/alumni'],
                ['label' => 'Tenders',        'url' => '/opportunities'],
                ['label' => 'Contacts',       'url' => '/contact'],
            ],
            'footer_nav' => [
                [
                    'group' => 'Quick Links',
                    'items' => [
                        ['label' => 'About KAFU',          'url' => '/about'],
                        ['label' => 'Schools & Faculties', 'url' => '/schools'],
                        ['label' => 'Academic Programmes', 'url' => '/programmes'],
                        ['label' => 'Admissions',          'url' => '/admissions'],
                        ['label' => 'Apply Online',        'url' => '/admissions/apply'],
                        ['label' => 'Staff Directory',     'url' => '/staff'],
                        ['label' => 'Contact Us',          'url' => '/contact'],
                    ],
                ],
                [
                    'group' => 'Opportunities',
                    'items' => [
                        ['label' => 'All Opportunities',      'url' => '/opportunities'],
                        ['label' => 'Tenders',                'url' => '/opportunities?category=tender'],
                        ['label' => 'Vacancies',              'url' => '/opportunities?category=vacancy'],
                        ['label' => 'Internships',            'url' => '/opportunities?category=internship'],
                        ['label' => 'Scholarships',           'url' => '/opportunities?category=scholarship'],
                        ['label' => 'Calls for Applications', 'url' => '/opportunities?category=call'],
                        ['label' => 'Archives',               'url' => '/archives'],
                    ],
                ],
                [
                    'group' => 'Research & Info',
                    'items' => [
                        ['label' => 'Research Overview', 'url' => '/research'],
                        ['label' => 'Research Projects', 'url' => '/research/projects'],
                        ['label' => 'Publications',      'url' => '/research/publications'],
                        ['label' => 'Repository',        'url' => '/repository'],
                        ['label' => 'International',      'url' => '/international'],
                        ['label' => 'Strategic Plan',    'url' => '/about/strategic-plan'],
                        ['label' => 'Policies',          'url' => '/about/policies'],
                    ],
                ],
                [
                    'group' => 'Portals',
                    'items' => [
                        ['label' => 'Student Portal', 'url' => 'https://portal.kafu.ac.ke'],
                        ['label' => 'E-Learning',     'url' => 'https://elearning.kafu.ac.ke'],
                        ['label' => 'Staff Portal',   'url' => '/staff'],
                        ['label' => 'Library Portal', 'url' => 'https://library.kafu.ac.ke'],
                    ],
                ],
                [
                    'group' => 'Governance',
                    'items' => [
                        ['label' => 'University Council', 'url' => '/about/council'],
                        ['label' => 'Management',         'url' => '/about/management'],
                        ['label' => 'Directorates',       'url' => '/directorates'],
                        ['label' => 'Service Charter',    'url' => '/about/service-charter'],
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

        // Branding — logo URLs, colours, tagline, and download links
        SiteConfig::setGroup('branding', [
            'logo_primary_url'     => '/imgs/logo-updated.png',
            'logo_white_url'       => '/imgs/logo-updated.png',
            'logo_alt'             => 'Kaimosi Friends University',
            'favicon_url'          => '/favicon.ico',
            'tagline'              => 'Spring of Knowledge',
            'site_description'     => 'A Quaker-founded public university established in 2014, committed to truth, service, and academic excellence.',
            'primary_color'        => '#1A5C38',
            'gold_color'           => '#C9A227',
            'white_color'          => '#FFFFFF',
            'dark_color'           => '#111827',
            'logo_full_color_url'  => '#',
            'logo_reversed_url'    => '#',
            'logo_gold_url'        => '#',
            'logo_mono_url'        => '#',
            'logo_icon_url'        => '#',
            'brand_guidelines_url' => '#',
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

        // Admissions fees configuration (academic year, note, payment methods)
        SiteConfig::setGroup('admissions_fees', [
            'data' => json_encode([
                'academic_year'            => '2025/2026',
                'note'                     => 'All fees are reviewed annually. The figures above reflect 2025/2026 rates. Prospective students should confirm current rates with the Finance Office before payment.',
                'payment_methods_visible'  => false,
                'payment_methods'          => [
                    [
                        'method'  => 'M-Pesa',
                        'details' => 'Paybill Number: [PENDING — confirm with Finance Office]. Use your student ID as account number.',
                        'enabled' => false,
                    ],
                    [
                        'method'  => 'Bank Deposit / Transfer',
                        'details' => 'Kenya Commercial Bank (KCB) — Account: Kaimosi Friends University, A/C No: [PENDING], Branch: Kaimosi',
                        'enabled' => false,
                    ],
                    [
                        'method'  => 'Cooperative Bank',
                        'details' => 'Cooperative Bank — Account: [PENDING], Branch: Kakamega',
                        'enabled' => false,
                    ],
                    [
                        'method'  => 'Cash (Finance Office)',
                        'details' => 'Finance Office, Ground Floor, Administration Block. Mon–Fri, 8:00 AM – 4:00 PM.',
                        'enabled' => false,
                    ],
                ],
            ]),
        ]);

        // RBAC permissions matrix (role → feature → bool)
        SiteConfig::setGroup('permissions', [
            'matrix' => json_encode([
                'super_admin'          => ['content_management' => true,  'review_queue' => true,  'research_office' => true,  'international_office' => true,  'governance' => true,  'admissions' => true,  'media_library' => true,  'site_controls' => true,  'seo_redirects' => true,  'reports' => true,  'user_management' => true,  'taxonomy' => true,  'settings' => true],
                'ict_admin'            => ['content_management' => true,  'review_queue' => true,  'research_office' => true,  'international_office' => true,  'governance' => true,  'admissions' => true,  'media_library' => true,  'site_controls' => true,  'seo_redirects' => true,  'reports' => true,  'user_management' => false, 'taxonomy' => true,  'settings' => true],
                'communications_admin' => ['content_management' => true,  'review_queue' => true,  'research_office' => true,  'international_office' => true,  'governance' => true,  'admissions' => true,  'media_library' => true,  'site_controls' => true,  'seo_redirects' => false, 'reports' => true,  'user_management' => false, 'taxonomy' => true,  'settings' => false],
                'reviewer'             => ['content_management' => false, 'review_queue' => true,  'research_office' => false, 'international_office' => false, 'governance' => false, 'admissions' => false, 'media_library' => false, 'site_controls' => false, 'seo_redirects' => false, 'reports' => false, 'user_management' => false, 'taxonomy' => false, 'settings' => false],
                'admissions_owner'     => ['content_management' => false, 'review_queue' => false, 'research_office' => false, 'international_office' => false, 'governance' => false, 'admissions' => true,  'media_library' => false, 'site_controls' => false, 'seo_redirects' => false, 'reports' => false, 'user_management' => false, 'taxonomy' => false, 'settings' => false],
                'academic_owner'       => ['content_management' => true,  'review_queue' => true,  'research_office' => false, 'international_office' => false, 'governance' => false, 'admissions' => false, 'media_library' => false, 'site_controls' => false, 'seo_redirects' => false, 'reports' => false, 'user_management' => false, 'taxonomy' => false, 'settings' => false],
                'procurement_owner'    => ['content_management' => true,  'review_queue' => false, 'research_office' => false, 'international_office' => false, 'governance' => false, 'admissions' => false, 'media_library' => false, 'site_controls' => false, 'seo_redirects' => false, 'reports' => false, 'user_management' => false, 'taxonomy' => false, 'settings' => false],
                'hr_owner'             => ['content_management' => true,  'review_queue' => false, 'research_office' => false, 'international_office' => false, 'governance' => false, 'admissions' => false, 'media_library' => false, 'site_controls' => false, 'seo_redirects' => false, 'reports' => false, 'user_management' => false, 'taxonomy' => false, 'settings' => false],
                'staff_user'           => ['content_management' => false, 'review_queue' => false, 'research_office' => false, 'international_office' => false, 'governance' => false, 'admissions' => false, 'media_library' => false, 'site_controls' => false, 'seo_redirects' => false, 'reports' => false, 'user_management' => false, 'taxonomy' => false, 'settings' => false],
                'dept_editor'          => ['content_management' => true,  'review_queue' => false, 'research_office' => false, 'international_office' => false, 'governance' => false, 'admissions' => false, 'media_library' => true,  'site_controls' => false, 'seo_redirects' => false, 'reports' => false, 'user_management' => false, 'taxonomy' => false, 'settings' => false],
            ]),
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

        // Staff portal institutional documents
        SiteConfig::setGroup('staff_documents', [
            'intro' => 'Institutional policies, strategic documents, and guidelines for all Kaimosi Friends University staff members.',
            'documents' => [
                ['title' => 'Strategic Plan 2023–2027',     'type' => 'PDF', 'url' => '/about/strategic-plan',  'size' => '',  'description' => 'University five-year strategic framework and objectives.'],
                ['title' => 'Policies & Regulations',       'type' => 'PDF', 'url' => '/about/policies',        'size' => '',  'description' => 'Institutional policies, statutes, and regulatory guidelines.'],
                ['title' => 'Service Charter',              'type' => 'PDF', 'url' => '/about/service-charter', 'size' => '',  'description' => 'Service standards and commitments to stakeholders.'],
                ['title' => 'Staff Handbook',               'type' => 'PDF', 'url' => '',                       'size' => '',  'description' => 'Employee handbook covering HR policies and procedures.'],
                ['title' => 'HR Policies',                  'type' => 'PDF', 'url' => '',                       'size' => '',  'description' => 'Human resource management policies and guidelines.'],
                ['title' => 'Anti-Corruption & Ethics Policy', 'type' => 'PDF', 'url' => '',                   'size' => '',  'description' => 'University code of ethics and anti-corruption guidelines.'],
            ],
        ]);

        // Admissions content — Entry Requirements (KCSE grade map) + How-to-Apply guide
        SiteConfig::setGroup('admissions_content', [
            'kcse_heading'     => 'Entry Requirements at a Glance',
            'kcse_intro'       => 'Minimum KCSE mean grades by programme level. Actual requirements depend on the specific programme and available slots.',
            'kcse_grades' => [
                ['level' => 'Undergraduate', 'pathway' => 'Government-Sponsored (KUCCPS)', 'grade' => 'C+ (Plus)', 'other' => 'KUCCPS placement + programme cluster subjects'],
                ['level' => 'Undergraduate', 'pathway' => 'Self-Sponsored (Module II)', 'grade' => 'C (Plain)', 'other' => 'Programme cluster subjects; direct application'],
                ['level' => 'Undergraduate', 'pathway' => 'Diploma Holders', 'grade' => 'C (Plain)', 'other' => 'Relevant diploma + interview (select programmes)'],
                ['level' => 'Postgraduate (Masters)', 'pathway' => 'All Pathways', 'grade' => 'Relevant First Degree', 'other' => '2nd Class Honours (Upper) or equivalent'],
                ['level' => 'Doctoral (PhD)', 'pathway' => 'All Pathways', 'grade' => 'Masters Degree', 'other' => 'Research proposal + panel interview'],
            ],
            'how_to_apply_heading' => 'How to Apply — Unified Guide',
            'how_to_apply_intro'   => 'Regardless of your pathway, the core application process follows these steps.',
            'how_to_apply' => [
                ['n' => '01', 'title' => 'Identify Your Programme', 'body' => 'Browse the KAFU Programme Catalogue and identify the degree, diploma, or certificate that aligns with your career goals and eligibility.'],
                ['n' => '02', 'title' => 'Confirm Entry Requirements', 'body' => 'Cross-check the minimum KCSE grades, subject requirements, and any special prerequisites for your chosen programme.'],
                ['n' => '03', 'title' => 'Choose Your Application Route', 'body' => 'Government-sponsored students apply via KUCCPS. All others apply directly through the KAFU Student Portal at portal.kafu.ac.ke.'],
                ['n' => '04', 'title' => 'Gather Required Documents', 'body' => 'Prepare certified copies of your academic certificates, national ID, passport photos, and any additional documents required for your pathway.'],
                ['n' => '05', 'title' => 'Submit & Pay Application Fee', 'body' => 'Complete your application form online or in person and pay the non-refundable application fee via M-Pesa, bank, or at the Finance Office.'],
                ['n' => '06', 'title' => 'Receive & Accept Offer', 'body' => 'Successful applicants will receive an admission letter. Accept your offer, pay the required fees, and report on the designated joining date.'],
            ],
        ]);
    }
}
