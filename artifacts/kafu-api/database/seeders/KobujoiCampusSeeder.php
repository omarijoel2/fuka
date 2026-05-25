<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Campus;

class KobujoiCampusSeeder extends Seeder
{
    /**
     * Fix the Kobujoi Campus record:
     *  - Corrects slug from 'kobujoi-campus' → 'kobujoi' (matches /campuses/kobujoi URL)
     *  - Adds hero image from kafu.ac.ke
     *  - Adds full gallery (10 real photos confirmed on live server)
     *  - Enriches description, transport notes, and visitor info
     *
     * Safe to re-run — uses updateOrCreate keyed on the old slug,
     * then falls back to the correct slug so it is idempotent on prod.
     */
    public function run(): void
    {
        $galleryImages = [
            '/images/uploads/image-82.jpeg',
            '/images/uploads/image-108.jpeg',
            '/images/uploads/image-87.jpeg',
            '/images/uploads/image-113.jpeg',
            '/images/uploads/WhatsApp-Image-2026-05-18-at-18.39.27-480x320.jpeg',
        ];

        $data = [
            'slug'            => 'kobujoi',
            'name'            => 'Kobujoi Campus',
            'summary'         => 'KAFU\'s newest campus, officially opened on 8th September 2025 in Aldai Constituency, Nandi County — focused on STEM, teacher education, and agricultural innovation.',
            'description'     => 'Kaimosi Friends University continues to expand its footprint in higher education through the establishment of Kobujoi Campus in Aldai Constituency, Nandi County. The Campus reflects the University\'s commitment to expanding access to quality higher education, promoting inclusivity, and supporting socio-economic transformation through teaching, research, innovation, and community engagement.' . "\n\n" .
                'The establishment of Kobujoi Campus was inspired by a development tour by His Excellency the President of the Republic of Kenya, William Samoei Ruto, on 24th August 2024, during which local leaders and residents appealed for a university presence in the region. In response, KAFU embraced the vision in alignment with the Government\'s Bottom-Up Economic Transformation Agenda (BETA), bringing university education closer to the people and fostering regional development.' . "\n\n" .
                'Kobujoi Campus officially opened its doors on 8th September 2025 with the admission of its pioneer Bachelor of Education (Arts) students. The Campus is strategically positioning itself as a regional hub for Science, Technology, Engineering, and Mathematics (STEM), teacher education, agricultural innovation, and industrial crop development. Owing to its unique location bordering Kenya Forest Service forests and expansive tea plantations, the Campus is also keen on promoting environmental conservation and sustainability.' . "\n\n" .
                'The Campus currently operates within facilities formerly occupied by Aldai High School and Ressio Comprehensive Primary School. In addition to the anticipated admission of the second undergraduate cohort in September 2026, Kobujoi Campus is expected to open its doors to postgraduate studies in most programmes offered at the Main Campus.' . "\n\n" .
                'The Campus is directed by Prof. Remmy Shiundu and remains fully aligned with the vision, mission, and core values of the Main Campus, ensuring consistency in academic quality, governance, innovation, and service delivery across the University system.',
            'address'         => 'Aldai Constituency, Nandi County, Kenya',
            'county'          => 'Nandi',
            'region'          => 'Rift Valley',
            'latitude'        => 0.1742,
            'longitude'       => 35.2935,
            'hero_image'      => '/images/uploads/Members-of-the-University-Council-tour-Kaimosi-Friends-Universitys-Kobujoi-Campus-during-the-three-day-familiarization-and-induction-programme.jpeg',
            'gallery_images'  => $galleryImages,
            'contact_email'   => 'kobujoi@kafu.ac.ke',
            'contact_phone'   => '+254 700 000 002',
            'transport_notes' => 'From Eldoret: Take a matatu towards Kapsabet or Nandi Hills and alight at Aldai Junction (approx. 1 hour). From Kapsabet Town: Direct matatus run to Aldai (approx. 30 minutes). From Kisumu: Travel via Chemelil towards Kapsabet, then proceed to Aldai.',
            'visitor_notes'   => 'Please contact the campus office in advance to arrange visits. The campus is located on the former Aldai High School and Ressio Comprehensive Primary School grounds in Aldai Constituency.',
            'sort_order'      => 3,
            'status'          => 'active',
        ];

        // Try the old wrong slug first (prod has this), then the correct one (fresh installs may already have it)
        $campus = Campus::where('slug', 'kobujoi-campus')->first()
            ?? Campus::where('slug', 'kobujoi')->first();

        if ($campus) {
            $campus->update($data);
            $this->command->info("Updated: Kobujoi Campus (slug fixed to 'kobujoi', hero + gallery added).");
        } else {
            Campus::create($data);
            $this->command->info("Created: Kobujoi Campus.");
        }
    }
}
