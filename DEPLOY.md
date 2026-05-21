# Deployment Guide — kafu.difbac.com

## How the deployment works

The entire website lives in this git repository as a monorepo:

```
artifacts/kafu-foundation/   ← React frontend (pre-built, dist/ is tracked in git)
artifacts/kafu-api/          ← Laravel 11 PHP API
artifacts/kafu-cms/          ← CMS admin panel (separate app, not yet deployed)
artifacts/kafu-staff/        ← Staff portal (separate app, not yet deployed)
```

The server does **not** need Node.js. The built React files are committed to git inside
`artifacts/kafu-foundation/dist/public/` and served directly by Apache.

---

## First-time server setup

### 1. Clone the repository

```bash
cd /var/www
git clone https://github.com/YOUR_ORG/kafu-website.git kafu-website
```

### 2. Configure Apache

See `artifacts/kafu-api/APACHE_SETUP.md` for the full VirtualHost config.
Key points:
- `DocumentRoot` → `artifacts/kafu-foundation/dist/public`
- `Alias /api`   → `artifacts/kafu-api/public`
- Port 80 (HTTP) — no SSL needed yet

### 3. Set up the Laravel API

```bash
cd /var/www/kafu-website/artifacts/kafu-api

composer install --no-dev --optimize-autoloader

cp .env.example .env
# Edit .env — set APP_KEY, DB credentials, CORS_ALLOWED_ORIGINS

php artisan key:generate
php artisan migrate --seed
php artisan config:cache
php artisan route:cache

chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

The `.env` settings to confirm for this server:

```
APP_URL=http://kafu.difbac.com
SESSION_SECURE_COOKIE=false
CORS_ALLOWED_ORIGINS=http://kafu.difbac.com
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...
```

### 4. Verify

```bash
curl http://kafu.difbac.com/api/stats
# → JSON response

curl -I http://kafu.difbac.com/schools/SESS
# → 200 OK, Content-Type: text/html (SPA routes to index.html)
```

---

## Routine deployments (after code changes)

On your **local machine** (this Replit workspace):

```bash
# 1. Build the frontend
pnpm --filter @workspace/kafu-foundation run build

# 2. Commit and push
git add artifacts/kafu-foundation/dist/
git add -A
git commit -m "deploy: updated build"
git push origin main
```

On the **server**:

```bash
cd /var/www/kafu-website
git pull origin main

# If there are API/database changes:
cd artifacts/kafu-api
bash server-deploy.sh
```

The `server-deploy.sh` script handles:
- Clearing all Laravel caches
- Running new migrations
- Re-seeding changed data (departments, image URLs)
- Rebuilding route/config caches
- Fixing storage permissions

---

## Adding SSL later

When you add an SSL certificate (`https://`):

1. Update `artifacts/kafu-api/.env` on the server:
   ```
   APP_URL=https://kafu.difbac.com
   SESSION_SECURE_COOKIE=true
   CORS_ALLOWED_ORIGINS=https://kafu.difbac.com
   ```
2. Run `php artisan config:cache`
3. Update the Apache VirtualHost to `*:443` with SSL directives

No code changes are needed — everything is configured via environment variables.
