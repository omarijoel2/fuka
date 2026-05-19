<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class KuccpsParserService
{
    /**
     * Detect sheets in an uploaded Excel/CSV file.
     * Returns ['sheets' => string[], 'file_type' => string]
     */
    public function detectSheets(string $filePath, string $fileType): array
    {
        if ($fileType === 'csv') {
            return ['sheets' => ['Sheet1'], 'file_type' => 'csv'];
        }

        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($filePath);
            $sheets = [];
            foreach ($spreadsheet->getSheetNames() as $name) {
                $sheets[] = $name;
            }
            return ['sheets' => $sheets, 'file_type' => $fileType];
        } catch (\Exception $e) {
            Log::warning("KUCCPS sheet detection failed: " . $e->getMessage());
            return ['sheets' => ['Sheet1'], 'file_type' => $fileType];
        }
    }

    /**
     * Read rows from a sheet, starting at header_row.
     * Returns ['headers' => string[], 'rows' => array[], 'total_data_rows' => int]
     */
    public function readSheet(string $filePath, string $fileType, string $sheetName, int $headerRow = 1, int $skipTop = 0): array
    {
        if ($fileType === 'csv') {
            return $this->readCsv($filePath, $headerRow + $skipTop);
        }
        return $this->readExcel($filePath, $sheetName, $headerRow + $skipTop);
    }

    private function readCsv(string $filePath, int $headerRow): array
    {
        $rows = [];
        $headers = [];
        $handle = fopen($filePath, 'r');
        $lineNum = 0;
        $dataRows = [];

        while (($line = fgetcsv($handle, 0, ',')) !== false) {
            $lineNum++;
            if ($lineNum < $headerRow) continue;
            if ($lineNum === $headerRow) {
                $headers = array_map('trim', $line);
                continue;
            }
            if (empty(array_filter($line))) continue; // skip blank rows
            $row = [];
            foreach ($headers as $i => $h) {
                $row[$h] = trim($line[$i] ?? '');
            }
            $dataRows[] = $row;
        }
        fclose($handle);

        return [
            'headers'        => $headers,
            'rows'           => $dataRows,
            'total_data_rows' => count($dataRows),
        ];
    }

    private function readExcel(string $filePath, string $sheetName, int $headerRow): array
    {
        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($filePath);
            $sheet = $spreadsheet->getSheetByName($sheetName) ?? $spreadsheet->getActiveSheet();
            $allRows = $sheet->toArray(null, true, true, false);

            $headers = [];
            $dataRows = [];
            $isHeader = false;

            foreach ($allRows as $rowIdx => $row) {
                $lineNum = $rowIdx + 1;
                if ($lineNum < $headerRow) continue;
                if ($lineNum === $headerRow) {
                    $headers = array_values(array_map(fn($v) => trim((string)$v), $row));
                    $isHeader = true;
                    continue;
                }
                if (!$isHeader) continue;
                if (empty(array_filter($row, fn($v) => !empty(trim((string)$v))))) continue;
                $rowData = [];
                foreach ($headers as $i => $h) {
                    $rowData[$h] = trim((string)($row[$i] ?? ''));
                }
                $dataRows[] = $rowData;
            }

            return [
                'headers'         => $headers,
                'rows'            => $dataRows,
                'total_data_rows' => count($dataRows),
            ];
        } catch (\Exception $e) {
            Log::error("Excel read failed: " . $e->getMessage());
            throw new \RuntimeException("Failed to read Excel file: " . $e->getMessage());
        }
    }

    /**
     * Auto-suggest column → field mappings based on header names.
     */
    public function autoSuggestMappings(array $headers): array
    {
        $suggestions = [];
        $rules = [
            'full_name'                => ['name', 'student name', 'applicant name', 'full names', 'full name', 'names', 'surname', 'student'],
            'kcse_index_number'        => ['index', 'index no', 'kcse index', 'exam index', 'index number', 'index_no', 'reg no', 'registration'],
            'kcse_year'                => ['year', 'kcse year', 'exam year', 'kcse_year', 'year of exam', 'examination year'],
            'assigned_programme'       => ['course', 'programme', 'program', 'degree', 'assigned course', 'course name', 'programme name', 'applied course', 'placed course'],
            'gender'                   => ['gender', 'sex'],
            'national_id_number'       => ['id', 'national id', 'id no', 'national_id', 'id number', 'id_no'],
            'birth_certificate_number' => ['birth cert', 'birth certificate', 'birth_cert', 'birth certificate number'],
            'phone_number'             => ['phone', 'mobile', 'tel', 'telephone', 'phone number', 'mobile number', 'contact'],
            'email'                    => ['email', 'email address', 'e-mail', 'email_address'],
            'kuccps_reference'         => ['kuccps ref', 'placement ref', 'ref no', 'kuccps reference', 'placement reference', 'reference'],
            'county'                   => ['county', 'county of origin', 'home county'],
            'secondary_school_name'    => ['school', 'secondary school', 'school name', 'high school', 'former school'],
            'mean_grade'               => ['mean grade', 'grade', 'mean_grade', 'kcse grade', 'overall grade'],
            'cluster_points'           => ['cluster', 'cluster points', 'cluster_points', 'points'],
            'placement_category'       => ['category', 'placement category', 'type', 'student type'],
            'disability_status'        => ['disability', 'pwd', 'special needs'],
        ];

        foreach ($headers as $header) {
            $lower = strtolower(trim($header));
            foreach ($rules as $field => $aliases) {
                foreach ($aliases as $alias) {
                    if ($lower === $alias || str_contains($lower, $alias) || similar_text($lower, $alias) / max(strlen($lower), strlen($alias)) > 0.85) {
                        $suggestions[$header] = $field;
                        break 2;
                    }
                }
            }
        }

        return $suggestions;
    }

    /**
     * Apply a column mapping to transform raw row data into normalized field map.
     * $mapping: ['Column Header' => 'field_key', ...]
     */
    public function applyMapping(array $rawRow, array $mapping): array
    {
        $mapped = [];
        foreach ($mapping as $header => $field) {
            if (isset($rawRow[$header])) {
                $mapped[$field] = $rawRow[$header];
            }
        }
        return $mapped;
    }
}
