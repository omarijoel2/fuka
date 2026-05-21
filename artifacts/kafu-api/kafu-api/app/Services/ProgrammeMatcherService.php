<?php

namespace App\Services;

use App\Models\AdmissionProgramme;
use App\Models\ProgrammeAlias;
use Illuminate\Support\Collection;

class ProgrammeMatcherService
{
    public function __construct(private DataNormalizerService $normalizer) {}

    /**
     * Match a raw programme name to an official KAFU programme.
     * Returns ['programme_id', 'status', 'confidence', 'programme_name', 'suggestions']
     */
    public function match(string $rawName): array
    {
        $normalized = $this->normalizer->normalizeProgrammeName($rawName);

        // 1. Exact code match
        $byCode = AdmissionProgramme::whereRaw('LOWER(programme_code) = ?', [strtolower(trim($rawName))])->first();
        if ($byCode) {
            return $this->hit($byCode, 'exact', 100);
        }

        // 2. Exact name match (case-insensitive)
        $byName = AdmissionProgramme::whereRaw('LOWER(programme_name) = ?', [strtolower(trim($rawName))])->first();
        if ($byName) {
            return $this->hit($byName, 'exact', 100);
        }

        // 3. Alias match (exact normalized)
        $alias = ProgrammeAlias::where('normalized_alias', $normalized)->where('is_active', true)->first();
        if ($alias) {
            $prog = AdmissionProgramme::find($alias->programme_id);
            if ($prog) {
                return $this->hit($prog, 'alias', $alias->confidence_default);
            }
        }

        // 4. Fuzzy match against all programme names + aliases
        $all = AdmissionProgramme::select('id', 'programme_name', 'programme_code', 'school_code', 'level')->get();
        $best = $this->fuzzyBestMatch($normalized, $all);

        if ($best && $best['confidence'] >= 80) {
            $status = $best['confidence'] >= 90 ? 'fuzzy_high' : 'fuzzy_low';
            return [
                'programme_id'    => $best['programme']->id,
                'programme_name'  => $best['programme']->programme_name,
                'status'          => $status,
                'confidence'      => $best['confidence'],
                'suggestions'     => $this->topSuggestions($normalized, $all, 5),
            ];
        }

        // 5. Low-confidence or unmatched — return suggestions only
        return [
            'programme_id'   => null,
            'programme_name' => null,
            'status'         => 'unmatched',
            'confidence'     => 0,
            'suggestions'    => $this->topSuggestions($normalized, $all, 5),
        ];
    }

    private function hit(AdmissionProgramme $prog, string $status, int $confidence): array
    {
        return [
            'programme_id'   => $prog->id,
            'programme_name' => $prog->programme_name,
            'status'         => $status,
            'confidence'     => $confidence,
            'suggestions'    => [],
        ];
    }

    private function fuzzyBestMatch(string $needle, Collection $programmes): ?array
    {
        $best = null;
        $bestScore = 0;

        foreach ($programmes as $prog) {
            $haystack = $this->normalizer->normalizeProgrammeName($prog->programme_name);
            $score = $this->similarityScore($needle, $haystack);
            if ($score > $bestScore) {
                $bestScore = $score;
                $best = ['programme' => $prog, 'confidence' => $score];
            }
        }

        return $best;
    }

    private function topSuggestions(string $needle, Collection $programmes, int $n): array
    {
        $scored = $programmes->map(function ($prog) use ($needle) {
            $haystack = $this->normalizer->normalizeProgrammeName($prog->programme_name);
            return [
                'id'         => $prog->id,
                'name'       => $prog->programme_name,
                'code'       => $prog->programme_code,
                'school'     => $prog->school_code,
                'level'      => $prog->level,
                'confidence' => $this->similarityScore($needle, $haystack),
            ];
        });

        return $scored->sortByDesc('confidence')->take($n)->values()->toArray();
    }

    /**
     * Simple similarity: token overlap + Levenshtein fallback (0-100)
     */
    private function similarityScore(string $a, string $b): int
    {
        if ($a === $b) return 100;

        $aTokens = array_filter(explode(' ', $a));
        $bTokens = array_filter(explode(' ', $b));

        if (empty($aTokens) || empty($bTokens)) return 0;

        // Token overlap score
        $intersection = count(array_intersect($aTokens, $bTokens));
        $union        = count(array_unique(array_merge($aTokens, $bTokens)));
        $jaccard      = $union > 0 ? ($intersection / $union) : 0;

        // Levenshtein on normalized strings (shorter strings only)
        $levScore = 0;
        if (mb_strlen($a) <= 100 && mb_strlen($b) <= 100) {
            $maxLen   = max(mb_strlen($a), mb_strlen($b));
            $lev      = levenshtein($a, $b);
            $levScore = $maxLen > 0 ? max(0, 1 - ($lev / $maxLen)) : 0;
        }

        $combined = ($jaccard * 0.7) + ($levScore * 0.3);
        return (int) round($combined * 100);
    }
}
