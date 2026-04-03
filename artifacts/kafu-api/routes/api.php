<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\CmsContent;

function mapCmsNews(CmsContent $item): array {
    return [
        'id'       => $item->id,
        'slug'     => $item->slug,
        'title'    => $item->title,
        'excerpt'  => $item->summary,
        'summary'  => $item->summary,
        'category' => $item->category ?? 'General',
        'author'   => $item->author?->name ?? 'KAFU Communications Office',
        'date'     => $item->published_at?->format('Y-m-d') ?? $item->created_at->format('Y-m-d'),
        'imageUrl' => $item->featured_image ?: null,
        'tags'     => $item->tags ?? [],
        'featured' => (bool)$item->featured,
    ];
}

function mapCmsNewsDetail(CmsContent $item): array {
    $base = mapCmsNews($item);
    $base['content'] = $item->body ?? '<p>Content is being prepared. Please check back shortly.</p>';
    $base['related'] = $item->related_ids ?? [];
    return $base;
}

function mapCmsEvent(CmsContent $item): array {
    $sd = $item->structured_data ?? [];
    $status = $sd['event_status'] ?? 'upcoming';
    $date   = $sd['date'] ?? $item->published_at?->format('Y-m-d') ?? $item->created_at->format('Y-m-d');
    if (isset($sd['date']) && $sd['date'] < date('Y-m-d') && $status === 'upcoming') {
        $status = 'past';
    }
    return [
        'id'                => $item->id,
        'slug'              => $item->slug,
        'title'             => $item->title,
        'date'              => $date,
        'end_date'          => $sd['end_date'] ?? null,
        'time'              => $sd['time'] ?? '',
        'location'          => $sd['location'] ?? 'Kaimosi Campus',
        'category'          => $item->category ?? 'General',
        'description'       => $item->summary ?? $item->body ?? '',
        'registration_link' => $sd['registration_link'] ?? null,
        'tags'              => $item->tags ?? [],
        'status'            => $status,
    ];
}

function mapCmsEventDetail(CmsContent $item): array {
    $base = mapCmsEvent($item);
    $base['full_description'] = $item->body ?? $item->summary ?? '';
    return $base;
}

function mapCmsAnnouncement(CmsContent $item): array {
    $sd = $item->structured_data ?? [];
    return [
        'id'           => $item->id,
        'slug'         => $item->slug,
        'title'        => $item->title,
        'department'   => $item->department ?? 'University Administration',
        'priority'     => $sd['priority'] ?? 'normal',
        'publish_date' => $item->published_at?->format('Y-m-d') ?? $item->created_at->format('Y-m-d'),
        'summary'      => $item->summary ?? '',
        'tags'         => $item->tags ?? [],
        'status'       => 'active',
    ];
}

function mapCmsAnnouncementDetail(CmsContent $item): array {
    $base = mapCmsAnnouncement($item);
    $sd = $item->structured_data ?? [];
    $base['content']     = $item->body ?? '<p>Full content is being prepared.</p>';
    $base['attachments'] = $sd['attachments'] ?? [];
    return $base;
}

function mapCmsOpportunity(CmsContent $item): array {
    $sd = $item->structured_data ?? [];
    return [
        'id'             => $item->id,
        'slug'           => $item->slug,
        'category'       => $sd['opportunity_category'] ?? $item->category ?? 'notice',
        'type'           => $sd['opportunity_type'] ?? ucfirst($item->category ?? 'Notice'),
        'title'          => $item->title,
        'reference'      => $sd['reference'] ?? '',
        'department'     => $item->department ?? '',
        'summary'        => $item->summary ?? '',
        'publish_date'   => $item->published_at?->format('Y-m-d') ?? $item->created_at->format('Y-m-d'),
        'deadline'       => $sd['deadline'] ?? null,
        'deadline_time'  => $sd['deadline_time'] ?? null,
        'status'         => $sd['opportunity_status'] ?? 'open',
        'featured'       => (bool)$item->featured,
        'documents_count'=> count($sd['documents'] ?? []),
    ];
}

function mapCmsStaff(CmsContent $item): array {
    $sd = $item->structured_data ?? [];
    return [
        'slug'            => $item->slug,
        'title'           => $sd['title_prefix'] ?? 'Dr.',
        'name'            => $item->title,
        'first_name'      => $sd['first_name'] ?? '',
        'middle_name'     => $sd['middle_name'] ?? '',
        'last_name'       => $sd['last_name'] ?? '',
        'designation'     => $sd['designation'] ?? ($item->category ?? ''),
        'school'          => $item->school_code ?: null,
        'department'      => $item->department ?? '',
        'unit'            => $sd['unit'] ?? null,
        'email'           => $sd['email'] ?? '',
        'specializations' => $sd['specializations'] ?? [],
        'photo'           => $item->featured_image ?: ($sd['photo'] ?? null),
        'bio'             => $item->summary ?? '',
    ];
}

function mapCmsStaffDetail(CmsContent $item): array {
    $base = mapCmsStaff($item);
    $sd = $item->structured_data ?? [];
    $base['biography']         = $item->body ?? $item->summary ?? '';
    $base['phone_visible']     = (bool)($sd['phone_visible'] ?? false);
    $base['qualifications']    = $sd['qualifications'] ?? [];
    $base['research_interests']= $sd['research_interests'] ?? [];
    $base['teaching_areas']    = $sd['teaching_areas'] ?? [];
    $base['experience']        = $sd['experience'] ?? [];
    $base['publications']      = $sd['publications'] ?? [];
    $base['awards']            = $sd['awards'] ?? [];
    $base['memberships']       = $sd['memberships'] ?? [];
    return $base;
}

function mapCmsSchool(CmsContent $item): array {
    $sd = $item->structured_data ?? [];
    return [
        'code'             => strtoupper($item->slug),
        'name'             => $item->title,
        'dean'             => $sd['dean'] ?? null,
        'description'      => $item->summary ?? '',
        'vision'           => $sd['vision'] ?? '',
        'mission'          => $sd['mission'] ?? '',
        'programmes_count' => $sd['programmes_count'] ?? ['undergraduate' => 0, 'postgraduate' => 0, 'doctoral' => 0],
        'colour'           => $sd['colour'] ?? '#1B3A6B',
        'programmes'       => $sd['programmes'] ?? [],
    ];
}

function mapCmsProgramme(CmsContent $item): array {
    $sd = $item->structured_data ?? [];
    return [
        'school'   => $item->school_code ?? ($sd['school_code'] ?? ''),
        'level'    => $sd['level'] ?? 'undergraduate',
        'name'     => $item->title,
        'code'     => $sd['programme_code'] ?? $item->category ?? $item->slug,
        'duration' => $sd['duration'] ?? '4 years',
    ];
}

function mapCmsOpportunityDetail(CmsContent $item): array {
    $base = mapCmsOpportunity($item);
    $sd = $item->structured_data ?? [];
    $base['description']      = $item->body ?? $item->summary ?? '';
    $base['requirements']     = $sd['requirements'] ?? [];
    $base['submission_info']  = $sd['submission_info'] ?? '';
    $base['contact']          = $sd['contact'] ?? ['office'=>'Registry','email'=>'info@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'Main Campus, Kaimosi'];
    $base['documents']        = $sd['documents'] ?? [];
    return $base;
}

Route::get('/healthz', function () {
    return response()->json(['status' => 'ok', 'service' => 'KAFU API']);
});

Route::get('/news', function (Request $request) {
    $cmsItems = CmsContent::where('type', 'news')
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->with('author:id,name')
        ->orderByDesc('published_at')
        ->get()
        ->map(fn($item) => mapCmsNews($item))
        ->toArray();
    $cmsSlugSet = array_flip(array_column($cmsItems, 'slug'));

    $articles = [
        [
            'id' => 1,
            'slug' => 'innovators-develop-smart-digital-systems',
            'title' => 'KAFU Innovators Develop Smart Digital Systems for Better Service Delivery',
            'excerpt' => 'KAFU students and faculty develop cutting-edge digital solutions aimed at transforming service delivery across Western Kenya.',
            'summary' => 'A team of students and faculty from the School of Computing and Information Technology has developed a suite of smart digital tools designed to streamline service delivery in public institutions. The innovations, showcased at the annual KAFU Innovation Expo, include a citizen-facing complaints management portal and a smart queue management system tailored for county government offices.',
            'category' => 'Research & Innovation',
            'author' => 'KAFU Communications Office',
            'date' => '2026-03-20',
            'imageUrl' => 'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg',
            'tags' => ['Innovation', 'Technology', 'SCIT', 'Community'],
            'featured' => true,
        ],
        [
            'id' => 2,
            'slug' => 'community-backs-college-of-health-sciences-vokoli',
            'title' => 'Community Backs Proposal to Establish College of Health Sciences in Vokoli',
            'excerpt' => 'Local community leaders and stakeholders rally behind the proposed expansion of KAFU health sciences programmes to Vokoli.',
            'summary' => 'Community leaders, county government officials, and local residents in Vokoli have expressed overwhelming support for a proposal by Kaimosi Friends University to establish a constituent college of health sciences in the area. A public consultative forum held last week drew hundreds of attendees who highlighted the need for expanded healthcare education in the region.',
            'category' => 'Outreach',
            'author' => 'Dr. Annette O. Busula',
            'date' => '2026-03-15',
            'imageUrl' => null,
            'tags' => ['Health Sciences', 'Community', 'Expansion', 'SHS'],
            'featured' => false,
        ],
        [
            'id' => 3,
            'slug' => 'kafu-hosts-ministry-of-health-officials',
            'title' => 'KAFU Hosts Officials from the Ministry of Health for Strategic Partnership Talks',
            'excerpt' => 'Senior Ministry of Health officials visited KAFU to explore partnerships in healthcare education and training.',
            'summary' => 'Kaimosi Friends University hosted a high-level delegation from the Ministry of Health led by the Director of Medical Services. The visit focused on identifying partnership opportunities between KAFU\'s School of Health Sciences and the Ministry, particularly in healthcare workforce development, clinical placements, and collaborative research in community health.',
            'category' => 'Partnerships',
            'author' => 'KAFU Communications Office',
            'date' => '2026-03-10',
            'imageUrl' => null,
            'tags' => ['Ministry of Health', 'Partnerships', 'SHS', 'Healthcare'],
            'featured' => false,
        ],
        [
            'id' => 4,
            'slug' => 'kafu-to-host-africa-public-service-day-2026',
            'title' => 'Historic Moment as KAFU is Earmarked to Host Africa Public Service Day 2026',
            'excerpt' => 'Kaimosi Friends University has been selected as the host institution for the continental Africa Public Service Day 2026 celebrations.',
            'summary' => 'In a landmark recognition of its growing academic and institutional stature, Kaimosi Friends University has been designated to host the Africa Public Service Day 2026 celebrations. The announcement was made by the Cabinet Secretary for Public Service during a function in Nairobi. APSD 2026, themed "Digital Transformation for Inclusive and Sustainable Public Services," will bring together public servants, policymakers, and development partners from across the continent to Kaimosi.',
            'category' => 'Institutional',
            'author' => 'Office of the Vice-Chancellor',
            'date' => '2026-03-05',
            'imageUrl' => 'https://kafu.ac.ke/wp-content/uploads/IMG_8696.jpg',
            'tags' => ['Africa Public Service Day', 'Institutional', 'Recognition', 'Continental'],
            'featured' => true,
        ],
        [
            'id' => 5,
            'slug' => 'mumias-east-candidates-career-mentorship',
            'title' => 'Mumias East Candidates Benefit from Career Mentorship and Academic Guidance Through KAFU',
            'excerpt' => 'KAFU extends its community outreach by offering career mentorship and academic guidance to students in Mumias East.',
            'summary' => 'Over 500 Form Four candidates from Mumias East Sub-County have benefitted from a career mentorship programme organised in collaboration with Kaimosi Friends University. The programme, run over three days at Mumias East Girls\' High School, involved KAFU faculty offering subject-specific guidance, career talks, and information on higher education pathways available at KAFU and other universities.',
            'category' => 'Outreach',
            'author' => 'Office of Student Affairs',
            'date' => '2026-02-28',
            'imageUrl' => null,
            'tags' => ['Mentorship', 'Outreach', 'Community', 'Students'],
            'featured' => false,
        ],
        [
            'id' => 6,
            'slug' => 'kafu-vc-represents-education-cs-migori',
            'title' => 'KAFU VC Represents Education CS at Women Empowerment Initiative in Migori County',
            'excerpt' => 'The Vice Chancellor represented the Cabinet Secretary for Education at a women empowerment event in Migori County.',
            'summary' => 'Vice-Chancellor Prof. Peter Nyamuhanga Mwita represented Cabinet Secretary for Education at the Women in Leadership Empowerment Symposium held in Migori County. Addressing hundreds of women professionals and students, Prof. Mwita highlighted KAFU\'s commitment to gender equity in higher education and the university\'s growing scholarship programmes for female students from marginalised communities.',
            'category' => 'Leadership',
            'author' => 'Office of the Vice-Chancellor',
            'date' => '2026-02-20',
            'imageUrl' => null,
            'tags' => ['VC', 'Gender', 'Leadership', 'Outreach'],
            'featured' => false,
        ],
        [
            'id' => 7,
            'slug' => 'teacher-trainees-competency-based-education',
            'title' => 'Teacher Trainees Receive Competency-Based Education Training at KAFU',
            'excerpt' => 'KAFU School of Education hosts a training workshop on Competency-Based Education for teacher trainees.',
            'summary' => 'The School of Education and Social Sciences (SESS) hosted a five-day workshop on Competency-Based Education (CBE) for fourth-year teacher trainees. The workshop, held at the KAFU Main Campus, equipped trainee teachers with practical skills in lesson planning, formative assessment, and differentiated instruction under the Competency-Based Curriculum framework. The training was facilitated by senior academics from SESS and officers from the Kenya Institute of Curriculum Development.',
            'category' => 'Academic',
            'author' => 'Dr. Nabeta K.N Sangili',
            'date' => '2026-02-15',
            'imageUrl' => 'https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg',
            'tags' => ['SESS', 'Education', 'CBE', 'Training'],
            'featured' => false,
        ],
        [
            'id' => 8,
            'slug' => 'kafu-interdenominational-prayer-breakfast',
            'title' => 'KAFU Hosts 2nd Interdenominational Prayer Breakfast',
            'excerpt' => 'The university community gathered for the second annual interdenominational prayer breakfast, reinforcing KAFU\'s Quaker heritage.',
            'summary' => 'Kaimosi Friends University hosted its Second Annual Interdenominational Prayer Breakfast, bringing together students, staff, and faith community leaders from across Vihiga County. The event, held at the KAFU Main Auditorium, featured prayers, worship, and reflections on the role of faith in academic excellence. Vice-Chancellor Prof. Peter Mwita called on all community members to uphold KAFU\'s founding Quaker values of simplicity, peace, integrity, community, and equality.',
            'category' => 'Events',
            'author' => 'Dean of Students Office',
            'date' => '2026-02-10',
            'imageUrl' => null,
            'tags' => ['Quaker Heritage', 'Community', 'Faith', 'Campus Life'],
            'featured' => false,
        ],
        [
            'id' => 9,
            'slug' => 'kafu-classified-category-a-university',
            'title' => 'KAFU Classified as Category A University by the Kenya Universities and Colleges Central Placement Service',
            'excerpt' => 'Kaimosi Friends University achieves Category A status, opening access to the highest-achieving KCSE candidates.',
            'summary' => 'In a major milestone, Kaimosi Friends University has been classified as a Category A university by the Kenya Universities and Colleges Central Placement Service (KUCCPS). This classification places KAFU among the top-tier institutions in Kenya and will allow the university to attract students with the highest Kenya Certificate of Secondary Education (KCSE) scores through government sponsorship. The classification reflects improvements in infrastructure, staffing, and academic programmes.',
            'category' => 'Institutional',
            'author' => 'Office of the Vice-Chancellor',
            'date' => '2026-01-30',
            'imageUrl' => null,
            'tags' => ['Accreditation', 'KUCCPS', 'Institutional', 'Recognition'],
            'featured' => false,
        ],
        [
            'id' => 10,
            'slug' => 'kafu-annual-research-conference-2026',
            'title' => 'KAFU Announces 3rd Annual Research Conference — Call for Abstracts Open',
            'excerpt' => 'Researchers, graduate students, and practitioners are invited to submit abstracts for the KAFU Annual Research Conference 2026.',
            'summary' => 'The Directorate of Research and Innovation at Kaimosi Friends University is pleased to announce the opening of abstract submissions for the 3rd Annual Research Conference, scheduled for April 2026. The conference, themed "Research for Sustainable Development in the African Context," invites contributions from all disciplines across KAFU\'s five schools as well as external researchers and graduate students. Accepted abstracts will be published in the KAFU Research Journal.',
            'category' => 'Research & Innovation',
            'author' => 'Directorate of Research & Innovation',
            'date' => '2026-01-20',
            'imageUrl' => null,
            'tags' => ['Research', 'Conference', 'Call for Papers', 'Innovation'],
            'featured' => false,
        ],
    ];

    // Remove static articles already managed in CMS (CMS version takes precedence)
    $articles = array_values(array_filter($articles, fn($a) => !isset($cmsSlugSet[$a['slug']])));
    $articles = array_merge($cmsItems, $articles);

    $category = $request->query('category');
    $search = $request->query('search');

    if ($category && $category !== 'All') {
        $articles = array_values(array_filter($articles, fn($a) => strtolower($a['category']) === strtolower($category)));
    }
    if ($search) {
        $articles = array_values(array_filter($articles, fn($a) =>
            stripos($a['title'], $search) !== false ||
            stripos($a['summary'], $search) !== false ||
            stripos($a['category'], $search) !== false
        ));
    }

    return response()->json(['data' => $articles]);
});

Route::get('/news/{slug}', function (string $slug) {
    // Check CMS first
    $cmsItem = CmsContent::where('type', 'news')
        ->where('slug', $slug)
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->with('author:id,name')
        ->first();
    if ($cmsItem) {
        return response()->json(['data' => mapCmsNewsDetail($cmsItem)]);
    }
    $articles = [
        'innovators-develop-smart-digital-systems' => [
            'id' => 1,
            'slug' => 'innovators-develop-smart-digital-systems',
            'title' => 'KAFU Innovators Develop Smart Digital Systems for Better Service Delivery',
            'summary' => 'A team of students and faculty from the School of Computing and Information Technology has developed a suite of smart digital tools designed to streamline service delivery in public institutions.',
            'category' => 'Research & Innovation',
            'author' => 'KAFU Communications Office',
            'date' => '2026-03-20',
            'imageUrl' => 'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg',
            'tags' => ['Innovation', 'Technology', 'SCIT', 'Community'],
            'featured' => true,
            'content' => "<p>A team of students and faculty from the School of Computing and Information Technology (SCIT) at Kaimosi Friends University has unveiled a suite of smart digital tools designed to transform service delivery in public institutions across Western Kenya.</p><p>The innovations were showcased at the annual KAFU Innovation Expo held at the Main Campus. The flagship product is a citizen-facing complaints management portal that integrates with county government systems, allowing residents to submit service delivery complaints, track resolution progress, and receive SMS and email feedback in real time.</p><p>A second innovation, a smart queue management system, uses IoT sensors and a mobile application to reduce waiting times at government service centres by up to 60%, according to pilot test data collected at the Vihiga County Huduma Centre.</p><p>Prof. Kelvin K. Omieno, Dean of SCIT, praised the team: \"This is precisely the kind of applied innovation KAFU stands for — research that does not sit on library shelves but solves real problems in the communities we serve.\"</p><p>The innovations will be presented to the Council of Governors at a forthcoming devolution conference, with plans to pilot at scale across three counties in Western Kenya.</p>",
            'related' => [2, 3, 10],
        ],
        'kafu-to-host-africa-public-service-day-2026' => [
            'id' => 4,
            'slug' => 'kafu-to-host-africa-public-service-day-2026',
            'title' => 'Historic Moment as KAFU is Earmarked to Host Africa Public Service Day 2026',
            'summary' => 'Kaimosi Friends University has been designated to host the Africa Public Service Day 2026 celebrations.',
            'category' => 'Institutional',
            'author' => 'Office of the Vice-Chancellor',
            'date' => '2026-03-05',
            'imageUrl' => 'https://kafu.ac.ke/wp-content/uploads/IMG_8696.jpg',
            'tags' => ['Africa Public Service Day', 'Institutional', 'Recognition', 'Continental'],
            'featured' => true,
            'content' => "<p>In a landmark recognition of its growing academic and institutional stature, Kaimosi Friends University has been designated to host the Africa Public Service Day (APSD) 2026 celebrations. The announcement was made by Cabinet Secretary for Public Service during a function in Nairobi attended by Vice-Chancellor Prof. Peter Nyamuhanga Mwita.</p><p>APSD 2026, themed \"Digital Transformation for Inclusive and Sustainable Public Services,\" will bring together public servants, policymakers, development partners, and academics from across the African continent to Kaimosi.</p><p>\"This is a historic moment not just for KAFU but for the entire Western Kenya region. We are proud to showcase Kaimosi as a hub of academic excellence and innovation on the continental stage,\" said Prof. Mwita in a statement.</p><p>The event, scheduled for 23 June 2026, will include a high-level panel discussion, an innovation showcase, and a public service excellence awards ceremony. The host designation also comes with a government grant of KES 50 million towards conference infrastructure and capacity building.</p>",
            'related' => [1, 6, 9],
        ],
        'teacher-trainees-competency-based-education' => [
            'id' => 7,
            'slug' => 'teacher-trainees-competency-based-education',
            'title' => 'Teacher Trainees Receive Competency-Based Education Training at KAFU',
            'summary' => 'KAFU School of Education hosts a training workshop on Competency-Based Education for teacher trainees.',
            'category' => 'Academic',
            'author' => 'Dr. Nabeta K.N Sangili',
            'date' => '2026-02-15',
            'imageUrl' => 'https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg',
            'tags' => ['SESS', 'Education', 'CBE', 'Training'],
            'featured' => false,
            'content' => "<p>The School of Education and Social Sciences (SESS) at Kaimosi Friends University hosted a five-day workshop on Competency-Based Education (CBE) for fourth-year teacher trainees. The workshop, held at the KAFU Main Campus, equipped trainee teachers with practical skills in lesson planning, formative assessment, and differentiated instruction under the Competency-Based Curriculum (CBC) framework.</p><p>Vice-Chancellor Prof. Peter Mwita officially opened the training, emphasising the importance of quality teacher education in transforming Kenya's education system. \"KAFU is committed to producing teachers who are not just knowledgeable but competent, adaptive, and ethically grounded,\" he said.</p><p>The training was facilitated by senior academics from SESS and officers from the Kenya Institute of Curriculum Development (KICD). Participants engaged in practical teaching demonstrations, peer review sessions, and technology-integrated lesson planning exercises.</p><p>Over 120 teacher trainees completed the programme, with all participants receiving certificates of completion that will contribute toward their Teacher Service Commission registration requirements.</p>",
            'related' => [5, 8],
        ],
    ];

    if (!isset($articles[$slug])) {
        $defaultContent = "<p>Full article content is being prepared by the KAFU Communications Office. Please check back shortly or contact info@kafu.ac.ke for more information.</p>";
        $baseArticles = [
            'community-backs-college-of-health-sciences-vokoli' => ['id'=>2,'author'=>'Dr. Annette O. Busula','category'=>'Outreach','date'=>'2026-03-15','imageUrl'=>null,'tags'=>['Health Sciences','Community','Expansion','SHS'],'featured'=>false,'related'=>[3,9]],
            'kafu-hosts-ministry-of-health-officials' => ['id'=>3,'author'=>'KAFU Communications Office','category'=>'Partnerships','date'=>'2026-03-10','imageUrl'=>null,'tags'=>['Ministry of Health','Partnerships','SHS','Healthcare'],'featured'=>false,'related'=>[2,9]],
            'mumias-east-candidates-career-mentorship' => ['id'=>5,'author'=>'Office of Student Affairs','category'=>'Outreach','date'=>'2026-02-28','imageUrl'=>null,'tags'=>['Mentorship','Outreach','Community','Students'],'featured'=>false,'related'=>[6,8]],
            'kafu-vc-represents-education-cs-migori' => ['id'=>6,'author'=>'Office of the Vice-Chancellor','category'=>'Leadership','date'=>'2026-02-20','imageUrl'=>null,'tags'=>['VC','Gender','Leadership','Outreach'],'featured'=>false,'related'=>[4,5]],
            'kafu-interdenominational-prayer-breakfast' => ['id'=>8,'author'=>'Dean of Students Office','category'=>'Events','date'=>'2026-02-10','imageUrl'=>null,'tags'=>['Quaker Heritage','Community','Faith','Campus Life'],'featured'=>false,'related'=>[5,6]],
            'kafu-classified-category-a-university' => ['id'=>9,'author'=>'Office of the Vice-Chancellor','category'=>'Institutional','date'=>'2026-01-30','imageUrl'=>null,'tags'=>['Accreditation','KUCCPS','Institutional','Recognition'],'featured'=>false,'related'=>[4,10]],
            'kafu-annual-research-conference-2026' => ['id'=>10,'author'=>'Directorate of Research & Innovation','category'=>'Research & Innovation','date'=>'2026-01-20','imageUrl'=>null,'tags'=>['Research','Conference','Call for Papers','Innovation'],'featured'=>false,'related'=>[1,3]],
        ];
        $titles = [
            'community-backs-college-of-health-sciences-vokoli' => 'Community Backs Proposal to Establish College of Health Sciences in Vokoli',
            'kafu-hosts-ministry-of-health-officials' => 'KAFU Hosts Officials from the Ministry of Health for Strategic Partnership Talks',
            'mumias-east-candidates-career-mentorship' => 'Mumias East Candidates Benefit from Career Mentorship and Academic Guidance Through KAFU',
            'kafu-vc-represents-education-cs-migori' => 'KAFU VC Represents Education CS at Women Empowerment Initiative in Migori County',
            'kafu-interdenominational-prayer-breakfast' => 'KAFU Hosts 2nd Interdenominational Prayer Breakfast',
            'kafu-classified-category-a-university' => 'KAFU Classified as Category A University by KUCCPS',
            'kafu-annual-research-conference-2026' => 'KAFU Announces 3rd Annual Research Conference — Call for Abstracts Open',
        ];
        if (isset($baseArticles[$slug])) {
            $article = array_merge($baseArticles[$slug], [
                'slug' => $slug,
                'title' => $titles[$slug],
                'summary' => 'Read the full story on the KAFU website.',
                'content' => $defaultContent,
            ]);
            return response()->json(['data' => $article]);
        }
        return response()->json(['error' => 'Article not found'], 404);
    }

    return response()->json(['data' => $articles[$slug]]);
});

Route::get('/events', function (Request $request) {
    $cmsItems = CmsContent::where('type', 'event')
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->orderByDesc('published_at')
        ->get()
        ->map(fn($item) => mapCmsEvent($item))
        ->toArray();
    $cmsSlugSet = array_flip(array_column($cmsItems, 'slug'));

    $events = [
        [
            'id' => 1,
            'slug' => 'examination-processing-semester-2-2025-2026',
            'title' => 'Examination Processing Schedule — Semester II (2025/2026)',
            'date' => '2026-04-02',
            'end_date' => '2026-04-10',
            'time' => '08:00 – 17:00',
            'location' => 'Main Campus, Kaimosi',
            'category' => 'Examinations',
            'description' => 'The Examinations Department has published the processing schedule for end-of-semester examinations for Semester II of the 2025/2026 academic year. All students are required to clear outstanding fees and complete exam registration through the student portal before the deadline. Timetables will be posted on departmental notice boards and the student portal at least seven days before examination commencement.',
            'registration_link' => 'https://portal.kafu.ac.ke',
            'tags' => ['Examinations', 'Academic Calendar', 'Students'],
            'status' => 'upcoming',
        ],
        [
            'id' => 2,
            'slug' => 'kafu-open-day-2026',
            'title' => 'KAFU Open Day 2026 — Explore Your Future',
            'date' => '2026-04-15',
            'end_date' => '2026-04-15',
            'time' => '09:00 – 16:00',
            'location' => 'All Schools, Main Campus, Kaimosi',
            'category' => 'Community Outreach',
            'description' => 'KAFU Open Day 2026 is your opportunity to explore the university campus, meet faculty and current students, attend live programme demonstrations, and get all the information you need about admission pathways, fees, scholarships, and student life. All prospective students, parents, and career guidance counsellors are warmly invited. Free entry. Light refreshments provided.',
            'registration_link' => 'https://portal.kafu.ac.ke',
            'tags' => ['Open Day', 'Prospective Students', 'Admissions'],
            'status' => 'upcoming',
        ],
        [
            'id' => 3,
            'slug' => 'annual-research-conference-2026',
            'title' => '3rd KAFU Annual Research Conference',
            'date' => '2026-04-24',
            'end_date' => '2026-04-25',
            'time' => '08:30 – 17:00',
            'location' => 'KAFU Conference Centre, Main Campus',
            'category' => 'Academic',
            'description' => 'The 3rd Annual Research Conference brings together researchers, graduate students, and practitioners under the theme "Research for Sustainable Development in the African Context." The two-day conference will feature keynote addresses by leading academics, parallel technical sessions, a postgraduate symposium, and a research poster exhibition. Selected papers will be published in the peer-reviewed KAFU Research Journal.',
            'registration_link' => 'https://portal.kafu.ac.ke',
            'tags' => ['Research', 'Conference', 'Graduate Studies', 'Innovation'],
            'status' => 'upcoming',
        ],
        [
            'id' => 4,
            'slug' => 'internal-audit-may-2026',
            'title' => 'Internal Audit — May 2026',
            'date' => '2026-05-05',
            'end_date' => '2026-05-09',
            'time' => '08:00 – 17:00',
            'location' => 'Administration Block',
            'category' => 'Administration',
            'description' => 'The Internal Audit Unit will conduct its scheduled May audit of university financial records, procurement processes, and asset management. All departments are required to ensure their records are up to date and available for review. Queries should be directed to the Internal Auditor at audit@kafu.ac.ke.',
            'registration_link' => null,
            'tags' => ['Administration', 'Finance', 'Governance'],
            'status' => 'upcoming',
        ],
        [
            'id' => 5,
            'slug' => 'academic-board-meeting-may-2026',
            'title' => 'Academic Board Meeting — May 2026',
            'date' => '2026-05-12',
            'end_date' => '2026-05-12',
            'time' => '10:00 – 15:00',
            'location' => 'Council Chamber, Administration Block',
            'category' => 'Administration',
            'description' => 'The regular quarterly meeting of the KAFU Academic Board will convene to review academic policy matters, approve new programmes, consider examination results, and receive reports from School Deans. The agenda and related papers are available to board members via the Academic Secretariat.',
            'registration_link' => null,
            'tags' => ['Academic Board', 'Governance', 'Administration'],
            'status' => 'upcoming',
        ],
        [
            'id' => 6,
            'slug' => 'graduation-ceremony-2026',
            'title' => '8th Graduation Ceremony — KAFU Class of 2026',
            'date' => '2026-05-22',
            'end_date' => '2026-05-22',
            'time' => '09:00 – 14:00',
            'location' => 'KAFU Grounds, Main Campus',
            'category' => 'Graduation',
            'description' => 'Kaimosi Friends University will host its 8th Graduation Ceremony, celebrating the Class of 2026. The ceremony will confer degrees, diplomas, and certificates to graduates from all five schools. Graduands are required to collect their gowns from the Examinations Office at least three days before the ceremony and to arrive at the venue by 08:00 AM. Guests are limited to two tickets per graduand. Details will be communicated through the student portal.',
            'registration_link' => 'https://portal.kafu.ac.ke',
            'tags' => ['Graduation', 'Ceremony', 'Class of 2026'],
            'status' => 'upcoming',
        ],
        [
            'id' => 7,
            'slug' => 'sports-day-2026',
            'title' => 'KAFU Annual Sports Day 2026',
            'date' => '2026-06-05',
            'end_date' => '2026-06-05',
            'time' => '09:00 – 17:00',
            'location' => 'KAFU Sports Grounds, Main Campus',
            'category' => 'Student Life',
            'description' => 'The annual KAFU Sports Day brings together students, staff, and the wider university community for a day of athletic competitions, team sports, and recreational activities. Events include track and field, football, volleyball, and netball competitions, with trophies and prizes for top performers. All students and staff are encouraged to participate. Entry is free.',
            'registration_link' => null,
            'tags' => ['Sports', 'Student Life', 'Community', 'Athletics'],
            'status' => 'upcoming',
        ],
        [
            'id' => 8,
            'slug' => 'africa-public-service-day-2026',
            'title' => 'Africa Public Service Day 2026',
            'date' => '2026-06-23',
            'end_date' => '2026-06-23',
            'time' => 'All Day',
            'location' => 'Kaimosi Friends University, Main Campus',
            'category' => 'Special Events',
            'description' => 'KAFU is proud to host the Africa Public Service Day 2026, a continental celebration bringing together heads of government, public service commissions, development partners, and academics from across Africa. The day\'s programme will feature high-level panel discussions on digital governance, a public service innovation showcase, and the Africa Public Service Excellence Awards. Media accreditation and delegation registration are managed through the Office of the Vice-Chancellor.',
            'registration_link' => null,
            'tags' => ['APSD', 'Continental', 'Special Event', 'Public Service'],
            'status' => 'upcoming',
        ],
        [
            'id' => 9,
            'slug' => 'senate-meeting-june-2026',
            'title' => 'Senate Meeting — June 2026',
            'date' => '2026-06-29',
            'end_date' => '2026-06-29',
            'time' => '09:00 – 13:00',
            'location' => 'Council Chamber, Administration Block',
            'category' => 'Administration',
            'description' => 'The regular meeting of the KAFU Senate will be held to consider matters of academic policy, review reports from the Academic Board, and approve examination results for the Semester II 2025/2026 academic year. Senate members are required to confirm their attendance with the Academic Registrar\'s office at least 48 hours in advance.',
            'registration_link' => null,
            'tags' => ['Senate', 'Governance', 'Academic Policy'],
            'status' => 'upcoming',
        ],
        [
            'id' => 10,
            'slug' => 'cbe-teacher-training-workshop-march-2026',
            'title' => 'Competency-Based Education Teacher Training Workshop',
            'date' => '2026-02-10',
            'end_date' => '2026-02-14',
            'time' => '08:30 – 16:30',
            'location' => 'SESS Building, Main Campus',
            'category' => 'Academic',
            'description' => 'A five-day workshop on Competency-Based Education for fourth-year teacher trainees, jointly facilitated by KAFU School of Education and Social Sciences and the Kenya Institute of Curriculum Development. Participants gained practical skills in CBC lesson design, formative assessment, and technology integration.',
            'registration_link' => null,
            'tags' => ['CBE', 'Education', 'SESS', 'Workshop'],
            'status' => 'past',
        ],
    ];

    // Merge: CMS events first, static events that aren't in CMS after
    $events = array_values(array_filter($events, fn($e) => !isset($cmsSlugSet[$e['slug']])));
    $events = array_merge($cmsItems, $events);

    $filter = $request->query('filter', 'upcoming');
    $category = $request->query('category');
    $search = $request->query('search');

    if ($filter === 'past') {
        $events = array_values(array_filter($events, fn($e) => $e['status'] === 'past'));
    } elseif ($filter === 'upcoming') {
        $events = array_values(array_filter($events, fn($e) => $e['status'] === 'upcoming'));
    }

    if ($category && $category !== 'All') {
        $events = array_values(array_filter($events, fn($e) => strtolower($e['category']) === strtolower($category)));
    }
    if ($search) {
        $events = array_values(array_filter($events, fn($e) =>
            stripos($e['title'], $search) !== false ||
            stripos($e['description'], $search) !== false
        ));
    }

    return response()->json(['data' => $events]);
});

Route::get('/events/{slug}', function (string $slug) {
    // Check CMS first
    $cmsItem = CmsContent::where('type', 'event')
        ->where('slug', $slug)
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->first();
    if ($cmsItem) {
        return response()->json(['data' => mapCmsEventDetail($cmsItem)]);
    }
    $all = [
        'examination-processing-semester-2-2025-2026' => ['id'=>1,'end_date'=>'2026-04-10','time'=>'08:00 – 17:00','location'=>'Main Campus, Kaimosi','category'=>'Examinations','registration_link'=>'https://portal.kafu.ac.ke','tags'=>['Examinations','Academic Calendar','Students'],'status'=>'upcoming'],
        'kafu-open-day-2026' => ['id'=>2,'end_date'=>'2026-04-15','time'=>'09:00 – 16:00','location'=>'All Schools, Main Campus, Kaimosi','category'=>'Community Outreach','registration_link'=>'https://portal.kafu.ac.ke','tags'=>['Open Day','Prospective Students','Admissions'],'status'=>'upcoming'],
        'annual-research-conference-2026' => ['id'=>3,'end_date'=>'2026-04-25','time'=>'08:30 – 17:00','location'=>'KAFU Conference Centre, Main Campus','category'=>'Academic','registration_link'=>'https://portal.kafu.ac.ke','tags'=>['Research','Conference','Graduate Studies','Innovation'],'status'=>'upcoming'],
        'internal-audit-may-2026' => ['id'=>4,'end_date'=>'2026-05-09','time'=>'08:00 – 17:00','location'=>'Administration Block','category'=>'Administration','registration_link'=>null,'tags'=>['Administration','Finance','Governance'],'status'=>'upcoming'],
        'academic-board-meeting-may-2026' => ['id'=>5,'end_date'=>'2026-05-12','time'=>'10:00 – 15:00','location'=>'Council Chamber, Administration Block','category'=>'Administration','registration_link'=>null,'tags'=>['Academic Board','Governance','Administration'],'status'=>'upcoming'],
        'graduation-ceremony-2026' => ['id'=>6,'end_date'=>'2026-05-22','time'=>'09:00 – 14:00','location'=>'KAFU Grounds, Main Campus','category'=>'Graduation','registration_link'=>'https://portal.kafu.ac.ke','tags'=>['Graduation','Ceremony','Class of 2026'],'status'=>'upcoming'],
        'sports-day-2026' => ['id'=>7,'end_date'=>'2026-06-05','time'=>'09:00 – 17:00','location'=>'KAFU Sports Grounds, Main Campus','category'=>'Student Life','registration_link'=>null,'tags'=>['Sports','Student Life','Community','Athletics'],'status'=>'upcoming'],
        'africa-public-service-day-2026' => ['id'=>8,'end_date'=>'2026-06-23','time'=>'All Day','location'=>'Kaimosi Friends University, Main Campus','category'=>'Special Events','registration_link'=>null,'tags'=>['APSD','Continental','Special Event','Public Service'],'status'=>'upcoming'],
        'senate-meeting-june-2026' => ['id'=>9,'end_date'=>'2026-06-29','time'=>'09:00 – 13:00','location'=>'Council Chamber, Administration Block','category'=>'Administration','registration_link'=>null,'tags'=>['Senate','Governance','Academic Policy'],'status'=>'upcoming'],
        'cbe-teacher-training-workshop-march-2026' => ['id'=>10,'end_date'=>'2026-02-14','time'=>'08:30 – 16:30','location'=>'SESS Building, Main Campus','category'=>'Academic','registration_link'=>null,'tags'=>['CBE','Education','SESS','Workshop'],'status'=>'past'],
    ];
    $titles = [
        'examination-processing-semester-2-2025-2026' => 'Examination Processing Schedule — Semester II (2025/2026)',
        'kafu-open-day-2026' => 'KAFU Open Day 2026 — Explore Your Future',
        'annual-research-conference-2026' => '3rd KAFU Annual Research Conference',
        'internal-audit-may-2026' => 'Internal Audit — May 2026',
        'academic-board-meeting-may-2026' => 'Academic Board Meeting — May 2026',
        'graduation-ceremony-2026' => '8th Graduation Ceremony — KAFU Class of 2026',
        'sports-day-2026' => 'KAFU Annual Sports Day 2026',
        'africa-public-service-day-2026' => 'Africa Public Service Day 2026',
        'senate-meeting-june-2026' => 'Senate Meeting — June 2026',
        'cbe-teacher-training-workshop-march-2026' => 'Competency-Based Education Teacher Training Workshop',
    ];
    $dates = [
        'examination-processing-semester-2-2025-2026' => '2026-04-02',
        'kafu-open-day-2026' => '2026-04-15',
        'annual-research-conference-2026' => '2026-04-24',
        'internal-audit-may-2026' => '2026-05-05',
        'academic-board-meeting-may-2026' => '2026-05-12',
        'graduation-ceremony-2026' => '2026-05-22',
        'sports-day-2026' => '2026-06-05',
        'africa-public-service-day-2026' => '2026-06-23',
        'senate-meeting-june-2026' => '2026-06-29',
        'cbe-teacher-training-workshop-march-2026' => '2026-02-10',
    ];
    $descriptions = [
        'examination-processing-semester-2-2025-2026' => 'The Examinations Department has published the processing schedule for end-of-semester examinations for Semester II of the 2025/2026 academic year. All students are required to clear outstanding fees and complete exam registration through the student portal before the deadline.',
        'kafu-open-day-2026' => 'KAFU Open Day 2026 is your opportunity to explore the university campus, meet faculty and current students, attend live programme demonstrations, and get all the information you need about admission pathways, fees, scholarships, and student life.',
        'annual-research-conference-2026' => 'The 3rd Annual Research Conference brings together researchers, graduate students, and practitioners under the theme "Research for Sustainable Development in the African Context." The two-day conference features keynotes, technical sessions, a postgraduate symposium, and a poster exhibition.',
        'internal-audit-may-2026' => 'The Internal Audit Unit will conduct its scheduled May audit of university financial records, procurement processes, and asset management. All departments are required to ensure their records are up to date and available for review.',
        'academic-board-meeting-may-2026' => 'The regular quarterly meeting of the KAFU Academic Board will convene to review academic policy matters, approve new programmes, consider examination results, and receive reports from School Deans.',
        'graduation-ceremony-2026' => 'Kaimosi Friends University will host its 8th Graduation Ceremony, celebrating the Class of 2026. The ceremony will confer degrees, diplomas, and certificates to graduates from all five schools.',
        'sports-day-2026' => 'The annual KAFU Sports Day brings together students, staff, and the wider university community for a day of athletic competitions, team sports, and recreational activities.',
        'africa-public-service-day-2026' => 'KAFU is proud to host the Africa Public Service Day 2026, a continental celebration bringing together heads of government, public service commissions, development partners, and academics from across Africa.',
        'senate-meeting-june-2026' => 'The regular meeting of the KAFU Senate will be held to consider matters of academic policy, review reports from the Academic Board, and approve examination results for the Semester II 2025/2026 academic year.',
        'cbe-teacher-training-workshop-march-2026' => 'A five-day workshop on Competency-Based Education for fourth-year teacher trainees, jointly facilitated by KAFU SESS and the Kenya Institute of Curriculum Development.',
    ];
    if (!isset($all[$slug])) {
        return response()->json(['error' => 'Event not found'], 404);
    }
    $event = array_merge($all[$slug], [
        'slug' => $slug,
        'title' => $titles[$slug],
        'date' => $dates[$slug],
        'description' => $descriptions[$slug],
    ]);
    return response()->json(['data' => $event]);
});

Route::get('/announcements', function (Request $request) {
    $cmsItems = CmsContent::where('type', 'announcement')
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->orderByDesc('published_at')
        ->get()
        ->map(fn($item) => mapCmsAnnouncement($item))
        ->toArray();
    $cmsSlugSet = array_flip(array_column($cmsItems, 'slug'));

    $announcements = [
        [
            'id' => 1,
            'slug' => 'academic-calendar-2025-2026',
            'title' => 'Academic Calendar — 2025/2026 Academic Year',
            'department' => 'Academic Registrar',
            'priority' => 'normal',
            'publish_date' => '2025-08-01',
            'summary' => 'The official academic calendar for the 2025/2026 academic year has been approved by the Academic Board and is now available for download via the student portal and this website.',
            'tags' => ['Academic Calendar', 'Students', 'Staff'],
            'status' => 'active',
        ],
        [
            'id' => 2,
            'slug' => 'fee-structure-semester-2-2025-2026',
            'title' => 'Fee Structure Update — Second Semester 2025/2026',
            'department' => 'Finance Office',
            'priority' => 'urgent',
            'publish_date' => '2026-01-10',
            'summary' => 'The Finance Office has released the updated fee structure for the Second Semester 2025/2026. Students must clear all fee balances before the deadline to be allowed to sit examinations. Penalty interest applies to all overdue balances.',
            'tags' => ['Fees', 'Finance', 'Students'],
            'status' => 'active',
        ],
        [
            'id' => 3,
            'slug' => 'examination-registration-deadline-semester-2',
            'title' => 'Notice: Examination Registration Deadline — Semester II',
            'department' => 'Examinations Office',
            'priority' => 'urgent',
            'publish_date' => '2026-03-01',
            'summary' => 'All registered students must complete their examination registration through the student portal by 31 March 2026. Late registration will attract a penalty fee and no student will be permitted to sit examinations without a valid exam card.',
            'tags' => ['Examinations', 'Registration', 'Students', 'Deadline'],
            'status' => 'active',
        ],
        [
            'id' => 4,
            'slug' => 'staff-recruitment-various-positions',
            'title' => 'Staff Recruitment Notice — Various Academic and Administrative Positions',
            'department' => 'Human Resources',
            'priority' => 'normal',
            'publish_date' => '2026-02-15',
            'summary' => 'Kaimosi Friends University invites applications from suitably qualified candidates for various academic and administrative positions. Detailed job descriptions and application requirements are available on the Opportunities page of this website.',
            'tags' => ['Recruitment', 'Jobs', 'HR', 'Academic Staff'],
            'status' => 'active',
        ],
        [
            'id' => 5,
            'slug' => 'holiday-closure-good-friday-easter',
            'title' => 'Holiday Closure Notice — Good Friday & Easter Monday 2026',
            'department' => 'Office of the Registrar',
            'priority' => 'normal',
            'publish_date' => '2026-03-20',
            'summary' => 'All university offices will be closed on Good Friday (3 April 2026) and Easter Monday (6 April 2026) in observance of the public holidays. Normal operations will resume on Tuesday, 7 April 2026. Emergency inquiries may be directed to the security desk.',
            'tags' => ['Holiday', 'Office Closure', 'Administration'],
            'status' => 'active',
        ],
        [
            'id' => 6,
            'slug' => 'student-health-insurance-enrollment',
            'title' => 'Student Health Insurance Enrollment Drive — 2025/2026',
            'department' => 'Dean of Students',
            'priority' => 'normal',
            'publish_date' => '2026-01-20',
            'summary' => 'All continuing and newly admitted students are required to enroll in the KAFU Student Health Insurance Scheme. Enrollment forms are available at the Dean of Students office and the student health clinic. The annual premium is included in the student welfare fees.',
            'tags' => ['Health Insurance', 'Student Welfare', 'Dean of Students'],
            'status' => 'active',
        ],
        [
            'id' => 7,
            'slug' => 'special-council-meeting-notice',
            'title' => 'Notice of Special Council Meeting — March 2026',
            'department' => 'Office of the Vice-Chancellor',
            'priority' => 'normal',
            'publish_date' => '2026-03-10',
            'summary' => 'The University Council will convene a special meeting on 26 March 2026 to consider strategic matters related to the proposed campus expansion and the 2026/2027 budget framework. Council members are requested to confirm attendance with the Council Secretary.',
            'tags' => ['Council', 'Governance', 'Administration'],
            'status' => 'active',
        ],
        [
            'id' => 8,
            'slug' => 'library-extended-hours-examinations',
            'title' => 'Library Extended Hours During Examination Period',
            'department' => 'University Library',
            'priority' => 'normal',
            'publish_date' => '2026-03-25',
            'summary' => 'The KAFU University Library will operate extended hours during the examination period (April – May 2026). The library will be open Monday to Friday from 07:00 to 22:00, and Saturday and Sunday from 09:00 to 18:00. Students are reminded to carry valid student identification.',
            'tags' => ['Library', 'Examinations', 'Students'],
            'status' => 'active',
        ],
        [
            'id' => 9,
            'slug' => 'kuccps-category-a-classification',
            'title' => 'KAFU Achieves Category A Classification by KUCCPS',
            'department' => 'Office of the Vice-Chancellor',
            'priority' => 'normal',
            'publish_date' => '2026-01-30',
            'summary' => 'Kaimosi Friends University has been officially classified as a Category A institution by the Kenya Universities and Colleges Central Placement Service (KUCCPS). This milestone places KAFU among the top universities in Kenya for government-sponsored student placement.',
            'tags' => ['Institutional', 'KUCCPS', 'Accreditation', 'Recognition'],
            'status' => 'active',
        ],
        [
            'id' => 10,
            'slug' => 'postgraduate-intake-june-2026',
            'title' => 'Postgraduate Intake — January 2026 Session Now Open',
            'department' => 'Graduate School',
            'priority' => 'normal',
            'publish_date' => '2026-02-01',
            'summary' => 'Applications for postgraduate programmes (Masters and PhD) for the January 2026 intake are now open. Applicants must hold a minimum of Second Class Honours (Upper Division) for Masters programmes and a Masters degree for Doctoral programmes. Apply through the student portal.',
            'tags' => ['Postgraduate', 'Admissions', 'Masters', 'PhD'],
            'status' => 'active',
        ],
    ];

    // Merge: CMS announcements first, static ones not in CMS after
    $announcements = array_values(array_filter($announcements, fn($a) => !isset($cmsSlugSet[$a['slug']])));
    $announcements = array_merge($cmsItems, $announcements);

    $priority = $request->query('priority');
    $department = $request->query('department');
    $search = $request->query('search');
    $status = $request->query('status', 'active');

    if ($status && $status !== 'all') {
        $announcements = array_values(array_filter($announcements, fn($a) => $a['status'] === $status));
    }
    if ($priority && $priority !== 'all') {
        $announcements = array_values(array_filter($announcements, fn($a) => $a['priority'] === $priority));
    }
    if ($department) {
        $announcements = array_values(array_filter($announcements, fn($a) => stripos($a['department'], $department) !== false));
    }
    if ($search) {
        $announcements = array_values(array_filter($announcements, fn($a) =>
            stripos($a['title'], $search) !== false ||
            stripos($a['summary'], $search) !== false
        ));
    }

    return response()->json(['data' => $announcements]);
});

Route::get('/announcements/{slug}', function (string $slug) {
    // Check CMS first
    $cmsItem = CmsContent::where('type', 'announcement')
        ->where('slug', $slug)
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->first();
    if ($cmsItem) {
        return response()->json(['data' => mapCmsAnnouncementDetail($cmsItem)]);
    }
    $content_map = [
        'academic-calendar-2025-2026' => "<p>The Academic Board of Kaimosi Friends University, at its meeting held on 28 July 2025, approved the official academic calendar for the 2025/2026 academic year. All students, staff, and other stakeholders are advised to familiarise themselves with the key dates and plan accordingly.</p><p>The academic calendar is available for download from the student portal and the university website. Physical copies are available at the Academic Registrar's office, the Dean of Students office, and all School offices.</p><p>Key dates include: Semester I commencing 8 September 2025; Semester I examinations 15–26 December 2025; Semester II commencing 12 January 2026; and Semester II examinations commencing 6 April 2026. The graduation ceremony is scheduled for 22 May 2026.</p>",
        'fee-structure-semester-2-2025-2026' => "<p>The Finance Office wishes to notify all students that the fee structure for the Second Semester 2025/2026 has been reviewed and updated in line with the university's approved budget. Students are required to note the following key updates:</p><ul><li>Tuition fees remain unchanged for continuing students.</li><li>Student welfare and medical fees have been adjusted upward by 5% following a review by the University Council.</li><li>All fee balances from Semester I must be cleared by 31 January 2026 to avoid a late payment penalty of 10% per month.</li></ul><p>Fee payment options include M-Pesa Paybill (Business Number: 123456, Account: Student Registration Number), bank deposit at Equity Bank (Account Number: 0290265940855), or direct payment at the Finance Office cashiers.</p>",
        'examination-registration-deadline-semester-2' => "<p>The Examinations Office wishes to notify all students that the deadline for examination registration for the Second Semester 2025/2026 is <strong>31 March 2026</strong>.</p><p>All students must:</p><ol><li>Log in to the student portal at portal.kafu.ac.ke</li><li>Confirm course registration for all units taken in Semester II</li><li>Verify that all fee balances are cleared</li><li>Generate and print an examination card</li></ol><p>Students who have not registered by the deadline will be required to pay a late registration penalty of KES 2,000 before they will be allowed to sit examinations. No exceptions will be made.</p>",
        'default' => "<p>Please contact the issuing department for full details of this announcement. Contact information is available in the sidebar or through the KAFU main switchboard at +254 777 373 633.</p>",
    ];

    $departments = [
        'academic-calendar-2025-2026' => 'Academic Registrar',
        'fee-structure-semester-2-2025-2026' => 'Finance Office',
        'examination-registration-deadline-semester-2' => 'Examinations Office',
        'staff-recruitment-various-positions' => 'Human Resources',
        'holiday-closure-good-friday-easter' => 'Office of the Registrar',
        'student-health-insurance-enrollment' => 'Dean of Students',
        'special-council-meeting-notice' => 'Office of the Vice-Chancellor',
        'library-extended-hours-examinations' => 'University Library',
        'kuccps-category-a-classification' => 'Office of the Vice-Chancellor',
        'postgraduate-intake-june-2026' => 'Graduate School',
    ];
    $priorities = [
        'academic-calendar-2025-2026' => 'normal',
        'fee-structure-semester-2-2025-2026' => 'urgent',
        'examination-registration-deadline-semester-2' => 'urgent',
        'staff-recruitment-various-positions' => 'normal',
        'holiday-closure-good-friday-easter' => 'normal',
        'student-health-insurance-enrollment' => 'normal',
        'special-council-meeting-notice' => 'normal',
        'library-extended-hours-examinations' => 'normal',
        'kuccps-category-a-classification' => 'normal',
        'postgraduate-intake-june-2026' => 'normal',
    ];
    $dates = [
        'academic-calendar-2025-2026' => '2025-08-01',
        'fee-structure-semester-2-2025-2026' => '2026-01-10',
        'examination-registration-deadline-semester-2' => '2026-03-01',
        'staff-recruitment-various-positions' => '2026-02-15',
        'holiday-closure-good-friday-easter' => '2026-03-20',
        'student-health-insurance-enrollment' => '2026-01-20',
        'special-council-meeting-notice' => '2026-03-10',
        'library-extended-hours-examinations' => '2026-03-25',
        'kuccps-category-a-classification' => '2026-01-30',
        'postgraduate-intake-june-2026' => '2026-02-01',
    ];
    $titles = [
        'academic-calendar-2025-2026' => 'Academic Calendar — 2025/2026 Academic Year',
        'fee-structure-semester-2-2025-2026' => 'Fee Structure Update — Second Semester 2025/2026',
        'examination-registration-deadline-semester-2' => 'Notice: Examination Registration Deadline — Semester II',
        'staff-recruitment-various-positions' => 'Staff Recruitment Notice — Various Academic and Administrative Positions',
        'holiday-closure-good-friday-easter' => 'Holiday Closure Notice — Good Friday & Easter Monday 2026',
        'student-health-insurance-enrollment' => 'Student Health Insurance Enrollment Drive — 2025/2026',
        'special-council-meeting-notice' => 'Notice of Special Council Meeting — March 2026',
        'library-extended-hours-examinations' => 'Library Extended Hours During Examination Period',
        'kuccps-category-a-classification' => 'KAFU Achieves Category A Classification by KUCCPS',
        'postgraduate-intake-june-2026' => 'Postgraduate Intake — January 2026 Session Now Open',
    ];
    $summaries = [
        'academic-calendar-2025-2026' => 'The official academic calendar for the 2025/2026 academic year has been approved by the Academic Board and is now available for download.',
        'fee-structure-semester-2-2025-2026' => 'The Finance Office has released the updated fee structure for the Second Semester 2025/2026. Students must clear all fee balances before the deadline.',
        'examination-registration-deadline-semester-2' => 'All registered students must complete their examination registration through the student portal by 31 March 2026.',
        'staff-recruitment-various-positions' => 'KAFU invites applications from suitably qualified candidates for various academic and administrative positions.',
        'holiday-closure-good-friday-easter' => 'All university offices will be closed on Good Friday (3 April 2026) and Easter Monday (6 April 2026).',
        'student-health-insurance-enrollment' => 'All continuing and newly admitted students are required to enroll in the KAFU Student Health Insurance Scheme.',
        'special-council-meeting-notice' => 'The University Council will convene a special meeting on 26 March 2026 to consider strategic matters.',
        'library-extended-hours-examinations' => 'The KAFU University Library will operate extended hours during the examination period (April – May 2026).',
        'kuccps-category-a-classification' => 'KAFU has been officially classified as a Category A institution by KUCCPS, placing it among Kenya\'s top universities.',
        'postgraduate-intake-june-2026' => 'Applications for postgraduate programmes (Masters and PhD) for the January 2026 intake are now open.',
    ];
    $tags_map = [
        'academic-calendar-2025-2026' => ['Academic Calendar','Students','Staff'],
        'fee-structure-semester-2-2025-2026' => ['Fees','Finance','Students'],
        'examination-registration-deadline-semester-2' => ['Examinations','Registration','Students','Deadline'],
        'staff-recruitment-various-positions' => ['Recruitment','Jobs','HR','Academic Staff'],
        'holiday-closure-good-friday-easter' => ['Holiday','Office Closure','Administration'],
        'student-health-insurance-enrollment' => ['Health Insurance','Student Welfare','Dean of Students'],
        'special-council-meeting-notice' => ['Council','Governance','Administration'],
        'library-extended-hours-examinations' => ['Library','Examinations','Students'],
        'kuccps-category-a-classification' => ['Institutional','KUCCPS','Accreditation','Recognition'],
        'postgraduate-intake-june-2026' => ['Postgraduate','Admissions','Masters','PhD'],
    ];
    $ids = [
        'academic-calendar-2025-2026'=>1,'fee-structure-semester-2-2025-2026'=>2,'examination-registration-deadline-semester-2'=>3,
        'staff-recruitment-various-positions'=>4,'holiday-closure-good-friday-easter'=>5,'student-health-insurance-enrollment'=>6,
        'special-council-meeting-notice'=>7,'library-extended-hours-examinations'=>8,'kuccps-category-a-classification'=>9,'postgraduate-intake-june-2026'=>10,
    ];

    if (!isset($titles[$slug])) {
        return response()->json(['error' => 'Announcement not found'], 404);
    }

    return response()->json(['data' => [
        'id' => $ids[$slug],
        'slug' => $slug,
        'title' => $titles[$slug],
        'department' => $departments[$slug],
        'priority' => $priorities[$slug],
        'publish_date' => $dates[$slug],
        'summary' => $summaries[$slug],
        'content' => $content_map[$slug] ?? $content_map['default'],
        'tags' => $tags_map[$slug],
        'status' => 'active',
        'attachments' => [],
    ]]);
});

Route::get('/schools', function () {
    $cmsSchools = CmsContent::where('type', 'school')
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->orderBy('title')
        ->get()
        ->map(fn($item) => mapCmsSchool($item))
        ->toArray();
    if (!empty($cmsSchools)) {
        return response()->json(['data' => $cmsSchools]);
    }
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
    $cmsSchool = CmsContent::where('type', 'school')
        ->whereRaw('UPPER(slug) = ?', [strtoupper($code)])
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->first();
    if ($cmsSchool) {
        $mapped = mapCmsSchool($cmsSchool);
        // Also pull programmes of this school type from CMS
        $cmsProgs = CmsContent::where('type', 'programme')
            ->where('school_code', strtoupper($code))
            ->where('status', 'published')
            ->where('is_deleted', false)
            ->orderBy('title')
            ->get()
            ->map(fn($p) => mapCmsProgramme($p))
            ->toArray();
        if (!empty($cmsProgs)) {
            $mapped['programmes'] = $cmsProgs;
        }
        return response()->json(['data' => $mapped]);
    }

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
    $school = $request->query('school') ? strtoupper($request->query('school')) : null;
    $level  = $request->query('level')  ? strtolower($request->query('level'))  : null;

    $cmsQuery = CmsContent::where('type', 'programme')
        ->where('status', 'published')
        ->where('is_deleted', false);
    if ($school) $cmsQuery->where('school_code', $school);
    $cmsProgs = $cmsQuery->orderBy('title')->get();

    if ($cmsProgs->isNotEmpty()) {
        $mapped = $cmsProgs->map(fn($p) => mapCmsProgramme($p))->toArray();
        if ($level) {
            $mapped = array_values(array_filter($mapped, fn($p) => $p['level'] === $level));
        }
        return response()->json(['data' => $mapped, 'total' => count($mapped)]);
    }

    // Static fallback
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
    $page = CmsContent::where('type', 'page')->where('slug', 'contact')
        ->where('status', 'published')->where('is_deleted', false)->first();
    if ($page && !empty($page->structured_data)) {
        return response()->json(['data' => $page->structured_data]);
    }
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

Route::get('/opportunities', function (Request $request) {
    $cmsItems = CmsContent::where('type', 'opportunity')
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->orderByDesc('published_at')
        ->get()
        ->map(fn($item) => mapCmsOpportunity($item))
        ->toArray();
    $cmsSlugSet = array_flip(array_column($cmsItems, 'slug'));

    $all = [
        ['id'=>1,'slug'=>'supply-laboratory-equipment-kafu-proc-001-2026','category'=>'tender','type'=>'Tender','title'=>'Supply of Laboratory Equipment and Consumables','reference'=>'KAFU/PROC/001/2026','department'=>'Procurement & Supply Chain','summary'=>'KAFU invites sealed bids from qualified and registered suppliers for the supply and delivery of laboratory equipment and consumables for the Schools of Science and Health Sciences.','publish_date'=>'2026-03-17','deadline'=>'2026-04-30','deadline_time'=>'17:00','status'=>'open','featured'=>true,'documents_count'=>2],
        ['id'=>2,'slug'=>'provision-security-services-kafu-proc-002-2026','category'=>'tender','type'=>'Tender','title'=>'Provision of Security Guard Services','reference'=>'KAFU/PROC/002/2026','department'=>'Procurement & Supply Chain','summary'=>'KAFU invites tenders from licensed security firms for the provision of professional security guard services across all university campuses and facilities.','publish_date'=>'2026-03-20','deadline'=>'2026-04-08','deadline_time'=>'12:00','status'=>'closing-soon','featured'=>false,'documents_count'=>1],
        ['id'=>3,'slug'=>'supply-ict-equipment-kafu-proc-003-2026','category'=>'tender','type'=>'Tender','title'=>'Supply and Delivery of ICT Equipment and Accessories','reference'=>'KAFU/PROC/003/2026','department'=>'Information and Communication Technology','summary'=>'Kaimosi Friends University invites sealed bids for the supply, delivery, and installation of ICT equipment including computers, servers, networking hardware, and peripherals.','publish_date'=>'2026-03-25','deadline'=>'2026-05-09','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents_count'=>2],
        ['id'=>4,'slug'=>'construction-student-centre-kafu-proc-004-2026','category'=>'tender','type'=>'Tender','title'=>'Construction of Student Centre — Phase 2','reference'=>'KAFU/PROC/004/2026','department'=>'Estates & Facilities Management','summary'=>'KAFU invites bids from eligible NCA-registered contractors for the construction of the second phase of the university student centre including a multi-purpose hall, student lounges, and commercial units.','publish_date'=>'2026-04-01','deadline'=>'2026-05-30','deadline_time'=>'17:00','status'=>'open','featured'=>true,'documents_count'=>3],
        ['id'=>5,'slug'=>'lecturer-computer-science-kafu-hr-001-2026','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Lecturer — Computer Science','reference'=>'KAFU/HR/001/2026','department'=>'School of Computing and Information Technology (SCIT)','summary'=>'Applications are invited from suitably qualified candidates for the position of Lecturer in Computer Science, specialising in AI, Software Engineering, or Data Science.','publish_date'=>'2026-03-18','deadline'=>'2026-04-25','deadline_time'=>'17:00','status'=>'open','featured'=>true,'documents_count'=>1],
        ['id'=>6,'slug'=>'lecturer-nursing-kafu-hr-002-2026','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Lecturer — Nursing','reference'=>'KAFU/HR/002/2026','department'=>'School of Health Sciences (SHS)','summary'=>'The School of Health Sciences invites applications from registered nurses with postgraduate qualifications for the position of Lecturer in Nursing.','publish_date'=>'2026-03-22','deadline'=>'2026-04-08','deadline_time'=>'17:00','status'=>'closing-soon','featured'=>false,'documents_count'=>1],
        ['id'=>7,'slug'=>'finance-officer-kafu-hr-003-2026','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Finance Officer','reference'=>'KAFU/HR/003/2026','department'=>'Finance Department','summary'=>'KAFU seeks a Finance Officer to support financial reporting, budget monitoring, and compliance with public finance management regulations.','publish_date'=>'2026-03-28','deadline'=>'2026-04-28','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents_count'=>1],
        ['id'=>8,'slug'=>'registrar-academics-kafu-hr-004-2026','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Deputy Registrar (Academics)','reference'=>'KAFU/HR/004/2026','department'=>'Academic Registry','summary'=>'Applications are invited for the position of Deputy Registrar (Academics) to support examinations management, student records, and academic programme coordination.','publish_date'=>'2026-04-01','deadline'=>'2026-05-02','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents_count'=>1],
        ['id'=>9,'slug'=>'ict-internship-programme-kafu-intern-001-2026','category'=>'internship','type'=>'Internship','title'=>'ICT Internship Programme — 2026','reference'=>'KAFU/INTERN/001/2026','department'=>'Information and Communication Technology','summary'=>'KAFU offers an ICT internship opportunity for final-year undergraduate students or recent graduates in Computer Science or IT.','publish_date'=>'2026-03-10','deadline'=>'2026-04-15','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents_count'=>1],
        ['id'=>10,'slug'=>'research-assistantship-sos-kafu-intern-002-2026','category'=>'internship','type'=>'Internship','title'=>'Research Assistantship — School of Science','reference'=>'KAFU/INTERN/002/2026','department'=>'School of Science (SOS)','summary'=>'The School of Science invites applications from postgraduate students for research assistantships in Molecular Biology, Environmental Chemistry, and Applied Physics.','publish_date'=>'2026-03-20','deadline'=>'2026-04-30','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents_count'=>1],
        ['id'=>11,'slug'=>'internal-research-grants-kafu-call-001-2026','category'=>'call','type'=>'Call for Applications','title'=>'Internal Research Grants — 2026/2027 Cycle','reference'=>'KAFU/CALL/001/2026','department'=>'Directorate of Research, Innovation & Outreach','summary'=>"KAFU invites academic staff to submit proposals for the 2026/2027 Internal Research Grant cycle, aligned with the university's strategic research themes.",'publish_date'=>'2026-03-15','deadline'=>'2026-04-30','deadline_time'=>'17:00','status'=>'open','featured'=>true,'documents_count'=>2],
        ['id'=>12,'slug'=>'industry-partnership-call-kafu-call-002-2026','category'=>'call','type'=>'Call for Applications','title'=>'Call for Industry and Academic Partnership Proposals','reference'=>'KAFU/CALL/002/2026','department'=>'Office of the Vice-Chancellor','summary'=>'KAFU welcomes proposals from industry partners, research institutions, NGOs, and government agencies for collaborative partnerships in research, training, and technology transfer.','publish_date'=>'2026-04-01','deadline'=>'2026-05-31','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents_count'=>1],
        ['id'=>13,'slug'=>'notice-academic-calendar-amendment-2026','category'=>'notice','type'=>'Notice','title'=>'Notice: Amendment to 2025/2026 Academic Calendar','reference'=>'KAFU/NOT/001/2026','department'=>'Academic Registry','summary'=>'All students and staff are notified of an amendment to the 2025/2026 academic calendar. Supplementary examination dates have been revised.','publish_date'=>'2026-03-28','deadline'=>null,'deadline_time'=>null,'status'=>'open','featured'=>false,'documents_count'=>1],
        ['id'=>14,'slug'=>'disability-support-bursary-kafu-burs-001-2026','category'=>'scholarship','type'=>'Scholarship','title'=>'KAFU Disability Support Bursary 2026/2027','reference'=>'KAFU/BURS/001/2026','department'=>'Student Affairs Division','summary'=>'KAFU offers bursary support to students living with disabilities who demonstrate financial need. Covers tuition reduction, accommodation support, and access to specialised study resources.','publish_date'=>'2026-03-01','deadline'=>'2026-05-31','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents_count'=>1],
        ['id'=>15,'slug'=>'equity-bursary-kafu-burs-002-2026','category'=>'scholarship','type'=>'Scholarship','title'=>'Government Equity Bursary — HELB/NGEC Link 2026/2027','reference'=>'KAFU/BURS/002/2026','department'=>'Student Affairs Division','summary'=>'KAFU, in partnership with HELB and NGEC, invites applications from financially needy students from marginalised communities for the 2026/2027 Equity Bursary Fund.','publish_date'=>'2026-03-10','deadline'=>'2026-04-30','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents_count'=>2],
        ['id'=>16,'slug'=>'supply-furniture-kafu-proc-005-2025','category'=>'tender','type'=>'Tender','title'=>'Supply and Delivery of Office Furniture and Fittings','reference'=>'KAFU/PROC/005/2025','department'=>'Procurement & Supply Chain','summary'=>'Supply of executive office furniture, workstations, chairs, and filing systems for the administration block.','publish_date'=>'2025-11-15','deadline'=>'2025-12-31','deadline_time'=>'17:00','status'=>'closed','featured'=>false,'documents_count'=>1],
        ['id'=>17,'slug'=>'lecturer-business-admin-kafu-hr-005-2025','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Lecturer — Business Administration','reference'=>'KAFU/HR/005/2025','department'=>'School of Business and Economics (SBE)','summary'=>'Applications for the position of Lecturer in Business Administration. Position has since been filled.','publish_date'=>'2026-01-10','deadline'=>'2026-02-28','deadline_time'=>'17:00','status'=>'closed','featured'=>false,'documents_count'=>1],
    ];

    // Merge: CMS opportunities first, static ones not in CMS after
    $all = array_values(array_filter($all, fn($o) => !isset($cmsSlugSet[$o['slug']])));
    $all = array_merge($cmsItems, $all);

    $category = $request->query('category');
    $status = $request->query('status');
    $search = $request->query('search');

    $filtered = $all;
    if ($category && $category !== 'all') {
        $filtered = array_values(array_filter($filtered, fn($o) => $o['category'] === $category));
    }
    if ($status) {
        $filtered = array_values(array_filter($filtered, fn($o) => $o['status'] === $status));
    }
    if ($search) {
        $filtered = array_values(array_filter($filtered, function($o) use ($search) {
            return stripos($o['title'], $search) !== false || stripos($o['summary'], $search) !== false || stripos($o['reference'] ?? '', $search) !== false || stripos($o['department'], $search) !== false;
        }));
    }

    return response()->json(['data' => $filtered]);
});

Route::get('/opportunities/{slug}', function (string $slug) {
    // Check CMS first
    $cmsItem = CmsContent::where('type', 'opportunity')
        ->where('slug', $slug)
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->first();
    if ($cmsItem) {
        return response()->json(['data' => mapCmsOpportunityDetail($cmsItem)]);
    }

    $details = [
        'supply-laboratory-equipment-kafu-proc-001-2026' => ['id'=>1,'slug'=>'supply-laboratory-equipment-kafu-proc-001-2026','category'=>'tender','type'=>'Tender','title'=>'Supply of Laboratory Equipment and Consumables','reference'=>'KAFU/PROC/001/2026','department'=>'Procurement & Supply Chain','summary'=>'KAFU invites sealed bids from qualified and registered suppliers for the supply and delivery of laboratory equipment and consumables for the Schools of Science and Health Sciences.','description'=>"Kaimosi Friends University (KAFU) wishes to procure laboratory equipment and consumables for use in the Schools of Science (SOS) and Health Sciences (SHS). Items include general laboratory glassware, chemicals, microscopes, centrifuges, autoclaves, optometry instruments, and clinical diagnostic equipment. Suppliers must be registered with the AGPO and have a valid business permit. Interested bidders may collect tender documents from the Procurement Office at the Main Campus during business hours.",'requirements'=>['Valid business registration certificate','Tax compliance certificate from KRA','AGPO registration certificate (where applicable)','Certificate of Incorporation or business permit','Audited accounts for the last two financial years','Evidence of supply of similar equipment (at least 3 LPOs)','Filled tender document duly signed'],'submission_info'=>'Sealed tenders in plain envelopes marked "KAFU/PROC/001/2026 — Laboratory Equipment" must be deposited in the Tender Box at the Procurement Office, Main Administration Block, Kaimosi Campus, by the deadline date and time. Tenders received after the deadline will not be accepted.','contact'=>['office'=>'Procurement & Supply Chain Department','email'=>'procurement@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'Main Administration Block, Kaimosi Campus'],'publish_date'=>'2026-03-17','deadline'=>'2026-04-30','deadline_time'=>'17:00','status'=>'open','featured'=>true,'documents'=>[['title'=>'Tender Document — Supply of Lab Equipment (KAFU/PROC/001/2026)','type'=>'PDF','size'=>'1.2 MB','url'=>'#'],['title'=>'Schedule of Requirements — Lab Consumables','type'=>'PDF','size'=>'348 KB','url'=>'#']]],
        'provision-security-services-kafu-proc-002-2026' => ['id'=>2,'slug'=>'provision-security-services-kafu-proc-002-2026','category'=>'tender','type'=>'Tender','title'=>'Provision of Security Guard Services','reference'=>'KAFU/PROC/002/2026','department'=>'Procurement & Supply Chain','summary'=>'KAFU invites tenders from licensed security firms for the provision of professional security guard services across all university campuses and facilities.','description'=>'Kaimosi Friends University invites proposals from registered and licensed security companies to provide manned security guard services at the main campus and satellite facilities. Services required include day and night guarding, access control, patrol, and incident reporting. The contract period is one year, renewable subject to satisfactory performance.','requirements'=>['Private Security Regulatory Authority (PSRA) license — valid','Certificate of Registration of Company/Business','KRA Tax Compliance Certificate','Minimum 3 years of experience providing security to educational institutions','Evidence of at least two similar contracts in educational or institutional settings','Bonded and insured against third-party liability','NSSF and NHIF compliance certificates'],'submission_info'=>'Sealed bids in plain envelopes clearly marked "KAFU/PROC/002/2026 — Security Services" must be deposited in the Tender Box at the Procurement Office by 8 April 2026 at 12:00 noon. Late submissions will be disqualified.','contact'=>['office'=>'Procurement & Supply Chain Department','email'=>'procurement@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'Main Administration Block, Kaimosi Campus'],'publish_date'=>'2026-03-20','deadline'=>'2026-04-08','deadline_time'=>'12:00','status'=>'closing-soon','featured'=>false,'documents'=>[['title'=>'Tender Document — Security Services (KAFU/PROC/002/2026)','type'=>'PDF','size'=>'980 KB','url'=>'#']]],
        'supply-ict-equipment-kafu-proc-003-2026' => ['id'=>3,'slug'=>'supply-ict-equipment-kafu-proc-003-2026','category'=>'tender','type'=>'Tender','title'=>'Supply and Delivery of ICT Equipment and Accessories','reference'=>'KAFU/PROC/003/2026','department'=>'Information and Communication Technology','summary'=>'Kaimosi Friends University invites sealed bids for the supply, delivery, and installation of ICT equipment including computers, servers, networking hardware, and peripherals.','description'=>'KAFU is seeking to procure ICT equipment to support academic and administrative operations. The procurement includes desktop computers, laptops, servers, network switches, routers, UPS systems, projectors, and related peripherals. Suppliers must demonstrate capacity to deliver, install, and provide post-delivery warranty and support.','requirements'=>['Valid business registration and KRA PIN','Tax compliance certificate','Authorized dealer certificate from manufacturer(s) for key equipment','Evidence of similar ICT supply contracts (minimum 3)','Technical specifications of proposed equipment (must meet or exceed specs in tender document)','After-sales service and warranty commitment letter'],'submission_info'=>'Completed tender documents to be deposited in the Tender Box at Procurement Office, Kaimosi Campus by 9 May 2026 at 17:00. Tenders must be sealed and marked "KAFU/PROC/003/2026 — ICT Equipment".','contact'=>['office'=>'ICT Department / Procurement','email'=>'ict@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'ICT Centre, Kaimosi Campus'],'publish_date'=>'2026-03-25','deadline'=>'2026-05-09','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents'=>[['title'=>'Tender Document — ICT Equipment 2026 (KAFU/PROC/003/2026)','type'=>'PDF','size'=>'1.4 MB','url'=>'#'],['title'=>'Technical Specifications — ICT Equipment Schedule','type'=>'PDF','size'=>'620 KB','url'=>'#']]],
        'construction-student-centre-kafu-proc-004-2026' => ['id'=>4,'slug'=>'construction-student-centre-kafu-proc-004-2026','category'=>'tender','type'=>'Tender','title'=>'Construction of Student Centre — Phase 2','reference'=>'KAFU/PROC/004/2026','department'=>'Estates & Facilities Management','summary'=>'KAFU invites bids from eligible NCA-registered contractors for the construction of the second phase of the university student centre.','description'=>'Kaimosi Friends University invites competitive bids from qualified and NCA-registered contractors for the civil and building works for Phase 2 of the Student Centre. Works include construction of a multi-purpose hall (capacity 600), student lounge areas, commercial units, and associated external works. A mandatory site visit will be held before bid submission.','requirements'=>['NCA Category NCA 3 or above registration','Valid NCA practicing certificate','KRA Tax Compliance Certificate','Evidence of similar works of comparable value','Certified copies of registration with NSSF, NHIF','Site visit attendance confirmation'],'submission_info'=>'Sealed bids in plain envelopes marked "KAFU/PROC/004/2026 — Student Centre Phase 2" to be submitted to the Procurement Office by 30 May 2026 at 17:00. Site visit: 20 April 2026 at 10:00 AM, assemble at the Estates Office.','contact'=>['office'=>'Estates & Facilities Management','email'=>'estates@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'Estates Office, Kaimosi Campus'],'publish_date'=>'2026-04-01','deadline'=>'2026-05-30','deadline_time'=>'17:00','status'=>'open','featured'=>true,'documents'=>[['title'=>'Tender Document — Student Centre Phase 2 (KAFU/PROC/004/2026)','type'=>'PDF','size'=>'2.1 MB','url'=>'#'],['title'=>'Architectural Drawings — Student Centre Phase 2','type'=>'PDF','size'=>'4.5 MB','url'=>'#'],['title'=>'Bills of Quantities — Student Centre Phase 2','type'=>'PDF','size'=>'1.8 MB','url'=>'#']]],
        'lecturer-computer-science-kafu-hr-001-2026' => ['id'=>5,'slug'=>'lecturer-computer-science-kafu-hr-001-2026','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Lecturer — Computer Science','reference'=>'KAFU/HR/001/2026','department'=>'School of Computing and Information Technology (SCIT)','summary'=>'Applications are invited from suitably qualified candidates for the position of Lecturer in Computer Science, specialising in AI, Software Engineering, or Data Science.','description'=>'The School of Computing and Information Technology (SCIT) at Kaimosi Friends University invites applications for the position of Lecturer in Computer Science. The successful candidate will teach undergraduate and postgraduate courses, supervise student research projects, conduct independent research, and contribute to departmental development.','requirements'=>["PhD in Computer Science or related field (holders of a Master's with demonstrable progression towards PhD will be considered)",'Minimum Grade B+ in KCSE or equivalent','At least 3 years\' teaching experience at university level','Demonstrable research output (publications in peer-reviewed journals preferred)','Strong written and oral communication skills in English','Registration with relevant professional body (e.g. IEEE, ACM) is an advantage'],'submission_info'=>"Applications including a cover letter, detailed CV, copies of academic and professional certificates, and names of three referees (with full contact details) should be sent to the Human Resources Office by email or hard copy by 25 April 2026. Only shortlisted candidates will be contacted.",'contact'=>['office'=>'Human Resources Division','email'=>'hr@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'HR Office, Administration Block, Kaimosi Campus'],'publish_date'=>'2026-03-18','deadline'=>'2026-04-25','deadline_time'=>'17:00','status'=>'open','featured'=>true,'documents'=>[['title'=>'Job Description — Lecturer, Computer Science (KAFU/HR/001/2026)','type'=>'PDF','size'=>'420 KB','url'=>'#']]],
        'lecturer-nursing-kafu-hr-002-2026' => ['id'=>6,'slug'=>'lecturer-nursing-kafu-hr-002-2026','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Lecturer — Nursing','reference'=>'KAFU/HR/002/2026','department'=>'School of Health Sciences (SHS)','summary'=>'The School of Health Sciences invites applications from registered nurses with postgraduate qualifications for the position of Lecturer in Nursing.','description'=>"KAFU School of Health Sciences invites applications from Registered Nurses and Midwives with a minimum of a Master's degree in Nursing or related clinical field. The Lecturer will teach undergraduate BSN students, coordinate clinical placements, supervise research projects, and participate in community health outreach.",'requirements'=>["Master's degree in Nursing, Midwifery, or related clinical field (PhD preferred)",'Active registration with the Nursing Council of Kenya (NCK)','Minimum 3 years\' clinical nursing experience','Teaching experience at diploma or degree level preferred','Good academic writing and communication skills'],'submission_info'=>'Send applications to hr@kafu.ac.ke with subject "KAFU/HR/002/2026 — Lecturer Nursing" by 8 April 2026 at 17:00.','contact'=>['office'=>'Human Resources Division','email'=>'hr@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'HR Office, Kaimosi Campus'],'publish_date'=>'2026-03-22','deadline'=>'2026-04-08','deadline_time'=>'17:00','status'=>'closing-soon','featured'=>false,'documents'=>[['title'=>'Job Description — Lecturer, Nursing (KAFU/HR/002/2026)','type'=>'PDF','size'=>'385 KB','url'=>'#']]],
        'finance-officer-kafu-hr-003-2026' => ['id'=>7,'slug'=>'finance-officer-kafu-hr-003-2026','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Finance Officer','reference'=>'KAFU/HR/003/2026','department'=>'Finance Department','summary'=>'KAFU seeks a Finance Officer to support financial reporting, budget monitoring, and compliance with public finance management regulations.','description'=>'The Finance Officer will be responsible for day-to-day financial operations including accounts payable and receivable, bank reconciliations, budget tracking, preparation of management accounts, and compliance with PFMA and donor reporting requirements.','requirements'=>['CPA(K) finalist or fully qualified','Bachelor\'s degree in Commerce, Finance, or Accounting','Minimum 3 years\' relevant experience in a public sector or university environment','Proficiency in accounting software (SAGE, QuickBooks, or similar)','Knowledge of IPSAS and IFRS','High level of integrity and attention to detail'],'submission_info'=>'Applications with CV, certificates, and three referees to hr@kafu.ac.ke, subject: "KAFU/HR/003/2026 — Finance Officer". Deadline: 28 April 2026.','contact'=>['office'=>'Human Resources Division','email'=>'hr@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'HR Office, Kaimosi Campus'],'publish_date'=>'2026-03-28','deadline'=>'2026-04-28','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents'=>[['title'=>'Job Description — Finance Officer (KAFU/HR/003/2026)','type'=>'PDF','size'=>'360 KB','url'=>'#']]],
        'registrar-academics-kafu-hr-004-2026' => ['id'=>8,'slug'=>'registrar-academics-kafu-hr-004-2026','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Deputy Registrar (Academics)','reference'=>'KAFU/HR/004/2026','department'=>'Academic Registry','summary'=>'Applications are invited for the position of Deputy Registrar (Academics) to support examinations management, student records, and academic programme coordination.','description'=>'The Deputy Registrar (Academics) will provide leadership in academic records management, examination administration, senate secretariat support, student progression monitoring, and regulatory compliance with CUE and accreditation bodies.','requirements'=>["Master's degree in Administration, Education Management, or related field",'Minimum 5 years\' experience in university registry or academic administration','Thorough understanding of Kenya university regulations and CUE requirements','Strong communication, organisational, and IT skills','High level of integrity and professionalism'],'submission_info'=>'Applications to hr@kafu.ac.ke, subject: "KAFU/HR/004/2026 — Deputy Registrar (Academics)". Deadline: 2 May 2026.','contact'=>['office'=>'Human Resources Division','email'=>'hr@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'HR Office, Kaimosi Campus'],'publish_date'=>'2026-04-01','deadline'=>'2026-05-02','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents'=>[['title'=>'Job Description — Deputy Registrar, Academics (KAFU/HR/004/2026)','type'=>'PDF','size'=>'400 KB','url'=>'#']]],
        'ict-internship-programme-kafu-intern-001-2026' => ['id'=>9,'slug'=>'ict-internship-programme-kafu-intern-001-2026','category'=>'internship','type'=>'Internship','title'=>'ICT Internship Programme — 2026','reference'=>'KAFU/INTERN/001/2026','department'=>'Information and Communication Technology','summary'=>'KAFU offers an ICT internship opportunity for final-year undergraduate students or recent graduates in Computer Science or IT.','description'=>'The KAFU ICT Department offers a structured internship programme for outstanding students and recent graduates. Interns will rotate across network administration, systems support, software maintenance, and digital services. Successful interns receive a certificate of completion and may be considered for future employment.','requirements'=>['Final-year undergraduate student or graduate (within 12 months) in Computer Science, IT, or related field','Minimum upper second class honours GPA (or equivalent)','Introductory letter from university/college','Evidence of relevant coursework or projects','Availability for full-time attachment (minimum 3 months)'],'submission_info'=>'Applications to ict@kafu.ac.ke, subject "KAFU/INTERN/001/2026 — ICT Internship". Include CV, academic transcript, and an introduction letter from your institution.','contact'=>['office'=>'ICT Department','email'=>'ict@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'ICT Centre, Kaimosi Campus'],'publish_date'=>'2026-03-10','deadline'=>'2026-04-15','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents'=>[['title'=>'ICT Internship Programme Details (KAFU/INTERN/001/2026)','type'=>'PDF','size'=>'295 KB','url'=>'#']]],
        'research-assistantship-sos-kafu-intern-002-2026' => ['id'=>10,'slug'=>'research-assistantship-sos-kafu-intern-002-2026','category'=>'internship','type'=>'Internship','title'=>'Research Assistantship — School of Science','reference'=>'KAFU/INTERN/002/2026','department'=>'School of Science (SOS)','summary'=>'The School of Science invites applications from postgraduate students for research assistantships in Molecular Biology, Environmental Chemistry, and Applied Physics.','description'=>'Positions are available for postgraduate students to serve as Research Assistants in active research projects within the School of Science. Research Assistants will assist with data collection, laboratory experiments, analysis, and report writing under the supervision of academic staff.','requirements'=>['Registered postgraduate student (MSc or PhD) in a relevant science field','Strong laboratory skills and relevant subject knowledge','Introductory letter from supervisor','Brief statement of research interest (300 words max)'],'submission_info'=>'Email to dean.sos@kafu.ac.ke, subject "KAFU/INTERN/002/2026 — Research Assistantship". Deadline: 30 April 2026.','contact'=>['office'=>'School of Science (SOS)','email'=>'dean.sos@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>"SOS Dean's Office, Kaimosi Campus"],'publish_date'=>'2026-03-20','deadline'=>'2026-04-30','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents'=>[['title'=>'Research Assistantship Call — SOS (KAFU/INTERN/002/2026)','type'=>'PDF','size'=>'280 KB','url'=>'#']]],
        'internal-research-grants-kafu-call-001-2026' => ['id'=>11,'slug'=>'internal-research-grants-kafu-call-001-2026','category'=>'call','type'=>'Call for Applications','title'=>'Internal Research Grants — 2026/2027 Cycle','reference'=>'KAFU/CALL/001/2026','department'=>'Directorate of Research, Innovation & Outreach','summary'=>"KAFU invites academic staff to submit proposals for the 2026/2027 Internal Research Grant cycle, aligned with the university's strategic research themes.",'description'=>"The Directorate of Research, Innovation and Outreach announces the 2026/2027 internal research grant competition open to all permanent and probationary academic staff. Individual grants of up to KES 500,000 and collaborative grants of up to KES 1.2 million are available. Research must align with at least one of KAFU's strategic research themes: Health and Life Sciences, Education and Social Development, Technology and Innovation, Environmental Sustainability, or Business and Economic Development.",'requirements'=>['Full-time academic staff member at KAFU','Completed research proposal using the prescribed form','Endorsement from Head of Department and Dean','Ethics clearance letter where human or animal subjects are involved','Budget narrative and justification'],'submission_info'=>'Submit completed proposals electronically to research@kafu.ac.ke and a hard copy to the Directorate of Research by 30 April 2026. Proposals must use the prescribed template available for download.','contact'=>['office'=>'Directorate of Research, Innovation & Outreach','email'=>'research@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'Research Directorate, Administration Block, Kaimosi Campus'],'publish_date'=>'2026-03-15','deadline'=>'2026-04-30','deadline_time'=>'17:00','status'=>'open','featured'=>true,'documents'=>[['title'=>'Internal Research Grants Call Document 2026/2027','type'=>'PDF','size'=>'560 KB','url'=>'#'],['title'=>'Research Proposal Template (KAFU/CALL/001/2026)','type'=>'DOCX','size'=>'220 KB','url'=>'#']]],
        'industry-partnership-call-kafu-call-002-2026' => ['id'=>12,'slug'=>'industry-partnership-call-kafu-call-002-2026','category'=>'call','type'=>'Call for Applications','title'=>'Call for Industry and Academic Partnership Proposals','reference'=>'KAFU/CALL/002/2026','department'=>'Office of the Vice-Chancellor','summary'=>'KAFU welcomes proposals from industry partners, research institutions, NGOs, and government agencies for collaborative partnerships in research, training, and technology transfer.','description'=>"KAFU is seeking to deepen its engagement with industry, government, civil society, and research institutions. The university welcomes proposals for collaboration in research and publication, student placement and mentorship, curriculum co-design, community engagement programmes, and technology transfer. Proposals may be submitted by organisations registered and operating in Kenya and regionally.",'requirements'=>['Registered organisation with valid certificate of incorporation or equivalent','Concept note (max 5 pages) describing the proposed partnership','Contact details of a designated partnership coordinator','Proposed timeline and resource commitment'],'submission_info'=>'Submit concept notes to partnerships@kafu.ac.ke with subject "KAFU/CALL/002/2026 — Partnership Proposal". Deadline: 31 May 2026.','contact'=>['office'=>"Office of the Vice-Chancellor — Partnerships",'email'=>'partnerships@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>"VC's Office, Kaimosi Campus"],'publish_date'=>'2026-04-01','deadline'=>'2026-05-31','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents'=>[['title'=>'Partnership Call — Guidelines and Concept Note Template (KAFU/CALL/002/2026)','type'=>'PDF','size'=>'415 KB','url'=>'#']]],
        'notice-academic-calendar-amendment-2026' => ['id'=>13,'slug'=>'notice-academic-calendar-amendment-2026','category'=>'notice','type'=>'Notice','title'=>'Notice: Amendment to 2025/2026 Academic Calendar','reference'=>'KAFU/NOT/001/2026','department'=>'Academic Registry','summary'=>'All students and staff are notified of an amendment to the 2025/2026 academic calendar. Supplementary examination dates have been revised.','description'=>"The Academic Registrar wishes to notify all students, academic staff, and stakeholders that the 2025/2026 Academic Calendar has been amended. Supplementary and special examinations, which were previously scheduled for April 2026, have been rescheduled to the dates contained in the attached amended calendar. All other academic dates remain unchanged. Students are advised to liaise with their respective Heads of Department for any additional guidance.",'requirements'=>[],'submission_info'=>'This is a public notice. No action required from the public. Students and staff should take note of the revised examination dates.','contact'=>['office'=>'Academic Registry','email'=>'registrar@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'Academic Registry, Administration Block'],'publish_date'=>'2026-03-28','deadline'=>null,'deadline_time'=>null,'status'=>'open','featured'=>false,'documents'=>[['title'=>'Amended Academic Calendar 2025/2026','type'=>'PDF','size'=>'185 KB','url'=>'#']]],
        'disability-support-bursary-kafu-burs-001-2026' => ['id'=>14,'slug'=>'disability-support-bursary-kafu-burs-001-2026','category'=>'scholarship','type'=>'Scholarship','title'=>'KAFU Disability Support Bursary 2026/2027','reference'=>'KAFU/BURS/001/2026','department'=>'Student Affairs Division','summary'=>'KAFU offers bursary support to students living with disabilities who demonstrate financial need.','description'=>"Kaimosi Friends University, in line with its commitment to inclusive education and access, offers a Disability Support Bursary for registered students living with disabilities who demonstrate financial need. The bursary covers partial tuition fee waiver (up to 50%), accommodation subsidy, and access to specialised study materials and assistive technology.",'requirements'=>['Registered student of KAFU (must be enrolled for 2026/2027 academic year)','Certified disability documentation from a recognised medical or government institution','Demonstrated financial need (means test form required)','Recommendation letter from Student Welfare Office','Minimum CGPA of 2.0 (or equivalent)','Statement of need (max 500 words)'],'submission_info'=>'Applications to be submitted to the Student Affairs Office with all supporting documents by 31 May 2026. Forms available at the Student Affairs Office and for download below.','contact'=>['office'=>'Student Affairs Division','email'=>'studentaffairs@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'Student Centre, Kaimosi Campus'],'publish_date'=>'2026-03-01','deadline'=>'2026-05-31','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents'=>[['title'=>'Disability Support Bursary Application Form (KAFU/BURS/001/2026)','type'=>'PDF','size'=>'230 KB','url'=>'#']]],
        'equity-bursary-kafu-burs-002-2026' => ['id'=>15,'slug'=>'equity-bursary-kafu-burs-002-2026','category'=>'scholarship','type'=>'Scholarship','title'=>'Government Equity Bursary — HELB/NGEC Link 2026/2027','reference'=>'KAFU/BURS/002/2026','department'=>'Student Affairs Division','summary'=>'KAFU, in partnership with HELB and NGEC, invites applications from financially needy students from marginalised communities for the 2026/2027 Equity Bursary Fund.','description'=>'In partnership with the Higher Education Loans Board (HELB) and the National Gender and Equality Commission (NGEC), KAFU is making available equity bursaries for academically deserving students from marginalised communities including students from ASALs, youth with disabilities, and students from historically underserved counties.','requirements'=>['Registered KAFU student for 2026/2027 academic year','HELB loan application confirmation (where applicable)','Proof of originating from a designated marginalised community (Sub-County Officer letter)','Academic transcript with minimum CGPA of 2.0','Financial needs declaration','Completed KAFU/BURS/002 form'],'submission_info'=>'Applications to Student Affairs Office or by email to studentaffairs@kafu.ac.ke, subject "KAFU/BURS/002/2026 — Equity Bursary". Deadline: 30 April 2026.','contact'=>['office'=>'Student Affairs Division','email'=>'studentaffairs@kafu.ac.ke','phone'=>'+254 777 373 633','location'=>'Student Centre, Kaimosi Campus'],'publish_date'=>'2026-03-10','deadline'=>'2026-04-30','deadline_time'=>'17:00','status'=>'open','featured'=>false,'documents'=>[['title'=>'Equity Bursary Application Form (KAFU/BURS/002/2026)','type'=>'PDF','size'=>'260 KB','url'=>'#'],['title'=>'Marginalised Communities Criteria Guide','type'=>'PDF','size'=>'190 KB','url'=>'#']]],
    ];

    if (!isset($details[$slug])) {
        return response()->json(['error' => 'Opportunity not found'], 404);
    }

    return response()->json(['data' => $details[$slug]]);
});

Route::get('/staff', function (Request $request) {
    $school      = $request->query('school');
    $designation = $request->query('designation');
    $search      = $request->query('search');

    $cmsQuery = CmsContent::where('type', 'staff_profile')
        ->where('status', 'published')
        ->where('is_deleted', false);
    if ($school) $cmsQuery->where('school_code', strtoupper($school));
    $cmsStaff = $cmsQuery->orderBy('title')->get();

    if ($cmsStaff->isNotEmpty()) {
        $mapped = $cmsStaff->map(fn($s) => mapCmsStaff($s))->toArray();
        if ($designation) {
            $mapped = array_values(array_filter($mapped, fn($s) => stripos($s['designation'], $designation) !== false));
        }
        if ($search) {
            $mapped = array_values(array_filter($mapped, function ($s) use ($search) {
                return stripos($s['name'], $search) !== false
                    || stripos($s['designation'], $search) !== false
                    || stripos($s['department'], $search) !== false
                    || !empty(array_filter($s['specializations'] ?? [], fn($sp) => stripos($sp, $search) !== false));
            }));
        }
        return response()->json(['data' => $mapped]);
    }

    // Static fallback
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
    $cmsProfile = CmsContent::where('type', 'staff_profile')
        ->where('slug', $slug)
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->first();
    if ($cmsProfile) {
        return response()->json(['data' => mapCmsStaffDetail($cmsProfile)]);
    }

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
    $page = CmsContent::where('type', 'page')->where('slug', 'admissions')
        ->where('status', 'published')->where('is_deleted', false)->first();
    if ($page && !empty($page->structured_data)) {
        return response()->json(['data' => $page->structured_data]);
    }
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
    $page = CmsContent::where('type', 'page')->where('slug', 'stats')
        ->where('status', 'published')->where('is_deleted', false)->first();
    if ($page && !empty($page->structured_data)) {
        return response()->json(['data' => $page->structured_data]);
    }
    return response()->json([
        'data' => [
            ['label' => 'Schools', 'value' => 5],
            ['label' => 'Academic Programmes', 'value' => 38],
            ['label' => 'Years of Excellence', 'value' => 11],
            ['label' => 'Counties Reached', 'value' => 47],
        ],
    ]);
});
