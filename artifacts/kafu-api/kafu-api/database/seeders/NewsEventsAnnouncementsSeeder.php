<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CmsContent;
use Carbon\Carbon;

class NewsEventsAnnouncementsSeeder extends Seeder
{
    public function run(): void
    {
        $upsert = function (array $data) {
            // Guard by slug alone — cms_content has a unique index on slug
            // regardless of type, so we must check across all types.
            if (CmsContent::where('slug', $data['slug'])->exists()) {
                return;
            }
            CmsContent::create(array_merge([
                'status'     => 'published',
                'is_deleted' => false,
                'author_id'  => 1,
            ], $data));
        };

        // ─────────────────────────────────────────────────────────────
        // NEWS ARTICLES (10)
        // ─────────────────────────────────────────────────────────────
        $news = [
            [
                'slug'           => 'innovators-develop-smart-digital-systems',
                'title'          => 'KAFU Innovators Develop Smart Digital Systems for Better Service Delivery',
                'summary'        => 'A team of students and faculty from the School of Computing and Information Technology has developed a suite of smart digital tools designed to streamline service delivery in public institutions. The innovations, showcased at the annual KAFU Innovation Expo, include a citizen-facing complaints management portal and a smart queue management system tailored for county government offices.',
                'category'       => 'Research & Innovation',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg',
                'tags'           => ['Innovation', 'Technology', 'SCIT', 'Community'],
                'featured'       => true,
                'published_at'   => '2026-03-20 08:00:00',
                'body'           => "<p>A team of students and faculty from the School of Computing and Information Technology (SCIT) at Kaimosi Friends University has unveiled a suite of smart digital tools designed to transform service delivery in public institutions across Western Kenya.</p><p>The innovations were showcased at the annual KAFU Innovation Expo held at the Main Campus. The flagship product is a citizen-facing complaints management portal that integrates with county government systems, allowing residents to submit service delivery complaints, track resolution progress, and receive SMS and email feedback in real time.</p><p>A second innovation, a smart queue management system, uses IoT sensors and a mobile application to reduce waiting times at government service centres by up to 60%, according to pilot test data collected at the Vihiga County Huduma Centre.</p><p>Prof. Kelvin K. Omieno, Dean of SCIT, praised the team: \"This is precisely the kind of applied innovation KAFU stands for — research that does not sit on library shelves but solves real problems in the communities we serve.\"</p><p>The innovations will be presented to the Council of Governors at a forthcoming devolution conference, with plans to pilot at scale across three counties in Western Kenya.</p>",
            ],
            [
                'slug'           => 'community-rallies-behind-kobujoi-campus-donation-of-cows',
                'title'          => 'Community Rallies Behind Kobujoi Campus with Donation of Cows',
                'summary'        => "Kaimosi Friends University's Kobujoi Campus today received a major boost after members of the local community donated two cows as a show of goodwill, partnership, and support for the newly established campus in Nandi County.",
                'category'       => 'Community Outreach',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/WhatsApp-Image-2026-05-18-at-18.39.27.jpeg',
                'tags'           => ['Kobujoi Campus', 'Community', 'Nandi County', 'Outreach'],
                'featured'       => true,
                'published_at'   => '2026-05-18 10:00:00',
                'body'           => "<p>Kaimosi Friends University's Kobujoi Campus received a heartwarming show of community solidarity when local residents and leaders donated two cows to mark their support for the newly established campus in Nandi County.</p><p>The gesture, described by university officials as deeply symbolic of the Quaker values of community and partnership that underpin KAFU's founding mission, was received by the Vice-Chancellor Prof. Peter Mwita and the Campus Principal during a colourful public ceremony attended by community elders, local administration officials, and hundreds of well-wishers.</p><p>\"This is a powerful statement from the Kobujoi community,\" said Prof. Mwita. \"They are telling us: we own this university and we want it to succeed. That is the spirit that will make this campus thrive.\"</p><p>The Kobujoi Campus was established to expand KAFU's reach into Nandi County and serve students from the North Rift region who previously had to travel long distances to access university education. The campus currently offers programmes in education, social sciences, and business.</p><p>University management confirmed that plans are underway to accelerate infrastructure development at Kobujoi, including the construction of a new multipurpose hall and laboratory facilities, following a capital allocation from the government's university expansion fund.</p>",
            ],
            [
                'slug'           => 'community-backs-college-of-health-sciences-vokoli',
                'title'          => 'Community Backs Proposal to Establish College of Health Sciences in Vokoli',
                'summary'        => 'Community leaders, county government officials, and local residents in Vokoli have expressed overwhelming support for a proposal by Kaimosi Friends University to establish a constituent college of health sciences in the area. A public consultative forum held last week drew hundreds of attendees who highlighted the need for expanded healthcare education in the region.',
                'category'       => 'Outreach',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/image-93.jpeg',
                'tags'           => ['Health Sciences', 'Community', 'Expansion', 'SHS'],
                'featured'       => false,
                'published_at'   => '2026-03-15 08:00:00',
                'body'           => '<p>Community leaders, county government officials, and local residents in Vokoli have expressed overwhelming support for a proposal by Kaimosi Friends University to establish a constituent college of health sciences in the area.</p><p>A public consultative forum held last week drew hundreds of attendees who highlighted the need for expanded healthcare education in the region. Speakers included the local Member of the County Assembly, community health volunteers, and leaders of the Vokoli Friends Church — one of the founding institutions of the university.</p><p>Dr. Annette O. Busula, Dean of the School of Health Sciences, confirmed that a feasibility report has been submitted to the University Council and that KAFU is in preliminary discussions with the Ministry of Health and county government regarding clinical placement infrastructure and land allocation.</p><p>"The demand for healthcare professionals in this region is acute. A constituent health sciences college in Vokoli would be transformational — not just for the community, but for the entire Lake Victoria Basin," said Dr. Busula.</p>',
            ],
            [
                'slug'           => 'kafu-hosts-ministry-of-health-officials',
                'title'          => 'KAFU Hosts Officials from the Ministry of Health for Strategic Partnership Talks',
                'summary'        => 'Kaimosi Friends University hosted a high-level delegation from the Ministry of Health led by the Director of Medical Services. The visit focused on identifying partnership opportunities between KAFU\'s School of Health Sciences and the Ministry, particularly in healthcare workforce development, clinical placements, and collaborative research in community health.',
                'category'       => 'Partnerships',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/image-87.jpeg',
                'tags'           => ['Ministry of Health', 'Partnerships', 'SHS', 'Healthcare'],
                'featured'       => false,
                'published_at'   => '2026-03-10 08:00:00',
                'body'           => '<p>Kaimosi Friends University hosted a high-level delegation from the Ministry of Health led by the Director of Medical Services. The visit, lasting two days, focused on identifying strategic partnership opportunities between KAFU\'s School of Health Sciences and the Ministry.</p><p>Areas of discussion included healthcare workforce development, expanded clinical placement opportunities for KAFU nursing and optometry students, joint research initiatives in community health, and the potential co-development of continuing professional development programmes for health workers in Western Kenya.</p><p>Vice-Chancellor Prof. Peter Nyamuhanga Mwita received the delegation and emphasised KAFU\'s readiness to become a key partner in achieving Kenya\'s Universal Health Coverage goals. "We have the academic capacity, the community presence, and the commitment. KAFU can play a central role in training the healthcare workforce this country needs," he said.</p><p>A formal memorandum of understanding between KAFU and the Ministry of Health is expected to be signed in the second quarter of 2026.</p>',
            ],
            [
                'slug'           => 'kafu-to-host-africa-public-service-day-2026',
                'title'          => 'Historic Moment as KAFU is Earmarked to Host Africa Public Service Day 2026',
                'summary'        => 'In a landmark recognition of its growing academic and institutional stature, Kaimosi Friends University has been designated to host the Africa Public Service Day 2026 celebrations. The announcement was made by the Cabinet Secretary for Public Service during a function in Nairobi. APSD 2026, themed "Digital Transformation for Inclusive and Sustainable Public Services," will bring together public servants, policymakers, and development partners from across the continent to Kaimosi.',
                'category'       => 'Institutional',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/image-99.jpeg',
                'tags'           => ['Africa Public Service Day', 'Institutional', 'Recognition', 'Continental'],
                'featured'       => true,
                'published_at'   => '2026-03-05 08:00:00',
                'body'           => "<p>In a landmark recognition of its growing academic and institutional stature, Kaimosi Friends University has been designated to host the Africa Public Service Day (APSD) 2026 celebrations. The announcement was made by Cabinet Secretary for Public Service during a function in Nairobi attended by Vice-Chancellor Prof. Peter Nyamuhanga Mwita.</p><p>APSD 2026, themed \"Digital Transformation for Inclusive and Sustainable Public Services,\" will bring together public servants, policymakers, development partners, and academics from across the African continent to Kaimosi.</p><p>\"This is a historic moment not just for KAFU but for the entire Western Kenya region. We are proud to showcase Kaimosi as a hub of academic excellence and innovation on the continental stage,\" said Prof. Mwita in a statement.</p><p>The event, scheduled for 23 June 2026, will include a high-level panel discussion, an innovation showcase, and a public service excellence awards ceremony. The host designation also comes with a government grant of KES 50 million towards conference infrastructure and capacity building.</p>",
            ],
            [
                'slug'           => 'mumias-east-candidates-career-mentorship',
                'title'          => 'Mumias East Candidates Benefit from Career Mentorship and Academic Guidance Through KAFU',
                'summary'        => 'Over 500 Form Four candidates from Mumias East Sub-County have benefitted from a career mentorship programme organised in collaboration with Kaimosi Friends University. The programme, run over three days at Mumias East Girls\' High School, involved KAFU faculty offering subject-specific guidance, career talks, and information on higher education pathways available at KAFU and other universities.',
                'category'       => 'Outreach',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/image-94.jpeg',
                'tags'           => ['Mentorship', 'Outreach', 'Community', 'Students'],
                'featured'       => false,
                'published_at'   => '2026-02-28 08:00:00',
                'body'           => '<p>Over 500 Form Four candidates from Mumias East Sub-County have benefitted from a career mentorship programme organised in collaboration with Kaimosi Friends University.</p><p>The programme, run over three days at Mumias East Girls\' High School, involved KAFU faculty from the Schools of Education, Business, Computing, and Health Sciences offering subject-specific guidance, career talks, and detailed information on higher education pathways available at KAFU and other universities.</p><p>Particular emphasis was placed on KAFU scholarship opportunities, the KUCCPS application process, and the range of undergraduate programmes available to candidates with different subject combinations.</p><p>"We are committed to reaching students in every corner of Western Kenya and beyond. Education is transformative, and we want every motivated young person to know that KAFU has a programme for them," said a spokesperson from the Office of Student Affairs.</p><p>The mentorship programme is part of KAFU\'s ongoing community outreach strategy under the 2023–2027 Strategic Plan.</p>',
            ],
            [
                'slug'           => 'kafu-vc-represents-education-cs-migori',
                'title'          => 'KAFU VC Represents Education CS at Women Empowerment Initiative in Migori County',
                'summary'        => 'Vice-Chancellor Prof. Peter Nyamuhanga Mwita represented Cabinet Secretary for Education at the Women in Leadership Empowerment Symposium held in Migori County. Addressing hundreds of women professionals and students, Prof. Mwita highlighted KAFU\'s commitment to gender equity in higher education and the university\'s growing scholarship programmes for female students from marginalised communities.',
                'category'       => 'Leadership',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/image-93.jpeg',
                'tags'           => ['VC', 'Gender', 'Leadership', 'Outreach'],
                'featured'       => false,
                'published_at'   => '2026-02-20 08:00:00',
                'body'           => '<p>Vice-Chancellor Prof. Peter Nyamuhanga Mwita represented Cabinet Secretary for Education at the Women in Leadership Empowerment Symposium held in Migori County.</p><p>Addressing hundreds of women professionals, students, and community leaders, Prof. Mwita highlighted KAFU\'s commitment to gender equity in higher education, citing the university\'s growing scholarship programmes for female students from marginalised communities, mentorship initiatives, and its policy of ensuring women are represented in all leadership structures.</p><p>Prof. Mwita also announced KAFU\'s intention to establish a Centre for Gender and Development Studies, which will offer short courses, research programmes, and community education aimed at advancing women\'s economic and social empowerment in the region.</p><p>The symposium, organised by the Ministry of Education in partnership with UN Women Kenya, brought together participants from five counties in the Nyanza and Western regions.</p>',
            ],
            [
                'slug'           => 'teacher-trainees-competency-based-education',
                'title'          => 'Teacher Trainees Receive Competency-Based Education Training at KAFU',
                'summary'        => 'The School of Education and Social Sciences (SESS) hosted a five-day workshop on Competency-Based Education (CBE) for fourth-year teacher trainees. The workshop equipped trainee teachers with practical skills in lesson planning, formative assessment, and differentiated instruction under the Competency-Based Curriculum framework. The training was facilitated by senior academics from SESS and officers from the Kenya Institute of Curriculum Development.',
                'category'       => 'Academic',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg',
                'tags'           => ['SESS', 'Education', 'CBE', 'Training'],
                'featured'       => false,
                'published_at'   => '2026-02-15 08:00:00',
                'body'           => '<p>The School of Education and Social Sciences (SESS) at Kaimosi Friends University hosted a five-day workshop on Competency-Based Education (CBE) for fourth-year teacher trainees. The workshop, held at the KAFU Main Campus, equipped trainee teachers with practical skills in lesson planning, formative assessment, and differentiated instruction under the Competency-Based Curriculum (CBC) framework.</p><p>Vice-Chancellor Prof. Peter Mwita officially opened the training, emphasising the importance of quality teacher education in transforming Kenya\'s education system. "KAFU is committed to producing teachers who are not just knowledgeable but competent, adaptive, and ethically grounded," he said.</p><p>The training was facilitated by senior academics from SESS and officers from the Kenya Institute of Curriculum Development (KICD). Participants engaged in practical teaching demonstrations, peer review sessions, and technology-integrated lesson planning exercises.</p><p>Over 120 teacher trainees completed the programme, with all participants receiving certificates of completion that will contribute toward their Teacher Service Commission registration requirements.</p>',
            ],
            [
                'slug'           => 'kafu-interdenominational-prayer-breakfast',
                'title'          => 'KAFU Hosts 2nd Interdenominational Prayer Breakfast',
                'summary'        => 'Kaimosi Friends University hosted its Second Annual Interdenominational Prayer Breakfast, bringing together students, staff, and faith community leaders from across Vihiga County. The event featured prayers, worship, and reflections on the role of faith in academic excellence. Vice-Chancellor Prof. Peter Mwita called on all community members to uphold KAFU\'s founding Quaker values of simplicity, peace, integrity, community, and equality.',
                'category'       => 'Events',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg',
                'tags'           => ['Quaker Heritage', 'Community', 'Faith', 'Campus Life'],
                'featured'       => false,
                'published_at'   => '2026-02-10 08:00:00',
                'body'           => '<p>Kaimosi Friends University hosted its Second Annual Interdenominational Prayer Breakfast, bringing together students, staff, and faith community leaders from across Vihiga County.</p><p>The event, held at the KAFU Main Auditorium, featured prayers, worship, and reflections on the role of faith in academic excellence and community service. Representatives from the Friends Church in Kenya, the Catholic Diocese of Kakamega, the Anglican Church, and several Pentecostal congregations participated in the multi-faith programme.</p><p>Vice-Chancellor Prof. Peter Mwita called on all community members to uphold KAFU\'s founding Quaker values of simplicity, peace, integrity, community, and equality. "These are not abstract ideals. They must be lived out in our classrooms, our research, our relationships, and our service to society," he said.</p><p>The prayer breakfast has become an annual tradition affirming KAFU\'s identity as a values-driven institution rooted in spiritual heritage while remaining inclusive and welcoming to all.</p>',
            ],
            [
                'slug'           => 'kafu-classified-category-a-university',
                'title'          => 'KAFU Classified as Category A University by the Kenya Universities and Colleges Central Placement Service',
                'summary'        => 'In a major milestone, Kaimosi Friends University has been classified as a Category A university by the Kenya Universities and Colleges Central Placement Service (KUCCPS). This classification places KAFU among the top-tier institutions in Kenya and will allow the university to attract students with the highest Kenya Certificate of Secondary Education (KCSE) scores through government sponsorship.',
                'category'       => 'Institutional',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/2025/10/posgraduate.jpg',
                'tags'           => ['Accreditation', 'KUCCPS', 'Institutional', 'Recognition'],
                'featured'       => false,
                'published_at'   => '2026-01-30 08:00:00',
                'body'           => '<p>In a major milestone for Kaimosi Friends University, KAFU has been classified as a Category A university by the Kenya Universities and Colleges Central Placement Service (KUCCPS). This classification places KAFU among the top-tier institutions in Kenya and will allow the university to attract students with the highest Kenya Certificate of Secondary Education (KCSE) scores through government sponsorship.</p><p>The classification reflects significant improvements across multiple indicators assessed by KUCCPS, including infrastructure quality, academic staffing ratios, research output, student support services, and programme accreditation status.</p><p>Vice-Chancellor Prof. Peter Nyamuhanga Mwita described the achievement as a testament to the collective effort of the entire KAFU community. "Every member of staff, every student, and every friend of this university has contributed to this recognition. We are now positioned to attract the brightest young Kenyans, and we will not disappoint them," he said.</p><p>The Category A classification takes effect from the 2026/2027 academic year, beginning with the KUCCPS placement cycle opening in May 2026.</p>',
            ],
            [
                'slug'           => 'kafu-annual-research-conference-2026',
                'title'          => 'KAFU Announces 3rd Annual Research Conference — Call for Abstracts Open',
                'summary'        => 'The Directorate of Research and Innovation at Kaimosi Friends University is pleased to announce the opening of abstract submissions for the 3rd Annual Research Conference, scheduled for April 2026. The conference, themed "Research for Sustainable Development in the African Context," invites contributions from all disciplines across KAFU\'s five schools as well as external researchers and graduate students. Accepted abstracts will be published in the KAFU Research Journal.',
                'category'       => 'Research & Innovation',
                'featured_image' => 'https://kafu.ac.ke/wp-content/uploads/image-87.jpeg',
                'tags'           => ['Research', 'Conference', 'Call for Papers', 'Innovation'],
                'featured'       => false,
                'published_at'   => '2026-01-20 08:00:00',
                'body'           => '<p>The Directorate of Research and Innovation at Kaimosi Friends University is pleased to announce the opening of abstract submissions for the 3rd Annual Research Conference, scheduled for 24–25 April 2026 at the KAFU Conference Centre.</p><p>The conference is themed "Research for Sustainable Development in the African Context" and invites original research contributions from all disciplines across KAFU\'s five schools — SESS, SBE, SCIT, SOS, and SHS — as well as from external researchers, graduate students, and practitioners.</p><p>The programme will include keynote addresses by distinguished academics, parallel technical paper sessions, a dedicated postgraduate research symposium, and a research poster exhibition. A Best Paper Award and Best Poster Award will be presented at the conference dinner.</p><p>Authors of accepted abstracts will be invited to submit full papers for double-blind peer review. Papers accepted after review will be published in the KAFU Research Journal (ISSN pending), which will be available in both print and open-access digital formats.</p><p>Abstract submissions close on 28 February 2026. Details and submission templates are available at research.kafu.ac.ke.</p>',
            ],
        ];

        foreach ($news as $article) {
            $upsert([
                'type'           => 'news',
                'slug'           => $article['slug'],
                'title'          => $article['title'],
                'summary'        => $article['summary'],
                'body'           => $article['body'],
                'category'       => $article['category'],
                'featured_image' => $article['featured_image'],
                'tags'           => $article['tags'],
                'featured'       => $article['featured'],
                'published_at'   => Carbon::parse($article['published_at']),
            ]);
        }

        // ─────────────────────────────────────────────────────────────
        // EVENTS (10)
        // ─────────────────────────────────────────────────────────────
        $events = [
            [
                'slug'     => 'examination-processing-semester-2-2025-2026',
                'title'    => 'Examination Processing Schedule — Semester II (2025/2026)',
                'summary'  => 'The Examinations Department has published the processing schedule for end-of-semester examinations for Semester II of the 2025/2026 academic year. All students are required to clear outstanding fees and complete exam registration through the student portal before the deadline.',
                'category' => 'Examinations',
                'tags'     => ['Examinations', 'Academic Calendar', 'Students'],
                'featured' => false,
                'published_at' => '2026-03-28 08:00:00',
                'sd' => [
                    'date'              => '2026-04-02',
                    'end_date'          => '2026-04-10',
                    'time'              => '08:00 – 17:00',
                    'location'          => 'Main Campus, Kaimosi',
                    'registration_link' => 'https://portal.kafu.ac.ke',
                    'event_status'      => 'upcoming',
                ],
            ],
            [
                'slug'     => 'kafu-open-day-2026',
                'title'    => 'KAFU Open Day 2026 — Explore Your Future',
                'summary'  => 'KAFU Open Day 2026 is your opportunity to explore the university campus, meet faculty and current students, attend live programme demonstrations, and get all the information you need about admission pathways, fees, scholarships, and student life. All prospective students, parents, and career guidance counsellors are warmly invited. Free entry. Light refreshments provided.',
                'category' => 'Community Outreach',
                'tags'     => ['Open Day', 'Prospective Students', 'Admissions'],
                'featured' => true,
                'published_at' => '2026-03-20 08:00:00',
                'sd' => [
                    'date'              => '2026-04-15',
                    'end_date'          => '2026-04-15',
                    'time'              => '09:00 – 16:00',
                    'location'          => 'All Schools, Main Campus, Kaimosi',
                    'registration_link' => 'https://portal.kafu.ac.ke',
                    'event_status'      => 'upcoming',
                ],
            ],
            [
                'slug'     => 'annual-research-conference-2026',
                'title'    => '3rd KAFU Annual Research Conference',
                'summary'  => 'The 3rd Annual Research Conference brings together researchers, graduate students, and practitioners under the theme "Research for Sustainable Development in the African Context." The two-day conference will feature keynote addresses by leading academics, parallel technical sessions, a postgraduate symposium, and a research poster exhibition.',
                'category' => 'Academic',
                'tags'     => ['Research', 'Conference', 'Graduate Studies', 'Innovation'],
                'featured' => false,
                'published_at' => '2026-03-15 08:00:00',
                'sd' => [
                    'date'              => '2026-04-24',
                    'end_date'          => '2026-04-25',
                    'time'              => '08:30 – 17:00',
                    'location'          => 'KAFU Conference Centre, Main Campus',
                    'registration_link' => 'https://portal.kafu.ac.ke',
                    'event_status'      => 'upcoming',
                ],
            ],
            [
                'slug'     => 'internal-audit-may-2026',
                'title'    => 'Internal Audit — May 2026',
                'summary'  => 'The Internal Audit Unit will conduct its scheduled May audit of university financial records, procurement processes, and asset management. All departments are required to ensure their records are up to date and available for review. Queries should be directed to the Internal Auditor at audit@kafu.ac.ke.',
                'category' => 'Administration',
                'tags'     => ['Administration', 'Finance', 'Governance'],
                'featured' => false,
                'published_at' => '2026-04-01 08:00:00',
                'sd' => [
                    'date'              => '2026-05-05',
                    'end_date'          => '2026-05-09',
                    'time'              => '08:00 – 17:00',
                    'location'          => 'Administration Block',
                    'registration_link' => null,
                    'event_status'      => 'upcoming',
                ],
            ],
            [
                'slug'     => 'academic-board-meeting-may-2026',
                'title'    => 'Academic Board Meeting — May 2026',
                'summary'  => 'The regular quarterly meeting of the KAFU Academic Board will convene to review academic policy matters, approve new programmes, consider examination results, and receive reports from School Deans. The agenda and related papers are available to board members via the Academic Secretariat.',
                'category' => 'Administration',
                'tags'     => ['Academic Board', 'Governance', 'Administration'],
                'featured' => false,
                'published_at' => '2026-04-10 08:00:00',
                'sd' => [
                    'date'              => '2026-05-12',
                    'end_date'          => '2026-05-12',
                    'time'              => '10:00 – 15:00',
                    'location'          => 'Council Chamber, Administration Block',
                    'registration_link' => null,
                    'event_status'      => 'upcoming',
                ],
            ],
            [
                'slug'     => 'graduation-ceremony-2026',
                'title'    => '8th Graduation Ceremony — KAFU Class of 2026',
                'summary'  => 'Kaimosi Friends University will host its 8th Graduation Ceremony, celebrating the Class of 2026. The ceremony will confer degrees, diplomas, and certificates to graduates from all five schools. Graduands are required to collect their gowns from the Examinations Office at least three days before the ceremony and to arrive at the venue by 08:00 AM.',
                'category' => 'Graduation',
                'tags'     => ['Graduation', 'Ceremony', 'Class of 2026'],
                'featured' => true,
                'published_at' => '2026-04-01 08:00:00',
                'sd' => [
                    'date'              => '2026-05-22',
                    'end_date'          => '2026-05-22',
                    'time'              => '09:00 – 14:00',
                    'location'          => 'KAFU Grounds, Main Campus',
                    'registration_link' => 'https://portal.kafu.ac.ke',
                    'event_status'      => 'upcoming',
                ],
            ],
            [
                'slug'     => 'sports-day-2026',
                'title'    => 'KAFU Annual Sports Day 2026',
                'summary'  => 'The annual KAFU Sports Day brings together students, staff, and the wider university community for a day of athletic competitions, team sports, and recreational activities. Events include track and field, football, volleyball, and netball competitions, with trophies and prizes for top performers.',
                'category' => 'Student Life',
                'tags'     => ['Sports', 'Student Life', 'Community', 'Athletics'],
                'featured' => false,
                'published_at' => '2026-05-01 08:00:00',
                'sd' => [
                    'date'              => '2026-06-05',
                    'end_date'          => '2026-06-05',
                    'time'              => '09:00 – 17:00',
                    'location'          => 'KAFU Sports Grounds, Main Campus',
                    'registration_link' => null,
                    'event_status'      => 'upcoming',
                ],
            ],
            [
                'slug'     => 'africa-public-service-day-2026',
                'title'    => 'Africa Public Service Day 2026',
                'summary'  => 'KAFU is proud to host the Africa Public Service Day 2026, a continental celebration bringing together heads of government, public service commissions, development partners, and academics from across Africa. The day features high-level panel discussions on digital governance, a public service innovation showcase, and the Africa Public Service Excellence Awards.',
                'category' => 'Special Events',
                'tags'     => ['APSD', 'Continental', 'Special Event', 'Public Service'],
                'featured' => true,
                'published_at' => '2026-03-05 08:00:00',
                'sd' => [
                    'date'              => '2026-06-23',
                    'end_date'          => '2026-06-23',
                    'time'              => 'All Day',
                    'location'          => 'Kaimosi Friends University, Main Campus',
                    'registration_link' => null,
                    'event_status'      => 'upcoming',
                ],
            ],
            [
                'slug'     => 'senate-meeting-june-2026',
                'title'    => 'Senate Meeting — June 2026',
                'summary'  => 'The regular meeting of the KAFU Senate will be held to consider matters of academic policy, review reports from the Academic Board, and approve examination results for the Semester II 2025/2026 academic year. Senate members are required to confirm their attendance with the Academic Registrar\'s office at least 48 hours in advance.',
                'category' => 'Administration',
                'tags'     => ['Senate', 'Governance', 'Academic Policy'],
                'featured' => false,
                'published_at' => '2026-05-01 08:00:00',
                'sd' => [
                    'date'              => '2026-06-29',
                    'end_date'          => '2026-06-29',
                    'time'              => '09:00 – 13:00',
                    'location'          => 'Council Chamber, Administration Block',
                    'registration_link' => null,
                    'event_status'      => 'upcoming',
                ],
            ],
            [
                'slug'     => 'cbe-teacher-training-workshop-march-2026',
                'title'    => 'Competency-Based Education Teacher Training Workshop',
                'summary'  => 'A five-day workshop on Competency-Based Education for fourth-year teacher trainees, jointly facilitated by KAFU School of Education and Social Sciences and the Kenya Institute of Curriculum Development. Participants gained practical skills in CBC lesson design, formative assessment, and technology integration.',
                'category' => 'Academic',
                'tags'     => ['CBE', 'Education', 'SESS', 'Workshop'],
                'featured' => false,
                'published_at' => '2026-02-10 08:00:00',
                'sd' => [
                    'date'              => '2026-02-10',
                    'end_date'          => '2026-02-14',
                    'time'              => '08:30 – 16:30',
                    'location'          => 'SESS Building, Main Campus',
                    'registration_link' => null,
                    'event_status'      => 'past',
                ],
            ],
        ];

        foreach ($events as $event) {
            $upsert([
                'type'           => 'event',
                'slug'           => $event['slug'],
                'title'          => $event['title'],
                'summary'        => $event['summary'],
                'body'           => $event['summary'],
                'category'       => $event['category'],
                'tags'           => $event['tags'],
                'featured'       => $event['featured'],
                'published_at'   => Carbon::parse($event['published_at']),
                'structured_data' => $event['sd'],
            ]);
        }

        // ─────────────────────────────────────────────────────────────
        // ANNOUNCEMENTS (10)
        // ─────────────────────────────────────────────────────────────
        $announcements = [
            [
                'slug'       => 'academic-calendar-announcement-2025-2026',
                'title'      => 'Academic Calendar — 2025/2026 Academic Year',
                'department' => 'Academic Registrar',
                'summary'    => 'The official academic calendar for the 2025/2026 academic year has been approved by the Academic Board and is now available for download via the student portal and this website.',
                'tags'       => ['Academic Calendar', 'Students', 'Staff'],
                'published_at' => '2025-08-01 08:00:00',
                'priority'   => 'normal',
                'body'       => '<p>The official academic calendar for the 2025/2026 academic year has been approved by the Academic Board and is now available for download via the KAFU student portal and this website.</p><p>Key dates for the academic year include: Semester I orientation (September 2025), mid-semester examinations (November 2025), end-of-semester examinations (January 2026), Semester II commencement (February 2026), and end-of-year examinations (May–June 2026).</p><p>Students and staff are advised to take note of all key academic dates, examination periods, and public holidays. Any amendments to the academic calendar will be communicated through official university channels.</p>',
            ],
            [
                'slug'       => 'fee-structure-semester-2-2025-2026',
                'title'      => 'Fee Structure Update — Second Semester 2025/2026',
                'department' => 'Finance Office',
                'summary'    => 'The Finance Office has released the updated fee structure for the Second Semester 2025/2026. Students must clear all fee balances before the deadline to be allowed to sit examinations. Penalty interest applies to all overdue balances.',
                'tags'       => ['Fees', 'Finance', 'Students'],
                'published_at' => '2026-01-10 08:00:00',
                'priority'   => 'urgent',
                'body'       => '<p>The Finance Office has released the updated fee structure for the Second Semester 2025/2026. Students are required to clear all outstanding fee balances by 28 February 2026 in order to be registered for end-of-semester examinations.</p><p>Students with outstanding balances beyond the deadline will be de-registered from examinations and will be required to pay a penalty charge as outlined in the KAFU Finance Policy. HELB loan disbursements will be credited automatically to student accounts upon receipt. Students experiencing difficulties should report to the Finance Office for a fee balance review.</p><p>Payment can be made via M-Pesa Paybill Number 000000 (Business Number: KAFU), bank transfer, or at the Finance Office counter during business hours.</p>',
            ],
            [
                'slug'       => 'examination-registration-deadline-semester-2',
                'title'      => 'Notice: Examination Registration Deadline — Semester II',
                'department' => 'Examinations Office',
                'summary'    => 'All registered students must complete their examination registration through the student portal by 31 March 2026. Late registration will attract a penalty fee and no student will be permitted to sit examinations without a valid exam card.',
                'tags'       => ['Examinations', 'Registration', 'Students', 'Deadline'],
                'published_at' => '2026-03-01 08:00:00',
                'priority'   => 'urgent',
                'body'       => '<p>All registered students are required to complete their examination registration through the KAFU student portal by 31 March 2026. Students who have not registered by this deadline will attract a penalty fee of KES 500 per unit.</p><p>No student will be permitted to sit examinations without a valid examination card. Examination cards can be printed from the student portal upon successful registration and fee clearance confirmation.</p><p>Students who have special examination needs (supplementary sittings, deferred examinations, or special accommodations) should report to the Examinations Office in person to complete their registration before the deadline.</p>',
            ],
            [
                'slug'       => 'staff-recruitment-various-positions',
                'title'      => 'Staff Recruitment Notice — Various Academic and Administrative Positions',
                'department' => 'Human Resources',
                'summary'    => 'Kaimosi Friends University invites applications from suitably qualified candidates for various academic and administrative positions. Detailed job descriptions and application requirements are available on the Opportunities page of this website.',
                'tags'       => ['Recruitment', 'Jobs', 'HR', 'Academic Staff'],
                'published_at' => '2026-02-15 08:00:00',
                'priority'   => 'normal',
                'body'       => '<p>Kaimosi Friends University invites applications from suitably qualified candidates for various academic and administrative positions across all five schools and the central administration.</p><p>Current vacancies include Lecturer positions in Computer Science, Nursing, and Business Administration, as well as administrative positions in Finance and the Academic Registry. Full details, including job descriptions, minimum qualifications, application requirements, and submission instructions, are available on the <a href="/opportunities">Opportunities page</a> of this website.</p><p>KAFU is an equal opportunity employer. Women and persons living with disabilities are especially encouraged to apply. Only shortlisted candidates will be contacted.</p>',
            ],
            [
                'slug'       => 'holiday-closure-good-friday-easter',
                'title'      => 'Holiday Closure Notice — Good Friday & Easter Monday 2026',
                'department' => 'Office of the Registrar',
                'summary'    => 'All university offices will be closed on Good Friday (3 April 2026) and Easter Monday (6 April 2026) in observance of the public holidays. Normal operations will resume on Tuesday, 7 April 2026. Emergency inquiries may be directed to the security desk.',
                'tags'       => ['Holiday', 'Office Closure', 'Administration'],
                'published_at' => '2026-03-20 08:00:00',
                'priority'   => 'normal',
                'body'       => '<p>All university offices will be closed on Good Friday (3 April 2026) and Easter Monday (6 April 2026) in observance of the national public holidays.</p><p>Normal university operations will resume on Tuesday, 7 April 2026 at the usual opening hours of 8:00 AM. The University Library will also be closed on both public holidays. The student portal remains accessible 24/7 during this period.</p><p>Emergency inquiries during the holiday period may be directed to the university security desk at the main gate, which will remain staffed as usual.</p>',
            ],
            [
                'slug'       => 'student-health-insurance-enrollment',
                'title'      => 'Student Health Insurance Enrollment Drive — 2025/2026',
                'department' => 'Dean of Students',
                'summary'    => 'All continuing and newly admitted students are required to enroll in the KAFU Student Health Insurance Scheme. Enrollment forms are available at the Dean of Students office and the student health clinic. The annual premium is included in the student welfare fees.',
                'tags'       => ['Health Insurance', 'Student Welfare', 'Dean of Students'],
                'published_at' => '2026-01-20 08:00:00',
                'priority'   => 'normal',
                'body'       => '<p>All continuing and newly admitted students are required to enroll in the KAFU Student Health Insurance Scheme for the 2025/2026 academic year.</p><p>The scheme provides students with access to the KAFU Health Clinic, referral services to partner hospitals, and outpatient cover for common ailments. The annual premium is bundled into student welfare fees and does not require a separate payment.</p><p>Enrollment forms are available at the Dean of Students office and the student health clinic. Students who enrolled last year will be automatically re-enrolled upon payment of welfare fees. New students must complete the enrollment form and submit it with a copy of their student ID within the first four weeks of the semester.</p>',
            ],
            [
                'slug'       => 'special-council-meeting-notice',
                'title'      => 'Notice of Special Council Meeting — March 2026',
                'department' => 'Office of the Vice-Chancellor',
                'summary'    => 'The University Council will convene a special meeting on 26 March 2026 to consider strategic matters related to the proposed campus expansion and the 2026/2027 budget framework. Council members are requested to confirm attendance with the Council Secretary.',
                'tags'       => ['Council', 'Governance', 'Administration'],
                'published_at' => '2026-03-10 08:00:00',
                'priority'   => 'normal',
                'body'       => '<p>The University Council of Kaimosi Friends University will convene a Special Council Meeting on Thursday, 26 March 2026 at 10:00 AM in the Council Chamber, Administration Block, Main Campus.</p><p>The agenda for the special meeting includes: (1) Update on the proposed Vokoli constituent college of health sciences feasibility study; (2) Proposed 2026/2027 budget framework and capital expenditure plan; (3) Status report on Africa Public Service Day 2026 preparations; (4) Any other business.</p><p>All Council members are requested to confirm their attendance with the Council Secretary, Ms. Carolyne Njoroge, by 22 March 2026. Council papers will be distributed electronically by 20 March 2026.</p>',
            ],
            [
                'slug'       => 'library-extended-hours-examinations',
                'title'      => 'Library Extended Hours During Examination Period',
                'department' => 'University Library',
                'summary'    => 'The KAFU University Library will operate extended hours during the examination period (April – May 2026). The library will be open Monday to Friday from 07:00 to 22:00, and Saturday and Sunday from 09:00 to 18:00. Students are reminded to carry valid student identification.',
                'tags'       => ['Library', 'Examinations', 'Students'],
                'published_at' => '2026-03-25 08:00:00',
                'priority'   => 'normal',
                'body'       => '<p>The KAFU University Library will operate extended hours during the examination period running from April through May 2026.</p><p>Extended library hours: Monday to Friday — 07:00 to 22:00; Saturday and Sunday — 09:00 to 18:00. Normal operating hours will resume after the examination period ends.</p><p>Students are reminded to carry valid student identification cards at all times. Bags must be deposited at the bag storage area at the library entrance. Noise levels must be kept to a minimum in the main reading areas. Group study is permitted in the designated Group Study Room (advance booking required — contact the library counter).</p><p>The library catalogue and digital resources remain accessible online 24 hours a day through the library portal.</p>',
            ],
            [
                'slug'       => 'kuccps-category-a-classification',
                'title'      => 'KAFU Achieves Category A Classification by KUCCPS',
                'department' => 'Office of the Vice-Chancellor',
                'summary'    => 'Kaimosi Friends University has been officially classified as a Category A institution by the Kenya Universities and Colleges Central Placement Service (KUCCPS). This milestone places KAFU among the top universities in Kenya for government-sponsored student placement.',
                'tags'       => ['Institutional', 'KUCCPS', 'Accreditation', 'Recognition'],
                'published_at' => '2026-01-30 08:00:00',
                'priority'   => 'normal',
                'body'       => '<p>Kaimosi Friends University has been officially classified as a Category A institution by the Kenya Universities and Colleges Central Placement Service (KUCCPS), placing KAFU among the top universities in Kenya for government-sponsored student placement.</p><p>The Category A classification means that KAFU will now be able to admit students who attained a KCSE mean grade of A in relevant subjects. This opens up a new tier of high-achieving students to KAFU programmes and is expected to significantly enhance the academic profile of each incoming cohort.</p><p>The classification will apply from the 2026/2027 academic year. Prospective students and parents are encouraged to explore KAFU\'s programme offerings at the KAFU Programmes page or contact the Admissions Office at admissions@kafu.ac.ke.</p>',
            ],
            [
                'slug'       => 'postgraduate-intake-june-2026',
                'title'      => 'Postgraduate Intake — January 2026 Session Now Open',
                'department' => 'Graduate School',
                'summary'    => 'Applications for postgraduate programmes (Masters and PhD) for the January 2026 intake are now open. Applicants must hold a minimum of Second Class Honours (Upper Division) for Masters programmes and a Masters degree for Doctoral programmes. Apply through the student portal.',
                'tags'       => ['Postgraduate', 'Admissions', 'Masters', 'PhD'],
                'published_at' => '2026-02-01 08:00:00',
                'priority'   => 'normal',
                'body'       => '<p>Applications for postgraduate programmes (Masters and PhD) for the January 2026 intake are now open through the KAFU Student Portal.</p><p>Minimum entry requirements: For Masters programmes — a relevant Bachelor\'s degree with at least Second Class Honours (Upper Division) or its equivalent from a recognised university; For Doctoral programmes — a relevant Master\'s degree from a recognised university plus a research proposal.</p><p>Available postgraduate programmes include: MBA, MSc Economics (SBE); MSc Information Technology (SCIT); MA Religion, MA English, MEd Educational Psychology, MA Geography, MA Kiswahili, MA Comparative Literature, MA History (SESS); MSc Physics, MSc Applied Mathematics, MSc Pure Mathematics, MSc Microbiology (SOS).</p><p>Application deadline: 28 March 2026. Apply online at portal.kafu.ac.ke or collect physical application forms from the Academic Registrar\'s Office.</p>',
            ],
        ];

        foreach ($announcements as $ann) {
            $upsert([
                'type'        => 'announcement',
                'slug'        => $ann['slug'],
                'title'       => $ann['title'],
                'department'  => $ann['department'],
                'summary'     => $ann['summary'],
                'body'        => $ann['body'],
                'tags'        => $ann['tags'],
                'featured'    => false,
                'published_at' => Carbon::parse($ann['published_at']),
                'structured_data' => [
                    'priority'    => $ann['priority'],
                    'attachments' => [],
                ],
            ]);
        }

        $this->command->info('News, Events, and Announcements seeded successfully.');
    }
}
