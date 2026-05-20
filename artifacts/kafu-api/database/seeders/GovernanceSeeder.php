<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CouncilMember;
use App\Models\ManagementProfile;
use App\Models\Directorate;

class GovernanceSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedCouncil();
        $this->seedManagement();
        $this->seedDirectorates();
    }

    private function seedCouncil(): void
    {
        $members = [
            [
                'name'           => 'Prof. John Ong\'ete',
                'title'          => 'Chairperson, University Council',
                'category'       => 'chairperson',
                'credentials'    => ['PhD, University of Nairobi', 'MA, Educational Administration', 'Fellow, Kenya National Academy of Sciences'],
                'bio'            => 'Prof. John Ong\'ete is an accomplished academic administrator with over 30 years of experience in higher education governance. He chairs the Council with a commitment to institutional excellence, financial prudence, and strategic leadership. He previously served as Vice Chancellor of a leading Kenyan university before transitioning to university governance roles.',
                'position_order' => 1,
            ],
            [
                'name'           => 'Dr. Susan Wamuyu',
                'title'          => 'Vice Chairperson, University Council',
                'category'       => 'vice_chair',
                'credentials'    => ['PhD, Business Administration, USIU-Africa', 'CPA (K)', 'FCIPS'],
                'bio'            => 'Dr. Susan Wamuyu brings deep expertise in corporate governance, financial management, and public sector reform to the Council. She is a seasoned board leader with a track record of driving accountability and transparency in both private and public institutions in Kenya.',
                'position_order' => 2,
            ],
            [
                'name'           => 'Prof. Peter Nyamuhanga Mwita',
                'title'          => 'Vice Chancellor — Ex-Officio Member',
                'category'       => 'ex_officio',
                'credentials'    => ['PhD, University of Nairobi', 'MSc, Biomedical Sciences', 'BSc, Biology'],
                'bio'            => 'Prof. Peter Nyamuhanga Mwita was officially appointed Vice Chancellor of Kaimosi Friends University on 14 May 2025, having served in an acting capacity since February 2024. Under his leadership, KAFU continues to advance its mission of quality education, research, and community engagement.',
                'photo_url'      => 'https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg',
                'position_order' => 3,
            ],
            [
                'name'           => 'Mr. James Macharia',
                'title'          => 'Government Representative — National Treasury',
                'category'       => 'government',
                'credentials'    => ['MBA, Finance, University of Nairobi', 'CPA (K)', 'ICPAK Member'],
                'bio'            => 'Mr. James Macharia represents the National Treasury on the KAFU Council, providing oversight on financial management and public expenditure accountability in line with the Public Finance Management Act, 2012.',
                'position_order' => 4,
            ],
            [
                'name'           => 'Dr. Ann Mutua',
                'title'          => 'CS Education Nominee',
                'category'       => 'government',
                'credentials'    => ['PhD, Curriculum Development', 'MEd, Educational Planning', 'BSEd'],
                'bio'            => 'Dr. Ann Mutua is a senior officer in the State Department for University Education & Research. She serves as the Cabinet Secretary\'s nominee on the Council, ensuring alignment with national education policy frameworks and the Kenya Vision 2030 Higher Education Strategy.',
                'position_order' => 5,
            ],
            [
                'name'           => 'Mr. David Wanyonyi',
                'title'          => 'Alumni Representative',
                'category'       => 'member',
                'credentials'    => ['MEng, Civil Engineering', 'BSc, Civil Engineering, KAFU', 'Registered Engineer (EBK)'],
                'bio'            => 'Mr. David Wanyonyi is a distinguished KAFU alumnus and a registered civil engineer. He represents the interests of former students on the Council and champions initiatives that bridge the gap between university training and professional practice.',
                'position_order' => 6,
            ],
            [
                'name'           => 'Ms. Faith Chebet',
                'title'          => 'Student Representative — KAFUSO Chairperson',
                'category'       => 'member',
                'credentials'    => ['Bachelor of Science in Nursing (Ongoing)'],
                'bio'            => 'Ms. Faith Chebet serves as the elected Chairperson of the Kaimosi Friends University Students Organisation (KAFUSO) and represents the student body on the University Council, advocating for student welfare, academic quality, and a conducive campus environment.',
                'position_order' => 7,
            ],
            [
                'name'           => 'Prof. Grace Nyambura',
                'title'          => 'Private Sector Representative',
                'category'       => 'member',
                'credentials'    => ['PhD, Agricultural Economics', 'MSc, Agribusiness Management', 'FNAKOS Fellow'],
                'bio'            => 'Prof. Grace Nyambura is a distinguished agribusiness entrepreneur and academic based in Western Kenya. She brings a private sector and entrepreneurship perspective to the Council, helping align KAFU\'s programmes with industry needs and economic opportunities in the region.',
                'position_order' => 8,
            ],
            [
                'name'           => 'Bishop Daniel Chesang',
                'title'          => 'Friends Church East Africa (FCEA) Representative',
                'category'       => 'member',
                'credentials'    => ['MTh, Friends Theological College', 'BD, Theology', 'Certificate in Organisational Leadership'],
                'bio'            => 'Bishop Daniel Chesang represents the Friends Church East Africa (FCEA) on the Council, upholding the Quaker heritage and values that are foundational to Kaimosi Friends University. He ensures that the university remains faithful to its founding mission of service, integrity, and education without discrimination.',
                'position_order' => 9,
            ],
            [
                'name'           => 'Dr. Esther Simiyu',
                'title'          => 'Council Member — Gender & Social Inclusion',
                'category'       => 'member',
                'credentials'    => ['PhD, Gender Studies, University of Nairobi', 'MA, Development Studies', 'Certified Mediator'],
                'bio'            => 'Dr. Esther Simiyu is a gender and social inclusion specialist who has worked extensively with universities and development partners across East Africa. She ensures that equity, diversity, and inclusion considerations are embedded in all institutional decisions.',
                'position_order' => 10,
            ],
        ];

        foreach ($members as $member) {
            CouncilMember::firstOrCreate(
                ['name' => $member['name']],
                $member
            );
        }
    }

    private function seedManagement(): void
    {
        $profiles = [
            [
                'name'           => 'Prof. Peter N. Mwita',
                'title'          => 'Vice Chancellor',
                'category'       => 'vc',
                'bio'            => 'Prof. Peter N. Mwita (born 15 July 1968) is the Vice Chancellor of Kaimosi Friends University and Secretary to the University Council. He is a Full Professor of Statistics and holds a PhD. He previously served as Deputy Vice-Chancellor (Research, Innovation & Linkages) at Machakos University, where he also served as Acting Vice Chancellor. He has served as Dean of the School of Mathematical Sciences and Chairman of the Department of Statistics and Actuarial Sciences at Jomo Kenyatta University of Agriculture and Technology (JKUAT). He played a key role in restructuring the Kenya National Bureau of Statistics (KNBS) into a competitive semi-autonomous government agency. He currently chairs the Board of Governors of Kendege Technical and Vocational College.',
                'email'          => 'vc@kafu.ac.ke',
                'office'         => 'Vice Chancellor\'s Office, Main Administration Block',
                'phone'          => '+254 777 373 633',
                'photo_url'      => 'https://kafu.ac.ke/wp-content/uploads/2026/02/Prof.-Peter-Mwita-Sec-to-Council.jpg',
                'position_order' => 1,
            ],
            [
                'name'           => 'Prof. Fred. A. Amimo',
                'title'          => 'Deputy Vice Chancellor — Academic, Student Affairs & Research',
                'category'       => 'dvc',
                'bio'            => 'Prof. Fred. A. Amimo serves as the Deputy Vice Chancellor responsible for Academic Affairs, Student Affairs, and Research (DVC ASA&R) at Kaimosi Friends University. He oversees all academic programmes, student welfare, curriculum development, quality assurance, and the university\'s research agenda across the five schools.',
                'email'          => 'dvc-asar@kafu.ac.ke',
                'office'         => 'DVC Academic Office, Administration Block',
                'phone'          => '+254 777 373 640',
                'photo_url'      => 'https://kafu.ac.ke/wp-content/uploads/2026/02/Prof.-Amimo.jpg',
                'position_order' => 2,
            ],
            [
                'name'           => 'Prof. Thomas Kipkurgat',
                'title'          => 'Deputy Vice Chancellor — Administration, Finance, Planning & Development',
                'category'       => 'dvc',
                'bio'            => 'Prof. Thomas Kipkurgat serves as the Deputy Vice Chancellor responsible for Administration, Finance, Planning and Development (DVC AFP&D) at Kaimosi Friends University. He oversees the university\'s administrative operations, financial management, strategic planning, and campus infrastructure development.',
                'email'          => 'dvc-afpd@kafu.ac.ke',
                'office'         => 'DVC Administration Office, Administration Block',
                'phone'          => '+254 777 373 642',
                'photo_url'      => 'https://kafu.ac.ke/wp-content/uploads/2026/02/Kipkurgat.jpg',
                'position_order' => 3,
            ],
            [
                'name'           => 'Dr. Samuel Munda',
                'title'          => 'Senior Assistant Registrar — Academic Affairs',
                'category'       => 'registrar',
                'bio'            => 'Dr. Samuel Munda serves as the Senior Assistant Registrar for Academic Affairs at Kaimosi Friends University. He is responsible for academic registration, examinations management, student records, and compliance with Commission for University Education (CUE) standards.',
                'email'          => 'registrar-aa@kafu.ac.ke',
                'office'         => 'Academic Registrar\'s Office, Administration Block',
                'phone'          => '+254 777 373 650',
                'photo_url'      => 'https://kafu.ac.ke/wp-content/uploads/Dr.-Munda-1.jpg',
                'position_order' => 4,
            ],
            [
                'name'           => 'Dr. Patrick Agesa',
                'title'          => 'Acting Deputy Registrar',
                'category'       => 'registrar',
                'bio'            => 'Dr. Patrick Agesa serves as the Acting Deputy Registrar at Kaimosi Friends University, supporting the overall registry functions including student admissions, records management, academic governance, and institutional compliance.',
                'email'          => 'registrar@kafu.ac.ke',
                'office'         => 'Registry, Administration Block',
                'phone'          => '+254 777 373 651',
                'photo_url'      => 'https://kafu.ac.ke/wp-content/uploads/2026/02/Dr.-Agesa.jpg',
                'position_order' => 5,
            ],
            [
                'name'           => 'CPA Emmanuel M. Momanyi',
                'title'          => 'Finance Officer',
                'category'       => 'finance',
                'bio'            => 'CPA Emmanuel M. Momanyi is the Finance Officer of Kaimosi Friends University, responsible for financial governance, budgeting, financial reporting, fee collection, procurement oversight, and compliance with the Public Finance Management Act.',
                'email'          => 'finance@kafu.ac.ke',
                'office'         => 'Finance Department, Administration Block',
                'phone'          => '+254 777 373 660',
                'photo_url'      => 'https://kafu.ac.ke/wp-content/uploads/IMGPSP_001.png',
                'position_order' => 6,
            ],
            [
                'name'           => 'Dr. Fredrick M. Nyambane',
                'title'          => 'Dean of Students',
                'category'       => 'other',
                'bio'            => 'Dr. Fredrick M. Nyambane serves as the Dean of Students at Kaimosi Friends University, overseeing student welfare, counselling services, accommodation, clubs and societies, and the general wellbeing of the student body.',
                'email'          => 'dean.students@kafu.ac.ke',
                'office'         => 'Dean of Students Office, Student Centre',
                'phone'          => '+254 777 373 670',
                'photo_url'      => 'https://kafu.ac.ke/wp-content/uploads/2026/02/Monanti.jpg',
                'position_order' => 7,
            ],
        ];

        foreach ($profiles as $profile) {
            ManagementProfile::firstOrCreate(
                ['name' => $profile['name'], 'category' => $profile['category']],
                $profile
            );
        }
    }

    private function seedDirectorates(): void
    {
        $directorates = [
            [
                'name'              => 'Directorate of Graduate Studies',
                'slug'              => 'graduate-studies',
                'tagline'           => 'Advancing Postgraduate Excellence at KAFU',
                'description'       => 'The Directorate of Graduate Studies coordinates all postgraduate programmes at Kaimosi Friends University, ensuring academic standards, research quality, and a conducive environment for advanced scholarship. The Directorate manages Master\'s and PhD programmes across all five schools, supporting graduate students from admission through to graduation.',
                'director_name'     => 'Dr. Caroline Mutai',
                'director_title'    => 'Director, Graduate Studies',
                'director_email'    => 'graduate.studies@kafu.ac.ke',
                'director_phone'    => '+254 777 373 700',
                'director_bio'      => 'Dr. Caroline Mutai oversees postgraduate admissions, thesis supervision frameworks, and graduate student support services. She works closely with the five schools to maintain rigorous academic standards and facilitate research collaboration at the postgraduate level.',
                'functions'         => [
                    'Coordination of all Masters and PhD programmes university-wide',
                    'Management of postgraduate admissions processes',
                    'Development and review of postgraduate regulations',
                    'Facilitation of thesis and dissertation examination',
                    'Postgraduate scholarship and fellowship administration',
                    'Graduate student mentorship and career development',
                    'Graduate programme quality assurance and compliance',
                ],
                'services'          => [
                    'Postgraduate programme information and counselling',
                    'Graduate student registration and record management',
                    'Thesis submission and examination coordination',
                    'Graduate research funding support',
                    'Supervisor allocation and progress monitoring',
                    'Graduate certificate and transcript issuance',
                ],
                'quick_links'       => [
                    ['label' => 'Postgraduate Programmes', 'url' => '/programmes'],
                    ['label' => 'Postgraduate Admissions', 'url' => '/admissions#postgraduate'],
                    ['label' => 'Fees & Scholarships', 'url' => '/admissions/fees'],
                ],
                'position_order'    => 1,
            ],
            [
                'name'              => 'Directorate of Research & Innovation',
                'slug'              => 'research-innovation',
                'tagline'           => 'Generating Knowledge that Transforms Society',
                'description'       => 'The Directorate of Research and Innovation drives KAFU\'s research agenda, fostering a culture of inquiry, discovery, and creative problem-solving. The Directorate supports researchers across all disciplines, facilitates funding acquisition, and promotes the translation of research outputs into practical solutions for community and industry challenges.',
                'director_name'     => 'Prof. Daniel Barasa',
                'director_title'    => 'Director, Research & Innovation',
                'director_email'    => 'research@kafu.ac.ke',
                'director_phone'    => '+254 777 373 710',
                'director_bio'      => 'Prof. Daniel Barasa leads KAFU\'s research strategy, managing the research management system, grant acquisition support, and innovation ecosystem. He has personally contributed to over 40 peer-reviewed publications and has secured several multi-million-shilling research grants for the university.',
                'functions'         => [
                    'Development and implementation of the university research strategy',
                    'Management of the Research Management Information System (RMIS)',
                    'Coordination of internal research grants and seed funding',
                    'Support for external grant applications and research partnerships',
                    'Facilitation of research ethics review and approval',
                    'Promotion of research output through publications and conferences',
                    'Management of intellectual property and commercialisation',
                    'Supervision of the KAFU Research Journal',
                ],
                'services'          => [
                    'Research proposal development support',
                    'Grant writing assistance and funding opportunity alerts',
                    'Research ethics clearance',
                    'Research data management and storage',
                    'Conference travel and presentation grants',
                    'Research collaboration matching',
                    'Commercialisation and technology transfer support',
                ],
                'quick_links'       => [
                    ['label' => 'Research Overview', 'url' => '/research'],
                    ['label' => 'Research Projects', 'url' => '/research/projects'],
                    ['label' => 'Publications', 'url' => '/research/publications'],
                    ['label' => 'Research Partners', 'url' => '/research/partnerships'],
                ],
                'position_order'    => 2,
            ],
            [
                'name'              => 'Directorate of ICT',
                'slug'              => 'ict',
                'tagline'           => 'Powering Digital Transformation at KAFU',
                'description'       => 'The ICT Directorate is responsible for planning, implementing, and managing the university\'s technology infrastructure and digital services. From campus network connectivity to the enterprise resource planning system, the Directorate ensures that KAFU\'s digital platforms are reliable, secure, and aligned with the university\'s strategic goals.',
                'director_name'     => 'Mr. Isaac Wafula',
                'director_title'    => 'Director, ICT',
                'director_email'    => 'ict@kafu.ac.ke',
                'director_phone'    => '+254 777 373 680',
                'director_bio'      => 'Mr. Isaac Wafula leads KAFU\'s ICT Directorate, overseeing the university\'s digital infrastructure, enterprise systems, network services, and e-learning platforms. He has spearheaded the implementation of the university\'s ERP system and the expansion of campus-wide internet connectivity to over 5,000 concurrent users.',
                'functions'         => [
                    'Management and maintenance of ICT infrastructure and networks',
                    'Administration of the university ERP and student information systems',
                    'Support and development of e-learning platforms',
                    'Cybersecurity policy and implementation',
                    'ICT procurement and asset management',
                    'Website and digital services administration',
                    'ICT training and user support for staff and students',
                    'Data backup, recovery, and business continuity planning',
                ],
                'services'          => [
                    'ICT helpdesk and technical support',
                    'Email and productivity tools provisioning',
                    'Network connectivity and Wi-Fi access',
                    'ERP system access and troubleshooting',
                    'E-learning platform support (Moodle)',
                    'Software licensing and computer lab management',
                    'Video conferencing and digital collaboration tools',
                ],
                'quick_links'       => [
                    ['label' => 'Student Portal', 'url' => 'https://portal.kafu.ac.ke', 'external' => true],
                    ['label' => 'E-Learning Platform', 'url' => 'https://elearning.kafu.ac.ke', 'external' => true],
                    ['label' => 'ICT Support Desk', 'url' => '/contact'],
                ],
                'position_order'    => 3,
            ],
            [
                'name'              => 'Directorate of Quality Assurance & Performance',
                'slug'              => 'quality-assurance',
                'tagline'           => 'Upholding Standards of Academic Excellence',
                'description'       => 'The Directorate of Quality Assurance and Performance (DQAP) ensures that Kaimosi Friends University maintains high standards in teaching, research, administration, and student services. The Directorate coordinates internal quality audits, programme reviews, and compliance monitoring, aligning with Commission for University Education (CUE) requirements and international best practices.',
                'director_name'     => 'Dr. Naomi Kiptoo',
                'director_title'    => 'Director, Quality Assurance & Performance',
                'director_email'    => 'quality.assurance@kafu.ac.ke',
                'director_phone'    => '+254 777 373 720',
                'director_bio'      => 'Dr. Naomi Kiptoo has led KAFU\'s quality assurance agenda since 2022, overseeing successful CUE inspections, the development of the institutional quality framework, and the implementation of a performance management system for all staff. She holds a PhD in Educational Management and is a certified quality auditor.',
                'functions'         => [
                    'Development and implementation of the university quality management framework',
                    'Coordination of internal quality audits and peer reviews',
                    'Monitoring compliance with Commission for University Education (CUE) standards',
                    'Facilitation of academic programme reviews and curriculum audits',
                    'Administration of student and staff satisfaction surveys',
                    'Preparation of quality assurance reports for Council and Management',
                    'Coordination of institutional accreditation and external reviews',
                    'Training of quality champions across schools and departments',
                ],
                'services'          => [
                    'Programme accreditation support',
                    'Quality audit coordination',
                    'Performance management system administration',
                    'Staff training on quality standards',
                    'CUE compliance monitoring and advisory',
                    'Institutional statistics and performance data',
                ],
                'quick_links'       => [
                    ['label' => 'Academic Programmes', 'url' => '/programmes'],
                    ['label' => 'Schools & Faculties', 'url' => '/schools'],
                ],
                'position_order'    => 4,
            ],
            [
                'name'              => 'Directorate of International Relations',
                'slug'              => 'international-relations',
                'tagline'           => 'Connecting KAFU to the World',
                'description'       => 'The Directorate of International Relations manages KAFU\'s global partnerships, exchange programmes, international student support, and cross-border academic collaborations. The Directorate is committed to positioning KAFU as an internationally engaged institution and expanding its global footprint through strategic alliances with universities, research institutions, and development organisations worldwide.',
                'director_name'     => 'Dr. Sylvia Omondi',
                'director_title'    => 'Director, International Relations',
                'director_email'    => 'international@kafu.ac.ke',
                'director_phone'    => '+254 777 373 730',
                'director_bio'      => 'Dr. Sylvia Omondi leads KAFU\'s international engagement strategy. She has forged partnerships with universities across Europe, North America, and Asia, coordinated student and staff exchange programmes, and provided critical support for international students navigating Kenyan visa and immigration requirements. She holds a PhD in International Relations and a certification in Global Higher Education Management.',
                'functions'         => [
                    'Development and management of international partnership agreements (MoUs)',
                    'Coordination of student and staff exchange programmes',
                    'International student recruitment and support services',
                    'Visa and immigration guidance for international students',
                    'Facilitation of joint research and academic collaborations',
                    'Management of international scholarships and fellowships',
                    'Representation of KAFU at international forums and conferences',
                    'Promotion of KAFU globally through international marketing',
                ],
                'services'          => [
                    'International student admission support',
                    'Student exchange programme coordination',
                    'MoU and partnership agreement management',
                    'Visa and immigration advisory',
                    'International scholarship information',
                    'Study abroad counselling for KAFU students',
                ],
                'quick_links'       => [
                    ['label' => 'International Students', 'url' => '/international'],
                    ['label' => 'Exchange Programmes', 'url' => '/international/exchange'],
                    ['label' => 'Our Partners', 'url' => '/international/partnerships'],
                    ['label' => 'Visa Information', 'url' => '/international/visa'],
                ],
                'position_order'    => 5,
            ],
            [
                'name'              => 'Directorate of Corporate Communications & Marketing',
                'slug'              => 'corporate-communications',
                'tagline'           => 'Telling the KAFU Story to the World',
                'description'       => 'The Directorate of Corporate Communications and Marketing is the institutional voice of Kaimosi Friends University. It manages all internal and external communications, brand identity, media relations, publications, digital content, and event coverage. The Directorate plays a central role in positioning KAFU as a credible, modern university to prospective students, partners, and the wider public.',
                'director_name'     => 'Mr. Brian Momanyi',
                'director_title'    => 'Director, Corporate Communications & Marketing',
                'director_email'    => 'communications@kafu.ac.ke',
                'director_phone'    => '+254 777 373 740',
                'director_bio'      => 'Mr. Brian Momanyi is a communications strategist with over 12 years of experience in higher education branding and public relations. He oversees KAFU\'s media relations, digital presence, publications, and all institutional communications, ensuring that the university\'s story is told accurately, compellingly, and consistently across all channels.',
                'functions'         => [
                    'Management of institutional communications strategy',
                    'Media relations and press office management',
                    'Website content and digital communications management',
                    'University publications: newsletters, annual reports, prospectus',
                    'Brand identity management and compliance',
                    'Photography and videography for institutional events',
                    'Social media management and content creation',
                    'Crisis communications and public relations advisory',
                ],
                'services'          => [
                    'Media enquiries and press releases',
                    'Brand assets and logo usage guidelines',
                    'Photography and video coverage requests',
                    'Newsletter contributions and publications',
                    'Social media promotion for university events',
                    'Website content updates and management',
                ],
                'quick_links'       => [
                    ['label' => 'Latest News', 'url' => '/news'],
                    ['label' => 'Events Calendar', 'url' => '/events'],
                    ['label' => 'Contact Communications', 'url' => '/contact'],
                ],
                'position_order'    => 6,
            ],
            [
                'name'              => 'Directorate of Student Affairs',
                'slug'              => 'student-affairs',
                'tagline'           => 'Supporting Student Success Inside and Outside the Classroom',
                'description'       => 'The Directorate of Student Affairs is dedicated to the holistic development of every KAFU student. The Directorate provides a wide range of support services covering accommodation, counselling, sports and recreation, student leadership, health services, and career development, ensuring that every student has the resources they need to thrive academically and personally.',
                'director_name'     => 'Dr. Paul Simiyu',
                'director_title'    => 'Director, Student Affairs',
                'director_email'    => 'student.affairs@kafu.ac.ke',
                'director_phone'    => '+254 777 373 750',
                'director_bio'      => 'Dr. Paul Simiyu leads the Directorate of Student Affairs with a passionate commitment to student welfare and development. He has championed the expansion of counselling services, introduced a structured student leadership development programme, and overseen the renovation and expansion of KAFU\'s sports facilities.',
                'functions'         => [
                    'Management of student accommodation and residential life',
                    'Coordination of student health, counselling, and wellness services',
                    'Supervision of student organisations and clubs',
                    'Administration of student financial assistance and bursaries',
                    'Management of sports and recreation programmes',
                    'Student leadership development and governance support',
                    'Graduation and convocation planning',
                    'Student discipline and code of conduct administration',
                ],
                'services'          => [
                    'Student accommodation allocation',
                    'Counselling and psychological support',
                    'Student bursary and financial aid application',
                    'Club and society registration support',
                    'Sports facility bookings',
                    'Student health services referrals',
                    'Career and placement advisory',
                ],
                'quick_links'       => [
                    ['label' => 'Student Services', 'url' => '/student-services'],
                    ['label' => 'Student Portal', 'url' => 'https://portal.kafu.ac.ke', 'external' => true],
                    ['label' => 'Contact Student Affairs', 'url' => '/contact'],
                ],
                'position_order'    => 7,
            ],
            [
                'name'              => 'Directorate of Finance',
                'slug'              => 'finance',
                'tagline'           => 'Stewardship of Institutional Resources',
                'description'       => 'The Directorate of Finance is responsible for the prudent management of all financial resources of Kaimosi Friends University. It oversees budgeting, financial planning, fee management, expenditure control, payroll, financial reporting, and compliance with relevant financial laws and regulations including the Public Finance Management Act, 2012.',
                'director_name'     => 'Mr. Peter Odhiambo',
                'director_title'    => 'Finance Officer / Director of Finance',
                'director_email'    => 'finance@kafu.ac.ke',
                'director_phone'    => '+254 777 373 660',
                'director_bio'      => 'Mr. Peter Odhiambo is a certified accountant with over 18 years of experience in public sector financial management. He leads KAFU\'s Finance Directorate with a focus on prudent resource stewardship, transparent reporting, and compliance with government financial regulations.',
                'functions'         => [
                    'Preparation and management of the annual university budget',
                    'Revenue collection and fee management',
                    'Payroll administration for all staff',
                    'Financial reporting to Management and Council',
                    'Compliance with Public Finance Management Act, 2012',
                    'Management of grants, donations, and special funds',
                    'Coordination of internal and external audits',
                    'Asset management and financial controls',
                ],
                'services'          => [
                    'Tuition fee payment and receipting',
                    'Student fee statements and balance inquiries',
                    'Financial clearance for graduation',
                    'Supplier payments and procurement finance',
                    'Bursary and scholarship disbursements',
                    'Staff payslips and payroll enquiries',
                ],
                'quick_links'       => [
                    ['label' => 'Fees & Charges', 'url' => '/admissions/fees'],
                    ['label' => 'Student Portal', 'url' => 'https://portal.kafu.ac.ke', 'external' => true],
                    ['label' => 'Finance Office Contact', 'url' => '/contact'],
                ],
                'position_order'    => 8,
            ],
            [
                'name'              => 'Directorate of Procurement',
                'slug'              => 'procurement',
                'tagline'           => 'Value for Money in Every University Purchase',
                'description'       => 'The Directorate of Procurement manages all procurement activities at Kaimosi Friends University in compliance with the Public Procurement and Asset Disposal Act, 2015. The Directorate ensures transparency, fairness, and value for money in all university purchases, from routine supplies to major infrastructure projects.',
                'director_name'     => 'Mr. Joseph Barasa',
                'director_title'    => 'Director, Procurement',
                'director_email'    => 'procurement@kafu.ac.ke',
                'director_phone'    => '+254 777 373 760',
                'director_bio'      => 'Mr. Joseph Barasa is a certified supply chain professional with extensive experience in public sector procurement. He ensures that all KAFU procurement activities adhere to the highest standards of transparency, equity, and compliance with the Public Procurement and Asset Disposal Act, 2015.',
                'functions'         => [
                    'Planning and management of all university procurement activities',
                    'Preparation and publication of tender notices',
                    'Evaluation of supplier bids and award of contracts',
                    'Management of university supply chain and vendor relationships',
                    'Compliance with Public Procurement and Asset Disposal Act, 2015',
                    'Management of the university asset register and disposals',
                    'Coordination of procurement audit and compliance reviews',
                    'Development of procurement policies and procedures',
                ],
                'services'          => [
                    'Tender notices and procurement opportunities',
                    'Supplier registration and prequalification',
                    'Procurement enquiries and clarifications',
                    'Contract management support',
                    'Asset disposal and auction notices',
                ],
                'quick_links'       => [
                    ['label' => 'Tenders & Procurement', 'url' => '/opportunities?category=tender'],
                    ['label' => 'Contact Procurement', 'url' => '/contact'],
                ],
                'position_order'    => 9,
            ],
        ];

        foreach ($directorates as $data) {
            Directorate::firstOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
