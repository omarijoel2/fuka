# Apache Setup — kafu.difbac.com (HTTP)

The Laravel API and React frontend share one domain. Apache maps:

- `http://kafu.difbac.com/`    → React static files (built `dist/public/`)
- `http://kafu.difbac.com/api` → Laravel PHP app (`public/index.php`)

After `git clone` / `git pull`, the repo lives at e.g. `/var/www/kafu-website/`.
Adjust all paths below to match where you cloned it.

---

## 1. Required Apache modules

```bash
sudo a2enmod rewrite alias php8.2
sudo systemctl restart apache2
```

---

## 2. VirtualHost configuration

Edit (or create) `/etc/apache2/sites-available/kafu.conf`:

```apache
<VirtualHost *:80>
    ServerName kafu.difbac.com

    # ── React frontend ──────────────────────────────────────────────────────
    DocumentRoot /var/www/kafu-website/artifacts/kafu-foundation/dist/public

    <Directory /var/www/kafu-website/artifacts/kafu-foundation/dist/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # ── Laravel API (aliased at /api) ────────────────────────────────────────
    Alias /api /var/www/kafu-website/artifacts/kafu-api/public

    <Directory /var/www/kafu-website/artifacts/kafu-api/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/kafu_error.log
    CustomLog ${APACHE_LOG_DIR}/kafu_access.log combined
</VirtualHost>
```

Enable and reload:

```bash
sudo a2ensite kafu.conf
sudo a2dissite 000-default.conf   # disable default if needed
sudo systemctl reload apache2
```

---

## 3. Laravel .env settings

```
APP_URL=http://kafu.difbac.com
SESSION_DOMAIN=kafu.difbac.com
SESSION_SECURE_COOKIE=false
CORS_ALLOWED_ORIGINS=http://kafu.difbac.com
```

---

## 4. First-time setup (after git clone)

```bash
cd /var/www/kafu-website/artifacts/kafu-api

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Create and configure the .env file
cp .env.example .env
nano .env    # fill in APP_KEY (generate below), DB credentials, etc.

php artisan key:generate

# Run migrations and seed all data
php artisan migrate --seed

# Build caches
php artisan config:cache
php artisan route:cache

# Fix permissions for Apache (www-data)
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## 5. Subsequent deployments (after git pull)

```bash
cd /var/www/kafu-website
git pull origin main

cd artifacts/kafu-api
bash server-deploy.sh
```

---

## 6. Verify it works

```bash
curl http://kafu.difbac.com/api/stats
# Should return JSON — {"data": {...}}

curl -I http://kafu.difbac.com/about
# Should return HTTP 200 with Content-Type: text/html (SPA fallback)
```
