# Appwrite Setup – Sticker Hunt Platform

This document is the authoritative reference for provisioning the Appwrite resources that power the JAM Event sticker hunt. It mirrors the defaults used by the project’s scripts and serverless function. Keep it in sync whenever schemas or permissions change.

---

## 1. Project & API Credentials

Create (or reuse) an Appwrite project and note:

- **Project ID**
- **API endpoint**
- **API key** with `databases.read`, `databases.write`, and `functions.all` scopes.

Populate the following environment variables (used by scripts and the serverless function):

```bash
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=api-key-with-db-and-function-access
DB_ID=event_db
STICKERS_COLL_ID=stickers
CLAIMS_COLL_ID=claims
SIGNING_SECRET=optional-shared-secret
SIGNATURE_LENGTH=16
EVENT_ID=JAM-2025
STICKER_PREFIX=JAM
```

Front-end variables (prefixed with `VITE_`) mirror the IDs above and add the claim function ID.

---

## 2. Database Topology

### Database: `event_db`

Holds two collections: `stickers` and `claims`.

#### Collection: `stickers`

| Attribute | Type    | Size | Required | Notes                          |
|-----------|---------|------|----------|--------------------------------|
| `code`    | string  | 64   | ✓        | Unique string printed in QR.   |
| `eventId` | string  | 64   | ✓        | Event identifier.              |
| `active`  | boolean | —    | ✓        | Defaults to `true`.            |
| `name`    | string  | 128  | —        | Sticker title (optional).      |
| `imageUrl`| string  | 256  | —        | Optional artwork URL.          |
| `rarity`  | string  | 32   | —        | e.g. `Common`, `Mythic`.       |
| `designId`| string  | 64   | —        | Grouping for shared artwork.   |

**Indexes**
- `unique_code` → unique on `code`

**Permissions**
- No client read/write permissions. Managed exclusively via API key/serverless function.

#### Collection: `claims`

Document-level permissions enabled.

| Attribute          | Type     | Size | Required | Notes                                     |
|--------------------|----------|------|----------|-------------------------------------------|
| `userId`           | string   | 64   | ✓        | Authenticated Appwrite user ID.           |
| `stickerId`        | string   | 64   | ✓        | Reference to `stickers.$id`.              |
| `eventId`          | string   | 64   | ✓        | Copied from sticker on claim.             |
| `code`             | string   | 64   | ✓        | Sticker code (duplicated for convenience).|
| `stickerName`      | string   | 128  | —        | Snapshot of sticker name.                 |
| `stickerImageUrl`  | string   | 256  | —        | Snapshot of sticker artwork URL.          |
| `stickerRarity`    | string   | 32   | —        | Snapshot of rarity.                       |
| `claimedAt`        | datetime | —    | ✓        | ISO timestamp of claim.                   |

**Indexes**
- `unique_sticker` → unique on `stickerId`
- `unique_user_sticker` → unique on `userId, stickerId`
- `user_lookup` → key index on `userId` (ascending)

**Permissions**
- No collection-level permissions.
- Each document is created with `read(Role.user(userId))`, so the claimant can read their own record.

---

## 3. Infrastructure as Code Helpers

### Automated provisioning script

`npm run setup:appwrite` executes `scripts/setup-appwrite.mjs` and will:

1. Ensure database `event_db` exists.
2. Ensure `stickers` and `claims` collections exist with the attributes and indexes above.
3. Wait for attributes to become available before creating indexes.

The script is idempotent; re-running it will skip existing resources.

> Run from project root with the same environment variables used by the serverless function.

### Seeding stickers

`npm run seed:stickers -- 50` (count optional, defaults to 20) creates the specified number of stickers in Appwrite and writes a CSV (`scripts/output/stickers.csv`) containing:

- Sticker code
- Optional signature (if `SIGNING_SECRET` is set)
- Event ID

Use the CSV to generate QR codes. Each row maps one physical sticker to a single-use code.

Signature generation mirrors the claim function: `HMAC_SHA256(code, SIGNING_SECRET)` truncated to `SIGNATURE_LENGTH` characters (default 16).

---

## 4. Serverless Function: `claimSticker`

Source: `functions/claimSticker/src/index.ts`

### Environment contract

| Variable              | Purpose                                               |
|-----------------------|-------------------------------------------------------|
| `APPWRITE_ENDPOINT`   | API endpoint.                                        |
| `APPWRITE_PROJECT_ID` | Project identifier.                                   |
| `APPWRITE_API_KEY`    | API key with DB + function permissions.               |
| `DB_ID`               | Database ID (`event_db`).                             |
| `STICKERS_COLL_ID`    | Stickers collection ID.                               |
| `CLAIMS_COLL_ID`      | Claims collection ID.                                 |
| `SIGNING_SECRET`      | Optional. If present, signatures become mandatory.    |

### Request payload

```json
{ "code": "JAM-AB12CD", "sig": "optional" }
```

If `SIGNING_SECRET` is configured, the function expects a signature truncated to the same length provided by the client (default 16 hex chars). Absence or mismatch → `401`.

### Execution flow

1. Validate environment, payload, and user session (`x-appwrite-user-jwt` header).
2. Lookup sticker by `code` and `active = true`. Missing or inactive → `404`.
3. Create claim document with owner read permissions.
4. Update sticker `active = false` (best effort).
5. Return claim snapshot to the client.

Duplicate scans are handled by unique indexes; Appwrite returns `409`, which the function maps to `409 Already claimed`.

### Deploying

```
cd functions/claimSticker
npm install
npm run build
# appwrite functions createDeployment ... (documented in README)
```

Configure the function to accept HTTP requests and assign `execute` permissions to authenticated users.

---

## 5. QR Format & Signature Rules

QR stickers should encode:

```
https://<your-domain>/scan?code=<CODE>[&sig=<SIGNATURE>]
```

The front-end accepts raw codes, full URLs, or manual input.

Signature generation (if enabled):

```
signature = HMAC_SHA256(code, SIGNING_SECRET).slice(0, SIGNATURE_LENGTH)
```

Use the same logic in any external tooling (the seeding script already does).

---

## 6. Testing Checklist

| Area                    | Tests                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------|
| Authentication          | Attempt to call the function without auth → `401`.                                      |
| Sticker validity        | Scan an inactive or unknown code → `404`.                                               |
| Happy path              | Scan fresh sticker → `200` and verify claim appears in `/me`.                           |
| Duplicate scan          | Scan the same sticker twice → second attempt returns `409` and sticker remains inactive.|
| Manual entry            | Enter code + signature manually → same result as QR scan.                               |
| Signature enforcement   | Provide incorrect signature when `SIGNING_SECRET` set → `401`.                          |
| Appwrite constraints    | Ensure indexes exist (`databases.listIndexes`) and attributes show `status = available`.|

---

## 7. Maintenance Tasks

- Rotate API keys regularly and update `.env`.
- Re-run `npm run setup:appwrite` after schema changes to keep environments in sync.
- When adding new sticker metadata fields, update:
  - Collection attributes (script + Appwrite console)
  - Function payload snapshot
  - Front-end claim types
- Keep this document and the README in sync with any schema or flow changes.

---

**Last updated:** October 2025 (Sticker hunt relaunch)
