<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            // ── SESS ─────────────────────────────────────────────────────────
            [
                'school_code'     => 'SESS',
                'name'            => 'Department of Educational Foundations, Psychology & Management',
                'slug'            => 'educational-foundations-psychology-management',
                'description'     => 'The Department of Educational Foundations, Psychology and Management prepares students to become competent educators, counsellors, administrators and change-makers. It offers programmes in Educational Psychology, Early Childhood Education and Religious Studies, equipping learners with practical skills, critical thinking and ethical values for modern educational and social environments.',
                'vision'          => 'To be a leading department in education, psychology and institutional leadership in East Africa.',
                'hod_name'        => 'Dr. Constance Amusala',
                'hod_title'       => 'Chair, EFPM Department',
                'hod_email'       => 'c.amusala@kafu.ac.ke',
                'hod_phone'       => '+254 700 100 201',
                'hod_photo_url'   => '/images/uploads/wangara.jpg',
                'hod_bio'         => 'Mr. Ahmed K. Wangara chairs the Department of Social Sciences at the School of Education and Social Sciences, Kaimosi Friends University.',
                'office_location' => 'Social Sciences Block, Room 118, KAFU Main Campus',
                'email'           => 'dept.socialsciences@kafu.ac.ke',
                'phone'           => '+254 700 100 230',
                'sort_order'      => 4,
            ],

            // ── SBE ──────────────────────────────────────────────────────────
            [
                'school_code'     => 'SBE',
                'name'            => 'Department of Business Administration & Management',
                'slug'            => 'business-administration-management',
                'description'     => 'The Department of Business Administration & Management offers comprehensive programmes that develop analytical, strategic, and leadership capabilities in business students. The department engages industry partners extensively to ensure graduates are job-ready, ethically grounded, and equipped to lead organisations of all sizes.',
                'vision'          => 'To produce globally competitive business leaders rooted in ethical practice.',
                'hod_name'        => 'Mr. Obed Tanda Monayo',
                'hod_title'       => 'Chair, Business Administration & Management Sciences',
                'hod_email'       => 'o.monayo@kafu.ac.ke',
                'hod_phone'       => '+254 700 100 301',
                'hod_photo_url'   => '/images/uploads/Obed-Tanda-COD-BAMs-300x300.jpg',
                'hod_bio'         => 'Dr. Robert Opanyi chairs the Department of Accounting, Finance and Economics at Kaimosi Friends University. He leads a team dedicated to producing transformative leaders and ethically grounded professionals capable of navigating the global financial landscape.',
                'office_location' => 'Business Block, Room 215, KAFU Main Campus',
                'email'           => 'dept.af@kafu.ac.ke',
                'phone'           => '+254 700 100 310',
                'sort_order'      => 2,
            ],
            [
                'school_code'     => 'SBE',
                'name'            => 'Department of Economics',
                'slug'            => 'economics',
                'description'     => 'The Department of Economics provides rigorous training in micro and macroeconomic theory, econometrics, development economics, and policy analysis. Graduates are employed in government ministries, international financial institutions, research organisations, and the private sector.',
                'hod_name'        => 'Dr. Mackton',
                'hod_title'       => 'Chair, Department of Economics',
                'hod_email'       => 'hod.economics@kafu.ac.ke',
                'hod_phone'       => '+254 700 100 321',
                'hod_photo_url'   => '/images/uploads/Dr.-Mackton-COD-Economics-300x300.jpg',
                'hod_bio'         => 'Dr. Mackton chairs the Department of Economics at the School of Business and Economics, Kaimosi Friends University.',
                'office_location' => 'Business Block, Room 225, KAFU Main Campus',
                'email'           => 'dept.econ@kafu.ac.ke',
                'phone'           => '+254 700 100 320',
                'sort_order'      => 3,
            ],

            // ── SCIT ─────────────────────────────────────────────────────────
            [
                'school_code'     => 'SCIT',
                'name'            => 'Department of Computer Science',
                'slug'            => 'computer-science',
                'description'     => 'The Department of Computer Science offers theoretically rigorous and practically grounded programmes in algorithms, software systems, artificial intelligence, data science, and computer networks. It is equipped with modern computing labs and is home to KAFU\'s Cyber Security Research Centre.',
                'vision'          => 'To be a centre of excellence in computing education and research in East Africa.',
                'hod_name'        => 'Dr. Lilian Ronoh',
                'hod_title'       => 'Chair, Computer Science Department',
                'hod_email'       => 'l.ronoh@kafu.ac.ke',
                'hod_phone'       => '+254 700 100 401',
                'hod_photo_url'   => '/images/uploads/Dr.-Lilian-Ronoh-1-300x300.jpg',
                'hod_bio'         => 'Dr. Ayub H. Shirandula serves as Chair of the Department of Information Technology and Informatics at Kaimosi Friends University. He is passionate about preparing students to meet the evolving demands of the global ICT industry.',
                'office_location' => 'ICT Block, Room 115, KAFU Main Campus',
                'email'           => 'dept.it@kafu.ac.ke',
                'phone'           => '+254 700 100 410',
                'sort_order'      => 2,
            ],

            // ── SOS ──────────────────────────────────────────────────────────
            [
                'school_code'     => 'SOS',
                'name'            => 'Department of Physical & Biological Sciences',
                'slug'            => 'physical-biological-sciences',
                'description'     => 'Welcome to the Physical and Biological Sciences at Kaimosi Friends University. Our department is a dynamic hub of scientific excellence, dedicated to advancing knowledge and innovation through high-quality teaching, transformative research, and meaningful community engagement. We offer a diverse range of rigorous undergraduate and postgraduate programs—spanning Physics, Chemistry, Biology, Microbiology, and Agriculture—designed to equip students for impactful careers in education, industry, research, and NGOs. With state-of-the-art laboratory facilities and interdisciplinary pathways like Appropriate Technology and Agricultural Economics, we provide a holistic environment where learners are challenged to apply scientific curiosity to real-world challenges, from technological innovation to global food security. At the heart of our mission is a commitment to fostering critical thinking, ethical responsibility, and digital literacy. Our highly qualified faculty is dedicated to mentorship and training, ensuring that 95% of our graduates secure immediate employment by offering competitive, demand-driven courses. In collaboration with global stakeholders, we drive research focused on solving critical issues such as climate action, sustainable smart agriculture, and global health challenges.',
                'hod_name'        => 'Dr. Felix Saouma',
                'hod_title'       => 'Chair, Department of Physical & Biological Sciences',
                'hod_email'       => 'f.saouma@kafu.ac.ke',
                'hod_phone'       => '+254 700 100 511',
                'hod_photo_url'   => '/staff/saouma.jpg',
                'hod_bio'         => 'Dr. Felix Saouma chairs the Department of Physical & Biological Sciences at the School of Science, Kaimosi Friends University, leading a dynamic team dedicated to excellence in Physics, Chemistry, Biology, Microbiology, and Agriculture. The department is committed to equipping graduates for impactful careers across education, research, industry, and NGOs.',
                'office_location' => 'Science Block B, Room 204, KAFU Main Campus',
                'email'           => 'dept.pbs@kafu.ac.ke',
                'phone'           => '+254 700 100 510',
                'sort_order'      => 2,
            ],
            [
                'school_code'     => 'SOS',
                'name'            => 'Department of Mathematics & Statistics',
                'slug'            => 'mathematics-statistics',
                'description'     => 'The Department of Mathematics & Statistics is committed to excellence in pure and applied mathematics, probability, statistics, and actuarial science. Its graduates are employed in banking, insurance, data analytics, and academia, and are highly regarded for their analytical rigour.',
                'hod_name'        => 'Dr. Samuel B. Apima',
                'hod_title'       => 'Chair, Department of Mathematics Sciences',
                'hod_email'       => 's.apima@kafu.ac.ke',
                'hod_phone'       => '+254 700 100 521',
                'hod_photo_url'   => '/images/uploads/Dr.-Apima-300x300.jpg',
                'hod_bio'         => 'Dr. Samuel B. Apima chairs the Department of Mathematics Sciences at Kaimosi Friends University School of Science. The department provides exceptional opportunities for study and research in Mathematics at undergraduate and postgraduate levels, servicing all other schools in the university.',
                'office_location' => 'Science Block A, Room 215, KAFU Main Campus',
                'email'           => 'dept.mathstat@kafu.ac.ke',
                'phone'           => '+254 700 100 520',
                'sort_order'      => 3,
            ],
            // ── SHS ──────────────────────────────────────────────────────────
            [
                'school_code'     => 'SHS',
                'name'            => 'Department of Optometry & Vision Sciences',
                'slug'            => 'optometry-vision-sciences',
                'description'     => 'The Department of Optometry & Vision Sciences is one of only two departments in Kenya offering Optometry training to the PhD level. It provides clinical, research, and community outreach training, producing graduates equipped to address the significant burden of preventable blindness and visual impairment in Kenya and East Africa.',
                'vision'          => 'To be the premier centre for optometry education and eye care research in East Africa.',
                'hod_name'        => 'Dr. Cyprian Mabonga',
                'hod_title'       => 'Dean, School of Health Sciences',
                'hod_email'       => 'c.mabonga@kafu.ac.ke',
                'hod_phone'       => '+254 700 100 601',
                'hod_photo_url'   => '/images/uploads/Dr.-Mabonga-300x300.jpg',
                'hod_bio'         => 'Dr. Anne Asiko Okanga chairs the Department of Nursing at Kaimosi Friends University School of Health Sciences. She leads a team committed to training competent, compassionate, and innovative health professionals through quality education, research, and community service.',
                'office_location' => 'Health Sciences Block, Room 115, KAFU Main Campus',
                'email'           => 'dept.nursing@kafu.ac.ke',
                'phone'           => '+254 700 100 610',
                'sort_order'      => 2,
            ],
            [
                'school_code'     => 'SHS',
                'name'            => 'Department of Clinical Medicine & Community Health',
                'slug'            => 'clinical-medicine-community-health',
                'description'     => 'The Department of Clinical Medicine and Community Health produces competent, ethical, and compassionate clinicians through evidence-based practice and patient-centred care. It offers postgraduate programmes in Clinical Medicine with specialisations in Reproductive Health, Mental Health, and Ophthalmology & Cataract Surgery.',
                'vision'          => 'To be a regional centre of excellence in clinical medicine education, innovation, and community health service.',
                'hod_name'        => 'Dr. Stella Papa',
                'hod_title'       => 'Chair, Clinical Medicine & Community Health',
                'hod_email'       => 's.papa@kafu.ac.ke',
                'hod_phone'       => '+254 700 100 621',
                'hod_photo_url'   => '/images/uploads/Dr.-Stella-Papa-300x300.jpg',
                'hod_bio'         => 'Dr. Stella Papa chairs the Department of Clinical Medicine and Community Health at KAFU School of Health Sciences. She is dedicated to producing competent, ethical, and compassionate clinicians through evidence-based practice and patient-centred care, supported by strong partnerships with teaching hospitals and county health facilities.',
                'office_location' => 'Health Sciences Block, Room 205, KAFU Main Campus',
                'email'           => 'dept.clinicalmedicine@kafu.ac.ke',
                'phone'           => '+254 700 100 620',
                'sort_order'      => 3,
            ],
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(["slug" => $dept["slug"]], $dept);
        }
    }
}
