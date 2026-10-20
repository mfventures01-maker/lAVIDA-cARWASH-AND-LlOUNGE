# LaVida CARSS BFF and Apps Script connection notes

## Repository
Clone into `C:\Projects\lAVIDA-cARWASH-AND-LlOUNGE`.

## Server-side endpoint configuration
The server reads `APPS_SCRIPT_URL`. Set it in the local, untracked `.env` file and in the deployment's server-side environment configuration. Do not place private configuration in `VITE_*` variables, return the upstream URL from public API responses, or commit `.env`.

## Current blockers found during read-only review
- `server.ts` returns `upstreamEndpoint: appsScriptUrl` in the common response envelope.
- `GET /api/diagnostic` returns the configured upstream URL and internal diagnostic details.
- `POST /api/endpoint` mutates the upstream endpoint at runtime without authentication.
- `server.ts` contains an order fallback that can synthesize a receipt in memory using a live catalog, while the repository README and architecture require strict source provenance and a demo/live distinction. This needs separate review before orders are enabled.
- `api/*.ts` route files also contain hardcoded Apps Script URL defaults, so the environment variable is not currently the only configuration source in all deployment modes.
- API route filenames under `api/` are Vercel conventions, but the repository's main runtime is an Express server. Verify actual deployment routing before assuming those handlers run on Vercel.

## Safe validation sequence
1. Set `APPS_SCRIPT_URL` in local `.env`.
2. Run lint, tests, and build.
3. Start the local app and issue read-only GETs to `/api/config`, `/api/catalog?domain=food`, and `/api/carousel`.
4. Confirm the BFF returns only the six-field envelope plus explicitly approved safe source/mode fields; never the upstream URL.
5. Confirm any Google Sign-In HTML is rejected and returned as a sanitized non-success response.
6. Do not submit test orders unless using an isolated test workbook/deployment authorized for writes.
7. Do not deploy until the code review, tests, and explicit owner approval are complete.

## No live change
This document does not change Apps Script deployment settings, Google Sheets, Vercel project configuration, or live orders.
