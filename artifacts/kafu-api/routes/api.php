<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/healthz', function () {
    return response()->json(['status' => 'ok', 'service' => 'KAFU API']);
});

Route::get('/news', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'slug' => 'innovators-develop-smart-digital-systems',
                'title' => 'Innovators Develop Smart Digital Systems for Better Service Delivery',
                'excerpt' => 'KAFU students and faculty develop cutting-edge digital solutions aimed at transforming service delivery across Western Kenya.',
                'category' => 'In the News',
                'date' => '2026-03-20',
                'image' => null,
                'featured' => true,
            ],
            [
                'id' => 2,
                'slug' => 'community-backs-college-of-health-sciences-vokoli',
                'title' => 'Community Backs Proposal to Establish College of Health Sciences in Vokoli',
                'excerpt' => 'Local community leaders and stakeholders rally behind the proposed expansion of KAFU health sciences programmes to Vokoli.',
                'category' => 'In the News',
                'date' => '2026-03-15',
                'image' => null,
                'featured' => false,
            ],
            [
                'id' => 3,
                'slug' => 'kafu-hosts-ministry-of-health-officials',
                'title' => 'KAFU Hosts Officials from the Ministry of Health',
                'excerpt' => 'Senior Ministry of Health officials visited KAFU to explore partnerships in healthcare education and training.',
                'category' => 'In the News',
                'date' => '2026-03-10',
                'image' => null,
                'featured' => false,
            ],
            [
                'id' => 4,
                'slug' => 'kafu-to-host-africa-public-service-day-2026',
                'title' => 'Historic Moment as KAFU is Earmarked to Host Africa Public Service Day 2026',
                'excerpt' => 'Kaimosi Friends University has been selected as the host institution for the continental Africa Public Service Day 2026 celebrations.',
                'category' => 'In the News',
                'date' => '2026-03-05',
                'image' => null,
                'featured' => true,
            ],
            [
                'id' => 5,
                'slug' => 'mumias-east-candidates-career-mentorship',
                'title' => 'Mumias East Candidates Benefit from Career Mentorship and Academic Guidance Through KAFU',
                'excerpt' => 'KAFU extends its community outreach by offering career mentorship and academic guidance to students in Mumias East.',
                'category' => 'In the News',
                'date' => '2026-02-28',
                'image' => null,
                'featured' => false,
            ],
            [
                'id' => 6,
                'slug' => 'kafu-vc-represents-education-cs-migori',
                'title' => 'KAFU VC Represents Education CS at Women Empowerment Initiative in Migori County',
                'excerpt' => 'The Vice Chancellor represented the Cabinet Secretary for Education at a women empowerment event in Migori County.',
                'category' => 'In the News',
                'date' => '2026-02-20',
                'image' => null,
                'featured' => false,
            ],
            [
                'id' => 7,
                'slug' => 'teacher-trainees-competency-based-education',
                'title' => 'Teacher Trainees Receive Competency-Based Education Training',
                'excerpt' => 'KAFU School of Education hosts a training workshop on Competency-Based Education for teacher trainees.',
                'category' => 'Academic',
                'date' => '2026-02-15',
                'image' => null,
                'featured' => false,
            ],
            [
                'id' => 8,
                'slug' => 'kafu-interdenominational-prayer-breakfast',
                'title' => 'KAFU Hosts 2nd Interdenominational Prayer Breakfast',
                'excerpt' => 'The university community gathered for the second annual interdenominational prayer breakfast, reinforcing KAFU\'s Quaker heritage.',
                'category' => 'Events',
                'date' => '2026-02-10',
                'image' => null,
                'featured' => false,
            ],
        ],
    ]);
});

Route::get('/news/{slug}', function (string $slug) {
    return response()->json(['data' => ['slug' => $slug, 'content' => 'Full article content coming soon.']]);
});

Route::get('/events', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'title' => 'Examination Processing Schedule — Semester II (2025/2026)',
                'date' => '2026-04-02',
                'time' => '08:00 – 17:00',
                'location' => 'Main Campus, Kaimosi',
                'category' => 'Examinations',
            ],
            [
                'id' => 2,
                'title' => 'Internal Audit',
                'date' => '2026-05-05',
                'time' => '08:00 – 17:00',
                'location' => 'Administration Block',
                'category' => 'Administration',
            ],
            [
                'id' => 3,
                'title' => 'Africa Public Service Day 2026',
                'date' => '2026-06-23',
                'time' => 'All Day',
                'location' => 'Kaimosi Friends University, Main Campus',
                'category' => 'Special Events',
            ],
        ],
    ]);
});

Route::get('/schools', function () {
    return response()->json([
        'data' => [
            [
                'code' => 'SESS',
                'name' => 'School of Education and Social Sciences',
                'dean' => 'Dr. Nabeta K.N Sangili',
                'description' => 'SESS offers programmes in teacher education, social work, criminology, disaster management, and social sciences. It is committed to producing competent professionals who serve communities across Kenya and beyond.',
                'programmes_count' => ['undergraduate' => 7, 'postgraduate' => 7, 'doctoral' => 2],
                'colour' => '#1B3A6B',
            ],
            [
                'code' => 'SBE',
                'name' => 'School of Business and Economics',
                'dean' => 'Dr. Atieno Margaret Omondi',
                'description' => 'SBE empowers students to become transformative leaders and responsible professionals equipped with knowledge, skills, and ethical foundations to succeed in a rapidly changing world.',
                'programmes_count' => ['undergraduate' => 3, 'postgraduate' => 2, 'doctoral' => 1],
                'colour' => '#D4A017',
            ],
            [
                'code' => 'SCIT',
                'name' => 'School of Computing and Information Technology',
                'dean' => 'Prof. Kelvin K. Omieno',
                'description' => 'Nestled in the tranquil and green environment of Western Kenya, SCIT offers an ideal learning environment for aspiring tech professionals and is a hub of academic excellence and innovation.',
                'programmes_count' => ['undergraduate' => 2, 'postgraduate' => 1, 'doctoral' => 0],
                'colour' => '#2D6A4F',
            ],
            [
                'code' => 'SOS',
                'name' => 'School of Science',
                'dean' => 'Dr. Annette O. Busula',
                'description' => 'SOS offers rigorous science programmes spanning physics, chemistry, biology, mathematics, statistics, and agricultural economics, preparing graduates for research and industry.',
                'programmes_count' => ['undergraduate' => 7, 'postgraduate' => 4, 'doctoral' => 0],
                'colour' => '#3A5A8C',
            ],
            [
                'code' => 'SHS',
                'name' => 'School of Health Sciences',
                'dean' => null,
                'description' => 'Established in 2022, SHS is one of only two institutions in Kenya offering Optometry up to PhD level. It is rapidly becoming a flagship institution in Western Kenya for healthcare education.',
                'programmes_count' => ['undergraduate' => 3, 'postgraduate' => 0, 'doctoral' => 0],
                'colour' => '#8B1A1A',
            ],
        ],
    ]);
});

Route::get('/schools/{code}', function (string $code) {
    $schools = [
        'SESS' => [
            'code' => 'SESS',
            'name' => 'School of Education and Social Sciences',
            'dean' => 'Dr. Nabeta K.N Sangili',
            'description' => 'SESS offers programmes in teacher education, social work, criminology, disaster management, and social sciences.',
            'vision' => 'To be a centre of excellence in Education and Social Sciences in Africa.',
            'mission' => 'To provide quality education through teaching, research, and community engagement.',
            'programmes' => [
                ['level' => 'undergraduate', 'name' => 'Bachelor of Education (Arts)', 'code' => 'BEd (Arts)', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Education (French)', 'code' => 'BEd (French)', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Education (Science)', 'code' => 'BEd (Science)', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Social Work', 'code' => 'BSW', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Education (Early Childhood Development)', 'code' => 'BEd ECD', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Disaster Management and International Diplomacy', 'code' => 'BDMID', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Arts in Criminology and Criminal Justice', 'code' => 'BA Criminology', 'duration' => '4 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Arts in Religion', 'code' => 'MA Religion', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Arts in Comparative Literature', 'code' => 'MA Comp. Lit.', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Education in Educational Psychology', 'code' => 'MEd Ed. Psych.', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Arts in English Language', 'code' => 'MA English', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Arts in Kiswahili', 'code' => 'MA Kiswahili', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Arts in Geography', 'code' => 'MA Geography', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Arts in History', 'code' => 'MA History', 'duration' => '2 years'],
                ['level' => 'doctoral', 'name' => 'Doctor of Philosophy in Comparative Literature', 'code' => 'PhD Comp. Lit.', 'duration' => '3-5 years'],
                ['level' => 'doctoral', 'name' => 'Doctor of Philosophy in Religion', 'code' => 'PhD Religion', 'duration' => '3-5 years'],
            ],
        ],
        'SBE' => [
            'code' => 'SBE',
            'name' => 'School of Business and Economics',
            'dean' => 'Dr. Atieno Margaret Omondi',
            'description' => 'SBE empowers students to become transformative leaders and responsible professionals.',
            'vision' => 'To be a centre of excellence in teaching professional and market driven courses.',
            'mission' => 'To provide professional and market driven courses that enable graduates fit in the labour market.',
            'programmes' => [
                ['level' => 'undergraduate', 'name' => 'Bachelor of Commerce', 'code' => 'BCom', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Economics', 'code' => 'BSc Economics', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Economics and Statistics', 'code' => 'BSc Econ & Stats', 'duration' => '4 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Business Administration', 'code' => 'MBA', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Science in Economics', 'code' => 'MSc Economics', 'duration' => '2 years'],
                ['level' => 'doctoral', 'name' => 'Doctor of Philosophy in Business Administration', 'code' => 'PhD Bus. Admin.', 'duration' => '3-5 years'],
            ],
        ],
        'SCIT' => [
            'code' => 'SCIT',
            'name' => 'School of Computing and Information Technology',
            'dean' => 'Prof. Kelvin K. Omieno',
            'description' => 'SCIT trains solution-oriented ICT experts capable of transforming the digital economy locally and globally.',
            'vision' => 'To be a center of excellence in teaching, research, and innovation in computing and information technology for sustainable development.',
            'mission' => 'To provide quality education in computing and IT through innovative teaching, research, and industry engagement.',
            'programmes' => [
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Computer Science', 'code' => 'BSc CS', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Information Technology', 'code' => 'BSc IT', 'duration' => '4 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Science in Information Technology', 'code' => 'MSc IT', 'duration' => '2 years'],
            ],
        ],
        'SOS' => [
            'code' => 'SOS',
            'name' => 'School of Science',
            'dean' => 'Dr. Annette O. Busula',
            'description' => 'SOS offers rigorous science programmes spanning physics, chemistry, biology, mathematics, statistics, and agricultural economics.',
            'vision' => 'To be a centre of excellence in scientific research and education.',
            'mission' => 'To provide quality science education through teaching, research, and innovation.',
            'programmes' => [
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Physics with Appropriate Technology', 'code' => 'BSc Physics', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Chemistry', 'code' => 'BSc Chemistry', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Mathematics with IT', 'code' => 'BSc Maths+IT', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Applied Statistics with IT', 'code' => 'BSc Stat+IT', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Biology', 'code' => 'BSc Biology', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Agricultural Economics and Resource Management', 'code' => 'BSc Agric. Econ.', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Economics and Statistics', 'code' => 'BSc Econ+Stats', 'duration' => '4 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Science in Physics', 'code' => 'MSc Physics', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Science in Applied Mathematics', 'code' => 'MSc Appl. Maths', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Science in Pure Mathematics', 'code' => 'MSc Pure Maths', 'duration' => '2 years'],
                ['level' => 'postgraduate', 'name' => 'Master of Science in Microbiology', 'code' => 'MSc Microbiology', 'duration' => '2 years'],
            ],
        ],
        'SHS' => [
            'code' => 'SHS',
            'name' => 'School of Health Sciences',
            'dean' => null,
            'description' => 'Established in 2022, SHS is one of only two institutions in Kenya offering Optometry up to PhD level.',
            'vision' => 'To be a centre of excellence in health sciences education and research in East and Central Africa.',
            'mission' => 'To train competent health professionals through quality education, research, and clinical practice.',
            'programmes' => [
                ['level' => 'undergraduate', 'name' => 'Bachelor of Optometry and Vision Sciences', 'code' => 'BOptom', 'duration' => '5 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Nursing', 'code' => 'BSN', 'duration' => '4 years'],
                ['level' => 'undergraduate', 'name' => 'Bachelor of Science in Clinical Medicine and Community Health', 'code' => 'BSc Clinical Med.', 'duration' => '4 years'],
            ],
        ],
    ];

    $code = strtoupper($code);
    if (!isset($schools[$code])) {
        return response()->json(['error' => 'School not found'], 404);
    }

    return response()->json(['data' => $schools[$code]]);
});

Route::get('/programmes', function (Request $request) {
    $all = [
        ['school' => 'SESS', 'level' => 'undergraduate', 'name' => 'Bachelor of Education (Arts)', 'code' => 'BEd (Arts)', 'duration' => '4 years'],
        ['school' => 'SESS', 'level' => 'undergraduate', 'name' => 'Bachelor of Education (French)', 'code' => 'BEd (French)', 'duration' => '4 years'],
        ['school' => 'SESS', 'level' => 'undergraduate', 'name' => 'Bachelor of Education (Science)', 'code' => 'BEd (Science)', 'duration' => '4 years'],
        ['school' => 'SESS', 'level' => 'undergraduate', 'name' => 'Bachelor of Social Work', 'code' => 'BSW', 'duration' => '4 years'],
        ['school' => 'SESS', 'level' => 'undergraduate', 'name' => 'Bachelor of Education (ECD)', 'code' => 'BEd ECD', 'duration' => '4 years'],
        ['school' => 'SESS', 'level' => 'undergraduate', 'name' => 'Bachelor of Disaster Management and International Diplomacy', 'code' => 'BDMID', 'duration' => '4 years'],
        ['school' => 'SESS', 'level' => 'undergraduate', 'name' => 'Bachelor of Arts in Criminology and Criminal Justice', 'code' => 'BA Criminology', 'duration' => '4 years'],
        ['school' => 'SESS', 'level' => 'postgraduate', 'name' => 'Master of Arts in Religion', 'code' => 'MA Religion', 'duration' => '2 years'],
        ['school' => 'SESS', 'level' => 'postgraduate', 'name' => 'Master of Arts in Comparative Literature', 'code' => 'MA Comp. Lit.', 'duration' => '2 years'],
        ['school' => 'SESS', 'level' => 'postgraduate', 'name' => 'Master of Education in Educational Psychology', 'code' => 'MEd Ed. Psych.', 'duration' => '2 years'],
        ['school' => 'SESS', 'level' => 'postgraduate', 'name' => 'Master of Arts in English Language', 'code' => 'MA English', 'duration' => '2 years'],
        ['school' => 'SESS', 'level' => 'postgraduate', 'name' => 'Master of Arts in Kiswahili', 'code' => 'MA Kiswahili', 'duration' => '2 years'],
        ['school' => 'SESS', 'level' => 'postgraduate', 'name' => 'Master of Arts in Geography', 'code' => 'MA Geography', 'duration' => '2 years'],
        ['school' => 'SESS', 'level' => 'postgraduate', 'name' => 'Master of Arts in History', 'code' => 'MA History', 'duration' => '2 years'],
        ['school' => 'SESS', 'level' => 'doctoral', 'name' => 'Doctor of Philosophy in Comparative Literature', 'code' => 'PhD Comp. Lit.', 'duration' => '3-5 years'],
        ['school' => 'SESS', 'level' => 'doctoral', 'name' => 'Doctor of Philosophy in Religion', 'code' => 'PhD Religion', 'duration' => '3-5 years'],
        ['school' => 'SBE', 'level' => 'undergraduate', 'name' => 'Bachelor of Commerce', 'code' => 'BCom', 'duration' => '4 years'],
        ['school' => 'SBE', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Economics', 'code' => 'BSc Economics', 'duration' => '4 years'],
        ['school' => 'SBE', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Economics and Statistics', 'code' => 'BSc Econ & Stats', 'duration' => '4 years'],
        ['school' => 'SBE', 'level' => 'postgraduate', 'name' => 'Master of Business Administration', 'code' => 'MBA', 'duration' => '2 years'],
        ['school' => 'SBE', 'level' => 'postgraduate', 'name' => 'Master of Science in Economics', 'code' => 'MSc Economics', 'duration' => '2 years'],
        ['school' => 'SBE', 'level' => 'doctoral', 'name' => 'Doctor of Philosophy in Business Administration', 'code' => 'PhD Bus. Admin.', 'duration' => '3-5 years'],
        ['school' => 'SCIT', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Computer Science', 'code' => 'BSc CS', 'duration' => '4 years'],
        ['school' => 'SCIT', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Information Technology', 'code' => 'BSc IT', 'duration' => '4 years'],
        ['school' => 'SCIT', 'level' => 'postgraduate', 'name' => 'Master of Science in Information Technology', 'code' => 'MSc IT', 'duration' => '2 years'],
        ['school' => 'SOS', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Physics with Appropriate Technology', 'code' => 'BSc Physics', 'duration' => '4 years'],
        ['school' => 'SOS', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Chemistry', 'code' => 'BSc Chemistry', 'duration' => '4 years'],
        ['school' => 'SOS', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Mathematics with IT', 'code' => 'BSc Maths+IT', 'duration' => '4 years'],
        ['school' => 'SOS', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Applied Statistics with IT', 'code' => 'BSc Stat+IT', 'duration' => '4 years'],
        ['school' => 'SOS', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Biology', 'code' => 'BSc Biology', 'duration' => '4 years'],
        ['school' => 'SOS', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Agricultural Economics and Resource Management', 'code' => 'BSc Agric. Econ.', 'duration' => '4 years'],
        ['school' => 'SOS', 'level' => 'postgraduate', 'name' => 'Master of Science in Physics', 'code' => 'MSc Physics', 'duration' => '2 years'],
        ['school' => 'SOS', 'level' => 'postgraduate', 'name' => 'Master of Science in Applied Mathematics', 'code' => 'MSc Appl. Maths', 'duration' => '2 years'],
        ['school' => 'SOS', 'level' => 'postgraduate', 'name' => 'Master of Science in Pure Mathematics', 'code' => 'MSc Pure Maths', 'duration' => '2 years'],
        ['school' => 'SOS', 'level' => 'postgraduate', 'name' => 'Master of Science in Microbiology', 'code' => 'MSc Microbiology', 'duration' => '2 years'],
        ['school' => 'SHS', 'level' => 'undergraduate', 'name' => 'Bachelor of Optometry and Vision Sciences', 'code' => 'BOptom', 'duration' => '5 years'],
        ['school' => 'SHS', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Nursing', 'code' => 'BSN', 'duration' => '4 years'],
        ['school' => 'SHS', 'level' => 'undergraduate', 'name' => 'Bachelor of Science in Clinical Medicine and Community Health', 'code' => 'BSc Clinical Med.', 'duration' => '4 years'],
    ];

    $filtered = $all;

    if ($request->query('school')) {
        $school = strtoupper($request->query('school'));
        $filtered = array_values(array_filter($filtered, fn($p) => $p['school'] === $school));
    }

    if ($request->query('level')) {
        $level = strtolower($request->query('level'));
        $filtered = array_values(array_filter($filtered, fn($p) => $p['level'] === $level));
    }

    return response()->json(['data' => $filtered, 'total' => count($filtered)]);
});

Route::get('/contact', function () {
    return response()->json([
        'data' => [
            'institution' => 'Kaimosi Friends University',
            'abbreviation' => 'KAFU',
            'address' => 'P.O BOX 385 – 50309, Kaimosi, Kenya',
            'phone' => '+254 777 373 633',
            'emails' => [
                ['label' => 'Vice Chancellor', 'address' => 'vc@kafu.ac.ke'],
                ['label' => 'General Enquiries', 'address' => 'info@kafu.ac.ke'],
            ],
            'website' => 'https://kafu.ac.ke',
            'portals' => [
                ['name' => 'Student Portal', 'url' => 'https://portal.kafu.ac.ke'],
                ['name' => 'E-Learning (ODL)', 'url' => 'https://elearning.kafu.ac.ke'],
            ],
            'social_media' => [
                ['platform' => 'Facebook', 'url' => 'https://www.facebook.com/KaimosiUniversity'],
                ['platform' => 'Twitter', 'url' => 'https://twitter.com/KaimosiUni'],
                ['platform' => 'YouTube', 'url' => 'https://www.youtube.com/@kaimosifrienduniversity'],
            ],
        ],
    ]);
});

Route::get('/opportunities', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'type' => 'Tender',
                'title' => 'Supply of Laboratory Equipment and Consumables',
                'reference' => 'KAFU/PROC/001/2026',
                'deadline' => '2026-04-30',
                'status' => 'open',
            ],
            [
                'id' => 2,
                'type' => 'Job Vacancy',
                'title' => 'Tutorial Fellow — School of Computing and Information Technology',
                'reference' => 'KAFU/HR/TF/001/2026',
                'deadline' => '2026-04-20',
                'status' => 'open',
            ],
            [
                'id' => 3,
                'type' => 'Scholarship',
                'title' => 'KAFU Merit Scholarships 2026/2027 Academic Year',
                'reference' => 'KAFU/SCHOLAR/001/2026',
                'deadline' => '2026-05-15',
                'status' => 'open',
            ],
        ],
    ]);
});

Route::get('/staff', function (Request $request) {
    $staff = [
        // University Leadership
        [
            'slug' => 'prof-peter-n-mwita',
            'title' => 'Prof.',
            'first_name' => 'Peter',
            'middle_name' => 'Nyamuhanga',
            'last_name' => 'Mwita',
            'name' => 'Prof. Peter Nyamuhanga Mwita',
            'designation' => 'Vice-Chancellor',
            'school' => null,
            'department' => 'Office of the Vice-Chancellor',
            'unit' => 'University Leadership',
            'email' => 'vc@kafu.ac.ke',
            'specializations' => ['Higher Education Leadership', 'Institutional Governance', 'Innovation and Entrepreneurship', 'Strategic Planning'],
            'photo' => null,
            'bio' => 'Prof. Peter Nyamuhanga Mwita is the Vice-Chancellor of Kaimosi Friends University. Officially appointed on 14 May 2025, having served as Acting VC since February 2024, he leads KAFU\'s transformation into a world-class institution through innovation, strategic partnerships, and commitment to producing job creators.',
        ],
        [
            'slug' => 'prof-james-a-shikuku',
            'title' => 'Prof.',
            'first_name' => 'James',
            'middle_name' => 'A.',
            'last_name' => 'Shikuku',
            'name' => 'Prof. James A. Shikuku',
            'designation' => 'Deputy Vice-Chancellor (Academic Affairs)',
            'school' => null,
            'department' => 'Academic Affairs',
            'unit' => 'University Leadership',
            'email' => 'dvc.academics@kafu.ac.ke',
            'specializations' => ['Curriculum Development', 'Quality Assurance', 'Academic Policy'],
            'photo' => null,
            'bio' => 'Prof. Shikuku oversees academic programmes, quality assurance, and curriculum development across all five schools of the university.',
        ],
        [
            'slug' => 'mr-thomas-m-mwangi',
            'title' => 'Mr.',
            'first_name' => 'Thomas',
            'middle_name' => 'M.',
            'last_name' => 'Mwangi',
            'name' => 'Mr. Thomas M. Mwangi',
            'designation' => 'University Registrar',
            'school' => null,
            'department' => 'Registry',
            'unit' => 'University Administration',
            'email' => 'registrar@kafu.ac.ke',
            'specializations' => ['Academic Administration', 'Records Management', 'Student Affairs'],
            'photo' => null,
            'bio' => 'Mr. Mwangi serves as University Registrar, overseeing academic records, student admissions, and institutional governance documentation.',
        ],

        // SESS — School of Education and Social Sciences
        [
            'slug' => 'dr-nabeta-kn-sangili',
            'title' => 'Dr.',
            'first_name' => 'Nabeta',
            'middle_name' => 'K.N.',
            'last_name' => 'Sangili',
            'name' => 'Dr. Nabeta K.N. Sangili',
            'designation' => 'Dean, School of Education and Social Sciences',
            'school' => 'SESS',
            'department' => 'Education',
            'unit' => null,
            'email' => 'dean.sess@kafu.ac.ke',
            'specializations' => ['Teacher Education', 'Educational Psychology', 'Curriculum Studies'],
            'photo' => null,
            'bio' => 'Dr. Sangili is the Dean of the School of Education and Social Sciences. His research focuses on teacher professional development and inclusive education policy in sub-Saharan Africa.',
        ],
        [
            'slug' => 'dr-jane-wesonga',
            'title' => 'Dr.',
            'first_name' => 'Jane',
            'middle_name' => null,
            'last_name' => 'Wesonga',
            'name' => 'Dr. Jane Wesonga',
            'designation' => 'Senior Lecturer',
            'school' => 'SESS',
            'department' => 'Social Work',
            'unit' => null,
            'email' => 'j.wesonga@kafu.ac.ke',
            'specializations' => ['Community Development', 'Child Protection', 'Social Policy'],
            'photo' => null,
            'bio' => 'Dr. Wesonga is a Senior Lecturer in Social Work with extensive field experience in community development and child protection programming across Western Kenya.',
        ],
        [
            'slug' => 'mr-peter-mutuku',
            'title' => 'Mr.',
            'first_name' => 'Peter',
            'middle_name' => null,
            'last_name' => 'Mutuku',
            'name' => 'Mr. Peter Mutuku',
            'designation' => 'Lecturer',
            'school' => 'SESS',
            'department' => 'Criminology',
            'unit' => null,
            'email' => 'p.mutuku@kafu.ac.ke',
            'specializations' => ['Criminology', 'Criminal Justice', 'Restorative Justice'],
            'photo' => null,
            'bio' => 'Mr. Mutuku lectures in Criminology and Criminal Justice. His work explores restorative justice models and alternatives to incarceration in the Kenyan context.',
        ],
        [
            'slug' => 'dr-mary-auma-omondi',
            'title' => 'Dr.',
            'first_name' => 'Mary',
            'middle_name' => 'Auma',
            'last_name' => 'Omondi',
            'name' => 'Dr. Mary Auma Omondi',
            'designation' => 'Lecturer',
            'school' => 'SESS',
            'department' => 'Early Childhood Education',
            'unit' => null,
            'email' => 'm.auma@kafu.ac.ke',
            'specializations' => ['Early Childhood Development', 'Pedagogy', 'Child Psychology'],
            'photo' => null,
            'bio' => 'Dr. Omondi specialises in early childhood education and child development. She coordinates the BEd ECD programme and conducts research on learning outcomes in rural early childhood settings.',
        ],
        [
            'slug' => 'rev-prof-david-simiyu',
            'title' => 'Rev. Prof.',
            'first_name' => 'David',
            'middle_name' => null,
            'last_name' => 'Simiyu',
            'name' => 'Rev. Prof. David Simiyu',
            'designation' => 'Professor of Religious Studies',
            'school' => 'SESS',
            'department' => 'Religious Studies',
            'unit' => null,
            'email' => 'd.simiyu@kafu.ac.ke',
            'specializations' => ['African Traditional Religion', 'Quaker Theology', 'Ethics and Moral Philosophy'],
            'photo' => null,
            'bio' => 'Rev. Prof. Simiyu is a theologian and Quaker minister with over two decades of scholarship in African traditional religion and Quaker ethics. He has authored several books on religion and society in East Africa.',
        ],

        // SBE — School of Business and Economics
        [
            'slug' => 'dr-atieno-margaret-omondi',
            'title' => 'Dr.',
            'first_name' => 'Atieno',
            'middle_name' => 'Margaret',
            'last_name' => 'Omondi',
            'name' => 'Dr. Atieno Margaret Omondi',
            'designation' => 'Dean, School of Business and Economics',
            'school' => 'SBE',
            'department' => 'Business Administration',
            'unit' => null,
            'email' => 'dean.sbe@kafu.ac.ke',
            'specializations' => ['Strategic Management', 'Entrepreneurship', 'SME Development'],
            'photo' => null,
            'bio' => 'Dr. Omondi leads the School of Business and Economics with a focus on entrepreneurship education and SME capacity building. Her research examines the growth constraints of women-owned enterprises in Kenya.',
        ],
        [
            'slug' => 'dr-francis-ochieng',
            'title' => 'Dr.',
            'first_name' => 'Francis',
            'middle_name' => null,
            'last_name' => 'Ochieng',
            'name' => 'Dr. Francis Ochieng',
            'designation' => 'Senior Lecturer',
            'school' => 'SBE',
            'department' => 'Accounting and Finance',
            'unit' => null,
            'email' => 'f.ochieng@kafu.ac.ke',
            'specializations' => ['Financial Reporting', 'Auditing', 'Public Sector Accounting', 'IFRS'],
            'photo' => null,
            'bio' => 'Dr. Ochieng is a Senior Lecturer in Accounting with CPA(K) and CGMA designations. He focuses on financial reporting standards and public sector financial management reforms in Kenya.',
        ],
        [
            'slug' => 'ms-grace-akinyi',
            'title' => 'Ms.',
            'first_name' => 'Grace',
            'middle_name' => null,
            'last_name' => 'Akinyi',
            'name' => 'Ms. Grace Akinyi',
            'designation' => 'Lecturer',
            'school' => 'SBE',
            'department' => 'Marketing',
            'unit' => null,
            'email' => 'g.akinyi@kafu.ac.ke',
            'specializations' => ['Digital Marketing', 'Consumer Behaviour', 'Brand Strategy'],
            'photo' => null,
            'bio' => 'Ms. Akinyi lectures in Marketing and specialises in digital marketing strategy and consumer behaviour. She has consulted widely for SMEs and social enterprises in the Lake Victoria Basin region.',
        ],
        [
            'slug' => 'dr-james-wanjala',
            'title' => 'Dr.',
            'first_name' => 'James',
            'middle_name' => null,
            'last_name' => 'Wanjala',
            'name' => 'Dr. James Wanjala',
            'designation' => 'Lecturer',
            'school' => 'SBE',
            'department' => 'Economics',
            'unit' => null,
            'email' => 'j.wanjala@kafu.ac.ke',
            'specializations' => ['Development Economics', 'Agricultural Economics', 'Econometrics'],
            'photo' => null,
            'bio' => 'Dr. Wanjala is a development economist whose work focuses on food security, rural income diversification, and agricultural value chains in Western Kenya.',
        ],

        // SCIT — School of Computing and Information Technology
        [
            'slug' => 'prof-kelvin-k-omieno',
            'title' => 'Prof.',
            'first_name' => 'Kelvin',
            'middle_name' => 'K.',
            'last_name' => 'Omieno',
            'name' => 'Prof. Kelvin K. Omieno',
            'designation' => 'Dean, School of Computing and Information Technology',
            'school' => 'SCIT',
            'department' => 'Computer Science',
            'unit' => null,
            'email' => 'dean.scit@kafu.ac.ke',
            'specializations' => ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Software Engineering'],
            'photo' => null,
            'bio' => 'Prof. Omieno is a Professor of Computer Science and Dean of SCIT. His research spans artificial intelligence, machine learning, and intelligent systems applications in healthcare and agriculture.',
        ],
        [
            'slug' => 'dr-ruth-muthoni',
            'title' => 'Dr.',
            'first_name' => 'Ruth',
            'middle_name' => null,
            'last_name' => 'Muthoni',
            'name' => 'Dr. Ruth Muthoni',
            'designation' => 'Senior Lecturer',
            'school' => 'SCIT',
            'department' => 'Computer Science',
            'unit' => null,
            'email' => 'r.muthoni@kafu.ac.ke',
            'specializations' => ['Natural Language Processing', 'Text Mining', 'African Language Computing'],
            'photo' => null,
            'bio' => 'Dr. Muthoni is a Senior Lecturer in Computer Science with expertise in natural language processing and African language computing. Her research addresses NLP challenges for low-resource languages including Swahili and Luhya.',
        ],
        [
            'slug' => 'mr-brian-omondi',
            'title' => 'Mr.',
            'first_name' => 'Brian',
            'middle_name' => null,
            'last_name' => 'Omondi',
            'name' => 'Mr. Brian Omondi',
            'designation' => 'Lecturer',
            'school' => 'SCIT',
            'department' => 'Information Technology',
            'unit' => null,
            'email' => 'b.omondi@kafu.ac.ke',
            'specializations' => ['Network Administration', 'Cloud Computing', 'Systems Architecture'],
            'photo' => null,
            'bio' => 'Mr. Omondi lectures in Information Technology with a focus on cloud infrastructure, network design, and systems architecture. He holds CCNA and AWS certifications.',
        ],
        [
            'slug' => 'dr-lilian-kemunto',
            'title' => 'Dr.',
            'first_name' => 'Lilian',
            'middle_name' => null,
            'last_name' => 'Kemunto',
            'name' => 'Dr. Lilian Kemunto',
            'designation' => 'Lecturer',
            'school' => 'SCIT',
            'department' => 'Information Security',
            'unit' => null,
            'email' => 'l.kemunto@kafu.ac.ke',
            'specializations' => ['Cybersecurity', 'Digital Forensics', 'Information Assurance'],
            'photo' => null,
            'bio' => 'Dr. Kemunto specialises in cybersecurity and digital forensics. Her work addresses cyber threat intelligence, incident response, and digital safety frameworks for academic and public sector institutions.',
        ],

        // SOS — School of Science
        [
            'slug' => 'dr-annette-o-busula',
            'title' => 'Dr.',
            'first_name' => 'Annette',
            'middle_name' => 'O.',
            'last_name' => 'Busula',
            'name' => 'Dr. Annette O. Busula',
            'designation' => 'Dean, School of Science',
            'school' => 'SOS',
            'department' => 'Biological Sciences',
            'unit' => null,
            'email' => 'dean.sos@kafu.ac.ke',
            'specializations' => ['Molecular Biology', 'Parasitology', 'Infectious Disease Research'],
            'photo' => null,
            'bio' => 'Dr. Busula leads the School of Science with a research background in malaria parasitology and molecular diagnostics. Her work has appeared in leading peer-reviewed journals in infectious disease and public health.',
        ],
        [
            'slug' => 'dr-charles-simiyu',
            'title' => 'Dr.',
            'first_name' => 'Charles',
            'middle_name' => null,
            'last_name' => 'Simiyu',
            'name' => 'Dr. Charles Simiyu',
            'designation' => 'Senior Lecturer',
            'school' => 'SOS',
            'department' => 'Chemistry',
            'unit' => null,
            'email' => 'c.simiyu@kafu.ac.ke',
            'specializations' => ['Analytical Chemistry', 'Environmental Chemistry', 'Water Quality Analysis'],
            'photo' => null,
            'bio' => 'Dr. Simiyu is a Senior Lecturer in Chemistry with expertise in environmental and analytical chemistry. His research monitors water quality and pollutant levels in rivers and wetlands of the Lake Victoria Basin.',
        ],
        [
            'slug' => 'dr-sarah-chebet',
            'title' => 'Dr.',
            'first_name' => 'Sarah',
            'middle_name' => null,
            'last_name' => 'Chebet',
            'name' => 'Dr. Sarah Chebet',
            'designation' => 'Lecturer',
            'school' => 'SOS',
            'department' => 'Biological Sciences',
            'unit' => null,
            'email' => 's.chebet@kafu.ac.ke',
            'specializations' => ['Ecology', 'Botany', 'Biodiversity Conservation'],
            'photo' => null,
            'bio' => 'Dr. Chebet is a plant ecologist and botanist. Her fieldwork documents indigenous plant species in the Kakamega Forest Ecosystem and informs community-based conservation strategies.',
        ],
        [
            'slug' => 'mr-gilbert-otieno',
            'title' => 'Mr.',
            'first_name' => 'Gilbert',
            'middle_name' => null,
            'last_name' => 'Otieno',
            'name' => 'Mr. Gilbert Otieno',
            'designation' => 'Lecturer',
            'school' => 'SOS',
            'department' => 'Physics',
            'unit' => null,
            'email' => 'g.otieno@kafu.ac.ke',
            'specializations' => ['Applied Physics', 'Renewable Energy', 'Instrumentation'],
            'photo' => null,
            'bio' => 'Mr. Otieno lectures in Applied Physics and leads the university\'s Renewable Energy lab. His work explores solar photovoltaic systems and low-cost instrumentation for rural electrification.',
        ],

        // SHS — School of Health Sciences
        [
            'slug' => 'prof-winnie-awino',
            'title' => 'Prof.',
            'first_name' => 'Winnie',
            'middle_name' => null,
            'last_name' => 'Awino',
            'name' => 'Prof. Winnie Awino',
            'designation' => 'Dean, School of Health Sciences',
            'school' => 'SHS',
            'department' => 'Optometry',
            'unit' => null,
            'email' => 'dean.shs@kafu.ac.ke',
            'specializations' => ['Optometry', 'Low Vision Rehabilitation', 'Community Eye Health'],
            'photo' => null,
            'bio' => 'Prof. Awino is a Professor of Optometry and Dean of the School of Health Sciences. KAFU offers one of only two optometry programmes in Kenya at PhD level. Her work focuses on low vision rehabilitation and community eye health outreach.',
        ],
        [
            'slug' => 'dr-michael-otieno',
            'title' => 'Dr.',
            'first_name' => 'Michael',
            'middle_name' => null,
            'last_name' => 'Otieno',
            'name' => 'Dr. Michael Otieno',
            'designation' => 'Senior Lecturer',
            'school' => 'SHS',
            'department' => 'Optometry',
            'unit' => null,
            'email' => 'm.otieno@kafu.ac.ke',
            'specializations' => ['Ocular Pharmacology', 'Contact Lenses', 'Refractive Error Management'],
            'photo' => null,
            'bio' => 'Dr. Otieno is a Senior Lecturer in Optometry. His clinical research covers refractive error epidemiology in rural Western Kenya and the pharmacological management of anterior segment eye disease.',
        ],
        [
            'slug' => 'ms-agnes-kerubo',
            'title' => 'Ms.',
            'first_name' => 'Agnes',
            'middle_name' => null,
            'last_name' => 'Kerubo',
            'name' => 'Ms. Agnes Kerubo',
            'designation' => 'Lecturer',
            'school' => 'SHS',
            'department' => 'Nursing',
            'unit' => null,
            'email' => 'a.kerubo@kafu.ac.ke',
            'specializations' => ['Midwifery', 'Community Health Nursing', 'Maternal and Child Health'],
            'photo' => null,
            'bio' => 'Ms. Kerubo is a Registered Nurse and Midwife who coordinates the Bachelor of Science in Nursing programme. Her work focuses on maternal health outcomes and skilled birth attendance in rural health facilities.',
        ],
        [
            'slug' => 'dr-patrick-wabwire',
            'title' => 'Dr.',
            'first_name' => 'Patrick',
            'middle_name' => null,
            'last_name' => 'Wabwire',
            'name' => 'Dr. Patrick Wabwire',
            'designation' => 'Lecturer',
            'school' => 'SHS',
            'department' => 'Clinical Medicine',
            'unit' => null,
            'email' => 'p.wabwire@kafu.ac.ke',
            'specializations' => ['Internal Medicine', 'Tropical Diseases', 'Primary Health Care'],
            'photo' => null,
            'bio' => 'Dr. Wabwire is a Clinical Officer and academic lecturer in Clinical Medicine. He supervises student clinical rotations and conducts research on tropical disease burden and primary health care delivery in Western Kenya.',
        ],
    ];

    $school = $request->query('school');
    $designation = $request->query('designation');
    $search = $request->query('search');

    if ($school) {
        $staff = array_values(array_filter($staff, fn($s) => $s['school'] === strtoupper($school)));
    }
    if ($designation) {
        $staff = array_values(array_filter($staff, function($s) use ($designation) {
            return stripos($s['designation'], $designation) !== false;
        }));
    }
    if ($search) {
        $staff = array_values(array_filter($staff, function($s) use ($search) {
            $searchLower = strtolower($search);
            return stripos($s['name'], $searchLower) !== false
                || stripos($s['designation'], $searchLower) !== false
                || stripos($s['department'], $searchLower) !== false
                || !empty(array_filter($s['specializations'], fn($sp) => stripos($sp, $searchLower) !== false));
        }));
    }

    return response()->json(['data' => $staff]);
});

Route::get('/staff/{slug}', function (string $slug) {
    $profiles = [
        'prof-peter-n-mwita' => [
            'slug' => 'prof-peter-n-mwita',
            'title' => 'Prof.',
            'name' => 'Prof. Peter Nyamuhanga Mwita',
            'designation' => 'Vice-Chancellor',
            'school' => null,
            'department' => 'Office of the Vice-Chancellor',
            'unit' => 'University Leadership',
            'email' => 'vc@kafu.ac.ke',
            'phone_visible' => false,
            'specializations' => ['Higher Education Leadership', 'Institutional Governance', 'Innovation and Entrepreneurship', 'Strategic Planning'],
            'photo' => null,
            'biography' => 'Prof. Peter Nyamuhanga Mwita is the Vice-Chancellor of Kaimosi Friends University (KAFU), officially appointed on 14 May 2025 having served as Acting Vice-Chancellor since 19 February 2024. As the university\'s Chief Executive and Chief Academic Officer, he holds comprehensive responsibility for KAFU\'s administrative, academic, financial, and external relations. Prof. Mwita has anchored his tenure in a bold transformational agenda: he spearheaded the launch of KAFU\'s 2023–2027 Strategic Plan aimed at positioning the institution as a world-class university of excellence in teaching, research, and community engagement in alignment with Kenya\'s Vision 2030. He led the university\'s inaugural Innovation Week, bringing together researchers, innovators, and industry to solve real-world challenges. Under his leadership, KAFU became a key partner in a $95 million zero-emission biofuel project projected to create over 1,200 jobs and generate long-term income for the university. His philosophy is rooted in inclusive governance, innovation, and a commitment to producing job creators rather than job seekers.',
            'qualifications' => [
                ['year' => '2005', 'qualification' => 'Doctor of Philosophy (Statistics)', 'institution' => 'University of Nairobi'],
                ['year' => '1999', 'qualification' => 'Master of Science (Statistics)', 'institution' => 'University of Nairobi'],
                ['year' => '1996', 'qualification' => 'Bachelor of Science (Mathematics and Statistics)', 'institution' => 'University of Nairobi'],
            ],
            'research_interests' => ['Higher education governance and policy', 'Innovation ecosystems in African universities', 'Strategic planning in public universities', 'Sustainable development and university-industry partnerships'],
            'teaching_areas' => ['Statistical Methods', 'Research Design', 'Higher Education Leadership'],
            'experience' => [
                ['start' => '2025', 'end' => 'Present', 'position' => 'Vice-Chancellor', 'institution' => 'Kaimosi Friends University'],
                ['start' => '2024', 'end' => '2025', 'position' => 'Acting Vice-Chancellor', 'institution' => 'Kaimosi Friends University'],
            ],
            'publications' => [],
            'awards' => [],
            'memberships' => ['Inter-University Council for East Africa', 'Association of African Universities', 'Kenya Universities and Colleges Central Placement Service (KUCCPS) Board'],
        ],
        'dr-nabeta-kn-sangili' => [
            'slug' => 'dr-nabeta-kn-sangili',
            'title' => 'Dr.',
            'name' => 'Dr. Nabeta K.N. Sangili',
            'designation' => 'Dean, School of Education and Social Sciences',
            'school' => 'SESS',
            'department' => 'Education',
            'unit' => null,
            'email' => 'dean.sess@kafu.ac.ke',
            'phone_visible' => false,
            'specializations' => ['Teacher Education', 'Educational Psychology', 'Curriculum Studies'],
            'photo' => null,
            'biography' => 'Dr. Nabeta K.N. Sangili is the Dean of the School of Education and Social Sciences at Kaimosi Friends University. With over fifteen years of experience in teacher education and educational research, Dr. Sangili has led the school in expanding its programme offering and deepening its community engagement. His doctoral research examined the effectiveness of professional development models for secondary school teachers in Kenya\'s rural counties. He is a committed advocate for inclusive education and the integration of indigenous knowledge in teacher preparation curricula.',
            'qualifications' => [
                ['year' => '2013', 'qualification' => 'Doctor of Philosophy (Education)', 'institution' => 'Maseno University'],
                ['year' => '2006', 'qualification' => 'Master of Education (Educational Psychology)', 'institution' => 'Maseno University'],
                ['year' => '2002', 'qualification' => 'Bachelor of Education (Arts)', 'institution' => 'Kaimosi Friends University College'],
            ],
            'research_interests' => ['Teacher professional development', 'Inclusive education', 'Educational psychology', 'Indigenous knowledge in education'],
            'teaching_areas' => ['Educational Psychology', 'Curriculum Studies', 'Teaching Methods'],
            'experience' => [
                ['start' => '2018', 'end' => 'Present', 'position' => 'Dean', 'institution' => 'SESS, Kaimosi Friends University'],
                ['start' => '2013', 'end' => '2018', 'position' => 'Senior Lecturer', 'institution' => 'SESS, Kaimosi Friends University'],
                ['start' => '2007', 'end' => '2013', 'position' => 'Lecturer', 'institution' => 'SESS, Kaimosi Friends University'],
            ],
            'publications' => [
                ['citation' => 'Sangili, K.N. (2019). "Peer Mentoring and Teacher Effectiveness in Rural Kenya." African Journal of Teacher Education, 8(2), 44–61.', 'url' => null],
                ['citation' => 'Sangili, K.N. & Omondi, M.A. (2021). "Indigenous Knowledge Integration in Kenyan Teacher Education Programmes." Journal of Curriculum Studies in Africa, 3(1), 12–29.', 'url' => null],
            ],
            'awards' => ['Best Dean Award, KAFU Academic Staff Recognition 2022'],
            'memberships' => ['Kenya National Examinations Council', 'East Africa Educational Research Association'],
        ],
        'prof-kelvin-k-omieno' => [
            'slug' => 'prof-kelvin-k-omieno',
            'title' => 'Prof.',
            'name' => 'Prof. Kelvin K. Omieno',
            'designation' => 'Dean, School of Computing and Information Technology',
            'school' => 'SCIT',
            'department' => 'Computer Science',
            'unit' => null,
            'email' => 'dean.scit@kafu.ac.ke',
            'phone_visible' => false,
            'specializations' => ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Software Engineering'],
            'photo' => null,
            'biography' => 'Prof. Kelvin K. Omieno is a Professor of Computer Science and the Dean of the School of Computing and Information Technology. A recognised authority in artificial intelligence and machine learning, Prof. Omieno has published extensively in the application of intelligent systems to healthcare, agriculture, and education in Africa. He leads the KAFU AI and Data Science Research Group, which collaborates with regional universities and international institutions. His teaching and mentorship have inspired a generation of computer scientists and technology entrepreneurs across the Lake Victoria Basin.',
            'qualifications' => [
                ['year' => '2009', 'qualification' => 'Doctor of Philosophy (Computer Science)', 'institution' => 'University of Nairobi'],
                ['year' => '2004', 'qualification' => 'Master of Science (Computer Science)', 'institution' => 'University of Nairobi'],
                ['year' => '2000', 'qualification' => 'Bachelor of Science (Computer Science)', 'institution' => 'Maseno University'],
            ],
            'research_interests' => ['Artificial intelligence', 'Machine learning', 'Intelligent systems for healthcare', 'Data science in agriculture', 'Computer science education'],
            'teaching_areas' => ['Artificial Intelligence', 'Machine Learning', 'Algorithm Design', 'Software Engineering'],
            'experience' => [
                ['start' => '2019', 'end' => 'Present', 'position' => 'Dean and Professor of Computer Science', 'institution' => 'SCIT, Kaimosi Friends University'],
                ['start' => '2012', 'end' => '2019', 'position' => 'Associate Professor of Computer Science', 'institution' => 'SCIT, Kaimosi Friends University'],
                ['start' => '2009', 'end' => '2012', 'position' => 'Senior Lecturer', 'institution' => 'SCIT, Kaimosi Friends University'],
            ],
            'publications' => [
                ['citation' => 'Omieno, K.K. et al. (2022). "Machine Learning Models for Malaria Prediction Using Environmental Data from Western Kenya." Journal of Healthcare Informatics, 14(3), 201–218.', 'url' => null],
                ['citation' => 'Omieno, K.K. & Muthoni, R. (2020). "Intelligent Crop Disease Detection Using Convolutional Neural Networks." African Journal of Computing and ICT, 13(1), 77–95.', 'url' => null],
                ['citation' => 'Omieno, K.K. (2017). "Software Engineering Pedagogy in Resource-Constrained Universities." IEEE Transactions on Education, 60(4), 312–320.', 'url' => null],
            ],
            'awards' => ['Kenya ICT Authority Research Excellence Award 2021', 'KAFU Distinguished Researcher Award 2019'],
            'memberships' => ['Kenya ICT Board Technical Committee', 'IEEE Computer Society', 'Association for Computing Machinery (ACM)', 'African Advanced Institute for Science and Technology'],
        ],
        'dr-atieno-margaret-omondi' => [
            'slug' => 'dr-atieno-margaret-omondi',
            'title' => 'Dr.',
            'name' => 'Dr. Atieno Margaret Omondi',
            'designation' => 'Dean, School of Business and Economics',
            'school' => 'SBE',
            'department' => 'Business Administration',
            'unit' => null,
            'email' => 'dean.sbe@kafu.ac.ke',
            'phone_visible' => false,
            'specializations' => ['Strategic Management', 'Entrepreneurship', 'SME Development'],
            'photo' => null,
            'biography' => 'Dr. Atieno Margaret Omondi is the Dean of the School of Business and Economics. A strategic management scholar with a deep commitment to entrepreneurship education, Dr. Omondi has been instrumental in building SBE into one of the fastest-growing business schools in Western Kenya. Her research examines SME growth constraints, women\'s economic empowerment, and business incubation in emerging economies. She has consulted for government agencies, development organisations, and private sector bodies on entrepreneurship policy and MSME development strategy.',
            'qualifications' => [
                ['year' => '2015', 'qualification' => 'Doctor of Philosophy (Business Administration)', 'institution' => 'University of Nairobi'],
                ['year' => '2009', 'qualification' => 'Master of Business Administration', 'institution' => 'Strathmore University'],
                ['year' => '2004', 'qualification' => 'Bachelor of Commerce (Marketing)', 'institution' => 'Moi University'],
            ],
            'research_interests' => ['Entrepreneurship education', 'SME growth and financing', 'Women in business', 'Strategic leadership in Africa'],
            'teaching_areas' => ['Strategic Management', 'Entrepreneurship and Innovation', 'Business Research Methods'],
            'experience' => [
                ['start' => '2020', 'end' => 'Present', 'position' => 'Dean', 'institution' => 'SBE, Kaimosi Friends University'],
                ['start' => '2015', 'end' => '2020', 'position' => 'Senior Lecturer', 'institution' => 'SBE, Kaimosi Friends University'],
                ['start' => '2010', 'end' => '2015', 'position' => 'Lecturer', 'institution' => 'SBE, Kaimosi Friends University'],
            ],
            'publications' => [
                ['citation' => 'Omondi, A.M. (2022). "Gender and Growth Constraints in Kenyan SMEs: Evidence from Western Kenya." Journal of African Business, 23(1), 115–133.', 'url' => null],
                ['citation' => 'Omondi, A.M. & Wanjala, J. (2020). "University Business Incubators and Start-up Performance in Kenya." East African Journal of Business and Economics, 5(2), 45–62.', 'url' => null],
            ],
            'awards' => ['Business Education Leadership Award, Kenya Institute of Management 2021'],
            'memberships' => ['Kenya Institute of Management', 'African Academy of Business', 'Women in Business Kenya'],
        ],
        'dr-annette-o-busula' => [
            'slug' => 'dr-annette-o-busula',
            'title' => 'Dr.',
            'name' => 'Dr. Annette O. Busula',
            'designation' => 'Dean, School of Science',
            'school' => 'SOS',
            'department' => 'Biological Sciences',
            'unit' => null,
            'email' => 'dean.sos@kafu.ac.ke',
            'phone_visible' => false,
            'specializations' => ['Molecular Biology', 'Parasitology', 'Infectious Disease Research'],
            'photo' => null,
            'biography' => 'Dr. Annette O. Busula is the Dean of the School of Science and a leading researcher in malaria parasitology and molecular diagnostics. Her doctoral and postdoctoral work focused on the molecular epidemiology of Plasmodium falciparum drug resistance in Africa, and her publications appear in major peer-reviewed journals including Malaria Journal, PLOS ONE, and Antimicrobial Agents and Chemotherapy. Dr. Busula leads the KAFU Infectious Disease Research Unit and has collaborated with international partners including the Institute of Tropical Medicine Antwerp and the Kenya Medical Research Institute.',
            'qualifications' => [
                ['year' => '2016', 'qualification' => 'Doctor of Philosophy (Molecular Biology)', 'institution' => 'University of Antwerp / Institute of Tropical Medicine'],
                ['year' => '2010', 'qualification' => 'Master of Science (Biochemistry)', 'institution' => 'University of Nairobi'],
                ['year' => '2007', 'qualification' => 'Bachelor of Science (Biological Sciences)', 'institution' => 'Maseno University'],
            ],
            'research_interests' => ['Malaria parasitology', 'Drug resistance in P. falciparum', 'Molecular diagnostics', 'Tropical infectious diseases', 'One Health approaches'],
            'teaching_areas' => ['Molecular Biology', 'Parasitology', 'Biochemistry', 'Research Methods in Life Sciences'],
            'experience' => [
                ['start' => '2019', 'end' => 'Present', 'position' => 'Dean, School of Science', 'institution' => 'Kaimosi Friends University'],
                ['start' => '2016', 'end' => '2019', 'position' => 'Senior Lecturer, Molecular Biology', 'institution' => 'Kaimosi Friends University'],
                ['start' => '2016', 'end' => '2016', 'position' => 'Postdoctoral Research Fellow', 'institution' => 'Institute of Tropical Medicine, Antwerp'],
            ],
            'publications' => [
                ['citation' => 'Busula, A.O. et al. (2017). "Mechanisms of Plasmodium falciparum resistance to artemisinin-based combination therapies." Malaria Journal, 16, 215.', 'url' => 'https://doi.org/10.1186/s12936-017-1872-y'],
                ['citation' => 'Busula, A.O. et al. (2015). "Genetic diversity of Plasmodium falciparum isolates from Western Kenya." PLOS ONE, 10(11), e0141659.', 'url' => null],
            ],
            'awards' => ['KAFU Distinguished Research Award 2020', 'KEMRI Young Scientist Award 2018'],
            'memberships' => ['Kenya Medical Research Institute (Affiliate)', 'African Society for Laboratory Medicine', 'American Society of Tropical Medicine and Hygiene'],
        ],
        'prof-winnie-awino' => [
            'slug' => 'prof-winnie-awino',
            'title' => 'Prof.',
            'name' => 'Prof. Winnie Awino',
            'designation' => 'Dean, School of Health Sciences',
            'school' => 'SHS',
            'department' => 'Optometry',
            'unit' => null,
            'email' => 'dean.shs@kafu.ac.ke',
            'phone_visible' => false,
            'specializations' => ['Optometry', 'Low Vision Rehabilitation', 'Community Eye Health'],
            'photo' => null,
            'biography' => 'Prof. Winnie Awino is a Professor of Optometry and the founding Dean of the School of Health Sciences. She has been central to the development of the Bachelor of Optometry programme — one of only two such programmes available up to PhD level in Kenya. Her clinical and academic work spans low vision rehabilitation, community eye health outreach, and the epidemiology of visual impairment in Western Kenya. Prof. Awino has led eye health outreach camps across the region, partnering with county governments, NGOs, and international eye health organisations.',
            'qualifications' => [
                ['year' => '2011', 'qualification' => 'Doctor of Philosophy (Vision Science)', 'institution' => 'University of KwaZulu-Natal, South Africa'],
                ['year' => '2005', 'qualification' => 'Master of Science (Optometry)', 'institution' => 'University of Nairobi'],
                ['year' => '2001', 'qualification' => 'Bachelor of Science (Optometry)', 'institution' => 'University of Nairobi'],
            ],
            'research_interests' => ['Low vision rehabilitation', 'Visual impairment epidemiology', 'Community eye health', 'Paediatric optometry', 'Refractive error in East Africa'],
            'teaching_areas' => ['Clinical Optometry', 'Low Vision', 'Ocular Disease', 'Community Eye Health'],
            'experience' => [
                ['start' => '2017', 'end' => 'Present', 'position' => 'Dean and Professor of Optometry', 'institution' => 'SHS, Kaimosi Friends University'],
                ['start' => '2012', 'end' => '2017', 'position' => 'Senior Lecturer in Optometry', 'institution' => 'SHS, Kaimosi Friends University'],
                ['start' => '2011', 'end' => '2012', 'position' => 'Postdoctoral Research Associate', 'institution' => 'Brien Holden Vision Institute, Sydney'],
            ],
            'publications' => [
                ['citation' => 'Awino, W. & Otieno, M. (2023). "Prevalence of Refractive Error among School-Age Children in Western Kenya." Clinical and Experimental Optometry, 106(2), 198–207.', 'url' => null],
                ['citation' => 'Awino, W. (2019). "Low Vision Rehabilitation Services in Rural Kenya: Challenges and Opportunities." African Vision and Eye Health, 78(1), a459.', 'url' => null],
            ],
            'awards' => ['Vision 2020 East Africa Eye Health Champion Award 2022', 'KAFU Community Service Award 2020'],
            'memberships' => ['Optometrists Association Kenya (OAK)', 'African Vision Research Institute', 'International Society for Low Vision Research and Rehabilitation'],
        ],
    ];

    if (!isset($profiles[$slug])) {
        $allStaff = collect([
            ['slug' => 'dr-jane-wesonga', 'title' => 'Dr.', 'name' => 'Dr. Jane Wesonga', 'designation' => 'Senior Lecturer', 'school' => 'SESS', 'department' => 'Social Work', 'unit' => null, 'email' => 'j.wesonga@kafu.ac.ke', 'phone_visible' => false, 'specializations' => ['Community Development', 'Child Protection', 'Social Policy'], 'photo' => null, 'biography' => 'Dr. Jane Wesonga is a Senior Lecturer in Social Work at KAFU. She brings extensive field experience in community development, child protection programming, and social welfare policy across Western Kenya. Her research examines intersections between social inequality, child welfare, and rural livelihoods.', 'qualifications' => [['year' => '2018', 'qualification' => 'Doctor of Philosophy (Social Work)', 'institution' => 'Maseno University'], ['year' => '2012', 'qualification' => 'Master of Arts (Social Work)', 'institution' => 'Makerere University'], ['year' => '2007', 'qualification' => 'Bachelor of Social Work', 'institution' => 'Kaimosi Friends University College']], 'research_interests' => ['Child welfare', 'Community development', 'Social protection policy', 'Gender and social exclusion'], 'teaching_areas' => ['Social Work Theory and Practice', 'Community Development', 'Child Protection'], 'experience' => [['start' => '2018', 'end' => 'Present', 'position' => 'Senior Lecturer', 'institution' => 'SESS, KAFU'], ['start' => '2013', 'end' => '2018', 'position' => 'Lecturer', 'institution' => 'SESS, KAFU'], ['start' => '2008', 'end' => '2013', 'position' => 'Field Social Worker', 'institution' => 'World Vision Kenya']], 'publications' => [], 'awards' => [], 'memberships' => ['Kenya Association of Social Workers']],
            ['slug' => 'mr-peter-mutuku', 'title' => 'Mr.', 'name' => 'Mr. Peter Mutuku', 'designation' => 'Lecturer', 'school' => 'SESS', 'department' => 'Criminology', 'unit' => null, 'email' => 'p.mutuku@kafu.ac.ke', 'phone_visible' => false, 'specializations' => ['Criminology', 'Criminal Justice', 'Restorative Justice'], 'photo' => null, 'biography' => 'Mr. Peter Mutuku is a Lecturer in Criminology and Criminal Justice. His academic interest centres on restorative justice models, prison reform, and alternatives to incarceration in the Kenyan context. He has worked with the Kenya Prisons Service and non-governmental organisations on community-based rehabilitation programmes.', 'qualifications' => [['year' => '2017', 'qualification' => 'Master of Arts (Criminology)', 'institution' => 'University of Nairobi'], ['year' => '2013', 'qualification' => 'Bachelor of Arts (Criminology)', 'institution' => 'Moi University']], 'research_interests' => ['Restorative justice', 'Prison reform', 'Crime prevention', 'Juvenile justice'], 'teaching_areas' => ['Criminology', 'Criminal Justice Administration', 'Penology'], 'experience' => [['start' => '2018', 'end' => 'Present', 'position' => 'Lecturer', 'institution' => 'SESS, KAFU'], ['start' => '2015', 'end' => '2018', 'position' => 'Programme Officer', 'institution' => 'Prison Fellowship Kenya']], 'publications' => [], 'awards' => [], 'memberships' => ['Kenya Society of Criminology']],
            ['slug' => 'dr-francis-ochieng', 'title' => 'Dr.', 'name' => 'Dr. Francis Ochieng', 'designation' => 'Senior Lecturer', 'school' => 'SBE', 'department' => 'Accounting and Finance', 'unit' => null, 'email' => 'f.ochieng@kafu.ac.ke', 'phone_visible' => false, 'specializations' => ['Financial Reporting', 'Auditing', 'Public Sector Accounting', 'IFRS'], 'photo' => null, 'biography' => 'Dr. Francis Ochieng is a Senior Lecturer in Accounting and Finance at KAFU. A CPA(K) and CGMA holder, he specialises in IFRS adoption, public sector financial management, and audit quality. His research examines how accounting reforms impact accountability in Kenyan county governments.', 'qualifications' => [['year' => '2019', 'qualification' => 'Doctor of Philosophy (Accounting)', 'institution' => 'University of Nairobi'], ['year' => '2012', 'qualification' => 'Master of Commerce (Finance)', 'institution' => 'Strathmore University'], ['year' => '2007', 'qualification' => 'Bachelor of Commerce (Accounting)', 'institution' => 'Maseno University']], 'research_interests' => ['Public sector accounting', 'Audit quality', 'IFRS adoption in Africa', 'Financial governance'], 'teaching_areas' => ['Financial Accounting', 'Auditing', 'Public Finance Management'], 'experience' => [['start' => '2019', 'end' => 'Present', 'position' => 'Senior Lecturer', 'institution' => 'SBE, KAFU'], ['start' => '2012', 'end' => '2019', 'position' => 'Lecturer', 'institution' => 'SBE, KAFU'], ['start' => '2007', 'end' => '2012', 'position' => 'Auditor', 'institution' => 'Kenya National Audit Office']], 'publications' => [['citation' => 'Ochieng, F. (2021). "IFRS Adoption and Reporting Quality in Kenyan County Governments." International Journal of Accounting and Information Management, 29(4), 567–584.', 'url' => null]], 'awards' => [], 'memberships' => ['ICPAK', 'CGMA (Chartered Institute of Management Accountants)']],
            ['slug' => 'dr-ruth-muthoni', 'title' => 'Dr.', 'name' => 'Dr. Ruth Muthoni', 'designation' => 'Senior Lecturer', 'school' => 'SCIT', 'department' => 'Computer Science', 'unit' => null, 'email' => 'r.muthoni@kafu.ac.ke', 'phone_visible' => false, 'specializations' => ['Natural Language Processing', 'Text Mining', 'African Language Computing'], 'photo' => null, 'biography' => 'Dr. Ruth Muthoni is a Senior Lecturer in Computer Science whose research focuses on natural language processing (NLP) for low-resource African languages. Her work addresses the scarcity of computational resources and annotated corpora for Swahili, Luhya, and other Kenyan languages. She collaborates with global NLP research groups and has contributed to open-source African language datasets.', 'qualifications' => [['year' => '2020', 'qualification' => 'Doctor of Philosophy (Computer Science — NLP)', 'institution' => 'University of Groningen, Netherlands'], ['year' => '2013', 'qualification' => 'Master of Science (Computer Science)', 'institution' => 'University of Nairobi'], ['year' => '2010', 'qualification' => 'Bachelor of Science (Computer Science)', 'institution' => 'Maseno University']], 'research_interests' => ['NLP for African languages', 'Text mining', 'Machine translation', 'Computational linguistics'], 'teaching_areas' => ['Artificial Intelligence', 'Natural Language Processing', 'Data Structures'], 'experience' => [['start' => '2020', 'end' => 'Present', 'position' => 'Senior Lecturer', 'institution' => 'SCIT, KAFU'], ['start' => '2020', 'end' => '2020', 'position' => 'Postdoctoral Fellow', 'institution' => 'MasakhaNE Project, Leiden University']], 'publications' => [['citation' => 'Muthoni, R. et al. (2022). "Named Entity Recognition for Swahili Using Transformer Models." Proceedings of AfricaNLP Workshop, EMNLP 2022.', 'url' => null]], 'awards' => ['Google AI for Social Good Fellowship 2021'], 'memberships' => ['Association for Computational Linguistics (ACL)', 'ACM']],
            ['slug' => 'dr-charles-simiyu', 'title' => 'Dr.', 'name' => 'Dr. Charles Simiyu', 'designation' => 'Senior Lecturer', 'school' => 'SOS', 'department' => 'Chemistry', 'unit' => null, 'email' => 'c.simiyu@kafu.ac.ke', 'phone_visible' => false, 'specializations' => ['Analytical Chemistry', 'Environmental Chemistry', 'Water Quality Analysis'], 'photo' => null, 'biography' => 'Dr. Charles Simiyu is a Senior Lecturer in Chemistry whose research focuses on environmental and analytical chemistry, particularly water quality monitoring in the Lake Victoria Basin. He has led several community-funded studies on heavy metal contamination and agrochemical runoff into rivers and wetlands in the region.', 'qualifications' => [['year' => '2016', 'qualification' => 'Doctor of Philosophy (Chemistry)', 'institution' => 'University of Nairobi'], ['year' => '2010', 'qualification' => 'Master of Science (Analytical Chemistry)', 'institution' => 'Kenyatta University'], ['year' => '2007', 'qualification' => 'Bachelor of Science (Chemistry)', 'institution' => 'Maseno University']], 'research_interests' => ['Water quality monitoring', 'Heavy metal contamination', 'Environmental pollution', 'Analytical methods development'], 'teaching_areas' => ['Analytical Chemistry', 'Environmental Chemistry', 'Instrumental Analysis'], 'experience' => [['start' => '2016', 'end' => 'Present', 'position' => 'Senior Lecturer', 'institution' => 'SOS, KAFU'], ['start' => '2010', 'end' => '2016', 'position' => 'Lecturer', 'institution' => 'SOS, KAFU']], 'publications' => [['citation' => 'Simiyu, C. et al. (2020). "Heavy Metal Contamination of Wetlands in the Lake Victoria Basin." Environmental Monitoring and Assessment, 192(6), 384.', 'url' => null]], 'awards' => [], 'memberships' => ['Kenya Chemical Society', 'Royal Society of Chemistry (Associate)']],
            ['slug' => 'dr-michael-otieno', 'title' => 'Dr.', 'name' => 'Dr. Michael Otieno', 'designation' => 'Senior Lecturer', 'school' => 'SHS', 'department' => 'Optometry', 'unit' => null, 'email' => 'm.otieno@kafu.ac.ke', 'phone_visible' => false, 'specializations' => ['Ocular Pharmacology', 'Contact Lenses', 'Refractive Error Management'], 'photo' => null, 'biography' => 'Dr. Michael Otieno is a Senior Lecturer in Optometry at the School of Health Sciences. His clinical research focuses on refractive error epidemiology in rural Western Kenya, anterior segment eye disease, and the pharmacological management of glaucoma and uveitis. He supervises final-year clinical students and coordinates the university\'s outreach eye screening programme.', 'qualifications' => [['year' => '2018', 'qualification' => 'Doctor of Philosophy (Vision Science)', 'institution' => 'University of New South Wales, Australia'], ['year' => '2012', 'qualification' => 'Master of Optometry (Clinical)', 'institution' => 'University of Nairobi'], ['year' => '2008', 'qualification' => 'Bachelor of Science (Optometry)', 'institution' => 'University of Nairobi']], 'research_interests' => ['Refractive error epidemiology', 'Glaucoma pharmacotherapy', 'Anterior segment diseases', 'Contact lens applications'], 'teaching_areas' => ['Clinical Optometry', 'Ocular Pharmacology', 'Contact Lens Fitting', 'Binocular Vision'], 'experience' => [['start' => '2018', 'end' => 'Present', 'position' => 'Senior Lecturer', 'institution' => 'SHS, KAFU'], ['start' => '2018', 'end' => '2018', 'position' => 'Postdoctoral Clinical Fellow', 'institution' => 'Centre for Eye Health, Sydney'], ['start' => '2012', 'end' => '2015', 'position' => 'Lecturer', 'institution' => 'SHS, KAFU']], 'publications' => [['citation' => 'Otieno, M. & Awino, W. (2020). "Prevalence and Causes of Visual Impairment in School Children in Vihiga County." African Vision and Eye Health, 79(1), a555.', 'url' => null]], 'awards' => [], 'memberships' => ['Optometrists Association Kenya (OAK)', 'International Contact Lens Association']],
        ])->keyBy('slug')->all();

        if (isset($allStaff[$slug])) {
            return response()->json(['data' => $allStaff[$slug]]);
        }
        return response()->json(['error' => 'Staff profile not found'], 404);
    }

    return response()->json(['data' => $profiles[$slug]]);
});

Route::get('/programmes/{school}/{code}', function (string $school, string $code) {
    $school = strtoupper($school);
    $code = urldecode($code);

    $details = [
        'SESS' => [
            'BEd (Arts)' => ['overview' => 'A four-year programme training secondary school teachers in arts subjects including English, Kiswahili, History, Geography, and French.', 'mode' => 'Full-time', 'career' => ['Secondary School Teacher', 'Curriculum Developer', 'Education Officer', 'School Administrator'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in English or Kiswahili', 'Grade C in any two of: History, Geography, French, CRE, IRE', 'Two A-Level principal passes (for A-Level applicants)']],
            'BEd (French)' => ['overview' => 'Trains specialist French language teachers with proficiency in spoken and written French for secondary schools and language institutions.', 'mode' => 'Full-time', 'career' => ['French Language Teacher', 'Translator/Interpreter', 'Cultural Attaché', 'Language Consultant'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in French or English', 'Grade C in any other two subjects']],
            'BEd (Science)' => ['overview' => 'Trains secondary school science teachers with specializations in Biology, Chemistry, Physics, and Mathematics.', 'mode' => 'Full-time', 'career' => ['Secondary School Teacher', 'Science Education Specialist', 'Curriculum Designer', 'Lab Technician Supervisor'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in Mathematics', 'Grade C+ in any two sciences (Biology, Chemistry, Physics)']],
            'BSW' => ['overview' => 'Prepares students for professional social work practice in community development, child protection, counselling, and social policy.', 'mode' => 'Full-time', 'career' => ['Social Worker', 'Community Development Officer', 'Child Protection Officer', 'NGO Programme Coordinator', 'Probation Officer'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C in English or Kiswahili', 'Grade C in any three other subjects']],
            'BEd ECD' => ['overview' => 'Focuses on early childhood development, preparing graduates to work with children aged 0–8 in educational, health, and social care settings.', 'mode' => 'Full-time', 'career' => ['ECD Teacher', 'Pre-school Head Teacher', 'Child Development Specialist', 'NGO Programme Officer'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C in English or Kiswahili', 'Grade C in Biology or Home Science']],
            'BDMID' => ['overview' => 'An interdisciplinary programme covering disaster risk reduction, humanitarian response, international diplomacy, and peace-building.', 'mode' => 'Full-time', 'career' => ['Disaster Risk Manager', 'Humanitarian Aid Coordinator', 'Diplomat', 'Emergency Response Officer', 'Policy Analyst'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C in History, Geography, or Government', 'Grade C in English or Kiswahili']],
            'BA Criminology' => ['overview' => 'Studies crime, criminal behaviour, law enforcement, and the justice system, producing graduates equipped for careers in policing, corrections, and policy.', 'mode' => 'Full-time', 'career' => ['Police Officer (Graduate Entry)', 'Probation Officer', 'Criminal Investigator', 'Prison Warden (Graduate)', 'Policy Analyst'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C in History, Government, or Geography', 'Grade C in English or Kiswahili']],
            'MA Religion' => ['overview' => 'An advanced study of world religions, theology, and religious ethics, suitable for clergy, scholars, and development workers.', 'mode' => 'Full-time', 'career' => ['University Lecturer', 'Theologian', 'Chaplain', 'Religious Programme Coordinator', 'Researcher'], 'requirements' => ['Bachelor\'s degree in Religious Studies, Theology, or related field (Second Class Honours or above)', 'Two referees\' letters', 'Statement of intent']],
            'PhD Religion' => ['overview' => 'Doctoral research in religion, theology, ethics, and religious history. Candidates must submit and defend an original research dissertation.', 'mode' => 'Full-time/Part-time', 'career' => ['University Professor', 'Research Fellow', 'Theologian', 'Policy Advisor'], 'requirements' => ['Master\'s degree in Religion, Theology, or related field', 'Research proposal', 'Two academic referees']],
        ],
        'SBE' => [
            'BCom' => ['overview' => 'A comprehensive business degree covering accounting, finance, marketing, management, and entrepreneurship.', 'mode' => 'Full-time', 'career' => ['Accountant', 'Business Analyst', 'Marketing Manager', 'Entrepreneur', 'Bank Officer', 'Financial Analyst'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in Mathematics', 'Grade C in English or Kiswahili', 'Grade C in Business Studies or Economics (where applicable)']],
            'BSc Economics' => ['overview' => 'Rigorous training in economic theory, quantitative methods, policy analysis, and research methodology.', 'mode' => 'Full-time', 'career' => ['Economist', 'Policy Analyst', 'Financial Consultant', 'Research Officer', 'Development Planner'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in Mathematics', 'Grade C in English or Kiswahili']],
            'MBA' => ['overview' => 'An advanced management programme covering strategic leadership, finance, marketing, operations, and entrepreneurship, designed for working professionals.', 'mode' => 'Full-time/Part-time', 'career' => ['General Manager', 'CEO/Director', 'Strategy Consultant', 'Entrepreneur', 'Corporate Trainer'], 'requirements' => ['Bachelor\'s degree (any field, Second Class or above)', 'At least two years\' work experience (recommended)', 'Two referees\' letters', 'CV']],
            'PhD Bus. Admin.' => ['overview' => 'Doctoral research in business administration, management, entrepreneurship, or related fields. Requires an original research contribution.', 'mode' => 'Full-time/Part-time', 'career' => ['University Professor', 'Senior Researcher', 'Executive Consultant', 'Policy Maker'], 'requirements' => ['Master\'s degree in Business Administration or related field', 'Research proposal', 'Two academic referees']],
        ],
        'SCIT' => [
            'BSc CS' => ['overview' => 'Covers algorithms, data structures, software engineering, AI, databases, and networking. Graduates are equipped to build modern software solutions.', 'mode' => 'Full-time', 'career' => ['Software Developer', 'Systems Analyst', 'AI Engineer', 'Data Scientist', 'Database Administrator', 'IT Consultant'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in Mathematics', 'Grade C+ in Physics or Computer Studies', 'Grade C in English or Kiswahili']],
            'BSc IT' => ['overview' => 'Focuses on practical information technology — networking, systems administration, web development, cybersecurity, and enterprise systems.', 'mode' => 'Full-time', 'career' => ['Network Administrator', 'IT Support Specialist', 'Web Developer', 'Cybersecurity Analyst', 'System Administrator'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in Mathematics', 'Grade C in Physics or Computer Studies', 'Grade C in English or Kiswahili']],
            'MSc IT' => ['overview' => 'Advanced study in information technology research, cloud computing, cybersecurity, AI, and enterprise systems management.', 'mode' => 'Full-time/Part-time', 'career' => ['Senior IT Manager', 'Chief Technology Officer', 'IT Researcher', 'Cybersecurity Specialist'], 'requirements' => ['Bachelor\'s degree in Computer Science, IT, or related field (Second Class Honours or above)', 'Two referees\' letters', 'Research proposal or project proposal']],
        ],
        'SOS' => [
            'BSc Physics' => ['overview' => 'Covers classical and modern physics, appropriate technology, electronics, and materials science. Emphasises practical laboratory skills.', 'mode' => 'Full-time', 'career' => ['Physicist', 'Geophysicist', 'Lab Technician', 'Science Teacher', 'Research Scientist', 'Engineer (with postgrad)'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade B- in Physics', 'Grade C+ in Mathematics', 'Grade C in Chemistry']],
            'BSc Chemistry' => ['overview' => 'Comprehensive study of inorganic, organic, and physical chemistry with extensive laboratory work and research methods.', 'mode' => 'Full-time', 'career' => ['Chemist', 'Laboratory Analyst', 'Pharmaceutical Technologist', 'Quality Assurance Officer', 'Science Teacher'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade B- in Chemistry', 'Grade C+ in Mathematics', 'Grade C in Physics or Biology']],
            'BSc Biology' => ['overview' => 'Covers cell biology, genetics, ecology, microbiology, physiology, and environmental science, with field and laboratory practicals.', 'mode' => 'Full-time', 'career' => ['Biologist', 'Ecologist', 'Lab Scientist', 'Science Teacher', 'Public Health Officer', 'Environmental Consultant'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade B- in Biology', 'Grade C+ in Chemistry', 'Grade C in Mathematics']],
            'BSc Agric. Econ.' => ['overview' => 'Integrates agricultural science with economics to train graduates for roles in agribusiness, food policy, rural development, and resource management.', 'mode' => 'Full-time', 'career' => ['Agricultural Economist', 'Agribusiness Manager', 'Food Security Analyst', 'Rural Development Officer', 'Policy Advisor'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in Mathematics', 'Grade C in any two of: Biology, Chemistry, Agriculture, Economics']],
        ],
        'SHS' => [
            'BOptom' => ['overview' => 'A five-year programme in optometry and vision sciences — one of only two in Kenya offering this up to PhD level. Covers eye disease, refractive error, contact lenses, and low vision.', 'mode' => 'Full-time', 'career' => ['Optometrist', 'Vision Scientist', 'Eye Clinic Director', 'Public Health Optometrist', 'Researcher'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in Biology and Chemistry', 'Grade C+ in Mathematics or Physics', 'Grade C in English']],
            'BSN' => ['overview' => 'A four-year nursing programme producing competent, compassionate nurses trained in clinical practice, community health, midwifery, and critical care.', 'mode' => 'Full-time', 'career' => ['Registered Nurse', 'Midwife', 'ICU/Critical Care Nurse', 'Community Health Nurse', 'Nurse Manager'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in Biology and Chemistry', 'Grade C in Mathematics or Physics', 'Grade C in English or Kiswahili']],
            'BSc Clinical Med.' => ['overview' => 'Trains Clinical Officers in diagnosis, treatment, and management of common diseases, with rotations in medicine, surgery, pediatrics, and community health.', 'mode' => 'Full-time', 'career' => ['Clinical Officer', 'Community Health Specialist', 'Medical Researcher', 'Public Health Officer', 'Lecturer (with postgrad)'], 'requirements' => ['Minimum KCSE mean grade of C+', 'Grade C+ in Biology and Chemistry', 'Grade C in Mathematics or Physics', 'Grade C in English']],
        ],
    ];

    if (!isset($details[$school])) {
        return response()->json(['error' => 'School not found'], 404);
    }

    if (!isset($details[$school][$code])) {
        return response()->json([
            'data' => [
                'school' => $school,
                'code' => $code,
                'overview' => 'Detailed information for this programme is being updated. Please contact the Admissions Office for full details.',
                'mode' => 'Full-time',
                'career' => ['Career information coming soon'],
                'requirements' => ['Please contact the Admissions Office for entry requirements'],
            ]
        ]);
    }

    $d = $details[$school][$code];
    return response()->json([
        'data' => [
            'school' => $school,
            'code' => $code,
            'overview' => $d['overview'],
            'mode' => $d['mode'],
            'career_opportunities' => $d['career'],
            'entry_requirements' => $d['requirements'],
        ]
    ]);
});

Route::get('/admissions', function () {
    return response()->json([
        'data' => [
            'pathways' => [
                [
                    'id' => 'undergraduate',
                    'title' => 'Undergraduate',
                    'subtitle' => 'Government Sponsored (KUCCPS) & Direct Entry',
                    'description' => 'Join one of KAFU\'s 22 undergraduate degree programmes via KUCCPS government placement or direct entry. Applications open each academic year.',
                    'requirements' => [
                        'Minimum KCSE mean grade of C+ (Plus) or its equivalent',
                        'Specific subject cluster requirements depending on the programme',
                        'Valid Kenya National Examinations Council (KNEC) certificate',
                        'National Identity Card or Birth Certificate',
                        'Two passport-size photographs',
                    ],
                    'steps' => [
                        ['step' => 1, 'title' => 'Check Requirements', 'description' => 'Review the minimum entry requirements for your chosen programme.'],
                        ['step' => 2, 'title' => 'Apply via KUCCPS', 'description' => 'Select Kaimosi Friends University on the KUCCPS portal during the application window.'],
                        ['step' => 3, 'title' => 'Await Placement', 'description' => 'KUCCPS will notify you of your placement via SMS and the KUCCPS portal.'],
                        ['step' => 4, 'title' => 'Accept Placement', 'description' => 'Log in to the KUCCPS portal and accept your placement to KAFU.'],
                        ['step' => 5, 'title' => 'Report to KAFU', 'description' => 'Bring original documents, pay fees, and report on the stipulated joining date.'],
                    ],
                    'cta_label' => 'Apply via KUCCPS',
                    'cta_url' => 'https://students.kuccps.net/',
                    'cta_external' => true,
                ],
                [
                    'id' => 'postgraduate',
                    'title' => 'Postgraduate',
                    'subtitle' => 'Masters & Doctoral Programmes',
                    'description' => 'Advance your professional or academic career through KAFU\'s research-based and coursework Masters and PhD programmes across all five schools.',
                    'requirements' => [
                        'For Masters: A relevant Bachelor\'s degree (Second Class Honours or above) from a recognized university',
                        'For PhD: A relevant Master\'s degree from a recognized university',
                        'Official transcripts and certificates from all previous institutions',
                        'Two academic referees\' letters of recommendation',
                        'A research proposal (for research-based programmes)',
                        'Curriculum Vitae (CV)',
                    ],
                    'steps' => [
                        ['step' => 1, 'title' => 'Choose Your Programme', 'description' => 'Browse the postgraduate catalogue and identify a programme aligned to your goals.'],
                        ['step' => 2, 'title' => 'Prepare Documents', 'description' => 'Gather official transcripts, certificates, CV, and reference letters.'],
                        ['step' => 3, 'title' => 'Submit Application', 'description' => 'Apply directly through the KAFU Student Portal with all required documents.'],
                        ['step' => 4, 'title' => 'Shortlisting & Interview', 'description' => 'Shortlisted candidates may be called for an interview or additional review.'],
                        ['step' => 5, 'title' => 'Offer & Enrolment', 'description' => 'Upon acceptance, receive your admission letter and complete registration.'],
                    ],
                    'cta_label' => 'Apply via Student Portal',
                    'cta_url' => 'https://portal.kafu.ac.ke',
                    'cta_external' => true,
                ],
                [
                    'id' => 'international',
                    'title' => 'International Students',
                    'subtitle' => 'Open to Students from All Nations',
                    'description' => 'KAFU warmly welcomes students from across Africa and the world. We provide guidance on recognition of foreign qualifications, student visas, and accommodation.',
                    'requirements' => [
                        'Recognized secondary school leaving certificate equivalent to KCSE C+',
                        'Certified copies of all academic certificates and transcripts',
                        'Valid passport (copy of bio-data page)',
                        'Student visa / study permit (upon admission)',
                        'Evidence of English language proficiency (where applicable)',
                        'Recognition of foreign qualifications from the Kenya National Qualifications Authority (KNQA)',
                    ],
                    'steps' => [
                        ['step' => 1, 'title' => 'Equivalency Assessment', 'description' => 'Have your foreign qualifications recognized by KNQA or a recognized authority.'],
                        ['step' => 2, 'title' => 'Submit Application', 'description' => 'Apply via the KAFU Student Portal with all certified documents.'],
                        ['step' => 3, 'title' => 'Receive Offer Letter', 'description' => 'KAFU will issue a conditional or unconditional offer letter.'],
                        ['step' => 4, 'title' => 'Apply for Student Visa', 'description' => 'Use your offer letter to apply for a Kenya student visa / study permit.'],
                        ['step' => 5, 'title' => 'Arrive & Register', 'description' => 'Report to KAFU, present original documents, pay fees, and complete registration.'],
                    ],
                    'cta_label' => 'Apply via Student Portal',
                    'cta_url' => 'https://portal.kafu.ac.ke',
                    'cta_external' => true,
                ],
                [
                    'id' => 'self-sponsored',
                    'title' => 'Self-Sponsored',
                    'subtitle' => 'Module II Programmes',
                    'description' => 'KAFU\'s Module II (self-sponsored) pathway is designed for working professionals, school leavers who missed government placement, and those seeking flexible learning arrangements.',
                    'requirements' => [
                        'Minimum KCSE mean grade of C+ for degree programmes',
                        'Minimum KCSE mean grade of C- for diploma programmes',
                        'KAFU application form (available on the portal)',
                        'Certified copies of academic certificates',
                        'National ID or passport copy',
                        'Two passport-size photos',
                    ],
                    'steps' => [
                        ['step' => 1, 'title' => 'Download Application Form', 'description' => 'Download the Module II application form from the KAFU portal or admissions office.'],
                        ['step' => 2, 'title' => 'Complete the Form', 'description' => 'Fill in all sections and attach certified copies of required documents.'],
                        ['step' => 3, 'title' => 'Submit & Pay Application Fee', 'description' => 'Submit your form and pay the non-refundable application fee at the Finance Office or via M-Pesa.'],
                        ['step' => 4, 'title' => 'Interview / Review', 'description' => 'Some programmes require a review panel or interview before admission.'],
                        ['step' => 5, 'title' => 'Receive Admission Letter', 'description' => 'Collect or download your admission letter and report on the joining date.'],
                    ],
                    'cta_label' => 'Apply via Student Portal',
                    'cta_url' => 'https://portal.kafu.ac.ke',
                    'cta_external' => true,
                ],
            ],
            'deadlines' => [
                ['event' => 'KUCCPS Application Window', 'date' => '2026-05-30', 'description' => 'Deadline for selecting KAFU on the KUCCPS portal'],
                ['event' => 'Module II Applications Close', 'date' => '2026-06-15', 'description' => 'Self-sponsored undergraduate and diploma applications'],
                ['event' => 'Postgraduate Intake', 'date' => '2026-06-30', 'description' => 'Masters and PhD applications for September 2026 intake'],
                ['event' => 'International Applications Close', 'date' => '2026-07-31', 'description' => 'All international student applications for September intake'],
                ['event' => 'Reporting / Orientation', 'date' => '2026-09-08', 'description' => 'First-year student reporting and orientation week begins'],
            ],
            'documents' => [
                ['id' => 1, 'title' => 'Undergraduate Application Form', 'category' => 'Application Forms', 'description' => 'Official direct-entry undergraduate application form', 'file_url' => '#', 'version' => '2026'],
                ['id' => 2, 'title' => 'Postgraduate Application Form', 'category' => 'Application Forms', 'description' => 'Application form for Masters and PhD programmes', 'file_url' => '#', 'version' => '2026'],
                ['id' => 3, 'title' => 'Module II Application Form', 'category' => 'Application Forms', 'description' => 'Self-sponsored programme application form', 'file_url' => '#', 'version' => '2026'],
                ['id' => 4, 'title' => 'Government-Sponsored Fee Structure 2025/2026', 'category' => 'Fee Structures', 'description' => 'Fee schedules for KUCCPS-placed students per school', 'file_url' => '#', 'version' => '2025/2026'],
                ['id' => 5, 'title' => 'Self-Sponsored Fee Structure 2025/2026', 'category' => 'Fee Structures', 'description' => 'Fee schedules for Module II and private students', 'file_url' => '#', 'version' => '2025/2026'],
                ['id' => 6, 'title' => 'Postgraduate Fee Structure 2025/2026', 'category' => 'Fee Structures', 'description' => 'Fee schedules for all Masters and PhD programmes', 'file_url' => '#', 'version' => '2025/2026'],
                ['id' => 7, 'title' => 'Joining Instructions 2025/2026', 'category' => 'Joining Instructions', 'description' => 'Official joining instructions and what to bring on reporting day', 'file_url' => '#', 'version' => '2025/2026'],
                ['id' => 8, 'title' => 'KAFU Prospectus 2025/2026', 'category' => 'Brochures', 'description' => 'Full university prospectus including all programmes and fees', 'file_url' => '#', 'version' => '2025/2026'],
            ],
            'contact' => [
                'office' => 'Admissions & Student Recruitment Office',
                'email' => 'admissions@kafu.ac.ke',
                'phone' => '+254 777 373 633',
                'location' => 'Administration Block, Ground Floor, Main Campus, Kaimosi',
                'hours' => 'Monday – Friday, 8:00 AM – 5:00 PM',
            ],
        ],
    ]);
});

Route::get('/stats', function () {
    return response()->json([
        'data' => [
            ['label' => 'Schools', 'value' => 5],
            ['label' => 'Academic Programmes', 'value' => 38],
            ['label' => 'Years of Excellence', 'value' => 11],
            ['label' => 'Counties Reached', 'value' => 47],
        ],
    ]);
});
