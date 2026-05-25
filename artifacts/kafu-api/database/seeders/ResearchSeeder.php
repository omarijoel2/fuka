<?php

namespace Database\Seeders;

use App\Models\ResearchTheme;
use App\Models\ResearchProject;
use App\Models\Publication;
use App\Models\ResearchGrant;
use App\Models\ResearchPartner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ResearchSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedThemes();
        $this->seedProjects();
        $this->seedPublications();
        $this->seedGrants();
        $this->seedPartners();
    }

    private function seedThemes(): void
    {
        $themes = [
            [
                'name' => 'Health Sciences & Public Health',
                'slug' => 'health-sciences',
                'description' => 'Research in community health, epidemiology, health systems strengthening, maternal and child health, disease prevention, and health promotion in underserved communities.',
                'sdg_goals' => [3, 10],
                'colour' => '#E63946',
                'icon' => 'heart-pulse',
                'sort_order' => 1,
            ],
            [
                'name' => 'Agriculture, Food Security & Environment',
                'slug' => 'agriculture-food-security',
                'description' => 'Research on sustainable agriculture, food systems, soil science, agroforestry, climate-smart farming, and post-harvest technology in the Lake Victoria basin and Western Kenya region.',
                'sdg_goals' => [2, 13, 15],
                'colour' => '#2D9D4C',
                'icon' => 'sprout',
                'sort_order' => 2,
            ],
            [
                'name' => 'Information & Communication Technology',
                'slug' => 'information-communication-technology',
                'description' => 'Research in software engineering, artificial intelligence, cybersecurity, e-government, digital health, mobile technologies, and ICT for development.',
                'sdg_goals' => [9, 17],
                'colour' => '#2B72C1',
                'icon' => 'cpu',
                'sort_order' => 3,
            ],
            [
                'name' => 'Education, Social Sciences & Governance',
                'slug' => 'education-social-sciences',
                'description' => 'Research on pedagogy, curriculum development, teacher education, peace and conflict studies, social welfare, governance, and public policy in East Africa.',
                'sdg_goals' => [4, 16],
                'colour' => '#C9A227',
                'icon' => 'book-open',
                'sort_order' => 4,
            ],
            [
                'name' => 'Business, Economics & Entrepreneurship',
                'slug' => 'business-economics-entrepreneurship',
                'description' => 'Research on SME development, financial inclusion, cooperative management, trade, economic growth, supply chain, and entrepreneurship in developing economies.',
                'sdg_goals' => [8, 10],
                'colour' => '#6C3FCB',
                'icon' => 'trending-up',
                'sort_order' => 5,
            ],
            [
                'name' => 'Climate Change & Natural Resources',
                'slug' => 'climate-change-natural-resources',
                'description' => 'Research on climate change adaptation and mitigation, water resources management, renewable energy, biodiversity conservation, and environmental policy.',
                'sdg_goals' => [6, 7, 13, 14, 15],
                'colour' => '#1A7A9A',
                'icon' => 'leaf',
                'sort_order' => 6,
            ],
        ];

        foreach ($themes as $t) {
            ResearchTheme::firstOrCreate(['slug' => $t['slug']], $t);
        }
    }

    private function seedProjects(): void
    {
        $themes = ResearchTheme::all()->keyBy('slug');

        $projects = [
            [
                'title' => 'Smart Digital Tools for Public Service Delivery in Western Kenya',
                'slug' => 'smart-digital-tools-public-service-delivery',
                'abstract' => 'This project develops and deploys a suite of citizen-facing digital tools to streamline service delivery in county governments across Western Kenya, including a complaints management portal and an IoT-based smart queue management system. Pilot implementation at Vihiga County Huduma Centre has demonstrated a 60% reduction in service waiting times.',
                'department' => 'School of Computing and Information Technology',
                'lead_researcher_slug' => 'dr-kelvin-omieno',
                'lead_researcher_name' => 'Prof. Kelvin K. Omieno',
                'co_researchers' => [
                    ['name' => 'Dr. Faith Abuya', 'slug' => 'dr-faith-abuya'],
                    ['name' => 'Mr. Isaac Simiyu', 'slug' => 'mr-isaac-simiyu'],
                ],
                'theme_id' => $themes->get('information-communication-technology')?->id,
                'status' => 'active',
                'start_date' => '2024-03-01',
                'end_date' => '2026-02-28',
                'funding_source' => 'Government of Kenya — ICT Authority',
                'budget' => 4500000,
                'currency' => 'KES',
                'sdg_goals' => [9, 11, 16],
                'featured_image_url' => '/images/uploads/campus-1-scaled.jpg',
                'is_featured' => true,
            ],
            [
                'title' => 'Community Health Workers Effectiveness in Vihiga County: A Mixed-Methods Study',
                'slug' => 'community-health-workers-vihiga-county',
                'abstract' => 'This study evaluates the effectiveness of community health workers (CHWs) in improving health outcomes in Vihiga County, focusing on maternal and child health, malaria prevention, and chronic disease management. The research employs a mixed-methods design combining household surveys (n=600), in-depth interviews, and health facility data.',
                'department' => 'School of Health Sciences',
                'lead_researcher_slug' => 'dr-beatrice-naliaka',
                'lead_researcher_name' => 'Dr. Beatrice Naliaka',
                'co_researchers' => [
                    ['name' => 'Dr. James Ochieng', 'slug' => 'dr-james-ochieng'],
                ],
                'theme_id' => $themes->get('health-sciences')?->id,
                'status' => 'completed',
                'start_date' => '2023-01-01',
                'end_date' => '2024-12-31',
                'funding_source' => 'AMREF Health Africa',
                'budget' => 2800000,
                'currency' => 'KES',
                'sdg_goals' => [3],
                'is_featured' => false,
            ],
            [
                'title' => 'Agroforestry and Soil Health Restoration in Tea-Growing Smallholder Farms, Western Kenya',
                'slug' => 'agroforestry-soil-health-western-kenya',
                'abstract' => 'This research investigates the impact of indigenous agroforestry systems on soil fertility restoration and income diversification among small-scale tea farmers in Vihiga, Kisii, and Kericho counties. The study integrates soil physicochemical analysis, biodiversity inventories, and farmer participatory research.',
                'department' => 'School of Science and Natural Resources',
                'lead_researcher_slug' => 'dr-esther-luvanda',
                'lead_researcher_name' => 'Dr. Esther Luvanda',
                'co_researchers' => [
                    ['name' => 'Dr. Robert Omuya', 'slug' => 'dr-robert-omuya'],
                    ['name' => 'Ms. Grace Atema', 'slug' => 'ms-grace-atema'],
                ],
                'theme_id' => $themes->get('agriculture-food-security')?->id,
                'status' => 'active',
                'start_date' => '2025-01-01',
                'end_date' => '2027-12-31',
                'funding_source' => 'World Agroforestry Centre (ICRAF) / African Development Bank',
                'budget' => 8500000,
                'currency' => 'KES',
                'sdg_goals' => [2, 13, 15],
                'is_featured' => true,
            ],
            [
                'title' => 'Teacher Preparedness for Competency-Based Curriculum (CBC) in Western Kenya Primary Schools',
                'slug' => 'teacher-preparedness-cbc-western-kenya',
                'abstract' => 'This study assesses the readiness of primary school teachers in Western Kenya to implement the Competency-Based Curriculum (CBC) introduced by the Kenya Institute of Curriculum Development. Research covers teacher training, resource availability, parental engagement, and assessment competences across three counties.',
                'department' => 'School of Education and Social Sciences',
                'lead_researcher_slug' => 'dr-margaret-wanyonyi',
                'lead_researcher_name' => 'Dr. Margaret Wanyonyi',
                'co_researchers' => [
                    ['name' => 'Prof. Joshua Sirengo', 'slug' => 'prof-joshua-sirengo'],
                ],
                'theme_id' => $themes->get('education-social-sciences')?->id,
                'status' => 'completed',
                'start_date' => '2022-09-01',
                'end_date' => '2024-08-31',
                'funding_source' => 'Kenya National Research Fund (NRF)',
                'budget' => 1800000,
                'currency' => 'KES',
                'sdg_goals' => [4],
                'is_featured' => false,
            ],
            [
                'title' => 'Fintech and Financial Inclusion Among Youth in Western Kenya',
                'slug' => 'fintech-financial-inclusion-youth-western-kenya',
                'abstract' => 'This research examines how mobile money platforms and fintech innovations are transforming financial access for youth entrepreneurs in Western Kenya. The study explores usage patterns, barriers to adoption, entrepreneurial outcomes, and regulatory implications using a survey of 800 youth aged 18–35 across Vihiga, Kakamega, and Kisumu counties.',
                'department' => 'School of Business and Economics',
                'lead_researcher_slug' => 'dr-victor-mwinzi',
                'lead_researcher_name' => 'Dr. Victor Mwinzi',
                'co_researchers' => [
                    ['name' => 'Dr. Lilian Barasa', 'slug' => 'dr-lilian-barasa'],
                ],
                'theme_id' => $themes->get('business-economics-entrepreneurship')?->id,
                'status' => 'active',
                'start_date' => '2024-06-01',
                'end_date' => '2026-05-31',
                'funding_source' => 'FSD Kenya / Bill & Melinda Gates Foundation',
                'budget' => 3200000,
                'currency' => 'KES',
                'sdg_goals' => [8, 10],
                'is_featured' => false,
            ],
            [
                'title' => 'Lake Victoria Water Quality and Community Health Risks in Vihiga County',
                'slug' => 'lake-victoria-water-quality-vihiga',
                'abstract' => 'This interdisciplinary study assesses water quality parameters in rivers and water points feeding into Lake Victoria from Vihiga County, and links physicochemical and microbiological contamination data to documented community health risks including waterborne diseases. The research informs evidence-based WASH policy recommendations.',
                'department' => 'School of Science and Natural Resources',
                'lead_researcher_slug' => 'dr-henry-simiyu',
                'lead_researcher_name' => 'Dr. Henry Simiyu',
                'co_researchers' => [
                    ['name' => 'Dr. Beatrice Naliaka', 'slug' => 'dr-beatrice-naliaka'],
                    ['name' => 'Dr. Collins Mutai', 'slug' => 'dr-collins-mutai'],
                ],
                'theme_id' => $themes->get('climate-change-natural-resources')?->id,
                'status' => 'active',
                'start_date' => '2025-03-01',
                'end_date' => '2027-02-28',
                'funding_source' => 'USAID / Water and Sanitation for the Urban Poor (WSUP)',
                'budget' => 6200000,
                'currency' => 'KES',
                'sdg_goals' => [3, 6, 14],
                'is_featured' => true,
            ],
        ];

        foreach ($projects as $p) {
            ResearchProject::firstOrCreate(['slug' => $p['slug']], $p);
        }
    }

    private function seedPublications(): void
    {
        $projects = ResearchProject::all()->keyBy('slug');

        $publications = [
            [
                'title' => 'Citizen-Facing Digital Portals and Service Delivery Efficiency in Kenyan County Governments: An Empirical Analysis',
                'slug' => 'citizen-digital-portals-service-delivery-kenya',
                'authors' => [
                    ['name' => 'Kelvin K. Omieno', 'first_initial' => 'K.K.', 'last_name' => 'Omieno', 'affiliation' => 'KAFU'],
                    ['name' => 'Faith Abuya', 'first_initial' => 'F.', 'last_name' => 'Abuya', 'affiliation' => 'KAFU'],
                ],
                'year' => 2025,
                'journal' => 'Journal of E-Government Studies and Best Practices',
                'publisher' => 'IBIMA Publishing',
                'doi' => '10.5171/2025.kafu.omieno01',
                'url' => 'https://ibimapublishing.com',
                'type' => 'journal',
                'abstract' => 'This paper presents empirical evidence on how citizen-facing digital portals improve service delivery efficiency in Kenyan county governments. Using data from a pilot implementation at Vihiga County Huduma Centre, the study demonstrates a 60% reduction in service wait times and significant improvement in citizen satisfaction scores.',
                'indexed_in' => ['Google Scholar', 'Crossref'],
                'volume' => '2025',
                'issue' => '1',
                'pages' => '1–18',
                'project_id' => $projects->get('smart-digital-tools-public-service-delivery')?->id,
                'is_featured' => true,
            ],
            [
                'title' => 'Community Health Worker Density and Child Immunisation Coverage in Vihiga County, Kenya',
                'slug' => 'chw-density-immunisation-vihiga',
                'authors' => [
                    ['name' => 'Beatrice Naliaka', 'first_initial' => 'B.', 'last_name' => 'Naliaka', 'affiliation' => 'KAFU'],
                    ['name' => 'James Ochieng', 'first_initial' => 'J.', 'last_name' => 'Ochieng', 'affiliation' => 'KAFU'],
                ],
                'year' => 2024,
                'journal' => 'African Journal of Primary Health Care & Family Medicine',
                'publisher' => 'AOSIS',
                'doi' => '10.4102/phcfm.v16i1.4102',
                'url' => 'https://phcfm.org',
                'type' => 'journal',
                'abstract' => 'This study quantifies the association between community health worker (CHW) density per 1,000 population and childhood immunisation coverage rates in Vihiga County. Results indicate that every additional CHW per 1,000 population is associated with a 4.7 percentage point increase in full immunisation coverage.',
                'indexed_in' => ['Scopus', 'PubMed Central', 'African Journals Online (AJOL)'],
                'volume' => '16',
                'issue' => '1',
                'pages' => '1–9',
                'project_id' => $projects->get('community-health-workers-vihiga-county')?->id,
                'is_featured' => true,
            ],
            [
                'title' => 'Indigenous Agroforestry Systems and Soil Organic Carbon Dynamics in Smallholder Tea Farms, Western Kenya',
                'slug' => 'agroforestry-soil-organic-carbon-western-kenya',
                'authors' => [
                    ['name' => 'Esther Luvanda', 'first_initial' => 'E.', 'last_name' => 'Luvanda', 'affiliation' => 'KAFU'],
                    ['name' => 'Robert Omuya', 'first_initial' => 'R.', 'last_name' => 'Omuya', 'affiliation' => 'KAFU'],
                ],
                'year' => 2025,
                'journal' => 'Agroforestry Systems',
                'publisher' => 'Springer Nature',
                'doi' => '10.1007/s10457-025-kafu01',
                'url' => 'https://link.springer.com/journal/10457',
                'type' => 'journal',
                'abstract' => 'This study examined the effects of integrating indigenous multipurpose tree species into smallholder tea farms on soil organic carbon (SOC) accumulation and soil microbial activity. Farms with diversified agroforestry systems showed 35% higher SOC concentrations compared to monoculture tea systems.',
                'indexed_in' => ['Scopus', 'Web of Science', 'Google Scholar'],
                'volume' => '99',
                'issue' => '2',
                'pages' => '445–462',
                'project_id' => $projects->get('agroforestry-soil-health-western-kenya')?->id,
                'is_featured' => true,
            ],
            [
                'title' => 'Teachers\' Perceived Challenges in Implementing the Competency-Based Curriculum in Western Kenya',
                'slug' => 'teachers-challenges-cbc-implementation-western-kenya',
                'authors' => [
                    ['name' => 'Margaret Wanyonyi', 'first_initial' => 'M.', 'last_name' => 'Wanyonyi', 'affiliation' => 'KAFU'],
                    ['name' => 'Joshua Sirengo', 'first_initial' => 'J.', 'last_name' => 'Sirengo', 'affiliation' => 'KAFU'],
                ],
                'year' => 2023,
                'journal' => 'East African Journal of Education Studies',
                'publisher' => 'East African Nature & Science Organisation',
                'doi' => '10.37284/eajes.6.1.kafu01',
                'url' => 'https://journals.eanso.org',
                'type' => 'journal',
                'abstract' => 'This paper reports findings from a study of 312 primary school teachers in Western Kenya regarding their perceived challenges in implementing the Competency-Based Curriculum. Key barriers identified include inadequate in-service training, insufficient learning materials, large class sizes, and low parental engagement.',
                'indexed_in' => ['Google Scholar', 'African Journals Online (AJOL)'],
                'volume' => '6',
                'issue' => '1',
                'pages' => '67–80',
                'project_id' => $projects->get('teacher-preparedness-cbc-western-kenya')?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Mobile Money Adoption and Youth Entrepreneurship Outcomes in Western Kenya: A Structural Equation Modelling Approach',
                'slug' => 'mobile-money-adoption-youth-entrepreneurship-western-kenya',
                'authors' => [
                    ['name' => 'Victor Mwinzi', 'first_initial' => 'V.', 'last_name' => 'Mwinzi', 'affiliation' => 'KAFU'],
                    ['name' => 'Lilian Barasa', 'first_initial' => 'L.', 'last_name' => 'Barasa', 'affiliation' => 'KAFU'],
                ],
                'year' => 2025,
                'journal' => 'African Journal of Business and Economic Research',
                'publisher' => 'Adonis & Abbey Publishers',
                'doi' => '10.31920/1750-4929/2025/kafu.mwinzi01',
                'url' => null,
                'type' => 'journal',
                'abstract' => 'This study applies Structural Equation Modelling (SEM) to examine the relationship between mobile money adoption and entrepreneurial outcomes among 800 youth in Western Kenya. The model reveals that mobile money adoption positively mediates the relationship between financial literacy and enterprise growth.',
                'indexed_in' => ['Google Scholar'],
                'volume' => '20',
                'issue' => '1',
                'pages' => '123–145',
                'project_id' => $projects->get('fintech-financial-inclusion-youth-western-kenya')?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Physicochemical and Microbiological Quality of River Water in Vihiga County and Implications for Community Health',
                'slug' => 'water-quality-vihiga-community-health',
                'authors' => [
                    ['name' => 'Henry Simiyu', 'first_initial' => 'H.', 'last_name' => 'Simiyu', 'affiliation' => 'KAFU'],
                    ['name' => 'Beatrice Naliaka', 'first_initial' => 'B.', 'last_name' => 'Naliaka', 'affiliation' => 'KAFU'],
                    ['name' => 'Collins Mutai', 'first_initial' => 'C.', 'last_name' => 'Mutai', 'affiliation' => 'KAFU'],
                ],
                'year' => 2025,
                'journal' => 'Environmental Monitoring and Assessment',
                'publisher' => 'Springer Nature',
                'doi' => '10.1007/s10661-025-kafu.simiyu01',
                'url' => 'https://link.springer.com/journal/10661',
                'type' => 'journal',
                'abstract' => 'River water samples from eight sub-catchments feeding into Lake Victoria from Vihiga County were analysed for 24 physicochemical and microbiological parameters. Faecal coliform counts exceeding WHO guidelines were detected in 87.5% of sampling sites, with strong spatial correlation to proximity of human settlement and agriculture.',
                'indexed_in' => ['Scopus', 'Web of Science', 'PubMed'],
                'volume' => '197',
                'issue' => '4',
                'pages' => '1–16',
                'project_id' => $projects->get('lake-victoria-water-quality-vihiga')?->id,
                'is_featured' => true,
            ],
            [
                'title' => 'Queuing Theory and IoT-Enabled Queue Management: A Case Study from a Kenyan County Service Centre',
                'slug' => 'iot-queue-management-kenyan-county-service',
                'authors' => [
                    ['name' => 'Isaac Simiyu', 'first_initial' => 'I.', 'last_name' => 'Simiyu', 'affiliation' => 'KAFU'],
                    ['name' => 'Kelvin K. Omieno', 'first_initial' => 'K.K.', 'last_name' => 'Omieno', 'affiliation' => 'KAFU'],
                ],
                'year' => 2024,
                'journal' => 'International Journal of Computer Applications',
                'publisher' => 'Foundation of Computer Science',
                'doi' => '10.5120/ijca2024kafu.simiyu01',
                'url' => 'https://ijcaonline.org',
                'type' => 'conference',
                'abstract' => 'This paper presents a queuing model and IoT sensor deployment architecture for managing service queues in a Kenyan county government service centre. Field trials at the Vihiga County Huduma Centre demonstrated 60% reduction in average wait time and 45% improvement in service throughput.',
                'indexed_in' => ['Google Scholar'],
                'volume' => '186',
                'issue' => '34',
                'pages' => '1–8',
                'project_id' => $projects->get('smart-digital-tools-public-service-delivery')?->id,
                'is_featured' => false,
            ],
            [
                'title' => 'Cooperative Societies and Smallholder Farmer Income Resilience in Western Kenya: A Panel Data Analysis',
                'slug' => 'cooperative-societies-smallholder-income-western-kenya',
                'authors' => [
                    ['name' => 'Lilian Barasa', 'first_initial' => 'L.', 'last_name' => 'Barasa', 'affiliation' => 'KAFU'],
                ],
                'year' => 2023,
                'journal' => 'African Development Review',
                'publisher' => 'African Development Bank / Wiley',
                'doi' => '10.1111/1467-8268.kafu.barasa01',
                'url' => null,
                'type' => 'journal',
                'abstract' => 'Using a panel dataset of 420 smallholder farmers tracked over three agricultural seasons in Western Kenya, this study estimates the income premium associated with cooperative membership. Cooperative members earned on average 34% more per season than non-members after controlling for farm size, crop type, and market access.',
                'indexed_in' => ['Scopus', 'EconLit', 'Web of Science'],
                'volume' => '35',
                'issue' => '2',
                'pages' => '215–230',
                'project_id' => null,
                'is_featured' => false,
            ],
        ];

        foreach ($publications as $p) {
            Publication::firstOrCreate(['slug' => $p['slug']], $p);
        }
    }

    private function seedGrants(): void
    {
        $projects = ResearchProject::all()->keyBy('slug');

        $grants = [
            [
                'name' => 'Digital Public Service Delivery Innovation Grant',
                'funder' => 'ICT Authority — Government of Kenya',
                'funder_type' => 'government',
                'funder_country' => 'Kenya',
                'amount' => 4500000,
                'currency' => 'KES',
                'start_date' => '2024-03-01',
                'end_date' => '2026-02-28',
                'description' => 'Grant to support development and deployment of citizen-facing digital tools to improve public service delivery in county governments across Western Kenya.',
                'status' => 'active',
                'project_id' => $projects->get('smart-digital-tools-public-service-delivery')?->id,
                'grant_number' => 'ICTA/KAFU/2024/001',
                'is_visible' => true,
            ],
            [
                'name' => 'Community Health Systems Strengthening Research Grant',
                'funder' => 'AMREF Health Africa',
                'funder_type' => 'ngo',
                'funder_country' => 'Kenya',
                'amount' => 2800000,
                'currency' => 'KES',
                'start_date' => '2023-01-01',
                'end_date' => '2024-12-31',
                'description' => 'Research grant to evaluate the effectiveness of community health workers in improving maternal and child health outcomes in Vihiga County.',
                'status' => 'completed',
                'project_id' => $projects->get('community-health-workers-vihiga-county')?->id,
                'grant_number' => 'AMREF/KAFU/CHS/2023',
                'is_visible' => true,
            ],
            [
                'name' => 'Agroforestry and Sustainable Landscapes Research Programme',
                'funder' => 'African Development Bank',
                'funder_type' => 'international',
                'funder_country' => 'Ivory Coast',
                'amount' => 5000000,
                'currency' => 'KES',
                'start_date' => '2025-01-01',
                'end_date' => '2027-12-31',
                'description' => 'Multi-country research programme grant for investigating sustainable agroforestry practices and their impact on food security and soil health in East Africa.',
                'status' => 'active',
                'project_id' => $projects->get('agroforestry-soil-health-western-kenya')?->id,
                'grant_number' => 'AfDB/KAFU/AGRI/2025/003',
                'is_visible' => true,
            ],
            [
                'name' => 'Kenya National Research Fund — Education Research Grant',
                'funder' => 'Kenya National Research Fund (NRF)',
                'funder_type' => 'government',
                'funder_country' => 'Kenya',
                'amount' => 1800000,
                'currency' => 'KES',
                'start_date' => '2022-09-01',
                'end_date' => '2024-08-31',
                'description' => 'Research grant for investigating teacher preparedness for the Competency-Based Curriculum in primary schools across Western Kenya.',
                'status' => 'completed',
                'project_id' => $projects->get('teacher-preparedness-cbc-western-kenya')?->id,
                'grant_number' => 'NRF/KAFU/EDU/2022/07',
                'is_visible' => true,
            ],
            [
                'name' => 'Fintech and Youth Financial Inclusion Research Grant',
                'funder' => 'FSD Kenya',
                'funder_type' => 'ngo',
                'funder_country' => 'Kenya',
                'amount' => 3200000,
                'currency' => 'KES',
                'start_date' => '2024-06-01',
                'end_date' => '2026-05-31',
                'description' => 'Research grant to examine the role of fintech and mobile money in expanding financial inclusion and supporting entrepreneurship among youth in Western Kenya.',
                'status' => 'active',
                'project_id' => $projects->get('fintech-financial-inclusion-youth-western-kenya')?->id,
                'grant_number' => 'FSDK/KAFU/FIN/2024/011',
                'is_visible' => true,
            ],
            [
                'name' => 'WASH and Water Quality Research Grant — Lake Victoria Basin',
                'funder' => 'USAID — Water and Development Division',
                'funder_type' => 'international',
                'funder_country' => 'United States',
                'amount' => 6200000,
                'currency' => 'KES',
                'start_date' => '2025-03-01',
                'end_date' => '2027-02-28',
                'description' => 'Research grant to assess water quality in river systems feeding into Lake Victoria from Vihiga County and model community health risk exposure from waterborne contaminants.',
                'status' => 'active',
                'project_id' => $projects->get('lake-victoria-water-quality-vihiga')?->id,
                'grant_number' => 'USAID-W-24-KAFU-ENV-005',
                'is_visible' => true,
            ],
        ];

        foreach ($grants as $g) {
            ResearchGrant::firstOrCreate(['grant_number' => $g['grant_number']], $g);
        }
    }

    private function seedPartners(): void
    {
        $partners = [
            [
                'name' => 'University of Nairobi',
                'slug' => 'university-of-nairobi',
                'type' => 'academic',
                'country' => 'Kenya',
                'country_code' => 'KE',
                'description' => 'KAFU collaborates with the University of Nairobi on postgraduate training, joint research projects in health sciences and education, and staff exchange programmes.',
                'logo_url' => null,
                'website_url' => 'https://uonbi.ac.ke',
                'collaboration_areas' => ['Health Sciences', 'Education Research', 'Postgraduate Training'],
                'is_featured' => true,
            ],
            [
                'name' => 'Moi University',
                'slug' => 'moi-university',
                'type' => 'academic',
                'country' => 'Kenya',
                'country_code' => 'KE',
                'description' => 'Joint research collaboration with Moi University in the areas of agriculture, veterinary sciences, and health systems. Staff exchange and co-supervision of postgraduate students.',
                'logo_url' => null,
                'website_url' => 'https://mu.ac.ke',
                'collaboration_areas' => ['Agriculture', 'Health Systems', 'Postgraduate Co-Supervision'],
                'is_featured' => false,
            ],
            [
                'name' => 'AMREF Health Africa',
                'slug' => 'amref-health-africa',
                'type' => 'ngo',
                'country' => 'Kenya',
                'country_code' => 'KE',
                'description' => 'Strategic partnership for community health research, capacity building for health workers, and joint implementation of health intervention programmes in Western Kenya.',
                'logo_url' => 'https://amref.org/wp-content/uploads/2019/03/amref-logo.png',
                'website_url' => 'https://amref.org',
                'collaboration_areas' => ['Community Health Research', 'Health Worker Training', 'WASH'],
                'is_featured' => true,
            ],
            [
                'name' => 'World Agroforestry Centre (ICRAF)',
                'slug' => 'world-agroforestry-centre-icraf',
                'type' => 'international',
                'country' => 'Kenya',
                'country_code' => 'KE',
                'description' => 'Research partnership for agroforestry systems research in East Africa, with joint projects on soil health, climate-smart agriculture, and food security in smallholder farming communities.',
                'logo_url' => null,
                'website_url' => 'https://www.worldagroforestry.org',
                'collaboration_areas' => ['Agroforestry', 'Soil Science', 'Climate-Smart Agriculture'],
                'is_featured' => true,
            ],
            [
                'name' => 'Kenya National Research Fund (NRF)',
                'slug' => 'kenya-national-research-fund',
                'type' => 'government',
                'country' => 'Kenya',
                'country_code' => 'KE',
                'description' => 'KAFU is a registered research institution with NRF, enabling staff to apply for competitive research grants across all disciplines. Ongoing collaboration for national research agenda alignment.',
                'logo_url' => null,
                'website_url' => 'https://nrf.go.ke',
                'collaboration_areas' => ['Research Funding', 'National Research Agenda'],
                'is_featured' => false,
            ],
            [
                'name' => 'FSD Kenya (Financial Sector Deepening)',
                'slug' => 'fsd-kenya',
                'type' => 'ngo',
                'country' => 'Kenya',
                'country_code' => 'KE',
                'description' => 'Partnership for research on financial inclusion, mobile money, and fintech adoption among low-income and youth populations in Western Kenya.',
                'logo_url' => null,
                'website_url' => 'https://fsdkenya.org',
                'collaboration_areas' => ['Financial Inclusion', 'Fintech Research', 'Youth Entrepreneurship'],
                'is_featured' => false,
            ],
            [
                'name' => 'USAID Kenya',
                'slug' => 'usaid-kenya',
                'type' => 'international',
                'country' => 'United States',
                'country_code' => 'US',
                'description' => 'KAFU partners with USAID Kenya on environmental and water quality research under the Water and Development Division. Collaboration covers WASH research, data for policy, and community engagement.',
                'logo_url' => 'https://www.usaid.gov/sites/default/files/USAID-Identity.png',
                'website_url' => 'https://www.usaid.gov/kenya',
                'collaboration_areas' => ['WASH Research', 'Environmental Science', 'Policy-Oriented Research'],
                'is_featured' => true,
            ],
            [
                'name' => 'African Development Bank (AfDB)',
                'slug' => 'african-development-bank',
                'type' => 'international',
                'country' => 'Ivory Coast',
                'country_code' => 'CI',
                'description' => 'Research funding partnership through the AfDB\'s Research for Agriculture and Sustainability programme. KAFU is a beneficiary institution for agroforestry and sustainable landscapes research.',
                'logo_url' => null,
                'website_url' => 'https://afdb.org',
                'collaboration_areas' => ['Agriculture Research', 'Sustainable Development', 'Research Funding'],
                'is_featured' => false,
            ],
        ];

        foreach ($partners as $p) {
            ResearchPartner::firstOrCreate(['slug' => $p['slug']], $p);
        }

        $this->command->info('Research seeder complete. Stats:');
        $this->command->info('  Themes: ' . ResearchTheme::count());
        $this->command->info('  Projects: ' . ResearchProject::count());
        $this->command->info('  Publications: ' . Publication::count());
        $this->command->info('  Grants: ' . ResearchGrant::count());
        $this->command->info('  Partners: ' . ResearchPartner::count());
    }
}
