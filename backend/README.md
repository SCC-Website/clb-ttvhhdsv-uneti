# SCC Diary local backend

This local Node/Express service serves the existing static website and its same-origin `/api` routes. MongoDB Atlas stores account records, sessions, play history, and the global all-runs leaderboard. The project does not contain production credentials.

## Run locally

1. Install backend dependencies from this folder with `npm.cmd install`.
2. Copy `.env.example` to `.env` in this folder.
3. Put your MongoDB Atlas connection URI in `MONGODB_URI` in that local `.env` file. Do not paste it into source code, chat, or the browser. Set `CORS_ORIGINS` to the exact frontend origin(s), comma-separated; the example includes `https://scc-website.github.io`. Never use `*`.
4. Start the service with `npm.cmd run dev`.
5. Open `http://127.0.0.1:3000/diary-game.html` (not `file://` and not the GitHub Pages URL) to use account and API features.

If `MONGODB_URI` is blank or unreachable, the static page still loads but account, history, and leaderboard API actions report that the backend is unavailable. No API secret is exposed in the frontend. Local development binds to `127.0.0.1`; it is not a public deployment.

`CORS_ORIGINS` is an API allowlist, not an API proxy. The current frontend calls relative `/api` paths, so a page opened on GitHub Pages or VS Code Live Server will send those requests back to that page's own origin unless a proxy or API-base setting is configured. For VS Code Live Server, add its exact origin (for example `http://127.0.0.1:5500`) to `CORS_ORIGINS`, and separately route `/api` to the backend. Cross-site cookie auth also requires HTTPS and `COOKIE_SECURE=true`; browsers may still restrict third-party cookies, so serving frontend/API on the same site or through a same-origin proxy is preferred.

## Account security

The account ID is a high-entropy bearer login key: anyone who obtains it can log in. Keep it private. MongoDB stores only its SHA-256 hash; the raw ID is returned on registration and never stored on the server. After registration or ID login, the frontend keeps it in `sessionStorage` for that tab so the profile can mask/reveal and copy it after a page refresh. Logout clears it. Any script running on this same origin can access `sessionStorage`, so an XSS flaw could expose the ID. If the ID is lost after its tab data is cleared or you sign out, the account cannot be recovered with that ID. Session tokens are random and stored hashed in MongoDB. The HttpOnly session cookie uses SameSite=Lax locally, and SameSite=None; Secure when `COOKIE_SECURE=true` for HTTPS cross-site access. Authentication and account-creation routes are rate-limited. Public leaderboard entries expose the current display name and play result, never the login ID.

The backend no longer reads or requires `ID_ENCRYPTION_KEY`. Any legacy `loginIdEncrypted` field from an earlier version is ignored; login uses the stored hash. For any later HTTPS deployment, set `COOKIE_SECURE=true` and store `MONGODB_URI` in the host's secret manager; do not commit `.env`.

## Data behavior

Each completed game run is a separate leaderboard row. The global leaderboard sorts every run by score (descending), with newer runs first for ties. Profile history lists the signed-in account's runs newest first and supports pagination.


When configuring Atlas, use a database-scoped application user with access only to the `scc_diary` database, not your Atlas owner account. Restrict Atlas Network Access to the needed client IP for local development; do not open access to every IP as a convenience. Display names, scores, completion counts, and play timestamps appear in the public all-runs leaderboard; login IDs and profile history do not.
