<?php

namespace Database\Seeders;

use App\Models\AlumniProfile;
use App\Models\AlumniStory;
use App\Models\EmployerPartner;
use App\Models\GraduateOutcome;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * MP18 — Alumni & Graduate Outcomes (representative seed data).
 * Idempotent: firstOrCreate keyed on slug.
 */
class AlumniSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAlumni();
        $this->seedEmployers();
        $this->seedOutcomes();
        $this->seedStories();
    }

    private function seedAlumni(): void
    {
        $alumni = [
            [
                'name' => 'Dr. Mercy Atieno Owino', 'programme' => 'BSc Computer Science', 'school_code' => 'SCIT',
                'graduation_year' => 2016, 'current_role' => 'Senior Software Engineer', 'current_organization' => 'Safaricom PLC',
                'country' => 'Kenya', 'industry' => 'Technology', 'sector' => 'employed', 'is_featured' => true, 'featured_category' => 'innovator',
                'achievements' => 'Led the engineering team behind a national mobile payments feature serving millions of users.',
                'bio' => 'Mercy graduated top of her class and has since become a leading voice in fintech engineering in East Africa.',
            ],
            [
                'name' => 'Brian Wekesa Simiyu', 'programme' => 'Bachelor of Commerce', 'school_code' => 'SBE',
                'graduation_year' => 2014, 'current_role' => 'Founder & CEO', 'current_organization' => 'GreenHarvest Agritech',
                'country' => 'Kenya', 'industry' => 'Agribusiness', 'sector' => 'entrepreneur', 'is_featured' => true, 'featured_category' => 'ceo',
                'achievements' => 'Built an agritech startup connecting 12,000 smallholder farmers to structured markets.',
                'bio' => 'Brian turned a final-year business plan into a thriving agritech enterprise creating rural employment.',
            ],
            [
                'name' => 'Prof. Janet Wanjiru Kamau', 'programme' => 'BSc Biology', 'school_code' => 'SOS',
                'graduation_year' => 2009, 'current_role' => 'Research Professor', 'current_organization' => 'University of Cape Town',
                'country' => 'South Africa', 'industry' => 'Academia', 'sector' => 'academic_sector', 'is_featured' => true, 'featured_category' => 'researcher',
                'achievements' => 'Published over 40 peer-reviewed papers on infectious disease epidemiology.',
                'bio' => 'Janet is an internationally recognised researcher in molecular parasitology.',
            ],
            [
                'name' => 'Hon. Daniel Otieno Omondi', 'programme' => 'Bachelor of Education (Arts)', 'school_code' => 'SESS',
                'graduation_year' => 2011, 'current_role' => 'County Executive Committee Member', 'current_organization' => 'County Government of Vihiga',
                'country' => 'Kenya', 'industry' => 'Public Service', 'sector' => 'public_sector', 'is_featured' => true, 'featured_category' => 'public_servant',
                'achievements' => 'Spearheaded a county-wide education infrastructure programme.',
                'bio' => 'Daniel transitioned from classroom teaching into public service and policy leadership.',
            ],
            [
                'name' => 'Faith Nasimiyu Barasa', 'programme' => 'BSc Nursing', 'school_code' => 'SHS',
                'graduation_year' => 2018, 'current_role' => 'Clinical Nurse Specialist', 'current_organization' => 'Aga Khan University Hospital',
                'country' => 'Kenya', 'industry' => 'Healthcare', 'sector' => 'employed', 'is_featured' => false,
                'achievements' => 'Recognised for excellence in critical care nursing.',
            ],
            [
                'name' => 'Kevin Mwangi Njoroge', 'programme' => 'BSc Information Technology', 'school_code' => 'SCIT',
                'graduation_year' => 2019, 'current_role' => 'Data Analyst', 'current_organization' => 'KCB Group',
                'country' => 'Kenya', 'industry' => 'Banking', 'sector' => 'employed', 'is_featured' => false,
            ],
            [
                'name' => 'Sharon Akinyi Were', 'programme' => 'Bachelor of Commerce', 'school_code' => 'SBE',
                'graduation_year' => 2017, 'current_role' => 'Programme Officer', 'current_organization' => 'World Vision Kenya',
                'country' => 'Kenya', 'industry' => 'Development', 'sector' => 'ngo_sector', 'is_featured' => false,
            ],
            [
                'name' => 'Dr. Emmanuel Kiptoo Rotich', 'programme' => 'BSc Chemistry', 'school_code' => 'SOS',
                'graduation_year' => 2013, 'current_role' => 'Lecturer', 'current_organization' => 'Kaimosi Friends University',
                'country' => 'Kenya', 'industry' => 'Academia', 'sector' => 'further_study', 'is_featured' => false,
            ],
        ];

        foreach ($alumni as $a) {
            AlumniProfile::firstOrCreate(
                ['slug' => Str::slug($a['name'])],
                array_merge($a, ['visibility' => 'public', 'is_published' => true])
            );
        }
    }

    private function seedEmployers(): void
    {
        $employers = [
            ['name' => 'Safaricom PLC', 'industry' => 'Technology', 'partnership_status' => 'active', 'internship_opportunities' => true, 'graduate_hires' => 24, 'is_featured' => true, 'website_url' => 'https://www.safaricom.co.ke', 'description' => 'Leading telecommunications and technology company in Kenya, a key recruiter of KAFU computing graduates.'],
            ['name' => 'KCB Group', 'industry' => 'Banking', 'partnership_status' => 'active', 'internship_opportunities' => true, 'graduate_hires' => 18, 'is_featured' => true, 'website_url' => 'https://www.kcbgroup.com', 'description' => 'Pan-African banking group offering graduate trainee and internship pipelines.'],
            ['name' => 'Aga Khan University Hospital', 'industry' => 'Healthcare', 'partnership_status' => 'mou_signed', 'internship_opportunities' => true, 'graduate_hires' => 15, 'is_featured' => true, 'description' => 'Tertiary teaching hospital providing clinical placements for health sciences students.'],
            ['name' => 'World Vision Kenya', 'industry' => 'Development', 'partnership_status' => 'active', 'internship_opportunities' => true, 'graduate_hires' => 9, 'is_featured' => false, 'description' => 'International NGO engaging KAFU graduates in community development programmes.'],
            ['name' => 'County Government of Vihiga', 'industry' => 'Public Service', 'partnership_status' => 'active', 'internship_opportunities' => true, 'graduate_hires' => 12, 'is_featured' => false, 'description' => 'Devolved government unit absorbing graduates across education, health, and administration.'],
            ['name' => 'Equity Bank', 'industry' => 'Banking', 'partnership_status' => 'prospective', 'internship_opportunities' => false, 'graduate_hires' => 6, 'is_featured' => false],
        ];

        foreach ($employers as $e) {
            EmployerPartner::firstOrCreate(
                ['slug' => Str::slug($e['name'])],
                array_merge($e, ['is_published' => true])
            );
        }
    }

    private function seedOutcomes(): void
    {
        $outcomes = [
            ['programme' => 'BSc Computer Science', 'programme_slug' => 'bsc-computer-science', 'school_code' => 'SCIT', 'cohort_year' => 2023, 'employment_rate' => 88.5, 'further_study_rate' => 9.0, 'entrepreneurship_rate' => 6.5, 'avg_time_to_employment_months' => 4, 'sample_size' => 62, 'top_employers' => ['Safaricom PLC', 'KCB Group', 'Microsoft ADC'], 'top_sectors' => ['Technology', 'Banking', 'Consulting']],
            ['programme' => 'Bachelor of Commerce', 'programme_slug' => 'bachelor-of-commerce', 'school_code' => 'SBE', 'cohort_year' => 2023, 'employment_rate' => 79.0, 'further_study_rate' => 12.0, 'entrepreneurship_rate' => 14.0, 'avg_time_to_employment_months' => 6, 'sample_size' => 84, 'top_employers' => ['KCB Group', 'Equity Bank', 'Deloitte'], 'top_sectors' => ['Banking', 'Audit', 'Entrepreneurship']],
            ['programme' => 'BSc Nursing', 'programme_slug' => 'bsc-nursing', 'school_code' => 'SHS', 'cohort_year' => 2023, 'employment_rate' => 94.0, 'further_study_rate' => 5.0, 'entrepreneurship_rate' => 1.0, 'avg_time_to_employment_months' => 3, 'sample_size' => 40, 'top_employers' => ['Aga Khan University Hospital', 'Ministry of Health', 'AAR Healthcare'], 'top_sectors' => ['Healthcare', 'Public Health']],
            ['programme' => 'Bachelor of Education (Arts)', 'programme_slug' => 'bachelor-of-education-arts', 'school_code' => 'SESS', 'cohort_year' => 2023, 'employment_rate' => 82.0, 'further_study_rate' => 10.0, 'entrepreneurship_rate' => 4.0, 'avg_time_to_employment_months' => 7, 'sample_size' => 110, 'top_employers' => ['TSC', 'Private Schools', 'County Governments'], 'top_sectors' => ['Education', 'Public Service']],
            ['programme' => 'BSc Biology', 'programme_slug' => 'bsc-biology', 'school_code' => 'SOS', 'cohort_year' => 2023, 'employment_rate' => 71.0, 'further_study_rate' => 22.0, 'entrepreneurship_rate' => 3.0, 'avg_time_to_employment_months' => 8, 'sample_size' => 38, 'top_employers' => ['KEMRI', 'Research Institutes', 'Universities'], 'top_sectors' => ['Research', 'Academia', 'Healthcare']],
        ];

        foreach ($outcomes as $o) {
            GraduateOutcome::firstOrCreate(
                ['programme' => $o['programme'], 'cohort_year' => $o['cohort_year']],
                array_merge($o, ['is_published' => true])
            );
        }
    }

    private function seedStories(): void
    {
        $stories = [
            [
                'title' => 'From Kaimosi to Silicon Savannah', 'alumni_name' => 'Dr. Mercy Atieno Owino',
                'programme' => 'BSc Computer Science', 'graduation_year' => 2016, 'is_featured' => true,
                'summary' => 'How a curious computing student became one of Kenya\'s leading fintech engineers.',
                'body' => 'Mercy still remembers her first programming class in the SCIT labs. Today she leads engineering teams building payment systems used by millions. In this story she reflects on mentorship, persistence, and giving back to her alma mater.',
            ],
            [
                'title' => 'Growing Markets, Growing Communities', 'alumni_name' => 'Brian Wekesa Simiyu',
                'programme' => 'Bachelor of Commerce', 'graduation_year' => 2014, 'is_featured' => true,
                'summary' => 'A business graduate turns a class project into an agritech enterprise serving thousands of farmers.',
                'body' => 'Brian credits the entrepreneurship modules at the School of Business & Economics for the foundation of GreenHarvest Agritech, which now connects 12,000 smallholder farmers to structured markets.',
            ],
            [
                'title' => 'Advancing Science on the Global Stage', 'alumni_name' => 'Prof. Janet Wanjiru Kamau',
                'programme' => 'BSc Biology', 'graduation_year' => 2009, 'is_featured' => false,
                'summary' => 'A School of Science alumna builds an international research career in molecular parasitology.',
                'body' => 'From undergraduate fieldwork in Western Kenya to a research professorship abroad, Janet\'s journey demonstrates the global reach of a KAFU science education.',
            ],
        ];

        foreach ($stories as $s) {
            $alumnus = AlumniProfile::where('name', $s['alumni_name'])->first();
            AlumniStory::firstOrCreate(
                ['slug' => Str::slug($s['title'])],
                array_merge($s, [
                    'alumni_id' => $alumnus?->id,
                    'is_published' => true,
                ])
            );
        }
    }
}
