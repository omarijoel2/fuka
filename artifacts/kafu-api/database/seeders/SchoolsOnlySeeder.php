<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CmsContent;
use Carbon\Carbon;

/**
 * Standalone seeder — inserts only the 5 KAFU schools into cms_content.
 * Safe to run on a live database: skips any school whose slug already exists.
 *
 * Usage:
 *   php artisan db:seed --class=SchoolsOnlySeeder
 */
class SchoolsOnlySeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $schools = [
            [
                'code'           => 'SESS',
                'name'           => 'School of Education and Social Sciences',
                'dean'           => 'Dr. Nabeta K.N. Sangili',
                'dean_title'     => 'Dean, School of Education and Social Sciences',
                'dean_photo'     => '/imgs/staff/Dr.-Sangili.jpg',
                'colour'         => '#1B3A6B',
                'description'    => 'SESS offers programmes in teacher education, social work, criminology, disaster management, and social sciences.',
                'vision'         => 'To be a centre of excellence in Education and Social Sciences in Africa.',
                'mission'        => 'To provide quality education through teaching, research, and community engagement.',
                'undergrad_count' => 7,
                'postgrad_count'  => 7,
                'doctoral_count'  => 2,
            ],
            [
                'code'           => 'SBE',
                'name'           => 'School of Business & Economics',
                'dean'           => 'Dr. Atieno Margaret Otieno',
                'dean_title'     => 'Dean, School of Business & Economics',
                'dean_photo'     => '/imgs/staff/Dr.-Atieno.jpg',
                'colour'         => '#D4A017',
                'description'    => 'SBE empowers students to become transformative leaders and responsible professionals.',
                'vision'         => 'To be a centre of excellence in teaching professional and market driven courses.',
                'mission'        => 'To provide professional and market driven courses that enable graduates fit in the labour market.',
                'undergrad_count' => 3,
                'postgrad_count'  => 2,
                'doctoral_count'  => 1,
            ],
            [
                'code'           => 'SCIT',
                'name'           => 'School of Computing and Information Technology',
                'dean'           => 'Prof. Kelvin K. Omieno',
                'dean_title'     => 'Dean, School of Computing and Information Technology',
                'dean_photo'     => null,
                'colour'         => '#0D6EFD',
                'description'    => 'SCIT trains solution-oriented ICT experts capable of transforming the digital economy locally and globally.',
                'vision'         => 'To be a center of excellence in teaching, research, and innovation in computing and information technology for sustainable development.',
                'mission'        => 'To provide quality education in computing and IT through innovative teaching, research, and industry engagement.',
                'undergrad_count' => 2,
                'postgrad_count'  => 1,
                'doctoral_count'  => 0,
            ],
            [
                'code'           => 'SOS',
                'name'           => 'School of Science',
                'dean'           => 'Dr. Annette O. Busula',
                'dean_title'     => 'Dean, School of Science',
                'dean_photo'     => null,
                'colour'         => '#198754',
                'description'    => 'SOS offers rigorous science programmes spanning physics, chemistry, biology, mathematics, and statistics.',
                'vision'         => 'To be a centre of excellence in scientific research and education.',
                'mission'        => 'To provide quality science education through teaching, research, and innovation.',
                'undergrad_count' => 7,
                'postgrad_count'  => 4,
                'doctoral_count'  => 0,
            ],
            [
                'code'           => 'SHS',
                'name'           => 'School of Health Sciences',
                'dean'           => 'Dr. Cyprian Mabonga',
                'dean_title'     => 'Dean, School of Health Sciences',
                'dean_photo'     => '/imgs/staff/Dr.-Mabonga.jpg',
                'colour'         => '#8B1A1A',
                'description'    => 'Established in 2022, SHS is one of only two institutions in Kenya offering Optometry up to PhD level.',
                'vision'         => 'To be a centre of excellence in health sciences education and research in East and Central Africa.',
                'mission'        => 'To train competent health professionals through quality education, research, and clinical practice.',
                'undergrad_count' => 3,
                'postgrad_count'  => 0,
                'doctoral_count'  => 0,
            ],
        ];

        $inserted = 0;
        $skipped  = 0;

        foreach ($schools as $s) {
            $slug = strtolower($s['code']);

            if (CmsContent::where('slug', $slug)->exists()) {
                $this->command->line("  Skipped (already exists): {$slug}");
                $skipped++;
                continue;
            }

            CmsContent::create([
                'type'            => 'school',
                'slug'            => $slug,
                'school_code'     => $s['code'],
                'title'           => $s['name'],
                'summary'         => $s['description'],
                'body'            => $s['description'],
                'status'          => 'published',
                'published_at'    => $now,
                'is_deleted'      => false,
                'author_id'       => 1,
                'structured_data' => [
                    'dean'             => $s['dean'],
                    'dean_title'       => $s['dean_title'],
                    'dean_photo'       => $s['dean_photo'],
                    'colour'           => $s['colour'],
                    'vision'           => $s['vision'],
                    'mission'          => $s['mission'],
                    'programmes_count' => [
                        'undergraduate' => $s['undergrad_count'],
                        'postgraduate'  => $s['postgrad_count'],
                        'doctoral'      => $s['doctoral_count'],
                    ],
                ],
            ]);

            $this->command->info("  Inserted: {$s['name']} ({$slug})");
            $inserted++;
        }

        $this->command->info("Schools seeded: {$inserted} inserted, {$skipped} skipped.");
    }
}
