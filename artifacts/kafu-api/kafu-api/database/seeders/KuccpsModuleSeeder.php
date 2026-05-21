<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KuccpsModuleSeeder extends Seeder
{
    public function run(): void
    {
        // ── Default admission letter template ──────────────────────────────────
        DB::table('admission_letter_templates')->insertOrIgnore([
            'id'                 => 1,
            'template_name'      => 'Standard KUCCPS Undergraduate Admission Letter',
            'template_code'      => 'kuccps-ug-standard',
            'intake_period'      => 'september',
            'registrar_name'     => 'The Academic Registrar',
            'reporting_date_text'=> '4th September 2026 at 8:00 AM',
            'is_active'          => 1,
            'approved_at'        => now(),
            'approved_by'        => 1,
            'body_html'          => $this->defaultLetterBody(),
            'variables_json'     => json_encode([
                '{{student_full_name}}', '{{kcse_index_number}}', '{{programme_name}}',
                '{{school_name}}', '{{academic_year}}', '{{intake_name}}',
                '{{reporting_date}}', '{{admission_reference}}', '{{verification_code}}',
                '{{registrar_name}}', '{{university_logo}}', '{{joining_instructions_url}}',
                '{{date_generated}}',
            ]),
            'created_at'         => now(),
            'updated_at'         => now(),
        ]);

        // ── Programme aliases — common KUCCPS naming variations ────────────────
        $normalizer = app(\App\Services\DataNormalizerService::class);
        $aliases = $this->programmeAliases();
        foreach ($aliases as $alias) {
            DB::table('programme_aliases')->insertOrIgnore(array_merge($alias, [
                'normalized_alias' => $normalizer->normalizeProgrammeName($alias['alias_name']),
                'source'           => 'seed',
                'is_active'        => 1,
                'approved_by'      => 1,
                'approved_at'      => now(),
                'created_at'       => now(),
                'updated_at'       => now(),
            ]));
        }
    }

    private function defaultLetterBody(): string
    {
        return <<<'HTML'
<p style="text-align:right; margin-bottom:20px;">Ref: {{admission_reference}}<br>Date: {{date_generated}}</p>

<p>Dear <strong>{{student_full_name}}</strong>,</p>

<h2 style="color:#1A5C38; border-bottom: 2px solid #C9A227; padding-bottom:6px;">
    ADMISSION TO {{programme_name}}<br>
    <span style="font-size:14pt;">{{intake_name}} — Academic Year {{academic_year}}</span>
</h2>

<p>
    Following your placement by the Kenya Universities and Colleges Central Placement Service (KUCCPS),
    we are pleased to offer you <strong>provisional admission</strong> to Kaimosi Friends University (KAFU)
    for the programme listed below, subject to verification of your academic certificates and compliance
    with all conditions of admission.
</p>

<table style="width:100%; border:1px solid #ccc; border-collapse:collapse; margin:20px 0;">
    <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold; width:40%;">Student Name</td><td style="padding:8px;">{{student_full_name}}</td></tr>
    <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">KCSE Index Number</td><td style="padding:8px;">{{kcse_index_number}}</td></tr>
    <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">Programme Offered</td><td style="padding:8px;"><strong>{{programme_name}}</strong></td></tr>
    <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">School / Faculty</td><td style="padding:8px;">{{school_name}}</td></tr>
    <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">Academic Year</td><td style="padding:8px;">{{academic_year}}</td></tr>
    <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">Intake</td><td style="padding:8px;">{{intake_name}}</td></tr>
    <tr><td style="padding:8px; background:#f5f5f5; font-weight:bold;">Reporting Date</td><td style="padding:8px; color:#1A5C38; font-weight:bold;">{{reporting_date}}</td></tr>
</table>

<h3 style="color:#1A5C38;">Conditions of Admission</h3>
<ol>
    <li>You are required to present original academic certificates (KCSE Certificate or Result Slip, Birth Certificate/National ID) upon reporting.</li>
    <li>This admission is provisional and will be confirmed only after verification of your KCSE results and other required documents.</li>
    <li>You must pay the prescribed fees as communicated by the Finance Office.</li>
    <li>You are required to complete medical examination forms and other onboarding documents on arrival.</li>
    <li>Any admission obtained through misrepresentation of academic qualifications will be cancelled.</li>
</ol>

<h3 style="color:#1A5C38;">Required Documents on Reporting</h3>
<ul>
    <li>Original KCSE Certificate or Kenya National Examinations Council (KNEC) result slip</li>
    <li>Original National ID Card or Birth Certificate</li>
    <li>4 recent passport-size photographs</li>
    <li>Medical fitness form (form available at the University Health Center)</li>
    <li>Letter of financial guarantee or fee payment receipt</li>
</ul>

<p>For joining instructions, accommodation, and fee structure, please visit:<br>
<strong><a href="{{joining_instructions_url}}">{{joining_instructions_url}}</a></strong></p>

<div class="verify-box">
    <strong>Letter Verification:</strong> This admission letter can be verified at
    <strong>portal.kafu.ac.ke/verify</strong> using verification code: <strong>{{verification_code}}</strong>
</div>

<p style="margin-top:30px;">Congratulations on your placement at Kaimosi Friends University — the <em>Spring of Knowledge</em>.</p>

<p style="margin-top:40px;">
    Yours faithfully,<br><br>
    <strong>{{registrar_name}}</strong><br>
    Kaimosi Friends University<br>
    P.O. Box 385-50309, Kaimosi, Kenya<br>
    Tel: +254 777 373 633 | admissions@kafu.ac.ke<br>
    www.kafu.ac.ke
</p>
HTML;
    }

    private function programmeAliases(): array
    {
        // Map to programme IDs from the admissions seeder (seeded IDs 1-27+)
        // These are KUCCPS naming variations that commonly appear in placement files
        return [
            // Education
            ['programme_id' => 1,  'alias_name' => 'Bachelor of Education Arts', 'confidence_default' => 95],
            ['programme_id' => 1,  'alias_name' => 'BED Arts', 'confidence_default' => 90],
            ['programme_id' => 1,  'alias_name' => 'B.Ed. Arts', 'confidence_default' => 90],
            ['programme_id' => 1,  'alias_name' => 'Education Arts', 'confidence_default' => 85],
            ['programme_id' => 2,  'alias_name' => 'Bachelor of Education Science', 'confidence_default' => 95],
            ['programme_id' => 2,  'alias_name' => 'BED Science', 'confidence_default' => 90],
            ['programme_id' => 2,  'alias_name' => 'B.Ed. Science', 'confidence_default' => 90],
            ['programme_id' => 2,  'alias_name' => 'Education Science', 'confidence_default' => 85],
            // Business
            ['programme_id' => 7,  'alias_name' => 'Bachelor of Commerce', 'confidence_default' => 88],
            ['programme_id' => 7,  'alias_name' => 'BCom', 'confidence_default' => 85],
            ['programme_id' => 7,  'alias_name' => 'B.Com', 'confidence_default' => 85],
            ['programme_id' => 8,  'alias_name' => 'Bachelor of Business Administration', 'confidence_default' => 88],
            ['programme_id' => 8,  'alias_name' => 'BBA', 'confidence_default' => 82],
            // Computer Science
            ['programme_id' => 12, 'alias_name' => 'BSc Computer Science', 'confidence_default' => 95],
            ['programme_id' => 12, 'alias_name' => 'B.Sc. Computer Science', 'confidence_default' => 95],
            ['programme_id' => 12, 'alias_name' => 'Computer Science', 'confidence_default' => 88],
            ['programme_id' => 13, 'alias_name' => 'Information Technology', 'confidence_default' => 88],
            ['programme_id' => 13, 'alias_name' => 'BSc IT', 'confidence_default' => 85],
            ['programme_id' => 13, 'alias_name' => 'B.Sc. IT', 'confidence_default' => 85],
            // Science
            ['programme_id' => 15, 'alias_name' => 'BSc Biology', 'confidence_default' => 92],
            ['programme_id' => 15, 'alias_name' => 'B.Sc. Biology', 'confidence_default' => 92],
            ['programme_id' => 16, 'alias_name' => 'BSc Chemistry', 'confidence_default' => 92],
            ['programme_id' => 16, 'alias_name' => 'B.Sc. Chemistry', 'confidence_default' => 92],
            // Health
            ['programme_id' => 20, 'alias_name' => 'Nursing', 'confidence_default' => 88],
            ['programme_id' => 20, 'alias_name' => 'BSc Nursing', 'confidence_default' => 92],
            ['programme_id' => 20, 'alias_name' => 'B.Sc. Nursing', 'confidence_default' => 92],
            ['programme_id' => 21, 'alias_name' => 'Public Health', 'confidence_default' => 88],
            ['programme_id' => 21, 'alias_name' => 'BSc Public Health', 'confidence_default' => 92],
        ];
    }
}
