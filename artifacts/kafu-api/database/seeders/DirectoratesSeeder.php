<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * DirectoratesSeeder
 *
 * Canonical source of truth for the `directorates` table.
 * Covers all 9 directorates and the CECARE centre.
 *
 * Safe to re-run at any time — uses updateOrInsert keyed on `slug`.
 * Supersedes GovernanceSeeder's directorate block and DirectoratesPhotoSeeder.
 *
 * Source: https://kafu.ac.ke/directorates-centres/ and individual directorate pages.
 */
class DirectoratesSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $rows = [

            /* ─────────────────────────────────────────────────────────────
             * DIRECTORATES (type = 'directorate')
             * ───────────────────────────────────────────────────────────── */

            // 1. Graduate Studies
            [
                'slug'             => 'graduate-studies',
                'type'             => 'directorate',
                'name'             => 'Directorate of Graduate Studies',
                'tagline'          => 'Advancing Postgraduate Excellence at KAFU',
                'description'      => 'The Directorate of Graduate Studies coordinates admission, teaching, field research, supervision and examination of students in diverse programmes leading to the award of Ph.D. and Masters degrees as well as Postgraduate Diplomas. It is headed by a director who chairs the Board of Graduate Studies (BGS). The mandate and core objective of the directorate is to facilitate both students and graduate faculty to implement effective processes in advanced level study in compliance with the University\'s graduate study policy, CUE guidelines and to attain results comparable with national, regional and international best practices. This positions KAFU as an emerging centre of excellence in Information Technology, Sciences, Arts, Education and Business Studies. The Directorate also promotes multidisciplinary approaches and continuous engagement of staff, students and industry practitioners through regular dissemination in the form of seminars, workshops, conferences and collaborative study.',
                'director_name'    => 'Prof. Benson O. Ojwang',
                'director_title'   => 'Director, GS',
                'director_photo_url' => '/images/uploads/Prof.-Ojwang.jpg',
                'director_bio'     => 'Prof. Benson O. Ojwang serves as Director of Graduate Studies at Kaimosi Friends University, chairing the Board of Graduate Studies and overseeing all postgraduate programmes — Masters, Ph.D., and Postgraduate Diplomas — across the university\'s five schools.',
                'director_message' => null,
                'director_email'   => 'graduate.studies@kafu.ac.ke',
                'director_phone'   => '+254 777 373 700',
                'functions'        => json_encode([
                    'Coordination of all Masters, PhD and Postgraduate Diploma programmes university-wide',
                    'Chairing the Board of Graduate Studies (BGS) and enforcing graduate study policy',
                    'Management of postgraduate admissions in compliance with CUE guidelines',
                    'Facilitation of thesis and dissertation supervision, examination and approval',
                    'Promotion of multidisciplinary research and continuous engagement of staff, students and industry practitioners',
                    'Organisation of seminars, workshops, conferences and collaborative study events',
                    'Development and review of postgraduate regulations and academic standards',
                ]),
                'services'         => json_encode([
                    'Postgraduate programme information and counselling',
                    'Graduate student registration and record management',
                    'Thesis submission and examination coordination',
                    'Supervisor allocation and progress monitoring',
                    'Graduate certificate and transcript issuance',
                    'Postgraduate scholarship and fellowship information',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'Postgraduate Programmes', 'url' => '/programmes'],
                    ['label' => 'Postgraduate Admissions',  'url' => '/admissions#postgraduate'],
                    ['label' => 'Fees & Scholarships',       'url' => '/admissions/fees'],
                ]),
                'staff_roster'     => null,
                'position_order'   => 1,
                'is_active'        => true,
            ],

            // 2. Research, Innovation and Outreach
            [
                'slug'             => 'research-innovation',
                'type'             => 'directorate',
                'name'             => 'Directorate of Research & Innovation',
                'tagline'          => 'Generating Knowledge that Transforms Society',
                'description'      => 'Welcome to the Directorate of Research, Innovation and Outreach (DRIO) at Kaimosi Friends University (KAFU) — the hub of scholarly excellence, creativity, and community engagement. At KAFU, we view research and innovation not merely as academic pursuits, but as transformative tools for societal advancement. Through DRIO, the University fosters a dynamic research culture that inspires discovery, nurtures young researchers, and translates scientific knowledge into real-world impact. Our strategic focus is to build a strong ecosystem that supports multidisciplinary research, technology transfer, and partnerships that address national and global development challenges. The Directorate coordinates research funding, grant applications, capacity building, intellectual property management, and outreach initiatives that connect the University with government, industry, and community partners.',
                'director_name'    => 'Dr. Victor Shikuku',
                'director_title'   => 'Director, RIO',
                'director_photo_url' => null,
                'director_bio'     => 'Dr. Victor Shikuku leads the Directorate of Research, Innovation and Outreach (DRIO) at Kaimosi Friends University. He champions a vibrant research culture, overseeing grant acquisition support, intellectual property management, research ethics review, and community outreach activities that connect the University with government, industry, and community partners.',
                'director_message' => null,
                'director_email'   => 'research@kafu.ac.ke',
                'director_phone'   => '+254 777 373 710',
                'functions'        => json_encode([
                    'Enhance Research Excellence: Foster a vibrant research culture through capacity building, mentorship, and the establishment of multidisciplinary research teams',
                    'Promote Innovation and Technology Transfer: Support the development, protection, and commercialisation of innovative ideas, products, and technologies generated within the University',
                    'Mobilise Research Funding: Attract and manage internal and external research grants through partnerships with government agencies, industry, and international collaborators',
                    'Strengthen Community Outreach and Engagement: Bridge academic research with societal needs through community-based programmes, policy engagement, and extension services',
                    'Facilitate Research Dissemination and Visibility: Promote publication of research outputs in peer-reviewed journals and organise scientific conferences',
                    'Uphold Research Ethics and Integrity: Ensure all research and outreach activities adhere to ethical standards through the Scientific and Ethics Review Committee',
                    'Supervise the KAFU Research Journal and Institutional Repository',
                    'Intellectual property management and commercialisation support',
                ]),
                'services'         => json_encode([
                    'Research proposal development and grant writing support',
                    'Funding opportunity alerts and external grant application support',
                    'Research ethics clearance via the Scientific and Ethics Review Committee',
                    'Research data management and storage',
                    'Conference travel and presentation grants',
                    'Research collaboration and partnership matching',
                    'Commercialisation and technology transfer advisory',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'Research Overview',   'url' => '/research'],
                    ['label' => 'Research Projects',   'url' => '/research/projects'],
                    ['label' => 'Publications',         'url' => '/research/publications'],
                    ['label' => 'Research Partners',   'url' => '/research/partnerships'],
                ]),
                'staff_roster'     => null,
                'position_order'   => 2,
                'is_active'        => true,
            ],

            // 3. ICT Services
            [
                'slug'             => 'ict',
                'type'             => 'directorate',
                'name'             => 'Directorate of Information and Communication Technology Services',
                'tagline'          => 'Powering Digital Transformation at KAFU',
                'description'      => 'The Directorate of Information and Communication Technology (ICTs) is the central support unit that provides all the University\'s ICT services and facilities. Our directorate is committed to supporting, improving, and transforming how ICTs are used across Kaimosi Friends University (KAFU). At KAFU, our goal is to provide the best possible experience for our students and staff, which is why we are persistently improving the way we work. Our ongoing ICTs Transformation Journey is focused on delivering significant improvements to our systems, website, connectivity, and services. This will empower our staff and students to work flexibly with all the information they need at their fingertips. The wireless network (Wi-Fi) is now available across the University campuses, offering connection speeds that are significantly faster than before. We are continually upgrading our infrastructure to increase the internet connection speed and enhance the reliability of our services.',
                'director_name'    => 'Mr. Yohana Obiye',
                'director_title'   => 'In-Charge, ICTS',
                'director_photo_url' => null,
                'director_bio'     => 'Mr. Yohana Obiye is the In-Charge of the Directorate of Information and Communication Technology Services (ICTS) at Kaimosi Friends University. He oversees the university\'s digital infrastructure, enterprise systems, network services, information systems, and web services, leading the ongoing ICTs Transformation Journey to improve connectivity, systems, and digital services across the institution.',
                'director_message' => null,
                'director_email'   => 'ict@kafu.ac.ke',
                'director_phone'   => '+254 777 373 680',
                'functions'        => json_encode([
                    'ICT Support: Installation, maintenance, and repair of all university computer systems and equipment; management of both managed and non-managed devices on the network',
                    'Network Infrastructure and Security: Design and maintenance of the campus-wide High-Speed Local Area Network (LAN) and Data Communication systems; implementation of information security and all ICT networking projects',
                    'Network Management: Creation and maintenance of network configuration and addressing policy; maximising network uptime and performance',
                    'Information Systems: Development and deployment of application software for information management; administration of the Student Portal and ERP server',
                    'Information Security: Coordination and securing of all university data; compliance with Standard Information Security Procedures',
                    'Web Services: Management of the university\'s strategic web presence, content development, upload, and storage; integration of disparate systems into a unified online platform',
                    'E-Learning and Innovation: Support and enhancement of the e-learning infrastructure; guidance on adoption of new ICT in teaching including audio-visuals and video conferencing',
                    'Critical Systems Management: Management of web and repository servers and support for departmental critical systems',
                ]),
                'services'         => json_encode([
                    'ICT helpdesk and technical support',
                    'Equipment maintenance and PC upgrades for staff and students',
                    'Network connectivity, Wi-Fi access, and managed device support',
                    'Student Portal access and records management (online registration, fee statements)',
                    'ERP system hosting and access for academic and administrative functions',
                    'E-learning platform support and video conferencing tools',
                    'University website management and digital content services',
                    'Information security and data protection services',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'Student Portal',       'url' => 'https://portal.kafu.ac.ke', 'external' => true],
                    ['label' => 'E-Learning Platform',  'url' => 'https://elearning.kafu.ac.ke', 'external' => true],
                    ['label' => 'ICT Support Desk',     'url' => '/contact'],
                ]),
                'staff_roster'     => null,
                'position_order'   => 3,
                'is_active'        => true,
            ],

            // 4. Quality Assurance and Management Systems
            [
                'slug'             => 'quality-assurance',
                'type'             => 'directorate',
                'name'             => 'Directorate of Quality Assurance and Management Systems',
                'tagline'          => 'Upholding Standards of Academic Excellence',
                'description'      => 'The Directorate of Quality Assurance and Management Systems (DQAMS) serves as the core institutional body ensuring excellence and integrity at Kaimosi Friends University. Formed in 2021 through a merger, DQAMS operates under two key sections: Quality Assurance (QA) for academic standards, and Quality Management Systems (QMS), guided by ISO 9001:2015 principles, for process efficiency. The primary mission of DQAMS is to ensure that all academic programmes and operational processes meet or exceed national and international quality benchmarks, fostering a campus-wide culture of continuous improvement. This mandate includes guaranteeing the admission of qualified students and the delivery of market-driven, competency-based programmes; conducting mandatory internal audits twice annually; coordinating external audits to validate ISO conformity; and investing in regular staff training on quality management standards and best practices in academic governance.',
                'director_name'    => 'Mr. Nicholas S. Khasoha',
                'director_title'   => 'In-Charge, DQAMS',
                'director_photo_url' => null,
                'director_bio'     => 'Mr. Nicholas S. Khasoha serves as In-Charge of the Directorate of Quality Assurance and Management Systems (DQAMS) at Kaimosi Friends University, overseeing both the Quality Assurance and Quality Management Systems sections. He coordinates internal and external audits, ISO 9001:2015 compliance, academic programme reviews, and institutional capacity building on quality standards.',
                'director_message' => null,
                'director_email'   => 'quality.assurance@kafu.ac.ke',
                'director_phone'   => '+254 777 373 720',
                'functions'        => json_encode([
                    'Academic Quality Assurance: Guaranteeing the admission of qualified students and the delivery of market-driven, competency-based academic programmes',
                    'Internal Audits: Conducting mandatory internal audits twice annually to assess compliance with quality standards',
                    'External Audit Coordination: Coordinating external audits to validate ISO 9001:2015 conformity and quality standards',
                    'Capacity Building: Recruiting and training quality auditors and conducting Lead Auditor Training',
                    'Documentation and Compliance: Developing the QA Handbook and instituting procedures for quality management',
                    'ISO Certification Maintenance: Ensuring timely Surveillance Fee payment and ongoing ISO certification compliance',
                    'Engagement and Alignment: Hosting ISO awareness training, Management Representative Conferences, and regional quality forums',
                    'Programme Reviews: Facilitating academic programme reviews and curriculum audits in line with CUE guidelines',
                ]),
                'services'         => json_encode([
                    'Programme accreditation support and CUE compliance advisory',
                    'Internal quality audit coordination',
                    'ISO 9001:2015 certification maintenance',
                    'Staff training on quality management standards',
                    'Quality management documentation and handbook development',
                    'Institutional performance data and quality reports',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'Academic Programmes', 'url' => '/programmes'],
                    ['label' => 'Schools & Faculties',  'url' => '/schools'],
                ]),
                'staff_roster'     => null,
                'position_order'   => 4,
                'is_active'        => true,
            ],

            // 5. Performance Planning and Contracting
            [
                'slug'             => 'planning-performance-contracting',
                'type'             => 'directorate',
                'name'             => 'Directorate of Performance Planning and Contracting',
                'tagline'          => 'Driving Strategic Growth and Institutional Accountability',
                'description'      => 'Performance Contracting (PC) is the cornerstone of Kaimosi Friends University\'s (KAFU) commitment to delivering high-quality public service. As a critical mechanism under the Public Sector Reforms agenda, the PC is a negotiated, legally-binding agreement between the Government of the Republic of Kenya (through the Ministry of Education) and the University Management. This system ensures that our operations are not only mission-driven but also aligned with national development goals, providing a clear framework for measuring institutional success. The Directorate of Performance Planning and Contracting is charged with institutionalising accountability and transparency, enhancing service delivery through impartiality and fairness, and guaranteeing the effective, efficient, and responsible use of public funds entrusted to the University.',
                'director_name'    => 'Dr. Metrine Sulungi',
                'director_title'   => 'Director, PPC',
                'director_photo_url' => '/images/uploads/Dr.-Sulungai.jpg',
                'director_bio'     => 'Dr. Metrine Sulungai serves as Director of Performance Planning and Contracting at Kaimosi Friends University, overseeing the university\'s compliance with government performance contracting obligations and leading institutional strategic planning and monitoring.',
                'director_message' => 'Performance Contracting (PC) is the cornerstone of Kaimosi Friends University\'s (KAFU) commitment to delivering high-quality public service. As a critical mechanism under the Public Sector Reforms agenda, the PC is a negotiated, legally-binding agreement between the Government of the Republic of Kenya (specifically through the Ministry of Education) and the University Management. This system ensures that our operations are not only mission-driven but also aligned with national development goals, providing a clear framework for measuring institutional success. The primary purpose of the PC system is multifaceted, designed to establish clarity and consensus on the University\'s strategic priorities while guaranteeing that public resources are used effectively to achieve measurable results. Fundamentally, this process is geared toward three key outcomes: First, it is about Ensuring Accountability and Integrity by institutionalizing a culture of accountability, transparency, and promoting the core values and principles of the public service. Second, it focuses on Enhancing Service Delivery by mandating impartiality, fairness, and responsiveness in the provision of public services, thereby promoting equality for all our students, staff, and stakeholders. Third, it insists on Resource Optimization, guaranteeing the effective, efficient, and responsible use of public funds entrusted to the University. The Directorate of Planning and Performance Contracting is specifically charged with overseeing the University\'s commitment to these standards through Target Cascading and rigorous Monitoring and Reporting.',
                'director_email'   => 'planning@kafu.ac.ke',
                'director_phone'   => '+254 777 373 780',
                'functions'        => json_encode([
                    'Target Cascading: Setting comprehensive performance targets and extending the contract to all departments, sections, units, levels, and cadres of employees for complete institutional integration',
                    'Monitoring and Reporting: Continuously tracking progress and submitting detailed quarterly and annual reports to designated government agencies',
                    'Accountability and Integrity: Institutionalising a culture of accountability, transparency, and promoting the core values and principles of the public service',
                    'Service Delivery Enhancement: Mandating impartiality, fairness, and responsiveness in the provision of public services',
                    'Resource Optimisation: Guaranteeing the effective, efficient, and responsible use of public funds entrusted to the University',
                    'Strategic Planning: Coordinating the development and monitoring of the University\'s strategic plan and institutional development programmes',
                    'Institutional Research and Statistics: Managing institutional data and preparing evidence-based reports for management and external agencies',
                ]),
                'services'         => json_encode([
                    'Institutional statistics and data requests',
                    'Strategic plan information and progress updates',
                    'Performance contracting compliance advisory',
                    'Quarterly and annual performance reports',
                    'Development project planning and M&E support',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'About KAFU', 'url' => '/about'],
                    ['label' => 'Contact Us',  'url' => '/contact'],
                ]),
                'staff_roster'     => json_encode([
                    ['name' => 'Dr. Metrine Sulungi', 'title' => 'Director, PPC', 'photo_url' => '/images/uploads/Dr.-Sulungai.jpg', 'email' => 'planning@kafu.ac.ke'],
                ]),
                'position_order'   => 5,
                'is_active'        => true,
            ],

            // 6. Corporate Affairs
            [
                'slug'             => 'corporate-affairs',
                'type'             => 'directorate',
                'name'             => 'Directorate of Corporate Affairs',
                'tagline'          => 'Shaping Institutional Identity, Voice and Reputation',
                'description'      => 'At Kaimosi Friends University, communication is a strategic function that underpins institutional growth, visibility and reputation. The Corporate Affairs Department is entrusted with the responsibility of shaping and projecting the University\'s image through clear, consistent and credible engagement with our diverse stakeholders. Our role extends beyond information dissemination — we position the University by articulating its vision, showcasing its achievements and strengthening its identity in an increasingly competitive higher education landscape. Through strategic communication, media relations, branding, digital platforms and stakeholder engagement, we ensure that the University\'s voice remains authoritative, responsive and aligned to its core mandate of teaching, research and community service. The Corporate Affairs Section is domiciled in the Office of the Vice-Chancellor and serves as the central coordinating unit for the University\'s corporate communication and public relations functions.',
                'director_name'    => 'Mr. Silas Rugut',
                'director_title'   => 'Director, Corporate Affairs',
                'director_photo_url' => null,
                'director_bio'     => 'Mr. Silas Rugut serves as Director of Corporate Affairs at Kaimosi Friends University, overseeing all institutional communications, media relations, branding, digital platforms and stakeholder engagement. He leads the University\'s efforts to position KAFU as a credible, trusted and recognisable institutional brand in the higher education landscape.',
                'director_message' => 'At Kaimosi Friends University, communication is a strategic function that underpins institutional growth, visibility and reputation. The Corporate Affairs Department is entrusted with the responsibility of shaping and projecting the University\'s image through clear, consistent and credible engagement with our diverse stakeholders. Our role extends beyond information dissemination. We position the University by articulating its vision, showcasing its achievements and strengthening its identity in an increasingly competitive higher education landscape. Through strategic communication, media relations, branding, digital platforms and stakeholder engagement, we ensure that the University\'s voice remains authoritative, responsive and aligned to its core mandate of teaching, research and community service. We are deliberate in leveraging both traditional and emerging communication channels to enhance visibility, support student enrolment, promote partnerships and reinforce public confidence in the University. Equally, we remain committed to upholding the highest standards of professionalism, accuracy and integrity in all our engagements. As Kaimosi Friends University continues to expand its academic, research and outreach footprint, the Corporate Affairs Department will remain a key enabler in building a strong, trusted and recognizable institutional brand. We welcome you to connect with us and be part of our journey of excellence.',
                'director_email'   => 'communications@kafu.ac.ke',
                'director_phone'   => '+254 777 373 740',
                'functions'        => json_encode([
                    'Marketing and Publicity — drives visibility through targeted campaigns that promote programmes and support student enrolment.',
                    'Corporate Communication — manages internal and external communication to ensure clear, timely and consistent messaging.',
                    'Media Relations — coordinates engagement with media and facilitates accurate press coverage of University activities.',
                    'Corporate Branding — safeguards and promotes the University\'s corporate identity across all platforms and materials.',
                    'Corporate Events — plans and executes official University functions, ceremonies and institutional engagements.',
                    'Protocol and Events Coordination — ensures adherence to protocol standards and effective coordination of events.',
                    'Corporate Publications — oversees development of newsletters, reports and other institutional publications.',
                    'Corporate Social Responsibility — implements community outreach and social impact initiatives.',
                    'Corporate Policy Development — formulates and reviews policies guiding communication and public relations.',
                    'Photographic Services — provides professional visual documentation for communication and publicity needs.',
                ]),
                'services'         => json_encode([
                    'Media enquiries and press releases',
                    'Brand assets and logo usage guidelines',
                    'Photography and video coverage requests',
                    'Newsletter contributions and institutional publications',
                    'Social media promotion for university events and programmes',
                    'Website content management and digital communications',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'Latest News',                 'url' => '/news'],
                    ['label' => 'Events Calendar',             'url' => '/events'],
                    ['label' => 'Contact Corporate Affairs',   'url' => '/contact'],
                ]),
                'staff_roster'     => json_encode([
                    ['name' => 'Mr. Silas Rugut',       'title' => 'Director, Corporate Affairs',        'photo_url' => null, 'email' => 'corporateaffairs@kafu.ac.ke'],
                    ['name' => 'Mr. Arnold Adidi',      'title' => 'Assistant Public Relations Officer', 'photo_url' => null, 'email' => null],
                    ['name' => 'Ms. Claudia Mballaga',  'title' => 'Assistant Public Relations Officer', 'photo_url' => null, 'email' => null],
                    ['name' => 'Ms. Linah Moraa',       'title' => 'Office Administrator',               'photo_url' => null, 'email' => null],
                    ['name' => 'Mr. Dan Shamwamwa',     'title' => 'Office Assistant',                   'photo_url' => null, 'email' => null],
                    ['name' => 'Mr. Charles Alulu',     'title' => 'Community Liaison',                  'photo_url' => null, 'email' => null],
                ]),
                'position_order'   => 6,
                'is_active'        => true,
            ],

            // 7. University Linkages, Alumni and Career Services
            [
                'slug'             => 'university-linkages-alumni-career',
                'type'             => 'directorate',
                'name'             => 'Directorate of University Linkages, Alumni and Career Services',
                'tagline'          => 'Connecting KAFU to the World and Its Graduates to Opportunity',
                'description'      => 'The Directorate of University Linkages, Alumni and Career Services (DULACS) at Kaimosi Friends University (KAFU) was established in 2019 with the sole responsibility of overseeing matters of partnerships, collaborations, and linkages with like-minded organisations and institutions with the purpose of improving the University\'s image both locally and globally. DULACS is dedicated to serving as the link between the academic and the non-academic community by developing services and delivering programmes to facilitate student and staff engagement for their personal growth and for the good of society at large. The University, through DULACS, initiates, implements, and sustains collaborations with partners across the world to produce innovative research, deliver innovative teaching and learning, and create opportunities for students and staff to gain international experience through exchange programmes.',
                'director_name'    => 'Prof. Okumu Joseph Otsyulah',
                'director_title'   => 'Director, DULACS',
                'director_photo_url' => null,
                'director_bio'     => 'Prof. Okumu Joseph Otsyulah CHRP(K) serves as Director of the Directorate of University Linkages, Alumni and Career Services (DULACS) at Kaimosi Friends University. He oversees all partnership, collaboration, alumni engagement, and career development activities, working to position KAFU as an internationally engaged institution while supporting graduates in building successful careers.',
                'director_message' => 'The Directorate of University Linkages, Alumni and Career Services (DULACS) at Kaimosi Friends University (KAFU) was established in 2019 with the sole responsibility of overseeing matters of partnerships, collaborations, and linkages with like-minded organizations and institutions with the sole purpose of improving the University\'s image both locally and globally. The Directorate, therefore, plays an integral role in ensuring that the University\'s Mission of providing quality education, training, research, and innovation to meet the needs of dynamic society is realized. DULACS is dedicated to serving as the link between the academic and the non-academic community by developing services and delivering programs to facilitate student and staff engagement for their personal growth and for the good of society at large. We believe that it is through linkages, collaborations, and partnerships that we foster international awareness and deeper understanding of current emerging issues such as Food Security, unemployment, Climate Change, and Epidemic diseases that can be addressed accordingly. The University, through DULACS, initiates, implements, and sustains collaborations with partners across the world to produce innovative research, deliver innovative teaching and learning, and create opportunities for students and staff to gain international experience through exchange programs. The directorate not only provides guidance and support to students seeking career advice but also initiates and conducts linkages with the industry and other stakeholder players. The alumni engagement activities are both monitored and partnership initiation undertaken through career services programs.',
                'director_email'   => 'linkages@kafu.ac.ke',
                'director_phone'   => '+254 777 373 730',
                'functions'        => json_encode([
                    'Development and management of international and local partnership agreements (MoUs)',
                    'Coordination of student and staff exchange programmes',
                    'International student recruitment and support services',
                    'Visa and immigration guidance for international students',
                    'Alumni engagement and association management',
                    'Career development services and graduate placement support',
                    'Management of internship and industrial attachment programmes',
                    'Representation of KAFU at national and international forums',
                ]),
                'services'         => json_encode([
                    'International student admission support',
                    'Student exchange programme coordination',
                    'MoU and partnership agreement management',
                    'Visa and immigration advisory',
                    'Alumni registration and networking',
                    'Career counselling and job placement support',
                    'Internship and attachment placement assistance',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'International Students',  'url' => '/international'],
                    ['label' => 'Exchange Programmes',     'url' => '/international/exchange'],
                    ['label' => 'Our Partners',            'url' => '/international/partnerships'],
                    ['label' => 'Career Services',         'url' => '/contact'],
                ]),
                'staff_roster'     => json_encode([
                    ['name' => 'Prof. Okumu Joseph Otsyulah CHRP(K)', 'title' => 'Director, DULACS', 'photo_url' => null, 'email' => 'linkages@kafu.ac.ke'],
                ]),
                'position_order'   => 7,
                'is_active'        => true,
            ],

            // 8. Enterprise and Resource Mobilization
            [
                'slug'             => 'enterprises-resource-mobilization',
                'type'             => 'directorate',
                'name'             => 'Directorate of Enterprise and Resource Mobilization',
                'tagline'          => 'Transforming University Resources into Sustainable Enterprises',
                'description'      => 'The Directorate of Enterprise and Resource Mobilization (ERM) plays a strategic role in advancing Kaimosi Friends University\'s agenda on sustainability, innovation, practical training and income generation. Through its enterprise activities — particularly the University Farm — the Directorate continues to support teaching, research and resource mobilisation while promoting commercially viable and sustainable ventures. Key areas of operation include dairy production, crop farming, greenhouse farming, poultry, aquaculture, apiary development and other emerging income-generating initiatives. These enterprises provide students with practical exposure while strengthening the University\'s capacity to diversify revenue streams.',
                'director_name'    => 'Dr. Damianus Okaka',
                'director_title'   => 'Director, Enterprise & Resource Mobilization',
                'director_photo_url' => null,
                'director_bio'     => 'Dr. Damianus Okaka serves as Director of Enterprise and Resource Mobilization at Kaimosi Friends University, overseeing all commercial enterprises including the University Farm, dairy production, crop farming, poultry, aquaculture, and apiary development, as well as resource mobilisation partnerships and fundraising activities.',
                'director_message' => 'The Directorate of Enterprise and Resource Mobilization (ERM) plays a strategic role in advancing Kaimosi Friends University\'s agenda on sustainability, innovation, practical training and income generation. Through its enterprise activities, particularly the University Farm, the Directorate continues to support teaching, research and resource mobilization while promoting commercially viable and sustainable ventures. Our focus is to transform institutional resources into productive enterprises that contribute to the University\'s growth and long-term financial resilience. Key areas of operation include dairy production, crop farming, greenhouse farming, poultry, aquaculture, apiary development and other emerging income-generating initiatives. These enterprises provide students with practical exposure while strengthening the University\'s capacity to diversify revenue streams. As a Directorate, we remain committed to prudent resource utilization, innovation, strategic partnerships and continuous improvement. We shall continue to enhance productivity, expand enterprise opportunities and support the University\'s vision of becoming a centre of excellence in teaching, research and community service.',
                'director_email'   => 'enterprises@kafu.ac.ke',
                'director_phone'   => '+254 777 373 790',
                'functions'        => json_encode([
                    'University Farm Management: Overseeing dairy production, crop farming, greenhouse farming, poultry, aquaculture, and apiary development',
                    'Income Generation: Developing and managing commercially viable enterprises that contribute to the University\'s financial resilience',
                    'Practical Training Support: Providing students with practical exposure to agricultural and enterprise activities aligned with their studies',
                    'Resource Mobilisation: Attracting funding from government, donors, development partners, and private sector through strategic partnerships',
                    'Enterprise Expansion: Identifying new income-generating opportunities and emerging ventures aligned with the University\'s mission',
                    'Innovation and Sustainability: Promoting prudent resource utilisation, sustainable farming practices, and continuous improvement',
                    'Reporting: Reporting on enterprise performance and resource mobilisation outcomes to University Management and Council',
                ]),
                'services'         => json_encode([
                    'Sponsorship and partnership proposals',
                    'University facilities and conference hire',
                    'Commercial agricultural produce and farm products',
                    'Practical training attachments and field visits',
                    'Donation and endowment management',
                    'Commercial consultancy and advisory services',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'About KAFU', 'url' => '/about'],
                    ['label' => 'Contact Us',  'url' => '/contact'],
                ]),
                'staff_roster'     => json_encode([
                    ['name' => 'Dr. Damianus Okaka', 'title' => 'Director, Enterprise & Resource Mobilization', 'photo_url' => null, 'email' => 'enterprises@kafu.ac.ke'],
                ]),
                'position_order'   => 8,
                'is_active'        => true,
            ],

            // 9. Open, Distance and E-Learning
            [
                'slug'             => 'open-distance-elearning',
                'type'             => 'directorate',
                'name'             => 'Directorate of Open, Distance and E-Learning',
                'tagline'          => 'Expanding Access to Quality Higher Education',
                'description'      => 'Kaimosi Friends University (KAFU) has been at the forefront of modern education, seamlessly blending traditional on-campus excellence with a dynamic Open, Distance & e-Learning (ODeL) platform. The ODeL Directorate was established with a clear mandate to dismantle the barriers of the conventional classroom by focusing on three core pillars: accessibility, flexibility, and innovation. By widening the reach of quality higher education and adapting to the modern student\'s lifestyle, KAFU ensures that learning extends far beyond physical boundaries. We believe that your location or schedule should never dictate your potential; therefore, our programmes are designed to be immersive and participative, providing distance learners with the same academic rigour and support as those on campus.',
                'director_name'    => 'Dr. Hillan Ronoh',
                'director_title'   => 'Director, Directorate of Open, Distance and E-Learning',
                'director_photo_url' => '/images/uploads/Dr.-Ronoh.jpg',
                'director_bio'     => 'Dr. Hillan Ronoh serves as Director of the Directorate of Open, Distance and E-Learning at Kaimosi Friends University. He leads the University\'s efforts to make quality higher education accessible to students regardless of location or schedule, overseeing the LMS platform, distance programme delivery, learner support services, and academic staff capacity building in online teaching.',
                'director_message' => null,
                'director_email'   => 'odel@kafu.ac.ke',
                'director_phone'   => '+254 777 373 770',
                'functions'        => json_encode([
                    'Synchronous and Asynchronous Teaching Support: Providing tools and sessions for live interaction (chat, video conferencing, virtual classrooms) and asynchronous resources (recorded lectures, readings, assignments)',
                    'Learner Support Services: Including orientation, enrolment to the LMS and courses, tutorials, library and resource support, issuing reports, and maintaining student records',
                    'Technical Support and Help Desk: Helping students and faculty with access to the platform, navigation, software/hardware issues, and troubleshooting connectivity',
                    'Module Development and Production: Facilitating and supporting the designing, development, and uploading of course materials (digital and multimedia) for online or blended learning',
                    'Learning Management System (LMS) Administration: Managing and maintaining the LMS platform — uploading materials, managing user access, ensuring uptime, configuring interactive tools (forums, quizzes, live sessions)',
                    'Assessment and Examinations: Managing continuous assessments, assignments, quizzes, exams, grading, and feedback mechanisms',
                    'Quality Assurance and Monitoring: Collaboration with DQAMS to ensure that course materials, delivery, learner support, and tools maintain required standards',
                    'Capacity Building: Training academic staff and tutors on effective online and blended course design, facilitation, and assessment',
                ]),
                'services'         => json_encode([
                    'ODeL programme information and application guidance',
                    'Distance learner registration and LMS enrolment support',
                    'E-learning platform access and technical support',
                    'Online study materials and digital resource access',
                    'Assessment, examination management and grading support',
                    'Online examination registration and invigilation support',
                    'ODeL fee structure advisory',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'E-Learning Platform',       'url' => 'https://elearning.kafu.ac.ke', 'external' => true],
                    ['label' => 'ODeL Programmes',           'url' => '/programmes?mode=distance'],
                    ['label' => 'Student Portal',            'url' => 'https://portal.kafu.ac.ke', 'external' => true],
                    ['label' => 'Apply for ODeL Programme',  'url' => '/admissions'],
                ]),
                'staff_roster'     => null,
                'position_order'   => 9,
                'is_active'        => true,
            ],

            /* ─────────────────────────────────────────────────────────────
             * CENTRES (type = 'centre')
             * ───────────────────────────────────────────────────────────── */

            // 1. Centre of Excellence on Climate Action and Research
            [
                'slug'             => 'cecare',
                'type'             => 'centre',
                'name'             => 'Centre of Excellence on Climate Action and Research',
                'tagline'          => 'A Premier Hub for Climate Research, Policy and Community Resilience',
                'description'      => 'The Centre of Excellence on Climate Action and Research (CECARE) was established at Kaimosi Friends University in September 2024 in collaboration with the County Government of Vihiga (CGV) and the University Fund (UF). CECARE is responsible for informing policies through research and training on climate change issues, including adaptation, mitigation, and financing. It stands as a vital nexus between academia, government, and local communities, driving tangible climate action and sustainable development in Vihiga County, the Lake Region Economic Block (LREB) and beyond.',
                'director_name'    => 'Prof. Caroline Mulinya',
                'director_title'   => 'Director, CECARE',
                'director_photo_url' => null,
                'director_bio'     => 'Prof. Caroline Mulinya serves as Director of the Centre of Excellence on Climate Action and Research (CECARE) at Kaimosi Friends University, leading the centre\'s research, policy engagement, and community resilience programmes on climate change.',
                'director_message' => 'The Centre of Excellence on Climate Action and Research (CECARE) was established at Kaimosi Friends University in September 2024 in collaboration with the County Government of Vihiga (CGV) and the University Fund (UF). It is responsible for informing policies through research and training on Climate Change issues, including adaptation, mitigation, and financing. Our mission is to serve as a premier hub for informing evidence-based policy, driving innovative research, and building community resilience in the face of climate change. CECARE is dedicated to understanding climate variability and its impacts on the environment and society. Its core activities are structured around four key pillars: Research and Knowledge Management, Policy and Stakeholder Engagement, Community Action and Innovation, and Global Alignment. We interpret and localise global climate frameworks and declarations to contribute effectively to achieving the Sustainable Development Goals (SDGs). CECARE stands as a vital nexus between academia, government, and local communities, driving tangible climate action and sustainable development in Vihiga County, the Lake Region Economic Block (LREB) and beyond.',
                'director_email'   => 'cecare@kafu.ac.ke',
                'director_phone'   => '+254 777 373 633',
                'functions'        => json_encode([
                    'Research and Knowledge Management — conducting cutting-edge research on climate adaptation, mitigation, and financing; managing climate information and documenting best practices.',
                    'Policy and Stakeholder Engagement — translating research into actionable insights for policymakers and increasing public awareness through targeted outreach on climate change consequences and solutions.',
                    'Community Action and Innovation — developing and implementing on-the-ground projects to enhance community resilience, including innovations in renewable energy, clean technology, recycling, and sustainable practices.',
                    'Global Alignment — interpreting and localising global climate frameworks and declarations to contribute effectively to achieving the Sustainable Development Goals (SDGs).',
                ]),
                'services'         => json_encode([
                    'Climate change research and technical advisory',
                    'Policy briefs and evidence-based recommendations',
                    'Community resilience training and capacity building',
                    'Renewable energy and clean technology innovation',
                    'Climate data and knowledge management',
                    'Stakeholder outreach and public awareness programmes',
                ]),
                'quick_links'      => json_encode([
                    ['label' => 'Research Overview',  'url' => '/research'],
                    ['label' => 'Research Projects',  'url' => '/research/projects'],
                    ['label' => 'Contact Us',          'url' => '/contact'],
                ]),
                'staff_roster'     => json_encode([
                    ['name' => 'Prof. Caroline Mulinya', 'title' => 'Director, CECARE', 'photo_url' => null, 'email' => 'cecare@kafu.ac.ke'],
                ]),
                'position_order'   => 1,
                'is_active'        => true,
            ],
        ];

        $inserted = 0;
        $updated  = 0;

        foreach ($rows as $row) {
            $slug = $row['slug'];
            unset($row['slug']);

            $exists = DB::table('directorates')->where('slug', $slug)->exists();

            DB::table('directorates')->updateOrInsert(
                ['slug' => $slug],
                array_merge($row, ['updated_at' => $now]) + ($exists ? [] : ['created_at' => $now])
            );

            if ($exists) {
                $updated++;
                $this->command->line("  <info>Updated</info>  : $slug");
            } else {
                $inserted++;
                $this->command->line("  <comment>Inserted</comment> : $slug");
            }
        }

        $this->command->info("Done — {$inserted} inserted, {$updated} updated.");
    }
}
