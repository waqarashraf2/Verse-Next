# Verse Next Backend

Laravel API for the Verse Next website, contact forms, chatbot, leads, consultations, articles, admin tools, and platform settings.

## Production Domain

Use this backend at:

```text
https://api.versenext.com
```

The frontend should call:

```text
https://api.versenext.com/api
```

## Deployment Checklist

1. Upload this backend outside the frontend public directory.
2. Point the API subdomain document root to `versenext_backend/public`.
3. Copy `.env.production.example` to `.env` on the server.
4. Fill in `APP_KEY`, database, mail, and Gemini API values.
5. Run the production commands from the root `DEPLOYMENT.md`.

Keep `APP_DEBUG=false` in production.
