<?php

if (!function_exists('kafuSanitizeHtml')) {
    /**
     * Sanitize editor-authored HTML against an allowlist so that page body
     * content rendered on the public site cannot inject scripts, event
     * handlers, or unsafe URI schemes (stored XSS protection).
     */
    function kafuSanitizeHtml(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return $html;
        }

        static $purifier = null;
        if ($purifier === null) {
            $config = \HTMLPurifier_Config::createDefault();
            $config->set('HTML.Allowed',
                'p,br,hr,h1,h2,h3,h4,h5,h6,strong,b,em,i,u,s,blockquote,pre,code,'
                . 'ul,ol,li,a[href|title|target|rel],img[src|alt|title|width|height],'
                . 'table,thead,tbody,tr,th,td,span,div');
            $config->set('HTML.TargetBlank', true);
            $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true, 'tel' => true]);
            $config->set('Attr.AllowedFrameTargets', ['_blank']);
            $cachePath = storage_path('app/htmlpurifier');
            if (!is_dir($cachePath)) {
                @mkdir($cachePath, 0775, true);
            }
            if (is_dir($cachePath) && is_writable($cachePath)) {
                $config->set('Cache.SerializerPath', $cachePath);
            } else {
                $config->set('Cache.DefinitionImpl', null);
            }
            $purifier = new \HTMLPurifier($config);
        }

        return $purifier->purify($html);
    }
}
