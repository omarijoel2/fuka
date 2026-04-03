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
