<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use Illuminate\Http\Request;

class SiteConfigController extends Controller
{
    private const ALLOWED = ['homepage', 'navigation', 'site', 'seo', 'contact', 'branding', 'admissions_fees', 'permissions', 'staff_documents'];

    public function getGroup(string $group)
    {
        if (!in_array($group, self::ALLOWED)) {
            return response()->json(['message' => 'Unknown config group'], 404);
        }
        return response()->json(SiteConfig::getGroup($group));
    }

    public function updateGroup(Request $request, string $group)
    {
        if (!in_array($group, self::ALLOWED)) {
            return response()->json(['message' => 'Unknown config group'], 404);
        }
        $data = $request->all();
        SiteConfig::setGroup($group, $data);
        return response()->json(['message' => 'Config updated', 'data' => SiteConfig::getGroup($group)]);
    }

    public function all()
    {
        $result = [];
        foreach (self::ALLOWED as $g) {
            $result[$g] = SiteConfig::getGroup($g);
        }
        return response()->json($result);
    }
}
