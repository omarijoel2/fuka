<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\CmsContent;
use App\Models\TaxonomyTerm;
use App\Models\AuditLog;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        // Seed Users
        $users = [
            [
                'name'       => 'System Administrator',
                'email'      => 'admin@kafu.ac.ke',
                'password'   => Hash::make('KafuAdmin@2026'),
                'role'       => 'super_admin',
                'department' => 'ICT Department',
                'status'     => 'active',
            ],
            [
                'name'       => 'ICT Manager',
                'email'      => 'ict@kafu.ac.ke',
                'password'   => Hash::make('KafuICT@2026'),
                'role'       => 'ict_admin',
                'department' => 'ICT Department',
                'status'     => 'active',
            ],
            [
                'name'       => 'Communications Office',
                'email'      => 'comms@kafu.ac.ke',
                'password'   => Hash::make('KafuComms@2026'),
                'role'       => 'communications_admin',
                'department' => 'Corporate Communications',
                'status'     => 'active',
            ],
            [
                'name'       => 'Admissions Officer',
                'email'      => 'admissions@kafu.ac.ke',
                'password'   => Hash::make('KafuAdm@2026'),
                'role'       => 'admissions_owner',
                'department' => 'Admissions Office',
                'status'     => 'active',
            ],
            [
                'name'       => 'Dr. Jane Wanjiku',
                'email'      => 'jwanjiku@kafu.ac.ke',
                'password'   => Hash::make('KafuStaff@2026'),
                'role'       => 'academic_owner',
                'department' => 'School of Education',
                'school_code'=> 'SESS',
                'status'     => 'active',
            ],
            [
                'name'       => 'Procurement Officer',
                'email'      => 'procurement@kafu.ac.ke',
                'password'   => Hash::make('KafuProc@2026'),
                'role'       => 'procurement_owner',
                'department' => 'Procurement Office',
                'status'     => 'active',
            ],
            [
                'name'       => 'HR Officer',
                'email'      => 'hr@kafu.ac.ke',
                'password'   => Hash::make('KafuHR@2026'),
                'role'       => 'hr_owner',
                'department' => 'Human Resources',
                'status'     => 'active',
            ],
            [
                'name'       => 'Content Reviewer',
                'email'      => 'reviewer@kafu.ac.ke',
                'password'   => Hash::make('KafuRev@2026'),
                'role'       => 'reviewer',
                'department' => 'Corporate Communications',
                'status'     => 'active',
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(['email' => $userData['email']], $userData);
        }

        $admin = User::where('email', 'admin@kafu.ac.ke')->first();
        $comms = User::where('email', 'comms@kafu.ac.ke')->first();

        // Seed Taxonomy Terms
        $terms = [
            // Vocabularies
            ['vocabulary' => 'section', 'name' => 'Homepage', 'slug' => 'homepage'],
            ['vocabulary' => 'section', 'name' => 'Admissions', 'slug' => 'admissions'],
            ['vocabulary' => 'section', 'name' => 'Academics', 'slug' => 'academics'],
            ['vocabulary' => 'section', 'name' => 'News & Events', 'slug' => 'news-events'],
            ['vocabulary' => 'section', 'name' => 'Student Services', 'slug' => 'student-services'],
            ['vocabulary' => 'section', 'name' => 'Research', 'slug' => 'research'],
            ['vocabulary' => 'section', 'name' => 'Opportunities', 'slug' => 'opportunities'],

            ['vocabulary' => 'programme_level', 'name' => 'Certificate', 'slug' => 'certificate'],
            ['vocabulary' => 'programme_level', 'name' => 'Diploma', 'slug' => 'diploma'],
            ['vocabulary' => 'programme_level', 'name' => 'Undergraduate', 'slug' => 'undergraduate'],
            ['vocabulary' => 'programme_level', 'name' => 'Postgraduate', 'slug' => 'postgraduate'],
            ['vocabulary' => 'programme_level', 'name' => 'PhD', 'slug' => 'phd'],

            ['vocabulary' => 'opportunity_type', 'name' => 'Tender', 'slug' => 'tender'],
            ['vocabulary' => 'opportunity_type', 'name' => 'Vacancy', 'slug' => 'vacancy'],
            ['vocabulary' => 'opportunity_type', 'name' => 'Scholarship', 'slug' => 'scholarship'],
            ['vocabulary' => 'opportunity_type', 'name' => 'Internship', 'slug' => 'internship'],
            ['vocabulary' => 'opportunity_type', 'name' => 'Call for Papers', 'slug' => 'call-for-papers'],

            ['vocabulary' => 'news_tag', 'name' => 'Research', 'slug' => 'research'],
            ['vocabulary' => 'news_tag', 'name' => 'Innovation', 'slug' => 'innovation'],
            ['vocabulary' => 'news_tag', 'name' => 'Partnership', 'slug' => 'partnership'],
            ['vocabulary' => 'news_tag', 'name' => 'Graduation', 'slug' => 'graduation'],
            ['vocabulary' => 'news_tag', 'name' => 'Outreach', 'slug' => 'outreach'],

            ['vocabulary' => 'event_type', 'name' => 'Graduation', 'slug' => 'graduation'],
            ['vocabulary' => 'event_type', 'name' => 'Public Lecture', 'slug' => 'public-lecture'],
            ['vocabulary' => 'event_type', 'name' => 'Workshop', 'slug' => 'workshop'],
            ['vocabulary' => 'event_type', 'name' => 'Examination', 'slug' => 'examination'],
            ['vocabulary' => 'event_type', 'name' => 'Community Outreach', 'slug' => 'community-outreach'],

            ['vocabulary' => 'audience', 'name' => 'Prospective Students', 'slug' => 'prospective-students'],
            ['vocabulary' => 'audience', 'name' => 'Current Students', 'slug' => 'current-students'],
            ['vocabulary' => 'audience', 'name' => 'Staff', 'slug' => 'staff'],
            ['vocabulary' => 'audience', 'name' => 'Public', 'slug' => 'public'],

            ['vocabulary' => 'campus', 'name' => 'Main Campus, Kaimosi', 'slug' => 'main-campus'],
            ['vocabulary' => 'campus', 'name' => 'Online / Virtual', 'slug' => 'online'],

            ['vocabulary' => 'research_theme', 'name' => 'Agriculture & Food Security', 'slug' => 'agriculture-food-security'],
            ['vocabulary' => 'research_theme', 'name' => 'Health & Well-being', 'slug' => 'health-wellbeing'],
            ['vocabulary' => 'research_theme', 'name' => 'Technology & Innovation', 'slug' => 'technology-innovation'],
            ['vocabulary' => 'research_theme', 'name' => 'Education & Development', 'slug' => 'education-development'],
            ['vocabulary' => 'research_theme', 'name' => 'Environment & Sustainability', 'slug' => 'environment-sustainability'],
        ];

        foreach ($terms as $termData) {
            TaxonomyTerm::firstOrCreate(
                ['vocabulary' => $termData['vocabulary'], 'slug' => $termData['slug']],
                array_merge($termData, ['is_controlled' => true, 'created_by_role' => 'super_admin'])
            );
        }

        // Seed sample CMS content items in various workflow states
        $sampleContent = [
            [
                'type'       => 'news',
                'title'      => 'KAFU Launches New Research Centre for Agricultural Innovation',
                'slug'       => 'kafu-new-research-centre-agricultural-innovation',
                'summary'    => 'Kaimosi Friends University has officially launched a dedicated Research Centre for Agricultural Innovation to support Western Kenya farmers.',
                'body'       => '<p>The new centre will focus on climate-smart farming, soil health, and food security research in partnership with county governments.</p>',
                'status'     => 'published',
                'department' => 'Research Office',
                'category'   => 'Research & Innovation',
                'tags'       => ['research', 'agriculture', 'innovation'],
                'published_at' => now()->subDays(5),
                'featured'   => true,
            ],
            [
                'type'       => 'news',
                'title'      => 'Fee Structure Update — Second Semester 2025/2026',
                'slug'       => 'fee-structure-update-2025-2026-s2',
                'summary'    => 'The Finance Office announces the revised fee structure for Second Semester 2025/2026.',
                'body'       => '<p>All students are required to clear their balance before the examination period.</p>',
                'status'     => 'under_review',
                'department' => 'Finance Office',
                'category'   => 'Institutional',
                'tags'       => ['fees', 'finance'],
            ],
            [
                'type'       => 'announcement',
                'title'      => 'Deadline: Examination Registration — Semester II 2025/2026',
                'slug'       => 'exam-registration-deadline-s2-2026',
                'summary'    => 'All students must register for examinations via the student portal by 31 March 2026.',
                'body'       => '<p>Failure to register will result in exclusion from examinations. Contact the Examinations Office for assistance.</p>',
                'status'     => 'submitted',
                'department' => 'Examinations Office',
                'category'   => 'Examinations',
                'tags'       => ['examinations', 'deadline'],
            ],
            [
                'type'       => 'opportunity',
                'title'      => 'Tender: Supply of Laboratory Equipment — SCIT',
                'slug'       => 'tender-lab-equipment-scit-2026',
                'summary'    => 'KAFU invites sealed bids for the supply and installation of computing laboratory equipment.',
                'body'       => '<p>Reference: KAFU/PROC/2026/018. Deadline: 30 April 2026.</p>',
                'status'     => 'approved',
                'department' => 'Procurement Office',
                'category'   => 'Tender',
                'tags'       => ['procurement', 'tender'],
                'expiry_date'=> now()->addDays(27),
            ],
            [
                'type'       => 'page',
                'title'      => 'Research & Innovation Hub',
                'slug'       => 'research-innovation-hub',
                'summary'    => 'Discover ongoing research projects, publications, and collaborative opportunities at KAFU.',
                'body'       => '<p>KAFU is committed to producing impactful research that transforms communities in Western Kenya and beyond.</p>',
                'status'     => 'draft',
                'department' => 'Research Office',
                'category'   => 'Research',
                'tags'       => ['research', 'innovation'],
            ],
        ];

        foreach ($sampleContent as $contentData) {
            if (!CmsContent::where('slug', $contentData['slug'])->exists()) {
                $contentData['author_id'] = $admin->id;
                $contentData['current_version'] = 1;
                CmsContent::create($contentData);
            }
        }

        // Seed audit log entries
        AuditLog::create([
            'user_id'      => $admin->id,
            'user_name'    => $admin->name,
            'user_role'    => 'super_admin',
            'action'       => 'system.seeded',
            'entity_type'  => 'system',
            'entity_title' => 'CMS Database',
            'notes'        => 'Initial CMS seed completed.',
            'created_at'   => now(),
        ]);
    }
}
