<?php

namespace App\Services;

use App\Models\AdmissionLetter;
use App\Models\AdmissionLetterTemplate;
use App\Models\KuccpsPlacement;
use App\Models\AdmissionProgramme;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdmissionLetterService
{
    /**
     * Generate an admission letter for a placement record.
     */
    public function generateForPlacement(KuccpsPlacement $placement, AdmissionLetterTemplate $template, ?int $generatedBy = null): AdmissionLetter
    {
        // Create or update the letter record
        $letter = AdmissionLetter::firstOrNew(['placement_id' => $placement->id]);
        $letter->template_id     = $template->id;
        $letter->letter_reference = $letter->letter_reference ?? 'KAFU/ADL/' . strtoupper($placement->academic_year ?? '2026') . '/' . str_pad($placement->id, 6, '0', STR_PAD_LEFT);
        $letter->verification_code = $letter->verification_code ?? strtoupper(Str::random(12));
        $letter->status          = 'generating';
        $letter->generated_by    = $generatedBy;
        $letter->save();

        try {
            $programme = AdmissionProgramme::find($placement->programme_id);
            $html = $this->renderTemplate($template, $placement, $programme, $letter);
            $pdf  = $this->generatePdf($html);

            $filename = 'admission_letters/' . $letter->letter_reference . '.pdf';
            Storage::disk('local')->put($filename, $pdf);

            $letter->file_path    = $filename;
            $letter->status       = 'generated';
            $letter->generated_at = now();
            $letter->save();

            // Update placement admission_letter_id
            $placement->admission_letter_id = $letter->id;
            $placement->save();
        } catch (\Exception $e) {
            $letter->status = 'failed';
            $letter->save();
            throw $e;
        }

        return $letter;
    }

    private function renderTemplate(AdmissionLetterTemplate $template, KuccpsPlacement $placement, ?AdmissionProgramme $programme, AdmissionLetter $letter): string
    {
        $schoolNames = [
            'SESS' => 'School of Education &amp; Social Sciences',
            'SBE'  => 'School of Business &amp; Economics',
            'SCIT' => 'School of Computing &amp; Information Technology',
            'SOS'  => 'School of Science',
            'SHS'  => 'School of Health Sciences',
        ];

        $vars = [
            '{{student_full_name}}'       => htmlspecialchars($placement->full_name ?? ''),
            '{{kcse_index_number}}'       => htmlspecialchars($placement->kcse_index_number ?? ''),
            '{{programme_name}}'          => htmlspecialchars($programme?->programme_name ?? $placement->uploaded_programme_name ?? ''),
            '{{programme_code}}'          => htmlspecialchars($programme?->programme_code ?? ''),
            '{{school_name}}'             => htmlspecialchars($schoolNames[$programme?->school_code ?? ''] ?? 'Faculty of Studies'),
            '{{department_name}}'         => htmlspecialchars($programme?->department ?? ''),
            '{{academic_year}}'           => htmlspecialchars($placement->academic_year ?? ''),
            '{{intake_name}}'             => htmlspecialchars(ucfirst($placement->intake_period ?? 'September') . ' ' . ($placement->academic_year ?? '') . ' Intake'),
            '{{reporting_date}}'          => htmlspecialchars($template->reporting_date_text ?? 'To Be Communicated'),
            '{{admission_reference}}'     => htmlspecialchars($letter->letter_reference),
            '{{verification_code}}'       => htmlspecialchars($letter->verification_code),
            '{{registrar_name}}'          => htmlspecialchars($template->registrar_name ?? 'The Academic Registrar'),
            '{{university_logo}}'         => '<img src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png" style="height:60px;" alt="KAFU Logo">',
            '{{joining_instructions_url}}' => 'https://portal.kafu.ac.ke/joining-instructions',
            '{{date_generated}}'          => date('d F Y'),
        ];

        $body = str_replace(array_keys($vars), array_values($vars), $template->body_html);

        $header = $template->header_html
            ? str_replace(array_keys($vars), array_values($vars), $template->header_html)
            : $this->defaultHeader($vars);

        $footer = $template->footer_html
            ? str_replace(array_keys($vars), array_values($vars), $template->footer_html)
            : $this->defaultFooter($vars);

        return "<!DOCTYPE html><html><head><meta charset='utf-8'><style>
            body { font-family: Arial, sans-serif; font-size: 12pt; color: #222; margin: 0; padding: 0; }
            .header { padding: 20px 40px 10px; border-bottom: 3px solid #1A5C38; text-align: center; }
            .body { padding: 30px 40px; }
            .footer { padding: 10px 40px; border-top: 2px solid #C9A227; font-size: 10pt; color: #555; text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 6px 10px; }
            .label { font-weight: bold; }
            .gold { color: #C9A227; }
            .green { color: #1A5C38; }
            .verify-box { background: #f0f7f3; border: 1px solid #1A5C38; padding: 12px; margin: 20px 0; border-radius: 4px; }
        </style></head><body>
        <div class='header'>{$header}</div>
        <div class='body'>{$body}</div>
        <div class='footer'>{$footer}</div>
        </body></html>";
    }

    private function defaultHeader(array $vars): string
    {
        return "<table><tr>
            <td style='text-align:left;'>{$vars['{{university_logo}}']}</td>
            <td style='text-align:right;'><strong style='color:#1A5C38;'>KAIMOSI FRIENDS UNIVERSITY</strong><br><small>P.O. Box 385-50309, Kaimosi, Kenya</small><br><small>admissions@kafu.ac.ke | +254 777 373 633</small></td>
        </tr></table>";
    }

    private function defaultFooter(array $vars): string
    {
        return "<p>Verify this letter at <strong>portal.kafu.ac.ke/verify</strong> using code: <strong>{$vars['{{verification_code}}']}</strong></p>
        <p>Kaimosi Friends University &mdash; Spring of Knowledge | www.kafu.ac.ke</p>";
    }

    private function generatePdf(string $html): string
    {
        $dompdf = new \Dompdf\Dompdf();
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->loadHtml($html);
        $dompdf->render();
        return $dompdf->output();
    }

    /**
     * Get letter content as PDF stream for download.
     */
    public function getLetterStream(AdmissionLetter $letter): ?string
    {
        if (!$letter->file_path) return null;
        return Storage::disk('local')->get($letter->file_path);
    }
}
