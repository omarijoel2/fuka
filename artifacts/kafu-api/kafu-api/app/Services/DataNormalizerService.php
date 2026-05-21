<?php

namespace App\Services;

class DataNormalizerService
{
    // ── Full name ─────────────────────────────────────────────────────────────
    public function normalizeName(string $name): string
    {
        $name = trim(preg_replace('/\s+/', ' ', $name));
        return mb_convert_case($name, MB_CASE_TITLE, 'UTF-8');
    }

    public function validateName(string $name): ?string
    {
        if (empty(trim($name))) return 'Name is required';
        if (preg_match('/\d/', $name)) return 'Name contains numbers';
        if (mb_strlen(trim($name)) < 3) return 'Name is too short';
        return null;
    }

    // ── KCSE Index number ─────────────────────────────────────────────────────
    // Supported formats: 12345678901 | 12345678901/2025 | 12345678901-2025 | 12345678901 2025
    public function normalizeKcseIndex(string $raw): array
    {
        $raw = trim($raw);
        $year = null;
        $index = $raw;

        // Try to extract embedded year
        if (preg_match('/^(\d{11})[\/\-\s](\d{4})$/', $raw, $m)) {
            $index = $m[1];
            $year  = $m[2];
        } elseif (preg_match('/^(\d{11})$/', $raw, $m)) {
            $index = $m[1];
        } else {
            // strip non-numeric characters, take first 11 digits
            $digits = preg_replace('/\D/', '', $raw);
            $index  = substr($digits, 0, 11);
            // If remaining digits look like a year (4 digits after the 11)
            if (strlen($digits) > 11) {
                $possibleYear = substr($digits, 11, 4);
                if (strlen($possibleYear) === 4 && (int)$possibleYear >= 2000) {
                    $year = $possibleYear;
                }
            }
        }

        return ['index' => $index, 'year' => $year];
    }

    public function validateKcseIndex(string $index): ?string
    {
        if (empty($index)) return 'KCSE index number is required';
        if (!preg_match('/^\d{11}$/', $index)) return "Index number must be exactly 11 digits (got: {$index})";
        return null;
    }

    // ── Phone number ──────────────────────────────────────────────────────────
    public function normalizePhone(?string $phone): ?string
    {
        if (empty($phone)) return null;
        $digits = preg_replace('/\D/', '', $phone);

        if (strlen($digits) === 9) {
            return '+254' . $digits;  // e.g. 712345678
        }
        if (strlen($digits) === 10 && substr($digits, 0, 1) === '0') {
            return '+254' . substr($digits, 1);  // 0712345678
        }
        if (strlen($digits) === 12 && substr($digits, 0, 3) === '254') {
            return '+' . $digits;
        }
        if (strlen($digits) === 13 && substr($digits, 0, 4) === '2540') {
            return '+254' . substr($digits, 4);
        }
        return '+' . $digits;
    }

    public function validatePhone(?string $phone): ?string
    {
        if (empty($phone)) return null;
        $normalized = $this->normalizePhone($phone);
        if (!preg_match('/^\+254[17]\d{8}$/', $normalized ?? '')) {
            return "Invalid Kenyan phone number: {$phone}";
        }
        return null;
    }

    // ── Email ─────────────────────────────────────────────────────────────────
    public function normalizeEmail(?string $email): ?string
    {
        if (empty($email)) return null;
        return strtolower(trim($email));
    }

    public function validateEmail(?string $email): ?string
    {
        if (empty($email)) return null;
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return "Invalid email address: {$email}";
        }
        return null;
    }

    // ── Gender ────────────────────────────────────────────────────────────────
    public function normalizeGender(?string $gender): ?string
    {
        if (empty($gender)) return null;
        $g = strtolower(trim($gender));
        if (in_array($g, ['m', 'male', 'boy'])) return 'male';
        if (in_array($g, ['f', 'female', 'girl', 'woman'])) return 'female';
        return $gender;
    }

    public function validateGender(?string $gender): ?string
    {
        if (empty($gender)) return null;
        $n = $this->normalizeGender($gender);
        if (!in_array($n, ['male', 'female'])) {
            return "Unknown gender value: {$gender}";
        }
        return null;
    }

    // ── Programme name normalization for fuzzy matching ───────────────────────
    public function normalizeProgrammeName(string $name): string
    {
        $n = strtolower(trim($name));
        // Expand common abbreviations
        $n = preg_replace('/\bbsc\b/', 'bachelor of science', $n);
        $n = preg_replace('/\bba\b/', 'bachelor of arts', $n);
        $n = preg_replace('/\bbed\b/', 'bachelor of education', $n);
        $n = preg_replace('/\bmba\b/', 'master of business administration', $n);
        $n = preg_replace('/\bmsc\b/', 'master of science', $n);
        $n = preg_replace('/\bphd\b/', 'doctor of philosophy', $n);
        // Normalize & vs and
        $n = preg_replace('/\s*&\s*/', ' and ', $n);
        // Strip punctuation except spaces
        $n = preg_replace('/[^\w\s]/', ' ', $n);
        // Collapse spaces
        $n = preg_replace('/\s+/', ' ', trim($n));
        return $n;
    }

    // ── Row hash for idempotent processing ────────────────────────────────────
    public function rowHash(string $indexNumber, string $kcseYear, string $academicYear): string
    {
        return hash('sha256', "{$indexNumber}|{$kcseYear}|{$academicYear}");
    }
}
