<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class AdminAuth
{
    /**
     * Inline auth check used by api.php route closures.
     * Aborts with 401 / 403 if the bearer token is missing or insufficient.
     */
    public static function check(Request $request): void
    {
        $token = $request->bearerToken();

        if (!$token) {
            abort(response()->json(['message' => 'Unauthenticated.'], 401));
        }

        $pat  = PersonalAccessToken::findToken($token);
        $user = $pat?->tokenable;

        if (!$user) {
            abort(response()->json(['message' => 'Unauthenticated.'], 401));
        }

        if (!$user->isCentralAdmin()) {
            abort(response()->json(['message' => 'Unauthorized.'], 403));
        }
    }
}
