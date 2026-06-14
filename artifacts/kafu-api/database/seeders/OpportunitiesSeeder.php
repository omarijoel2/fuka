<?php

namespace Database\Seeders;

use App\Models\CmsContent;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OpportunitiesSeeder extends Seeder
{
    public function run(): void
    {
        $upsert = function (array $data): void {
            if (CmsContent::where('slug', $data['slug'])->exists()) {
                return;
            }
            // Keep the sample opportunities evergreen: if a non-closed opportunity's
            // hardcoded deadline has already passed (e.g. the seeder runs long after
            // these fixtures were written), shift it into the near future so the
            // homepage and listing always show live opportunities. The offset is
            // derived from the slug so the result stays deterministic across runs.
            $sd = $data['structured_data'] ?? [];
            $status = $sd['opportunity_status'] ?? 'open';
            if (in_array($status, ['open', 'closing-soon'], true) && !empty($sd['deadline'])) {
                try {
                    if (Carbon::parse($sd['deadline'])->endOfDay()->isPast()) {
                        $hash = crc32($data['slug']) & 0x7fffffff; // always non-negative across platforms
                        $offset = $status === 'closing-soon'
                            ? 3 + ($hash % 5)    // 3–7 days out
                            : 14 + ($hash % 45); // 14–58 days out
                        $data['structured_data']['deadline'] = Carbon::now()->addDays($offset)->format('Y-m-d');
                    }
                } catch (\Throwable $e) {
                    // leave the hardcoded deadline untouched if it can't be parsed
                }
            }
            CmsContent::create(array_merge([
                'type'       => 'opportunity',
                'status'     => 'published',
                'is_deleted' => false,
                'author_id'  => 1,
            ], $data));
        };

        // ─── TENDERS ──────────────────────────────────────────────────────
        $upsert([
            'slug'         => 'supply-laboratory-equipment-kafu-proc-001-2026',
            'title'        => 'Supply of Laboratory Equipment and Consumables',
            'summary'      => 'KAFU invites sealed bids from qualified and registered suppliers for the supply and delivery of laboratory equipment and consumables for the Schools of Science and Health Sciences.',
            'body'         => 'Kaimosi Friends University (KAFU) wishes to procure laboratory equipment and consumables for use in the Schools of Science (SOS) and Health Sciences (SHS). Items include general laboratory glassware, chemicals, microscopes, centrifuges, autoclaves, optometry instruments, and clinical diagnostic equipment. Suppliers must be registered with the AGPO and have a valid business permit. Interested bidders may collect tender documents from the Procurement Office at the Main Campus during business hours.',
            'category'     => 'tender',
            'department'   => 'Procurement & Supply Chain',
            'featured'     => true,
            'published_at' => '2026-03-17 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'tender',
                'opportunity_type'     => 'Tender',
                'reference'            => 'KAFU/PROC/001/2026',
                'deadline'             => '2026-04-30',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'Valid business registration certificate',
                    'Tax compliance certificate from KRA',
                    'AGPO registration certificate (where applicable)',
                    'Certificate of Incorporation or business permit',
                    'Audited accounts for the last two financial years',
                    'Evidence of supply of similar equipment (at least 3 LPOs)',
                    'Filled tender document duly signed',
                ],
                'submission_info' => 'Sealed tenders in plain envelopes marked "KAFU/PROC/001/2026 — Laboratory Equipment" must be deposited in the Tender Box at the Procurement Office, Main Administration Block, Kaimosi Campus, by the deadline date and time. Tenders received after the deadline will not be accepted.',
                'contact' => [
                    'office'   => 'Procurement & Supply Chain Department',
                    'email'    => 'procurement@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'Main Administration Block, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Tender Document — Laboratory Equipment (KAFU/PROC/001/2026)', 'type' => 'PDF', 'size' => '1.2 MB', 'url' => '#'],
                    ['title' => 'Equipment Schedule & Technical Specifications',                  'type' => 'PDF', 'size' => '680 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'provision-security-services-kafu-proc-002-2026',
            'title'        => 'Provision of Security Guard Services',
            'summary'      => 'KAFU invites tenders from licensed security firms for the provision of professional security guard services across all university campuses and facilities.',
            'body'         => 'Kaimosi Friends University invites proposals from registered and licensed security companies to provide manned security guard services at the main campus and satellite facilities. Services required include day and night guarding, access control, patrol, and incident reporting. The contract period is one year, renewable subject to satisfactory performance.',
            'category'     => 'tender',
            'department'   => 'Procurement & Supply Chain',
            'featured'     => false,
            'published_at' => '2026-03-20 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'tender',
                'opportunity_type'     => 'Tender',
                'reference'            => 'KAFU/PROC/002/2026',
                'deadline'             => '2026-04-08',
                'deadline_time'        => '12:00',
                'opportunity_status'   => 'closing-soon',
                'requirements' => [
                    'Private Security Regulatory Authority (PSRA) license — valid',
                    'Certificate of Registration of Company/Business',
                    'KRA Tax Compliance Certificate',
                    'Minimum 3 years of experience providing security to educational institutions',
                    'Evidence of at least two similar contracts in educational or institutional settings',
                    'Bonded and insured against third-party liability',
                    'NSSF and NHIF compliance certificates',
                ],
                'submission_info' => 'Sealed bids in plain envelopes clearly marked "KAFU/PROC/002/2026 — Security Services" must be deposited in the Tender Box at the Procurement Office by 8 April 2026 at 12:00 noon. Late submissions will be disqualified.',
                'contact' => [
                    'office'   => 'Procurement & Supply Chain Department',
                    'email'    => 'procurement@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'Main Administration Block, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Tender Document — Security Services (KAFU/PROC/002/2026)', 'type' => 'PDF', 'size' => '980 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'supply-ict-equipment-kafu-proc-003-2026',
            'title'        => 'Supply and Delivery of ICT Equipment and Accessories',
            'summary'      => 'Kaimosi Friends University invites sealed bids for the supply, delivery, and installation of ICT equipment including computers, servers, networking hardware, and peripherals.',
            'body'         => 'KAFU is seeking to procure ICT equipment to support academic and administrative operations. The procurement includes desktop computers, laptops, servers, network switches, routers, UPS systems, projectors, and related peripherals. Suppliers must demonstrate capacity to deliver, install, and provide post-delivery warranty and support.',
            'category'     => 'tender',
            'department'   => 'Information and Communication Technology',
            'featured'     => false,
            'published_at' => '2026-03-25 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'tender',
                'opportunity_type'     => 'Tender',
                'reference'            => 'KAFU/PROC/003/2026',
                'deadline'             => '2026-05-09',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'Valid business registration and KRA PIN',
                    'Tax compliance certificate',
                    'Authorized dealer certificate from manufacturer(s) for key equipment',
                    'Evidence of similar ICT supply contracts (minimum 3)',
                    'Technical specifications of proposed equipment (must meet or exceed specs in tender document)',
                    'After-sales service and warranty commitment letter',
                ],
                'submission_info' => 'Completed tender documents to be deposited in the Tender Box at Procurement Office, Kaimosi Campus by 9 May 2026 at 17:00. Tenders must be sealed and marked "KAFU/PROC/003/2026 — ICT Equipment".',
                'contact' => [
                    'office'   => 'ICT Department / Procurement',
                    'email'    => 'ict@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'ICT Centre, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Tender Document — ICT Equipment 2026 (KAFU/PROC/003/2026)',  'type' => 'PDF', 'size' => '1.4 MB', 'url' => '#'],
                    ['title' => 'Technical Specifications — ICT Equipment Schedule',            'type' => 'PDF', 'size' => '620 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'construction-student-centre-kafu-proc-004-2026',
            'title'        => 'Construction of Student Centre — Phase 2',
            'summary'      => 'KAFU invites bids from eligible NCA-registered contractors for the construction of the second phase of the university student centre including a multi-purpose hall, student lounges, and commercial units.',
            'body'         => 'Kaimosi Friends University invites competitive bids from qualified and NCA-registered contractors for the civil and building works for Phase 2 of the Student Centre. Works include construction of a multi-purpose hall (capacity 600), student lounge areas, commercial units, and associated external works. A mandatory site visit will be held before bid submission.',
            'category'     => 'tender',
            'department'   => 'Estates & Facilities Management',
            'featured'     => true,
            'published_at' => '2026-04-01 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'tender',
                'opportunity_type'     => 'Tender',
                'reference'            => 'KAFU/PROC/004/2026',
                'deadline'             => '2026-05-30',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'NCA Category NCA 3 or above registration',
                    'Valid NCA practicing certificate',
                    'KRA Tax Compliance Certificate',
                    'Evidence of similar works of comparable value',
                    'Certified copies of registration with NSSF, NHIF',
                    'Site visit attendance confirmation',
                ],
                'submission_info' => 'Sealed bids in plain envelopes marked "KAFU/PROC/004/2026 — Student Centre Phase 2" to be submitted to the Procurement Office by 30 May 2026 at 17:00. Site visit: 20 April 2026 at 10:00 AM, assemble at the Estates Office.',
                'contact' => [
                    'office'   => 'Estates & Facilities Management',
                    'email'    => 'estates@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'Estates Office, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Tender Document — Student Centre Phase 2 (KAFU/PROC/004/2026)', 'type' => 'PDF', 'size' => '2.1 MB', 'url' => '#'],
                    ['title' => 'Architectural Drawings — Student Centre Phase 2',                 'type' => 'PDF', 'size' => '4.5 MB', 'url' => '#'],
                    ['title' => 'Bills of Quantities — Student Centre Phase 2',                    'type' => 'PDF', 'size' => '1.8 MB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'supply-furniture-kafu-proc-005-2025',
            'title'        => 'Supply and Delivery of Office Furniture and Fittings',
            'summary'      => 'Supply of executive office furniture, workstations, chairs, and filing systems for the administration block.',
            'body'         => 'KAFU invited bids for the supply and delivery of office furniture including executive desks, workstations, ergonomic chairs, and filing cabinets for the expanded administration block. This tender is now closed.',
            'category'     => 'tender',
            'department'   => 'Procurement & Supply Chain',
            'featured'     => false,
            'published_at' => '2025-11-15 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'tender',
                'opportunity_type'     => 'Tender',
                'reference'            => 'KAFU/PROC/005/2025',
                'deadline'             => '2025-12-31',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'closed',
                'requirements'         => [],
                'submission_info'      => 'This tender is now closed.',
                'contact' => [
                    'office'   => 'Procurement & Supply Chain Department',
                    'email'    => 'procurement@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'Main Administration Block, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Tender Document — Office Furniture (KAFU/PROC/005/2025)', 'type' => 'PDF', 'size' => '890 KB', 'url' => '#'],
                ],
            ],
        ]);

        // ─── VACANCIES ────────────────────────────────────────────────────
        $upsert([
            'slug'         => 'lecturer-computer-science-kafu-hr-001-2026',
            'title'        => 'Lecturer — Computer Science',
            'summary'      => 'Applications are invited from suitably qualified candidates for the position of Lecturer in Computer Science, specialising in AI, Software Engineering, or Data Science.',
            'body'         => 'The School of Computing and Information Technology (SCIT) at Kaimosi Friends University invites applications for the position of Lecturer in Computer Science. The successful candidate will teach undergraduate and postgraduate courses, supervise student research projects, conduct independent research, and contribute to departmental development.',
            'category'     => 'vacancy',
            'department'   => 'School of Computing and Information Technology (SCIT)',
            'featured'     => true,
            'published_at' => '2026-03-18 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'vacancy',
                'opportunity_type'     => 'Job Vacancy',
                'reference'            => 'KAFU/HR/001/2026',
                'deadline'             => '2026-04-25',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'PhD in Computer Science or related field (holders of a Master\'s with demonstrable progression towards PhD will be considered)',
                    'Minimum Grade B+ in KCSE or equivalent',
                    'At least 3 years\' teaching experience at university level',
                    'Demonstrable research output (publications in peer-reviewed journals preferred)',
                    'Strong written and oral communication skills in English',
                    'Registration with relevant professional body (e.g. IEEE, ACM) is an advantage',
                ],
                'submission_info' => 'Applications including a cover letter, detailed CV, copies of academic and professional certificates, and names of three referees (with full contact details) should be sent to the Human Resources Office by email or hard copy by 25 April 2026. Only shortlisted candidates will be contacted.',
                'contact' => [
                    'office'   => 'Human Resources Division',
                    'email'    => 'hr@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'HR Office, Administration Block, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Job Description — Lecturer, Computer Science (KAFU/HR/001/2026)', 'type' => 'PDF', 'size' => '420 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'lecturer-nursing-kafu-hr-002-2026',
            'title'        => 'Lecturer — Nursing',
            'summary'      => 'The School of Health Sciences invites applications from registered nurses with postgraduate qualifications for the position of Lecturer in Nursing.',
            'body'         => "KAFU School of Health Sciences invites applications from Registered Nurses and Midwives with a minimum of a Master's degree in Nursing or related clinical field. The Lecturer will teach undergraduate BSN students, coordinate clinical placements, supervise research projects, and participate in community health outreach.",
            'category'     => 'vacancy',
            'department'   => 'School of Health Sciences (SHS)',
            'featured'     => false,
            'published_at' => '2026-03-22 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'vacancy',
                'opportunity_type'     => 'Job Vacancy',
                'reference'            => 'KAFU/HR/002/2026',
                'deadline'             => '2026-04-08',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'closing-soon',
                'requirements' => [
                    "Master's degree in Nursing, Midwifery, or related clinical field (PhD preferred)",
                    'Active registration with the Nursing Council of Kenya (NCK)',
                    'Minimum 3 years\' clinical nursing experience',
                    'Teaching experience at diploma or degree level preferred',
                    'Good academic writing and communication skills',
                ],
                'submission_info' => 'Send applications to hr@kafu.ac.ke with subject "KAFU/HR/002/2026 — Lecturer Nursing" by 8 April 2026 at 17:00.',
                'contact' => [
                    'office'   => 'Human Resources Division',
                    'email'    => 'hr@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'HR Office, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Job Description — Lecturer, Nursing (KAFU/HR/002/2026)', 'type' => 'PDF', 'size' => '385 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'finance-officer-kafu-hr-003-2026',
            'title'        => 'Finance Officer',
            'summary'      => 'KAFU seeks a Finance Officer to support financial reporting, budget monitoring, and compliance with public finance management regulations.',
            'body'         => 'The Finance Officer will be responsible for day-to-day financial operations including accounts payable and receivable, bank reconciliations, budget tracking, preparation of management accounts, and compliance with PFMA and donor reporting requirements.',
            'category'     => 'vacancy',
            'department'   => 'Finance Department',
            'featured'     => false,
            'published_at' => '2026-03-28 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'vacancy',
                'opportunity_type'     => 'Job Vacancy',
                'reference'            => 'KAFU/HR/003/2026',
                'deadline'             => '2026-04-28',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'CPA(K) finalist or fully qualified',
                    "Bachelor's degree in Commerce, Finance, or Accounting",
                    "Minimum 3 years' relevant experience in a public sector or university environment",
                    'Proficiency in accounting software (SAGE, QuickBooks, or similar)',
                    'Knowledge of IPSAS and IFRS',
                    'High level of integrity and attention to detail',
                ],
                'submission_info' => 'Applications with CV, certificates, and three referees to hr@kafu.ac.ke, subject: "KAFU/HR/003/2026 — Finance Officer". Deadline: 28 April 2026.',
                'contact' => [
                    'office'   => 'Human Resources Division',
                    'email'    => 'hr@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'HR Office, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Job Description — Finance Officer (KAFU/HR/003/2026)', 'type' => 'PDF', 'size' => '360 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'registrar-academics-kafu-hr-004-2026',
            'title'        => 'Deputy Registrar (Academics)',
            'summary'      => 'Applications are invited for the position of Deputy Registrar (Academics) to support examinations management, student records, and academic programme coordination.',
            'body'         => 'The Deputy Registrar (Academics) will provide leadership in academic records management, examination administration, senate secretariat support, student progression monitoring, and regulatory compliance with CUE and accreditation bodies.',
            'category'     => 'vacancy',
            'department'   => 'Academic Registry',
            'featured'     => false,
            'published_at' => '2026-04-01 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'vacancy',
                'opportunity_type'     => 'Job Vacancy',
                'reference'            => 'KAFU/HR/004/2026',
                'deadline'             => '2026-05-02',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    "Master's degree in Administration, Education Management, or related field",
                    "Minimum 5 years' experience in university registry or academic administration",
                    'Thorough understanding of Kenya university regulations and CUE requirements',
                    'Strong communication, organisational, and IT skills',
                    'High level of integrity and professionalism',
                ],
                'submission_info' => 'Applications to hr@kafu.ac.ke, subject: "KAFU/HR/004/2026 — Deputy Registrar (Academics)". Deadline: 2 May 2026.',
                'contact' => [
                    'office'   => 'Human Resources Division',
                    'email'    => 'hr@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'HR Office, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Job Description — Deputy Registrar, Academics (KAFU/HR/004/2026)', 'type' => 'PDF', 'size' => '400 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'lecturer-business-admin-kafu-hr-005-2025',
            'title'        => 'Lecturer — Business Administration',
            'summary'      => 'Applications for the position of Lecturer in Business Administration. Position has since been filled.',
            'body'         => 'KAFU School of Business and Economics invited applications for the position of Lecturer in Business Administration. The successful candidate was appointed in April 2026. This vacancy is now closed.',
            'category'     => 'vacancy',
            'department'   => 'School of Business & Economics (SBE)',
            'featured'     => false,
            'published_at' => '2026-01-10 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'vacancy',
                'opportunity_type'     => 'Job Vacancy',
                'reference'            => 'KAFU/HR/005/2025',
                'deadline'             => '2026-02-28',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'closed',
                'requirements'         => [],
                'submission_info'      => 'This vacancy is now closed.',
                'contact' => [
                    'office'   => 'Human Resources Division',
                    'email'    => 'hr@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'HR Office, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Job Description — Lecturer, Business Administration (KAFU/HR/005/2025)', 'type' => 'PDF', 'size' => '375 KB', 'url' => '#'],
                ],
            ],
        ]);

        // ─── INTERNSHIPS ──────────────────────────────────────────────────
        $upsert([
            'slug'         => 'ict-internship-programme-kafu-intern-001-2026',
            'title'        => 'ICT Internship Programme — 2026',
            'summary'      => 'KAFU offers an ICT internship opportunity for final-year undergraduate students or recent graduates in Computer Science or IT.',
            'body'         => 'The KAFU ICT Department offers a structured internship programme for outstanding students and recent graduates. Interns will rotate across network administration, systems support, software maintenance, and digital services. Successful interns receive a certificate of completion and may be considered for future employment.',
            'category'     => 'internship',
            'department'   => 'Information and Communication Technology',
            'featured'     => false,
            'published_at' => '2026-03-10 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'internship',
                'opportunity_type'     => 'Internship',
                'reference'            => 'KAFU/INTERN/001/2026',
                'deadline'             => '2026-04-15',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'Final-year undergraduate student or graduate (within 12 months) in Computer Science, IT, or related field',
                    'Minimum upper second class honours GPA (or equivalent)',
                    'Introductory letter from university/college',
                    'Evidence of relevant coursework or projects',
                    'Availability for full-time attachment (minimum 3 months)',
                ],
                'submission_info' => 'Applications to ict@kafu.ac.ke, subject "KAFU/INTERN/001/2026 — ICT Internship". Include CV, academic transcript, and an introduction letter from your institution.',
                'contact' => [
                    'office'   => 'ICT Department',
                    'email'    => 'ict@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'ICT Centre, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'ICT Internship Programme Details (KAFU/INTERN/001/2026)', 'type' => 'PDF', 'size' => '295 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'research-assistantship-sos-kafu-intern-002-2026',
            'title'        => 'Research Assistantship — School of Science',
            'summary'      => 'The School of Science invites applications from postgraduate students for research assistantships in Molecular Biology, Environmental Chemistry, and Applied Physics.',
            'body'         => 'Positions are available for postgraduate students to serve as Research Assistants in active research projects within the School of Science. Research Assistants will assist with data collection, laboratory experiments, analysis, and report writing under the supervision of academic staff.',
            'category'     => 'internship',
            'department'   => 'School of Science (SOS)',
            'featured'     => false,
            'published_at' => '2026-03-20 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'internship',
                'opportunity_type'     => 'Internship',
                'reference'            => 'KAFU/INTERN/002/2026',
                'deadline'             => '2026-04-30',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'Registered postgraduate student (MSc or PhD) in a relevant science field',
                    'Strong laboratory skills and relevant subject knowledge',
                    'Introductory letter from supervisor',
                    'Brief statement of research interest (300 words max)',
                ],
                'submission_info' => 'Email to dean.sos@kafu.ac.ke, subject "KAFU/INTERN/002/2026 — Research Assistantship". Deadline: 30 April 2026.',
                'contact' => [
                    'office'   => 'School of Science (SOS)',
                    'email'    => 'dean.sos@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => "SOS Dean's Office, Kaimosi Campus",
                ],
                'documents' => [
                    ['title' => 'Research Assistantship Call — SOS (KAFU/INTERN/002/2026)', 'type' => 'PDF', 'size' => '280 KB', 'url' => '#'],
                ],
            ],
        ]);

        // ─── CALLS FOR APPLICATIONS ───────────────────────────────────────
        $upsert([
            'slug'         => 'internal-research-grants-kafu-call-001-2026',
            'title'        => 'Internal Research Grants — 2026/2027 Cycle',
            'summary'      => "KAFU invites academic staff to submit proposals for the 2026/2027 Internal Research Grant cycle, aligned with the university's strategic research themes.",
            'body'         => "The Directorate of Research, Innovation and Outreach announces the 2026/2027 internal research grant competition open to all permanent and probationary academic staff. Individual grants of up to KES 500,000 and collaborative grants of up to KES 1.2 million are available. Research must align with at least one of KAFU's strategic research themes: Health and Life Sciences, Education and Social Development, Technology and Innovation, Environmental Sustainability, or Business and Economic Development.",
            'category'     => 'call',
            'department'   => 'Directorate of Research, Innovation & Outreach',
            'featured'     => true,
            'published_at' => '2026-03-15 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'call',
                'opportunity_type'     => 'Call for Applications',
                'reference'            => 'KAFU/CALL/001/2026',
                'deadline'             => '2026-04-30',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'Full-time academic staff member at KAFU',
                    'Completed research proposal using the prescribed form',
                    'Endorsement from Head of Department and Dean',
                    'Ethics clearance letter where human or animal subjects are involved',
                    'Budget narrative and justification',
                ],
                'submission_info' => 'Submit completed proposals electronically to research@kafu.ac.ke and a hard copy to the Directorate of Research by 30 April 2026. Proposals must use the prescribed template available for download.',
                'contact' => [
                    'office'   => 'Directorate of Research, Innovation & Outreach',
                    'email'    => 'research@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'Research Directorate, Administration Block, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Internal Research Grants Call Document 2026/2027',              'type' => 'PDF', 'size' => '560 KB', 'url' => '#'],
                    ['title' => 'Research Proposal Template (KAFU/CALL/001/2026)',               'type' => 'DOC', 'size' => '210 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'industry-partnership-call-kafu-call-002-2026',
            'title'        => 'Call for Industry and Academic Partnership Proposals',
            'summary'      => 'KAFU welcomes proposals from industry partners, research institutions, NGOs, and government agencies for collaborative partnerships in research, training, and technology transfer.',
            'body'         => "KAFU is seeking to deepen its engagement with industry, government, civil society, and research institutions. The university welcomes proposals for collaboration in research and publication, student placement and mentorship, curriculum co-design, community engagement programmes, and technology transfer. Proposals may be submitted by organisations registered and operating in Kenya and regionally.",
            'category'     => 'call',
            'department'   => 'Office of the Vice-Chancellor',
            'featured'     => false,
            'published_at' => '2026-04-01 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'call',
                'opportunity_type'     => 'Call for Applications',
                'reference'            => 'KAFU/CALL/002/2026',
                'deadline'             => '2026-05-31',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'Registered organisation with valid certificate of incorporation or equivalent',
                    'Concept note (max 5 pages) describing the proposed partnership',
                    'Contact details of a designated partnership coordinator',
                    'Proposed timeline and resource commitment',
                ],
                'submission_info' => 'Submit concept notes to partnerships@kafu.ac.ke with subject "KAFU/CALL/002/2026 — Partnership Proposal". Deadline: 31 May 2026.',
                'contact' => [
                    'office'   => 'Office of the Vice-Chancellor — Partnerships',
                    'email'    => 'partnerships@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => "VC's Office, Kaimosi Campus",
                ],
                'documents' => [
                    ['title' => 'Partnership Call — Guidelines and Concept Note Template (KAFU/CALL/002/2026)', 'type' => 'PDF', 'size' => '415 KB', 'url' => '#'],
                ],
            ],
        ]);

        // ─── NOTICES ─────────────────────────────────────────────────────
        $upsert([
            'slug'         => 'notice-academic-calendar-amendment-2026',
            'title'        => 'Notice: Amendment to 2025/2026 Academic Calendar',
            'summary'      => 'All students and staff are notified of an amendment to the 2025/2026 academic calendar. Supplementary examination dates have been revised.',
            'body'         => "The Academic Registrar wishes to notify all students, academic staff, and stakeholders that the 2025/2026 Academic Calendar has been amended. Supplementary and special examinations, which were previously scheduled for April 2026, have been rescheduled to the dates contained in the attached amended calendar. All other academic dates remain unchanged. Students are advised to liaise with their respective Heads of Department for any additional guidance.",
            'category'     => 'notice',
            'department'   => 'Academic Registry',
            'featured'     => false,
            'published_at' => '2026-03-28 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'notice',
                'opportunity_type'     => 'Notice',
                'reference'            => 'KAFU/NOT/001/2026',
                'deadline'             => null,
                'deadline_time'        => null,
                'opportunity_status'   => 'open',
                'requirements'         => [],
                'submission_info'      => 'This is a public notice. No action required from the public. Students and staff should take note of the revised examination dates.',
                'contact' => [
                    'office'   => 'Academic Registry',
                    'email'    => 'registrar@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'Academic Registry, Administration Block',
                ],
                'documents' => [
                    ['title' => 'Amended Academic Calendar 2025/2026', 'type' => 'PDF', 'size' => '185 KB', 'url' => '#'],
                ],
            ],
        ]);

        // ─── SCHOLARSHIPS / BURSARIES ─────────────────────────────────────
        $upsert([
            'slug'         => 'disability-support-bursary-kafu-burs-001-2026',
            'title'        => 'KAFU Disability Support Bursary 2026/2027',
            'summary'      => 'KAFU offers bursary support to students living with disabilities who demonstrate financial need. Covers tuition reduction, accommodation support, and access to specialised study resources.',
            'body'         => "Kaimosi Friends University, in line with its commitment to inclusive education and access, offers a Disability Support Bursary for registered students living with disabilities who demonstrate financial need. The bursary covers partial tuition fee waiver (up to 50%), accommodation subsidy, and access to specialised study materials and assistive technology.",
            'category'     => 'scholarship',
            'department'   => 'Student Affairs Division',
            'featured'     => false,
            'published_at' => '2026-03-01 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'scholarship',
                'opportunity_type'     => 'Scholarship',
                'reference'            => 'KAFU/BURS/001/2026',
                'deadline'             => '2026-05-31',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'Registered student of KAFU (must be enrolled for 2026/2027 academic year)',
                    'Certified disability documentation from a recognised medical or government institution',
                    'Demonstrated financial need (means test form required)',
                    'Recommendation letter from Student Welfare Office',
                    'Minimum CGPA of 2.0 (or equivalent)',
                    'Statement of need (max 500 words)',
                ],
                'submission_info' => 'Applications to be submitted to the Student Affairs Office with all supporting documents by 31 May 2026. Forms available at the Student Affairs Office and for download below.',
                'contact' => [
                    'office'   => 'Student Affairs Division',
                    'email'    => 'studentaffairs@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'Student Centre, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Disability Support Bursary Application Form (KAFU/BURS/001/2026)', 'type' => 'PDF', 'size' => '230 KB', 'url' => '#'],
                ],
            ],
        ]);

        $upsert([
            'slug'         => 'equity-bursary-kafu-burs-002-2026',
            'title'        => 'Government Equity Bursary — HELB/NGEC Link 2026/2027',
            'summary'      => 'KAFU, in partnership with HELB and NGEC, invites applications from financially needy students from marginalised communities for the 2026/2027 Equity Bursary Fund.',
            'body'         => 'In partnership with the Higher Education Loans Board (HELB) and the National Gender and Equality Commission (NGEC), KAFU is making available equity bursaries for academically deserving students from marginalised communities including students from ASALs, youth with disabilities, and students from historically underserved counties.',
            'category'     => 'scholarship',
            'department'   => 'Student Affairs Division',
            'featured'     => false,
            'published_at' => '2026-03-10 08:00:00',
            'structured_data' => [
                'opportunity_category' => 'scholarship',
                'opportunity_type'     => 'Scholarship',
                'reference'            => 'KAFU/BURS/002/2026',
                'deadline'             => '2026-04-30',
                'deadline_time'        => '17:00',
                'opportunity_status'   => 'open',
                'requirements' => [
                    'Registered KAFU student for 2026/2027 academic year',
                    'HELB loan application confirmation (where applicable)',
                    'Proof of originating from a designated marginalised community (Sub-County Officer letter)',
                    'Academic transcript with minimum CGPA of 2.0',
                    'Financial needs declaration',
                    'Completed KAFU/BURS/002 form',
                ],
                'submission_info' => 'Applications to Student Affairs Office or by email to studentaffairs@kafu.ac.ke, subject "KAFU/BURS/002/2026 — Equity Bursary". Deadline: 30 April 2026.',
                'contact' => [
                    'office'   => 'Student Affairs Division',
                    'email'    => 'studentaffairs@kafu.ac.ke',
                    'phone'    => '+254 777 373 633',
                    'location' => 'Student Centre, Kaimosi Campus',
                ],
                'documents' => [
                    ['title' => 'Equity Bursary Application Form (KAFU/BURS/002/2026)',  'type' => 'PDF', 'size' => '260 KB', 'url' => '#'],
                    ['title' => 'Marginalised Communities Criteria Guide',                 'type' => 'PDF', 'size' => '190 KB', 'url' => '#'],
                ],
            ],
        ]);

        $this->command->info('Opportunities seeder complete: ' . CmsContent::where('type', 'opportunity')->count() . ' opportunities in database.');
    }
}
