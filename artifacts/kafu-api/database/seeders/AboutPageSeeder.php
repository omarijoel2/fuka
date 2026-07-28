<?php

namespace Database\Seeders;

use App\Models\SiteConfig;
use Illuminate\Database\Seeder;

/**
 * Recreates the About Us page content (hero, history, mission/vision,
 * VC profile including the full "Read more" bio, core values, sidebar stats).
 *
 * NOTE: unlike SiteConfigSeeder this seeder ALWAYS overwrites the 'about'
 * group so the live server ends up matching the content authored in dev.
 *
 * Run with: php artisan db:seed --class=AboutPageSeeder
 */
class AboutPageSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(<<<'JSON'
{
  "hero_heading": "About KAFU",
  "hero_description": "Discover the history, mission, and vision of Kaimosi Friends University — a Quaker-founded institution at the heart of Western Kenya.",
  "hero_image_url": "/images/uploads/IMG_8696.jpg",
  "history_heading": "Our History",
  "history_p1": "Kaimosi Friends University (KAFU) was established in 2014, rooted deeply in the Quaker heritage of truth and service. What began as a constituent college has rapidly grown into a fully-fledged, independent public university in Western Kenya.",
  "history_p2": "The university stands as a testament to the pioneering educational efforts of the Friends Church (Quakers) in the region. Since its inception, KAFU has been dedicated to providing quality higher education, fostering research, and promoting innovation that addresses societal needs.",
  "history_p3": "Today, KAFU serves thousands of students across its five distinct schools, offering over 38 academic programmes ranging from certificates to doctoral degrees.",
  "vision": "To be a premier university in training, research, innovation and community service.",
  "mission": "To provide quality education and training, promote research and innovation for sustainable development.",
  "quaker_heritage": "KAFU draws from the rich Quaker tradition of Friends Church East Africa, which established the first school at Kaimosi in 1902. This heritage of service, integrity, and education without discrimination remains at the core of every programme, policy, and partnership the university pursues.",
  "vc_name": "Prof. Peter Nyamuhanga Mwita",
  "vc_title": "Vice-Chancellor",
  "vc_bio": "Prof. Mwita was officially appointed Vice-Chancellor of Kaimosi Friends University on 14 May 2025, having served in an acting capacity since February 2024. Under his leadership, KAFU continues to advance its mission of quality education, research, and community engagement.",
  "vc_email": "vc@kafu.ac.ke",
  "vc_photo_url": "/images/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg",
  "core_values": [
    "Integrity and Professionalism",
    "Quality and Excellence",
    "Equity and Inclusivity",
    "Innovation and Creativity",
    "Teamwork and Collaboration"
  ],
  "sidebar_stats": [
    {
      "label": "Location",
      "value": "Kaimosi, Western Kenya"
    },
    {
      "label": "Academic Breadth",
      "value": "5 Schools, 38+ Programmes"
    },
    {
      "label": "Founded",
      "value": "2014"
    },
    {
      "label": "Programmes",
      "value": "Certificate to PhD level"
    },
    {
      "label": "Unique Offering",
      "value": "One of 2 universities in Kenya offering Optometry to PhD"
    }
  ],
  "vc_bio_full": "Prof. Mwita holds a Ph.D. in Statistics from Technische Universitat Kaiserslautern (Germany), a Master of Applied Statistics from Macquarie University (Australia), and a BSc (Statistics Major) with First Class Honours from Kenyatta University. His academic career includes senior leadership roles such as Deputy Vice-Chancellor (Research, Innovation & Linkages) at Machakos University, Dean of the School of Mathematical Sciences at JKUAT, and Chairman of the Department of Statistics and Actuarial Sciences.\n\nA respected scholar, Prof. Mwita has published widely in statistics, supervised numerous postgraduate students, and led major research initiatives. He was instrumental in establishing the UNESCO Chair on Cloud Computing for Sustainable Development, strengthening Kenya's capacity in data-driven innovation and sustainability research. Nationally, as Chairman of the Kenya National Bureau of Statistics, he played a pivotal role in the restructuring of the Bureau.\n\nProf. Mwita is also widely recognized as a mentor and builder of talent. He has guided generations of young scholars, researchers, and professionals, and has championed institutional initiatives that expand youth opportunities. These include the Luban Workshop, the Ajiry Centre, and the STEM Centre, all of which strengthen technical skills, digital competencies, and innovation capacity among Kenyan youth.\n\nAt KAFU, Prof. Mwita is implementing a forward-looking vision anchored in quality teaching, robust research systems, fiscal discipline, and strong governance. He is actively building partnerships with national and county governments, industry, and development agencies to position the university as a centre of excellence in Kenya and a catalyst for regional socio-economic transformation.\n\nProf. Mwita is known for his integrity, strategic clarity, calm leadership style, and unwavering dedication to academic and national progress. His career reflects a deep commitment to scholarship, mentorship, and the development of institutions that empower communities and shape Kenya's future."
}
JSON, true);

        if (!is_array($data) || empty($data['vc_bio_full'])) {
            throw new \RuntimeException('AboutPageSeeder: embedded JSON failed to decode.');
        }

        SiteConfig::setGroup('about', $data);

        $this->command?->info('About page content seeded (' . count($data) . ' fields, full VC bio included).');
    }
}
