<?php

namespace Database\Seeders;

use App\Models\CmsContent;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DocumentsSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@kafu.ac.ke')->first();

        $documents = [
            [
                'title'          => 'Student Academic Handbook 2025/2026',
                'slug'           => 'student-academic-handbook-2025-2026',
                'summary'        => 'The official student academic handbook for the 2025/2026 academic year, covering registration, examinations, graduation requirements, academic integrity, and student rights and responsibilities.',
                'body'           => '<p>The Student Academic Handbook is the definitive guide for all registered students of Kaimosi Friends University. It outlines the academic policies, procedures, and regulations governing student life at KAFU.</p><h2>Contents</h2><ul><li>University Vision, Mission and Core Values</li><li>Admission and Registration Procedures</li><li>Academic Programmes and Credit System</li><li>Examination Regulations and Grading</li><li>Student Rights and Responsibilities</li><li>Academic Integrity and Anti-Plagiarism Policy</li><li>Student Support Services</li><li>Graduation Requirements and Ceremonies</li></ul><p>All students are required to familiarise themselves with the provisions of this handbook. Ignorance of the regulations contained herein shall not be accepted as an excuse for non-compliance.</p>',
                'department'     => 'Office of the Registrar',
                'category'       => 'Academic',
                'tags'           => ['handbook', 'students', 'academic', 'regulations'],
                'structured_data' => [
                    'document_category' => 'handbook',
                    'version'           => '2025/2026',
                    'effective_date'    => '2025-09-01',
                    'file_size'         => '3.2 MB',
                    'document_url'      => 'https://kafu.ac.ke/documents/student-academic-handbook-2025-2026.pdf',
                ],
            ],
            [
                'title'          => 'University Statute and Charter',
                'slug'           => 'university-statute-and-charter',
                'summary'        => 'The founding statute and charter of Kaimosi Friends University, establishing its legal framework, governance structures, mandate, and operational principles under the Universities Act (Cap. 210B) of Kenya.',
                'body'           => '<p>The University Statute and Charter defines the legal basis for the establishment and operation of Kaimosi Friends University (KAFU) as a public university in Kenya, pursuant to the Universities Act, Cap. 210B.</p><h2>Key Provisions</h2><ul><li>Establishment and Legal Status</li><li>University Council: Composition and Functions</li><li>Office of the Vice-Chancellor</li><li>Senate: Powers and Responsibilities</li><li>Faculties, Schools and Institutes</li><li>Student Governance</li><li>Financial Management</li><li>Amendment Procedures</li></ul><p>KAFU was established under the authority of the Cabinet Secretary for Education in 2014, building on the legacy of the Kaimosi Friends College of Education.</p>',
                'department'     => 'Office of the Vice-Chancellor',
                'category'       => 'Governance',
                'tags'           => ['statute', 'charter', 'governance', 'legal'],
                'structured_data' => [
                    'document_category' => 'statute',
                    'version'           => '2014 (as amended 2022)',
                    'effective_date'    => '2014-01-01',
                    'file_size'         => '1.8 MB',
                    'document_url'      => 'https://kafu.ac.ke/documents/university-statute-charter.pdf',
                ],
            ],
            [
                'title'          => 'Examination Rules and Regulations',
                'slug'           => 'examination-rules-and-regulations',
                'summary'        => 'Comprehensive rules governing the conduct of University examinations, including invigilation standards, candidate conduct, special examination arrangements, and appeals procedures.',
                'body'           => '<p>These regulations govern all examinations conducted by Kaimosi Friends University. They apply to all end-of-semester examinations, supplementary examinations, and special examinations.</p><h2>Key Sections</h2><ul><li>Examination Registration Requirements</li><li>Conduct in the Examination Room</li><li>Prohibited Materials and Academic Dishonesty</li><li>Special Examination Arrangements (Special Needs)</li><li>Missing and Late Examination Scripts</li><li>Remarking and Appeals Procedure</li><li>Penalties for Examination Irregularities</li></ul><p>Any candidate found guilty of examination malpractice shall be subject to disciplinary proceedings as provided under the Student Disciplinary Policy.</p>',
                'department'     => 'Examinations Office',
                'category'       => 'Academic',
                'tags'           => ['examinations', 'regulations', 'academic', 'conduct'],
                'structured_data' => [
                    'document_category' => 'regulation',
                    'version'           => '2024',
                    'effective_date'    => '2024-01-15',
                    'file_size'         => '890 KB',
                    'document_url'      => 'https://kafu.ac.ke/documents/examination-rules-regulations.pdf',
                ],
            ],
            [
                'title'          => 'Student Code of Conduct and Disciplinary Policy',
                'slug'           => 'student-code-of-conduct-disciplinary-policy',
                'summary'        => 'Defines expected standards of behaviour for all KAFU students, sets out disciplinary procedures, and specifies consequences for violations including academic dishonesty, harassment, and misconduct on and off campus.',
                'body'           => '<p>Kaimosi Friends University expects all students to uphold the highest standards of personal conduct, consistent with the Quaker values of truth, integrity, equality, and community on which the institution was founded.</p><h2>Policy Coverage</h2><ul><li>Expected Standards of Conduct</li><li>Academic Integrity (Plagiarism, Collusion, Cheating)</li><li>Sexual Harassment and Gender-Based Violence Policy</li><li>Drug and Substance Abuse Policy</li><li>Disciplinary Committee Structure</li><li>Hearing Procedures and Student Rights</li><li>Range of Sanctions (Caution, Suspension, Expulsion)</li><li>Appeals Process</li></ul>',
                'department'     => 'Dean of Students',
                'category'       => 'Student Affairs',
                'tags'           => ['conduct', 'discipline', 'policy', 'students'],
                'structured_data' => [
                    'document_category' => 'policy',
                    'version'           => '2023',
                    'effective_date'    => '2023-09-01',
                    'file_size'         => '1.1 MB',
                    'document_url'      => 'https://kafu.ac.ke/documents/student-code-of-conduct.pdf',
                ],
            ],
            [
                'title'          => 'Academic Calendar 2025/2026',
                'slug'           => 'academic-calendar-2025-2026',
                'summary'        => 'The official KAFU academic calendar for the 2025/2026 academic year, including semester dates, examination periods, public holidays, registration deadlines, and graduation dates.',
                'body'           => '<h2>Semester I — September 2025 to January 2026</h2><ul><li>Orientation Week: 1–5 September 2025</li><li>Lectures Begin: 8 September 2025</li><li>Course Add/Drop Deadline: 19 September 2025</li><li>Mid-Semester Break: 27–31 October 2025</li><li>Lectures End: 28 November 2025</li><li>Revision Week: 1–5 December 2025</li><li>Examinations: 8–19 December 2025</li><li>Semester Break: 20 December 2025 – 9 January 2026</li></ul><h2>Semester II — January 2026 to June 2026</h2><ul><li>Lectures Begin: 12 January 2026</li><li>Course Add/Drop Deadline: 23 January 2026</li><li>Mid-Semester Break: 23–27 March 2026</li><li>Lectures End: 24 April 2026</li><li>Revision Week: 27 April – 1 May 2026</li><li>Examinations: 4–15 May 2026</li><li>Graduation Ceremony: 27 June 2026</li></ul>',
                'department'     => 'Office of the Registrar',
                'category'       => 'Academic',
                'tags'           => ['calendar', 'academic', 'semester', '2025', '2026'],
                'structured_data' => [
                    'document_category' => 'calendar',
                    'version'           => '2025/2026',
                    'effective_date'    => '2025-09-01',
                    'file_size'         => '450 KB',
                    'document_url'      => 'https://kafu.ac.ke/documents/academic-calendar-2025-2026.pdf',
                ],
            ],
            [
                'title'          => 'Fee Structure 2025/2026',
                'slug'           => 'fee-structure-2025-2026',
                'summary'        => 'Official university fee structure for all undergraduate and postgraduate programmes for the 2025/2026 academic year, including tuition, accommodation, caution money, and student union fees.',
                'body'           => '<p>This fee structure is applicable to all continuing and new students for the academic year 2025/2026. All fees are payable in Kenya Shillings (KES) per semester.</p><h2>Undergraduate Programmes</h2><ul><li>Government-sponsored students (HELB): As per government allocation</li><li>Self-sponsored (Arts and Social Sciences): KES 45,000 – 55,000 per semester</li><li>Self-sponsored (Science, Technology, Engineering): KES 55,000 – 75,000 per semester</li><li>Self-sponsored (Health Sciences): KES 60,000 – 80,000 per semester</li></ul><h2>Postgraduate Programmes</h2><ul><li>Masters Programmes: KES 75,000 – 95,000 per semester</li><li>PhD Programmes: KES 90,000 – 120,000 per semester</li></ul><h2>Other Charges</h2><ul><li>Registration Fee: KES 3,500 (once-off)</li><li>Student Union Fee: KES 1,500 per semester</li><li>Caution Money: KES 5,000 (refundable)</li><li>Medical Levy: KES 2,000 per semester</li><li>Library Fee: KES 1,500 per semester</li></ul>',
                'department'     => 'Finance Department',
                'category'       => 'Finance',
                'tags'           => ['fees', 'finance', 'tuition', '2025', '2026'],
                'structured_data' => [
                    'document_category' => 'policy',
                    'version'           => '2025/2026',
                    'effective_date'    => '2025-09-01',
                    'file_size'         => '680 KB',
                    'document_url'      => 'https://kafu.ac.ke/documents/fee-structure-2025-2026.pdf',
                ],
            ],
            [
                'title'          => 'Postgraduate Studies Handbook 2025/2026',
                'slug'           => 'postgraduate-studies-handbook-2025-2026',
                'summary'        => 'Comprehensive guide for Masters and PhD students covering admission requirements, thesis/dissertation supervision, research ethics, progress monitoring, examination, and graduation requirements.',
                'body'           => '<p>This handbook provides guidance for all postgraduate students pursuing Masters and Doctoral programmes at Kaimosi Friends University. It supplements the general Student Academic Handbook with provisions specific to postgraduate study.</p><h2>Contents</h2><ul><li>Admission Requirements for Masters and PhD Programmes</li><li>Supervisor Allocation and Supervision Standards</li><li>Annual Progress Reports and Milestones</li><li>Research Proposal and Concept Paper Requirements</li><li>Research Ethics and Institutional Review Board</li><li>Thesis/Dissertation Format and Submission</li><li>Oral Defence (Viva Voce) Procedures</li><li>Postgraduate Board of Studies</li></ul>',
                'department'     => 'Directorate of Research and Postgraduate Studies',
                'category'       => 'Academic',
                'tags'           => ['postgraduate', 'research', 'handbook', 'PhD', 'masters'],
                'structured_data' => [
                    'document_category' => 'handbook',
                    'version'           => '2025/2026',
                    'effective_date'    => '2025-09-01',
                    'file_size'         => '2.1 MB',
                    'document_url'      => 'https://kafu.ac.ke/documents/postgraduate-handbook-2025-2026.pdf',
                ],
            ],
            [
                'title'          => 'Research Policy and Ethics Guidelines',
                'slug'           => 'research-policy-and-ethics-guidelines',
                'summary'        => 'KAFU\'s policy framework governing research activities, including ethical principles, Institutional Review Board procedures, intellectual property rights, conflict of interest disclosures, and research data management.',
                'body'           => '<p>Kaimosi Friends University is committed to promoting and supporting high-quality, ethical research that contributes to national development and the global knowledge base. This policy applies to all research conducted by KAFU staff and students.</p><h2>Key Principles</h2><ul><li>Research Integrity and Scientific Honesty</li><li>Informed Consent and Voluntary Participation</li><li>Confidentiality and Data Protection</li><li>Conflict of Interest Disclosure</li><li>Institutional Review Board (IRB) Procedures</li><li>Intellectual Property and Patent Policy</li><li>Research Data Management and Storage</li><li>Publication Ethics and Authorship Standards</li></ul>',
                'department'     => 'Directorate of Research and Postgraduate Studies',
                'category'       => 'Research',
                'tags'           => ['research', 'ethics', 'IRB', 'policy', 'integrity'],
                'structured_data' => [
                    'document_category' => 'policy',
                    'version'           => '2024',
                    'effective_date'    => '2024-03-01',
                    'file_size'         => '1.4 MB',
                    'document_url'      => 'https://kafu.ac.ke/documents/research-policy-ethics-guidelines.pdf',
                ],
            ],
            [
                'title'          => 'ICT Policy and Acceptable Use Policy',
                'slug'           => 'ict-policy-acceptable-use',
                'summary'        => 'Governs the acceptable use of ICT resources at KAFU including the university network, email, student portal, library systems, and personal devices connected to university infrastructure.',
                'body'           => '<p>The ICT Policy establishes the rules and procedures for the use of Information and Communication Technology (ICT) resources at Kaimosi Friends University. It applies to all students, staff, and authorised visitors.</p><h2>Scope and Coverage</h2><ul><li>University Network and Wi-Fi Access</li><li>University Email (kafu.ac.ke) Usage</li><li>Student and Staff Portals</li><li>Social Media and Online Conduct</li><li>Software Licensing and Installation</li><li>Data Protection and Privacy</li><li>Cybersecurity Incident Reporting</li><li>Consequences of Policy Violations</li></ul><p>Unauthorised access to university systems, hacking, or any other cyber-offence is a criminal act under the Kenya Computer Misuse and Cybercrimes Act, 2018.</p>',
                'department'     => 'ICT Department',
                'category'       => 'Administration',
                'tags'           => ['ICT', 'policy', 'acceptable use', 'cybersecurity', 'network'],
                'structured_data' => [
                    'document_category' => 'policy',
                    'version'           => '2023',
                    'effective_date'    => '2023-09-01',
                    'file_size'         => '760 KB',
                    'document_url'      => 'https://kafu.ac.ke/documents/ict-acceptable-use-policy.pdf',
                ],
            ],
            [
                'title'          => 'Staff Code of Conduct',
                'slug'           => 'staff-code-of-conduct',
                'summary'        => 'Establishes professional and ethical standards for all KAFU staff members, covering workplace conduct, conflict of interest, confidentiality, political activities, and disciplinary procedures for staff.',
                'body'           => '<p>Kaimosi Friends University holds all members of staff to high standards of professional conduct, integrity, and service. This code applies to all academic and administrative staff, whether permanent, contract, or adjunct.</p><h2>Key Provisions</h2><ul><li>Professional Conduct and Workplace Ethics</li><li>Conflict of Interest Disclosure</li><li>Confidentiality and Privacy Obligations</li><li>Academic Freedom and Institutional Loyalty</li><li>Non-Discrimination and Equal Opportunity</li><li>Prevention of Sexual Harassment</li><li>Political Activities and Public Statements</li><li>Gifts and Hospitality Policy</li><li>Staff Disciplinary Procedures</li></ul>',
                'department'     => 'Human Resource Department',
                'category'       => 'Administration',
                'tags'           => ['staff', 'conduct', 'ethics', 'HR', 'policy'],
                'structured_data' => [
                    'document_category' => 'policy',
                    'version'           => '2024',
                    'effective_date'    => '2024-01-01',
                    'file_size'         => '980 KB',
                    'document_url'      => 'https://kafu.ac.ke/documents/staff-code-of-conduct.pdf',
                ],
            ],
        ];

        $now = now();
        $created = 0;

        foreach ($documents as $doc) {
            $exists = CmsContent::where('slug', $doc['slug'])->exists();
            if ($exists) continue;

            CmsContent::create([
                'type'            => 'document',
                'title'           => $doc['title'],
                'slug'            => $doc['slug'],
                'summary'         => $doc['summary'],
                'body'            => $doc['body'],
                'status'          => 'published',
                'department'      => $doc['department'],
                'category'        => $doc['category'],
                'tags'            => $doc['tags'],
                'structured_data' => $doc['structured_data'],
                'author_id'       => $admin?->id ?? 1,
                'featured'        => false,
                'is_deleted'      => false,
                'published_at'    => $now,
                'created_at'      => $now,
                'updated_at'      => $now,
            ]);
            $created++;
        }

        $this->command->info("Documents seeder: {$created} new documents created. Total document-type content: " . CmsContent::where('type', 'document')->count());
    }
}
