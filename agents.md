# Sticker Hunt – LLM Agent Guide

This file is the operational source of truth for the JAM Event sticker hunt project. Reference it before making changes so every update stays aligned with our product and infrastructure goals.

---

## 1. Mission Snapshot
- **Experience:** Authenticated landing → QR scanner → sticker collection dashboard.
- **Objective:** Make it simple—and hard to break—for event attendees to claim physical stickers bound to their Appwrite identity.
- **Tone:** Premium, high-contrast event aesthetic with tight UX polish.

---

## 2. Tech & Tooling

| Area        | Stack / Notes                                                      |
|-------------|--------------------------------------------------------------------|
| Framework   | React 18 + Vite (TypeScript)                                       |
| Routing     | React Router v6                                                    |
| Styling     | TailwindCSS with bespoke tokens (`app/src/styles.css`)             |
| State       | Context for auth + toast notifications                             |
| Data Layer  | Appwrite Web SDK (`app/src/lib/appwrite.ts`, `claim.ts`, `claims.ts`) |
| QR Scanning | `@zxing/browser`                                                   |
| Serverless  | Appwrite `claimSticker` function (Node 20, TypeScript)             |
| Scripts     | `setup-appwrite.mjs`, `seed-stickers.mjs`                          |
| Linting     | ESLint + Prettier                                                  |

Keep dependencies lean. Any new library requires justification in PR/notes.

---

## 3. Repository Topology

```
.
├── app/                 # Vite app root
│   ├── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # AuthForm etc.
│   │   │   ├── layout/           # Header, footer
│   │   │   ├── scan/             # Confetti + helpers
│   │   │   └── ui/               # Button, Card, Toast
│   │   ├── lib/                  # Appwrite client, env, claim helpers
│   │   ├── pages/                # Landing, Scan, Profile, 404
│   │   ├── routes/               # Router + protected gate + layout
│   │   └── styles.css            # Tailwind directives + globals
│   └── vite.config.ts
├── functions/claimSticker/       # Appwrite function (TypeScript)
├── scripts/                      # Appwrite provisioning + seeding
├── docs/appwrite-comprehensive-setup.md
├── .env / .env.example
└── README.md
```

Front-end imports assume alias `@` → `app/src`, plus scoped aliases (`@components`, `@lib`).

---

## 4. Environment & Secrets

Populate `.env` and `.env.example` with:

| Variable                                   | Scope           | Notes                                               |
|--------------------------------------------|-----------------|-----------------------------------------------------|
| `VITE_APPWRITE_ENDPOINT`, `PROJECT_ID`     | Frontend        | Public safe, pulled via `import.meta.env`.          |
| `VITE_APPWRITE_DATABASE_ID`                | Frontend        | Defaults to `event_db`.                             |
| `VITE_APPWRITE_STICKERS_COLLECTION_ID`     | Frontend        | Defaults to `stickers`.                             |
| `VITE_APPWRITE_CLAIMS_COLLECTION_ID`       | Frontend        | Defaults to `claims`.                               |
| `VITE_APPWRITE_CLAIM_FUNCTION_ID`          | Frontend        | Set after function deployment.                      |
| `APPWRITE_ENDPOINT`, `PROJECT_ID`, `API_KEY`| Scripts/Function| Server-side credentials (**keep secret**).          |
| `SIGNING_SECRET` + `SIGNATURE_LENGTH`      | Shared          | Required when QR codes carry signatures.            |
| `EVENT_ID`, `STICKER_PREFIX`               | Scripts         | Defaults for seeding utility.                       |

If you add or rename env vars:
1. Update `.env`, `.env.example`, and any documentation.
2. Ensure validation exists (`app/src/lib/env.ts` or function env schema).

---

## 5. Core Workflows

### 5.1 Authentication
- Context: `app/src/lib/auth.tsx` (AuthProvider).
- Uses Appwrite account SDK with email/password sessions.
- `ready` flag gates protected routes.
- On success, `LandingPage` redirects authenticated users to `/scan`.

### 5.2 QR Claim Flow
1. `/scan` renders live video via `BrowserMultiFormatReader`.
2. On decode → `claimSticker` client helper posts to Appwrite Function.
3. Function validates signature (if enabled), ensures sticker active, writes claim doc with owner read permission, deactivates sticker.
4. Front-end shows confetti on success and stores latest claim for `/me`.

Manual code entry reuses the same claim path (wraps input as `https://manual-entry...` query string).

### 5.3 Profile
- `/me` fetches `claims` for the current user via `fetchUserClaims`.
- Expects duplicate data from function (sticker metadata snapshot). Any schema change must update function + types.

---

## 6. Appwrite Function – `claimSticker`

- Source: `functions/claimSticker/src/index.ts`.
- Environment schema enforced via Zod.
- Requires Appwrite JWT header to resolve user context.
- Returns unified response shape consumed by `app/src/lib/claim.ts`.
- Duplicate/invalid claims surface as `status` codes for toasts:
  - `404` → invalid/inactive.
  - `409` → already claimed.
  - `401` → auth/signature issues.

When editing:
- Update README + docs.
- Keep response shape backward compatible or reflect changes in front-end helper.
- Maintain unique indexes in schema script.

---

## 7. Commands & Quality Gates

| Command                     | Purpose                                               |
|-----------------------------|-------------------------------------------------------|
| `npm run dev`               | Start Vite dev server.                                |
| `npm run build`             | Production build (ensures TS correctness).           |
| `npm run lint`              | ESLint (fail on warnings).                            |
| `npm run setup:appwrite`    | Provision/validate database + collections.           |
| `npm run seed:stickers -- N`| Generate N stickers + CSV (requires env + API key).   |
| `npm run functions:build`   | Compile serverless function for deployment.          |

Before handing work off, run lint + build at minimum.

---

## 8. Schema Alignment Checklist

When modifying data models:
1. Update Appwrite provisioning script and rerun (or document manual console steps).
2. Adjust TypeScript types in:
   - `app/src/lib/appwrite.ts`
   - `app/src/lib/claim.ts`
   - `app/src/lib/claims.ts`
   - `functions/claimSticker/src/index.ts`
3. Refresh `.env.example`, README, and `docs/appwrite-comprehensive-setup.md`.
4. If new fields should appear on `/me`, adapt UI and claim snapshots.

---

## 9. UX & Accessibility Guardrails

- Maintain high-contrast, event-driven styling (dark background, neon accents).
- Input components already include labels + error states; reuse them.
- Keep the scanner accessible (display state messages, provide manual fallback).
- Avoid adding large runtime dependencies; prefer hand-rolled transitions.
- Toasts are lightweight—use them for all user feedback instead of `alert`.

---

## 10. Future Enhancements (If You Tackle Them)

1. Leaderboard/analytics via Appwrite queries or edge functions.
2. Printable QR PDFs (hook into `seed-stickers` output).
3. OAuth providers for faster login.
4. Automated end-to-end tests (Playwright) exercising scan + claim flow.

Document any completed item here so future agents know what changed.

---

Keep this guide synchronized with the codebase. Outdated docs are more dangerous than missing docs.
