<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SchoolStaffSeeder extends Seeder
{
    public function run(): void
    {
        $this->updateExistingDepartments();
        $this->insertNewStaff();
    }

    // ─── Infer department from designation keywords ────────────────────────────
    private function inferDepartment(string $designation, string $school): ?string
    {
        $d = strtolower($designation);

        if ($school === 'SESS') {
            if (str_contains($d, 'curriculum'))                                 return 'Department of Curriculum & Instruction';
            if (str_contains($d, 'efpm') || str_contains($d, 'educational foundations') || str_contains($d, 'psychology & management')) return 'Department of Educational Foundations, Psychology & Management';
            if (str_contains($d, 'social sciences'))                            return 'Department of Social Sciences';
            if (str_contains($d, 'languages') || str_contains($d, 'literature')) return 'Department of Languages & Literature';
            if (str_contains($d, 'social work'))                                return 'Department of Social Work & Community Development';
            if (str_contains($d, 'cecare') || str_contains($d, 'natural resources') || str_contains($d, 'environmental')) return 'Department of Natural Resources & Environmental Studies';
        }
        if ($school === 'SOS') {
            if (str_contains($d, 'physical') || str_contains($d, 'biological')) return 'Department of Physical & Biological Sciences';
            if (str_contains($d, 'mathematics') || str_contains($d, 'statistics')) return 'Department of Mathematics & Statistics';
        }
        if ($school === 'SCIT') {
            if (str_contains($d, 'computer science'))                           return 'Department of Computer Science';
            if (str_contains($d, 'information technology') || str_contains($d, 'infrastructure')) return 'Department of Information Technology & Infrastructure';
        }
        if ($school === 'SHS') {
            if (str_contains($d, 'optometry'))                                  return 'Department of Optometry & Vision Sciences';
            if (str_contains($d, 'clinical medicine'))                          return 'Department of Clinical Medicine & Community Health';
            if (str_contains($d, 'nursing'))                                    return 'Department of Nursing Sciences';
        }
        if ($school === 'SBE') {
            if (str_contains($d, 'business administration'))                    return 'Department of Business Administration & Management';
            if (str_contains($d, 'economics'))                                  return 'Department of Economics';
            if (str_contains($d, 'accounting') || str_contains($d, 'finance')) return 'Department of Accounting & Finance';
        }
        return null;
    }

    // ─── Update existing staff_profile records that have no department ─────────
    private function updateExistingDepartments(): void
    {
        $profiles = DB::table('cms_content')
            ->where('type', 'staff_profile')
            ->where(function ($q) { $q->whereNull('department')->orWhere('department', ''); })
            ->get(['id', 'school_code', 'structured_data', 'title']);

        foreach ($profiles as $p) {
            $sd         = json_decode($p->structured_data ?? '{}', true) ?? [];
            $designation = $sd['designation'] ?? '';
            $school     = strtoupper($p->school_code ?? '');
            $dept       = $this->inferDepartment($designation, $school);
            if ($dept) {
                DB::table('cms_content')->where('id', $p->id)->update(['department' => $dept]);
            }
        }
    }

    // ─── Insert new staff extracted from school pages ──────────────────────────
    private function insertNewStaff(): void
    {
        $now      = Carbon::now();
        $authorId = DB::table('users')->value('id') ?? 1;

        $newStaff = [
            // ── School of Science (SOS) ────────────────────────────────────────
            [
                'name' => 'Prof. Geoffrey S. Manyali', 'slug' => 'prof-geoffrey-s-manyali',
                'school' => 'SOS', 'dept' => 'Department of Physical & Biological Sciences',
                'designation' => 'Professor', 'email' => null,
            ],
            [
                'name' => 'Dr. Samuel B. Apima', 'slug' => 'dr-samuel-b-apima',
                'school' => 'SOS', 'dept' => 'Department of Mathematics & Statistics',
                'designation' => 'Chair, Department of Mathematics & Statistics', 'email' => null,
            ],
            [
                'name' => 'Dr. Laban Shikuku', 'slug' => 'dr-laban-shikuku',
                'school' => 'SOS', 'dept' => 'Department of Physical & Biological Sciences',
                'designation' => 'Senior Lecturer', 'email' => null,
            ],
            [
                'name' => 'Dr. Amos K. Wanjara', 'slug' => 'dr-amos-k-wanjara',
                'school' => 'SOS', 'dept' => 'Department of Physical & Biological Sciences',
                'designation' => 'Lecturer', 'email' => null,
            ],
            [
                'name' => 'Mr. Chibayi', 'slug' => 'mr-chibayi',
                'school' => 'SOS', 'dept' => 'Department of Physical & Biological Sciences',
                'designation' => 'Lecturer', 'email' => null,
            ],
            [
                'name' => 'Dr. George T. Opande', 'slug' => 'dr-george-t-opande',
                'school' => 'SOS', 'dept' => 'Department of Physical & Biological Sciences',
                'designation' => 'Senior Lecturer', 'email' => null,
            ],
            [
                'name' => 'Dr. Loice Mureithi', 'slug' => 'dr-loice-mureithi',
                'school' => 'SOS', 'dept' => 'Department of Physical & Biological Sciences',
                'designation' => 'Chair, Biological Sciences Section', 'email' => null,
            ],
            [
                'name' => 'Dr. Jophine S. Namwetako', 'slug' => 'dr-jophine-s-namwetako',
                'school' => 'SOS', 'dept' => 'Department of Physical & Biological Sciences',
                'designation' => 'Lecturer', 'email' => null,
            ],

            // ── School of Computing & IT (SCIT) ───────────────────────────────
            [
                'name' => 'Mr. Shirandula', 'slug' => 'mr-shirandula',
                'school' => 'SCIT', 'dept' => 'Department of Information Technology & Infrastructure',
                'designation' => 'Chair, Department of Information Technology & Infrastructure', 'email' => null,
            ],
            [
                'name' => 'Dr. Hillan Ronoh', 'slug' => 'dr-hillan-ronoh',
                'school' => 'SCIT', 'dept' => 'Department of Computer Science',
                'designation' => 'Lecturer; Director, Open Distance & e-Learning', 'email' => null,
            ],
            [
                'name' => 'Ms. Pauline Outa', 'slug' => 'ms-pauline-outa',
                'school' => 'SCIT', 'dept' => 'Department of Computer Science',
                'designation' => 'Administrative Assistant', 'email' => null,
            ],

            // ── School of Health Sciences (SHS) ───────────────────────────────
            [
                'name' => 'Dr. Cyprian Mabonga', 'slug' => 'dr-cyprian-mabonga',
                'school' => 'SHS', 'dept' => 'Department of Clinical Medicine & Community Health',
                'designation' => 'Senior Lecturer', 'email' => null,
            ],
            [
                'name' => 'Dr. Asiko', 'slug' => 'dr-asiko',
                'school' => 'SHS', 'dept' => 'Department of Nursing Sciences',
                'designation' => 'Lecturer, Nursing Sciences', 'email' => null,
            ],
            [
                'name' => 'Dr. Stella Papa', 'slug' => 'dr-stella-papa',
                'school' => 'SHS', 'dept' => 'Department of Clinical Medicine & Community Health',
                'designation' => 'Lecturer', 'email' => null,
            ],
            [
                'name' => 'Ms. Sarah A. Makongo', 'slug' => 'ms-sarah-a-makongo',
                'school' => 'SHS', 'dept' => 'Department of Nursing Sciences',
                'designation' => 'Lecturer', 'email' => null,
            ],
            [
                'name' => 'Dr. Okenwa', 'slug' => 'dr-okenwa',
                'school' => 'SHS', 'dept' => 'Department of Clinical Medicine & Community Health',
                'designation' => 'Senior Lecturer', 'email' => null,
            ],
            [
                'name' => 'Ms. Mildred Atieno', 'slug' => 'ms-mildred-atieno',
                'school' => 'SHS', 'dept' => 'Department of Nursing Sciences',
                'designation' => 'Lecturer, Nursing Sciences', 'email' => null,
            ],
            [
                'name' => 'Mr. Amugitsi', 'slug' => 'mr-amugitsi',
                'school' => 'SHS', 'dept' => 'Department of Clinical Medicine & Community Health',
                'designation' => 'Lecturer', 'email' => null,
            ],
            [
                'name' => 'Mr. Odero', 'slug' => 'mr-odero',
                'school' => 'SHS', 'dept' => 'Department of Optometry & Vision Sciences',
                'designation' => 'Lecturer', 'email' => null,
            ],

            // ── School of Business & Economics (SBE) ──────────────────────────
            [
                'name' => 'Mr. Opanyi', 'slug' => 'mr-opanyi',
                'school' => 'SBE', 'dept' => 'Department of Accounting & Finance',
                'designation' => 'Chair, Department of Accounting & Finance', 'email' => null,
            ],
            [
                'name' => 'Dr. Obed Tanda', 'slug' => 'dr-obed-tanda',
                'school' => 'SBE', 'dept' => 'Department of Business Administration & Management',
                'designation' => 'Chair, Department of Business Administration & Management', 'email' => null,
            ],
            [
                'name' => 'Dr. Fozia Nurwin', 'slug' => 'dr-fozia-nurwin',
                'school' => 'SBE', 'dept' => 'Department of Business Administration & Management',
                'designation' => 'Senior Lecturer', 'email' => null,
            ],
            [
                'name' => 'Dr. Mackton', 'slug' => 'dr-mackton',
                'school' => 'SBE', 'dept' => 'Department of Economics',
                'designation' => 'Chair, Department of Economics', 'email' => null,
            ],
            [
                'name' => 'Dr. Ouma', 'slug' => 'dr-ouma',
                'school' => 'SBE', 'dept' => 'Department of Economics',
                'designation' => 'Senior Lecturer', 'email' => null,
            ],
            [
                'name' => 'Dr. Emily M. Okwemba', 'slug' => 'dr-emily-m-okwemba',
                'school' => 'SBE', 'dept' => 'Department of Accounting & Finance',
                'designation' => 'Senior Lecturer', 'email' => null,
            ],
            [
                'name' => 'Dr. Shavulimo', 'slug' => 'dr-shavulimo',
                'school' => 'SBE', 'dept' => 'Department of Business Administration & Management',
                'designation' => 'Lecturer', 'email' => null,
            ],

            // ── Open Distance & e-Learning (ODEL) ─────────────────────────────
            [
                'name' => 'Ms. Mercy Bonareri', 'slug' => 'ms-mercy-bonareri',
                'school' => 'ODEL', 'dept' => 'Open Distance & e-Learning',
                'designation' => 'ODeL Technical Coordinator', 'email' => null,
            ],
            [
                'name' => 'Mr. Boris', 'slug' => 'mr-boris',
                'school' => 'ODEL', 'dept' => 'Open Distance & e-Learning',
                'designation' => 'ODeL Technical Support Officer', 'email' => null,
            ],
        ];

        foreach ($newStaff as $s) {
            $exists = DB::table('cms_content')
                ->where('type', 'staff_profile')
                ->where('slug', $s['slug'])
                ->exists();
            if ($exists) continue;

            DB::table('cms_content')->insert([
                'type'            => 'staff_profile',
                'title'           => $s['name'],
                'slug'            => $s['slug'],
                'school_code'     => $s['school'],
                'department'      => $s['dept'],
                'status'          => 'published',
                'is_deleted'      => false,
                'author_id'       => $authorId,
                'structured_data' => json_encode([
                    'designation' => $s['designation'],
                    'email'       => $s['email'],
                    'photo'       => null,
                    'specializations' => [],
                ]),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
