# JAM Event Sticker Hunt

Pixel-perfect event experience that authenticates guests, scans QR stickers, and claims them securely through Appwrite. Built from the ground up for reliability, minimal dependencies, and tight security.

---

## Features

- **Authentication:** Email/password via Appwrite with guarded routes.
- **Scanner:** Continuous QR scanning with graceful fallbacks and manual entry.
- **Claims:** Single-use stickers claimed by a hardened Appwrite function (no direct client writes).
- **Profile:** Real-time view of collected stickers with rarity breakdown.
- **Tooling:** Appwrite provisioning script, seeding utility, and ready-to-deploy function.

---

## Tech Stack

| Layer          | Tools                                                                 |
|----------------|-----------------------------------------------------------------------|
| Frontend       | React 18 + Vite (TypeScript), TailwindCSS, React Router, @zxing/browser |
| Backend        | Appwrite (Auth, Database, Functions, Storage-ready)                   |
| Serverless     | Node 20 function (TypeScript → JS)                                    |
| Tooling        | ESLint, Prettier, custom scripts (`setup-appwrite`, `seed-stickers`)  |

---

## Repository Layout

```
.
├── app/                     # Vite application
│   ├── index.html
│   ├── src/
│   │   ├── components/      # UI, layout, auth, scan helpers
│   │   ├── lib/             # Appwrite client, env, claim helpers
│   │   ├── pages/           # Route screens (/ , /scan, /me, 404)
│   │   └── routes/          # Router + layout shell
│   └── vite.config.ts
├── functions/claimSticker/  # Serverless function source
│   ├── src/index.ts
│   ├── package.json
│   └── tsconfig.json
├── scripts/                 # Ops tooling
│   ├── setup-appwrite.mjs   # Idempotent infrastructure provisioning
│   └── seed-stickers.mjs    # Sticker generator with optional signatures
├── docs/appwrite-comprehensive-setup.md
├── .env.example
└── README.md
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` → `.env` and fill in values from Appwrite.

Key variables:

| Variable                                | Purpose                                            |
|-----------------------------------------|----------------------------------------------------|
| `VITE_APPWRITE_*`                       | Used by the Vite frontend.                         |
| `APPWRITE_ENDPOINT`, `APPWRITE_API_KEY` | Used by scripts + serverless function.             |
| `VITE_APPWRITE_CLAIM_FUNCTION_ID`       | Appwrite function ID returned after deployment.    |
| `SIGNING_SECRET`                        | Optional shared secret for QR signatures.          |

> Keep `.env` out of version control. Scripts and function rely on the same values.

### 3. Run the dev server

```bash
npm run dev
```

The site runs at `http://localhost:5173`.

---

## Appwrite Provisioning

All schema and permission details live in `docs/appwrite-comprehensive-setup.md`.

Execute the setup script once credentials are available:

```bash
APPWRITE_ENDPOINT=... \
APPWRITE_PROJECT_ID=... \
APPWRITE_API_KEY=... \
npm run setup:appwrite
```

The script will create (or update) `event_db`, `stickers`, and `claims` with the right attributes and indexes. Safe to re-run.

---

## Serverless Function Deployment

1. Build the TypeScript function:

   ```bash
   npm run functions:build
   ```

2. Deploy with the Appwrite CLI (example):

   ```bash
   appwrite functions createDeployment \
     --functionId=claimSticker \
     --entrypoint=dist/index.js \
     --code=functions/claimSticker \
     --activate=true
   ```

3. Configure function environment (same keys used locally) and ensure:
   - **Runtime:** Node.js 20+
   - **Execute Permissions:** `role:users`
   - **HTTP Enabled:** yes

4. Copy the function ID and set `VITE_APPWRITE_CLAIM_FUNCTION_ID` in `.env`.

---

## Generating Stickers & Signatures

Create single-use stickers directly from the CLI:

```bash
# Create 50 stickers with optional signatures
SIGNING_SECRET=super-secret \
APPWRITE_ENDPOINT=... \
APPWRITE_PROJECT_ID=... \
APPWRITE_API_KEY=... \
npm run seed:stickers -- 50
```

Output:
- Inserts documents into the `stickers` collection.
- Generates `scripts/output/stickers.csv` listing `code`, `sig`, and `eventId`.

Use the CSV to produce QR labels encoded as:

```
https://your-domain/scan?code=<CODE>&sig=<SIG>
```

The front-end also accepts raw codes and manual entry.

---

## QR Scanner UX

- Uses `@zxing/browser` for continuous scanning.
- Auto-stops after a successful claim and shows a confetti celebration.
- Manual code + signature input is provided as a fallback.
- Error handling:
  - `404` → invalid/inactive.
  - `409` → already claimed.
  - Any other failure → retry guidance.

---

## Testing & Quality Gates

| Command                 | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| `npm run lint`          | ESLint with recommended React + TypeScript rules.           |
| `npm run build`         | Production build (fails on TypeScript errors).              |
| `npm run setup:appwrite`| Idempotent check of schema/indexes.                         |
| `npm run seed:stickers` | Verifies Appwrite write permissions while seeding.          |

Manual checks:
- Attempt to claim the same sticker twice (expect “Already claimed”).
- Provide wrong signature when `SIGNING_SECRET` is set (expect rejection).
- Load `/me` and confirm personal claims only.
- Verify `/scan` redirects to `/` when unauthenticated.

---

## Troubleshooting

| Symptom                               | Fix                                                                 |
|---------------------------------------|---------------------------------------------------------------------|
| Function returns 401 without signature | Ensure `SIGNING_SECRET` is shared between seeding tool and function.|
| Frontend fails to call function        | Check `VITE_APPWRITE_CLAIM_FUNCTION_ID` and enable HTTP execution.  |
| Scanner shows camera error             | Verify browser permissions; try the manual entry fallback.          |
| Claims not visible on `/me`            | Confirm claim documents include owner read permission (`Role.user`).|
| Setup script loops on attributes       | Wait for Appwrite attributes to reach `status = available`; rerun.  |

---

## Roadmap Ideas

- Generate printable QR PDFs alongside the CSV.
- Add leaderboard view backed by Appwrite aggregates.
- Support OAuth (GitHub/Google) in addition to email/password.
- Integrate analytics to track scans per zone or time block.

---

Built for the JAM Events sticker hunt — secure, fast, and hard to break. 🎉
