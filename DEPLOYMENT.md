# Verse Next Production Deployment

Frontend domain: `https://versenext.com`

Backend API domain: `https://api.versenext.com`

## Recommended Server Layout

Use this layout if your hosting account keeps the frontend and backend under one home directory:

```text
~
+-- public_html
|   +-- index.html
|   +-- _next
|   +-- ...
+-- versenext_backend
    +-- app
    +-- bootstrap
    +-- public
    +-- vendor
    +-- .env
```

`public_html` serves the exported Next.js frontend. The API should be served from the `api.versenext.com` subdomain with its document root pointed to Laravel's `public` folder.

The files in `deployment/public_html` are only needed if your host cannot point `api.versenext.com` directly to `versenext_backend/public` and you must route `/api/*` through the frontend domain.

```text
deployment/public_html/.htaccess
deployment/public_html/index.php
```

That fallback `index.php` expects the backend at:

```text
~/versenext_backend
```

If you choose a different backend folder name, update this line in `public_html/index.php`:

```php
$backendPath = __DIR__.'/../versenext_backend';
```

## Frontend

The Next.js frontend is configured for static export.

```powershell
cd "C:\xampp\htdocs\Laravel Projects\Verse Next\VerseNext Project\versnext_frontend"
npm run build:production
```

Upload the contents of `versnext_frontend\out\` into `public_html`.

The production API URL is set in:

```text
versnext_frontend\.env.production.local
```

It must be:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.versenext.com/api
```

## Backend

Upload the Laravel backend folder to `~/versenext_backend`, outside the frontend `public_html` folder.

Create or update the `api.versenext.com` subdomain so its document root is:

```text
~/versenext_backend/public
```

Use `versenext_backend/.env.production.example` as the server `.env` template, then fill in:

```text
APP_KEY
DB_DATABASE
DB_USERNAME
DB_PASSWORD
MAIL_USERNAME
MAIL_PASSWORD
GEMINI_API_KEY
```

The production `.env` must include:

```text
APP_URL=https://api.versenext.com
FRONTEND_URL=https://versenext.com
APP_DEBUG=false
```

Generate the app key on the server:

```bash
php artisan key:generate --force
```

Then run:

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Upload By PowerShell

Yes, you can upload with PowerShell if SSH/SFTP is enabled.

Upload frontend static files:

```powershell
scp -r ".\versnext_frontend\out\*" u391106270@de-fra-web2085:~/public_html/
```

Only upload these public routing files if your host cannot use a separate API subdomain document root and you choose the fallback `/api/*` routing method:

```powershell
scp ".\deployment\public_html\.htaccess" u391106270@de-fra-web2085:~/public_html/.htaccess
scp ".\deployment\public_html\index.php" u391106270@de-fra-web2085:~/public_html/index.php
```

Upload backend files to a backend folder:

```powershell
scp -r ".\versenext_backend\*" u391106270@de-fra-web2085:~/versenext_backend/
```

After upload, make sure the subdomain points to `~/versenext_backend/public`, not to the backend root.
