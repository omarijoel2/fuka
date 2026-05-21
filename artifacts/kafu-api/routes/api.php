<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\CmsContent;

if (!function_exists('mapCmsNews')) {
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
}

if (!function_exists('mapCmsNewsDetail')) {
function mapCmsNewsDetail(CmsContent $item): array {
    $base = mapCmsNews($item);
    $base['content'] = $item->body ?? '<p>Content is being prepared. Please check back shortly.</p>';
    $base['related'] = $item->related_ids ?? [];
    return $base;
}
}

if (!function_exists('mapCmsEvent')) {
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
}

if (!function_exists('mapCmsEventDetail')) {
function mapCmsEventDetail(CmsContent $item): array {
    $base = mapCmsEvent($item);
    $base['full_description'] = $item->body ?? $item->summary ?? '';
    return $base;
}
}

if (!function_exists('mapCmsAnnouncement')) {
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
}

if (!function_exists('mapCmsAnnouncementDetail')) {
function mapCmsAnnouncementDetail(CmsContent $item): array {
    $base = mapCmsAnnouncement($item);
    $sd = $item->structured_data ?? [];
    $base['content']     = $item->body ?? '<p>Full content is being prepared.</p>';
    $base['attachments'] = $sd['attachments'] ?? [];
    return $base;
}
}

if (!function_exists('mapCmsOpportunity')) {
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
}

if (!function_exists('mapCmsStaff')) {
function mapCmsStaff(CmsContent $item): array {
    $sd = $item->structured_data ?? [];
    return [
        'slug'            => $item->slug,
        'title'           => $sd['title_prefix'] ?? 'Dr.',
        'name'            => $item->title,
        'first_name'      => $sd['first_name'] ?? '',
        'middle_name'     => $sd['middle_name'] ?? '',
        'last_name'       => $sd['last_name'] ?? '',
        'rank'            => $sd['rank'] ?? null,
        'designation'     => $sd['designation'] ?? ($item->category ?? ''),
        'school'          => $item->school_code ?: null,
        'department'      => $item->department ?? '',
        'unit'            => $sd['unit'] ?? null,
        'email'           => $sd['email'] ?? '',
        'specializations' => $sd['specializations'] ?? [],
        'photo'           => $item->featured_image ?: ($sd['photo'] ?? null),
        'bio'             => $item->summary ?? '',
        'orcid_id'        => $sd['orcid_id'] ?? null,
        'google_scholar_url' => $sd['google_scholar_url'] ?? null,
    ];
}
}

if (!function_exists('mapCmsStaffDetail')) {
function mapCmsStaffDetail(CmsContent $item): array {
    $base = mapCmsStaff($item);
    $sd = $item->structured_data ?? [];
    $base['rank']              = $sd['rank'] ?? null;
    $base['biography']         = $item->body ?? $item->summary ?? '';
    $base['phone_visible']     = (bool)($sd['phone_visible'] ?? false);
    $base['orcid_id']          = $sd['orcid_id'] ?? null;
    $base['google_scholar_url']= $sd['google_scholar_url'] ?? null;
    $base['scopus_id']         = $sd['scopus_id'] ?? null;
    $base['linkedin_url']      = $sd['linkedin_url'] ?? null;
    $base['cv_url']            = $sd['cv_url'] ?? null;
    $base['qualifications']    = $sd['qualifications'] ?? [];
    $base['research_interests']= $sd['research_interests'] ?? [];
    $base['teaching_areas']    = $sd['teaching_areas'] ?? [];
    $base['courses_taught']    = $sd['courses_taught'] ?? [];
    $base['experience']        = $sd['experience'] ?? [];
    $base['publications']      = $sd['publications'] ?? [];
    $base['grants']            = $sd['grants'] ?? [];
    $base['supervision']       = $sd['supervision'] ?? ['masters_count' => 0, 'phd_count' => 0, 'current_students' => []];
    $base['awards']            = $sd['awards'] ?? [];
    $base['memberships']       = $sd['memberships'] ?? [];
    // Auto-link repository publications by last name
    $lastName = trim($base['last_name'] ?? '');
    if ($lastName) {
        $repoPubs = \App\Models\RepositoryItem::published()
            ->where(function($q) use ($lastName) {
                $q->where('authors', 'like', '%' . $lastName . '%');
            })
            ->orderBy('year', 'desc')
            ->take(10)
            ->get(['id','slug','title','type','year','journal_name','doi','citation_count','access'])
            ->map(fn($p) => [
                'id' => $p->id, 'slug' => $p->slug, 'title' => $p->title,
                'type' => $p->type, 'year' => $p->year,
                'journal_name' => $p->journal_name, 'doi' => $p->doi,
                'citation_count' => $p->citation_count, 'access' => $p->access,
            ])->toArray();
        $base['repo_publications'] = $repoPubs;
    } else {
        $base['repo_publications'] = [];
    }
    // Profile completeness scoring
    $fields = [$base['biography'], $base['qualifications'], $base['research_interests'],
               $base['experience'], $base['orcid_id'], $base['google_scholar_url'],
               $base['teaching_areas'], $base['publications']];
    $filled = count(array_filter($fields, fn($v) => !empty($v)));
    $base['profile_completeness'] = (int)round(($filled / count($fields)) * 100);
    return $base;
}
}

if (!function_exists('mapCmsSchool')) {
function mapCmsSchool(CmsContent $item): array {
    $sd = $item->structured_data ?? [];
    return [
        'code'             => strtoupper($item->slug),
        'name'             => $item->title,
        'dean'             => $sd['dean'] ?? null,
        'dean_title'       => $sd['dean_title'] ?? null,
        'dean_photo'       => $sd['dean_photo'] ?? null,
        'description'      => $item->summary ?? '',
        'vision'           => $sd['vision'] ?? '',
        'mission'          => $sd['mission'] ?? '',
        'programmes_count' => $sd['programmes_count'] ?? ['undergraduate' => 0, 'postgraduate' => 0, 'doctoral' => 0],
        'colour'           => $sd['colour'] ?? '#1B3A6B',
        'programmes'       => $sd['programmes'] ?? [],
    ];
}
}

if (!function_exists('mapCmsProgramme')) {
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
}

if (!function_exists('mapCmsOpportunityDetail')) {
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
}

Route::get('/healthz', function () {
    return response()->json(['status' => 'ok', 'service' => 'KAFU API']);
});

// ── Public site-config (read-only) ────────────────────────────────────────────
Route::get('/site-config/{group}', function (string $group) {
    $allowed = ['homepage', 'about', 'contact', 'site', 'seo', 'navigation', 'student-services'];
    if (!in_array($group, $allowed)) {
        return response()->json(['error' => 'Config group not found.'], 404);
    }
    $config = \App\Models\SiteConfig::getGroup($group);
    return response()->json(['group' => $group, 'data' => $config]);
});

Route::get('/about', function () {
    $data = \App\Models\SiteConfig::getGroup('about');
    return response()->json(['data' => $data]);
});

Route::get('/student-services', function () {
    $data = \App\Models\SiteConfig::getGroup('student-services');
    return response()->json(['data' => $data]);
});

// ── Governance: Council, Management, Directorates ─────────────────────────────
Route::get('/council', function () {
    $members = \App\Models\CouncilMember::where('is_active', true)
        ->orderBy('position_order')
        ->get();
    return response()->json(['data' => $members]);
});

Route::get('/management', function () {
    $profiles = \App\Models\ManagementProfile::where('is_active', true)
        ->orderBy('position_order')
        ->get();
    return response()->json(['data' => $profiles]);
});

Route::get('/directorates', function () {
    $directorates = \App\Models\Directorate::where('is_active', true)
        ->orderBy('position_order')
        ->get(['id', 'name', 'slug', 'tagline', 'description', 'director_name', 'director_title', 'position_order']);
    return response()->json(['data' => $directorates]);
});

Route::get('/directorates/{slug}', function (string $slug) {
    $directorate = \App\Models\Directorate::where('slug', $slug)
        ->where('is_active', true)
        ->first();
    if (!$directorate) {
        return response()->json(['error' => 'Directorate not found.'], 404);
    }
    return response()->json(['data' => $directorate]);
});

// ── Gallery ──────────────────────────────────────────────────────────────────
Route::get('/gallery/albums', function () {
    $albums = \App\Models\GalleryAlbum::where('is_published', true)
        ->orderBy('sort_order')
        ->orderBy('album_date', 'desc')
        ->withCount(['items as photo_count' => fn($q) => $q->where('type', 'image')->where('is_published', true)])
        ->withCount(['items as video_count' => fn($q) => $q->where('type', 'video')->where('is_published', true)])
        ->get();
    return response()->json(['data' => $albums]);
});

Route::get('/gallery/albums/{slug}', function (string $slug) {
    $album = \App\Models\GalleryAlbum::where('slug', $slug)
        ->where('is_published', true)
        ->with(['items' => fn($q) => $q->where('is_published', true)->orderBy('sort_order')])
        ->first();
    if (!$album) {
        return response()->json(['error' => 'Album not found.'], 404);
    }
    return response()->json(['data' => $album]);
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
                'dean' => 'Dr. Nabeta K.N. Sangili',
                'dean_title' => 'Dean, School of Education & Social Sciences',
                'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/Dr.-Sangili-Dean-Sess.jpg',
                'description' => 'At the School of Education and Social Sciences (SESS) at Kaimosi Friends University, academic excellence meets innovation, leadership and transformative learning. The School is dedicated to shaping the next generation of educators, researchers, policy influencers, scholars and change-makers equipped to make meaningful impact in Kenya, across Africa and the global community.',
                'programmes_count' => ['undergraduate' => 7, 'postgraduate' => 7, 'doctoral' => 2],
                'colour' => '#1B3A6B',
            ],
            [
                'code' => 'SBE',
                'name' => 'School of Business & Economics',
                'dean' => 'Dr. Atieno Margaret Omondi',
                'dean_title' => 'Dean, School of Business & Economics',
                'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/Dr.-Margaret-Atieno-1-300x300.jpg',
                'description' => 'In the school of business and economics, we empower students to become transformative leaders and responsible professionals, equipped with the knowledge, skills, and ethical foundation to succeed in a rapidly changing world. Through cutting-edge research, collaborative partnerships, and community engagement, we advance knowledge and practice in business and economics, shaping a more sustainable and equitable society.',
                'programmes_count' => ['undergraduate' => 3, 'postgraduate' => 2, 'doctoral' => 1],
                'colour' => '#D4A017',
            ],
            [
                'code' => 'SCIT',
                'name' => 'School of Computing and Information Technology',
                'dean' => 'Prof. Kelvin K. Omieno',
                'dean_title' => 'Dean, School of Computing & IT',
                'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/Prof.-Omieno-1.jpg',
                'description' => 'Nestled in the tranquil and green environment of Western Kenya, the School of Computing and Information Technology (SCIT) at Kaimosi Friends University offers an ideal learning environment for aspiring tech professionals. SCIT is a hub of academic excellence and innovation where students are trained to become solution-oriented ICT experts capable of transforming the digital economy locally and globally.',
                'programmes_count' => ['undergraduate' => 2, 'postgraduate' => 1, 'doctoral' => 0],
                'colour' => '#2D6A4F',
            ],
            [
                'code' => 'SOS',
                'name' => 'School of Science',
                'dean' => 'Dr. Annette O. Busula',
                'dean_title' => 'Dean, School of Science',
                'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/Dr.-Busula-300x300.jpg',
                'description' => 'Welcome to the School of Science (SOSCI) at Kaimosi Friends University, a vibrant community dedicated to fostering excellence in education, research, and innovation. We offer top-tier undergraduate and postgraduate programmes in Biology, Physics, Mathematics, Chemistry, and related sciences.',
                'programmes_count' => ['undergraduate' => 7, 'postgraduate' => 4, 'doctoral' => 0],
                'colour' => '#3A5A8C',
            ],
            [
                'code' => 'SHS',
                'name' => 'School of Health Sciences',
                'dean' => 'Dr. Cyprian Mabonga',
                'dean_title' => 'Dean, School of Health Sciences',
                'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/Dr.-Mabonga.jpg',
                'description' => 'Established in 2022, the School of Health Sciences (SoHS) at Kaimosi Friends University has quickly become a flagship institution in Western Kenya, distinguished by its unique and high-demand programs. It is one of only two institutions in Kenya offering Optometry up to the PhD level, alongside robust offerings in Nursing and Clinical Medicine.',
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
            'dean' => 'Dr. Nabeta K.N. Sangili',
            'dean_title' => 'Dean, School of Education & Social Sciences',
            'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/Dr.-Sangili-Dean-Sess.jpg',
            'description' => 'At the School of Education and Social Sciences (SESS) at Kaimosi Friends University, academic excellence meets innovation, leadership and transformative learning. The School is dedicated to shaping the next generation of educators, researchers, policy influencers, scholars and change-makers equipped to make meaningful impact in Kenya, across Africa and the global community. SESS offers a diverse range of competitive undergraduate and postgraduate programmes carefully designed to provide students with cutting-edge knowledge, practical competencies, research skills and critical thinking abilities.',
            'vision' => 'To be a center of excellence in the training of education and social science professionals who contribute positively to societal transformation.',
            'mission' => 'To provide quality education, foster innovative research, and promote community engagement through responsive curricula, collaborative scholarship, and ethical practice.',
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
            'name' => 'School of Business & Economics',
            'dean' => 'Dr. Atieno Margaret Omondi',
            'dean_title' => 'Dean, School of Business & Economics',
            'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/Dr.-Margaret-Atieno-1-300x300.jpg',
            'description' => 'In the school of business and economics, we empower students to become transformative leaders and responsible professionals, equipped with the knowledge, skills, and ethical foundation to succeed in a rapidly changing world. Through cutting-edge research, collaborative partnerships, and community engagement, we advance knowledge and practice in business and economics, shaping a more sustainable and equitable society.',
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
            'dean_title' => 'Dean, School of Computing & IT',
            'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/Prof.-Omieno-1.jpg',
            'description' => 'Nestled in the tranquil and green environment of Western Kenya, the School of Computing and Information Technology (SCIT) at Kaimosi Friends University offers an ideal learning environment for aspiring tech professionals. SCIT is a hub of academic excellence and innovation where students are trained to become solution-oriented ICT experts capable of transforming the digital economy locally and globally. Our programs are designed in line with global trends and national priorities in ICT, delivered through an optimal mix of theory, practice, and industry engagement.',
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
            'dean_title' => 'Dean, School of Science',
            'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/Dr.-Busula-300x300.jpg',
            'description' => 'Welcome to the School of Science (SOSCI) at Kaimosi Friends University, a vibrant community dedicated to fostering excellence in education, research, and innovation. As a school, we are fully committed to providing a nurturing and inclusive environment where students can thrive academically, intellectually and professionally. We offer top-tier undergraduate and postgraduate programmes in Biology, Physics, Mathematics, Chemistry, and related sciences, equipping graduates to excel in research, industry, and beyond.',
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
            'dean' => 'Dr. Cyprian Mabonga',
            'dean_title' => 'Dean, School of Health Sciences',
            'dean_photo' => 'https://kafu.ac.ke/wp-content/uploads/Dr.-Mabonga.jpg',
            'description' => 'Established in 2022, the School of Health Sciences (SoHS) at Kaimosi Friends University has quickly become a flagship institution in Western Kenya, distinguished by its unique and high-demand programs. It is one of only two institutions in Kenya offering Optometry up to the PhD level, alongside robust offerings in Nursing and Clinical Medicine. Plans are underway to introduce programmes in Pharmacy, Oral Health, and Basic Medical Sciences.',
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
        ['id'=>17,'slug'=>'lecturer-business-admin-kafu-hr-005-2025','category'=>'vacancy','type'=>'Job Vacancy','title'=>'Lecturer — Business Administration','reference'=>'KAFU/HR/005/2025','department'=>'School of Business & Economics (SBE)','summary'=>'Applications for the position of Lecturer in Business Administration. Position has since been filled.','publish_date'=>'2026-01-10','deadline'=>'2026-02-28','deadline_time'=>'17:00','status'=>'closed','featured'=>false,'documents_count'=>1],
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

        // SBE — School of Business & Economics
        [
            'slug' => 'dr-atieno-margaret-omondi',
            'title' => 'Dr.',
            'first_name' => 'Atieno',
            'middle_name' => 'Margaret',
            'last_name' => 'Omondi',
            'name' => 'Dr. Atieno Margaret Omondi',
            'designation' => 'Dean, School of Business & Economics',
            'school' => 'SBE',
            'department' => 'Business Administration',
            'unit' => null,
            'email' => 'dean.sbe@kafu.ac.ke',
            'specializations' => ['Strategic Management', 'Entrepreneurship', 'SME Development'],
            'photo' => null,
            'bio' => 'Dr. Omondi leads the School of Business & Economics with a focus on entrepreneurship education and SME capacity building. Her research examines the growth constraints of women-owned enterprises in Kenya.',
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
            'photo' => 'https://kafu.ac.ke/wp-content/uploads/Prof.-Omieno-1.jpg',
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

    $school      = $request->query('school');
    $designation = $request->query('designation');
    $rank        = $request->query('rank');
    $search      = $request->query('search');

    if ($school) {
        $staff = array_values(array_filter($staff, fn($s) => $s['school'] === strtoupper($school)));
    }
    if ($designation) {
        $staff = array_values(array_filter($staff, function($s) use ($designation) {
            return stripos($s['designation'], $designation) !== false;
        }));
    }
    if ($rank) {
        $staff = array_values(array_filter($staff, function($s) use ($rank) {
            return stripos($s['designation'] ?? '', $rank) !== false
                || stripos($s['rank'] ?? '', $rank) !== false;
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

    // Overlay photos from users table (portal-uploaded photos) by matching email
    $emailToPhoto = \Illuminate\Support\Facades\DB::table('users')
        ->whereNotNull('avatar_url')
        ->pluck('avatar_url', 'email')
        ->toArray();
    if (!empty($emailToPhoto)) {
        $staff = array_map(function ($s) use ($emailToPhoto) {
            $email = $s['email'] ?? null;
            if ($email && isset($emailToPhoto[$email]) && !$s['photo']) {
                $s['photo'] = $emailToPhoto[$email];
            }
            return $s;
        }, $staff);
    }

    return response()->json(['data' => $staff]);
});

// ── Staff Portal API routes ────────────────────────────────────────
// Registered here (before the /staff/{slug} wildcard) so the specific
// portal paths (/staff/login, /staff/me, etc.) are matched first.
Route::prefix('staff')->group(function () {
    Route::post('/login',   [\App\Http\Controllers\StaffAuthController::class,    'login']);
    Route::post('/password/reset-request', [\App\Http\Controllers\StaffAuthController::class, 'resetRequest']);
    Route::post('/password/reset',         [\App\Http\Controllers\StaffAuthController::class, 'resetConfirm']);
});
Route::prefix('staff')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/me',                         [\App\Http\Controllers\StaffAuthController::class,    'me']);
    Route::post('/logout',                    [\App\Http\Controllers\StaffAuthController::class,    'logout']);
    Route::post('/password/change',           [\App\Http\Controllers\StaffAuthController::class,    'changePassword']);
    Route::get('/profile',                    [\App\Http\Controllers\StaffProfileController::class, 'getProfile']);
    Route::put('/profile/section/{section}',  [\App\Http\Controllers\StaffProfileController::class, 'updateSection']);
    Route::post('/profile/submit',            [\App\Http\Controllers\StaffProfileController::class, 'submit']);
    Route::post('/profile/withdraw',          [\App\Http\Controllers\StaffProfileController::class, 'withdraw']);
    Route::get('/profile/submissions',        [\App\Http\Controllers\StaffProfileController::class, 'getSubmissions']);
    Route::post('/upload-photo',              [\App\Http\Controllers\StaffProfileController::class, 'uploadPhoto']);
    Route::post('/upload-cv',                 [\App\Http\Controllers\StaffProfileController::class, 'uploadCv']);
    Route::post('/cv-extract',                [\App\Http\Controllers\StaffProfileController::class, 'extractCv']);
    Route::post('/consent/accept',            [\App\Http\Controllers\StaffProfileController::class, 'acceptConsent']);
});
Route::prefix('reviewer')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/queue',                                [\App\Http\Controllers\ReviewerController::class,    'queue']);
    Route::get('/submissions/{id}',                     [\App\Http\Controllers\ReviewerController::class,    'show']);
    Route::post('/submissions/{id}/review',             [\App\Http\Controllers\ReviewerController::class,    'review']);
    Route::post('/submissions/{id}/approve',            [\App\Http\Controllers\ReviewerController::class,    'approve']);
    Route::post('/submissions/{id}/request-revision',   [\App\Http\Controllers\ReviewerController::class,    'requestRevision']);
    Route::post('/submissions/{id}/reject',             [\App\Http\Controllers\ReviewerController::class,    'reject']);
    Route::post('/submissions/{id}/comments',           [\App\Http\Controllers\ReviewerController::class,    'addComment']);
});
Route::prefix('admin/staff-accounts')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/',                     [\App\Http\Controllers\AdminStaffController::class, 'index']);
    Route::post('/',                    [\App\Http\Controllers\AdminStaffController::class, 'provision']);
    Route::get('/security-events',      [\App\Http\Controllers\AdminStaffController::class, 'securityEvents']);
    Route::get('/{id}',                 [\App\Http\Controllers\AdminStaffController::class, 'show']);
    Route::put('/{id}',                 [\App\Http\Controllers\AdminStaffController::class, 'update']);
    Route::post('/{id}/lock',           [\App\Http\Controllers\AdminStaffController::class, 'lock']);
    Route::post('/{id}/unlock',         [\App\Http\Controllers\AdminStaffController::class, 'unlock']);
    Route::post('/{id}/deactivate',     [\App\Http\Controllers\AdminStaffController::class, 'deactivate']);
    Route::post('/{id}/reset-password', [\App\Http\Controllers\AdminStaffController::class, 'resetPassword']);
});
// ──────────────────────────────────────────────────────────────────

Route::get('/staff/{slug}', function (string $slug) {
    $cmsProfile = CmsContent::where('type', 'staff_profile')
        ->where('slug', $slug)
        ->where('status', 'published')
        ->where('is_deleted', false)
        ->first();
    // Academic enrichment data — overrides CMS or static when present
    $academicEnrichment = [
        'prof-kelvin-k-omieno' => [
            'rank' => 'Professor',
            'orcid_id' => '0000-0002-7834-5120',
            'google_scholar_url' => 'https://scholar.google.com/citations?user=omieno_kafu',
            'scopus_id' => '57218934765',
            'courses_taught' => [
                ['code' => 'CS401', 'name' => 'Artificial Intelligence', 'programme' => 'BSc CS', 'level' => 'undergraduate'],
                ['code' => 'CS402', 'name' => 'Machine Learning', 'programme' => 'BSc CS', 'level' => 'undergraduate'],
                ['code' => 'MSC601', 'name' => 'Advanced Machine Learning', 'programme' => 'MSc IT', 'level' => 'postgraduate'],
                ['code' => 'CS301', 'name' => 'Algorithm Design and Analysis', 'programme' => 'BSc CS', 'level' => 'undergraduate'],
            ],
            'supervision' => [
                'masters_count' => 7, 'phd_count' => 2,
                'current_students' => [
                    ['name' => 'Mwangi, James K.', 'topic' => 'Deep Learning Models for Early Crop Disease Detection in Smallholder Farms', 'level' => 'MSc', 'year' => '2024'],
                    ['name' => 'Achieng, Sharon M.', 'topic' => 'Federated Learning for Privacy-Preserving Health Data Analysis in Kenya', 'level' => 'MSc', 'year' => '2024'],
                    ['name' => 'Mwenda, Dennis O.', 'topic' => 'Explainable AI for Malaria Diagnosis in Resource-Constrained Settings', 'level' => 'PhD', 'year' => '2023'],
                ],
            ],
            'grants' => [
                ['title' => 'AI-Powered Crop Disease Early Warning System for Western Kenya', 'funder' => 'National Research Fund (NRF)', 'amount' => 'KES 4.2 million', 'start' => '2023', 'end' => '2025', 'role' => 'Principal Investigator', 'status' => 'active'],
                ['title' => 'Machine Learning for Malaria Surveillance in Lake Victoria Basin', 'funder' => 'African Academy of Sciences (AAS)', 'amount' => 'USD 85,000', 'start' => '2021', 'end' => '2023', 'role' => 'Principal Investigator', 'status' => 'completed'],
            ],
        ],
        'dr-annette-o-busula' => [
            'rank' => 'Associate Professor',
            'orcid_id' => '0000-0001-9234-6721',
            'google_scholar_url' => 'https://scholar.google.com/citations?user=busula_kafu',
            'courses_taught' => [
                ['code' => 'BIO401', 'name' => 'Molecular Biology', 'programme' => 'BSc Biology', 'level' => 'undergraduate'],
                ['code' => 'BIO302', 'name' => 'Parasitology', 'programme' => 'BSc Biology', 'level' => 'undergraduate'],
                ['code' => 'BIO501', 'name' => 'Advanced Molecular Techniques', 'programme' => 'MSc Biology', 'level' => 'postgraduate'],
            ],
            'supervision' => [
                'masters_count' => 5, 'phd_count' => 1,
                'current_students' => [
                    ['name' => 'Ouma, Collins T.', 'topic' => 'Molecular Epidemiology of Artemisinin-Resistant P. falciparum in Western Kenya', 'level' => 'MSc', 'year' => '2024'],
                    ['name' => 'Nasambu, Cynthia A.', 'topic' => 'Point-of-Care Diagnostics for Malaria in Remote Health Facilities', 'level' => 'PhD', 'year' => '2022'],
                ],
            ],
            'grants' => [
                ['title' => 'Molecular Surveillance of Drug-Resistant Malaria in Western Kenya', 'funder' => 'Wellcome Trust (Sub-award via KEMRI)', 'amount' => 'USD 120,000', 'start' => '2022', 'end' => '2025', 'role' => 'Principal Investigator', 'status' => 'active'],
                ['title' => 'One Health Approaches to Infectious Disease Surveillance at KAFU', 'funder' => 'KAFU Internal Research Grant', 'amount' => 'KES 2.8 million', 'start' => '2023', 'end' => '2024', 'role' => 'Principal Investigator', 'status' => 'completed'],
            ],
        ],
        'prof-winnie-awino' => [
            'rank' => 'Professor',
            'orcid_id' => '0000-0003-4521-8812',
            'google_scholar_url' => 'https://scholar.google.com/citations?user=awino_kafu',
            'courses_taught' => [
                ['code' => 'OPT301', 'name' => 'Low Vision Rehabilitation', 'programme' => 'BSc Optometry', 'level' => 'undergraduate'],
                ['code' => 'OPT401', 'name' => 'Community Eye Health', 'programme' => 'BSc Optometry', 'level' => 'undergraduate'],
            ],
            'supervision' => ['masters_count' => 4, 'phd_count' => 1, 'current_students' => []],
            'grants' => [
                ['title' => 'Low Vision Prevalence and Rehabilitation Needs in Vihiga County', 'funder' => 'KAFU Internal Research Fund', 'amount' => 'KES 1.8 million', 'start' => '2024', 'end' => '2025', 'role' => 'Principal Investigator', 'status' => 'active'],
            ],
        ],
        'prof-peter-n-mwita' => [
            'rank' => 'Professor',
            'orcid_id' => '0000-0002-1234-5678',
            'google_scholar_url' => 'https://scholar.google.com/citations?user=mwita_kafu',
            'supervision' => ['masters_count' => 12, 'phd_count' => 3, 'current_students' => []],
            'grants' => [],
        ],
    ];

    if ($cmsProfile) {
        $data = mapCmsStaffDetail($cmsProfile);
        // Merge academic enrichment for known profiles
        if (isset($academicEnrichment[$slug])) {
            foreach ($academicEnrichment[$slug] as $k => $v) {
                if (empty($data[$k])) $data[$k] = $v;
            }
        }
        // Recompute completeness
        $fields = [$data['biography'], $data['qualifications'], $data['research_interests'],
                   $data['experience'], $data['orcid_id'], $data['google_scholar_url'],
                   $data['teaching_areas'], $data['publications']];
        $filled = count(array_filter($fields, fn($v2) => !empty($v2)));
        $data['profile_completeness'] = (int)round(($filled / count($fields)) * 100);
        return response()->json(['data' => $data]);
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
            'photo' => 'https://kafu.ac.ke/wp-content/uploads/Prof.-Omieno-1.jpg',
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
            'rank' => 'Professor',
            'orcid_id' => '0000-0002-7834-5120',
            'google_scholar_url' => 'https://scholar.google.com/citations?user=omieno_kafu',
            'scopus_id' => '57218934765',
            'courses_taught' => [
                ['code' => 'CS401', 'name' => 'Artificial Intelligence', 'programme' => 'BSc CS', 'level' => 'undergraduate'],
                ['code' => 'CS402', 'name' => 'Machine Learning', 'programme' => 'BSc CS', 'level' => 'undergraduate'],
                ['code' => 'MSC601', 'name' => 'Advanced Machine Learning', 'programme' => 'MSc IT', 'level' => 'postgraduate'],
                ['code' => 'CS301', 'name' => 'Algorithm Design and Analysis', 'programme' => 'BSc CS', 'level' => 'undergraduate'],
            ],
            'supervision' => [
                'masters_count' => 7,
                'phd_count' => 2,
                'current_students' => [
                    ['name' => 'Mwangi, James K.', 'topic' => 'Deep Learning Models for Early Crop Disease Detection in Smallholder Farms', 'level' => 'MSc', 'year' => '2024'],
                    ['name' => 'Achieng, Sharon M.', 'topic' => 'Federated Learning for Privacy-Preserving Health Data Analysis in Kenya', 'level' => 'MSc', 'year' => '2024'],
                    ['name' => 'Mwenda, Dennis O.', 'topic' => 'Explainable AI for Malaria Diagnosis in Resource-Constrained Settings', 'level' => 'PhD', 'year' => '2023'],
                ],
            ],
            'grants' => [
                ['title' => 'AI-Powered Crop Disease Early Warning System for Western Kenya', 'funder' => 'National Research Fund (NRF)', 'amount' => 'KES 4.2 million', 'start' => '2023', 'end' => '2025', 'role' => 'Principal Investigator', 'status' => 'active'],
                ['title' => 'Machine Learning for Malaria Surveillance in Lake Victoria Basin', 'funder' => 'African Academy of Sciences (AAS)', 'amount' => 'USD 85,000', 'start' => '2021', 'end' => '2023', 'role' => 'Principal Investigator', 'status' => 'completed'],
            ],
            'awards' => ['Kenya ICT Authority Research Excellence Award 2021', 'KAFU Distinguished Researcher Award 2019'],
            'memberships' => ['Kenya ICT Board Technical Committee', 'IEEE Computer Society', 'Association for Computing Machinery (ACM)', 'African Advanced Institute for Science and Technology'],
        ],
        'dr-atieno-margaret-omondi' => [
            'slug' => 'dr-atieno-margaret-omondi',
            'title' => 'Dr.',
            'name' => 'Dr. Atieno Margaret Omondi',
            'designation' => 'Dean, School of Business & Economics',
            'school' => 'SBE',
            'department' => 'Business Administration',
            'unit' => null,
            'email' => 'dean.sbe@kafu.ac.ke',
            'phone_visible' => false,
            'specializations' => ['Strategic Management', 'Entrepreneurship', 'SME Development'],
            'photo' => null,
            'biography' => 'Dr. Atieno Margaret Omondi is the Dean of the School of Business & Economics. A strategic management scholar with a deep commitment to entrepreneurship education, Dr. Omondi has been instrumental in building SBE into one of the fastest-growing business schools in Western Kenya. Her research examines SME growth constraints, women\'s economic empowerment, and business incubation in emerging economies. She has consulted for government agencies, development organisations, and private sector bodies on entrepreneurship policy and MSME development strategy.',
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
            'rank' => 'Associate Professor',
            'orcid_id' => '0000-0001-9234-6721',
            'google_scholar_url' => 'https://scholar.google.com/citations?user=busula_kafu',
            'courses_taught' => [
                ['code' => 'BIO401', 'name' => 'Molecular Biology', 'programme' => 'BSc Biology', 'level' => 'undergraduate'],
                ['code' => 'BIO302', 'name' => 'Parasitology', 'programme' => 'BSc Biology', 'level' => 'undergraduate'],
                ['code' => 'BIO501', 'name' => 'Advanced Molecular Techniques', 'programme' => 'MSc Biology', 'level' => 'postgraduate'],
            ],
            'supervision' => [
                'masters_count' => 5,
                'phd_count' => 1,
                'current_students' => [
                    ['name' => 'Ouma, Collins T.', 'topic' => 'Molecular Epidemiology of Artemisinin-Resistant P. falciparum in Western Kenya', 'level' => 'MSc', 'year' => '2024'],
                    ['name' => 'Nasambu, Cynthia A.', 'topic' => 'Point-of-Care Diagnostics for Malaria in Remote Health Facilities', 'level' => 'PhD', 'year' => '2022'],
                ],
            ],
            'grants' => [
                ['title' => 'Molecular Surveillance of Drug-Resistant Malaria in Western Kenya', 'funder' => 'Wellcome Trust (Sub-award via KEMRI)', 'amount' => 'USD 120,000', 'start' => '2022', 'end' => '2025', 'role' => 'Principal Investigator', 'status' => 'active'],
                ['title' => 'One Health Approaches to Infectious Disease Surveillance at KAFU', 'funder' => 'KAFU Internal Research Grant', 'amount' => 'KES 2.8 million', 'start' => '2023', 'end' => '2024', 'role' => 'Principal Investigator', 'status' => 'completed'],
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

    // Helper: enrich a static profile with auto-linked repo publications + defaults
    $enrichStaticProfile = function(array $profile) {
        $defaults = [
            'rank' => null, 'orcid_id' => null, 'google_scholar_url' => null,
            'scopus_id' => null, 'linkedin_url' => null, 'cv_url' => null,
            'grants' => [], 'supervision' => ['masters_count' => 0, 'phd_count' => 0, 'current_students' => []],
            'courses_taught' => [], 'repo_publications' => [],
        ];
        $profile = array_merge($defaults, $profile);
        // Auto-link repo publications by last name
        if (!empty($profile['last_name'] ?? '') || preg_match('/\b(\w+)$/', $profile['name'], $m)) {
            $lastName = $profile['last_name'] ?? ($m[1] ?? '');
            if ($lastName && strlen($lastName) > 2) {
                $repoPubs = \App\Models\RepositoryItem::published()
                    ->where('authors', 'like', '%' . $lastName . '%')
                    ->orderBy('year', 'desc')->take(8)
                    ->get(['id','slug','title','type','year','journal_name','doi','citation_count','access'])
                    ->map(fn($p) => ['id'=>$p->id,'slug'=>$p->slug,'title'=>$p->title,'type'=>$p->type,'year'=>$p->year,'journal_name'=>$p->journal_name,'doi'=>$p->doi,'citation_count'=>$p->citation_count,'access'=>$p->access])
                    ->toArray();
                $profile['repo_publications'] = $repoPubs;
            }
        }
        // Profile completeness
        $fields = [$profile['biography'] ?? '', $profile['qualifications'] ?? [], $profile['research_interests'] ?? [],
                   $profile['experience'] ?? [], $profile['orcid_id'], $profile['google_scholar_url'],
                   $profile['teaching_areas'] ?? [], $profile['publications'] ?? []];
        $filled = count(array_filter($fields, fn($v) => !empty($v)));
        $profile['profile_completeness'] = (int)round(($filled / count($fields)) * 100);
        return $profile;
    };

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
            return response()->json(['data' => $enrichStaticProfile($allStaff[$slug])]);
        }
        return response()->json(['error' => 'Staff profile not found'], 404);
    }

    return response()->json(['data' => $enrichStaticProfile($profiles[$slug])]);
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

    // Enhanced intelligence data: learning outcomes, course structure, accreditation, employability, fees
    $extra = [
        'SESS' => [
            'BEd (Arts)' => [
                'learning_outcomes' => ['Design and deliver effective secondary arts lessons using learner-centred pedagogy','Apply interdisciplinary knowledge across English, History, Geography, and modern languages','Use ICT and digital tools to enhance teaching and assessment','Conduct classroom-based research and apply findings to practice','Demonstrate professional ethics in education and community service','Foster inclusive, equitable learning environments'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Communication Skills','Introduction to Education','Foundations of Psychology','History of East Africa','Introduction to Geography','Kiswahili I']],
                    ['year'=>'Year 2','units'=>['Educational Psychology','Curriculum Theory & Design','Literature in English','Historical Research Methods','Physical Geography','French I']],
                    ['year'=>'Year 3','units'=>['Pedagogy & Assessment','Philosophy of Education','Special Needs Education','Teaching Practice I','ICT in Education','Elective I']],
                    ['year'=>'Year 4','units'=>['Educational Administration','Research Methods in Education','Teaching Practice II','Dissertation/Project','Education Policy','Elective II']],
                ],
                'accreditation' => ['body'=>'Teachers Service Commission (TSC) & Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2019],
                'employability_data' => ['job_roles'=>['Secondary School Teacher','Curriculum Developer','Education Officer','School Administrator','NGO Programme Officer'],'industry_sectors'=>['Education','Government','NGOs','Private Schools','International Organisations'],'employment_rate'=>88],
                'fee_structure' => ['tuition_kes_per_year'=>48000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>14000,'total_annual_kes'=>90000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition. Fees shown are for self-sponsored/Module II students.'],
            ],
            'BEd (French)' => [
                'learning_outcomes' => ['Achieve professional proficiency in spoken and written French','Train secondary school students in French language and culture','Translate and interpret between French and English/Kiswahili','Conduct research in applied linguistics and language education','Apply culturally sensitive teaching methodologies','Engage with French-speaking communities and international organisations'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['French I (Oral & Written)','Communication Skills','Introduction to Education','French Phonetics','Kiswahili I','Education Psychology']],
                    ['year'=>'Year 2','units'=>['French II (Advanced Oral)','French Literature I','Curriculum Design','Translation Theory','History of French Culture','ICT in Language Teaching']],
                    ['year'=>'Year 3','units'=>['French III','French Literature II','Pedagogy of Language Teaching','Teaching Practice I','Research Methods','Applied Linguistics']],
                    ['year'=>'Year 4','units'=>['Advanced Translation','French IV','Teaching Practice II','Dissertation/Project','Education Administration','Elective']],
                ],
                'accreditation' => ['body'=>'Teachers Service Commission (TSC) & Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2019],
                'employability_data' => ['job_roles'=>['French Language Teacher','Translator/Interpreter','Cultural Attaché','Language Consultant','Diplomat'],'industry_sectors'=>['Education','Diplomacy','Tourism','International Organisations','Media'],'employment_rate'=>85],
                'fee_structure' => ['tuition_kes_per_year'=>48000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>14000,'total_annual_kes'=>90000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BEd (Science)' => [
                'learning_outcomes' => ['Teach Biology, Chemistry, Physics, and Mathematics at secondary level','Design and conduct safe laboratory practicals and demonstrations','Apply pedagogical content knowledge in science teaching','Use research findings to improve science education outcomes','Prepare students for national and international science assessments','Promote STEM career awareness among secondary school learners'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Introduction to Education','General Chemistry I','General Biology I','Mathematics I','Communication Skills','ICT Fundamentals']],
                    ['year'=>'Year 2','units'=>['Educational Psychology','Curriculum Design','Physics for Education','Chemistry II','Biology II','Laboratory Management']],
                    ['year'=>'Year 3','units'=>['Pedagogy of Science','Special Needs in Science','Teaching Practice I','Research Methods','Environmental Science','Elective']],
                    ['year'=>'Year 4','units'=>['Teaching Practice II','Educational Administration','Dissertation/Project','Assessment & Evaluation','Science Education Policy','Elective']],
                ],
                'accreditation' => ['body'=>'Teachers Service Commission (TSC) & Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2019],
                'employability_data' => ['job_roles'=>['Secondary School Science Teacher','Laboratory Supervisor','Science Education Specialist','Curriculum Designer','STEM Coordinator'],'industry_sectors'=>['Education','Government','NGOs','Research Institutions','International Schools'],'employment_rate'=>90],
                'fee_structure' => ['tuition_kes_per_year'=>48000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>14000,'total_annual_kes'=>90000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BSW' => [
                'learning_outcomes' => ['Apply professional social work values and ethics in diverse contexts','Conduct social work assessments using evidence-based frameworks','Design and implement community development programmes','Advocate for marginalised groups within legal and policy systems','Manage casework in child protection, mental health, and disability settings','Conduct social research and apply findings to policy and practice'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Introduction to Social Work','Sociology I','Psychology I','Communication Skills','Human Rights & Social Justice','Research Foundations']],
                    ['year'=>'Year 2','units'=>['Social Work Practice I','Community Development','Social Policy & Administration','Psychology II','Field Placement I','Social Welfare Systems']],
                    ['year'=>'Year 3','units'=>['Social Work Practice II','Child Protection','Disability Studies','Mental Health Social Work','Field Placement II','Social Research Methods']],
                    ['year'=>'Year 4','units'=>['Advanced Social Work','Gerontology','Field Placement III','Dissertation/Project','NGO Management','Social Work Ethics']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE) & Kenya Association of Social Workers (KASW)','status'=>'Fully Accredited','year'=>2018],
                'employability_data' => ['job_roles'=>['Social Worker','Child Protection Officer','Community Development Officer','Probation Officer','NGO Programme Coordinator','Counsellor'],'industry_sectors'=>['NGOs','Government (Social Services)','INGOs','Healthcare','Community Organisations'],'employment_rate'=>87],
                'fee_structure' => ['tuition_kes_per_year'=>48000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>14000,'total_annual_kes'=>90000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BEd ECD' => [
                'learning_outcomes' => ['Apply child development theories to early childhood educational practice','Design inclusive learning environments for children aged 0–8','Assess developmental milestones and plan appropriate interventions','Engage families and communities in early childhood programmes','Use play-based and creative methodologies in learning','Manage ECD centres and early years programmes effectively'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Introduction to ECD','Child Development I','Communication Skills','Art & Creative Activities','Music & Movement','Health & Nutrition']],
                    ['year'=>'Year 2','units'=>['Child Development II','Curriculum for ECD','Educational Psychology','Inclusive Education','ICT for Young Learners','Family & Community Partnerships']],
                    ['year'=>'Year 3','units'=>['ECD Assessment','Special Needs in Early Years','Teaching Practice I','Research Methods','Language Development','Elective']],
                    ['year'=>'Year 4','units'=>['ECD Programme Management','Teaching Practice II','Dissertation/Project','Policy & Legislation','Child Rights & Protection','Elective']],
                ],
                'accreditation' => ['body'=>'Teachers Service Commission (TSC) & Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2020],
                'employability_data' => ['job_roles'=>['ECD Teacher','Pre-school Head Teacher','Child Development Specialist','NGO Programme Officer','Social Worker (Children)'],'industry_sectors'=>['Education','NGOs','Government','INGOs','Private Nurseries'],'employment_rate'=>86],
                'fee_structure' => ['tuition_kes_per_year'=>48000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>14000,'total_annual_kes'=>90000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BDMID' => [
                'learning_outcomes' => ['Analyse disaster risk reduction frameworks and humanitarian response systems','Apply diplomacy and negotiation skills in international and regional contexts','Coordinate emergency response operations and humanitarian logistics','Design disaster preparedness and resilience plans','Understand international law, treaties, and multilateral institutions','Conduct research in disaster management and international development'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Introduction to Disaster Management','International Relations','Communication Skills','Geography of Hazards','Emergency First Response','Research Methods I']],
                    ['year'=>'Year 2','units'=>['Disaster Risk Reduction','Diplomacy & Protocol','Humanitarian Law','Peace Studies','GIS for Disasters','Research Methods II']],
                    ['year'=>'Year 3','units'=>['Emergency Operations Management','Conflict Resolution','Field Attachment I','Environmental Disaster Management','Foreign Policy Analysis','Elective']],
                    ['year'=>'Year 4','units'=>['Post-Disaster Recovery','International Organisations','Field Attachment II','Dissertation/Project','Climate Change & Disasters','Elective']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2021],
                'employability_data' => ['job_roles'=>['Disaster Risk Manager','Humanitarian Aid Coordinator','Diplomat / Foreign Service Officer','Emergency Response Officer','Policy Analyst','INGO Programme Manager'],'industry_sectors'=>['UN Agencies','INGOs','Government','Red Cross / Red Crescent','County Governments'],'employment_rate'=>84],
                'fee_structure' => ['tuition_kes_per_year'=>50000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>15000,'total_annual_kes'=>93000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BA Criminology' => [
                'learning_outcomes' => ['Explain theories of crime, deviance, and social control','Critically analyse the criminal justice system — police, courts, and corrections','Apply research methods to the study of crime and victimology','Understand criminological policy at local, national, and international levels','Practise ethical standards in criminal justice settings','Design and evaluate crime prevention and community safety programmes'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Introduction to Criminology','Sociology of Crime','Communication Skills','Psychology of Crime','Introduction to Law','Research Methods I']],
                    ['year'=>'Year 2','units'=>['Criminal Justice Systems','Victimology','Corrections & Rehabilitation','Criminal Law','Police Studies','Research Methods II']],
                    ['year'=>'Year 3','units'=>['White Collar Crime','Comparative Criminology','Field Attachment','Organised Crime','Security Studies','Elective']],
                    ['year'=>'Year 4','units'=>['Crime Prevention','Penology','Dissertation/Project','Gender & Crime','Drug Policy','Elective']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2020],
                'employability_data' => ['job_roles'=>['Police Officer (Graduate Entry)','Probation Officer','Criminal Intelligence Analyst','Prison Warden (Graduate)','Policy Analyst','Security Consultant'],'industry_sectors'=>['National Police Service','Prisons Service','Government Ministries','NGOs','Private Security','Research Institutes'],'employment_rate'=>83],
                'fee_structure' => ['tuition_kes_per_year'=>48000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>14000,'total_annual_kes'=>90000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'MA Religion' => [
                'learning_outcomes' => ['Demonstrate advanced knowledge of world religions, theology, and religious ethics','Conduct original research using appropriate theological and social science methodologies','Critically engage with contemporary issues at the intersection of religion and society','Analyse religious texts and traditions in their historical and cultural contexts','Teach religious and theological subjects at tertiary level','Advise on interfaith dialogue and religious policy'],
                'course_structure' => [
                    ['year'=>'Semester 1','units'=>['Advanced Theological Studies','Research Methodology','Philosophy of Religion','African Traditional Religion','Seminar: Religion & Society']],
                    ['year'=>'Semester 2','units'=>['Comparative Religion','Ethics & Moral Theology','Biblical Studies / Quran Studies','Qualitative Research','Seminar: Religion & Politics']],
                    ['year'=>'Semester 3','units'=>['Dissertation Research I','Advanced Elective I','Advanced Elective II','Supervised Independent Study']],
                    ['year'=>'Semester 4','units'=>['Dissertation Research II','Dissertation Submission & Viva','Professional Elective']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2018],
                'employability_data' => ['job_roles'=>['University Lecturer','Theologian','Chaplain / Religious Leader','Religious Programme Coordinator','Interfaith Dialogue Facilitator','Researcher'],'industry_sectors'=>['Higher Education','Faith-Based Organisations','NGOs','Government Chaplaincy','Research Institutes'],'employment_rate'=>80],
                'fee_structure' => ['tuition_kes_per_year'=>72000,'accommodation_kes_per_year'=>30000,'other_costs_kes'=>16000,'total_annual_kes'=>118000,'govt_sponsored_tuition'=>0,'notes'=>'Postgraduate rates apply. Year shown is for coursework component.'],
            ],
            'PhD Religion' => [
                'learning_outcomes' => ['Produce an original, significant contribution to knowledge in religious studies or theology','Demonstrate mastery of advanced research methods in the humanities and social sciences','Engage critically with international scholarly debates in religion and theology','Disseminate findings through peer-reviewed publications and conference presentations','Supervise and mentor junior researchers and postgraduate students','Apply theological and ethical reasoning to contemporary social challenges'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Advanced Research Methods','Doctoral Colloquium I','Research Proposal Development','Literature Review','Ethics in Research']],
                    ['year'=>'Year 2','units'=>['Doctoral Colloquium II','Thesis Research','Data Collection & Analysis','Progress Seminar']],
                    ['year'=>'Year 3','units'=>['Thesis Writing','Doctoral Colloquium III','Publication Workshop','Pre-submission Seminar','Thesis Submission & Viva']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2018],
                'employability_data' => ['job_roles'=>['University Professor','Senior Research Fellow','Head of Department','Theologian','Policy Advisor','Author/Scholar'],'industry_sectors'=>['Higher Education','Research Institutes','Faith Organisations','Government','International Organisations'],'employment_rate'=>92],
                'fee_structure' => ['tuition_kes_per_year'=>90000,'accommodation_kes_per_year'=>30000,'other_costs_kes'=>20000,'total_annual_kes'=>140000,'govt_sponsored_tuition'=>0,'notes'=>'PhD rates. Duration is typically 3–4 years full-time.'],
            ],
        ],
        'SBE' => [
            'BCom' => [
                'learning_outcomes' => ['Apply accounting, finance, and auditing principles to business contexts','Analyse market environments and develop sound marketing strategies','Use quantitative tools for financial analysis and business decision-making','Demonstrate entrepreneurial competencies and business plan development','Apply management theories to real organisational challenges','Understand commercial law, taxation, and corporate governance'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Principles of Accounting','Business Mathematics','Communication Skills','Introduction to Management','Business Law','Microeconomics']],
                    ['year'=>'Year 2','units'=>['Financial Accounting','Cost & Management Accounting','Business Statistics','Macroeconomics','Marketing Management','Entrepreneurship']],
                    ['year'=>'Year 3','units'=>['Financial Management','Taxation','Auditing','Human Resource Management','Business Ethics','Research Methods']],
                    ['year'=>'Year 4','units'=>['Advanced Financial Management','Strategic Management','Dissertation/Project','Corporate Governance','International Business','Elective']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE) & KASNEB (CPA pathway)','status'=>'Fully Accredited','year'=>2017],
                'employability_data' => ['job_roles'=>['Accountant / Auditor','Business Analyst','Marketing Manager','Bank Officer','Financial Analyst','Entrepreneur'],'industry_sectors'=>['Banking & Finance','FMCG','Manufacturing','Government','Consulting','NGOs'],'employment_rate'=>91],
                'fee_structure' => ['tuition_kes_per_year'=>52000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>15000,'total_annual_kes'=>95000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BSc Economics' => [
                'learning_outcomes' => ['Apply microeconomic and macroeconomic theories to real-world policy problems','Use econometric methods to analyse economic data','Evaluate the impact of fiscal and monetary policy at national and global levels','Produce rigorous economic research papers and policy briefs','Model markets, trade, and resource allocation','Contribute to development economics and public finance debates in Kenya and Africa'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Principles of Economics','Mathematics for Economists','Communication Skills','Introduction to Statistics','Sociology','History of Economic Thought']],
                    ['year'=>'Year 2','units'=>['Microeconomics I','Macroeconomics I','Econometrics I','Public Finance','Development Economics','Research Methods I']],
                    ['year'=>'Year 3','units'=>['Microeconomics II','Macroeconomics II','Econometrics II','International Economics','Environmental Economics','Research Methods II']],
                    ['year'=>'Year 4','units'=>['Advanced Econometrics','Policy Analysis','Dissertation/Project','Labour Economics','Monetary Economics','Elective']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2017],
                'employability_data' => ['job_roles'=>['Economist','Policy Analyst','Financial Consultant','Research Officer','Development Planner','Data Analyst'],'industry_sectors'=>['Government Ministries','Central Bank','Multilateral Organisations','NGOs','Banking','Consulting'],'employment_rate'=>89],
                'fee_structure' => ['tuition_kes_per_year'=>52000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>15000,'total_annual_kes'=>95000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'MBA' => [
                'learning_outcomes' => ['Formulate and implement corporate strategies in competitive environments','Apply financial management and investment analysis to enterprise decision-making','Lead and motivate diverse teams using evidence-based management practice','Design marketing strategies responsive to digital and global markets','Demonstrate ethical leadership and corporate social responsibility','Apply entrepreneurial thinking to create and grow sustainable ventures'],
                'course_structure' => [
                    ['year'=>'Semester 1','units'=>['Managerial Economics','Financial Accounting for Managers','Strategic Management','Quantitative Methods for Business','Research Methodology']],
                    ['year'=>'Semester 2','units'=>['Financial Management','Marketing Management','Human Resource Management','Operations Management','Business Ethics & Governance']],
                    ['year'=>'Semester 3','units'=>['Strategic Leadership','Entrepreneurship & Innovation','International Business','Elective I','Elective II']],
                    ['year'=>'Semester 4','units'=>['Management Dissertation / Research Project','Practicum/Consulting Project']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2018],
                'employability_data' => ['job_roles'=>['General Manager','CEO / Director','Strategy Consultant','Corporate Trainer','Entrepreneur','Investment Manager'],'industry_sectors'=>['Banking & Finance','Manufacturing','Consulting','FMCG','Government','Technology'],'employment_rate'=>94],
                'fee_structure' => ['tuition_kes_per_year'=>85000,'accommodation_kes_per_year'=>30000,'other_costs_kes'=>18000,'total_annual_kes'=>133000,'govt_sponsored_tuition'=>0,'notes'=>'MBA can be completed full-time (2 years) or part-time (3 years).'],
            ],
            'PhD Bus. Admin.' => [
                'learning_outcomes' => ['Make an original contribution to knowledge in business administration or management','Apply advanced quantitative and qualitative research methods to business problems','Publish and disseminate research in peer-reviewed academic journals','Teach and supervise postgraduate students in business disciplines','Advise organisations and governments on evidence-based management strategy','Engage critically with emerging global business challenges and trends'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Advanced Research Methods','Doctoral Seminar I','Quantitative Analysis','Qualitative Research in Business','Research Proposal Defense']],
                    ['year'=>'Year 2','units'=>['Doctoral Seminar II','Thesis Research','Data Collection','Academic Writing & Publishing','Progress Review Seminar']],
                    ['year'=>'Year 3','units'=>['Doctoral Seminar III','Thesis Writing','Pre-submission Seminar','Thesis Submission & Viva']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2018],
                'employability_data' => ['job_roles'=>['University Professor','Senior Researcher','Executive Consultant','Chief Strategy Officer','Policy Maker','Author'],'industry_sectors'=>['Higher Education','Research Institutes','Consulting','Government','Multilateral Organisations'],'employment_rate'=>93],
                'fee_structure' => ['tuition_kes_per_year'=>95000,'accommodation_kes_per_year'=>30000,'other_costs_kes'=>20000,'total_annual_kes'=>145000,'govt_sponsored_tuition'=>0,'notes'=>'PhD rates. Typical duration: 3–4 years.'],
            ],
        ],
        'SCIT' => [
            'BSc CS' => [
                'learning_outcomes' => ['Design, develop, and test software systems using industry-standard methodologies','Apply data structures and algorithms to solve computational problems efficiently','Build AI and machine learning models for real-world applications','Design and administer relational and NoSQL databases','Secure networked systems and implement cybersecurity best practices','Work in agile, collaborative software development teams'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Introduction to Programming (Python)','Discrete Mathematics','Computer Architecture','Communication Skills','Web Technologies','Database Fundamentals']],
                    ['year'=>'Year 2','units'=>['Object-Oriented Programming (Java)','Data Structures & Algorithms','Operating Systems','Networking Fundamentals','Database Systems','Software Engineering I']],
                    ['year'=>'Year 3','units'=>['Artificial Intelligence','Machine Learning','Software Engineering II','Cybersecurity','Mobile Application Development','Research Methods']],
                    ['year'=>'Year 4','units'=>['Cloud Computing','Advanced Databases','Capstone Project / Dissertation','Human-Computer Interaction','Entrepreneurship in Tech','Elective']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2016],
                'employability_data' => ['job_roles'=>['Software Developer','Data Scientist','AI Engineer','Database Administrator','Systems Analyst','IT Consultant'],'industry_sectors'=>['Technology Companies','Banking & Finance','Telecommunications','Government','Healthcare','Startups'],'employment_rate'=>95],
                'fee_structure' => ['tuition_kes_per_year'=>55000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>16000,'total_annual_kes'=>99000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BSc IT' => [
                'learning_outcomes' => ['Configure, manage, and troubleshoot enterprise networks and server infrastructure','Implement cybersecurity policies and incident response procedures','Develop web applications and enterprise systems using modern frameworks','Administer cloud platforms including AWS, Azure, and Google Cloud','Apply IT project management methodologies (PRINCE2, PMP)','Support digital transformation initiatives in organisations'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Introduction to IT','Networking Fundamentals','Operating Systems I','Communication Skills','Hardware & Systems','Web Design']],
                    ['year'=>'Year 2','units'=>['Network Administration','Database Administration','Programming for IT','Cybersecurity Fundamentals','Operating Systems II','Systems Analysis']],
                    ['year'=>'Year 3','units'=>['Cloud Computing','Enterprise Systems','IT Project Management','Network Security','Web Development','Research Methods']],
                    ['year'=>'Year 4','units'=>['IT Governance','Capstone Project / Dissertation','Mobile & IoT Systems','Business Intelligence','Elective I','Elective II']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2016],
                'employability_data' => ['job_roles'=>['Network Administrator','Cybersecurity Analyst','Systems Administrator','Web Developer','IT Support Manager','Cloud Engineer'],'industry_sectors'=>['Telecommunications','Banking','Government ICT','Healthcare','NGOs','Startups'],'employment_rate'=>93],
                'fee_structure' => ['tuition_kes_per_year'=>55000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>16000,'total_annual_kes'=>99000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'MSc IT' => [
                'learning_outcomes' => ['Conduct original research in advanced information technology domains','Design and implement cloud-native, scalable, and secure IT architectures','Lead enterprise digital transformation and IT strategy programmes','Apply advanced cybersecurity frameworks to protect organisational systems','Investigate emerging technologies including AI, blockchain, and IoT','Publish research in peer-reviewed IT and computer science journals'],
                'course_structure' => [
                    ['year'=>'Semester 1','units'=>['Advanced Networking','Research Methods in IT','Cloud Architecture','Cybersecurity Management','IT Governance & Policy']],
                    ['year'=>'Semester 2','units'=>['Machine Learning for IT','Advanced Database Systems','Enterprise Architecture','Digital Transformation','Elective I']],
                    ['year'=>'Semester 3','units'=>['Dissertation Research I','Advanced Elective','Seminar: Emerging Technologies']],
                    ['year'=>'Semester 4','units'=>['Dissertation Research II','Thesis Submission & Viva']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2019],
                'employability_data' => ['job_roles'=>['Chief Technology Officer','Senior IT Manager','Cybersecurity Specialist','IT Researcher','Cloud Architect','Digital Transformation Lead'],'industry_sectors'=>['Technology','Banking & Finance','Government','Telecommunications','Healthcare','Consulting'],'employment_rate'=>96],
                'fee_structure' => ['tuition_kes_per_year'=>80000,'accommodation_kes_per_year'=>30000,'other_costs_kes'=>18000,'total_annual_kes'=>128000,'govt_sponsored_tuition'=>0,'notes'=>'Can be completed full-time (2 years) or part-time (3 years).'],
            ],
        ],
        'SOS' => [
            'BSc Physics' => [
                'learning_outcomes' => ['Apply classical and modern physics principles to analyse natural phenomena','Conduct precise experiments and interpret data using statistical methods','Use computational and numerical methods in physical modelling','Apply physics in practical contexts including electronics and renewable energy','Communicate complex scientific concepts clearly in written and oral formats','Prepare for postgraduate study or professional careers in physics-related fields'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Classical Mechanics','Mathematical Methods I','General Chemistry','Introduction to Computing','Communication Skills','Laboratory Physics I']],
                    ['year'=>'Year 2','units'=>['Electricity & Magnetism','Mathematical Methods II','Thermal Physics','Optics','Electronics I','Laboratory Physics II']],
                    ['year'=>'Year 3','units'=>['Quantum Mechanics','Statistical Mechanics','Solid State Physics','Electronics II','Nuclear Physics','Research Methods']],
                    ['year'=>'Year 4','units'=>['Advanced Quantum Mechanics','Computational Physics','Dissertation/Project','Elective I (Renewable Energy / Geophysics)','Elective II','Laboratory Physics IV']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2017],
                'employability_data' => ['job_roles'=>['Physicist','Geophysicist','Science Teacher (Secondary/Tertiary)','Research Scientist','Lab Technician','Renewable Energy Engineer'],'industry_sectors'=>['Education','Research Institutes','Energy Sector','Telecommunications','Mining & Exploration','Government'],'employment_rate'=>82],
                'fee_structure' => ['tuition_kes_per_year'=>52000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>15000,'total_annual_kes'=>95000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BSc Chemistry' => [
                'learning_outcomes' => ['Apply organic, inorganic, physical, and analytical chemistry principles','Conduct advanced laboratory experiments safely and with precision','Analyse chemical data using modern instrumentation and software','Apply chemical knowledge to pharmaceutical, industrial, and environmental contexts','Practise safe laboratory management and chemical waste handling','Conduct and present independent research in chemistry'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['General Chemistry I','Mathematics for Scientists','Communication Skills','Laboratory Chemistry I','Physical Chemistry I','Introduction to Computing']],
                    ['year'=>'Year 2','units'=>['Organic Chemistry I','Inorganic Chemistry I','Physical Chemistry II','Analytical Chemistry I','Laboratory Chemistry II','Research Methods I']],
                    ['year'=>'Year 3','units'=>['Organic Chemistry II','Inorganic Chemistry II','Biochemistry','Analytical Chemistry II','Industrial Chemistry','Research Methods II']],
                    ['year'=>'Year 4','units'=>['Advanced Organic Chemistry','Polymer Chemistry','Dissertation/Project','Environmental Chemistry','Pharmaceutical Chemistry','Laboratory Chemistry IV']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE) & Kenya Chemical Society','status'=>'Fully Accredited','year'=>2017],
                'employability_data' => ['job_roles'=>['Chemist','Laboratory Analyst','Pharmaceutical Technologist','Quality Assurance Officer','Science Teacher','Environmental Consultant'],'industry_sectors'=>['Pharmaceutical','Food & Beverage','Manufacturing','Water Treatment','Education','Research'],'employment_rate'=>86],
                'fee_structure' => ['tuition_kes_per_year'=>52000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>15000,'total_annual_kes'=>95000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BSc Biology' => [
                'learning_outcomes' => ['Explain biological processes at cellular, organism, and ecosystem levels','Apply ecological and environmental science methods in field research','Conduct experiments in genetics, microbiology, and physiology','Analyse biological data using appropriate statistical software','Apply biological knowledge to health, agriculture, and conservation','Communicate findings effectively through scientific writing and presentation'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Cell Biology & Genetics I','Botany I','Zoology I','Chemistry for Biologists','Communication Skills','Laboratory Biology I']],
                    ['year'=>'Year 2','units'=>['Microbiology','Ecology','Genetics II','Physiology I','Biochemistry','Laboratory Biology II']],
                    ['year'=>'Year 3','units'=>['Molecular Biology','Environmental Biology','Immunology','Plant Pathology','Research Methods','Field Ecology']],
                    ['year'=>'Year 4','units'=>['Conservation Biology','Biotechnology','Dissertation/Project','Applied Microbiology','Parasitology','Elective']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2017],
                'employability_data' => ['job_roles'=>['Biologist','Ecologist','Lab Scientist','Public Health Officer','Science Teacher','Environmental Consultant'],'industry_sectors'=>['Healthcare','Research Institutes','Environmental Agencies','NGOs','Agriculture','Education'],'employment_rate'=>85],
                'fee_structure' => ['tuition_kes_per_year'=>52000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>15000,'total_annual_kes'=>95000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
            'BSc Agric. Econ.' => [
                'learning_outcomes' => ['Apply microeconomic and macroeconomic theory to agricultural markets','Analyse food production systems and value chains using quantitative methods','Evaluate agricultural policies and their impact on food security and rural livelihoods','Design and appraise agribusiness projects and investment plans','Apply GIS and remote sensing to land use and resource management','Conduct research in agricultural economics and rural development'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Introduction to Agriculture','Principles of Economics','Communication Skills','Mathematics for Agric. Economists','Soil Science','Laboratory Agric. I']],
                    ['year'=>'Year 2','units'=>['Microeconomics','Agricultural Production Economics','Farm Management','Statistics for Agriculture','Rural Development','Research Methods I']],
                    ['year'=>'Year 3','units'=>['Agricultural Policy','Agribusiness Management','Agricultural Finance','GIS & Remote Sensing','Food Security Studies','Research Methods II']],
                    ['year'=>'Year 4','units'=>['Project Appraisal','International Agricultural Trade','Dissertation/Project','Environmental Economics','Value Chain Analysis','Elective']],
                ],
                'accreditation' => ['body'=>'Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2018],
                'employability_data' => ['job_roles'=>['Agricultural Economist','Agribusiness Manager','Food Security Analyst','Rural Development Officer','Policy Advisor','Project Manager'],'industry_sectors'=>['Agriculture','Government (Ministry of Agriculture)','NGOs','World Bank / UN FAO','Commercial Farming','Research'],'employment_rate'=>87],
                'fee_structure' => ['tuition_kes_per_year'=>52000,'accommodation_kes_per_year'=>28000,'other_costs_kes'=>15000,'total_annual_kes'=>95000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition.'],
            ],
        ],
        'SHS' => [
            'BOptom' => [
                'learning_outcomes' => ['Diagnose and manage a wide range of ocular and systemic conditions affecting vision','Prescribe optical and therapeutic interventions including contact lenses','Conduct community eye health outreach, screening, and rehabilitation programmes','Apply low vision assessment and assistive technology for visually impaired clients','Interpret ophthalmic investigations including visual fields and OCT','Contribute to eye health policy and research in sub-Saharan Africa'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Anatomy & Physiology I','Optics I','Chemistry for Health Sciences','Communication Skills','Introduction to Optometry','Clinical Skills I']],
                    ['year'=>'Year 2','units'=>['Ocular Anatomy & Physiology','Optics II','Refraction I','Ocular Disease I','Pharmacology I','Clinical Skills II']],
                    ['year'=>'Year 3','units'=>['Refraction II','Contact Lens Practice I','Ocular Disease II','Binocular Vision','Paediatric Optometry','Clinical Placement I']],
                    ['year'=>'Year 4','units'=>['Low Vision Rehabilitation','Contact Lens Practice II','Ocular Pathology','Community Eye Health','Research Methods','Clinical Placement II']],
                    ['year'=>'Year 5','units'=>['Advanced Clinical Practice','Dissertation/Research Project','Optometry Jurisprudence','Clinical Placement III','Elective']],
                ],
                'accreditation' => ['body'=>'Kenya Optometric Association (KOA) & Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2015],
                'employability_data' => ['job_roles'=>['Optometrist','Vision Scientist','Eye Clinic Director','Community Eye Health Officer','Low Vision Specialist','Academic Researcher'],'industry_sectors'=>['Healthcare','Hospitals & Eye Clinics','NGOs','Research Institutes','Ministry of Health','International Eye Health Organisations'],'employment_rate'=>97],
                'fee_structure' => ['tuition_kes_per_year'=>75000,'accommodation_kes_per_year'=>30000,'other_costs_kes'=>22000,'total_annual_kes'=>127000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition. 5-year programme. Clinical fees included.'],
            ],
            'BSN' => [
                'learning_outcomes' => ['Apply the nursing process to assess, plan, implement, and evaluate patient care','Practise evidence-based nursing in medical, surgical, paediatric, and community settings','Demonstrate competency in midwifery and reproductive health care','Apply critical care and emergency nursing protocols','Engage in community health promotion, education, and disease prevention','Uphold professional nursing ethics and the Nursing Code of Conduct'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Anatomy & Physiology','Foundations of Nursing','Chemistry for Health Sciences','Communication Skills','Microbiology','Nursing Ethics']],
                    ['year'=>'Year 2','units'=>['Medical-Surgical Nursing I','Pharmacology','Paediatric Nursing','Community Health Nursing I','Nutrition & Dietetics','Clinical Placement I']],
                    ['year'=>'Year 3','units'=>['Medical-Surgical Nursing II','Midwifery & Reproductive Health','Psychiatric Nursing','Community Health Nursing II','Research Methods','Clinical Placement II']],
                    ['year'=>'Year 4','units'=>['Critical Care Nursing','Nursing Management & Leadership','Nursing Research Project','Community Placement','Elective (Oncology / Renal)','Clinical Placement III']],
                ],
                'accreditation' => ['body'=>'Nursing Council of Kenya (NCK) & Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2016],
                'employability_data' => ['job_roles'=>['Registered Nurse','Midwife','ICU/Critical Care Nurse','Community Health Nurse','Nurse Manager','Public Health Officer'],'industry_sectors'=>['Public Hospitals','Private Hospitals & Clinics','NGOs','Ministry of Health','Community Health Centres','International Health Organisations'],'employment_rate'=>98],
                'fee_structure' => ['tuition_kes_per_year'=>70000,'accommodation_kes_per_year'=>30000,'other_costs_kes'=>20000,'total_annual_kes'=>120000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition. Clinical placement fees included.'],
            ],
            'BSc Clinical Med.' => [
                'learning_outcomes' => ['Diagnose and manage common and complex medical conditions at clinical officer level','Apply clinical reasoning in medical, surgical, paediatric, obstetric, and psychiatric settings','Prescribe medications within the scope of Clinical Officer practice','Conduct community health assessments and design health promotion interventions','Apply research evidence to clinical decision-making and protocols','Uphold medical ethics, patient rights, and professional standards'],
                'course_structure' => [
                    ['year'=>'Year 1','units'=>['Human Anatomy','Physiology','Biochemistry','Communication Skills','Introduction to Clinical Medicine','Clinical Skills I']],
                    ['year'=>'Year 2','units'=>['Pathology','Pharmacology I','Medicine I','Surgery I','Community Health','Clinical Placement I']],
                    ['year'=>'Year 3','units'=>['Medicine II','Surgery II','Paediatrics','Obstetrics & Gynaecology','Research Methods','Clinical Placement II']],
                    ['year'=>'Year 4','units'=>['Psychiatry & Mental Health','Emergency Medicine','Clinical Dissertation','Elective Rotation','Clinical Placement III','Professional Ethics']],
                ],
                'accreditation' => ['body'=>'Kenya Medical Practitioners and Dentists Council (KMPDC) & Commission for University Education (CUE)','status'=>'Fully Accredited','year'=>2016],
                'employability_data' => ['job_roles'=>['Clinical Officer','Community Health Specialist','Medical Researcher','Public Health Officer','Primary Care Practitioner','Lecturer (with postgrad)'],'industry_sectors'=>['Public Hospitals','County Health Departments','NGOs','Ministry of Health','Private Clinics','Community Health Centres'],'employment_rate'=>99],
                'fee_structure' => ['tuition_kes_per_year'=>75000,'accommodation_kes_per_year'=>30000,'other_costs_kes'=>22000,'total_annual_kes'=>127000,'govt_sponsored_tuition'=>0,'notes'=>'Government-sponsored students pay no tuition. Clinical placement fees included.'],
            ],
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
                'career_opportunities' => ['Career information coming soon'],
                'entry_requirements' => ['Please contact the Admissions Office for entry requirements'],
            ]
        ]);
    }

    $d = $details[$school][$code];
    $x = $extra[$school][$code] ?? [];
    return response()->json([
        'data' => array_merge([
            'school' => $school,
            'code' => $code,
            'overview' => $d['overview'],
            'mode' => $d['mode'],
            'career_opportunities' => $d['career'],
            'entry_requirements' => $d['requirements'],
        ], $x)
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

// ============================================================
// Research & Innovation (RIMS-lite) — Public API
// ============================================================

use App\Models\ResearchTheme;
use App\Models\ResearchProject;
use App\Models\Publication;
use App\Models\ResearchGrant;
use App\Models\ResearchPartner;

Route::get('/research/overview', function () {
    $totalProjects    = ResearchProject::where('is_published', true)->count();
    $activeProjects   = ResearchProject::where('is_published', true)->where('status', 'active')->count();
    $totalPubs        = Publication::where('is_published', true)->count();
    $totalGrants      = ResearchGrant::where('is_visible', true)->count();
    $activeGrants     = ResearchGrant::where('is_visible', true)->where('status', 'active')->count();
    $totalPartners    = ResearchPartner::where('is_active', true)->count();
    $totalThemes      = ResearchTheme::where('is_active', true)->count();

    $featured = ResearchProject::where('is_published', true)
        ->where('is_featured', true)
        ->with('theme')
        ->orderByDesc('created_at')
        ->limit(3)
        ->get()
        ->map(fn($p) => [
            'id' => $p->id,
            'slug' => $p->slug,
            'title' => $p->title,
            'abstract' => $p->abstract,
            'department' => $p->department,
            'lead_researcher' => $p->lead_researcher_name,
            'status' => $p->status,
            'theme' => $p->theme ? ['name' => $p->theme->name, 'colour' => $p->theme->colour] : null,
            'sdg_goals' => $p->sdg_goals ?? [],
            'featured_image_url' => $p->featured_image_url,
        ]);

    $featuredPubs = Publication::where('is_published', true)
        ->where('is_featured', true)
        ->orderByDesc('year')
        ->limit(3)
        ->get()
        ->map(fn($p) => [
            'id' => $p->id,
            'slug' => $p->slug,
            'title' => $p->title,
            'authors' => $p->authors,
            'year' => $p->year,
            'journal' => $p->journal,
            'type' => $p->type,
            'doi' => $p->doi,
            'indexed_in' => $p->indexed_in ?? [],
        ]);

    $themes = ResearchTheme::where('is_active', true)
        ->orderBy('sort_order')
        ->get()
        ->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'slug' => $t->slug,
            'description' => $t->description,
            'colour' => $t->colour,
            'icon' => $t->icon,
            'sdg_goals' => $t->sdg_goals ?? [],
            'projects_count' => ResearchProject::where('theme_id', $t->id)->where('is_published', true)->count(),
        ]);

    return response()->json([
        'stats' => [
            ['label' => 'Research Projects', 'value' => $totalProjects],
            ['label' => 'Active Projects', 'value' => $activeProjects],
            ['label' => 'Publications', 'value' => $totalPubs],
            ['label' => 'Active Grants', 'value' => $activeGrants],
            ['label' => 'Partners & Collaborators', 'value' => $totalPartners],
            ['label' => 'Research Themes', 'value' => $totalThemes],
        ],
        'featured_projects' => $featured,
        'featured_publications' => $featuredPubs,
        'themes' => $themes,
    ]);
});

Route::get('/research/themes', function () {
    $themes = ResearchTheme::where('is_active', true)
        ->orderBy('sort_order')
        ->get()
        ->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'slug' => $t->slug,
            'description' => $t->description,
            'colour' => $t->colour,
            'icon' => $t->icon,
            'sdg_goals' => $t->sdg_goals ?? [],
            'projects_count' => ResearchProject::where('theme_id', $t->id)->where('is_published', true)->count(),
            'publications_count' => Publication::whereHas('project', fn($q) => $q->where('theme_id', $t->id))->where('is_published', true)->count(),
        ]);
    return response()->json(['data' => $themes]);
});

Route::get('/research/projects', function (Request $request) {
    $q = ResearchProject::where('is_published', true)->with('theme');

    if ($request->theme) {
        $theme = ResearchTheme::where('slug', $request->theme)->first();
        if ($theme) $q->where('theme_id', $theme->id);
    }
    if ($request->status) {
        $q->where('status', $request->status);
    }
    if ($request->department) {
        $q->where('department', 'like', '%' . $request->department . '%');
    }
    if ($request->search) {
        $q->where(function ($sq) use ($request) {
            $sq->where('title', 'like', '%' . $request->search . '%')
               ->orWhere('abstract', 'like', '%' . $request->search . '%')
               ->orWhere('lead_researcher_name', 'like', '%' . $request->search . '%');
        });
    }

    $perPage = min((int) ($request->per_page ?? 12), 50);
    $paginator = $q->orderByDesc('is_featured')->orderByDesc('start_date')->paginate($perPage);

    $items = collect($paginator->items())->map(fn($p) => [
        'id' => $p->id,
        'slug' => $p->slug,
        'title' => $p->title,
        'abstract' => $p->abstract,
        'department' => $p->department,
        'lead_researcher' => $p->lead_researcher_name,
        'status' => $p->status,
        'start_date' => $p->start_date?->format('Y-m-d'),
        'end_date' => $p->end_date?->format('Y-m-d'),
        'funding_source' => $p->funding_source,
        'sdg_goals' => $p->sdg_goals ?? [],
        'featured_image_url' => $p->featured_image_url,
        'is_featured' => $p->is_featured,
        'theme' => $p->theme ? ['name' => $p->theme->name, 'slug' => $p->theme->slug, 'colour' => $p->theme->colour] : null,
    ]);

    return response()->json([
        'data' => $items,
        'total' => $paginator->total(),
        'last_page' => $paginator->lastPage(),
        'current_page' => $paginator->currentPage(),
        'per_page' => $paginator->perPage(),
    ]);
});

Route::get('/research/projects/{slug}', function (string $slug) {
    $project = ResearchProject::where('slug', $slug)->where('is_published', true)->with('theme', 'publications', 'grant')->firstOrFail();
    return response()->json([
        'id' => $project->id,
        'slug' => $project->slug,
        'title' => $project->title,
        'abstract' => $project->abstract,
        'department' => $project->department,
        'lead_researcher' => $project->lead_researcher_name,
        'lead_researcher_slug' => $project->lead_researcher_slug,
        'co_researchers' => $project->co_researchers ?? [],
        'status' => $project->status,
        'start_date' => $project->start_date?->format('Y-m-d'),
        'end_date' => $project->end_date?->format('Y-m-d'),
        'funding_source' => $project->funding_source,
        'grant_id' => $project->grant_id,
        'budget' => $project->budget,
        'currency' => $project->currency,
        'sdg_goals' => $project->sdg_goals ?? [],
        'featured_image_url' => $project->featured_image_url,
        'outputs' => $project->outputs ?? [],
        'is_featured' => $project->is_featured,
        'theme' => $project->theme ? [
            'name' => $project->theme->name,
            'slug' => $project->theme->slug,
            'colour' => $project->theme->colour,
            'description' => $project->theme->description,
        ] : null,
        'publications' => $project->publications->where('is_published', true)->map(fn($p) => [
            'id' => $p->id, 'slug' => $p->slug, 'title' => $p->title,
            'authors' => $p->authors, 'year' => $p->year, 'journal' => $p->journal,
            'doi' => $p->doi, 'type' => $p->type, 'indexed_in' => $p->indexed_in ?? [],
        ])->values(),
        'grant' => $project->grant ? [
            'name' => $project->grant->name,
            'funder' => $project->grant->funder,
            'amount' => $project->grant->amount,
            'currency' => $project->grant->currency,
            'status' => $project->grant->status,
        ] : null,
        'seo_meta' => $project->seo_meta,
    ]);
});

Route::get('/research/publications', function (Request $request) {
    $q = Publication::where('is_published', true);

    if ($request->type) $q->where('type', $request->type);
    if ($request->year) $q->where('year', (int) $request->year);
    if ($request->search) {
        $q->where(function ($sq) use ($request) {
            $sq->where('title', 'like', '%' . $request->search . '%')
               ->orWhere('abstract', 'like', '%' . $request->search . '%')
               ->orWhere('journal', 'like', '%' . $request->search . '%');
        });
    }

    $perPage = min((int) ($request->per_page ?? 12), 50);
    $paginator = $q->orderByDesc('is_featured')->orderByDesc('year')->orderByDesc('created_at')->paginate($perPage);

    $items = collect($paginator->items())->map(fn($p) => [
        'id' => $p->id,
        'slug' => $p->slug,
        'title' => $p->title,
        'authors' => $p->authors,
        'year' => $p->year,
        'journal' => $p->journal,
        'publisher' => $p->publisher,
        'doi' => $p->doi,
        'url' => $p->url,
        'type' => $p->type,
        'abstract' => $p->abstract,
        'indexed_in' => $p->indexed_in ?? [],
        'volume' => $p->volume,
        'issue' => $p->issue,
        'pages' => $p->pages,
        'is_featured' => $p->is_featured,
        'citation' => $p->citation,
    ]);

    return response()->json([
        'data' => $items,
        'total' => $paginator->total(),
        'last_page' => $paginator->lastPage(),
        'current_page' => $paginator->currentPage(),
        'per_page' => $paginator->perPage(),
    ]);
});

Route::get('/research/publications/{slug}', function (string $slug) {
    $p = Publication::where('slug', $slug)->where('is_published', true)->with('project.theme')->firstOrFail();
    return response()->json([
        'id' => $p->id,
        'slug' => $p->slug,
        'title' => $p->title,
        'authors' => $p->authors,
        'year' => $p->year,
        'journal' => $p->journal,
        'publisher' => $p->publisher,
        'doi' => $p->doi,
        'url' => $p->url,
        'type' => $p->type,
        'abstract' => $p->abstract,
        'indexed_in' => $p->indexed_in ?? [],
        'volume' => $p->volume,
        'issue' => $p->issue,
        'pages' => $p->pages,
        'is_featured' => $p->is_featured,
        'citation' => $p->citation,
        'project' => $p->project ? [
            'id' => $p->project->id, 'slug' => $p->project->slug,
            'title' => $p->project->title,
            'theme' => $p->project->theme ? ['name' => $p->project->theme->name, 'colour' => $p->project->theme->colour] : null,
        ] : null,
        'seo_meta' => $p->seo_meta,
    ]);
});

Route::get('/research/grants', function (Request $request) {
    $q = ResearchGrant::where('is_visible', true)->with('project');
    if ($request->status) $q->where('status', $request->status);
    $grants = $q->orderByRaw("CASE status WHEN 'active' THEN 0 ELSE 1 END")->orderByDesc('start_date')->get();

    return response()->json([
        'data' => $grants->map(fn($g) => [
            'id' => $g->id,
            'name' => $g->name,
            'funder' => $g->funder,
            'funder_type' => $g->funder_type,
            'funder_country' => $g->funder_country,
            'amount' => $g->amount,
            'currency' => $g->currency,
            'start_date' => $g->start_date?->format('Y-m-d'),
            'end_date' => $g->end_date?->format('Y-m-d'),
            'status' => $g->status,
            'description' => $g->description,
            'grant_number' => $g->grant_number,
            'project' => $g->project ? ['slug' => $g->project->slug, 'title' => $g->project->title] : null,
        ]),
    ]);
});

Route::get('/research/partners', function (Request $request) {
    $q = ResearchPartner::where('is_active', true);
    if ($request->type) $q->where('type', $request->type);
    $partners = $q->orderByDesc('is_featured')->orderBy('name')->get();

    return response()->json([
        'data' => $partners->map(fn($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'type' => $p->type,
            'country' => $p->country,
            'description' => $p->description,
            'logo_url' => $p->logo_url,
            'website_url' => $p->website_url,
            'collaboration_areas' => $p->collaboration_areas ?? [],
            'is_featured' => $p->is_featured,
        ]),
    ]);
});

// ============================================================
// International & Partnerships Module
// ============================================================

Route::get('/international/overview', function () {
    $partnerships = \App\Models\InternationalPartnership::where('status', 'active')->count();
    $programmes   = \App\Models\ExchangeProgramme::where('status', 'open')->count();
    $countries    = \App\Models\InternationalPartnership::where('status', 'active')->distinct('country')->count('country');
    $featured     = \App\Models\InternationalPartnership::where('is_featured', true)->where('status', 'active')
        ->orderBy('sort_order')->limit(6)->get();
    $featuredProgrammes = \App\Models\ExchangeProgramme::where('is_featured', true)->where('status', 'open')
        ->with('partnership:id,name,country,logo_url')->limit(3)->get();
    return response()->json([
        'stats' => [
            ['label' => 'Partner Countries',       'value' => $countries],
            ['label' => 'Active Partnerships',     'value' => $partnerships],
            ['label' => 'Exchange Programmes',     'value' => $programmes],
            ['label' => 'Students Exchanged',      'value' => 38],
            ['label' => 'Grants Received (USD M)', 'value' => 2.3],
        ],
        'featured_partnerships' => $featured,
        'featured_programmes'   => $featuredProgrammes,
    ]);
});

Route::get('/international/partnerships', function (\Illuminate\Http\Request $request) {
    $query = \App\Models\InternationalPartnership::query();
    if ($request->type)   $query->where('type', $request->type);
    if ($request->status) $query->where('status', $request->status);
    else                  $query->where('status', 'active');
    if ($request->country) $query->where('country', 'like', "%{$request->country}%");
    $query->orderBy('sort_order')->orderBy('name');
    return response()->json(['data' => $query->get()]);
});

Route::get('/international/partnerships/{slug}', function (string $slug) {
    $partner = \App\Models\InternationalPartnership::where('slug', $slug)->firstOrFail();
    $partner->load(['exchangeProgrammes' => function($q) { $q->where('status', 'open'); }]);
    return response()->json($partner);
});

Route::get('/international/exchange', function (\Illuminate\Http\Request $request) {
    $query = \App\Models\ExchangeProgramme::with('partnership:id,name,country,logo_url,slug');
    if ($request->type)   $query->where('type', $request->type);
    if ($request->status) $query->where('status', $request->status);
    $query->orderByRaw("CASE status WHEN 'open' THEN 1 WHEN 'upcoming' THEN 2 WHEN 'closed' THEN 3 ELSE 4 END")->orderBy('application_deadline');
    return response()->json(['data' => $query->get()]);
});

Route::get('/international/exchange/{slug}', function (string $slug) {
    $prog = \App\Models\ExchangeProgramme::with('partnership')->where('slug', $slug)->firstOrFail();
    return response()->json($prog);
});

// ============================================================
// Admin: International & Partnerships CRUD
// ============================================================

Route::post('/admin/international/partnerships', function (\Illuminate\Http\Request $request) {
    $data = $request->validate([
        'slug' => 'required|string|unique:international_partnerships,slug',
        'name' => 'required|string',
        'short_name' => 'nullable|string',
        'country' => 'required|string',
        'country_code' => 'nullable|string|max:3',
        'type' => 'required|in:university,research_institute,government,ngo,development_agency,quaker,professional_body',
        'status' => 'required|in:active,inactive,pending',
        'description' => 'nullable|string',
        'logo_url' => 'nullable|string',
        'website_url' => 'nullable|string',
        'mou_date' => 'nullable|date',
        'mou_expiry' => 'nullable|date',
        'collaboration_areas' => 'nullable|array',
        'is_featured' => 'nullable|boolean',
        'sort_order' => 'nullable|integer',
    ]);
    $partner = \App\Models\InternationalPartnership::create($data);
    return response()->json($partner, 201);
});

Route::put('/admin/international/partnerships/{id}', function (\Illuminate\Http\Request $request, int $id) {
    $partner = \App\Models\InternationalPartnership::findOrFail($id);
    $data = $request->validate([
        'slug' => "required|string|unique:international_partnerships,slug,{$id}",
        'name' => 'required|string',
        'short_name' => 'nullable|string',
        'country' => 'required|string',
        'country_code' => 'nullable|string|max:3',
        'type' => 'required|in:university,research_institute,government,ngo,development_agency,quaker,professional_body',
        'status' => 'required|in:active,inactive,pending',
        'description' => 'nullable|string',
        'logo_url' => 'nullable|string',
        'website_url' => 'nullable|string',
        'mou_date' => 'nullable|date',
        'mou_expiry' => 'nullable|date',
        'collaboration_areas' => 'nullable|array',
        'is_featured' => 'nullable|boolean',
        'sort_order' => 'nullable|integer',
    ]);
    $partner->update($data);
    return response()->json($partner);
});

Route::delete('/admin/international/partnerships/{id}', function (int $id) {
    \App\Models\InternationalPartnership::findOrFail($id)->delete();
    return response()->json(['success' => true]);
});

Route::post('/admin/international/exchange', function (\Illuminate\Http\Request $request) {
    $data = $request->validate([
        'slug' => 'required|string|unique:exchange_programmes,slug',
        'title' => 'required|string',
        'type' => 'required|in:student_exchange,staff_exchange,joint_degree,summer_school,research_fellowship,internship',
        'partnership_id' => 'nullable|integer|exists:international_partnerships,id',
        'partner_name' => 'nullable|string',
        'partner_country' => 'nullable|string',
        'description' => 'required|string',
        'duration_weeks' => 'nullable|integer',
        'duration_label' => 'nullable|string',
        'application_deadline' => 'nullable|date',
        'next_intake' => 'nullable|string',
        'slots_available' => 'nullable|integer',
        'stipend_amount' => 'nullable|numeric',
        'stipend_currency' => 'nullable|string|max:3',
        'eligibility' => 'nullable|array',
        'benefits' => 'nullable|array',
        'required_documents' => 'nullable|array',
        'status' => 'required|in:open,closed,upcoming,suspended',
        'is_featured' => 'nullable|boolean',
    ]);
    $prog = \App\Models\ExchangeProgramme::create($data);
    return response()->json($prog, 201);
});

Route::put('/admin/international/exchange/{id}', function (\Illuminate\Http\Request $request, int $id) {
    $prog = \App\Models\ExchangeProgramme::findOrFail($id);
    $data = $request->validate([
        'slug' => "required|string|unique:exchange_programmes,slug,{$id}",
        'title' => 'required|string',
        'type' => 'required|in:student_exchange,staff_exchange,joint_degree,summer_school,research_fellowship,internship',
        'partnership_id' => 'nullable|integer|exists:international_partnerships,id',
        'partner_name' => 'nullable|string',
        'partner_country' => 'nullable|string',
        'description' => 'required|string',
        'duration_weeks' => 'nullable|integer',
        'duration_label' => 'nullable|string',
        'application_deadline' => 'nullable|date',
        'next_intake' => 'nullable|string',
        'slots_available' => 'nullable|integer',
        'stipend_amount' => 'nullable|numeric',
        'stipend_currency' => 'nullable|string|max:3',
        'eligibility' => 'nullable|array',
        'benefits' => 'nullable|array',
        'required_documents' => 'nullable|array',
        'status' => 'required|in:open,closed,upcoming,suspended',
        'is_featured' => 'nullable|boolean',
    ]);
    $prog->update($data);
    return response()->json($prog);
});

Route::delete('/admin/international/exchange/{id}', function (int $id) {
    \App\Models\ExchangeProgramme::findOrFail($id)->delete();
    return response()->json(['success' => true]);
});

// ═══════════════════════════════════════════════════════════════════════════
// INSTITUTIONAL REPOSITORY (MP12)
// ═══════════════════════════════════════════════════════════════════════════

/** Overview: stats + featured items */
Route::get('/repository/overview', function () {
    $base = \App\Models\RepositoryItem::published();
    $stats = [
        'total'       => $base->count(),
        'theses'      => (clone $base)->whereIn('type', ['thesis','dissertation'])->count(),
        'articles'    => (clone $base)->where('type', 'journal_article')->count(),
        'open_access' => (clone $base)->where('access', 'open')->count(),
        'downloads'   => (clone $base)->sum('downloads'),
        'departments' => (clone $base)->distinct('department')->whereNotNull('department')->count('department'),
    ];
    $featured = \App\Models\RepositoryItem::published()
        ->where('access', 'open')
        ->orderBy('citation_count', 'desc')
        ->take(6)
        ->get(['id','slug','title','type','year','department','authors','citation_count','downloads','doi']);
    $recent = \App\Models\RepositoryItem::published()
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get(['id','slug','title','type','year','department','authors']);
    return response()->json(compact('stats', 'featured', 'recent'));
});

/** Browse — paginated with filters */
Route::get('/repository/items', function (\Illuminate\Http\Request $request) {
    $q = \App\Models\RepositoryItem::published();
    if ($request->type)       $q->where('type', $request->type);
    if ($request->department) $q->where('department', $request->department);
    if ($request->year)       $q->where('year', $request->year);
    if ($request->access)     $q->where('access', $request->access);
    if ($request->search) {
        $s = '%' . $request->search . '%';
        $q->where(fn($w) => $w
            ->where('title', 'like', $s)
            ->orWhere('abstract', 'like', $s)
            ->orWhere('department', 'like', $s)
        );
    }
    $sort = match($request->sort ?? 'recent') {
        'citations' => ['citation_count', 'desc'],
        'downloads' => ['downloads', 'desc'],
        'year_asc'  => ['year', 'asc'],
        'year_desc' => ['year', 'desc'],
        default     => ['created_at', 'desc'],
    };
    $q->orderBy(...$sort);
    $perPage = min((int)($request->per_page ?? 12), 50);
    $result  = $q->paginate($perPage, ['id','slug','title','type','abstract','year','department','authors','keywords','citation_count','downloads','access','license','doi']);
    return response()->json([
        'data'         => $result->items(),
        'current_page' => $result->currentPage(),
        'last_page'    => $result->lastPage(),
        'total'        => $result->total(),
        'per_page'     => $result->perPage(),
    ]);
});

/** Aggregated browse facets (years, departments, counts) */
Route::get('/repository/facets', function () {
    $base = \App\Models\RepositoryItem::published();
    $years       = (clone $base)->selectRaw('year, count(*) as count')->groupBy('year')->orderBy('year','desc')->get();
    $departments = (clone $base)->selectRaw('department, count(*) as count')->whereNotNull('department')->groupBy('department')->orderBy('count','desc')->get();
    $types       = (clone $base)->selectRaw('type, count(*) as count')->groupBy('type')->orderBy('count','desc')->get();
    return response()->json(compact('years','departments','types'));
});

/** Single item detail */
Route::get('/repository/items/{slug}', function (string $slug) {
    $item = \App\Models\RepositoryItem::published()->where('slug', $slug)->firstOrFail();
    $item->increment('views');
    $related = \App\Models\RepositoryItem::published()
        ->where('id', '!=', $item->id)
        ->where(fn($w) => $w->where('department', $item->department)->orWhere('research_theme', $item->research_theme))
        ->inRandomOrder()->take(4)
        ->get(['id','slug','title','type','year','authors']);
    return response()->json(array_merge($item->toArray(), ['related' => $related]));
});

/** Download — increment counter + redirect */
Route::get('/repository/items/{slug}/download', function (string $slug) {
    $item = \App\Models\RepositoryItem::published()->where('slug', $slug)->firstOrFail();
    if ($item->access !== 'open' || !$item->file_url) {
        abort(403, 'File not publicly available.');
    }
    $item->increment('downloads');
    return response()->json(['url' => $item->file_url]);
});

// ── ADMIN ROUTES ──────────────────────────────────────────────────────────

Route::get('/admin/repository', function (\Illuminate\Http\Request $request) {
    \App\Http\Middleware\AdminAuth::check($request);
    $q = \App\Models\RepositoryItem::query();
    if ($request->status) $q->where('status', $request->status);
    if ($request->type)   $q->where('type', $request->type);
    if ($request->search) {
        $s = '%'.$request->search.'%';
        $q->where(fn($w) => $w->where('title','like',$s)->orWhere('department','like',$s));
    }
    $result = $q->orderBy('created_at','desc')->paginate(20);
    return response()->json([
        'data'         => $result->items(),
        'current_page' => $result->currentPage(),
        'last_page'    => $result->lastPage(),
        'total'        => $result->total(),
        'per_page'     => $result->perPage(),
    ]);
});

Route::post('/admin/repository', function (\Illuminate\Http\Request $request) {
    \App\Http\Middleware\AdminAuth::check($request);
    $data = $request->validate([
        'slug'            => 'required|string|unique:repository_items,slug',
        'title'           => 'required|string',
        'type'            => 'required|in:thesis,dissertation,journal_article,conference_paper,book_chapter,research_report,working_paper,dataset',
        'abstract'        => 'required|string',
        'authors'         => 'required|array',
        'keywords'        => 'required|array',
        'department'      => 'nullable|string',
        'research_theme'  => 'nullable|string',
        'year'            => 'required|integer|min:1990|max:2030',
        'publisher'       => 'nullable|string',
        'journal_name'    => 'nullable|string',
        'volume'          => 'nullable|string',
        'issue'           => 'nullable|string',
        'pages'           => 'nullable|string',
        'doi'             => 'nullable|string',
        'isbn_issn'       => 'nullable|string',
        'file_url'        => 'nullable|string',
        'file_size_kb'    => 'nullable|integer',
        'language'        => 'nullable|string',
        'license'         => 'nullable|in:cc_by,cc_by_nc,cc_by_sa,all_rights_reserved,open_access',
        'access'          => 'nullable|in:open,restricted,embargo',
        'embargo_until'   => 'nullable|date',
        'funded_by'       => 'nullable|string',
        'student_name'    => 'nullable|string',
        'supervisor'      => 'nullable|string',
        'degree'          => 'nullable|string',
        'status'          => 'nullable|in:draft,under_review,approved,published,withdrawn',
        'seo_meta'        => 'nullable|array',
        'seo_meta.title'  => 'nullable|string|max:255',
        'seo_meta.description' => 'nullable|string|max:500',
    ]);
    $item = \App\Models\RepositoryItem::create($data);
    return response()->json($item, 201);
});

Route::get('/admin/repository/{id}', function (int $id) {
    return response()->json(\App\Models\RepositoryItem::findOrFail($id));
});

Route::put('/admin/repository/{id}', function (\Illuminate\Http\Request $request, int $id) {
    \App\Http\Middleware\AdminAuth::check($request);
    $item = \App\Models\RepositoryItem::findOrFail($id);
    $data = $request->validate([
        'slug'            => 'sometimes|string|unique:repository_items,slug,'.$id,
        'title'           => 'sometimes|string',
        'type'            => 'sometimes|in:thesis,dissertation,journal_article,conference_paper,book_chapter,research_report,working_paper,dataset',
        'abstract'        => 'sometimes|string',
        'authors'         => 'sometimes|array',
        'keywords'        => 'sometimes|array',
        'department'      => 'nullable|string',
        'research_theme'  => 'nullable|string',
        'year'            => 'sometimes|integer|min:1990|max:2030',
        'publisher'       => 'nullable|string',
        'journal_name'    => 'nullable|string',
        'volume'          => 'nullable|string',
        'issue'           => 'nullable|string',
        'pages'           => 'nullable|string',
        'doi'             => 'nullable|string',
        'isbn_issn'       => 'nullable|string',
        'file_url'        => 'nullable|string',
        'file_size_kb'    => 'nullable|integer',
        'license'         => 'nullable|in:cc_by,cc_by_nc,cc_by_sa,all_rights_reserved,open_access',
        'access'          => 'nullable|in:open,restricted,embargo',
        'embargo_until'   => 'nullable|date',
        'funded_by'       => 'nullable|string',
        'student_name'    => 'nullable|string',
        'supervisor'      => 'nullable|string',
        'degree'          => 'nullable|string',
        'status'          => 'nullable|in:draft,under_review,approved,published,withdrawn',
        'seo_meta'        => 'nullable|array',
        'seo_meta.title'  => 'nullable|string|max:255',
        'seo_meta.description' => 'nullable|string|max:500',
    ]);
    $item->update($data);
    return response()->json($item);
});

Route::delete('/admin/repository/{id}', function (\Illuminate\Http\Request $request, int $id) {
    \App\Http\Middleware\AdminAuth::check($request);
    \App\Models\RepositoryItem::findOrFail($id)->delete();
    return response()->json(['success' => true]);
});

// ─── Admin: Research Projects ─────────────────────────────────────────────────

Route::post('/admin/research/projects', function (\Illuminate\Http\Request $request) {
    \App\Http\Middleware\AdminAuth::check($request);
    $data = $request->validate([
        'title'              => 'required|string|max:500',
        'slug'               => 'nullable|string|max:500',
        'abstract'           => 'required|string',
        'department'         => 'nullable|string|max:200',
        'lead_researcher'    => 'nullable|string|max:300',
        'theme_id'           => 'nullable|integer|exists:research_themes,id',
        'status'             => 'required|in:planned,active,completed,suspended',
        'start_date'         => 'nullable|date',
        'end_date'           => 'nullable|date',
        'funding_source'     => 'nullable|string|max:300',
        'sdg_goals'          => 'nullable|array',
        'sdg_goals.*'        => 'integer|min:1|max:17',
        'is_featured'        => 'nullable|boolean',
        'seo_meta'           => 'nullable|array',
        'seo_meta.title'     => 'nullable|string|max:255',
        'seo_meta.description' => 'nullable|string|max:500',
    ]);
    $slug = $data['slug'] ?? \Illuminate\Support\Str::slug($data['title']);
    $base = $slug;
    $i = 2;
    while (\App\Models\ResearchProject::where('slug', $slug)->exists()) {
        $slug = $base . '-' . $i++;
    }
    $project = \App\Models\ResearchProject::create([
        'title'               => $data['title'],
        'slug'                => $slug,
        'abstract'            => $data['abstract'],
        'department'          => $data['department'] ?? null,
        'lead_researcher_name' => $data['lead_researcher'] ?? null,
        'theme_id'            => $data['theme_id'] ?? null,
        'status'              => $data['status'],
        'start_date'          => $data['start_date'] ?? null,
        'end_date'            => $data['end_date'] ?? null,
        'funding_source'      => $data['funding_source'] ?? null,
        'sdg_goals'           => $data['sdg_goals'] ?? [],
        'is_featured'         => $data['is_featured'] ?? false,
        'is_published'        => true,
        'seo_meta'            => $data['seo_meta'] ?? null,
    ]);
    return response()->json($project->load('theme'), 201);
});

Route::put('/admin/research/projects/{id}', function (\Illuminate\Http\Request $request, int $id) {
    \App\Http\Middleware\AdminAuth::check($request);
    $project = \App\Models\ResearchProject::findOrFail($id);
    $data = $request->validate([
        'title'              => 'sometimes|string|max:500',
        'abstract'           => 'sometimes|string',
        'department'         => 'nullable|string|max:200',
        'lead_researcher'    => 'nullable|string|max:300',
        'theme_id'           => 'nullable|integer',
        'status'             => 'sometimes|in:planned,active,completed,suspended',
        'start_date'         => 'nullable|date',
        'end_date'           => 'nullable|date',
        'funding_source'     => 'nullable|string|max:300',
        'sdg_goals'          => 'nullable|array',
        'sdg_goals.*'        => 'integer|min:1|max:17',
        'is_featured'        => 'nullable|boolean',
        'seo_meta'           => 'nullable|array',
        'seo_meta.title'     => 'nullable|string|max:255',
        'seo_meta.description' => 'nullable|string|max:500',
    ]);
    if (isset($data['lead_researcher'])) {
        $data['lead_researcher_name'] = $data['lead_researcher'];
        unset($data['lead_researcher']);
    }
    $project->update($data);
    return response()->json($project->load('theme'));
});

Route::delete('/admin/research/projects/{id}', function (\Illuminate\Http\Request $request, int $id) {
    \App\Http\Middleware\AdminAuth::check($request);
    \App\Models\ResearchProject::findOrFail($id)->delete();
    return response()->json(['success' => true]);
});

// ─── Admin: Research Publications ─────────────────────────────────────────────

Route::post('/admin/research/publications', function (\Illuminate\Http\Request $request) {
    \App\Http\Middleware\AdminAuth::check($request);
    $data = $request->validate([
        'title'               => 'required|string|max:500',
        'slug'                => 'nullable|string|max:500',
        'authors'             => 'required|array',
        'year'                => 'required|integer|min:1980|max:2030',
        'type'                => 'required|in:journal,conference,book_chapter,thesis,report,book,preprint',
        'journal'             => 'nullable|string|max:300',
        'publisher'           => 'nullable|string|max:300',
        'doi'                 => 'nullable|string|max:200',
        'url'                 => 'nullable|string|max:500',
        'abstract'            => 'nullable|string',
        'volume'              => 'nullable|string|max:50',
        'issue'               => 'nullable|string|max:50',
        'pages'               => 'nullable|string|max:50',
        'indexed_in'          => 'nullable|array',
        'research_project_id' => 'nullable|integer|exists:research_projects,id',
        'is_featured'         => 'nullable|boolean',
        'seo_meta'            => 'nullable|array',
        'seo_meta.title'      => 'nullable|string|max:255',
        'seo_meta.description' => 'nullable|string|max:500',
    ]);
    $slug = $data['slug'] ?? \Illuminate\Support\Str::slug($data['title']);
    $base = $slug;
    $i = 2;
    while (\App\Models\Publication::where('slug', $slug)->exists()) {
        $slug = $base . '-' . $i++;
    }
    $pub = \App\Models\Publication::create([
        'title'       => $data['title'],
        'slug'        => $slug,
        'authors'     => $data['authors'],
        'year'        => $data['year'],
        'type'        => $data['type'],
        'journal'     => $data['journal'] ?? null,
        'publisher'   => $data['publisher'] ?? null,
        'doi'         => $data['doi'] ?? null,
        'url'         => $data['url'] ?? null,
        'abstract'    => $data['abstract'] ?? null,
        'volume'      => $data['volume'] ?? null,
        'issue'       => $data['issue'] ?? null,
        'pages'       => $data['pages'] ?? null,
        'indexed_in'  => $data['indexed_in'] ?? [],
        'project_id'  => $data['research_project_id'] ?? null,
        'is_featured' => $data['is_featured'] ?? false,
        'is_published' => true,
        'seo_meta'    => $data['seo_meta'] ?? null,
    ]);
    return response()->json($pub, 201);
});

Route::put('/admin/research/publications/{id}', function (\Illuminate\Http\Request $request, int $id) {
    \App\Http\Middleware\AdminAuth::check($request);
    $pub = \App\Models\Publication::findOrFail($id);
    $data = $request->validate([
        'title'               => 'sometimes|string|max:500',
        'authors'             => 'sometimes|array',
        'year'                => 'sometimes|integer|min:1980|max:2030',
        'type'                => 'sometimes|in:journal,conference,book_chapter,thesis,report,book,preprint',
        'journal'             => 'nullable|string|max:300',
        'publisher'           => 'nullable|string|max:300',
        'doi'                 => 'nullable|string|max:200',
        'url'                 => 'nullable|string|max:500',
        'abstract'            => 'nullable|string',
        'volume'              => 'nullable|string|max:50',
        'issue'               => 'nullable|string|max:50',
        'pages'               => 'nullable|string|max:50',
        'indexed_in'          => 'nullable|array',
        'research_project_id' => 'nullable|integer',
        'is_featured'         => 'nullable|boolean',
        'seo_meta'            => 'nullable|array',
        'seo_meta.title'      => 'nullable|string|max:255',
        'seo_meta.description' => 'nullable|string|max:500',
    ]);
    if (array_key_exists('research_project_id', $data)) {
        $data['project_id'] = $data['research_project_id'];
        unset($data['research_project_id']);
    }
    $pub->update($data);
    return response()->json($pub);
});

Route::delete('/admin/research/publications/{id}', function (\Illuminate\Http\Request $request, int $id) {
    \App\Http\Middleware\AdminAuth::check($request);
    \App\Models\Publication::findOrFail($id)->delete();
    return response()->json(['success' => true]);
});

// ─────────────────────────────────────────────────────────────────────────────
// CAMPUSES & SERVICE POINTS — Public Routes (MP15)
// ─────────────────────────────────────────────────────────────────────────────

Route::get('/campuses', function (Request $request) {
    $campuses = \App\Models\Campus::active()
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get();
    return response()->json($campuses);
});

Route::get('/campuses/{slug}', function (string $slug) {
    $campus = \App\Models\Campus::where('slug', $slug)->where('status', 'active')->firstOrFail();
    $offices = \App\Models\ServicePoint::where('campus_id', $campus->id)
        ->where('status', 'active')
        ->orderBy('sort_order')
        ->get();
    return response()->json(array_merge($campus->toArray(), ['offices' => $offices]));
});

Route::get('/service-points', function (Request $request) {
    $q = \App\Models\ServicePoint::active()
        ->with('campus:id,name,slug')
        ->orderBy('sort_order')
        ->orderBy('name');
    if ($request->query('category')) {
        $q->where('category', $request->query('category'));
    }
    if ($request->query('campus_id')) {
        $q->where('campus_id', $request->query('campus_id'));
    }
    if ($request->query('search')) {
        $term = '%' . $request->query('search') . '%';
        $q->where(fn($w) => $w->where('name', 'like', $term)->orWhere('summary', 'like', $term)->orWhere('category', 'like', $term));
    }
    return response()->json($q->get());
});

Route::get('/service-points/{slug}', function (string $slug) {
    $sp = \App\Models\ServicePoint::where('slug', $slug)->where('status', 'active')
        ->with('campus:id,name,slug,address,latitude,longitude')
        ->firstOrFail();
    return response()->json($sp);
});

// ─── ADMISSIONS ELIGIBILITY CHECKER ──────────────────────────────────────────
// ─── CERTIFICATE UPLOAD ──────────────────────────────────────────────────────
Route::post('/admissions/documents/upload', function (Request $request) {
    $request->validate([
        'certificate' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        'document_type' => 'nullable|string|max:60',
    ]);

    $file = $request->file('certificate');
    $docType = $request->input('document_type', 'certificate');
    $ext = $file->getClientOriginalExtension();
    $refId = (string) \Illuminate\Support\Str::uuid();
    $safeName = $refId . '.' . $ext;
    $stored = $file->storeAs('admissions-uploads', $safeName);

    $sizeKb = round($file->getSize() / 1024, 1);

    \Illuminate\Support\Facades\DB::table('admissions_uploads')->insert([
        'reference_id'  => $refId,
        'file_name'     => $file->getClientOriginalName(),
        'stored_path'   => $stored,
        'document_type' => $docType,
        'size_kb'       => $sizeKb,
        'status'        => 'pending',
        'created_at'    => now(),
        'updated_at'    => now(),
    ]);

    return response()->json([
        'data' => [
            'reference_id'  => $refId,
            'file_name'     => $file->getClientOriginalName(),
            'document_type' => $docType,
            'size_kb'       => $sizeKb,
            'message'       => 'Document uploaded successfully. It will be verified by the Admissions Office when you submit your formal application.',
        ]
    ]);
});

// ─── ELIGIBILITY CHECKER ──────────────────────────────────────────────────────
Route::post('/admissions/eligibility', function (Request $request) {
    $pathway = $request->input('pathway', 'undergraduate');
    $qualType = $request->input('qualification_type', 'KCSE');
    $meanGrade = strtoupper(trim($request->input('mean_grade', 'C+')));
    $subjectGrades = $request->input('subject_grades', []);   // e.g. {"Mathematics":"B+","Biology":"A-",...}

    // KCSE grade points (Kenya standard)
    $gradePoints = ['A' => 12,'A-' => 11,'B+' => 10,'B' => 9,'B-' => 8,'C+' => 7,'C' => 6,'C-' => 5,'D+' => 4,'D' => 3,'D-' => 2,'E' => 1];
    $userPoints = $gradePoints[$meanGrade] ?? 0;

    // ── Subject grades helper ──────────────────────────────────────────────────
    // subject_grades: assoc array {subject => grade}
    $subjectGradePoints = [];
    foreach ($subjectGrades as $subj => $grd) {
        $subjectGradePoints[strtolower(trim($subj))] = $gradePoints[strtoupper(trim($grd))] ?? 0;
    }

    /**
     * Evaluate a programme's cluster requirements against submitted subject grades.
     * Each requirement group: { desc, options (lowercase subject names), min_points, count }
     * Returns: [ { description, pass, best_subject, best_grade, required_grade }, ... ]
     */
    $checkCluster = function(array $clusterReqs) use ($subjectGradePoints, $gradePoints) {
        if (empty($subjectGradePoints)) return null; // No subjects submitted — skip check
        $invertedGrades = array_flip($gradePoints); // points => grade string
        $results = [];
        foreach ($clusterReqs as $req) {
            $matched = 0;
            $bestPts = 0;
            $bestSubj = null;
            foreach ($req['options'] as $opt) {
                $pts = $subjectGradePoints[$opt] ?? 0;
                if ($pts >= $req['min_points']) $matched++;
                if ($pts > $bestPts) { $bestPts = $pts; $bestSubj = $opt; }
            }
            $pass = $matched >= $req['count'];
            $results[] = [
                'description'    => $req['desc'],
                'required_grade' => $invertedGrades[$req['min_points']] ?? 'C',
                'required_count' => $req['count'],
                'options'        => $req['options'],
                'best_subject'   => $bestSubj ? ucwords($bestSubj) : null,
                'best_grade'     => $bestSubj ? ($invertedGrades[$subjectGradePoints[$bestSubj]] ?? '—') : null,
                'pass'           => $pass,
            ];
        }
        return $results;
    };

    // Undergraduate programmes with cluster subjects
    $ugProgrammes = [
        ['name'=>'BEd (Arts)','code'=>'BEd (Arts)','school'=>'SESS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Teaching, Education',
         'cluster_requirements'=>[
            ['desc'=>'English or Kiswahili at C+','options'=>['english','kiswahili'],'min_points'=>7,'count'=>1],
            ['desc'=>'Any two of: History, Geography, French, CRE, IRE at C','options'=>['history','geography','french','cre','ire'],'min_points'=>6,'count'=>2],
        ]],
        ['name'=>'BEd (French)','code'=>'BEd (French)','school'=>'SESS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Language Teaching, Diplomacy',
         'cluster_requirements'=>[
            ['desc'=>'French or English at C+','options'=>['french','english'],'min_points'=>7,'count'=>1],
            ['desc'=>'Any two other subjects at C','options'=>['kiswahili','history','geography','cre','ire','mathematics'],'min_points'=>6,'count'=>2],
        ]],
        ['name'=>'BEd (Science)','code'=>'BEd (Science)','school'=>'SESS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Science Teaching, STEM',
         'cluster_requirements'=>[
            ['desc'=>'Any two of: Biology, Chemistry, Physics, Mathematics at C+','options'=>['biology','chemistry','physics','mathematics'],'min_points'=>7,'count'=>2],
        ]],
        ['name'=>'BSW','code'=>'BSW','school'=>'SESS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Social Work, NGOs, Community Development',
         'cluster_requirements'=>[
            ['desc'=>'English or Kiswahili at C','options'=>['english','kiswahili'],'min_points'=>6,'count'=>1],
            ['desc'=>'Any three other subjects at C','options'=>['mathematics','history','geography','biology','chemistry','physics','cre','ire','business studies'],'min_points'=>6,'count'=>3],
        ]],
        ['name'=>'BEd ECD','code'=>'BEd ECD','school'=>'SESS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Early Childhood Education',
         'cluster_requirements'=>[
            ['desc'=>'English or Kiswahili at C','options'=>['english','kiswahili'],'min_points'=>6,'count'=>1],
            ['desc'=>'Any two other subjects at C','options'=>['mathematics','history','geography','biology','chemistry','physics','cre','ire'],'min_points'=>6,'count'=>2],
        ]],
        ['name'=>'BDMID','code'=>'BDMID','school'=>'SESS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Disaster Management, Diplomacy',
         'cluster_requirements'=>[
            ['desc'=>'English at C','options'=>['english'],'min_points'=>6,'count'=>1],
            ['desc'=>'Any three other subjects at C','options'=>['kiswahili','mathematics','history','geography','biology','chemistry','physics','cre'],'min_points'=>6,'count'=>3],
        ]],
        ['name'=>'BA Criminology','code'=>'BA Criminology','school'=>'SESS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Police, Security, Justice',
         'cluster_requirements'=>[
            ['desc'=>'English at C','options'=>['english'],'min_points'=>6,'count'=>1],
            ['desc'=>'Any three other subjects at C','options'=>['kiswahili','mathematics','history','geography','biology','chemistry','physics','cre','ire'],'min_points'=>6,'count'=>3],
        ]],
        ['name'=>'BCom','code'=>'BCom','school'=>'SBE','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Accounting, Finance, Business',
         'cluster_requirements'=>[
            ['desc'=>'Mathematics at C','options'=>['mathematics'],'min_points'=>6,'count'=>1],
            ['desc'=>'English at C','options'=>['english'],'min_points'=>6,'count'=>1],
            ['desc'=>'Any two other subjects at C','options'=>['kiswahili','history','geography','biology','chemistry','physics','business studies','cre'],'min_points'=>6,'count'=>2],
        ]],
        ['name'=>'BSc Economics','code'=>'BSc Economics','school'=>'SBE','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Economics, Policy, Development',
         'cluster_requirements'=>[
            ['desc'=>'Mathematics at C+','options'=>['mathematics'],'min_points'=>7,'count'=>1],
            ['desc'=>'English at C','options'=>['english'],'min_points'=>6,'count'=>1],
        ]],
        ['name'=>'BSc CS','code'=>'BSc CS','school'=>'SCIT','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Software, AI, Data Science',
         'cluster_requirements'=>[
            ['desc'=>'Mathematics at C+','options'=>['mathematics'],'min_points'=>7,'count'=>1],
            ['desc'=>'Any one science at C: Physics, Chemistry, Biology, Computer Studies','options'=>['physics','chemistry','biology','computer studies'],'min_points'=>6,'count'=>1],
        ]],
        ['name'=>'BSc IT','code'=>'BSc IT','school'=>'SCIT','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Networking, Cybersecurity, Web Dev',
         'cluster_requirements'=>[
            ['desc'=>'Mathematics at C+','options'=>['mathematics'],'min_points'=>7,'count'=>1],
            ['desc'=>'Any one science at C: Physics, Chemistry, Biology, Computer Studies','options'=>['physics','chemistry','biology','computer studies'],'min_points'=>6,'count'=>1],
        ]],
        ['name'=>'BSc Physics','code'=>'BSc Physics','school'=>'SOS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Research, Energy, Technology',
         'cluster_requirements'=>[
            ['desc'=>'Physics at C+','options'=>['physics'],'min_points'=>7,'count'=>1],
            ['desc'=>'Mathematics at C+','options'=>['mathematics'],'min_points'=>7,'count'=>1],
        ]],
        ['name'=>'BSc Chemistry','code'=>'BSc Chemistry','school'=>'SOS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Pharmaceutical, Lab Science',
         'cluster_requirements'=>[
            ['desc'=>'Chemistry at C+','options'=>['chemistry'],'min_points'=>7,'count'=>1],
            ['desc'=>'Biology or Physics at C','options'=>['biology','physics'],'min_points'=>6,'count'=>1],
        ]],
        ['name'=>'BSc Biology','code'=>'BSc Biology','school'=>'SOS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Healthcare, Research, Environment',
         'cluster_requirements'=>[
            ['desc'=>'Biology at C+','options'=>['biology'],'min_points'=>7,'count'=>1],
            ['desc'=>'Chemistry at C','options'=>['chemistry'],'min_points'=>6,'count'=>1],
        ]],
        ['name'=>'BSc Agric. Econ.','code'=>'BSc Agric. Econ.','school'=>'SOS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Agriculture, Policy, Food Security',
         'cluster_requirements'=>[
            ['desc'=>'Agriculture or Biology at C+','options'=>['agriculture','biology'],'min_points'=>7,'count'=>1],
        ]],
        ['name'=>'BOptom','code'=>'BOptom','school'=>'SHS','min_grade'=>'C+','min_points'=>7,'duration'=>'5 years','career_hint'=>'Eye Care, Vision Science',
         'cluster_requirements'=>[
            ['desc'=>'Biology at C+','options'=>['biology'],'min_points'=>7,'count'=>1],
            ['desc'=>'Chemistry at C','options'=>['chemistry'],'min_points'=>6,'count'=>1],
            ['desc'=>'Physics or Mathematics at C','options'=>['physics','mathematics'],'min_points'=>6,'count'=>1],
        ]],
        ['name'=>'BSN','code'=>'BSN','school'=>'SHS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Nursing, Midwifery, Healthcare',
         'cluster_requirements'=>[
            ['desc'=>'Biology at C+','options'=>['biology'],'min_points'=>7,'count'=>1],
            ['desc'=>'Chemistry at C+','options'=>['chemistry'],'min_points'=>7,'count'=>1],
            ['desc'=>'Physics or Mathematics at C','options'=>['physics','mathematics'],'min_points'=>6,'count'=>1],
        ]],
        ['name'=>'BSc Clinical Med.','code'=>'BSc Clinical Med.','school'=>'SHS','min_grade'=>'C+','min_points'=>7,'duration'=>'4 years','career_hint'=>'Clinical Practice, Community Health',
         'cluster_requirements'=>[
            ['desc'=>'Biology at C+','options'=>['biology'],'min_points'=>7,'count'=>1],
            ['desc'=>'Chemistry at C+','options'=>['chemistry'],'min_points'=>7,'count'=>1],
            ['desc'=>'Physics or Mathematics at C','options'=>['physics','mathematics'],'min_points'=>6,'count'=>1],
        ]],
    ];

    $pgProgrammes = [
        // Masters programmes — require a Bachelor's degree (2nd Class or above)
        ['level'=>'masters','name'=>'MA Religion','code'=>'MA Religion','school'=>'SESS','min_qual'=>'Bachelor\'s degree, 2nd Class Honours or above','min_class'=>'lower_second','duration'=>'2 years','career_hint'=>'Theology, Academia, Development'],
        ['level'=>'masters','name'=>'MA English Language','code'=>'MA English','school'=>'SESS','min_qual'=>'Bachelor\'s in English, Linguistics or related','min_class'=>'lower_second','duration'=>'2 years','career_hint'=>'Language Studies, Research, Teaching'],
        ['level'=>'masters','name'=>'MA Kiswahili','code'=>'MA Kiswahili','school'=>'SESS','min_qual'=>'Bachelor\'s in Kiswahili or related (2nd Class or above)','min_class'=>'lower_second','duration'=>'2 years','career_hint'=>'Language, Research, Teaching'],
        ['level'=>'masters','name'=>'MEd Educational Psychology','code'=>'MEd Ed. Psych.','school'=>'SESS','min_qual'=>'Bachelor\'s in Education or Psychology (2nd Class or above)','min_class'=>'lower_second','duration'=>'2 years','career_hint'=>'Educational Psychology, Counselling'],
        ['level'=>'masters','name'=>'MBA','code'=>'MBA','school'=>'SBE','min_qual'=>'Bachelor\'s degree + 2 years relevant work experience','min_class'=>'pass','duration'=>'2 years','career_hint'=>'Management, Entrepreneurship, Leadership'],
        ['level'=>'masters','name'=>'MSc Economics','code'=>'MSc Economics','school'=>'SBE','min_qual'=>'Bachelor\'s in Economics, Mathematics or Statistics (2nd Class or above)','min_class'=>'lower_second','duration'=>'2 years','career_hint'=>'Economic Policy, Research, Development'],
        ['level'=>'masters','name'=>'MSc IT','code'=>'MSc IT','school'=>'SCIT','min_qual'=>'Bachelor\'s in CS, IT or related (2nd Class or above)','min_class'=>'lower_second','duration'=>'2 years','career_hint'=>'Technology Leadership, Research'],
        ['level'=>'masters','name'=>'MSc Computer Science','code'=>'MSc CS','school'=>'SCIT','min_qual'=>'Bachelor\'s in Computer Science or related (2nd Class or above)','min_class'=>'lower_second','duration'=>'2 years','career_hint'=>'AI, Software Engineering, Data Science'],
        ['level'=>'masters','name'=>'MSc Biology','code'=>'MSc Biology','school'=>'SOS','min_qual'=>'Bachelor\'s in Biology or related Life Sciences (2nd Class or above)','min_class'=>'lower_second','duration'=>'2 years','career_hint'=>'Research, Healthcare, Environmental Science'],
        ['level'=>'masters','name'=>'MSc Chemistry','code'=>'MSc Chemistry','school'=>'SOS','min_qual'=>'Bachelor\'s in Chemistry or related (2nd Class or above)','min_class'=>'lower_second','duration'=>'2 years','career_hint'=>'Pharmaceutical, Research, Lab Science'],
        // Doctoral programmes — require a Master's degree
        ['level'=>'doctoral','name'=>'PhD Business Administration','code'=>'PhD Bus. Admin.','school'=>'SBE','min_qual'=>'Master\'s degree in Business or related field from a recognized university','min_class'=>'masters','duration'=>'3–4 years','career_hint'=>'Academia, Executive Leadership, Research'],
        ['level'=>'doctoral','name'=>'PhD Computer Science','code'=>'PhD CS','school'=>'SCIT','min_qual'=>'Master\'s degree in CS, IT or related field','min_class'=>'masters','duration'=>'3–4 years','career_hint'=>'AI Research, Academia, Tech Innovation'],
        ['level'=>'doctoral','name'=>'PhD Education','code'=>'PhD Education','school'=>'SESS','min_qual'=>'Master\'s degree in Education or related field','min_class'=>'masters','duration'=>'3–4 years','career_hint'=>'Educational Leadership, Academia, Policy'],
        ['level'=>'doctoral','name'=>'PhD Biology','code'=>'PhD Biology','school'=>'SOS','min_qual'=>'Master\'s degree in Biology or Life Sciences','min_class'=>'masters','duration'=>'3–4 years','career_hint'=>'Life Sciences Research, Conservation, Academia'],
    ];

    // Degree class hierarchy: higher index = higher qualification
    $degreeClassRank = ['pass'=>1,'third'=>2,'lower_second'=>3,'upper_second'=>4,'first'=>5,'masters'=>6];
    $degreeClass = $request->input('degree_class', 'lower_second'); // default assumed

    $eligible = [];
    $alternatives = [];

    // Helper: add cluster_check to a programme
    $withCluster = function(array $prog) use ($checkCluster) {
        $clusterCheck = isset($prog['cluster_requirements']) ? $checkCluster($prog['cluster_requirements']) : null;
        $clusterPass  = is_null($clusterCheck) ? null : collect($clusterCheck)->every(fn($r) => $r['pass']);
        return array_merge($prog, ['cluster_check' => $clusterCheck, 'cluster_pass' => $clusterPass]);
    };

    if ($pathway === 'undergraduate') {
        if ($qualType === 'KCSE') {
            foreach ($ugProgrammes as $prog) {
                $enriched = $withCluster($prog);
                if ($userPoints >= $prog['min_points']) {
                    $eligible[] = $enriched;
                } elseif ($userPoints >= ($prog['min_points'] - 1)) {
                    $alternatives[] = array_merge($enriched, ['note' => 'You are one sub-grade below the minimum. Consider re-sitting or Direct Entry (Module II).']);
                }
            }
        } else {
            foreach ($ugProgrammes as $prog) {
                $eligible[] = $withCluster($prog);
            }
        }

        $verdict = count($eligible) > 0 ? 'eligible' : ($userPoints >= 6 ? 'borderline' : 'not_eligible');
        $clusterFailed = !empty($subjectGradePoints) ? collect($eligible)->filter(fn($p) => $p['cluster_pass'] === false)->count() : 0;
        $message = match($verdict) {
            'eligible' => 'Based on your mean grade of ' . $meanGrade . ', you qualify to apply for ' . count($eligible) . ' undergraduate programme(s) at KAFU.'
                . ($clusterFailed > 0 ? ' Note: ' . $clusterFailed . ' programme(s) have unmet cluster subject requirements based on the subjects you entered.' : ''),
            'borderline' => 'Your grade is just below the minimum for most programmes. You may qualify for Module II (self-sponsored) pathways. Review alternative options below.',
            default => 'Your current grade may not meet standard entry requirements. Contact the Admissions Office — special consideration or diploma pathways may be available.',
        };

        return response()->json([
            'data' => [
                'verdict'              => $verdict,
                'pathway'              => $pathway,
                'mean_grade'           => $meanGrade,
                'grade_points'         => $userPoints,
                'subject_grades_provided' => !empty($subjectGradePoints),
                'message'              => $message,
                'eligible_programmes'  => $eligible,
                'alternative_options'  => $alternatives,
                'next_steps' => [
                    ['label' => 'Browse All Programmes', 'url' => '/programmes'],
                    ['label' => 'View Admissions Guide', 'url' => '/admissions'],
                    ['label' => 'Apply via KUCCPS', 'url' => 'https://students.kuccps.net/'],
                    ['label' => 'Contact Admissions', 'url' => '/contact'],
                ],
            ]
        ]);
    }

    if ($pathway === 'postgraduate') {
        $userClassRank = $degreeClassRank[$degreeClass] ?? 3;

        // Determine which programme levels the applicant can access
        // qualType here carries the applicant's highest qualification:
        //   'bachelors'  → may apply for Masters
        //   'masters_degree' → may apply for Doctoral
        //   anything else (KCSE etc.) → not eligible for postgraduate
        $qualifiesForMasters  = $qualType === 'bachelors';   // Bachelor's only → Masters programmes
        $qualifiesForDoctoral = $qualType === 'masters_degree'; // Master's → Doctoral programmes

        if (!$qualifiesForMasters && !$qualifiesForDoctoral) {
            return response()->json([
                'data' => [
                    'verdict' => 'not_eligible',
                    'pathway' => $pathway,
                    'mean_grade' => $meanGrade,
                    'grade_points' => $userPoints,
                    'subject_grades_provided' => false,
                    'message' => 'Postgraduate programmes at KAFU require a minimum of a Bachelor\'s degree. If you are currently completing your undergraduate degree, you may apply once you have graduated.',
                    'eligible_programmes' => [],
                    'alternative_options' => [],
                    'next_steps' => [
                        ['label' => 'Browse Undergraduate Programmes', 'url' => '/programmes'],
                        ['label' => 'View Admissions Guide', 'url' => '/admissions'],
                        ['label' => 'Contact Admissions', 'url' => '/contact'],
                    ],
                ]
            ]);
        }

        $pgEligible   = [];
        $pgAlternatives = [];

        foreach ($pgProgrammes as $prog) {
            $progLevel = $prog['level']; // 'masters' or 'doctoral'
            $progMinClassRank = $degreeClassRank[$prog['min_class']] ?? 3;

            if ($progLevel === 'masters' && $qualifiesForMasters) {
                if ($userClassRank >= $progMinClassRank) {
                    $pgEligible[] = array_merge($prog, ['cluster_check' => null, 'cluster_pass' => null]);
                } elseif ($userClassRank >= ($progMinClassRank - 1)) {
                    $pgAlternatives[] = array_merge($prog, ['cluster_check' => null, 'cluster_pass' => null,
                        'note' => 'Your degree classification is slightly below the standard minimum. Contact the Admissions Office — exceptional candidates may be considered.']);
                }
            } elseif ($progLevel === 'doctoral' && $qualifiesForDoctoral) {
                $pgEligible[] = array_merge($prog, ['cluster_check' => null, 'cluster_pass' => null]);
            } elseif ($progLevel === 'doctoral' && !$qualifiesForDoctoral) {
                // Show doctoral programmes as alternatives if user has a bachelors
                $pgAlternatives[] = array_merge($prog, ['cluster_check' => null, 'cluster_pass' => null,
                    'note' => 'PhD programmes require a Master\'s degree. Complete a Masters programme first.']);
            }
        }

        $pgVerdict = count($pgEligible) > 0 ? 'eligible' : (count($pgAlternatives) > 0 ? 'borderline' : 'not_eligible');
        $levelLabel = $qualifiesForDoctoral ? 'Doctoral (PhD)' : 'Masters';
        $pgMessage = $pgVerdict === 'eligible'
            ? 'Based on your qualifications, you are eligible for ' . count($pgEligible) . ' ' . $levelLabel . ' programme(s) at KAFU.'
            : 'Your current qualification or degree classification does not meet the standard requirements. Contact the Admissions Office for guidance.';

        return response()->json([
            'data' => [
                'verdict' => $pgVerdict,
                'pathway' => $pathway,
                'mean_grade' => $meanGrade,
                'grade_points' => $userPoints,
                'subject_grades_provided' => false,
                'qualification_type' => $qualType,
                'degree_class' => $degreeClass,
                'programme_level' => $qualifiesForDoctoral ? 'doctoral' : 'masters',
                'message' => $pgMessage,
                'eligible_programmes' => $pgEligible,
                'alternative_options' => $pgAlternatives,
                'next_steps' => [
                    ['label' => 'Apply via Student Portal', 'url' => 'https://portal.kafu.ac.ke'],
                    ['label' => 'View Postgraduate Guide', 'url' => '/admissions#postgraduate'],
                    ['label' => 'Contact Admissions', 'url' => '/contact'],
                ],
            ]
        ]);
    }

    return response()->json([
        'data' => [
            'verdict' => 'eligible',
            'pathway' => $pathway,
            'mean_grade' => $meanGrade,
            'grade_points' => $userPoints,
            'subject_grades_provided' => false,
            'message' => 'KAFU welcomes international and self-sponsored applicants. Contact the Admissions Office to confirm your qualification equivalency.',
            'eligible_programmes' => array_map($withCluster, $ugProgrammes),
            'alternative_options' => [],
            'next_steps' => [
                ['label' => 'Apply via Student Portal', 'url' => 'https://portal.kafu.ac.ke'],
                ['label' => 'International Students Guide', 'url' => '/international'],
                ['label' => 'Contact Admissions', 'url' => '/contact'],
            ],
        ]
    ]);
});

// ─── ADMISSIONS FEE & COST INTELLIGENCE ──────────────────────────────────────
Route::get('/admissions/fees', function () {
    return response()->json([
        'data' => [
            'currency' => 'KES',
            'academic_year' => '2025/2026',
            'pathways' => [
                [
                    'id' => 'government',
                    'title' => 'Government Sponsored (KUCCPS)',
                    'subtitle' => 'For KUCCPS-placed students',
                    'tuition_note' => 'Tuition is fully funded by the government. Students pay a government-regulated annual student contribution.',
                    'annual_items' => [
                        ['label' => 'Government Student Contribution', 'amount' => 16000, 'note' => 'Regulated by the State (Higher Education Loans Board rates)'],
                        ['label' => 'On-Campus Accommodation (optional)', 'amount' => 28000, 'note' => 'Single room per year. Shared rooms from KES 18,000.'],
                        ['label' => 'Medical / Health Levy', 'amount' => 5000, 'note' => 'Covers access to the university clinic and basic health services'],
                        ['label' => 'Activity & Sports Fee', 'amount' => 2500, 'note' => 'Student Union, clubs, and sports facilities'],
                        ['label' => 'Library & IT Levy', 'amount' => 2000, 'note' => 'Library resources, internet access, and computer labs'],
                        ['label' => 'Caution Money (once-off, refundable)', 'amount' => 5000, 'note' => 'Refundable deposit for accommodation or equipment'],
                    ],
                    'estimated_annual_total' => 58500,
                    'estimated_4yr_total' => 234000,
                    'helb_note' => 'KUCCPS students may apply for a Higher Education Loans Board (HELB) loan of up to KES 60,000 per year.',
                    'scholarships' => ['HELB Loan (up to KES 60,000/year)','KAFU Merit Scholarship (top 5% of intake)','KAFU Bursary (means-tested)','Constituency Development Fund (CDF) Bursary','County Government Bursaries'],
                ],
                [
                    'id' => 'self-sponsored',
                    'title' => 'Self-Sponsored (Module II)',
                    'subtitle' => 'For direct-entry and working professional students',
                    'tuition_note' => 'Tuition varies by school and programme. Figures below represent typical costs.',
                    'annual_items' => [
                        ['label' => 'Tuition Fee (SESS / SBE / SOS)', 'amount' => 48000, 'note' => 'Per year. Health Sciences programmes are higher.'],
                        ['label' => 'Tuition Fee (SCIT)', 'amount' => 55000, 'note' => 'Computing and IT programmes'],
                        ['label' => 'Tuition Fee (SHS)', 'amount' => 72000, 'note' => 'Nursing, Optometry, Clinical Medicine'],
                        ['label' => 'On-Campus Accommodation (optional)', 'amount' => 28000, 'note' => 'Single room per year'],
                        ['label' => 'Medical / Health Levy', 'amount' => 5000, 'note' => ''],
                        ['label' => 'Activity & Sports Fee', 'amount' => 2500, 'note' => ''],
                        ['label' => 'Library & IT Levy', 'amount' => 2000, 'note' => ''],
                    ],
                    'estimated_annual_total' => 90000,
                    'estimated_4yr_total' => 360000,
                    'helb_note' => 'Self-sponsored students may apply for HELB loans. Applications open annually on the HELB portal.',
                    'scholarships' => ['HELB Loan (up to KES 50,000/year for self-sponsored)','KAFU Bursary (means-tested)','CDF Bursary','County Government Bursaries','Church / Quaker Foundation Scholarships'],
                ],
                [
                    'id' => 'postgraduate',
                    'title' => 'Postgraduate (Masters & PhD)',
                    'subtitle' => 'For Masters and Doctoral candidates',
                    'tuition_note' => 'Postgraduate fees vary by programme type (coursework vs research) and school.',
                    'annual_items' => [
                        ['label' => 'Masters Tuition (SESS / SBE)', 'amount' => 72000, 'note' => 'Per year for coursework Masters'],
                        ['label' => 'Masters Tuition (SCIT / SOS)', 'amount' => 80000, 'note' => 'Per year for MSc programmes'],
                        ['label' => 'MBA Tuition', 'amount' => 85000, 'note' => 'Per year'],
                        ['label' => 'PhD Tuition', 'amount' => 90000, 'note' => 'Per year (all schools)'],
                        ['label' => 'Research Levy / Supervision Fee', 'amount' => 15000, 'note' => 'Applicable to research-track students'],
                        ['label' => 'On-Campus Accommodation (optional)', 'amount' => 30000, 'note' => 'Postgraduate halls — priority given'],
                        ['label' => 'Library & IT Levy', 'amount' => 3000, 'note' => ''],
                    ],
                    'estimated_annual_total' => 128000,
                    'estimated_4yr_total' => 256000,
                    'helb_note' => 'Postgraduate HELB loans are available for qualified candidates. Applications open annually.',
                    'scholarships' => ['HELB Postgraduate Loan','KAFU Research Scholarship (competitive)','AfDB / PASET Scholarship','WHO / Global Health Scholarships (SHS)','British Council Scholarships (International)'],
                ],
                [
                    'id' => 'international',
                    'title' => 'International Students',
                    'subtitle' => 'For students from outside Kenya',
                    'tuition_note' => 'International students pay tuition in USD. Below are the annual USD equivalents.',
                    'annual_items' => [
                        ['label' => 'Tuition (Undergraduate — Arts / Social Sciences)', 'amount' => 1800, 'note' => 'Per year in USD'],
                        ['label' => 'Tuition (Undergraduate — Sciences / Health)', 'amount' => 2500, 'note' => 'Per year in USD'],
                        ['label' => 'Tuition (Postgraduate Masters)', 'amount' => 3200, 'note' => 'Per year in USD'],
                        ['label' => 'Tuition (PhD)', 'amount' => 3600, 'note' => 'Per year in USD'],
                        ['label' => 'International Student Levy', 'amount' => 500, 'note' => 'USD — covers registration, orientation, and student services'],
                        ['label' => 'On-Campus Accommodation', 'amount' => 1200, 'note' => 'USD per year — single furnished room'],
                        ['label' => 'Medical Insurance', 'amount' => 300, 'note' => 'USD per year — mandatory for international students'],
                    ],
                    'estimated_annual_total_usd' => 4000,
                    'helb_note' => 'International students are not eligible for HELB. Students may seek scholarships from their home country or international bodies.',
                    'scholarships' => ['Kenyan Government Scholarship (via bilateral agreements)','African Union Scholarships','DAAD (German)','British Council Scholarships','Home Country Government Scholarships'],
                ],
            ],
            'payment_methods' => [
                ['method' => 'M-Pesa', 'details' => 'Paybill Number: 123456 (KAFU Finance Office). Include your student ID as account number.'],
                ['method' => 'Bank Deposit / Transfer', 'details' => 'Kenya Commercial Bank (KCB) — Account: Kaimosi Friends University, A/C No: 1234567890, Branch: Kaimosi'],
                ['method' => 'Cooperative Bank', 'details' => 'Cooperative Bank — Account: 0123456789, Branch: Kakamega'],
                ['method' => 'Cash (Finance Office)', 'details' => 'Finance Office, Ground Floor, Administration Block. Mon–Fri, 8:00 AM – 4:00 PM.'],
            ],
            'note' => 'All fees are reviewed annually. The figures above reflect 2025/2026 rates. Prospective students should confirm current rates with the Finance Office before payment.',
        ]
    ]);
});


// ─────────────────────────────────────────────────────────────────────────────
// ADMISSIONS ADMIN ROUTES
// ─────────────────────────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum'])->prefix('admin/admissions')->group(function () {

    // ── Document Uploads ────────────────────────────────────────────────────
    Route::get('/uploads', function (Illuminate\Http\Request $request) {
        $q = \Illuminate\Support\Facades\DB::table('admissions_uploads');
        if ($s = $request->query('status')) $q->where('status', $s);
        if ($t = $request->query('type'))   $q->where('document_type', $t);
        if ($k = $request->query('search')) $q->where('file_name', 'like', "%$k%");
        $total   = $q->count();
        $perPage = (int) ($request->query('per_page', 20));
        $page    = (int) ($request->query('page', 1));
        $items   = $q->orderByDesc('created_at')->skip(($page - 1) * $perPage)->take($perPage)->get();
        return response()->json([
            'data'         => $items,
            'total'        => $total,
            'current_page' => $page,
            'last_page'    => max(1, (int) ceil($total / $perPage)),
        ]);
    });

    Route::get('/uploads/{ref}', function (string $ref) {
        $item = \Illuminate\Support\Facades\DB::table('admissions_uploads')->where('reference_id', $ref)->first();
        abort_if(!$item, 404, 'Upload not found');
        return response()->json(['data' => $item]);
    });

    Route::patch('/uploads/{ref}/status', function (Illuminate\Http\Request $request, string $ref) {
        $request->validate(['status' => 'required|in:pending,verified,rejected', 'notes' => 'nullable|string|max:500']);
        $reviewer = optional(auth()->user())->name ?? 'Admin';
        $updated = \Illuminate\Support\Facades\DB::table('admissions_uploads')
            ->where('reference_id', $ref)
            ->update([
                'status'         => $request->input('status'),
                'reviewed_by'    => $reviewer,
                'reviewer_notes' => $request->input('notes'),
                'reviewed_at'    => now(),
                'updated_at'     => now(),
            ]);
        abort_if(!$updated, 404, 'Upload not found');
        return response()->json(['data' => ['message' => 'Status updated.']]);
    });

    Route::delete('/uploads/{ref}', function (string $ref) {
        \Illuminate\Support\Facades\DB::table('admissions_uploads')->where('reference_id', $ref)->delete();
        return response()->json(null, 204);
    });

    // ── Postgraduate Programmes ─────────────────────────────────────────────
    Route::get('/pg-programmes', function () {
        $rows = \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')
            ->orderBy('level')->orderBy('sort_order')->orderBy('name')->get();
        return response()->json(['data' => $rows]);
    });

    Route::post('/pg-programmes', function (Illuminate\Http\Request $request) {
        $data = $request->validate([
            'code'        => 'required|string|max:30|unique:admissions_pg_programmes,code',
            'name'        => 'required|string|max:120',
            'level'       => 'required|in:masters,doctoral',
            'school'      => 'required|in:SESS,SBE,SCIT,SOS,SHS',
            'duration'    => 'required|string|max:30',
            'min_qual'    => 'required|string|max:255',
            'min_class'   => 'required|in:pass,third,lower_second,upper_second,first,masters',
            'career_hint' => 'nullable|string|max:120',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer',
        ]);
        $data['is_active']  = $data['is_active'] ?? true;
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['created_at'] = now();
        $data['updated_at'] = now();
        $id = \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')->insertGetId($data);
        return response()->json(['data' => \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')->find($id)], 201);
    });

    Route::put('/pg-programmes/{id}', function (Illuminate\Http\Request $request, int $id) {
        $row = \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')->find($id);
        abort_if(!$row, 404, 'Programme not found');
        $data = $request->validate([
            'code'        => "required|string|max:30|unique:admissions_pg_programmes,code,$id",
            'name'        => 'required|string|max:120',
            'level'       => 'required|in:masters,doctoral',
            'school'      => 'required|in:SESS,SBE,SCIT,SOS,SHS',
            'duration'    => 'required|string|max:30',
            'min_qual'    => 'required|string|max:255',
            'min_class'   => 'required|in:pass,third,lower_second,upper_second,first,masters',
            'career_hint' => 'nullable|string|max:120',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer',
        ]);
        $data['updated_at'] = now();
        \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')->where('id', $id)->update($data);
        return response()->json(['data' => \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')->find($id)]);
    });

    Route::delete('/pg-programmes/{id}', function (int $id) {
        \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')->where('id', $id)->delete();
        return response()->json(null, 204);
    });

    // Seed from hardcoded API list (one-time operation)
    Route::post('/pg-programmes/seed', function () {
        $exists = \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')->count();
        if ($exists > 0) return response()->json(['data' => ['message' => 'Already seeded. Clear existing records first.', 'count' => $exists]]);
        $seed = [
            ['code'=>'MA Religion','name'=>'MA Religion','level'=>'masters','school'=>'SESS','duration'=>'2 years','min_qual'=>"Bachelor's degree, 2nd Class Honours or above",'min_class'=>'lower_second','career_hint'=>'Theology, Academia, Development','sort_order'=>1],
            ['code'=>'MA English','name'=>'MA English Language','level'=>'masters','school'=>'SESS','duration'=>'2 years','min_qual'=>"Bachelor's in English, Linguistics or related",'min_class'=>'lower_second','career_hint'=>'Language Studies, Research, Teaching','sort_order'=>2],
            ['code'=>'MA Kiswahili','name'=>'MA Kiswahili','level'=>'masters','school'=>'SESS','duration'=>'2 years','min_qual'=>"Bachelor's in Kiswahili or related (2nd Class or above)",'min_class'=>'lower_second','career_hint'=>'Language, Research, Teaching','sort_order'=>3],
            ['code'=>'MEd Ed. Psych.','name'=>'MEd Educational Psychology','level'=>'masters','school'=>'SESS','duration'=>'2 years','min_qual'=>"Bachelor's in Education or Psychology (2nd Class or above)",'min_class'=>'lower_second','career_hint'=>'Educational Psychology, Counselling','sort_order'=>4],
            ['code'=>'MBA','name'=>'MBA','level'=>'masters','school'=>'SBE','duration'=>'2 years','min_qual'=>"Bachelor's degree + 2 years relevant work experience",'min_class'=>'pass','career_hint'=>'Management, Entrepreneurship, Leadership','sort_order'=>5],
            ['code'=>'MSc Economics','name'=>'MSc Economics','level'=>'masters','school'=>'SBE','duration'=>'2 years','min_qual'=>"Bachelor's in Economics, Mathematics or Statistics (2nd Class or above)",'min_class'=>'lower_second','career_hint'=>'Economic Policy, Research, Development','sort_order'=>6],
            ['code'=>'MSc IT','name'=>'MSc IT','level'=>'masters','school'=>'SCIT','duration'=>'2 years','min_qual'=>"Bachelor's in CS, IT or related (2nd Class or above)",'min_class'=>'lower_second','career_hint'=>'Technology Leadership, Research','sort_order'=>7],
            ['code'=>'MSc CS','name'=>'MSc Computer Science','level'=>'masters','school'=>'SCIT','duration'=>'2 years','min_qual'=>"Bachelor's in Computer Science or related (2nd Class or above)",'min_class'=>'lower_second','career_hint'=>'AI, Software Engineering, Data Science','sort_order'=>8],
            ['code'=>'MSc Biology','name'=>'MSc Biology','level'=>'masters','school'=>'SOS','duration'=>'2 years','min_qual'=>"Bachelor's in Biology or related Life Sciences (2nd Class or above)",'min_class'=>'lower_second','career_hint'=>'Research, Healthcare, Environmental Science','sort_order'=>9],
            ['code'=>'MSc Chemistry','name'=>'MSc Chemistry','level'=>'masters','school'=>'SOS','duration'=>'2 years','min_qual'=>"Bachelor's in Chemistry or related (2nd Class or above)",'min_class'=>'lower_second','career_hint'=>'Pharmaceutical, Research, Lab Science','sort_order'=>10],
            ['code'=>'PhD Bus. Admin.','name'=>'PhD Business Administration','level'=>'doctoral','school'=>'SBE','duration'=>'3–4 years','min_qual'=>"Master's degree in Business or related field from a recognized university",'min_class'=>'masters','career_hint'=>'Academia, Executive Leadership, Research','sort_order'=>11],
            ['code'=>'PhD CS','name'=>'PhD Computer Science','level'=>'doctoral','school'=>'SCIT','duration'=>'3–4 years','min_qual'=>"Master's degree in CS, IT or related field",'min_class'=>'masters','career_hint'=>'AI Research, Academia, Tech Innovation','sort_order'=>12],
            ['code'=>'PhD Education','name'=>'PhD Education','level'=>'doctoral','school'=>'SESS','duration'=>'3–4 years','min_qual'=>"Master's degree in Education or related field",'min_class'=>'masters','career_hint'=>'Educational Leadership, Academia, Policy','sort_order'=>13],
            ['code'=>'PhD Biology','name'=>'PhD Biology','level'=>'doctoral','school'=>'SOS','duration'=>'3–4 years','min_qual'=>"Master's degree in Biology or Life Sciences",'min_class'=>'masters','career_hint'=>'Life Sciences Research, Conservation, Academia','sort_order'=>14],
        ];
        $now = now();
        foreach ($seed as &$row) { $row['is_active'] = true; $row['created_at'] = $now; $row['updated_at'] = $now; }
        \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')->insert($seed);
        return response()->json(['data' => ['message' => 'Seeded '.count($seed).' programmes.', 'count' => count($seed)]]);
    });

    // ── Admissions Settings ──────────────────────────────────────────────────
    Route::get('/settings', function () {
        $rows = \Illuminate\Support\Facades\DB::table('admissions_settings')->get()->keyBy('key');
        $defaults = [
            ['key'=>'ug_intake_open','label'=>'Undergraduate Intake Open','type'=>'boolean','value'=>'1'],
            ['key'=>'pg_intake_open','label'=>'Postgraduate Intake Open','type'=>'boolean','value'=>'1'],
            ['key'=>'ug_deadline','label'=>'Undergraduate Application Deadline','type'=>'date','value'=>'2026-07-15'],
            ['key'=>'pg_deadline','label'=>'Postgraduate Application Deadline','type'=>'date','value'=>'2026-06-30'],
            ['key'=>'kuccps_cutoff','label'=>'KUCCPS Minimum Mean Grade','type'=>'text','value'=>'C+'],
            ['key'=>'module2_cutoff','label'=>'Module II (Self-Sponsored) Minimum Grade','type'=>'text','value'=>'C'],
            ['key'=>'pg_masters_cutoff','label'=>'Masters Minimum Degree Class','type'=>'text','value'=>'lower_second'],
            ['key'=>'ug_intake_note','label'=>'Undergraduate Intake Notice (shown on website)','type'=>'text','value'=>'Applications for the 2026/2027 academic year are now open via KUCCPS.'],
            ['key'=>'pg_intake_note','label'=>'Postgraduate Intake Notice','type'=>'text','value'=>'Masters and PhD applications for January 2027 intake are now open. Apply via the Student Portal.'],
            ['key'=>'admissions_contact_email','label'=>'Admissions Office Email','type'=>'text','value'=>'admissions@kafu.ac.ke'],
            ['key'=>'admissions_contact_phone','label'=>'Admissions Office Phone','type'=>'text','value'=>'+254 777 373 633'],
        ];
        $result = [];
        foreach ($defaults as $d) {
            $existing = $rows[$d['key']] ?? null;
            $result[] = $existing
                ? ['key'=>$d['key'],'label'=>$d['label'],'type'=>$d['type'],'value'=>$existing->value]
                : $d;
        }
        return response()->json(['data' => $result]);
    });

    Route::put('/settings', function (Illuminate\Http\Request $request) {
        $settings = $request->validate(['settings' => 'required|array', 'settings.*.key' => 'required|string', 'settings.*.value' => 'nullable|string']);
        $now = now();
        foreach ($settings['settings'] as $s) {
            \Illuminate\Support\Facades\DB::table('admissions_settings')->updateOrInsert(
                ['key' => $s['key']],
                ['value' => $s['value'] ?? '', 'updated_at' => $now, 'created_at' => $now]
            );
        }
        return response()->json(['data' => ['message' => 'Settings saved.']]);
    });

    // ── Upload stats for dashboard ──────────────────────────────────────────
    Route::get('/stats', function () {
        $total   = \Illuminate\Support\Facades\DB::table('admissions_uploads')->count();
        $pending  = \Illuminate\Support\Facades\DB::table('admissions_uploads')->where('status','pending')->count();
        $verified = \Illuminate\Support\Facades\DB::table('admissions_uploads')->where('status','verified')->count();
        $rejected = \Illuminate\Support\Facades\DB::table('admissions_uploads')->where('status','rejected')->count();
        $programmes = \Illuminate\Support\Facades\DB::table('admissions_pg_programmes')->count();
        return response()->json(['data' => compact('total','pending','verified','rejected','programmes')]);
    });
});

// =============================================================================
// ADMISSIONS APPLICATION MODULE — PUBLIC ROUTES
// =============================================================================

Route::prefix('admissions-app')->group(function () {

    // ── Open Intakes ──────────────────────────────────────────────────────────
    Route::get('/intakes/open', function () {
        $now = now();
        $intakes = \Illuminate\Support\Facades\DB::table('admissions_intakes')
            ->where('is_published', true)
            ->whereIn('status', ['open', 'closing_soon', 'extended'])
            ->orWhere(function ($q) use ($now) {
                $q->where('is_published', true)
                  ->where('open_at', '<=', $now)
                  ->where('close_at', '>=', $now);
            })
            ->orderBy('open_at', 'asc')
            ->get();
        return response()->json(['data' => $intakes]);
    });

    // All published intakes (for programme discovery)
    Route::get('/intakes', function () {
        $intakes = \Illuminate\Support\Facades\DB::table('admissions_intakes')
            ->where('is_published', true)
            ->orderBy('open_at', 'desc')
            ->get();
        return response()->json(['data' => $intakes]);
    });

    // ── Pathways ──────────────────────────────────────────────────────────────
    Route::get('/pathways', function () {
        $pathways = \Illuminate\Support\Facades\DB::table('admission_pathways')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
        return response()->json(['data' => $pathways]);
    });

    // ── Programme Catalogue ───────────────────────────────────────────────────
    Route::get('/programmes', function (Illuminate\Http\Request $request) {
        $q = \Illuminate\Support\Facades\DB::table('admission_programmes')
            ->where('is_active', true);

        if ($request->filled('level')) {
            $q->where('level', $request->level);
        }
        if ($request->filled('school')) {
            $q->where('school_code', $request->school);
        }
        if ($request->filled('pathway')) {
            $q->whereJsonContains('available_pathways', $request->pathway);
        }
        if ($request->filled('intake')) {
            $q->whereJsonContains('available_intakes', $request->intake);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $q->where(function ($sq) use ($s) {
                $sq->where('programme_name', 'like', "%{$s}%")
                   ->orWhere('school_code', 'like', "%{$s}%")
                   ->orWhere('department', 'like', "%{$s}%");
            });
        }

        $programmes = $q->orderBy('school_code')->orderBy('programme_name')->get();
        return response()->json(['data' => $programmes]);
    });

    // ── KUCCPS Student Verification Portal ───────────────────────────────────
    $kv = \App\Http\Controllers\KuccpsVerificationController::class;
    Route::post('/kuccps/verify-placement',                              [$kv, 'verify'])->middleware('throttle:10,1');
    Route::get('/kuccps/placement/{token}',                              [$kv, 'placementDetails']);
    Route::get('/kuccps/admission-letter/{token}/download',              [$kv, 'downloadLetter']);

    // ── Intake Calendar (all published) ───────────────────────────────────────
    Route::get('/calendar', function () {
        $intakes = \Illuminate\Support\Facades\DB::table('admissions_intakes')
            ->where('is_published', true)
            ->orderBy('open_at', 'asc')
            ->get();
        return response()->json(['data' => $intakes]);
    });

    // ── Admissions Analytics ───────────────────────────────────────────────────
    Route::get('/analytics', function () {
        $total     = \Illuminate\Support\Facades\DB::table('admissions_online_applications')->count();
        $submitted = \Illuminate\Support\Facades\DB::table('admissions_online_applications')->where('status', 'submitted')->count();
        $reviewing = \Illuminate\Support\Facades\DB::table('admissions_online_applications')->where('status', 'under_review')->count();
        $offered   = \Illuminate\Support\Facades\DB::table('admissions_online_applications')->where('status', 'offered')->count();
        $rejected  = \Illuminate\Support\Facades\DB::table('admissions_online_applications')->where('status', 'rejected')->count();
        $paid      = \Illuminate\Support\Facades\DB::table('admissions_online_applications')->where('payment_status', 'paid')->count();

        $byType   = \Illuminate\Support\Facades\DB::table('admissions_online_applications')
            ->selectRaw('applicant_type, COUNT(*) as count')
            ->groupBy('applicant_type')->get();
        $bySchool = \Illuminate\Support\Facades\DB::table('admissions_online_applications')
            ->selectRaw('school_code, COUNT(*) as count')
            ->groupBy('school_code')->get();
        $openIntakes = \Illuminate\Support\Facades\DB::table('admissions_intakes')
            ->where('is_published', true)
            ->whereIn('status', ['open', 'closing_soon', 'extended'])
            ->get();

        return response()->json(['data' => [
            'totals'       => compact('total', 'submitted', 'reviewing', 'offered', 'rejected', 'paid'),
            'by_type'      => $byType,
            'by_school'    => $bySchool,
            'open_intakes' => $openIntakes,
        ]]);
    });

    // ── Submit Online Application (flat, no auth required) ────────────────────
    Route::post('/apply', function (Illuminate\Http\Request $request) {
        $data = $request->validate([
            'intake_id'           => 'required|integer',
            'pathway_code'        => 'required|string',
            'first_name'          => 'required|string|max:100',
            'last_name'           => 'required|string|max:100',
            'other_names'         => 'nullable|string|max:100',
            'gender'              => 'nullable|string|max:10',
            'date_of_birth'       => 'nullable|string',
            'nationality'         => 'nullable|string|max:80',
            'id_passport_number'  => 'nullable|string|max:40',
            'phone'               => 'required|string|max:20',
            'email'               => 'required|email|max:150',
            'postal_address'      => 'nullable|string|max:300',
            'county'              => 'nullable|string|max:80',
            'kcse_index_number'   => 'nullable|string|max:30',
            'kcse_year'           => 'nullable|string|max:4',
            'mean_grade'          => 'nullable|string|max:5',
            'degree_institution'  => 'nullable|string|max:200',
            'degree_class'        => 'nullable|string|max:80',
            'degree_year'         => 'nullable|string|max:4',
            'degree_field'        => 'nullable|string|max:150',
            'school_code'         => 'nullable|string|max:10',
            'programme_code'      => 'nullable|string|max:30',
            'programme_name'      => 'nullable|string|max:200',
            'second_choice_code'  => 'nullable|string|max:30',
            'second_choice_name'  => 'nullable|string|max:200',
            'payment_phone'       => 'nullable|string|max:20',
            'docs_declared'       => 'nullable|array',
        ]);

        // Validate intake exists and is open
        $intake = \Illuminate\Support\Facades\DB::table('admissions_intakes')
            ->where('id', $data['intake_id'])
            ->where('is_published', true)
            ->first();
        if (!$intake) {
            return response()->json(['error' => 'Selected intake is not available.'], 422);
        }

        // Generate reference: KAFU-YYYY-XXXXXX
        $year  = now()->format('Y');
        $count = \Illuminate\Support\Facades\DB::table('admissions_online_applications')->count() + 1;
        $ref   = 'KAFU-' . $year . '-' . str_pad($count, 6, '0', STR_PAD_LEFT);

        $applicantType = match($data['pathway_code']) {
            'kuccps'   => 'kuccps',
            'ug_self'  => 'self_sponsored',
            'masters'  => 'masters',
            'phd'      => 'phd',
            default    => 'self_sponsored',
        };

        \Illuminate\Support\Facades\DB::table('admissions_online_applications')->insert([
            'reference_number'    => $ref,
            'applicant_type'      => $applicantType,
            'status'              => 'submitted',
            'first_name'          => $data['first_name'],
            'last_name'           => $data['last_name'],
            'other_names'         => $data['other_names'] ?? null,
            'gender'              => $data['gender'] ?? null,
            'date_of_birth'       => $data['date_of_birth'] ?? null,
            'nationality'         => $data['nationality'] ?? 'Kenyan',
            'id_passport_number'  => $data['id_passport_number'] ?? null,
            'phone'               => $data['phone'],
            'email'               => $data['email'],
            'postal_address'      => $data['postal_address'] ?? null,
            'county'              => $data['county'] ?? null,
            'kcse_index_number'   => $data['kcse_index_number'] ?? null,
            'kcse_year'           => $data['kcse_year'] ?? null,
            'mean_grade'          => $data['mean_grade'] ?? null,
            'degree_institution'  => $data['degree_institution'] ?? null,
            'degree_class'        => $data['degree_class'] ?? null,
            'degree_year'         => $data['degree_year'] ?? null,
            'degree_field'        => $data['degree_field'] ?? null,
            'school_code'         => $data['school_code'] ?? null,
            'programme_code'      => $data['programme_code'] ?? null,
            'programme_name'      => $data['programme_name'] ?? null,
            'second_choice_code'  => $data['second_choice_code'] ?? null,
            'second_choice_name'  => $data['second_choice_name'] ?? null,
            'payment_status'      => 'pending',
            'payment_phone'       => $data['payment_phone'] ?? null,
            'extra_data'          => json_encode(['docs_declared' => $data['docs_declared'] ?? [], 'intake_name' => $intake->name]),
            'submitted_at'        => now(),
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);

        return response()->json(['data' => ['reference_number' => $ref, 'message' => 'Application submitted successfully.']]);
    })->middleware('throttle:20,1');

    // ── Simulate M-Pesa STK Push ───────────────────────────────────────────────
    Route::post('/apply/{ref}/pay', function (Illuminate\Http\Request $request, string $ref) {
        $app = \Illuminate\Support\Facades\DB::table('admissions_online_applications')
            ->where('reference_number', $ref)->first();
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        $data    = $request->validate(['phone' => 'required|string|max:20']);
        $payRef  = 'MPESA-' . strtoupper(\Illuminate\Support\Str::random(10));

        \Illuminate\Support\Facades\DB::table('admissions_online_applications')
            ->where('reference_number', $ref)
            ->update(['payment_status' => 'initiated', 'payment_phone' => $data['phone'], 'payment_reference' => $payRef, 'updated_at' => now()]);

        return response()->json(['payment_reference' => $payRef, 'message' => "M-Pesa STK Push sent to {$data['phone']}. Enter your M-Pesa PIN to complete payment."]);
    });

    // ── Confirm Payment (sandbox simulation) ──────────────────────────────────
    Route::post('/apply/{ref}/pay/confirm', function (string $ref) {
        $app = \Illuminate\Support\Facades\DB::table('admissions_online_applications')
            ->where('reference_number', $ref)->first();
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        \Illuminate\Support\Facades\DB::table('admissions_online_applications')
            ->where('reference_number', $ref)
            ->update(['payment_status' => 'paid', 'payment_at' => now(), 'updated_at' => now()]);

        return response()->json(['message' => 'Payment confirmed.', 'status' => 'paid']);
    });

    // ── Public Application Tracking ────────────────────────────────────────────
    Route::get('/track/{ref}', function (string $ref) {
        $app = \Illuminate\Support\Facades\DB::table('admissions_online_applications')
            ->where('reference_number', $ref)->first();
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        $messages = [
            'draft'              => 'Your application is saved as a draft and has not yet been submitted.',
            'awaiting_payment'   => 'Your application form is complete. Please pay the application fee via M-Pesa Paybill 123456, Account: ' . $app->reference_number . '.',
            'submitted'          => 'Your application has been received and is being processed by the Admissions Office.',
            'under_review'       => 'Your application is currently under review by the Admissions Committee.',
            'documents_queried'  => 'The Admissions Office requires additional documentation. Please check your email for details and submit the requested documents as soon as possible.',
            'documents_verified' => 'Your submitted documents have been verified. Your application is proceeding to the next stage.',
            'eligible'           => 'Your application has been assessed and you are eligible for admission. An offer letter will be issued shortly.',
            'offered'            => 'Congratulations! An offer of admission has been issued. Please check your email and accept your offer within 14 days via the Student Portal.',
            'offered_admission'  => 'Congratulations! An offer of admission has been issued. Please check your email and accept your offer within 14 days via the Student Portal.',
            'accepted'           => 'Your admission offer has been accepted. Welcome to KAFU! Joining instructions will be sent to your email.',
            'deferred'           => 'Your application has been deferred to the next intake. You will be contacted with further details.',
            'rejected'           => 'We regret that your application was unsuccessful for this intake. You may apply for a different programme or a future intake.',
        ];

        return response()->json(['data' => [
            'reference_number' => $app->reference_number,
            'applicant_name'   => trim($app->first_name . ' ' . ($app->other_names ? $app->other_names . ' ' : '') . $app->last_name),
            'applicant_type'   => $app->applicant_type,
            'programme_name'   => $app->programme_name,
            'school_code'      => $app->school_code,
            'status'           => $app->status,
            'payment_status'   => $app->payment_status,
            'submitted_at'     => $app->submitted_at,
            'status_message'   => $messages[$app->status] ?? $messages['submitted'],
        ]]);
    });
});

// =============================================================================
// APPLICATIONS — APPLICANT PORTAL (token-based auth via portal_token)
// =============================================================================

Route::prefix('applications')->group(function () {

    // Middleware helper: resolve applicant from Bearer token
    function resolveApplicant(Illuminate\Http\Request $request) {
        $token = $request->bearerToken();
        if (!$token) return null;
        return \Illuminate\Support\Facades\DB::table('applicants')
            ->where('portal_token', $token)
            ->first();
    }

    // ── Create/Resume Applicant Account & Start Application ───────────────────
    Route::post('/register', function (Illuminate\Http\Request $request) {
        $data = $request->validate([
            'email'            => 'required|email',
            'password'         => 'required|min:8',
            'full_name'        => 'required|string|max:200',
            'phone'            => 'nullable|string|max:20',
        ]);

        $existing = \Illuminate\Support\Facades\DB::table('applicants')
            ->where('email', $data['email'])
            ->first();

        if ($existing) {
            return response()->json(['error' => 'An account with this email already exists. Please log in.'], 409);
        }

        $token = \Illuminate\Support\Str::random(64);
        $id = \Illuminate\Support\Facades\DB::table('applicants')->insertGetId([
            'email'          => $data['email'],
            'full_name'      => $data['full_name'],
            'phone'          => $data['phone'] ?? null,
            'password_hash'  => password_hash($data['password'], PASSWORD_DEFAULT),
            'portal_token'   => $token,
            'email_verified' => false,
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);

        return response()->json(['token' => $token, 'applicant_id' => $id]);
    });

    Route::post('/login', function (Illuminate\Http\Request $request) {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $applicant = \Illuminate\Support\Facades\DB::table('applicants')
            ->where('email', $data['email'])
            ->first();

        if (!$applicant || !password_verify($data['password'], $applicant->password_hash)) {
            return response()->json(['error' => 'Invalid email or password.'], 401);
        }

        // Refresh token on login
        $token = \Illuminate\Support\Str::random(64);
        \Illuminate\Support\Facades\DB::table('applicants')
            ->where('id', $applicant->id)
            ->update(['portal_token' => $token, 'updated_at' => now()]);

        return response()->json(['token' => $token, 'applicant_id' => $applicant->id, 'full_name' => $applicant->full_name]);
    });

    // ── Start Application (creates draft) ─────────────────────────────────────
    Route::post('/start', function (Illuminate\Http\Request $request) {
        $applicant = resolveApplicant($request);
        if (!$applicant) {
            return response()->json(['error' => 'Authentication required.'], 401);
        }

        $data = $request->validate([
            'intake_id'   => 'required|integer',
            'programme_id' => 'required|integer',
            'pathway_id'  => 'required|integer',
        ]);

        // Validate intake is open
        $intake = \Illuminate\Support\Facades\DB::table('admissions_intakes')
            ->where('id', $data['intake_id'])
            ->where('is_published', true)
            ->first();
        if (!$intake) {
            return response()->json(['error' => 'Selected intake is not available.'], 422);
        }
        $now = now();
        if ($intake->close_at && $now->gt($intake->close_at)) {
            return response()->json(['error' => 'Applications for this intake are closed. Please select another available intake or contact Admissions.'], 422);
        }

        // Validate programme
        $programme = \Illuminate\Support\Facades\DB::table('admission_programmes')
            ->where('id', $data['programme_id'])
            ->where('is_active', true)
            ->first();
        if (!$programme) {
            return response()->json(['error' => 'Selected programme is not available.'], 422);
        }

        $pathway = \Illuminate\Support\Facades\DB::table('admission_pathways')
            ->where('id', $data['pathway_id'])
            ->where('is_active', true)
            ->first();
        if (!$pathway) {
            return response()->json(['error' => 'Selected pathway is not valid.'], 422);
        }

        // Check for existing active application for same programme/intake
        $existing = \Illuminate\Support\Facades\DB::table('applications')
            ->where('applicant_id', $applicant->id)
            ->where('intake_id', $data['intake_id'])
            ->where('programme_id', $data['programme_id'])
            ->whereNotIn('status', ['cancelled', 'archived'])
            ->first();
        if ($existing) {
            return response()->json(['reference' => $existing->reference, 'message' => 'You have an existing application for this programme.']);
        }

        $ref = (string)\Illuminate\Support\Str::uuid();
        \Illuminate\Support\Facades\DB::table('applications')->insert([
            'reference'      => $ref,
            'applicant_id'   => $applicant->id,
            'intake_id'      => $data['intake_id'],
            'programme_id'   => $data['programme_id'],
            'pathway_id'     => $data['pathway_id'],
            'level'          => $programme->level,
            'status'         => 'draft',
            'payment_status' => 'pending',
            'created_at'     => $now,
            'updated_at'     => $now,
        ]);

        // Status log
        \Illuminate\Support\Facades\DB::table('application_status_logs')->insert([
            'application_id' => \Illuminate\Support\Facades\DB::table('applications')->where('reference',$ref)->value('id'),
            'from_status'    => null,
            'to_status'      => 'draft',
            'changed_by_type' => 'applicant',
            'changed_by'     => $applicant->id,
            'reason'         => 'Application started',
            'created_at'     => $now,
            'updated_at'     => $now,
        ]);

        return response()->json(['reference' => $ref]);
    });

    // Helper to get application owned by applicant
    function getOwnedApplication(string $ref, int $applicantId) {
        return \Illuminate\Support\Facades\DB::table('applications')
            ->where('reference', $ref)
            ->where('applicant_id', $applicantId)
            ->first();
    }

    // ── Get Application State ─────────────────────────────────────────────────
    Route::get('/{ref}', function (Illuminate\Http\Request $request, string $ref) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        $programme = \Illuminate\Support\Facades\DB::table('admission_programmes')->where('id', $app->programme_id)->first();
        $intake    = \Illuminate\Support\Facades\DB::table('admissions_intakes')->where('id', $app->intake_id)->first();
        $pathway   = \Illuminate\Support\Facades\DB::table('admission_pathways')->where('id', $app->pathway_id)->first();
        $qualifications = \Illuminate\Support\Facades\DB::table('academic_qualifications')->where('application_id', $app->id)->get();
        $documents  = \Illuminate\Support\Facades\DB::table('application_documents')->where('application_id', $app->id)->get();
        $payment    = \Illuminate\Support\Facades\DB::table('application_payments')->where('application_id', $app->id)->orderBy('id','desc')->first();

        return response()->json([
            'data' => array_merge((array)$app, [
                'programme'      => $programme,
                'intake'         => $intake,
                'pathway'        => $pathway,
                'qualifications' => $qualifications,
                'documents'      => $documents,
                'payment'        => $payment,
                'applicant'      => (function() use ($applicant) {
                    $a = (array)$applicant;
                    unset($a['password_hash'], $a['otp_code'], $a['portal_token']);
                    return $a;
                })(),
            ]),
        ]);
    });

    // ── Personal Details ──────────────────────────────────────────────────────
    Route::patch('/{ref}/personal', function (Illuminate\Http\Request $request, string $ref) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app || in_array($app->status, ['submitted','under_review','eligible','rejected','offered','offer_accepted','archived'])) {
            return response()->json(['error' => 'Application cannot be modified.'], 422);
        }

        $data = $request->validate([
            'full_name'              => 'required|string|max:200',
            'gender'                 => 'required|in:male,female,other',
            'date_of_birth'          => 'required|date',
            'nationality'            => 'required|string|max:80',
            'id_document_type'       => 'required|in:national_id,passport,birth_cert',
            'id_document_number'     => 'required|string|max:50',
            'county'                 => 'nullable|string|max:80',
            'sub_county'             => 'nullable|string|max:80',
            'postal_address'         => 'nullable|string|max:300',
            'physical_address'       => 'nullable|string|max:300',
            'emergency_contact_name' => 'nullable|string|max:120',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'has_disability'         => 'boolean',
            'disability_description' => 'nullable|string|max:300',
        ]);

        \Illuminate\Support\Facades\DB::table('applicants')
            ->where('id', $applicant->id)
            ->update(array_merge($data, ['updated_at' => now()]));

        \Illuminate\Support\Facades\DB::table('applications')
            ->where('id', $app->id)
            ->update(['updated_at' => now()]);

        return response()->json(['message' => 'Personal details saved.']);
    });

    // ── Academic Qualifications ───────────────────────────────────────────────
    Route::patch('/{ref}/qualifications', function (Illuminate\Http\Request $request, string $ref) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app || in_array($app->status, ['submitted','under_review','eligible','rejected','offered','archived'])) {
            return response()->json(['error' => 'Application cannot be modified.'], 422);
        }

        $data = $request->validate([
            'qualification_level'   => 'required|string',
            'institution_name'      => 'nullable|string|max:200',
            'programme_name'        => 'nullable|string|max:200',
            'completion_year'       => 'nullable|string|max:10',
            'grade_or_classification' => 'nullable|string|max:50',
            'kcse_index_number'     => 'nullable|string|max:30',
            'kcse_year'             => 'nullable|string|max:10',
            'mean_grade'            => 'nullable|string|max:5',
            'subject_grades'        => 'nullable|array',
            'school_attended'       => 'nullable|string|max:200',
        ]);

        // Delete existing and re-insert
        \Illuminate\Support\Facades\DB::table('academic_qualifications')
            ->where('application_id', $app->id)
            ->delete();

        \Illuminate\Support\Facades\DB::table('academic_qualifications')->insert(array_merge($data, [
            'application_id' => $app->id,
            'subject_grades' => isset($data['subject_grades']) ? json_encode($data['subject_grades']) : null,
            'created_at'     => now(),
            'updated_at'     => now(),
        ]));

        return response()->json(['message' => 'Qualifications saved.']);
    });

    // ── Document Upload ────────────────────────────────────────────────────────
    Route::post('/{ref}/documents', function (Illuminate\Http\Request $request, string $ref) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app || in_array($app->status, ['submitted','under_review','eligible','rejected','offered','archived'])) {
            return response()->json(['error' => 'Application cannot be modified.'], 422);
        }

        $request->validate([
            'document_type' => 'required|string|max:60',
            'file'          => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $file = $request->file('file');
        $path = $file->store("application-docs/{$ref}", 'local');

        // Replace existing document of same type
        \Illuminate\Support\Facades\DB::table('application_documents')
            ->where('application_id', $app->id)
            ->where('document_type', $request->document_type)
            ->delete();

        $docId = \Illuminate\Support\Facades\DB::table('application_documents')->insertGetId([
            'application_id'    => $app->id,
            'document_type'     => $request->document_type,
            'document_label'    => $request->input('document_label'),
            'file_path'         => $path,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type'         => $file->getMimeType(),
            'file_size_kb'      => (int)($file->getSize() / 1024),
            'checksum'          => md5_file($file->getRealPath()),
            'status'            => 'pending',
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);

        return response()->json(['document_id' => $docId, 'message' => 'Document uploaded.']);
    });

    Route::delete('/{ref}/documents/{docId}', function (Illuminate\Http\Request $request, string $ref, int $docId) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        \Illuminate\Support\Facades\DB::table('application_documents')
            ->where('id', $docId)
            ->where('application_id', $app->id)
            ->delete();

        return response()->json(['message' => 'Document removed.']);
    });

    // ── Accept Declarations ────────────────────────────────────────────────────
    Route::patch('/{ref}/declarations', function (Illuminate\Http\Request $request, string $ref) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        \Illuminate\Support\Facades\DB::table('applications')
            ->where('id', $app->id)
            ->update(['declarations_accepted' => true, 'updated_at' => now()]);

        return response()->json(['message' => 'Declarations accepted.']);
    });

    // ── Initiate Payment ──────────────────────────────────────────────────────
    Route::post('/{ref}/payment/initiate', function (Illuminate\Http\Request $request, string $ref) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        $pathway = \Illuminate\Support\Facades\DB::table('admission_pathways')->where('id', $app->pathway_id)->first();
        if ($pathway && !$pathway->requires_payment) {
            return response()->json(['error' => 'Payment not required for this pathway.'], 422);
        }

        $intake = \Illuminate\Support\Facades\DB::table('admissions_intakes')->where('id', $app->intake_id)->first();
        $fee = match($app->level) {
            'masters' => $intake->application_fee_masters ?? 1500,
            'phd'     => $intake->application_fee_phd    ?? 2000,
            default   => $intake->application_fee_undergraduate ?? 1000,
        };

        $payRef = 'KAFU-APP-' . strtoupper(\Illuminate\Support\Str::random(8));
        $data = $request->validate([
            'method'      => 'required|in:mpesa,bank,manual',
            'mpesa_phone' => 'nullable|string|max:20',
        ]);

        // Remove unpaid previous payment attempts
        \Illuminate\Support\Facades\DB::table('application_payments')
            ->where('application_id', $app->id)
            ->whereIn('status', ['pending', 'failed', 'cancelled'])
            ->delete();

        $payId = \Illuminate\Support\Facades\DB::table('application_payments')->insertGetId([
            'application_id'  => $app->id,
            'payment_reference' => $payRef,
            'method'          => $data['method'],
            'amount_expected' => $fee,
            'status'          => 'initiated',
            'mpesa_phone'     => $data['mpesa_phone'] ?? null,
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);

        \Illuminate\Support\Facades\DB::table('applications')
            ->where('id', $app->id)
            ->update(['payment_status' => 'initiated', 'updated_at' => now()]);

        return response()->json([
            'payment_id'        => $payId,
            'payment_reference' => $payRef,
            'amount'            => $fee,
            'method'            => $data['method'],
            'message'           => $data['method'] === 'mpesa'
                ? "M-Pesa STK Push sent to {$data['mpesa_phone']}. Enter your M-Pesa PIN to complete payment."
                : "Please use reference {$payRef} when making payment to KAFU PayBill 400200.",
        ]);
    });

    // ── Simulate M-Pesa Payment Callback (dev/demo only) ─────────────────────
    Route::post('/{ref}/payment/simulate-confirm', function (Illuminate\Http\Request $request, string $ref) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        $payment = \Illuminate\Support\Facades\DB::table('application_payments')
            ->where('application_id', $app->id)
            ->whereIn('status', ['initiated', 'pending'])
            ->orderBy('id', 'desc')
            ->first();

        if (!$payment) return response()->json(['error' => 'No pending payment found.'], 404);

        \Illuminate\Support\Facades\DB::table('application_payments')
            ->where('id', $payment->id)
            ->update([
                'status'                  => 'paid',
                'amount_paid'             => $payment->amount_expected,
                'paid_at'                 => now(),
                'external_transaction_id' => 'SIM' . strtoupper(\Illuminate\Support\Str::random(8)),
                'updated_at'              => now(),
            ]);

        \Illuminate\Support\Facades\DB::table('applications')
            ->where('id', $app->id)
            ->update(['payment_status' => 'paid', 'updated_at' => now()]);

        return response()->json(['message' => 'Payment confirmed successfully.', 'status' => 'paid']);
    });

    // ── Final Submission ──────────────────────────────────────────────────────
    Route::post('/{ref}/submit', function (Illuminate\Http\Request $request, string $ref) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        if ($app->status === 'submitted') {
            return response()->json(['error' => 'Application already submitted.'], 422);
        }

        $now = now();

        // Re-validate intake window
        $intake = \Illuminate\Support\Facades\DB::table('admissions_intakes')->where('id', $app->intake_id)->first();
        if ($intake->close_at && $now->gt($intake->close_at) && !$intake->allow_late_applications) {
            return response()->json(['error' => 'Applications for this intake are closed. Please select another available intake or contact Admissions.'], 422);
        }

        // Validate payment for non-KUCCPS
        $pathway = \Illuminate\Support\Facades\DB::table('admission_pathways')->where('id', $app->pathway_id)->first();
        if ($pathway->requires_payment && !in_array($app->payment_status, ['paid', 'manually_verified'])) {
            return response()->json(['error' => 'Application fee payment must be completed before final submission.'], 422);
        }

        // Validate declarations
        if (!$app->declarations_accepted) {
            return response()->json(['error' => 'You must accept the declarations before submitting.'], 422);
        }

        // Validate required documents
        $programme = \Illuminate\Support\Facades\DB::table('admission_programmes')->where('id', $app->programme_id)->first();
        $requiredDocs = json_decode($programme->required_documents ?? '[]', true);
        $uploadedDocs = \Illuminate\Support\Facades\DB::table('application_documents')
            ->where('application_id', $app->id)
            ->pluck('document_type')
            ->toArray();
        $missing = array_diff($requiredDocs, $uploadedDocs);
        if (!empty($missing)) {
            return response()->json([
                'error'           => 'Required documents are missing.',
                'missing_documents' => array_values($missing),
            ], 422);
        }

        // Generate application number
        $year   = $now->format('Y');
        $period = strtoupper(substr($intake->intake_period, 0, 3));
        $level  = strtoupper(substr($app->level, 0, 2));
        $seq    = str_pad(\Illuminate\Support\Facades\DB::table('applications')->where('status','submitted')->count() + 1, 6, '0', STR_PAD_LEFT);
        $appNumber = "KAFU/APP/{$year}/{$period}/{$level}/{$seq}";

        \Illuminate\Support\Facades\DB::table('applications')
            ->where('id', $app->id)
            ->update([
                'application_number' => $appNumber,
                'status'             => 'submitted',
                'submitted_at'       => $now,
                'locked_at'          => $now,
                'updated_at'         => $now,
            ]);

        \Illuminate\Support\Facades\DB::table('application_status_logs')->insert([
            'application_id'  => $app->id,
            'from_status'     => $app->status,
            'to_status'       => 'submitted',
            'changed_by_type' => 'applicant',
            'changed_by'      => $applicant->id,
            'reason'          => 'Applicant submitted application',
            'created_at'      => $now,
            'updated_at'      => $now,
        ]);

        return response()->json([
            'application_number' => $appNumber,
            'message'            => 'Your application has been submitted successfully. Your application reference number is ' . $appNumber . '. Please keep this number for future communication.',
        ]);
    });

    // ── Application Status Check ──────────────────────────────────────────────
    Route::get('/{ref}/status', function (Illuminate\Http\Request $request, string $ref) {
        $applicant = resolveApplicant($request);
        if (!$applicant) return response()->json(['error' => 'Unauthenticated.'], 401);

        $app = getOwnedApplication($ref, $applicant->id);
        if (!$app) return response()->json(['error' => 'Application not found.'], 404);

        $logs = \Illuminate\Support\Facades\DB::table('application_status_logs')
            ->where('application_id', $app->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'status'             => $app->status,
            'payment_status'     => $app->payment_status,
            'application_number' => $app->application_number,
            'submitted_at'       => $app->submitted_at,
            'decision'           => $app->decision,
            'decision_reason'    => $app->decision_reason,
            'status_history'     => $logs,
        ]);
    });
});

// ─── Departments (public) ──────────────────────────────────────────────────
use App\Models\Department;

Route::get('/departments', function () {
    $depts = Department::where('is_active', true)
        ->orderBy('school_code')
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get();
    return response()->json(['data' => $depts]);
});

Route::get('/departments/{slug}', function (string $slug) {
    $dept = Department::where('slug', $slug)->where('is_active', true)->first();
    if (!$dept) return response()->json(['error' => 'Not found.'], 404);
    return response()->json(['data' => $dept]);
});

Route::get('/schools/{code}/departments', function (string $code) {
    $depts = Department::where('school_code', strtoupper($code))
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get();
    return response()->json(['data' => $depts]);
});

// ─── Enterprise Search ─────────────────────────────────────────────────────
Route::get('/search', function (Request $request) {
    $q = trim($request->query('q', ''));
    $type = $request->query('type', 'all');
    if (strlen($q) < 2) {
        return response()->json(['data' => ['results' => [], 'total' => 0, 'query' => $q]]);
    }
    $term = '%' . $q . '%';
    $results = [];

    // News
    if ($type === 'all' || $type === 'news') {
        $rows = DB::table('cms_content')
            ->where('type', 'news')->where('status', 'published')->where('is_deleted', false)
            ->where(function ($q2) use ($term) { $q2->where('title', 'LIKE', $term)->orWhere('excerpt', 'LIKE', $term); })
            ->select('slug', 'title', 'excerpt', 'category', 'published_at')->limit(5)->get();
        foreach ($rows as $r) {
            $results[] = ['type' => 'news', 'url' => '/news/' . $r->slug, 'title' => $r->title, 'description' => $r->excerpt, 'category' => $r->category];
        }
    }

    // Events
    if ($type === 'all' || $type === 'event') {
        $rows = DB::table('cms_content')
            ->where('type', 'event')->where('is_deleted', false)
            ->where(function ($q2) use ($term) { $q2->where('title', 'LIKE', $term)->orWhere('excerpt', 'LIKE', $term); })
            ->select('slug', 'title', 'excerpt', 'category')->limit(4)->get();
        foreach ($rows as $r) {
            $results[] = ['type' => 'event', 'url' => '/events/' . $r->slug, 'title' => $r->title, 'description' => $r->excerpt, 'category' => $r->category];
        }
    }

    // Programmes
    if ($type === 'all' || $type === 'programme') {
        if (Schema::hasTable('programmes')) {
            $rows = DB::table('programmes')
                ->where(function ($q2) use ($term) { $q2->where('name', 'LIKE', $term)->orWhere('code', 'LIKE', $term)->orWhere('school', 'LIKE', $term); })
                ->select('slug', 'name', 'school', 'level', 'code')->limit(5)->get();
            foreach ($rows as $r) {
                $school = $r->school ?? 'KAFU';
                $results[] = ['type' => 'programme', 'url' => '/programmes/' . $school . '/' . $r->code, 'title' => $r->name, 'description' => $school . ' — ' . ucfirst($r->level ?? ''), 'category' => $school];
            }
        }
    }

    // Staff
    if ($type === 'all' || $type === 'staff') {
        if (Schema::hasTable('staff_profiles')) {
            $rows = DB::table('staff_profiles')
                ->where(function ($q2) use ($term) { $q2->where('name', 'LIKE', $term)->orWhere('title', 'LIKE', $term)->orWhere('department', 'LIKE', $term); })
                ->select('slug', 'name', 'title', 'department')->limit(4)->get();
            foreach ($rows as $r) {
                $results[] = ['type' => 'staff', 'url' => '/staff/' . $r->slug, 'title' => $r->name, 'description' => $r->title ?? $r->department, 'category' => $r->department];
            }
        }
    }

    // Opportunities
    if ($type === 'all' || $type === 'opportunity') {
        $rows = DB::table('cms_content')
            ->where('type', 'opportunity')->where('is_deleted', false)
            ->where('title', 'LIKE', $term)
            ->select('slug', 'title', 'category')->limit(3)->get();
        foreach ($rows as $r) {
            $results[] = ['type' => 'opportunity', 'url' => '/opportunities/' . $r->slug, 'title' => $r->title, 'description' => $r->category ?? 'Opportunity', 'category' => $r->category];
        }
    }

    return response()->json(['data' => ['results' => $results, 'total' => count($results), 'query' => $q]]);
});

// ─── Archives (static curated records) ────────────────────────────────────
Route::get('/archives', function (Request $request) {
    $type   = $request->query('type', 'all');
    $year   = $request->query('year');
    $search = trim($request->query('q', ''));

    $records = [
        ['id'=>'a001','type'=>'newsletter','title'=>'The KAFU Chronicle — Issue 12 (Jan–Mar 2025)','date'=>'2025-03-31','year'=>2025,'description'=>'Quarterly newsletter covering academic achievements, research highlights, staff news, and community activities for Q1 2025.'],
        ['id'=>'a002','type'=>'newsletter','title'=>'The KAFU Chronicle — Issue 11 (Oct–Dec 2024)','date'=>'2024-12-31','year'=>2024,'description'=>'Year-end edition featuring graduation highlights, 2024 research output summary, and alumni spotlight.'],
        ['id'=>'a003','type'=>'notice','title'=>'Academic Calendar 2024/2025 (Revised)','date'=>'2024-09-02','year'=>2024,'description'=>'Revised academic calendar for 2024/2025 incorporating semester dates, examination periods, and public holidays.'],
        ['id'=>'a004','type'=>'notice','title'=>'COVID-19 Campus Return Guidelines (Final)','date'=>'2023-03-15','year'=>2023,'description'=>'Final guidelines for return to full in-person learning following the COVID-19 transitional period.'],
        ['id'=>'a005','type'=>'leadership','title'=>'Inaugural Vice Chancellor — Prof. Peter Mwita Appointed','date'=>'2022-01-10','year'=>2022,'description'=>'Gazette notice and official announcement of the appointment of Prof. Peter Mwita as the inaugural substantive Vice Chancellor.'],
        ['id'=>'a006','type'=>'leadership','title'=>'Council Chairperson — Prof. Onyango Kwer Re-appointed','date'=>'2023-06-30','year'=>2023,'description'=>'Government Gazette notice of the re-appointment of Prof. Onyango Kwer as Chairman of the University Council for a second term.'],
        ['id'=>'a007','type'=>'circular','title'=>'Staff Welfare — Medical Insurance Scheme 2024','date'=>'2024-01-08','year'=>2024,'description'=>'Circular to all staff regarding the 2024 group medical insurance cover, dependants enrollment, and claims procedures.'],
        ['id'=>'a008','type'=>'notice','title'=>'KAFU Charter — University Status Gazette Notice','date'=>'2014-05-12','year'=>2014,'description'=>'Original Kenya Gazette notice conferring full university status to Kaimosi Friends University under the Universities Act, 2012.'],
        ['id'=>'a009','type'=>'newsletter','title'=>'The KAFU Chronicle — Issue 10 (Jul–Sep 2024)','date'=>'2024-09-30','year'=>2024,'description'=>'Features mid-year enrolment statistics, the launch of the Health Sciences School, and international partnership news.'],
        ['id'=>'a010','type'=>'announcement','title'=>'CUE Accreditation Renewal 2023','date'=>'2023-11-20','year'=>2023,'description'=>'Notification from CUE confirming accreditation renewal for all five schools and 38 programmes for 2023–2026.'],
        ['id'=>'a011','type'=>'circular','title'=>'Revised Staff Performance Appraisal Tool (2023)','date'=>'2023-04-01','year'=>2023,'description'=>'Circular on the revised annual performance appraisal tool aligned to the KAFU Strategic Plan 2023–2028.'],
        ['id'=>'a012','type'=>'leadership','title'=>'Dean, School of Business & Economics — Dr. Atieno Omondi Appointed','date'=>'2023-08-14','year'=>2023,'description'=>'Official communication on the appointment of Dr. Atieno Margaret Omondi as Dean of the School of Business & Economics.'],
        ['id'=>'a013','type'=>'notice','title'=>'Academic Calendar 2023/2024','date'=>'2023-08-01','year'=>2023,'description'=>'Full academic calendar for the 2023/2024 academic year including commencement dates, recess periods, and examination timetables.'],
        ['id'=>'a014','type'=>'announcement','title'=>'KAFU Achieves ISO Pre-Assessment Milestone','date'=>'2024-06-15','year'=>2024,'description'=>'Management memo on the successful completion of the ISO 9001:2015 pre-assessment.'],
        ['id'=>'a015','type'=>'newsletter','title'=>'The KAFU Chronicle — Issue 9 (Apr–Jun 2024)','date'=>'2024-06-28','year'=>2024,'description'=>'Features the Research Week 2024 highlights, student innovation showcase, and sports day results.'],
        ['id'=>'a016','type'=>'circular','title'=>'E-Learning Platform Migration Notice (2024)','date'=>'2024-03-01','year'=>2024,'description'=>'Circular to all academic staff and students on the migration to the new e-learning platform.'],
        ['id'=>'a017','type'=>'notice','title'=>'Land Title Deed — Kaimosi Campus (Phase II)','date'=>'2022-09-05','year'=>2022,'description'=>'Archived notice on the issuance of the land title deed for the Phase II campus expansion, totalling 42 acres.'],
        ['id'=>'a018','type'=>'leadership','title'=>'University Librarian — Ms. Florence Awino Appointed','date'=>'2022-05-23','year'=>2022,'description'=>'Official notification on the appointment of Ms. Florence Awino as the inaugural substantive University Librarian.'],
        ['id'=>'a019','type'=>'announcement','title'=>'Convocation 2024 — 5th Graduation Ceremony Notice','date'=>'2024-10-01','year'=>2024,'description'=>'Official notice and programme for KAFU 5th Graduation Ceremony held on 18th October 2024 at the Main Campus.'],
        ['id'=>'a020','type'=>'circular','title'=>'Revised Examination Regulations — 2023 Edition','date'=>'2023-07-15','year'=>2023,'description'=>'Updated examination regulations covering online exams, academic integrity, and special examination provisions.'],
    ];

    $filtered = array_filter($records, function ($r) use ($type, $year, $search) {
        $matchType   = $type === 'all' || $r['type'] === $type;
        $matchYear   = !$year || $r['year'] == intval($year);
        $matchSearch = !$search || stripos($r['title'], $search) !== false || stripos($r['description'], $search) !== false;
        return $matchType && $matchYear && $matchSearch;
    });

    usort($filtered, fn($a, $b) => strcmp($b['date'], $a['date']));

    return response()->json(['data' => array_values($filtered), 'total' => count($filtered)]);
});

// ─── About sub-pages ───────────────────────────────────────────────────────
Route::get('/about/strategic-plan', function () {
    return response()->json(['data' => [
        'title'   => 'Strategic Plan 2023–2028',
        'tagline' => 'Transforming Lives Through Knowledge',
        'pdf_url' => '/documents/kafu-strategic-plan-2023-2028.pdf',
        'pillars' => [
            ['id'=>1,'title'=>'Academic Excellence & Innovation','objectives'=>['Develop 10 new market-responsive academic programmes','Achieve 80% graduate employment rate','Attain CUE top-tier rating'],'kpis'=>['10 new programmes','80% pass rate','90% graduate employment']],
            ['id'=>2,'title'=>'Research & Knowledge Creation','objectives'=>['50 peer-reviewed publications/year','3 new research centres','KES 50M in research grants'],'kpis'=>['50 publications/year','3 research centres','KES 50M grants']],
            ['id'=>3,'title'=>'Community Engagement & Partnerships','objectives'=>['20 industry MoUs','10-county outreach','5 international partners'],'kpis'=>['20 MoUs signed','10 counties reached','5 international partners']],
            ['id'=>4,'title'=>'Infrastructure & Resource Development','objectives'=>['100% fibre campus connectivity','500-bed student centre','100,000 library volumes'],'kpis'=>['100% fibre','500-bed centre','100k volumes']],
            ['id'=>5,'title'=>'Institutional Governance & Leadership','objectives'=>['Unqualified audit throughout plan period','50% self-generated revenue by 2028','ISO 9001:2015 certification'],'kpis'=>['Unqualified audit x5','50% self-revenue','ISO 9001 by 2026']],
        ],
    ]]);
});

Route::get('/about/policies', function () {
    return response()->json(['data' => [
        ['slug'=>'academic-policy','title'=>'Academic Policy','category'=>'Academic','version'=>'v3.0 (2023)','pages'=>45,'approved'=>'University Council, June 2023','review_date'=>'June 2026'],
        ['slug'=>'student-code-of-conduct','title'=>'Student Code of Conduct','category'=>'Student Affairs','version'=>'v2.1 (2023)','pages'=>28,'approved'=>'University Council, March 2023','review_date'=>'March 2026'],
        ['slug'=>'research-policy','title'=>'Research & Innovation Policy','category'=>'Research','version'=>'v2.0 (2022)','pages'=>38,'approved'=>'Senate, November 2022','review_date'=>'November 2025'],
        ['slug'=>'staff-code-of-ethics','title'=>'Staff Code of Ethics & Conduct','category'=>'Human Resources','version'=>'v2.2 (2023)','pages'=>20,'approved'=>'University Council, January 2023','review_date'=>'January 2026'],
        ['slug'=>'ict-security-policy','title'=>'ICT Security Policy','category'=>'ICT','version'=>'v1.2 (2024)','pages'=>32,'approved'=>'Management, February 2024','review_date'=>'February 2026'],
        ['slug'=>'procurement-policy','title'=>'Procurement Policy','category'=>'Finance & Procurement','version'=>'v2.0 (2023)','pages'=>42,'approved'=>'University Council, April 2023','review_date'=>'April 2026'],
    ]]);
});

Route::get('/about/service-charter', function () {
    return response()->json(['data' => [
        'updated' => '2024-01-01',
        'categories' => [
            ['name' => 'Admissions & Registration', 'services' => [
                ['service' => 'Online application acknowledgement', 'standard' => 'Within 1 working day'],
                ['service' => 'Application review & offer letter',  'standard' => '5–10 working days'],
                ['service' => 'Student ID card issuance',          'standard' => '2 working days'],
            ]],
            ['name' => 'Academic Records', 'services' => [
                ['service' => 'Academic transcripts (unofficial)', 'standard' => '3 working days'],
                ['service' => 'Degree certificate issuance',       'standard' => '30 calendar days'],
            ]],
        ],
    ]]);
});

// ─── Online Admissions Application ────────────────────────────────────────
Route::post('/admissions-app/apply', function (Request $request) {
    $data = $request->all();
    $year = date('Y');
    $ref  = 'KAFU-' . $year . '-' . strtoupper(substr(md5(json_encode($data) . microtime()), 0, 6));

    $insert = [
        'reference_number'  => $ref,
        'applicant_type'    => $data['applicant_type'] ?? 'kuccps',
        'status'            => 'submitted',
        'first_name'        => $data['first_name'] ?? '',
        'last_name'         => $data['last_name'] ?? '',
        'other_names'       => $data['other_names'] ?? null,
        'gender'            => $data['gender'] ?? null,
        'date_of_birth'     => $data['date_of_birth'] ?? null,
        'nationality'       => $data['nationality'] ?? 'Kenyan',
        'id_passport_number'=> $data['id_passport_number'] ?? null,
        'phone'             => $data['phone'] ?? '',
        'email'             => $data['email'] ?? '',
        'postal_address'    => $data['postal_address'] ?? null,
        'county'            => $data['county'] ?? null,
        'kcse_index_number' => $data['kcse_index'] ?? null,
        'kcse_year'         => $data['kcse_year'] ?? null,
        'mean_grade'        => $data['mean_grade'] ?? null,
        'degree_institution'=> $data['degree_institution'] ?? null,
        'degree_class'      => $data['degree_class'] ?? null,
        'degree_year'       => $data['degree_year'] ?? null,
        'degree_field'      => $data['degree_field'] ?? null,
        'school_code'       => $data['school_code'] ?? null,
        'programme_code'    => $data['programme_code'] ?? null,
        'programme_name'    => $data['programme_name'] ?? null,
        'second_choice_code'=> $data['second_choice_code'] ?? null,
        'second_choice_name'=> $data['second_choice_name'] ?? null,
        'payment_status'    => 'paid',
        'payment_reference' => 'MPESA-' . strtoupper(substr(md5(microtime()), 0, 8)),
        'payment_amount'    => in_array($data['applicant_type'] ?? '', ['masters', 'phd']) ? 2000 : 1500,
        'payment_phone'     => $data['payment_phone'] ?? null,
        'payment_at'        => now(),
        'submitted_at'      => now(),
        'created_at'        => now(),
        'updated_at'        => now(),
    ];

    DB::table('admissions_online_applications')->insert($insert);

    return response()->json(['data' => [
        'reference_number' => $ref,
        'status'           => 'submitted',
        'message'          => 'Application submitted successfully. Check your email for confirmation.',
    ]], 201);
});

Route::get('/admissions-app/track/{ref}', function (string $ref) {
    $app = DB::table('admissions_online_applications')->where('reference_number', $ref)->first();
    if (!$app) return response()->json(['error' => 'Application not found.'], 404);

    $statusMessages = [
        'submitted'    => 'Your application has been received and is in our queue for review.',
        'under_review' => 'Your application is currently being reviewed by the admissions team.',
        'offered'      => 'Congratulations! An offer of admission has been issued. Check your email.',
        'rejected'     => 'We regret to inform you that your application was unsuccessful this cycle.',
    ];

    return response()->json(['data' => [
        'reference_number' => $app->reference_number,
        'applicant_name'   => trim(($app->first_name ?? '') . ' ' . ($app->last_name ?? '')),
        'applicant_type'   => $app->applicant_type,
        'programme_name'   => $app->programme_name ?? 'Not specified',
        'school_code'      => $app->school_code ?? '—',
        'status'           => $app->status,
        'payment_status'   => $app->payment_status,
        'submitted_at'     => $app->submitted_at,
        'status_message'   => $statusMessages[$app->status] ?? '',
    ]]);
});
