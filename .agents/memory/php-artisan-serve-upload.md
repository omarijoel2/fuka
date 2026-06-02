---
name: PHP artisan serve upload limits
description: How to raise PHP upload_max_filesize when running Laravel via php artisan serve on Replit
---

## The Rule

Never pass `-d` PHP ini flags to `php artisan serve` — those flags only affect the artisan CLI wrapper process, **not** the child `php -S` process it spawns to handle HTTP requests.

**Why:** `php artisan serve` internally runs `exec("php -S ...")` as a subprocess. The parent process inherits your `-d` flags; the child does not. The uploaded file still hits the system default `upload_max_filesize = 2M`, so any file over 2 MB triggers `UPLOAD_ERR_INI_SIZE` and Laravel's validation returns "The file failed to upload."

**How to apply:** Bypass `artisan serve` entirely. Run `php -S` directly, **from inside the `public/` directory** (because `server.php` uses `getcwd()` to locate `index.php`), with an absolute path to the router:

```
cd /home/runner/workspace/artifacts/kafu-api/public && \
  php -d upload_max_filesize=20M -d post_max_size=25M \
  -S 0.0.0.0:$PORT \
  /home/runner/workspace/artifacts/kafu-api/vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php
```

This is set in `artifacts/api-server/.replit-artifact/artifact.toml` under `[services.development] run`.

Note: production deployment uses a real web server (Apache/Nginx on cPanel) so the ini settings there must be configured via `php.ini` or `.htaccess` — not this workaround.
