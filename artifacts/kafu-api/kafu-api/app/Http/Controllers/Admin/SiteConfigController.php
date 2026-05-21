<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use Illuminate\Http\Request;

class SiteConfigController extends Controller
{
    public function getGroup(string $group)
    {
        $allowed = ['homepage', 'navigation', 'site', 'seo', 'contact'];
        if (!in_array($group, $allowed)) {
            return response()->json(['message' => 'Unknown config group'], 404);
        }
        return response()->json(SiteConfig::getGroup($group));
    }

    public function updateGroup(Request $request, string $group)
    {
        $allowed = ['homepage', 'navigation', 'site', 'seo', 'contact'];
        if (!in_array($group, $allowed)) {
            return response()->json(['message' => 'Unknown config group'], 404);
        }
        $data = $request->all();
        SiteConfig::setGroup($group, $data);
        return response()->json(['message' => 'Config updated', 'data' => SiteConfig::getGroup($group)]);
    }

    public function all()
    {
        $groups = ['homepage', 'navigation', 'site', 'seo', 'contact'];
        $result = [];
        foreach ($groups as $g) {
            $result[$g] = SiteConfig::getGroup($g);
        }
        return response()->json($result);
    }
}
