<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class AdmissionsModuleSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // ── Pathways ──────────────────────────────────────────────────────────
        DB::table('admission_pathways')->insertOrIgnore([
            [
                'code' => 'kuccps',
                'name' => 'KUCCPS Government Placement',
                'description' => 'For students officially placed at KAFU by the Kenya Universities and Colleges Central Placement Service (KUCCPS). Requires verification against placement records.',
                'level' => 'undergraduate',
                'requires_payment' => false,
                'requires_kuccps_verification' => true,
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'code' => 'ug_self',
                'name' => 'Self-Sponsored Undergraduate',
                'description' => 'For students applying directly to KAFU for undergraduate programmes outside KUCCPS placement (Module II / Self-Sponsored).',
                'level' => 'undergraduate',
                'requires_payment' => true,
                'requires_kuccps_verification' => false,
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'code' => 'masters',
                'name' => 'Masters (Self-Sponsored)',
                'description' => 'For applicants seeking admission into Masters (MSc / MA / MBA / MEd) programmes at Kaimosi Friends University.',
                'level' => 'masters',
                'requires_payment' => true,
                'requires_kuccps_verification' => false,
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'code' => 'phd',
                'name' => 'Doctoral (PhD)',
                'description' => 'For applicants seeking admission into Doctor of Philosophy (PhD) programmes at Kaimosi Friends University.',
                'level' => 'phd',
                'requires_payment' => true,
                'requires_kuccps_verification' => false,
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => $now, 'updated_at' => $now,
            ],
        ]);

        // ── Intakes ───────────────────────────────────────────────────────────
        $intakeIds = [];

        $jan2026 = DB::table('admissions_intakes')->insertGetId([
            'name'           => 'January 2026 Intake',
            'academic_year'  => '2025/2026',
            'intake_period'  => 'january',
            'open_at'        => '2025-10-01 00:00:00',
            'close_at'       => '2025-12-15 23:59:59',
            'status'         => 'closed',
            'is_published'   => true,
            'application_fee_undergraduate' => 1000.00,
            'application_fee_masters'       => 1500.00,
            'application_fee_phd'           => 2000.00,
            'allow_kuccps'            => true,
            'allow_self_sponsored_ug' => true,
            'allow_masters'           => true,
            'allow_phd'               => true,
            'notes' => 'January 2026 intake — closed.',
            'created_at' => $now, 'updated_at' => $now,
        ]);
        $intakeIds['january'] = $jan2026;

        $may2026 = DB::table('admissions_intakes')->insertGetId([
            'name'           => 'May 2026 Intake',
            'academic_year'  => '2025/2026',
            'intake_period'  => 'may',
            'open_at'        => '2026-02-01 00:00:00',
            'close_at'       => '2026-04-15 23:59:59',
            'status'         => 'closed',
            'is_published'   => true,
            'application_fee_undergraduate' => 1000.00,
            'application_fee_masters'       => 1500.00,
            'application_fee_phd'           => 2000.00,
            'allow_kuccps'            => true,
            'allow_self_sponsored_ug' => true,
            'allow_masters'           => true,
            'allow_phd'               => true,
            'notes' => 'May 2026 intake — closed.',
            'created_at' => $now, 'updated_at' => $now,
        ]);
        $intakeIds['may'] = $may2026;

        $sep2026 = DB::table('admissions_intakes')->insertGetId([
            'name'           => 'September 2026 Intake',
            'academic_year'  => '2026/2027',
            'intake_period'  => 'september',
            'open_at'        => '2026-05-01 00:00:00',
            'close_at'       => '2026-07-31 23:59:59',
            'status'         => 'open',
            'is_published'   => true,
            'application_fee_undergraduate' => 1000.00,
            'application_fee_masters'       => 1500.00,
            'application_fee_phd'           => 2000.00,
            'allow_kuccps'            => true,
            'allow_self_sponsored_ug' => true,
            'allow_masters'           => true,
            'allow_phd'               => true,
            'allow_late_applications' => false,
            'notes' => 'Applications for the 2026/2027 academic year are now open.',
            'created_at' => $now, 'updated_at' => $now,
        ]);
        $intakeIds['september'] = $sep2026;

        // ── Programmes ────────────────────────────────────────────────────────
        $programmes = [
            // SESS — Education & Social Sciences
            ['KAFU/BSED/001', 'Bachelor of Education (Arts)',                'SESS', 'Education',   'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with C+ in English and two arts subjects', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BSED/002', 'Bachelor of Education (Science)',             'SESS', 'Education',   'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with C+ in Mathematics and two science subjects', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BSED/003', 'Bachelor of Arts (Sociology)',                'SESS', 'Social Sciences', 'undergraduate', '3 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C with C in English', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/MDED/001', 'Master of Education (Curriculum & Instruction)', 'SESS', 'Education', 'masters', '2 years', ['january','september'], ['masters'],
                'Undergraduate degree in Education or related field with minimum Second Class Honours (Lower Division)', ['national_id','degree_cert','transcript','passport_photo']],

            // SBE — Business & Economics
            ['KAFU/BBAM/001', 'Bachelor of Business Administration & Management', 'SBE', 'Business', 'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C with C in Mathematics and English', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BCOM/001', 'Bachelor of Commerce',                        'SBE', 'Commerce', 'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with C+ in Mathematics', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BECO/001', 'Bachelor of Economics',                       'SBE', 'Economics', 'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with B in Mathematics', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/MBAM/001', 'Master of Business Administration (MBA)',      'SBE', 'Business', 'masters', '2 years', ['january','may','september'], ['masters'],
                'Undergraduate degree in any field with minimum 2nd Class Honours; 2 years work experience preferred', ['national_id','degree_cert','transcript','passport_photo']],
            ['KAFU/MACC/001', 'Master of Science in Accounting',             'SBE', 'Commerce', 'masters', '2 years', ['january','september'], ['masters'],
                'BCom or related degree with minimum 2nd Class Lower', ['national_id','degree_cert','transcript','passport_photo']],

            // SCIT — Computing & IT
            ['KAFU/BSCS/001', 'Bachelor of Science in Computer Science',     'SCIT', 'Computing', 'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with B in Mathematics and C in Physics', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BSIT/001', 'Bachelor of Science in Information Technology','SCIT', 'Computing', 'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C with C in Mathematics', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BSSE/001', 'Bachelor of Science in Software Engineering',  'SCIT', 'Computing', 'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with B in Mathematics', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/MSCS/001', 'Master of Science in Computer Science',        'SCIT', 'Computing', 'masters', '2 years', ['january','september'], ['masters'],
                'BSc Computer Science or IT or related degree with minimum 2nd Class Honours', ['national_id','degree_cert','transcript','passport_photo']],
            ['KAFU/PHCS/001', 'Doctor of Philosophy in Computer Science',     'SCIT', 'Computing', 'phd', '3 years', ['january','september'], ['phd'],
                'Masters degree in Computer Science or IT or related field', ['national_id','masters_cert','transcript','passport_photo','concept_note']],

            // SOS — Science
            ['KAFU/BBIO/001', 'Bachelor of Science (Biology)',                'SOS', 'Biological Sciences', 'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with B in Biology and C in Chemistry', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BCHEM/001','Bachelor of Science (Chemistry)',              'SOS', 'Physical Sciences',  'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with B in Chemistry and C in Mathematics', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BPHY/001', 'Bachelor of Science (Physics)',                'SOS', 'Physical Sciences',  'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with B in Physics and B in Mathematics', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/MSCI/001', 'Master of Science (Environmental Science)',    'SOS', 'Environmental Science', 'masters', '2 years', ['january','september'], ['masters'],
                'BSc in any science field with minimum 2nd Class Honours (Lower Division)', ['national_id','degree_cert','transcript','passport_photo']],
            ['KAFU/PHSC/001', 'Doctor of Philosophy (Chemistry)',             'SOS', 'Physical Sciences', 'phd', '3 years', ['january'], ['phd'],
                'Masters degree in Chemistry or closely related discipline', ['national_id','masters_cert','transcript','passport_photo','concept_note']],

            // SHS — Health Sciences
            ['KAFU/BOPT/001', 'Bachelor of Science in Optometry',            'SHS', 'Optometry',  'undergraduate', '5 years', ['september'], ['kuccps','ug_self'],
                'KCSE Mean Grade B with B+ in Biology and B in Chemistry and Physics', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BNUR/001', 'Bachelor of Science in Nursing',              'SHS', 'Nursing',    'undergraduate', '4 years', ['january','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with B in Biology and C in Chemistry', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BNUT/001', 'Bachelor of Science in Nutrition & Dietetics','SHS', 'Nutrition',  'undergraduate', '4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with C+ in Biology and Chemistry', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/BPHE/001', 'Bachelor of Science in Public Health',        'SHS', 'Public Health','undergraduate','4 years', ['january','may','september'], ['kuccps','ug_self'],
                'KCSE Mean Grade C+ with C+ in Biology', ['national_id','kcse_cert','passport_photo']],
            ['KAFU/MOPH/001', 'Master of Science in Optometry',              'SHS', 'Optometry',  'masters', '2 years', ['january','september'], ['masters'],
                'Bachelor of Science in Optometry with minimum 2nd Class Honours', ['national_id','degree_cert','transcript','passport_photo']],
            ['KAFU/MOPH/002', 'Master of Public Health (MPH)',               'SHS', 'Public Health','masters','2 years', ['january','may','september'], ['masters'],
                'Degree in health-related field with minimum 2nd Class Lower Honours', ['national_id','degree_cert','transcript','passport_photo']],
            ['KAFU/PHPH/001', 'Doctor of Philosophy in Public Health',       'SHS', 'Public Health','phd', '3 years', ['january','september'], ['phd'],
                'Masters degree in Public Health or related field', ['national_id','masters_cert','transcript','passport_photo','concept_note','referee_letter']],
        ];

        $progIds = [];
        foreach ($programmes as $p) {
            [$code, $name, $school, $dept, $level, $duration, $intakes, $pathways, $minReq, $docs] = $p;
	DB::table('admission_programmes')->updateOrInsert(
    ['programme_code' => $code],
    [
        'programme_name'       => $name,
        'school_code'          => $school,
        'department'           => $dept,
        'level'                => $level,
        'duration'             => $duration,
        'mode'                 => 'full_time',
        'campus'               => 'Main Campus',
        'minimum_requirements' => $minReq,
        'available_intakes'    => json_encode($intakes),
        'available_pathways'   => json_encode($pathways),
        'required_documents'   => json_encode($docs),
        'is_active'            => true,
        'sort_order'           => 0,
        'created_at'           => $now,
        'updated_at'           => $now,
    ]
);

$id = DB::table('admission_programmes')
    ->where('programme_code', $code)
    ->value('id');DB::table('admission_programmes')->updateOrInsert(
    ['programme_code' => $code],
    [
        'programme_name'       => $name,
        'school_code'          => $school,
        'department'           => $dept,
        'level'                => $level,
        'duration'             => $duration,
        'mode'                 => 'full_time',
        'campus'               => 'Main Campus',
        'minimum_requirements' => $minReq,
        'available_intakes'    => json_encode($intakes),
        'available_pathways'   => json_encode($pathways),
        'required_documents'   => json_encode($docs),
        'is_active'            => true,
        'sort_order'           => 0,
        'created_at'           => $now,
        'updated_at'           => $now,
    ]
);

$id = DB::table('admission_programmes')
    ->where('programme_code', $code)
    ->value('id');
        }

        // ── Link all programmes to the September 2026 intake ─────────────────
        $pathwayMap = DB::table('admission_pathways')->get()->keyBy('code');

        foreach ($progIds as $code => $pid) {
            $prog = DB::table('admission_programmes')->where('id', $pid)->first();
            $availPathways = json_decode($prog->available_pathways ?? '[]', true);
            foreach ($availPathways as $pathCode) {
                $pathway = $pathwayMap[$pathCode] ?? null;
                if (!$pathway) continue;
                DB::table('intake_programme_availability')->insertOrIgnore([
                    'intake_id'   => $sep2026,
                    'programme_id' => $pid,
                    'pathway_id'  => $pathway->id,
                    'is_open'     => true,
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ]);
            }
        }
    }
}
