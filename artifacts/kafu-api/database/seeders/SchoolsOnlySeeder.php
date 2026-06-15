<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CmsContent;
use Carbon\Carbon;

/**
 * Standalone seeder — upserts all 7 KAFU school/directorate entries in cms_content.
 * Safe to run on both fresh and live databases:
 *   - Fresh DB: inserts all records.
 *   - Live DB:  merges updated fields into existing structured_data without
 *               clobbering unrelated keys set by the CMS.
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
            // ── Academic Schools ─────────────────────────────────────────────
            [
                'code'           => 'SESS',
                'name'           => 'School of Education and Social Sciences',
                'dean'           => 'Dr. Nabeta K.N. Sangili',
                'dean_title'     => 'Dean, School of Education and Social Sciences',
                'dean_photo'     => '/imgs/dean-sangili.jpg',
                'colour'         => '#1B3A6B',
                'description'    => 'SESS offers programmes in teacher education, social work, criminology, disaster management, and social sciences.',
                'vision'         => 'To be a centre of excellence in Education and Social Sciences in Africa.',
                'mission'        => 'To provide quality education through teaching, research, and community engagement.',
                'undergrad_count' => 7,
                'postgrad_count'  => 7,
                'doctoral_count'  => 2,
                'href'           => null,
                'code_aliases'   => ['SOE'],
            ],
            [
                'code'           => 'SBE',
                'name'           => 'School of Business & Economics',
                'dean'           => 'Dr. Atieno Margaret Omondi',
                'dean_title'     => 'Dean, School of Business & Economics',
                'dean_photo'     => '/imgs/dean-atieno.jpg',
                'colour'         => '#D4A017',
                'description'    => 'SBE empowers students to become transformative leaders and responsible professionals.',
                'vision'         => 'To be a centre of excellence in teaching professional and market driven courses.',
                'mission'        => 'To provide professional and market driven courses that enable graduates fit in the labour market.',
                'undergrad_count' => 6,
                'postgrad_count'  => 2,
                'doctoral_count'  => 1,
                'href'           => null,
                'code_aliases'   => ['SOBE'],
            ],
            [
                'code'           => 'SCIT',
                'name'           => 'School of Computing and Information Technology',
                'dean'           => 'Prof. Kelvin K. Omieno',
                'dean_title'     => 'Dean, School of Computing and Information Technology',
                'dean_photo'     => '/imgs/dean-omieno.jpg',
                'colour'         => '#0D6EFD',
                'description'    => 'SCIT trains solution-oriented ICT experts capable of transforming the digital economy locally and globally.',
                'vision'         => 'To be a center of excellence in teaching, research, and innovation in computing and information technology for sustainable development.',
                'mission'        => 'To provide quality education in computing and IT through innovative teaching, research, and industry engagement.',
                'undergrad_count' => 2,
                'postgrad_count'  => 1,
                'doctoral_count'  => 0,
                'href'           => null,
            ],
            [
                'code'           => 'SOS',
                'name'           => 'School of Science',
                'dean'           => 'Dr. Annette O. Busula',
                'dean_title'     => 'Dean, School of Science',
                'dean_photo'     => '/imgs/dean-busula.jpg',
                'colour'         => '#198754',
                'description'    => 'SOS offers rigorous science programmes spanning physics, chemistry, biology, mathematics, and statistics.',
                'vision'         => 'To be a centre of excellence in scientific research and education.',
                'mission'        => 'To provide quality science education through teaching, research, and innovation.',
                'undergrad_count' => 7,
                'postgrad_count'  => 4,
                'doctoral_count'  => 0,
                'href'           => null,
                'code_aliases'   => ['SOSCI'],
            ],
            [
                'code'           => 'SHS',
                'name'           => 'School of Health Sciences',
                'dean'           => 'Dr. Cyprian Mabonga',
                'dean_title'     => 'Dean, School of Health Sciences',
                'dean_photo'     => '/imgs/dean-mabonga.png',
                'colour'         => '#8B1A1A',
                'description'    => 'Established in 2022, SHS is one of only two institutions in Kenya offering Optometry up to PhD level.',
                'vision'         => 'To be a centre of excellence in health sciences education and research in East and Central Africa.',
                'mission'        => 'To train competent health professionals through quality education, research, and clinical practice.',
                'undergrad_count' => 3,
                'postgrad_count'  => 0,
                'doctoral_count'  => 0,
                'href'           => null,
                'code_aliases'   => ['SOHS'],
            ],
            // ── Directorates & Campuses ──────────────────────────────────────
            [
                'code'           => 'ODEL',
                'name'           => 'Directorate of Open, Distance and E-Learning',
                'dean'           => 'Dr. Hillan Ronoh',
                'dean_title'     => 'Director, ODeL',
                'dean_photo'     => '/imgs/dir-ronoh.jpg',
                'colour'         => '#2D6A4F',
                'description'    => "KAFU's ODeL Directorate dismantles classroom barriers through accessibility, flexibility, and innovation — delivering the same academic rigour to distance learners as on-campus students, regardless of location or schedule.",
                'vision'         => 'To be a leading centre for flexible and inclusive higher education in Eastern Africa.',
                'mission'        => 'To provide accessible, quality education to all through open, distance and e-learning modalities.',
                'undergrad_count' => 0,
                'postgrad_count'  => 0,
                'doctoral_count'  => 0,
                'href'           => '/directorates/open-distance-elearning',
            ],
            [
                'code'           => 'KOBUJOI',
                'name'           => 'Kobujoi Campus',
                'dean'           => 'Prof. Remmy Shiundu',
                'dean_title'     => 'Director, Kobujoi Campus',
                'dean_photo'     => '/imgs/dir-shiundu.jpg',
                'colour'         => '#5B4FCF',
                'description'    => "Established in 2025 in Aldai Constituency, Nandi County, Kobujoi Campus is KAFU's newest centre — positioning itself as a regional hub for STEM, teacher education, agricultural innovation, and industrial crop development.",
                'vision'         => 'To be a regional centre of excellence driving sustainable development in Nandi County and beyond.',
                'mission'        => 'To provide quality higher education and community-focused programmes that address the development needs of Western Kenya.',
                'undergrad_count' => 1,
                'postgrad_count'  => 0,
                'doctoral_count'  => 0,
                'href'           => '/campuses/kobujoi',
            ],
        ];

        $inserted = 0;
        $updated  = 0;

        foreach ($schools as $s) {
            $slug    = strtolower($s['code']);
            $newSd   = [
                'dean'             => $s['dean'],
                'dean_title'       => $s['dean_title'],
                'dean_photo'       => $s['dean_photo'],
                'colour'           => $s['colour'],
                'vision'           => $s['vision'],
                'mission'          => $s['mission'],
                'href'             => $s['href'],
                'programmes_count' => [
                    'undergraduate' => $s['undergrad_count'],
                    'postgraduate'  => $s['postgrad_count'],
                    'doctoral'      => $s['doctoral_count'],
                ],
                'code_aliases'     => $s['code_aliases'] ?? [],
            ];

            $existing = CmsContent::where('slug', $slug)->first();

            if ($existing) {
                // Merge — preserve any CMS-managed keys not in our set
                $existing_sd = is_array($existing->structured_data)
                    ? $existing->structured_data
                    : (array) json_decode($existing->structured_data, true);
                $merged = array_merge($existing_sd, $newSd);
                $existing->update([
                    'title'           => $s['name'],
                    'summary'         => $s['description'],
                    'structured_data' => $merged,
                    'updated_at'      => $now,
                ]);
                $this->command->line("  Updated : {$s['name']} ({$slug})");
                $updated++;
            } else {
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
                    'structured_data' => $newSd,
                ]);
                $this->command->info("  Inserted: {$s['name']} ({$slug})");
                $inserted++;
            }
        }

        $this->command->info("Schools done — {$inserted} inserted, {$updated} updated.");
    }
}
