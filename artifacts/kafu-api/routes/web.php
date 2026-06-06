<?php

use Illuminate\Support\Facades\Route;
use App\Models\CmsContent;
use App\Models\RepositoryItem;

// Serve React SPA for all non-API, non-sitemap, non-static routes
Route::get('/{any}', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    return response()->view('welcome');
})->where('any', '^(?!api|sitemap|robots).*$');

Route::get('/robots.txt', function () {
    $host = request()->getSchemeAndHttpHost();
    $content = implode("\n", [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/admin/",
        "Disallow: /api/healthz",
        "",
        "Sitemap: {$host}/sitemap.xml",
        "Sitemap: {$host}/sitemap-news.xml",
        "Sitemap: {$host}/sitemap-staff.xml",
        "Sitemap: {$host}/sitemap-research.xml",
        "Sitemap: {$host}/sitemap-repository.xml",
    ]);
    return response($content, 200, ['Content-Type' => 'text/plain']);
});

Route::get('/sitemap.xml', function () {
    $host = "https://kafu.ac.ke";
    $now  = now()->toAtomString();

    $staticPages = [
        ['loc' => $host . '/',                             'priority' => '1.0',  'changefreq' => 'daily'],
        ['loc' => $host . '/about',                        'priority' => '0.9',  'changefreq' => 'monthly'],
        ['loc' => $host . '/schools',                      'priority' => '0.9',  'changefreq' => 'monthly'],
        ['loc' => $host . '/programmes',                   'priority' => '0.9',  'changefreq' => 'weekly'],
        ['loc' => $host . '/admissions',                   'priority' => '0.9',  'changefreq' => 'weekly'],
        ['loc' => $host . '/staff',                        'priority' => '0.8',  'changefreq' => 'weekly'],
        ['loc' => $host . '/news',                         'priority' => '0.8',  'changefreq' => 'daily'],
        ['loc' => $host . '/events',                       'priority' => '0.8',  'changefreq' => 'daily'],
        ['loc' => $host . '/announcements',                'priority' => '0.7',  'changefreq' => 'daily'],
        ['loc' => $host . '/opportunities',                'priority' => '0.8',  'changefreq' => 'daily'],
        ['loc' => $host . '/research',                     'priority' => '0.8',  'changefreq' => 'weekly'],
        ['loc' => $host . '/research/projects',            'priority' => '0.7',  'changefreq' => 'weekly'],
        ['loc' => $host . '/research/publications',        'priority' => '0.7',  'changefreq' => 'weekly'],
        ['loc' => $host . '/research/partnerships',        'priority' => '0.6',  'changefreq' => 'monthly'],
        ['loc' => $host . '/international',                'priority' => '0.8',  'changefreq' => 'monthly'],
        ['loc' => $host . '/international/study',          'priority' => '0.8',  'changefreq' => 'monthly'],
        ['loc' => $host . '/international/visa',           'priority' => '0.7',  'changefreq' => 'monthly'],
        ['loc' => $host . '/international/partnerships',   'priority' => '0.7',  'changefreq' => 'monthly'],
        ['loc' => $host . '/international/exchange',       'priority' => '0.7',  'changefreq' => 'monthly'],
        ['loc' => $host . '/repository',                   'priority' => '0.7',  'changefreq' => 'weekly'],
        ['loc' => $host . '/repository/browse',            'priority' => '0.6',  'changefreq' => 'weekly'],
        ['loc' => $host . '/contact',                      'priority' => '0.5',  'changefreq' => 'monthly'],
        ['loc' => $host . '/student-services',             'priority' => '0.6',  'changefreq' => 'monthly'],
    ];

    $schools = ['SESS', 'SBE', 'SCIT', 'SOS', 'SHS'];
    foreach ($schools as $code) {
        $staticPages[] = ['loc' => $host . '/schools/' . strtolower($code), 'priority' => '0.8', 'changefreq' => 'monthly'];
    }

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    $sitemaps = [
        ['loc' => $host . '/sitemap-pages.xml',      'lastmod' => $now],
        ['loc' => $host . '/sitemap-news.xml',        'lastmod' => $now],
        ['loc' => $host . '/sitemap-staff.xml',       'lastmod' => $now],
        ['loc' => $host . '/sitemap-research.xml',    'lastmod' => $now],
        ['loc' => $host . '/sitemap-repository.xml',  'lastmod' => $now],
    ];

    foreach ($sitemaps as $sm) {
        $xml .= "  <sitemap>\n";
        $xml .= "    <loc>" . htmlspecialchars($sm['loc']) . "</loc>\n";
        $xml .= "    <lastmod>" . $sm['lastmod'] . "</lastmod>\n";
        $xml .= "  </sitemap>\n";
    }

    $xml .= '</sitemapindex>';

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
});

Route::get('/sitemap-pages.xml', function () {
    $host = "https://kafu.ac.ke";

    $staticPages = [
        ['loc' => '/',                              'priority' => '1.0',  'changefreq' => 'daily'],
        ['loc' => '/about',                         'priority' => '0.9',  'changefreq' => 'monthly'],
        ['loc' => '/schools',                       'priority' => '0.9',  'changefreq' => 'monthly'],
        ['loc' => '/programmes',                    'priority' => '0.9',  'changefreq' => 'weekly'],
        ['loc' => '/admissions',                    'priority' => '0.9',  'changefreq' => 'weekly'],
        ['loc' => '/staff',                         'priority' => '0.8',  'changefreq' => 'weekly'],
        ['loc' => '/news',                          'priority' => '0.8',  'changefreq' => 'daily'],
        ['loc' => '/events',                        'priority' => '0.8',  'changefreq' => 'daily'],
        ['loc' => '/announcements',                 'priority' => '0.7',  'changefreq' => 'daily'],
        ['loc' => '/opportunities',                 'priority' => '0.8',  'changefreq' => 'daily'],
        ['loc' => '/research',                      'priority' => '0.8',  'changefreq' => 'weekly'],
        ['loc' => '/research/projects',             'priority' => '0.7',  'changefreq' => 'weekly'],
        ['loc' => '/research/publications',         'priority' => '0.7',  'changefreq' => 'weekly'],
        ['loc' => '/research/partnerships',         'priority' => '0.6',  'changefreq' => 'monthly'],
        ['loc' => '/international',                 'priority' => '0.8',  'changefreq' => 'monthly'],
        ['loc' => '/international/study',           'priority' => '0.8',  'changefreq' => 'monthly'],
        ['loc' => '/international/visa',            'priority' => '0.7',  'changefreq' => 'monthly'],
        ['loc' => '/international/partnerships',    'priority' => '0.7',  'changefreq' => 'monthly'],
        ['loc' => '/international/exchange',        'priority' => '0.7',  'changefreq' => 'monthly'],
        ['loc' => '/repository',                    'priority' => '0.7',  'changefreq' => 'weekly'],
        ['loc' => '/repository/browse',             'priority' => '0.6',  'changefreq' => 'weekly'],
        ['loc' => '/contact',                       'priority' => '0.5',  'changefreq' => 'monthly'],
        ['loc' => '/student-services',              'priority' => '0.6',  'changefreq' => 'monthly'],
        ['loc' => '/schools/sess',                  'priority' => '0.8',  'changefreq' => 'monthly'],
        ['loc' => '/schools/sbe',                   'priority' => '0.8',  'changefreq' => 'monthly'],
        ['loc' => '/schools/scit',                  'priority' => '0.8',  'changefreq' => 'monthly'],
        ['loc' => '/schools/sos',                   'priority' => '0.8',  'changefreq' => 'monthly'],
        ['loc' => '/schools/shs',                   'priority' => '0.8',  'changefreq' => 'monthly'],
    ];

    $programmeSlugs = CmsContent::where('type', 'programme')->where('status', 'published')
        ->get(['slug', 'category', 'updated_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    foreach ($staticPages as $p) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . $p['loc']) . "</loc>\n";
        $xml .= "    <changefreq>" . $p['changefreq'] . "</changefreq>\n";
        $xml .= "    <priority>" . $p['priority'] . "</priority>\n";
        $xml .= "  </url>\n";
    }

    foreach ($programmeSlugs as $prog) {
        $school = strtolower($prog->category ?? 'sess');
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . '/programmes/' . $school . '/' . $prog->slug) . "</loc>\n";
        $xml .= "    <lastmod>" . $prog->updated_at->toAtomString() . "</lastmod>\n";
        $xml .= "    <changefreq>monthly</changefreq>\n";
        $xml .= "    <priority>0.7</priority>\n";
        $xml .= "  </url>\n";
    }

    $xml .= '</urlset>';

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
});

Route::get('/sitemap-news.xml', function () {
    $host = "https://kafu.ac.ke";

    $news = CmsContent::whereIn('type', ['news', 'article'])->where('status', 'published')
        ->orderByDesc('published_at')->limit(500)->get(['slug', 'type', 'updated_at', 'published_at']);

    $events = CmsContent::where('type', 'event')->where('status', 'published')
        ->orderByDesc('published_at')->limit(200)->get(['slug', 'updated_at', 'published_at']);

    $announcements = CmsContent::where('type', 'announcement')->where('status', 'published')
        ->orderByDesc('published_at')->limit(200)->get(['slug', 'updated_at', 'published_at']);

    $opportunities = CmsContent::where('type', 'opportunity')->where('status', 'published')
        ->orderByDesc('published_at')->limit(200)->get(['slug', 'updated_at', 'published_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    foreach ($news as $item) {
        $urlPath = $item->type === 'article' ? '/articles/' : '/news/';
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . $urlPath . $item->slug) . "</loc>\n";
        $xml .= "    <lastmod>" . ($item->published_at ?? $item->updated_at)->toAtomString() . "</lastmod>\n";
        $xml .= "    <changefreq>weekly</changefreq>\n";
        $xml .= "    <priority>0.7</priority>\n";
        $xml .= "  </url>\n";
    }

    foreach ($events as $item) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . '/events/' . $item->slug) . "</loc>\n";
        $xml .= "    <lastmod>" . ($item->published_at ?? $item->updated_at)->toAtomString() . "</lastmod>\n";
        $xml .= "    <changefreq>weekly</changefreq>\n";
        $xml .= "    <priority>0.6</priority>\n";
        $xml .= "  </url>\n";
    }

    foreach ($announcements as $item) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . '/announcements/' . $item->slug) . "</loc>\n";
        $xml .= "    <lastmod>" . ($item->published_at ?? $item->updated_at)->toAtomString() . "</lastmod>\n";
        $xml .= "    <changefreq>weekly</changefreq>\n";
        $xml .= "    <priority>0.5</priority>\n";
        $xml .= "  </url>\n";
    }

    foreach ($opportunities as $item) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . '/opportunities/' . $item->slug) . "</loc>\n";
        $xml .= "    <lastmod>" . ($item->published_at ?? $item->updated_at)->toAtomString() . "</lastmod>\n";
        $xml .= "    <changefreq>daily</changefreq>\n";
        $xml .= "    <priority>0.7</priority>\n";
        $xml .= "  </url>\n";
    }

    $xml .= '</urlset>';

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
        'Cache-Control' => 'public, max-age=1800',
    ]);
});

Route::get('/sitemap-staff.xml', function () {
    $host = "https://kafu.ac.ke";

    $staticSlugs = [
        'prof-kelvin-k-omieno', 'dr-annette-o-busula', 'dr-cyprian-mabonga',
        'prof-peter-n-mwita', 'dr-george-otieno', 'dr-faith-simiyu',
        'dr-samuel-odhiambo', 'dr-lucy-anyango', 'mr-james-wafula',
        'ms-grace-akinyi', 'dr-daniel-kipkemei', 'mr-robert-otieno',
        'dr-josephine-naliaka', 'ms-phyllis-cherop', 'dr-charles-omondi',
        'ms-margaret-atieno', 'dr-david-amunga', 'mr-peter-barasa',
        'dr-jane-muthoni', 'mr-john-simiyu', 'dr-mary-njagi',
        'mr-samuel-chege', 'dr-alice-wanjiru', 'mr-paul-kibet',
    ];

    $cmsStaff = CmsContent::where('type', 'staff')->where('status', 'published')
        ->get(['slug', 'updated_at']);
    $cmsSlugs = $cmsStaff->pluck('slug')->toArray();
    $allSlugs = array_unique(array_merge($staticSlugs, $cmsSlugs));

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    foreach ($allSlugs as $slug) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . '/staff/' . $slug) . "</loc>\n";
        $xml .= "    <changefreq>monthly</changefreq>\n";
        $xml .= "    <priority>0.6</priority>\n";
        $xml .= "  </url>\n";
    }

    $xml .= '</urlset>';

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
});

Route::get('/sitemap-research.xml', function () {
    $host = "https://kafu.ac.ke";

    $projects = CmsContent::where('type', 'research_project')->where('status', 'published')
        ->get(['slug', 'updated_at']);
    $publications = CmsContent::where('type', 'research_publication')->where('status', 'published')
        ->get(['slug', 'updated_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    foreach ($projects as $item) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . '/research/projects/' . $item->slug) . "</loc>\n";
        $xml .= "    <lastmod>" . $item->updated_at->toAtomString() . "</lastmod>\n";
        $xml .= "    <changefreq>monthly</changefreq>\n";
        $xml .= "    <priority>0.7</priority>\n";
        $xml .= "  </url>\n";
    }

    foreach ($publications as $item) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . '/research/publications/' . $item->slug) . "</loc>\n";
        $xml .= "    <lastmod>" . $item->updated_at->toAtomString() . "</lastmod>\n";
        $xml .= "    <changefreq>monthly</changefreq>\n";
        $xml .= "    <priority>0.7</priority>\n";
        $xml .= "  </url>\n";
    }

    $xml .= '</urlset>';

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
});

Route::get('/sitemap-repository.xml', function () {
    $host = "https://kafu.ac.ke";

    $items = RepositoryItem::published()
        ->orderByDesc('updated_at')
        ->limit(2000)
        ->get(['slug', 'updated_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    foreach ($items as $item) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($host . '/repository/items/' . $item->slug) . "</loc>\n";
        $xml .= "    <lastmod>" . $item->updated_at->toAtomString() . "</lastmod>\n";
        $xml .= "    <changefreq>monthly</changefreq>\n";
        $xml .= "    <priority>0.6</priority>\n";
        $xml .= "  </url>\n";
    }

    $xml .= '</urlset>';

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=UTF-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
});
