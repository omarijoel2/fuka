<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContentPagesSeeder extends Seeder
{
    public function run(): void
    {
        $now      = now()->toDateTimeString();
        $authorId = 1;

        if (DB::table('cms_content')->where('type', 'page')->where('slug', 'about-policies')->exists()) {
            $this->command->info('Page content already seeded, skipping.');
            return;
        }

        $base = [
            'type'            => 'page',
            'status'          => 'published',
            'is_deleted'      => 0,
            'current_version' => 1,
            'author_id'       => $authorId,
            'tags'            => '[]',
            'seo_meta'        => '{}',
            'related_ids'     => '[]',
            'published_at'    => $now,
            'created_at'      => $now,
            'updated_at'      => $now,
        ];

        $pages = [

            // ── About Policies ─────────────────────────────────────────
            [
                'slug'            => 'about-policies',
                'title'           => 'University Policies',
                'summary'         => 'Official KAFU policies governing academic, staff, student and administrative matters.',
                'structured_data' => json_encode(['policies' => [
                    ['slug'=>'academic-policy','title'=>'Academic Policy','category'=>'Academic','version'=>'v3.0 (2023)','pages'=>45,'approved'=>'University Council, June 2023','review_date'=>'June 2026','description'=>'Governs all academic programmes, assessments, academic integrity, examination regulations, and student progression criteria at Kaimosi Friends University.'],
                    ['slug'=>'student-code-of-conduct','title'=>'Student Code of Conduct','category'=>'Student Affairs','version'=>'v2.1 (2023)','pages'=>28,'approved'=>'University Council, March 2023','review_date'=>'March 2026','description'=>'Sets out the standards of behaviour, rights, and responsibilities for all registered KAFU students on campus and during university-affiliated activities.'],
                    ['slug'=>'research-policy','title'=>'Research & Innovation Policy','category'=>'Research','version'=>'v2.0 (2022)','pages'=>38,'approved'=>'Senate, November 2022','review_date'=>'November 2025','description'=>'Framework for the conduct, governance, and ethics of research activities at KAFU including intellectual property rights, data management, and research commercialisation.'],
                    ['slug'=>'staff-code-of-ethics','title'=>'Staff Code of Ethics & Conduct','category'=>'Human Resources','version'=>'v2.2 (2023)','pages'=>20,'approved'=>'University Council, January 2023','review_date'=>'January 2026','description'=>'Defines the ethical standards, professional obligations, and conduct expectations for all KAFU staff members in the performance of their duties.'],
                    ['slug'=>'ict-security-policy','title'=>'ICT Security Policy','category'=>'ICT','version'=>'v1.2 (2024)','pages'=>32,'approved'=>'Management, February 2024','review_date'=>'February 2026','description'=>'Governs the acceptable use, security, and management of all ICT resources, systems, and data at Kaimosi Friends University.'],
                    ['slug'=>'anti-sexual-harassment-policy','title'=>'Anti-Sexual Harassment Policy','category'=>'Student Affairs','version'=>'v1.1 (2021)','pages'=>15,'approved'=>'University Council, July 2021','review_date'=>'July 2024','description'=>'Sets out KAFU\'s zero-tolerance stance on sexual harassment and the procedures for reporting, investigating, and resolving complaints.'],
                    ['slug'=>'procurement-policy','title'=>'Procurement Policy','category'=>'Finance & Procurement','version'=>'v2.0 (2023)','pages'=>42,'approved'=>'University Council, April 2023','review_date'=>'April 2026','description'=>'Governs the procurement of goods, works, and services at KAFU in compliance with the Public Procurement and Asset Disposal Act (PPADA) 2015.'],
                    ['slug'=>'finance-accounts-policy','title'=>'Finance & Accounts Policy','category'=>'Finance & Procurement','version'=>'v3.1 (2022)','pages'=>56,'approved'=>'University Council, August 2022','review_date'=>'August 2025','description'=>'Comprehensive financial management policy covering budgeting, revenue collection, expenditure control, asset management, and financial reporting.'],
                    ['slug'=>'library-information-policy','title'=>'Library & Information Services Policy','category'=>'Academic','version'=>'v1.3 (2023)','pages'=>24,'approved'=>'Senate, September 2023','review_date'=>'September 2026','description'=>'Governs the provision, access, and management of library resources and information services for the KAFU academic community.'],
                    ['slug'=>'environmental-management-policy','title'=>'Environmental Management Policy','category'=>'Facilities','version'=>'v1.1 (2022)','pages'=>18,'approved'=>'Management, May 2022','review_date'=>'May 2025','description'=>'KAFU\'s commitment to environmental stewardship — covering waste management, energy conservation, and sustainable campus development.'],
                    ['slug'=>'gender-mainstreaming-policy','title'=>'Gender Mainstreaming Policy','category'=>'Student Affairs','version'=>'v1.0 (2021)','pages'=>22,'approved'=>'University Council, October 2021','review_date'=>'October 2024','description'=>'Guides the university\'s commitment to gender equity, equal opportunity, and the mainstreaming of gender perspectives in all university operations.'],
                    ['slug'=>'disability-policy','title'=>'Disability Mainstreaming Policy','category'=>'Student Affairs','version'=>'v1.0 (2022)','pages'=>16,'approved'=>'University Council, March 2022','review_date'=>'March 2025','description'=>'Establishes KAFU\'s obligations and commitments to students, staff, and visitors with disabilities — ensuring full access, reasonable accommodation, and non-discrimination.'],
                ]]),
            ],

            // ── About Strategic Plan ────────────────────────────────────
            [
                'slug'            => 'about-strategic-plan',
                'title'           => 'Strategic Plan 2023–2028',
                'summary'         => 'Transforming Lives Through Knowledge — KAFU\'s five-pillar strategic plan guiding the university 2023–2028.',
                'structured_data' => json_encode([
                    'vision'      => 'A premier African university committed to academic excellence, research, and community transformation.',
                    'mission'     => 'To provide quality university education, conduct research, and engage with community to transform lives through knowledge.',
                    'core_values' => 'Integrity · Excellence · Innovation · Service · Inclusivity · Stewardship',
                    'pillars'     => [
                        ['id'=>1,'title'=>'Academic Excellence & Innovation','colour'=>'#1A5C38','objectives'=>['Develop 10 new market-responsive academic programmes by 2026','Achieve 80% graduate employment rate within 12 months of graduation','Attain Commission for University Education (CUE) top-tier rating','Enhance student experience through digital learning integration'],'kpis'=>['10 new programmes (2023–2028)','80% pass rate across all schools','90% graduate employment','4.0/5.0 student satisfaction score']],
                        ['id'=>2,'title'=>'Research & Knowledge Creation','colour'=>'#C9A227','objectives'=>['Increase peer-reviewed publications to 50 per year by 2026','Establish 3 new research centres aligned to national priorities','Attract KES 50 million in research grants over the plan period','Strengthen postgraduate research supervision capacity'],'kpis'=>['50 publications/year','3 new research centres','KES 50M in research grants','100 active postgraduate researchers']],
                        ['id'=>3,'title'=>'Community Engagement & Partnerships','colour'=>'#1B3A6B','objectives'=>['Sign 20 new industry partnership agreements by 2026','Scale community outreach to 10 counties in Western Kenya','Establish 5 new international academic partnerships','Launch KAFU Alumni Association and mentorship programme'],'kpis'=>['20 industry MoUs signed','10 counties reached','5 international partners','2,000 alumni network members']],
                        ['id'=>4,'title'=>'Infrastructure & Resource Development','colour'=>'#2D6A4F','objectives'=>['Achieve 100% fibre-optic campus connectivity by 2025','Construct a 500-bed student centre and modern lecture halls','Expand library holdings to 100,000 volumes with digital access','Upgrade laboratory and clinical simulation facilities'],'kpis'=>['100% fibre connectivity','500-bed student centre complete','100,000 library volumes','10 upgraded labs']],
                        ['id'=>5,'title'=>'Institutional Governance & Leadership','colour'=>'#8B1A1A','objectives'=>['Maintain unqualified annual audit opinion throughout the plan period','Achieve 50% self-generated revenue by 2028','Implement ISO 9001:2015 quality management certification','Digitise all administrative and academic processes'],'kpis'=>['Unqualified audit (5 years)','50% self-generated revenue','ISO 9001 certification by 2026','100% digital HR/Finance']],
                    ],
                    'milestones' => [
                        ['year'=>'2023','label'=>'Plan launch & baseline assessment'],
                        ['year'=>'2024','label'=>'New programmes approved, 2 research centres opened'],
                        ['year'=>'2025','label'=>'100% campus connectivity, ISO pre-assessment'],
                        ['year'=>'2026','label'=>'Mid-term review & course corrections'],
                        ['year'=>'2027','label'=>'75% KPI achievement target'],
                        ['year'=>'2028','label'=>'Final evaluation & new plan development'],
                    ],
                ]),
            ],

            // ── About Service Charter ───────────────────────────────────
            [
                'slug'            => 'about-service-charter',
                'title'           => 'Service Charter',
                'summary'         => 'KAFU\'s Service Charter sets out the service standards and commitments we make to students, staff, and the public.',
                'structured_data' => json_encode(['standards' => [
                    ['category'=>'Admissions & Registration','colour'=>'#1A5C38','services'=>[['service'=>'Online application acknowledgement','standard'=>'Within 1 working day','remarks'=>'Automated confirmation email sent'],['service'=>'Application review & offer letter','standard'=>'5–10 working days','remarks'=>'After receipt of complete documents'],['service'=>'Student ID card issuance','standard'=>'2 working days','remarks'=>'After fee payment confirmation'],['service'=>'Course registration','standard'=>'Same day','remarks'=>'Via student portal']]],
                    ['category'=>'Academic Records','colour'=>'#C9A227','services'=>[['service'=>'Academic transcripts (unofficial)','standard'=>'3 working days','remarks'=>''],['service'=>'Academic transcripts (official)','standard'=>'5 working days','remarks'=>'Certified and sealed'],['service'=>'Degree certificate issuance','standard'=>'30 calendar days','remarks'=>'After graduation ceremony'],['service'=>'Letter of completion / recommendation','standard'=>'3 working days','remarks'=>''],['service'=>'HELB certification','standard'=>'2 working days','remarks'=>'After exam results confirmed']]],
                    ['category'=>'Finance & Fees','colour'=>'#1B3A6B','services'=>[['service'=>'Fee statement generation','standard'=>'Immediate','remarks'=>'Via student portal'],['service'=>'Payment receipt confirmation','standard'=>'1 working day','remarks'=>'After bank confirmation'],['service'=>'Bursary / scholarship processing','standard'=>'10 working days','remarks'=>'After application submission'],['service'=>'Fee structure enquiries','standard'=>'Same day','remarks'=>'Walk-in or phone']]],
                    ['category'=>'Library Services','colour'=>'#2D6A4F','services'=>[['service'=>'Book borrowing','standard'=>'Immediate','remarks'=>'On presentation of valid student ID'],['service'=>'E-resource access','standard'=>'Immediate','remarks'=>'Via library portal (24/7)'],['service'=>'Interlibrary loan request','standard'=>'5–7 working days','remarks'=>''],['service'=>'Research assistance','standard'=>'Same day','remarks'=>'During library hours']]],
                    ['category'=>'ICT Support','colour'=>'#8B1A1A','services'=>[['service'=>'Email account activation','standard'=>'1 working day','remarks'=>'After registration confirmation'],['service'=>'Password reset','standard'=>'30 minutes','remarks'=>'Via helpdesk or self-service'],['service'=>'Network / WiFi fault reporting','standard'=>'4 working hours','remarks'=>''],['service'=>'System access requests','standard'=>'2 working days','remarks'=>'Requires line manager approval']]],
                    ['category'=>'Student Affairs','colour'=>'#3A5A8C','services'=>[['service'=>'Disciplinary complaint acknowledgement','standard'=>'3 working days','remarks'=>''],['service'=>'Counselling appointment','standard'=>'2 working days','remarks'=>'Or immediate for crisis situations'],['service'=>'Club / association registration','standard'=>'5 working days','remarks'=>''],['service'=>'Accommodation allocation','standard'=>'5 working days','remarks'=>'Subject to availability']]],
                ]]),
            ],

            // ── About Complaints ───────────────────────────────────────
            [
                'slug'            => 'about-complaints',
                'title'           => 'Complaints and Resolution',
                'summary'         => 'KAFU is committed to transparency and accountability. Learn how to submit a public complaint and understand the resolution process.',
                'structured_data' => json_encode([
                    'process_steps' => [
                        ['step'=>'01','title'=>'Submit Your Complaint','description'=>'Submit your complaint in writing using the KAFU Public Complaints Form, available at the Main Reception, Student Affairs Office, or by email to complaints@kafu.ac.ke.'],
                        ['step'=>'02','title'=>'Acknowledgement','description'=>'You will receive written acknowledgement of your complaint within 3 working days of receipt, including a reference number for tracking.'],
                        ['step'=>'03','title'=>'Investigation & Review','description'=>'The Chair, Resolutions and Public Complaints, will review the complaint, gather evidence, and consult relevant departments as necessary. You may be invited for a meeting.'],
                        ['step'=>'04','title'=>'Resolution','description'=>'A formal written response will be communicated within 21 working days of the complaint submission date, outlining the findings and any actions taken.'],
                        ['step'=>'05','title'=>'Appeal','description'=>'If you are not satisfied with the resolution, you may submit an appeal to the Vice-Chancellor\'s Office within 14 days of receiving the resolution letter.'],
                    ],
                    'complaint_categories' => [
                        ['label'=>'Academic Services','description'=>'Grading disputes, course delivery concerns, examination irregularities'],
                        ['label'=>'Administrative Services','description'=>'Registration delays, certificate issuance, fee statements'],
                        ['label'=>'Student Support Services','description'=>'Accommodation, health services, counselling, welfare'],
                        ['label'=>'Staff Conduct','description'=>'Professional conduct issues involving academic or administrative staff'],
                        ['label'=>'ICT & Digital Services','description'=>'Portal access, email, e-learning platform problems'],
                        ['label'=>'Facilities & Infrastructure','description'=>'Maintenance issues, safety concerns, equipment'],
                        ['label'=>'General Institutional Matters','description'=>'Any other matter not covered above'],
                    ],
                    'rights' => [
                        'Be treated with courtesy, dignity, and respect throughout the process',
                        'Receive a fair and impartial investigation of your complaint',
                        'Be kept informed of the progress of your complaint',
                        'Submit additional evidence or information at any stage',
                        'Appeal against a decision you believe is unjust',
                        'Have your identity protected where disclosure would be harmful',
                    ],
                ]),
            ],

            // ── About CSR ──────────────────────────────────────────────
            [
                'slug'            => 'about-csr',
                'title'           => 'Corporate Social Responsibility',
                'summary'         => 'KAFU\'s CSR activities covering education, health, environment, community engagement, and responsible governance.',
                'structured_data' => json_encode([
                    'pillars' => [
                        ['title'=>'Education & Skills Development','colour'=>'#1A5C38','description'=>'KAFU supports community education through outreach programmes, bursaries for needy students from the surrounding region, adult literacy initiatives, and school mentorship programmes at secondary schools in Vihiga, Kakamega, and neighbouring counties.','initiatives'=>['Annual KAFU Open Days for secondary school students','Academic bursaries for students from underserved communities','Adult literacy and continuing education support','Career mentorship programme for secondary school students']],
                        ['title'=>'Health & Community Well-Being','colour'=>'#8B1A1A','description'=>'Through the School of Health Sciences, KAFU runs community health outreach programmes including eye health camps, general health screening, and health education initiatives targeting rural communities in Western Kenya.','initiatives'=>['Community eye health camps in Vihiga and Kakamega counties','Free health screening days at the KAFU Health Centre','Community partnerships with county referral hospitals','Health education workshops for village health workers']],
                        ['title'=>'Environmental Sustainability','colour'=>'#2D6A4F','description'=>'KAFU is committed to environmental stewardship through the Centre of Excellence on Climate Action and Research. The university promotes sustainable practices across the campus and in the wider community.','initiatives'=>['Tree planting and reforestation programmes across campus','Sustainable waste management and recycling initiatives','Solar energy installations reducing the campus carbon footprint','Community environmental awareness campaigns']],
                        ['title'=>'Community Engagement & Partnerships','colour'=>'#C9A227','description'=>'KAFU actively engages with local government, civil society, faith communities, and the private sector to co-create solutions that uplift livelihoods and build social capital in the surrounding region.','initiatives'=>['Annual Community Service Day involving students and staff','Partnerships with Vihiga County Government on development programmes','Faith community engagement through the university\'s Quaker heritage','Collaboration with NGOs on poverty alleviation initiatives']],
                        ['title'=>'Responsible Institutional Stewardship','colour'=>'#1B3A6B','description'=>'KAFU upholds the principles of responsible governance, ethical resource management, and transparent reporting in all its operations. The university is committed to being a responsible corporate citizen.','initiatives'=>['Annual sustainability and social impact reporting','Ethical procurement practices preferring local suppliers','Living wage commitments for all university employees','Transparent financial management and audit compliance']],
                    ],
                    'commitments' => [
                        'Transform lives through knowledge, service, and community engagement',
                        'Actively uplift society beyond the boundaries of the university campus',
                        'Promote environmental sustainability and responsible resource use',
                        'Advance social equity through targeted support for underserved communities',
                        'Build deliberate partnerships that amplify community impact',
                        'Embed Quaker values of service, integrity, and compassion in all our work',
                    ],
                ]),
            ],

            // ── About Legal ────────────────────────────────────────────
            [
                'slug'            => 'about-legal',
                'title'           => 'Legal Office',
                'summary'         => 'The Legal Office provides legal advice, contract management, compliance oversight, and litigation support.',
                'structured_data' => json_encode([
                    'functions' => [
                        'Providing legal advice and opinions to the Vice-Chancellor, University Management, and Governing Council',
                        'Drafting, reviewing, and interpreting contracts, agreements, and Memoranda of Understanding (MoUs)',
                        'Representing the university in legal proceedings and liaising with external counsel',
                        'Ensuring institutional compliance with the Universities Act, KAFU Charter, KAFU Statutes, and applicable Kenyan law',
                        'Managing intellectual property matters including patents, trademarks, and copyright',
                        'Advising on data protection obligations under the Kenya Data Protection Act',
                        'Supporting the development and review of university policies and regulations',
                        'Handling land and property legal matters including title deeds, leases, and conveyancing',
                        'Overseeing the management and custody of university legal documents and instruments',
                    ],
                    'legal_areas' => [
                        ['title'=>'Contract Management','colour'=>'#1A5C38','description'=>'Drafting, reviewing, and managing all contractual agreements entered into by the university including procurement contracts, partnership agreements, and employment contracts.'],
                        ['title'=>'Compliance & Regulatory','colour'=>'#C9A227','description'=>'Ensuring the university\'s operations comply with the Universities Act, KAFU Charter, KAFU Statutes, Commission for University Education (CUE) regulations, and all applicable laws.'],
                        ['title'=>'Dispute Resolution & Litigation','colour'=>'#8B1A1A','description'=>'Managing legal disputes involving the university, coordinating with external advocates, and representing the university\'s interests in arbitration, mediation, and court proceedings.'],
                        ['title'=>'Intellectual Property','colour'=>'#1B3A6B','description'=>'Protecting the university\'s intellectual property assets including research outputs, innovations, brand marks, and publications in collaboration with the Research Directorate.'],
                    ],
                    'legal_basis' => [
                        ['title'=>'Universities Act, 2012','description'=>'The primary legislation governing universities in Kenya. KAFU operates within this legal framework.'],
                        ['title'=>'KAFU Charter','description'=>'Granted by the Cabinet Secretary for Education, the Charter establishes KAFU as a chartered university and confers its legal personality.'],
                        ['title'=>'KAFU Statutes','description'=>'Statutes authorised by the Charter that govern the internal operations, governance structures, and disciplinary procedures of the university.'],
                        ['title'=>'Kenya Data Protection Act, 2019','description'=>'Governs the collection, use, and storage of personal data by the university.'],
                    ],
                ]),
            ],

            // ── Research Ethics ────────────────────────────────────────
            [
                'slug'            => 'research-ethics',
                'title'           => 'Scientific & Ethics Review Committee (KAFUSERC)',
                'summary'         => 'KAFUSERC reviews, approves, and monitors research proposals involving human participants at KAFU.',
                'structured_data' => json_encode([
                    'mandate' => [
                        'Review and approve research proposals involving human participants',
                        'Conduct ongoing monitoring of approved research projects',
                        'Ensure compliance with national and international ethical standards',
                        'Safeguard the dignity, rights, safety, and well-being of research participants',
                        'Promote a culture of research integrity across all academic schools',
                        'Issue ethical approval certificates for qualifying research projects',
                        'Investigate alleged breaches of research ethics',
                    ],
                    'review_types' => [
                        ['title'=>'Full Board Review','colour'=>'#8B1A1A','description'=>'Required for research involving more than minimal risk to participants, vulnerable populations, or sensitive data. Reviewed at a full committee meeting.','turnaround'=>'4–6 weeks'],
                        ['title'=>'Expedited Review','colour'=>'#C9A227','description'=>'For research involving minimal risk. Reviewed by the Chair and one or two committee members without a full board meeting.','turnaround'=>'2–3 weeks'],
                        ['title'=>'Exempt Review','colour'=>'#1A5C38','description'=>'For research involving no more than minimal risk and using anonymous data, secondary sources, or publicly available information.','turnaround'=>'1 week'],
                    ],
                    'submission_steps' => [
                        ['step'=>'01','title'=>'Obtain Application Forms','description'=>'Download the KAFUSERC application forms from the Research Directorate or the KAFU website.'],
                        ['step'=>'02','title'=>'Prepare Your Protocol','description'=>'Complete the research protocol including objectives, methodology, participant recruitment, consent procedures, and data protection plan.'],
                        ['step'=>'03','title'=>'Compile Supporting Documents','description'=>'Include informed consent forms, data collection instruments (questionnaires, interview guides), and any participant-facing materials.'],
                        ['step'=>'04','title'=>'Submit to KAFUSERC Secretary','description'=>'Submit three printed copies plus a digital copy via email to kafuserc@kafu.ac.ke before the submission deadline.'],
                        ['step'=>'05','title'=>'Await Review','description'=>'Your submission will be acknowledged within 3 working days and assigned a review pathway. You may be invited to respond to queries.'],
                        ['step'=>'06','title'=>'Receive Ethical Approval Certificate','description'=>'Upon approval, you will receive an official KAFUSERC Ethical Approval Certificate, which is required before commencing data collection.'],
                    ],
                    'committee_members' => [
                        ['name'=>'Dr. Emmanuel Okenwa-Vincent','role'=>'Chairman, KAFUSERC','affiliation'=>'School of Health Sciences'],
                        ['name'=>'Representative','role'=>'Secretary','affiliation'=>'Research Directorate'],
                        ['name'=>'Representative','role'=>'Legal & Compliance Member','affiliation'=>'Legal Office, KAFU'],
                        ['name'=>'Representative','role'=>'Community Representative','affiliation'=>'External — Vihiga County'],
                    ],
                ]),
            ],

            // ── Admissions Funding ─────────────────────────────────────
            [
                'slug'            => 'admissions-funding',
                'title'           => 'Access to Funding',
                'summary'         => 'Step-by-step guide to accessing Higher Education Financing (HEF), scholarships, and upkeep loans as a KAFU student.',
                'structured_data' => json_encode([
                    'steps' => [
                        ['number'=>'01','title'=>'Receive Admission Letter','description'=>'Upon admission, KAFU issues you an official admission letter containing your student number and programme details.'],
                        ['number'=>'02','title'=>'Register on the HEF Portal','description'=>'Visit the Higher Education Financing (HEF) portal at hef.go.ke or jiunge.helb.co.ke and create an account using your national ID and admission details.'],
                        ['number'=>'03','title'=>'Select Your Funding Category','description'=>'Choose between Scholarship, Loan, or a combination under the Variable Scholarship and Loan Funding Model based on your assessed level of need.'],
                        ['number'=>'04','title'=>'Submit Supporting Documents','description'=>'Upload required documents including National ID, KCSE certificate, household income assessment documents, and your KAFU admission letter.'],
                        ['number'=>'05','title'=>'Await Assessment & Approval','description'=>'HELB will assess your socio-economic status and notify you of your scholarship percentage and loan amount within the processing period.'],
                        ['number'=>'06','title'=>'Funds Disbursed to University','description'=>'Approved scholarship funds are disbursed directly to KAFU. Upkeep loan amounts are sent to your registered M-Pesa or bank account each semester.'],
                    ],
                    'funding_types' => [
                        ['type'=>'Scholarship','colour'=>'#1A5C38','description'=>'A non-repayable award that covers a portion or all of your tuition fees based on financial need. The scholarship percentage is determined after assessment.','eligibility'=>'All admitted Kenyan students with demonstrated financial need.'],
                        ['type'=>'Upkeep Loan','colour'=>'#C9A227','description'=>'A repayable loan to cover living and study expenses disbursed directly to students each semester. Repayment begins 12 months after completing your programme.','eligibility'=>'Students who apply through the HEF portal and meet loan criteria.'],
                        ['type'=>'HELB Student Loan','colour'=>'#1B3A6B','description'=>'The Higher Education Loans Board provides supplementary loans for students not fully covered under the HEF model. Apply via the HELB portal.','eligibility'=>'Kenyan students at recognised universities. Income-tested.'],
                    ],
                    'documents' => [
                        'National Identity Card (or Birth Certificate for those under 18)',
                        'KAFU Admission Letter',
                        'KCSE Certificate or Result Slip',
                        'Parent/Guardian National ID cards',
                        'Household income assessment documents (pay slips, tax returns, or affidavit)',
                        'Bank account details or M-Pesa number for upkeep disbursement',
                        'Secondary school leaving certificate',
                    ],
                ]),
            ],

            // ── Admissions Joining Instructions ────────────────────────
            [
                'slug'            => 'admissions-joining-instructions',
                'title'           => 'First-Year Student Joining Instructions',
                'summary'         => 'Step-by-step guide to completing your admissions process and registering at Kaimosi Friends University.',
                'structured_data' => json_encode([
                    'phases' => [
                        ['id'=>'phase1','title'=>'Phase 1: Online Document Access (Pre-Reporting)','subtitle'=>'Complete before arriving on campus','colour'=>'#1A5C38','steps'=>[
                            ['number'=>1,'title'=>'Access the Admission Portal or Kafu.Jiunge.com','description'=>'Navigate to the KAFU Admission Portal at portal.kafu.ac.ke or visit kafu.jiunge.com. Log in using the credentials provided in your admission letter.'],
                            ['number'=>2,'title'=>'Download Your Admission Letter','description'=>'Locate and download your official KAFU Admission Letter from the portal. Print three copies — one for your records, one for the Finance Office, and one for the Registrar.'],
                            ['number'=>3,'title'=>'Review Your Programme Details','description'=>'Carefully review your programme of study, school, intake date, and student number as stated in your admission letter. Contact the Admissions Office immediately if there are any discrepancies.'],
                            ['number'=>4,'title'=>'Apply for HEF Funding','description'=>'If you have not yet applied for Higher Education Financing (HEF), do so immediately at hef.go.ke. Government-sponsored students must apply before reporting to ensure timely fee processing.'],
                        ]],
                        ['id'=>'phase2','title'=>'Phase 2: Reporting to Campus','subtitle'=>'On your arrival day','colour'=>'#C9A227','steps'=>[
                            ['number'=>5,'title'=>'Proceed to the Finance Office','description'=>'On arrival at campus, go directly to the Finance Office with your admission letter and proof of fee payment or HEF approval. Pay the required minimum deposit to activate your registration.'],
                            ['number'=>6,'title'=>'Collect Medical Forms','description'=>'Obtain medical examination forms from the Student Affairs Office. All new students are required to complete a medical examination at the KAFU Health Centre or a government hospital.'],
                            ['number'=>7,'title'=>'Visit the Registrar\'s Office','description'=>'Submit your original certificates and academic documents for verification. The Registrar\'s Office will verify your entry qualifications against the documents submitted during application.'],
                            ['number'=>8,'title'=>'Register for Accommodation (if applicable)','description'=>'Students seeking university accommodation should register at the Student Affairs Office. Allocation is subject to availability and is processed on a first-come, first-served basis.'],
                        ]],
                        ['id'=>'phase3','title'=>'Phase 3: Course Registration & Orientation','subtitle'=>'During the first week of semester','colour'=>'#1B3A6B','steps'=>[
                            ['number'=>9,'title'=>'Course Registration via Student Portal','description'=>'Log in to the KAFU Student Portal and register for your courses for Semester I. Ensure you register for all units in your programme as per the curriculum. Seek guidance from your Head of Department if needed.'],
                            ['number'=>10,'title'=>'Obtain Student ID Card','description'=>'Proceed to the ICT Department with your registration confirmation slip and one passport-sized photograph to obtain your KAFU Student ID card.'],
                            ['number'=>11,'title'=>'Attend Orientation Programme','description'=>'All first-year students must attend the mandatory orientation programme organised by the Dean of Students Office. The schedule will be communicated during reporting.'],
                            ['number'=>12,'title'=>'Library Registration','description'=>'Visit the KAFU Library with your Student ID card to register for library services, including physical and digital resource access.'],
                        ]],
                    ],
                    'checklist' => [
                        'Original academic certificates (KCSE, KCPE, or equivalent)',
                        'Original national ID card (or birth certificate)',
                        'Four recent passport-sized photographs',
                        'Printed admission letter (3 copies)',
                        'Proof of HEF application or fee payment receipt',
                        'Medical examination forms (completed)',
                        'Next-of-kin contact details',
                        'Bank account details or M-Pesa number',
                    ],
                ]),
            ],

            // ── Admissions Timetables ──────────────────────────────────
            [
                'slug'            => 'admissions-timetables',
                'title'           => 'Academic Timetables',
                'summary'         => 'Examination and teaching timetables for the current academic year.',
                'structured_data' => json_encode([
                    'academic_year'   => '2025/2026',
                    'timetable_sets'  => [
                        ['id'=>'sem2','label'=>'Semester II — 2025/2026','active'=>true,'documents'=>[
                            ['title'=>'Final Postgraduate Examination Timetable','subtitle'=>'Semester II 2025/2026','type'=>'Examination','level'=>'Postgraduate','url'=>'/admissions/timetables','testid'=>'dl-pg-exam-sem2'],
                            ['title'=>'Final Undergraduate Examination Timetable','subtitle'=>'Semester II 2025/2026','type'=>'Examination','level'=>'Undergraduate','url'=>'/admissions/timetables','testid'=>'dl-ug-exam-sem2'],
                            ['title'=>'Teaching Timetable','subtitle'=>'Semester II 2025/2026','type'=>'Teaching','level'=>'All Students','url'=>'/admissions/timetables','testid'=>'dl-teaching-sem2'],
                        ]],
                        ['id'=>'sem1','label'=>'Semester I — 2025/2026','active'=>false,'documents'=>[
                            ['title'=>'Examination Timetable','subtitle'=>'Semester I 2025/2026','type'=>'Examination','level'=>'All Students','url'=>'/admissions/timetables','testid'=>'dl-exam-sem1'],
                            ['title'=>'Teaching Timetable','subtitle'=>'Semester I 2025/2026','type'=>'Teaching','level'=>'All Students','url'=>'/admissions/timetables','testid'=>'dl-teaching-sem1'],
                            ['title'=>'Examination Processing Schedule','subtitle'=>'Semester I 2025/2026','type'=>'Schedule','level'=>'All Students','url'=>'/admissions/timetables','testid'=>'dl-processing-sem1'],
                        ]],
                    ],
                ]),
            ],

            // ── Student Affairs ────────────────────────────────────────
            [
                'slug'            => 'student-affairs',
                'title'           => 'Dean of Students Office',
                'summary'         => 'The Dean of Students Office champions student welfare, holistic development, and a supportive campus environment.',
                'structured_data' => json_encode([
                    'services' => [
                        ['title'=>'Accommodation','description'=>'KAFU provides on-campus accommodation facilities to support students throughout their studies. The hostels offer a safe, comfortable, and conducive environment for academic and personal development.','colour'=>'#1A5C38','path'=>'/student-services#accommodation'],
                        ['title'=>'Catering Services','description'=>'The university\'s catering facilities serve nutritious and affordable meals to students and staff. Our dining halls are designed to foster community and provide a welcoming space for students.','colour'=>'#C9A227','path'=>'/student-services#catering'],
                        ['title'=>'Scholarships & Bursaries','description'=>'KAFU facilitates access to government bursaries, Higher Education Loans Board (HELB) funding, and university-based scholarships to ensure no student is excluded due to financial constraints.','colour'=>'#1B3A6B','path'=>'/admissions/funding'],
                        ['title'=>'Games & Sports','description'=>'The office coordinates intercollegiate and intramural sports programmes, supporting student athletes and promoting physical wellness, teamwork, and competitive excellence across a range of disciplines.','colour'=>'#8B1A1A','path'=>'/student-services#sports'],
                        ['title'=>'Counselling & Guidance','description'=>'Confidential counselling services are available to all students. Our trained counsellors provide support for academic stress, personal challenges, mental health, and career guidance.','colour'=>'#2D6A4F','path'=>'/student-services#counselling'],
                        ['title'=>'Student Governing Council','description'=>'The KAFU Student Governing Council is the principal representative body for students. It channels student voices to the university administration, organises student activities, and promotes student leadership.','colour'=>'#5B4FCF','path'=>'/student-services#council'],
                    ],
                    'mandate' => [
                        'Champion student welfare and holistic development at all levels',
                        'Act as a crucial link between students and the university administration',
                        'Foster a positive, equitable, and supportive campus environment',
                        'Provide guidance, counselling, and personal development support',
                        'Manage student conduct, discipline, and conflict resolution',
                        'Coordinate student organisations, activities, and co-curricular programmes',
                        'Support students with special needs, spiritual nourishment, and career placement',
                        'Assist students facing difficulties that could negatively impact their learning',
                        'Help students develop strong interpersonal, ethical, and leadership skills',
                    ],
                ]),
            ],

            // ── Students Council ───────────────────────────────────────
            [
                'slug'            => 'students-council',
                'title'           => 'KAFU Student Council (KAFUSA)',
                'summary'         => 'The Kaimosi Friends University Students\' Association — the voice and advocate of the KAFU student community.',
                'structured_data' => json_encode([
                    'mandate_areas' => [
                        ['title'=>'Academics','description'=>'Advocating for improved academic resources, equitable assessment practices, and student representation in academic governance.','colour'=>'#1A5C38'],
                        ['title'=>'Accommodation','description'=>'Liaising with university management on hostel conditions, availability, and the welfare of both on-campus and off-campus students.','colour'=>'#1B3A6B'],
                        ['title'=>'Security','description'=>'Working to ensure a safe learning environment for all students across all university premises and facilities.','colour'=>'#8B1A1A'],
                        ['title'=>'Entertainment & Culture','description'=>'Organising and supporting cultural activities, entertainment events, and programmes that celebrate student diversity and talent.','colour'=>'#C9A227'],
                        ['title'=>'Sports','description'=>'Promoting intercollegiate and intra-university sports competition, and supporting student athletes in their pursuit of excellence.','colour'=>'#2D6A4F'],
                        ['title'=>'Persons with Disabilities','description'=>'Championing the rights and welfare of students with disabilities, ensuring accessible facilities, support, and full participation in campus life.','colour'=>'#5B4FCF'],
                    ],
                    'governance' => [
                        ['title'=>'Elections','description'=>'Student leaders are elected annually for one academic year in strict accordance with the KAFUSA Constitution and the Universities Amendment Act (2016). Elections are coordinated by the Office of the Dean of Students.'],
                        ['title'=>'Executive Council','description'=>'The KAFUSA Executive is composed of elected student leaders representing all schools and student constituencies. The 4th KAFU Student Council currently serves the student community.'],
                        ['title'=>'Legal Basis','description'=>'KAFUSA\'s operations are grounded in the Universities Amendment Act (2016) and the KAFUSA Constitution, ensuring democratic, transparent, and accountable student governance.'],
                        ['title'=>'Relationship with Management','description'=>'KAFUSA works in close partnership with the Dean of Students Office and the university administration to address student concerns and contribute to institutional decision-making.'],
                    ],
                ]),
            ],

            // ── International Study ────────────────────────────────────
            [
                'slug'            => 'international-study',
                'title'           => 'Study at KAFU as an International Student',
                'summary'         => 'Everything international students need to know about studying at Kaimosi Friends University.',
                'structured_data' => json_encode([
                    'why_kafu' => [
                        ['title'=>'Quaker Values','desc'=>'Founded on integrity, peace, and community — a transformative environment unlike any other African university.'],
                        ['title'=>'Globally Connected','desc'=>'Partnerships with Quaker universities in the USA and UK, African universities, and international development agencies.'],
                        ['title'=>'Kaimosi Campus Experience','desc'=>'Set in lush Western Kenya highlands — safe, serene, and rich in biodiversity. A unique African campus experience.'],
                        ['title'=>'Applied Research Focus','desc'=>'Hands-on research embedded in real communities — water, agriculture, health, and digital development.'],
                        ['title'=>'Affordable Excellence','desc'=>'High-quality education at fees significantly lower than comparable institutions in the region or globally.'],
                        ['title'=>'Accredited Programmes','desc'=>'All programmes accredited by the Kenya Universities and Colleges Central Placement Service (KUCCPS) and Commission for University Education.'],
                    ],
                    'fees_table' => [
                        ['level'=>'Certificate','ksh'=>'45,000–60,000','usd'=>'340–460'],
                        ['level'=>'Diploma','ksh'=>'60,000–85,000','usd'=>'460–650'],
                        ['level'=>'Bachelor\'s Degree','ksh'=>'85,000–130,000','usd'=>'650–1,000'],
                        ['level'=>'Bachelor\'s (Science/Engineering)','ksh'=>'120,000–165,000','usd'=>'920–1,270'],
                        ['level'=>'Postgraduate Diploma','ksh'=>'95,000–120,000','usd'=>'730–920'],
                        ['level'=>'Master\'s Degree','ksh'=>'130,000–200,000','usd'=>'1,000–1,540'],
                        ['level'=>'PhD','ksh'=>'180,000–250,000','usd'=>'1,380–1,920'],
                    ],
                    'schools' => [
                        ['name'=>'School of Education','programmes'=>12,'highlight'=>'Teacher education, Educational management, Psychology'],
                        ['name'=>'School of Health Sciences','programmes'=>8,'highlight'=>'Nursing, Public Health, Community Health, Medical Lab'],
                        ['name'=>'School of Agriculture & Natural Resources','programmes'=>7,'highlight'=>'Agriculture, Agribusiness, Forestry, Environmental Science'],
                        ['name'=>'School of Business & Economics','programmes'=>9,'highlight'=>'Business Admin, Accounting, Economics, Entrepreneurship'],
                        ['name'=>'School of Science, Technology & Engineering','programmes'=>8,'highlight'=>'Computer Science, IT, Mathematics, Physics'],
                    ],
                    'steps' => [
                        ['step'=>'01','title'=>'Choose your Programme','desc'=>'Browse KAFU\'s catalogue across 5 schools and 44 accredited programmes.'],
                        ['step'=>'02','title'=>'Check Entry Requirements','desc'=>'Confirm your qualifications meet the minimum requirements for your chosen programme.'],
                        ['step'=>'03','title'=>'Prepare Documents','desc'=>'Gather certified transcripts, certificates, passport copy, and English proficiency evidence (if required).'],
                        ['step'=>'04','title'=>'Apply Online','desc'=>'Submit your application via the KAFU Student Portal. Pay the application fee (KES 2,000 / USD 15).'],
                        ['step'=>'05','title'=>'Receive Admission Letter','desc'=>'Successful applicants receive an official offer letter within 3–4 weeks.'],
                        ['step'=>'06','title'=>'Apply for Visa','desc'=>'Use your admission letter to apply for a Kenyan student visa at your nearest embassy or through the eDiaspora portal.'],
                        ['step'=>'07','title'=>'Arrive & Register','desc'=>'Complete registration, pay fees, and join the KAFU campus community.'],
                    ],
                ]),
            ],

            // ── International Visa ─────────────────────────────────────
            [
                'slug'            => 'international-visa',
                'title'           => 'Visa & Immigration Information',
                'summary'         => 'Visa requirements, documentation, and support services for international students coming to KAFU.',
                'structured_data' => json_encode([
                    'visa_categories' => [
                        ['title'=>'East African Community Citizens','countries'=>'Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan, DRC','badge'=>'Simplified Process','steps'=>['No student visa required — EAC student pass applies','Obtain a Letter of Admission from KAFU','Report to the nearest immigration office on arrival with admission letter + national ID','Obtain a student pass from the Department of Immigration Services, Kenya','Renew student pass each academic year'],'docs'=>['Valid national identity card or passport','KAFU official admission letter','Proof of fees payment or financial sponsorship','Passport photographs (2 recent colour photos)']],
                        ['title'=>'African Union Member States','countries'=>'Ghana, Nigeria, Ethiopia, South Africa, Egypt, Senegal, Cameroon, and all other AU members','badge'=>'Student Visa Required','steps'=>['Receive official KAFU admission letter','Apply for a Kenyan student visa at the nearest Kenyan embassy or consulate','Alternatively, use the Kenya eDiaspora portal for visa on arrival (select nationalities)','Pay visa fee (USD 50 single entry)','Obtain student pass on arrival from Immigration'],'docs'=>['Valid international passport (minimum 6 months validity)','KAFU official admission letter','Financial proof: bank statement, scholarship letter, or sponsor\'s letter','Recent passport photographs (2 colour, white background)','Yellow fever vaccination certificate (required for most travellers)','Medical fitness certificate (for course lengths exceeding 3 months)']],
                        ['title'=>'Rest of World','countries'=>'Europe, North America, Asia, Australia, Latin America, Middle East, and all non-AU countries','badge'=>'Student Visa + KAFU Clearance','steps'=>['Receive official KAFU admission letter','Contact KAFU International Office to obtain a Visa Support Letter','Apply for a Kenyan student visa at the nearest Kenyan embassy — minimum 6 weeks before travel','Submit biometrics at the embassy (appointment required in most countries)','On arrival, obtain a student pass at the airport or regional immigration office','Register with the Department of Immigration Services within 30 days of arrival'],'docs'=>['Valid international passport (minimum 6 months validity beyond intended stay)','KAFU official admission letter','KAFU Visa Support Letter (from International Office)','Financial statement showing adequate funds (min. USD 5,000 equivalent)','Health insurance covering Kenya','Yellow fever vaccination certificate','Medical fitness certificate','Police clearance certificate (home country, apostille if required)','Passport photographs (4 recent colour, white background)']],
                    ],
                ]),
            ],
        ];

        foreach ($pages as $page) {
            DB::table('cms_content')->insert(array_merge($base, $page));
        }

        $this->command->info('Page content seeded: ' . count($pages) . ' pages.');
    }
}
