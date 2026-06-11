<?php

namespace Database\Seeders;

use App\Models\InstitutionalKpi;
use App\Models\Ranking;
use App\Models\InstitutionalReport;
use App\Models\Accreditation;
use Illuminate\Database\Seeder;

class InstitutionalDataSeeder extends Seeder
{
    public function run(): void
    {
        // ── Institutional KPIs ─────────────────────────────────────────────
        $kpis = [
            ['slug' => 'total-students', 'label' => 'Total Students', 'category' => 'enrollment', 'value' => 8420, 'display_value' => '8,420', 'unit' => 'students', 'period_year' => 2025, 'trend' => 'up', 'trend_value' => 6.4, 'icon' => 'users', 'description' => 'Total enrolled students across all campuses and programmes.', 'is_featured' => true, 'sort_order' => 1, 'series' => [['year' => 2021, 'value' => 6100], ['year' => 2022, 'value' => 6800], ['year' => 2023, 'value' => 7350], ['year' => 2024, 'value' => 7910], ['year' => 2025, 'value' => 8420]]],
            ['slug' => 'female-enrollment', 'label' => 'Female Enrolment', 'category' => 'enrollment', 'value' => 47.5, 'display_value' => '47.5%', 'unit' => '%', 'period_year' => 2025, 'trend' => 'up', 'trend_value' => 1.8, 'icon' => 'user-check', 'description' => 'Proportion of female students in the total enrolment.', 'is_featured' => true, 'sort_order' => 2],
            ['slug' => 'academic-programmes', 'label' => 'Academic Programmes', 'category' => 'academic', 'value' => 64, 'display_value' => '64', 'unit' => 'programmes', 'period_year' => 2025, 'trend' => 'up', 'trend_value' => 4, 'icon' => 'book-open', 'description' => 'Accredited certificate, diploma, undergraduate and postgraduate programmes.', 'is_featured' => true, 'sort_order' => 3],
            ['slug' => 'academic-staff', 'label' => 'Academic Staff', 'category' => 'staff', 'value' => 312, 'display_value' => '312', 'unit' => 'staff', 'period_year' => 2025, 'trend' => 'up', 'trend_value' => 5.1, 'icon' => 'graduation-cap', 'description' => 'Full-time and part-time teaching staff.', 'sort_order' => 4],
            ['slug' => 'phd-holders', 'label' => 'Staff with PhDs', 'category' => 'staff', 'value' => 38.0, 'display_value' => '38%', 'unit' => '%', 'period_year' => 2025, 'trend' => 'up', 'trend_value' => 3.0, 'icon' => 'award', 'description' => 'Academic staff holding doctoral qualifications.', 'sort_order' => 5],
            ['slug' => 'student-staff-ratio', 'label' => 'Student-Staff Ratio', 'category' => 'academic', 'value' => 27, 'display_value' => '27:1', 'unit' => 'ratio', 'period_year' => 2025, 'trend' => 'flat', 'icon' => 'scale', 'description' => 'Average number of students per academic staff member.', 'sort_order' => 6],
            ['slug' => 'research-publications', 'label' => 'Research Publications', 'category' => 'research', 'value' => 184, 'display_value' => '184', 'unit' => 'publications', 'period_year' => 2025, 'trend' => 'up', 'trend_value' => 12.3, 'icon' => 'file-text', 'description' => 'Peer-reviewed publications by KAFU staff in the year.', 'is_featured' => true, 'sort_order' => 7],
            ['slug' => 'active-grants', 'label' => 'Active Research Grants', 'category' => 'research', 'value' => 21, 'display_value' => '21', 'unit' => 'grants', 'period_year' => 2025, 'trend' => 'up', 'trend_value' => 5, 'icon' => 'banknote', 'description' => 'Funded research and innovation grants currently running.', 'sort_order' => 8],
            ['slug' => 'graduation-rate', 'label' => 'Graduation Rate', 'category' => 'academic', 'value' => 88.0, 'display_value' => '88%', 'unit' => '%', 'period_year' => 2024, 'trend' => 'up', 'trend_value' => 2.0, 'icon' => 'trending-up', 'description' => 'Share of students completing their programmes on schedule.', 'sort_order' => 9],
            ['slug' => 'campuses', 'label' => 'Campuses', 'category' => 'infrastructure', 'value' => 3, 'display_value' => '3', 'unit' => 'campuses', 'period_year' => 2025, 'trend' => 'flat', 'icon' => 'map-pin', 'description' => 'Main Kaimosi campus plus satellite campuses.', 'sort_order' => 10],
            ['slug' => 'library-volumes', 'label' => 'Library Volumes', 'category' => 'infrastructure', 'value' => 92000, 'display_value' => '92,000+', 'unit' => 'volumes', 'period_year' => 2025, 'trend' => 'up', 'trend_value' => 8.0, 'icon' => 'library', 'description' => 'Physical and electronic resources in the university library.', 'sort_order' => 11],
            ['slug' => 'annual-budget', 'label' => 'Annual Budget', 'category' => 'finance', 'value' => 3.2, 'display_value' => 'KES 3.2B', 'unit' => 'KES billion', 'period_year' => 2025, 'trend' => 'up', 'trend_value' => 7.0, 'icon' => 'wallet', 'description' => 'Total approved operating and development budget.', 'sort_order' => 12],
        ];
        foreach ($kpis as $k) {
            InstitutionalKpi::updateOrCreate(['slug' => $k['slug']], $k);
        }

        // ── Rankings ───────────────────────────────────────────────────────
        $rankings = [
            ['slug' => 'webometrics-national-2025', 'organization' => 'Webometrics', 'title' => 'Ranking Web of Universities — Kenya', 'rank_value' => 'Top 25', 'rank_numeric' => 23, 'category' => 'national', 'year' => 2025, 'scope' => 'Kenya', 'source_url' => 'https://www.webometrics.info', 'description' => 'National position among Kenyan universities by web presence and research visibility.', 'is_featured' => true, 'sort_order' => 1],
            ['slug' => 'webometrics-africa-2025', 'organization' => 'Webometrics', 'title' => 'Ranking Web of Universities — Africa', 'rank_value' => 'Top 350', 'rank_numeric' => 318, 'category' => 'regional', 'year' => 2025, 'scope' => 'Africa', 'source_url' => 'https://www.webometrics.info', 'description' => 'Continental ranking among African higher education institutions.', 'is_featured' => true, 'sort_order' => 2],
            ['slug' => 'uniRank-2025', 'organization' => 'uniRank', 'title' => 'University Ranking — Kenya', 'rank_value' => 'Top 30', 'rank_numeric' => 28, 'category' => 'national', 'year' => 2025, 'scope' => 'Kenya', 'source_url' => 'https://www.unirank.org', 'description' => 'Popularity and web-based ranking of Kenyan universities.', 'sort_order' => 3],
            ['slug' => 'green-metric-2024', 'organization' => 'UI GreenMetric', 'title' => 'World University Sustainability Ranking', 'rank_value' => 'Listed', 'rank_numeric' => null, 'category' => 'global', 'year' => 2024, 'scope' => 'Global', 'source_url' => 'https://greenmetric.ui.ac.id', 'description' => 'Recognition for campus sustainability and environmental stewardship.', 'sort_order' => 4],
        ];
        foreach ($rankings as $r) {
            Ranking::updateOrCreate(['slug' => $r['slug']], $r);
        }

        // ── Institutional Reports ──────────────────────────────────────────
        $reports = [
            ['slug' => 'annual-report-2024', 'title' => 'Annual Report 2024', 'report_type' => 'annual_report', 'year' => 2024, 'description' => 'Comprehensive review of academic, research, and operational performance for the 2024 academic year.', 'published_date' => '2025-03-15', 'is_featured' => true, 'sort_order' => 1],
            ['slug' => 'strategic-plan-2023-2027', 'title' => 'Strategic Plan 2023–2027', 'report_type' => 'strategic_plan', 'year' => 2023, 'description' => 'Five-year roadmap outlining the university vision, strategic objectives, and key performance indicators.', 'published_date' => '2023-06-01', 'is_featured' => true, 'sort_order' => 2],
            ['slug' => 'financial-statements-2024', 'title' => 'Audited Financial Statements 2024', 'report_type' => 'financial', 'year' => 2024, 'description' => 'Externally audited financial statements as presented to Council.', 'published_date' => '2025-02-10', 'sort_order' => 3],
            ['slug' => 'fact-book-2025', 'title' => 'University Fact Book 2025', 'report_type' => 'factbook', 'year' => 2025, 'description' => 'Statistical digest of enrolment, staffing, finance, and infrastructure indicators.', 'published_date' => '2025-04-20', 'sort_order' => 4],
            ['slug' => 'service-delivery-charter', 'title' => 'Service Delivery Charter', 'report_type' => 'policy', 'year' => 2024, 'description' => 'Commitments to service standards for students, staff, and the public.', 'published_date' => '2024-09-01', 'sort_order' => 5],
        ];
        foreach ($reports as $rep) {
            InstitutionalReport::updateOrCreate(['slug' => $rep['slug']], $rep);
        }

        // ── Accreditations ─────────────────────────────────────────────────
        $accreditations = [
            ['slug' => 'cue-charter', 'body_name' => 'Commission for University Education (CUE)', 'accreditation_type' => 'institutional', 'status' => 'accredited', 'award_date' => '2019-11-01', 'description' => 'KAFU operates under a Charter awarded by the Commission for University Education, the statutory regulator of university education in Kenya.', 'sort_order' => 1],
            ['slug' => 'tvet-cdacc', 'body_name' => 'TVET CDACC', 'accreditation_type' => 'institutional', 'status' => 'accredited', 'award_date' => '2021-05-15', 'description' => 'Accreditation for competency-based education and training (CBET) programmes.', 'sort_order' => 2],
            ['slug' => 'knqa-registration', 'body_name' => 'Kenya National Qualifications Authority (KNQA)', 'accreditation_type' => 'institutional', 'status' => 'accredited', 'award_date' => '2020-08-10', 'description' => 'Registered qualifications aligned to the Kenya National Qualifications Framework.', 'sort_order' => 3],
            ['slug' => 'icpak-bcom', 'body_name' => 'ICPAK', 'accreditation_type' => 'programme', 'programme' => 'Bachelor of Commerce', 'school_code' => 'SBE', 'status' => 'accredited', 'award_date' => '2022-01-20', 'expiry_date' => '2027-01-20', 'description' => 'Professional accreditation of the Bachelor of Commerce programme by the Institute of Certified Public Accountants of Kenya.', 'sort_order' => 4],
            ['slug' => 'tsc-education', 'body_name' => 'Teachers Service Commission (TSC)', 'accreditation_type' => 'programme', 'programme' => 'Bachelor of Education', 'school_code' => 'SED', 'status' => 'accredited', 'award_date' => '2020-03-12', 'description' => 'Recognition of education programmes for teacher registration.', 'sort_order' => 5],
        ];
        foreach ($accreditations as $a) {
            Accreditation::updateOrCreate(['slug' => $a['slug']], $a);
        }
    }
}
