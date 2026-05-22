# Apache Setup — kafu.difbac.com

The Laravel API and React frontend share one domain. Apache maps:

- `http://kafu.difbac.com/`    → React static files (built `dist/public/`)
- `http://kafu.difbac.com/api` → Laravel PHP app (reverse-proxied to local port 8080)

**Why ProxyPass, not `Alias /api`?**
When Apache uses `Alias /api /laravel/public`, PHP receives
`SCRIPT_NAME = /api/index.php`. Laravel's Symfony HTTP kernel then strips
`/api` from `REQUEST_URI`, computing `pathInfo = /stats` instead of
`/api/stats`. This causes every API call to hit the web.php catch-all and
return the welcome/HTML page instead of JSON. ProxyPass preserves the full
URI so Laravel sees `/api/stats` and routes correctly every time.

After `git clone` / `git pull`, the repo lives at `/var/www/fuka/`.
Adjust all paths below if you cloned it elsewhere.

---

## 1. Required Apache modules

```bash
sudo a2enmod rewrite proxy proxy_http headers
sudo systemctl restart apache2
```

---

## 2. Install the Laravel systemd service

The API must run as a persistent service on port 8080. Copy the provided
unit file and enable it:

```bash
sudo cp /var/www/fuka/artifacts/kafu-api/kafu-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable kafu-api
sudo systemctl start kafu-api
sudo systemctl status kafu-api   # should show "active (running)"
```

---

## 3. VirtualHost configuration

Edit (or create) `/etc/apache2/sites-available/kafu.conf`:

```apache
<VirtualHost *:80>
    ServerName kafu.difbac.com

    # ── React frontend ──────────────────────────────────────────────────────
    DocumentRoot /var/www/fuka/artifacts/kafu-foundation/dist/public

    <Directory /var/www/fuka/artifacts/kafu-foundation/dist/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # ── Laravel API (reverse-proxied to Laravel service on port 8080) ───────
    # ProxyPass MUST come before any Directory block so it takes priority.
    # It preserves the full /api/... URI — Laravel routes match correctly.
    ProxyPreserveHost On
    ProxyPass        /api http://127.0.0.1:8080/api
    ProxyPassReverse /api http://127.0.0.1:8080/api

    # Pass real client IP to Laravel
    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Real-IP %{REMOTE_ADDR}s

    ErrorLog  ${APACHE_LOG_DIR}/kafu_error.log
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

## 4. Laravel .env settings (production)

```
APP_URL=http://kafu.difbac.com
APP_ENV=production
APP_DEBUG=false
SESSION_DOMAIN=kafu.difbac.com
SESSION_SECURE_COOKIE=false
CORS_ALLOWED_ORIGINS=http://kafu.difbac.com
```

---

## 5. First-time setup (after git clone)

```bash
cd /var/www/fuka/artifacts/kafu-api

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Create and configure the .env file
cp .env.example .env
nano .env    # fill in APP_KEY, DB credentials, etc.

php artisan key:generate

# Run migrations and seed all data
php artisan migrate --seed

# Build caches
php artisan config:cache
php artisan route:cache

# Fix permissions for the www-data service user
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## 6. Subsequent deployments (after git pull)

```bash
cd /var/www/fuka
git pull origin main

cd artifacts/kafu-api
bash server-deploy.sh
```

---

## 7. Verify it works

```bash
# API must return JSON — not HTML
curl http://kafu.difbac.com/api/stats
# Expected: {"data": {...}}

# React SPA must load
curl -I http://kafu.difbac.com/about
# Expected: HTTP 200, Content-Type: text/html

# Laravel service health (internal)
curl http://127.0.0.1:8080/up
# Expected: HTTP 200
```

---

## 8. HTTPS / SSL (when ready)

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d kafu.difbac.com
```

After SSL is active, update `.env`:
```
APP_URL=https://kafu.difbac.com
SESSION_SECURE_COOKIE=true
CORS_ALLOWED_ORIGINS=https://kafu.difbac.com
```

Update the ProxyPass and RequestHeader in Apache config:
```apache
ProxyPass        /api http://127.0.0.1:8080/api
ProxyPassReverse /api http://127.0.0.1:8080/api
RequestHeader set X-Forwarded-Proto "https"
```
