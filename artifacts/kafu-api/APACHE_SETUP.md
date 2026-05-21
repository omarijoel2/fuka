# Apache Setup — kafu.difbac.com

The Laravel API lives at `/api` on the same domain as the React frontend.
Apache needs two separate `DocumentRoot` directives (via `Alias`) so that:

- `kafu.difbac.com/`    → React static files (`dist/public/`)
- `kafu.difbac.com/api` → Laravel PHP app (`public/`)

## VirtualHost configuration

Add this inside your existing `<VirtualHost *:443>` block (adjust paths to match where you uploaded the files):

```apache
<VirtualHost *:443>
    ServerName kafu.difbac.com

    # ── React frontend (main site) ─────────────────────────────────────────
    DocumentRoot /var/www/kafu/frontend/dist/public

    <Directory /var/www/kafu/frontend/dist/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # SPA fallback — serve index.html for all routes
        FallbackResource /index.html
    </Directory>

    # ── Laravel API ────────────────────────────────────────────────────────
    Alias /api /var/www/kafu/api/public

    <Directory /var/www/kafu/api/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # SSL (already configured — leave as-is)
    # SSLEngine on
    # SSLCertificateFile ...
    # SSLCertificateKeyFile ...
</VirtualHost>
```

## Required Apache modules

Ensure these are enabled:

```bash
sudo a2enmod rewrite alias
sudo systemctl restart apache2
```

## Laravel .env settings for this setup

```
APP_URL=https://kafu.difbac.com
SESSION_DOMAIN=kafu.difbac.com
CORS_ALLOWED_ORIGINS=https://kafu.difbac.com
```

## After uploading and configuring Apache

```bash
cd /var/www/kafu/api
composer install --no-dev --optimize-autoloader
cp .env.example .env
# Edit .env with your database credentials, then:
php artisan key:generate
php artisan migrate:fresh --seed
php artisan config:cache
php artisan route:cache
php artisan view:clear
```

## Verify it works

```bash
curl https://kafu.difbac.com/api/stats
# Should return JSON with university statistics
```
