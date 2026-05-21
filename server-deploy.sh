#!/bin/bash
# ============================================================
# KAFU Website — Server Deploy Fix Script
# Run this from the Laravel root (e.g. /home/user/kafu-api/)
# Usage: bash server-deploy.sh
# ============================================================
set -e

echo ""
echo "=== KAFU Server Deploy Fix ==="
echo ""

# 1. Clear all Laravel caches first
echo "[1/6] Clearing caches..."
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear
echo "      Done."

# 2. Run all pending database migrations
echo "[2/6] Running migrations..."
php artisan migrate --force
echo "      Done."

# 3. Seed departments (creates all 14 departments across 5 schools)
echo "[3/6] Seeding departments..."
php artisan db:seed --class=DepartmentSeeder --no-interaction
echo "      Done."

# 4. Update image URLs in database (old kafu.ac.ke URLs -> local /imgs/ paths)
echo "[4/6] Updating image URLs in database..."
php artisan db:seed --class=UpdateImageUrlsSeeder --no-interaction
echo "      Done."

# 5. Rebuild optimised caches
echo "[5/6] Rebuilding route and config caches..."
php artisan route:cache
php artisan config:cache
echo "      Done."

# 6. Fix storage permissions
echo "[6/6] Fixing storage permissions..."
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
echo "      Done."

echo ""
echo "=== All done! ==="
echo ""
echo "REMINDER: Make sure the imgs/ folder has been uploaded to public_html/imgs/"
echo "          (download kafu-imgs.zip and extract it into public_html/)"
echo ""
