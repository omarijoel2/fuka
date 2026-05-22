#!/bin/bash
# ============================================================
# KAFU Website — Server Deploy Script
# Run this from inside the kafu-api directory after git pull.
# Usage: bash artifacts/kafu-api/server-deploy.sh
# Or, if you cd into the api dir: bash server-deploy.sh
# ============================================================
set -e

echo ""
echo "=== KAFU Server Deploy ==="
echo ""

# 1. Clear all caches so stale config/routes don't cause 500s
echo "[1/7] Clearing caches..."
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear
echo "      Done."

# 2. Run all pending database migrations
echo "[2/7] Running migrations..."
php artisan migrate --force
echo "      Done."

# 3. Seed governance data (council, management, directorates)
#    Uses firstOrCreate — safe to run repeatedly without duplicates
echo "[3/7] Seeding governance data (directorates, council, management)..."
php artisan db:seed --class=GovernanceSeeder --no-interaction
echo "      Done."

# 4. Seed departments (creates all departments across 5 schools)
echo "[4/7] Seeding departments..."
php artisan db:seed --class=DepartmentSeeder --no-interaction
echo "      Done."

# 5. Update image URLs (old kafu.ac.ke URLs -> local /imgs/ paths)
echo "[5/7] Updating image URLs in database..."
php artisan db:seed --class=UpdateImageUrlsSeeder --no-interaction
echo "      Done."

# 6. Rebuild optimised caches
echo "[6/7] Rebuilding route and config caches..."
php artisan route:cache
php artisan config:cache
echo "      Done."

# 7. Fix storage/cache permissions for Apache www-data
echo "[7/7] Fixing storage permissions..."
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
echo "      Done."

# Restart the Laravel API service so route/config caches take effect
if systemctl is-active --quiet kafu-api 2>/dev/null; then
    echo ""
    echo "Restarting kafu-api service..."
    sudo systemctl restart kafu-api
    echo "      Done."
fi

echo ""
echo "=== Deploy complete ==="
echo ""
