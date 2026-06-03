<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NoticesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('notices')->truncate();

        $notices = [
            [
                'title'       => 'Vice-Chancellor Circular No. 3/2026 — Academic Integrity Policy',
                'description' => 'All staff and students are required to adhere to the revised Academic Integrity Policy effective 1st July 2026.',
                'category'    => 'circular',
                'file_url'    => null,
                'file_name'   => null,
                'file_size'   => null,
                'issued_date' => '2026-05-30',
                'is_active'   => true,
            ],
            [
                'title'       => 'Memo: Senate Meeting — 15th June 2026',
                'description' => 'The Senate will convene on 15th June 2026 at 9:00 AM in the Council Chamber. All members are required to attend.',
                'category'    => 'memo',
                'file_url'    => null,
                'file_name'   => null,
                'file_size'   => null,
                'issued_date' => '2026-05-28',
                'is_active'   => true,
            ],
            [
                'title'       => 'Notice: Revised Semester 2 Examination Timetable',
                'description' => 'The revised examination timetable for Semester 2, 2025/2026 academic year has been released. Students are advised to check the portal.',
                'category'    => 'notice',
                'file_url'    => null,
                'file_name'   => null,
                'file_size'   => null,
                'issued_date' => '2026-05-25',
                'is_active'   => true,
            ],
            [
                'title'       => 'Staff Advisory: Transition to New ERP System',
                'description' => 'The ICT Directorate announces the go-live date for the new ERP system as 1st August 2026. Training sessions are scheduled for all departments.',
                'category'    => 'announcement',
                'file_url'    => null,
                'file_name'   => null,
                'file_size'   => null,
                'issued_date' => '2026-05-20',
                'is_active'   => true,
            ],
            [
                'title'       => 'Policy Update: Research Grants and IP Rights',
                'description' => 'The Research and Innovation Policy has been updated to reflect new guidelines on intellectual property rights arising from university-funded research.',
                'category'    => 'policy',
                'file_url'    => null,
                'file_name'   => null,
                'file_size'   => null,
                'issued_date' => '2026-05-15',
                'is_active'   => true,
            ],
            [
                'title'       => 'Memo: Public Holiday Arrangements — Madaraka Day 2026',
                'description' => 'Staff are reminded that 1st June 2026 is a public holiday. Critical services will operate on skeleton staff as per departmental arrangements.',
                'category'    => 'memo',
                'file_url'    => null,
                'file_name'   => null,
                'file_size'   => null,
                'issued_date' => '2026-05-10',
                'is_active'   => true,
            ],
            [
                'title'       => 'Circular: Updated Staff Leave Application Procedures',
                'description' => 'Effective immediately, all leave applications must be submitted through the HRMS portal at least 7 working days in advance.',
                'category'    => 'circular',
                'file_url'    => null,
                'file_name'   => null,
                'file_size'   => null,
                'issued_date' => '2026-05-05',
                'is_active'   => true,
            ],
            [
                'title'       => 'Notice: Library Extended Hours During Examination Period',
                'description' => 'The university library will operate extended hours (7:00 AM – 10:00 PM) from 10th June to 10th July 2026 to support students during exams.',
                'category'    => 'notice',
                'file_url'    => null,
                'file_name'   => null,
                'file_size'   => null,
                'issued_date' => '2026-05-01',
                'is_active'   => true,
            ],
        ];

        foreach ($notices as $notice) {
            DB::table('notices')->insert(array_merge($notice, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
