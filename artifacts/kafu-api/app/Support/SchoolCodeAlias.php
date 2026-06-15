<?php

namespace App\Support;

class SchoolCodeAlias
{
    /**
     * Legacy/abbreviation school codes mapped to their canonical code.
     * Keys and values are upper-case. Old external links and bookmarks
     * (e.g. /schools/sohs) must resolve to the live school (SHS).
     */
    protected const ALIASES = [
        'SOHS'  => 'SHS',   // School of Health Sciences
        'SOSCI' => 'SOS',   // School of Science
        'SOBE'  => 'SBE',   // School of Business & Economics
        'SOE'   => 'SESS',  // School of Education and Social Sciences
    ];

    public static function canonical(string $code): string
    {
        $code = strtoupper(trim($code));
        return self::ALIASES[$code] ?? $code;
    }
}
