# SCC Diary backend

This Node/Express service provides the `/api` endpoints for account login, profile/history, play records, and the global leaderboard. Locally it can also serve the static game page for same-origin testing. In the production split setup, GitHub Pages serves the frontend while Render runs this API; MongoDB Atlas stores account records, sessions, play history, and the all-runs leaderboard. No production credentials belong in this repository.

## Run locally

1. From this directory, install dependencies with `npm.cmd install`.
2. Copy `.env.example` to `.env` in this directory.
3. Put the MongoDB Atlas connection URI in `MONGODB_URI` in that private local `.env` file. Do not paste it into source code or chat. Use an exact comma-separated `CORS_ORIGINS` allowlist; the example includes `https://scc-website.github.io`. Never use `*`.
4. Start the service with `npm.cmd run dev`.
5. Open `http://127.0.0.1:3000/diary-game.html` (not `file://`) for same-origin local testing. Leave `diary-api-config.js` blank in this setup.

If `MONGODB_URI` is blank or unreachable, the static page still loads but API routes return 503 and `/api/health` reports not ready. Local development binds to `127.0.0.1`; it is not a public deployment.

## Deploy the API to Render while keeping GitHub Pages

The repository-root `render.yaml` is a Render Blueprint for a Node Web Service named `scc-diary-api`. It uses the free plan in Singapore for initial testing, installs from `backend/package-lock.json`, starts `backend/server.js`, and uses `/api/health` as its readiness check. Render Free services sleep after 15 minutes without requests, so the first request after idle may take about a minute; do not treat this plan as production-grade always-on hosting.

1. Commit and push the project to the GitHub repository used by the website. In Render, create a Blueprint and connect that repository/branch; review the service before applying it. The Blueprint sets `HOST=0.0.0.0`, `COOKIE_SECURE=true`, `CORS_ORIGINS=https://scc-website.github.io`, the database name, and the Singapore region.
2. When Render prompts for `MONGODB_URI` (declared with `sync: false`), enter the Atlas connection string in Render's secret environment-variable field only. Do not put it in `render.yaml`, `diary-api-config.js`, GitHub Pages, or chat. Use a database-scoped Atlas application user with access only to `scc_diary`.
3. After the service deploys, its `/api/health` must return HTTP 200 with `{"ready":true}`. A 503 means Atlas is not connected. Keep the Atlas Network Access policy as narrow as the hosting plan permits; `0.0.0.0/0` is broad access and should not be considered a security fix.
4. Copy the Render service's HTTPS origin (host only, no path) into `window.SCC_API_BASE_URL` in the root `diary-api-config.js`, then commit and push that public, non-secret URL so GitHub Pages serves the updated client. The blank value intentionally preserves same-origin behavior for local development.
5. Confirm that a request from `https://scc-website.github.io` is accepted by CORS and that an unlisted origin is rejected. The client sends `credentials: include`; Render is configured for `SameSite=None; Secure` session cookies. After deployment, test registration/login, reload the page, profile history, and logout in a normal browser. Some browsers or privacy settings block third-party cookies between `github.io` and `onrender.com`; CORS alone cannot override that. If the browser does not retain the session, use a same-site/custom-domain proxy or explicitly redesign authentication rather than weakening CORS.

Render Blueprints keep `MONGODB_URI` out of source control by prompting for it on first setup. See [Render Blueprint specification](https://render.com/docs/blueprint-spec), [environment variables and secrets](https://render.com/docs/configure-environment-variables), and [free instance limitations](https://render.com/docs/free).

## Account security

The account ID is a high-entropy bearer login key: anyone who obtains it can log in. Keep it private. MongoDB stores only its SHA-256 hash; the raw ID is returned on registration and never stored on the server. After registration or ID login, the frontend keeps it in `sessionStorage` for that tab so the profile can mask/reveal and copy it after a page refresh. Logout clears it. Any script running on the same origin can access `sessionStorage`, so an XSS flaw could expose the ID. If the ID is lost after its tab data is cleared or you sign out, the account cannot be recovered with that ID. Session tokens are random and stored hashed in MongoDB. The HttpOnly session cookie uses SameSite=Lax locally and SameSite=None; Secure in the Render configuration. Authentication and account-creation routes are rate-limited. Public leaderboard entries expose the current display name and play result, never the login ID.

The backend does not read or require `ID_ENCRYPTION_KEY`. Any legacy `loginIdEncrypted` field from an earlier version is ignored; login uses the stored hash. Never commit `.env`; the root `.gitignore` excludes it.

## Data behavior

Each completed game run is a separate leaderboard row. The global leaderboard sorts every run by score (descending), with newer runs first for ties. Profile history lists the signed-in account's runs newest first and supports pagination.

Display names, scores, completion counts, and play timestamps appear in the public all-runs leaderboard; login IDs and profile history do not. Restrict Atlas Network Access and use a least-privilege database user.