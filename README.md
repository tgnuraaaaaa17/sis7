# SIS7 — Kazakhstan Places PWA

SIS7 extends the previous Kazakhstan Places homework as an independently deployed, installable Progressive Web App. The SIS6 repository and project are not used as the deployment target.

## Features

- Installable `manifest.json` with standalone display and 192×192 / 512×512 PNG icons.
- Content-versioned service worker that precaches the application shell and offline page, removes outdated caches on activation, and offers an in-app update button.
- Cache-first strategy for static assets and network-first strategy for public GET API requests, with entry limits and authentication paths excluded. Cached API fallbacks are labeled in the connection bar.
- Dedicated offline help at `#/offline`, plus a pre-cached `offline.html` fallback when a navigation request cannot complete.
- Firebase Authentication with Google sign-in, email/password login, account registration, and sign-out. The supplied fake API stores place data in localStorage, so previously loaded and edited records remain available offline; the connection bar says when the app is using device-saved data.
- Responsive navigation and layouts down to 320px.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/places` | Search, filters, sorting, pagination |
| `/places/:id` | Place details |
| `/dashboard` | Statistics and filters |
| `/login` | Google sign-in, email/password login, registration |
| `/offline` | Offline help |

The app uses `HashRouter` for reliable refreshes and deep links on GitHub Pages.

The homework starter's fake API is localStorage-backed rather than a remote HTTP service. The service layer mirrors the known public seed catalogue into the service worker's versioned Cache Storage under `/api/places` keys, then reads that public snapshot if a local API read fails. It excludes user-added places and the personal `completed` flag. The service worker uses network-first for same-origin `/api/places` GET requests and announces cache fallbacks to the connection bar. The fake API's localStorage remains the source for edits and visited status.

## Run locally

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run verify:pwa-cache
```

The service worker is registered in production builds. To check installability locally, use a secure origin such as `localhost` and open the production preview. Copy `.env.example` to `.env.local` and fill the Firebase web app settings for local sign-in.

## Deploy

The included GitHub Actions workflow publishes `dist/` to GitHub Pages whenever `main` is updated. The SIS7 repository needs these six Actions variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`. They are public Firebase web app settings used by the browser app. In Firebase Authentication, enable Google sign-in and allow the GitHub Pages host in Authorized domains. Deployment URL: `https://tgnuraaaaaa17.github.io/sis7/`.
