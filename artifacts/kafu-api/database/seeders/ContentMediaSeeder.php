<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContentMediaSeeder extends Seeder
{
    public function run(): void
    {
        $now       = now()->toDateTimeString();
        $authorId  = 1;

        if (DB::table('cms_content')->where('type', 'press_release')->count() > 0) {
            $this->command->info('Media content already seeded, skipping.');
            return;
        }

        $base = [
            'status'          => 'published',
            'is_deleted'      => 0,
            'current_version' => 1,
            'author_id'       => $authorId,
            'tags'            => '[]',
            'seo_meta'        => '{}',
            'related_ids'     => '[]',
            'created_at'      => $now,
            'updated_at'      => $now,
        ];

        // ── Press Releases ────────────────────────────────────────────────
        $pressReleases = [
            ['slug'=>'pr01','title'=>'KAFU Launches New School of Health Sciences Building','category'=>'Infrastructure','published_at'=>'2026-05-12 00:00:00','summary'=>'The Vice Chancellor officially opened the newly constructed School of Health Sciences laboratory block, a KES 120 million facility funded through government capitation and a USAID infrastructure grant.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr02','title'=>'University Receives KES 50 Million Research Grant from Wellcome Trust','category'=>'Research','published_at'=>'2026-04-28 00:00:00','summary'=>'Kaimosi Friends University has been awarded a KES 50 million multi-year research grant by the Wellcome Trust to support health systems research in rural Western Kenya.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr03','title'=>'KAFU Signs MOU with Masinde Muliro University of Science and Technology','category'=>'Partnerships','published_at'=>'2026-04-10 00:00:00','summary'=>'The memorandum of understanding covers joint research initiatives, staff exchange, and sharing of specialized laboratory equipment between the two institutions.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr04','title'=>'CUE Accreditation Renewed for All 38 Programmes','category'=>'Accreditation','published_at'=>'2026-03-05 00:00:00','summary'=>'The Commission for University Education (CUE) has renewed accreditation for all 38 academic programmes offered at Kaimosi Friends University for the 2026–2029 cycle.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr05','title'=>'KAFU 2025 Graduation: 812 Graduates Feted','category'=>'Events','published_at'=>'2025-11-30 00:00:00','summary'=>'Kaimosi Friends University held its 6th graduation ceremony, conferring degrees, diplomas, and certificates to 812 graduands in a colourful ceremony attended by over 3,000 guests.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr06','title'=>'New Vice Chancellor Appointed by University Council','category'=>'Leadership','published_at'=>'2025-10-14 00:00:00','summary'=>'The University Council has approved the appointment of a new substantive Vice Chancellor following a competitive national search. The incoming VC takes office in January 2026.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr07','title'=>'KAFU Ranked Among Top 10 Mid-Size Universities in Kenya','category'=>'Rankings','published_at'=>'2025-09-02 00:00:00','summary'=>'The 2025 UniRank Kenya University Rankings placed KAFU among the top 10 mid-size universities in Kenya, citing improvements in research output, student satisfaction, and employability.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr08','title'=>'KAFU–Rongo University Student Exchange Programme Launched','category'=>'Partnerships','published_at'=>'2025-08-20 00:00:00','summary'=>'A bilateral student exchange programme has been formalised between KAFU and Rongo University, allowing up to 20 students per semester to study at the partner institution.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr09','title'=>'University ISO 9001:2015 Certification Achieved','category'=>'Quality','published_at'=>'2025-06-15 00:00:00','summary'=>'KAFU has been awarded ISO 9001:2015 certification for its Quality Management System, making it one of the first public universities in Kenya to achieve this standard.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr10','title'=>'E-Learning Platform Upgraded — 4,200 Students Now Online','category'=>'Technology','published_at'=>'2025-03-03 00:00:00','summary'=>'The university\'s e-learning platform has been upgraded to support 4,200 concurrent users, with new features including video lectures, live sessions, and mobile app access.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr11','title'=>'KAFU Wins National Innovation Award — Student Category','category'=>'Awards','published_at'=>'2025-02-18 00:00:00','summary'=>'A team of KAFU Computer Science students won first prize at the 2025 Kenya National Innovation Awards for their solar-powered water purification system designed for rural communities.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'pr12','title'=>'University Council Approves 2025–2030 Strategic Plan','category'=>'Governance','published_at'=>'2024-12-10 00:00:00','summary'=>'The University Council has unanimously approved the 2025–2030 Strategic Plan, which sets ambitious targets for enrolment growth, research output, infrastructure development, and community impact.','structured_data'=>json_encode(['file_url'=>'#'])],
        ];
        foreach ($pressReleases as $row) {
            DB::table('cms_content')->insert(array_merge($base, ['type' => 'press_release'], $row));
        }

        // ── Publications ──────────────────────────────────────────────────
        $publications = [
            ['slug'=>'pub01','title'=>'KAFU Prospectus 2025/2026','category'=>'Prospectus','published_at'=>'2025-09-01 00:00:00','summary'=>'The official university prospectus containing programme details, entry requirements, fees, facilities, and scholarship information for the 2025/2026 academic year.','featured_image'=>'/imgs/undergraduate.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>112])],
            ['slug'=>'pub02','title'=>'The KAFU Chronicle — Issue 12 (Jan–Mar 2025)','category'=>'Newsletter','published_at'=>'2025-03-31 00:00:00','summary'=>'Quarterly newsletter covering academic achievements, research highlights, staff news, student activities, and community initiatives for Q1 2025.','featured_image'=>'/imgs/IMG_8696.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>24,'frequency'=>'Quarterly'])],
            ['slug'=>'pub03','title'=>'The KAFU Chronicle — Issue 11 (Oct–Dec 2024)','category'=>'Newsletter','published_at'=>'2024-12-31 00:00:00','summary'=>'Year-end edition featuring 2024 graduation highlights, annual research output summary, staff honours, and alumni spotlight.','featured_image'=>'/imgs/campus-main.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>24,'frequency'=>'Quarterly'])],
            ['slug'=>'pub04','title'=>'Annual Report 2024','category'=>'Annual Report','published_at'=>'2024-11-30 00:00:00','summary'=>'Comprehensive annual report covering enrolment statistics, financial performance, academic achievements, research output, infrastructure development, and strategic milestones for the year 2024.','featured_image'=>'/imgs/aerial-1.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>68])],
            ['slug'=>'pub05','title'=>'Annual Report 2023','category'=>'Annual Report','published_at'=>'2023-12-31 00:00:00','summary'=>'The 2023 Annual Report documenting the university\'s academic, financial, and operational performance including progress against the 2020–2025 Strategic Plan.','featured_image'=>'/imgs/health.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>60])],
            ['slug'=>'pub06','title'=>'Research Digest 2024','category'=>'Research Publication','published_at'=>'2024-10-31 00:00:00','summary'=>'An annual publication highlighting selected research projects, publications, and innovation activities from KAFU\'s five schools and research directorates.','featured_image'=>'/imgs/PIC1.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>48])],
            ['slug'=>'pub07','title'=>'Strategic Plan 2025–2030','category'=>'Strategic Document','published_at'=>'2025-01-01 00:00:00','summary'=>'The KAFU Strategic Plan 2025–2030 outlining the university\'s vision, mission, strategic objectives, and key performance indicators across five strategic pillars.','featured_image'=>'/imgs/campus-main.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>80])],
            ['slug'=>'pub08','title'=>'Student Handbook 2025/2026','category'=>'Handbook','published_at'=>'2025-09-01 00:00:00','summary'=>'Comprehensive guide for students covering academic regulations, conduct and discipline, student welfare services, clubs and societies, and campus life information.','featured_image'=>'/imgs/undergraduate.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>96])],
            ['slug'=>'pub09','title'=>'The KAFU Chronicle — Issue 10 (Jul–Sep 2024)','category'=>'Newsletter','published_at'=>'2024-09-30 00:00:00','summary'=>'Covers mid-year enrolment statistics, the launch of the Health Sciences School, international partnership news, and staff promotions.','featured_image'=>'/imgs/art-culture.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>24,'frequency'=>'Quarterly'])],
            ['slug'=>'pub10','title'=>'The KAFU Chronicle — Issue 9 (Apr–Jun 2024)','category'=>'Newsletter','published_at'=>'2024-06-28 00:00:00','summary'=>'Features the Research Week 2024 highlights, student innovation showcase, sports day results, and community outreach activities.','featured_image'=>'/imgs/IMG_8696.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>24,'frequency'=>'Quarterly'])],
            ['slug'=>'pub11','title'=>'Quality Assurance Framework 2024','category'=>'Policy Document','published_at'=>'2024-08-01 00:00:00','summary'=>'KAFU\'s Quality Assurance Framework outlining internal quality review mechanisms, programme monitoring, and performance evaluation processes aligned to CUE standards.','featured_image'=>'/imgs/health.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>42])],
            ['slug'=>'pub12','title'=>'KAFU Prospectus 2024/2025','category'=>'Prospectus','published_at'=>'2024-09-01 00:00:00','summary'=>'The official university prospectus for the 2024/2025 academic year containing programme listings, fee structures, and admission requirements.','featured_image'=>'/imgs/undergraduate.jpg','structured_data'=>json_encode(['file_url'=>'#','pages'=>104])],
        ];
        foreach ($publications as $row) {
            DB::table('cms_content')->insert(array_merge($base, ['type' => 'publication'], $row));
        }

        // ── Videos ────────────────────────────────────────────────────────
        $videos = [
            ['slug'=>'v01','title'=>'KAFU Graduation Ceremony 2025 — Highlights','category'=>'Ceremony','published_at'=>'2025-11-01 00:00:00','summary'=>'Highlights from the 2025 graduation ceremony celebrating over 800 graduates across all five schools.','structured_data'=>json_encode(['duration'=>'8:24','youtube_id'=>'dQw4w9WgXcQ'])],
            ['slug'=>'v02','title'=>'KAFU Campus Tour — Kaimosi Main Campus','category'=>'Campus Life','published_at'=>'2025-10-01 00:00:00','summary'=>'A guided tour of the main campus facilities including lecture halls, library, laboratories, and student accommodation.','structured_data'=>json_encode(['duration'=>'5:12','youtube_id'=>'dQw4w9WgXcQ'])],
            ['slug'=>'v03','title'=>'Research & Innovation Week 2025','category'=>'Research','published_at'=>'2025-07-01 00:00:00','summary'=>'Showcasing student and faculty research projects during the annual Research and Innovation Week.','structured_data'=>json_encode(['duration'=>'12:40','youtube_id'=>'dQw4w9WgXcQ'])],
            ['slug'=>'v04','title'=>'International Exchange Programme — Welcome Day','category'=>'International','published_at'=>'2025-06-01 00:00:00','summary'=>'Welcoming international students from partner universities in Uganda, Tanzania, and the United Kingdom.','structured_data'=>json_encode(['duration'=>'4:55','youtube_id'=>'dQw4w9WgXcQ'])],
            ['slug'=>'v05','title'=>'KAFU Sports Day 2025','category'=>'Sports','published_at'=>'2025-08-01 00:00:00','summary'=>'Recap of the 2025 Inter-School Sports Day featuring athletics, football, volleyball, and traditional games.','structured_data'=>json_encode(['duration'=>'6:30','youtube_id'=>'dQw4w9WgXcQ'])],
            ['slug'=>'v06','title'=>'Founder\'s Day 2025 — Academic & Cultural Celebrations','category'=>'Events','published_at'=>'2025-09-01 00:00:00','summary'=>'Cultural performances, academic processions, and keynote addresses from the 2025 Founder\'s Day celebrations.','structured_data'=>json_encode(['duration'=>'9:17','youtube_id'=>'dQw4w9WgXcQ'])],
            ['slug'=>'v07','title'=>'KAFU School of Health Sciences — Facility Overview','category'=>'Academic','published_at'=>'2025-04-01 00:00:00','summary'=>'An overview of the newly commissioned School of Health Sciences laboratories and clinical training facilities.','structured_data'=>json_encode(['duration'=>'7:05','youtube_id'=>'dQw4w9WgXcQ'])],
            ['slug'=>'v08','title'=>'Student Testimonials — Life at KAFU','category'=>'Campus Life','published_at'=>'2025-03-01 00:00:00','summary'=>'Current students share their experiences of studying, living, and growing at Kaimosi Friends University.','structured_data'=>json_encode(['duration'=>'3:48','youtube_id'=>'dQw4w9WgXcQ'])],
            ['slug'=>'v09','title'=>'Vice Chancellor\'s Address — 2025 Academic Year','category'=>'Official','published_at'=>'2025-09-15 00:00:00','summary'=>'The Vice Chancellor\'s address at the opening of the 2025/2026 academic year, outlining strategic priorities.','structured_data'=>json_encode(['duration'=>'14:02','youtube_id'=>'dQw4w9WgXcQ'])],
        ];
        foreach ($videos as $row) {
            DB::table('cms_content')->insert(array_merge($base, ['type' => 'video'], $row));
        }

        // ── Downloads ─────────────────────────────────────────────────────
        $downloads = [
            ['slug'=>'dl01','title'=>'Undergraduate Application Form 2025/2026','category'=>'Admissions','published_at'=>'2025-01-15 00:00:00','summary'=>'Official application form for undergraduate degree programmes (Self-Sponsored Category).','structured_data'=>json_encode(['type'=>'PDF','size'=>'280 KB','updated'=>'Jan 2025','file_url'=>'#'])],
            ['slug'=>'dl02','title'=>'Postgraduate Application Form 2025/2026','category'=>'Admissions','published_at'=>'2025-01-15 00:00:00','summary'=>'Official application form for Masters and PhD programmes.','structured_data'=>json_encode(['type'=>'PDF','size'=>'310 KB','updated'=>'Jan 2025','file_url'=>'#'])],
            ['slug'=>'dl03','title'=>'Fee Structure 2025/2026 — Undergraduate','category'=>'Finance','published_at'=>'2025-09-01 00:00:00','summary'=>'Approved tuition and levies fee structure for all undergraduate programmes for the 2025/2026 academic year.','structured_data'=>json_encode(['type'=>'PDF','size'=>'195 KB','updated'=>'Sep 2025','file_url'=>'#'])],
            ['slug'=>'dl04','title'=>'Fee Structure 2025/2026 — Postgraduate','category'=>'Finance','published_at'=>'2025-09-01 00:00:00','summary'=>'Approved fee structure for all postgraduate (Masters and PhD) programmes.','structured_data'=>json_encode(['type'=>'PDF','size'=>'180 KB','updated'=>'Sep 2025','file_url'=>'#'])],
            ['slug'=>'dl05','title'=>'Academic Calendar 2025/2026','category'=>'Academic','published_at'=>'2025-08-01 00:00:00','summary'=>'Approved academic calendar for the 2025/2026 academic year including semester dates, examination periods, and holidays.','structured_data'=>json_encode(['type'=>'PDF','size'=>'145 KB','updated'=>'Aug 2025','file_url'=>'#'])],
            ['slug'=>'dl06','title'=>'Examination Regulations (2023 Edition)','category'=>'Academic','published_at'=>'2023-07-01 00:00:00','summary'=>'Updated examination regulations covering examination conduct, academic integrity, special exam provisions, and appeals.','structured_data'=>json_encode(['type'=>'PDF','size'=>'420 KB','updated'=>'Jul 2023','file_url'=>'#'])],
            ['slug'=>'dl07','title'=>'Student Handbook 2025/2026','category'=>'Student Affairs','published_at'=>'2025-09-01 00:00:00','summary'=>'Comprehensive guide for all students on academic regulations, code of conduct, welfare services, and campus life.','structured_data'=>json_encode(['type'=>'PDF','size'=>'1.8 MB','updated'=>'Sep 2025','file_url'=>'#'])],
            ['slug'=>'dl08','title'=>'Research Proposal Template','category'=>'Research','published_at'=>'2026-03-01 00:00:00','summary'=>'Standard research proposal template for postgraduate students and staff grant applications.','structured_data'=>json_encode(['type'=>'DOCX','size'=>'95 KB','updated'=>'Mar 2026','file_url'=>'#'])],
            ['slug'=>'dl09','title'=>'Staff Leave Application Form','category'=>'Human Resources','published_at'=>'2024-01-01 00:00:00','summary'=>'Annual leave, sick leave, and special leave application form for KAFU employees.','structured_data'=>json_encode(['type'=>'PDF','size'=>'120 KB','updated'=>'Jan 2024','file_url'=>'#'])],
            ['slug'=>'dl10','title'=>'Staff Performance Appraisal Form 2024','category'=>'Human Resources','published_at'=>'2024-01-01 00:00:00','summary'=>'Annual staff performance appraisal tool aligned to the KAFU Strategic Plan 2023–2028.','structured_data'=>json_encode(['type'=>'PDF','size'=>'260 KB','updated'=>'Jan 2024','file_url'=>'#'])],
            ['slug'=>'dl11','title'=>'Bursary & Financial Aid Application Form','category'=>'Finance','published_at'=>'2026-03-01 00:00:00','summary'=>'Application form for KAFU internal bursary, government HELB complementary support, and special needs fund.','structured_data'=>json_encode(['type'=>'PDF','size'=>'175 KB','updated'=>'Mar 2026','file_url'=>'#'])],
            ['slug'=>'dl12','title'=>'Postgraduate Supervision Agreement Template','category'=>'Research','published_at'=>'2025-01-01 00:00:00','summary'=>'Standard supervision agreement between postgraduate students and their supervisors, as required by the School of Graduate Studies.','structured_data'=>json_encode(['type'=>'DOCX','size'=>'110 KB','updated'=>'Jan 2025','file_url'=>'#'])],
            ['slug'=>'dl13','title'=>'Transfer of Units / Credit Transfer Form','category'=>'Academic','published_at'=>'2025-01-01 00:00:00','summary'=>'Form for students applying to transfer academic credits from other accredited institutions.','structured_data'=>json_encode(['type'=>'PDF','size'=>'140 KB','updated'=>'Jan 2025','file_url'=>'#'])],
            ['slug'=>'dl14','title'=>'Room Allocation Request Form — Hostels','category'=>'Student Affairs','published_at'=>'2025-08-01 00:00:00','summary'=>'Form for continuing and new students requesting on-campus hostel accommodation.','structured_data'=>json_encode(['type'=>'PDF','size'=>'100 KB','updated'=>'Aug 2025','file_url'=>'#'])],
            ['slug'=>'dl15','title'=>'Procurement Tender Documents — Current Cycle','category'=>'Procurement','published_at'=>'2026-05-01 00:00:00','summary'=>'Current procurement tender documents for suppliers and service providers. Includes general conditions of contract.','structured_data'=>json_encode(['type'=>'ZIP','size'=>'3.2 MB','updated'=>'May 2026','file_url'=>'#'])],
            ['slug'=>'dl16','title'=>'Student Club Registration Form','category'=>'Student Affairs','published_at'=>'2025-09-01 00:00:00','summary'=>'Form for registering new student clubs, societies, and associations with the Dean of Students office.','structured_data'=>json_encode(['type'=>'PDF','size'=>'90 KB','updated'=>'Sep 2025','file_url'=>'#'])],
        ];
        foreach ($downloads as $row) {
            DB::table('cms_content')->insert(array_merge($base, ['type' => 'download'], $row));
        }

        // ── Archives ──────────────────────────────────────────────────────
        $archives = [
            ['slug'=>'a001','title'=>'The KAFU Chronicle — Issue 12 (Jan–Mar 2025)','category'=>'newsletter','published_at'=>'2025-03-31 00:00:00','summary'=>'Quarterly newsletter covering academic achievements, research highlights, staff news, and community activities for Q1 2025.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a002','title'=>'The KAFU Chronicle — Issue 11 (Oct–Dec 2024)','category'=>'newsletter','published_at'=>'2024-12-31 00:00:00','summary'=>'Year-end edition featuring graduation highlights, 2024 research output summary, and alumni spotlight.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a003','title'=>'Academic Calendar 2024/2025 (Revised)','category'=>'notice','published_at'=>'2024-09-02 00:00:00','summary'=>'Revised academic calendar for 2024/2025 incorporating semester dates, examination periods, and public holidays.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a004','title'=>'COVID-19 Campus Return Guidelines (Final)','category'=>'notice','published_at'=>'2023-03-15 00:00:00','summary'=>'Final guidelines for return to full in-person learning following the COVID-19 transitional period. Superseded by normal operations notice.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a005','title'=>'Inaugural Vice Chancellor — Prof. Peter Mwita Appointed','category'=>'leadership','published_at'=>'2022-01-10 00:00:00','summary'=>'Gazette notice and official announcement of the appointment of Prof. Peter Mwita as the inaugural substantive Vice Chancellor of Kaimosi Friends University.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a006','title'=>'Council Chairperson — Prof. Onyango Kwer Re-appointed','category'=>'leadership','published_at'=>'2023-06-30 00:00:00','summary'=>'Government Gazette notice of the re-appointment of Prof. Onyango Kwer as Chairman of the University Council for a second term.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a007','title'=>'Staff Welfare — Medical Insurance Scheme 2024','category'=>'circular','published_at'=>'2024-01-08 00:00:00','summary'=>'Circular to all staff regarding the 2024 group medical insurance cover, dependants\' enrollment, and claims procedures.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a008','title'=>'KAFU Charter — University Status Gazette Notice','category'=>'notice','published_at'=>'2014-05-12 00:00:00','summary'=>'Original Kenya Gazette notice conferring full university status to Kaimosi Friends University under the Universities Act, 2012.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a009','title'=>'The KAFU Chronicle — Issue 10 (Jul–Sep 2024)','category'=>'newsletter','published_at'=>'2024-09-30 00:00:00','summary'=>'Features mid-year enrolment statistics, the launch of the Health Sciences School, and international partnership news.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a010','title'=>'Commission for University Education (CUE) Accreditation — 2023 Renewal','category'=>'announcement','published_at'=>'2023-11-20 00:00:00','summary'=>'Official notification from CUE confirming accreditation renewal for all five schools and 38 programmes for the period 2023–2026.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a011','title'=>'Revised Staff Performance Appraisal Tool (2023)','category'=>'circular','published_at'=>'2023-04-01 00:00:00','summary'=>'Circular from the Deputy Vice Chancellor (Administration) on the revised annual performance appraisal tool aligned to the KAFU Strategic Plan 2023–2028.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a012','title'=>'Dean, School of Business and Economics — Dr. Atieno Omondi Appointed','category'=>'leadership','published_at'=>'2023-08-14 00:00:00','summary'=>'Official communication on the appointment of Dr. Atieno Margaret Omondi as Dean of the School of Business and Economics.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a013','title'=>'Academic Calendar 2023/2024','category'=>'notice','published_at'=>'2023-08-01 00:00:00','summary'=>'Full academic calendar for the 2023/2024 academic year including commencement dates, recess periods, and examination timetables.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a014','title'=>'KAFU Achieves ISO Pre-Assessment Milestone','category'=>'announcement','published_at'=>'2024-06-15 00:00:00','summary'=>'Management memo on the successful completion of the ISO 9001:2015 pre-assessment, positioning KAFU for full certification in 2025.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a015','title'=>'The KAFU Chronicle — Issue 9 (Apr–Jun 2024)','category'=>'newsletter','published_at'=>'2024-06-28 00:00:00','summary'=>'Features the Research Week 2024 highlights, student innovation showcase, and sports day results.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a016','title'=>'E-Learning Platform Migration Notice (2024)','category'=>'circular','published_at'=>'2024-03-01 00:00:00','summary'=>'Circular to all academic staff and students on the migration to the new e-learning platform and timeline for legacy system decommissioning.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a017','title'=>'Land Title Deed — Kaimosi Campus (Phase II)','category'=>'notice','published_at'=>'2022-09-05 00:00:00','summary'=>'Archived notice on the issuance of the land title deed for the Phase II campus expansion, totalling 42 acres.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a018','title'=>'University Librarian — Ms. Florence Awino Appointed','category'=>'leadership','published_at'=>'2022-05-23 00:00:00','summary'=>'Official notification on the appointment of Ms. Florence Awino as the inaugural substantive University Librarian.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a019','title'=>'Convocation 2024 — 5th Graduation Ceremony Notice','category'=>'announcement','published_at'=>'2024-10-01 00:00:00','summary'=>'Official notice and programme for KAFU\'s 5th Graduation Ceremony held on 18th October 2024 at the Main Campus.','structured_data'=>json_encode(['file_url'=>'#'])],
            ['slug'=>'a020','title'=>'Revised Examination Regulations — 2023 Edition','category'=>'circular','published_at'=>'2023-07-15 00:00:00','summary'=>'Updated examination regulations covering online exams, academic integrity, and special examination provisions.','structured_data'=>json_encode(['file_url'=>'#'])],
        ];
        foreach ($archives as $row) {
            DB::table('cms_content')->insert(array_merge($base, ['type' => 'archive'], $row));
        }

        $this->command->info('Media content seeded: 12 press releases, 12 publications, 9 videos, 16 downloads, 20 archives.');
    }
}
