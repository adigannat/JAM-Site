import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Client, Databases, ID } from "node-appwrite";

const {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
  DB_ID = "event_db",
  STICKERS_COLL_ID = "stickers",
  SIGNING_SECRET,
  EVENT_ID = "JAM-2025",
  STICKER_PREFIX = "JAM"
} = process.env;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error("Missing Appwrite credentials. Set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY.");
  process.exit(1);
}

const total = Number.parseInt(process.argv[2] ?? "20", 10);
if (Number.isNaN(total) || total <= 0) {
  console.error("Invalid count. Provide a positive integer, e.g., `node seed-stickers.mjs 50`.");
  process.exit(1);
}

const signatureLength = SIGNING_SECRET ? Number.parseInt(process.env.SIGNATURE_LENGTH ?? "16", 10) : 0;

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

const generated = new Map();

console.log(`[start] Creating ${total} stickers in collection ${STICKERS_COLL_ID}.`);

for (let index = 0; index < total; index += 1) {
  const code = generateCode();
  const docId = ID.unique();
  const payload = {
    code,
    eventId: EVENT_ID,
    active: true
  };

  await databases.createDocument(DB_ID, STICKERS_COLL_ID, docId, payload);
  const signature = SIGNING_SECRET ? computeSignature(code, SIGNING_SECRET, signatureLength) : "";

  generated.set(code, signature);
  console.log(`[add] ${code} ${signature ? `(sig ${signature})` : ""}`);
}

const outputDir = path.resolve("scripts/output");
fs.mkdirSync(outputDir, { recursive: true });
const csvPath = path.join(outputDir, "stickers.csv");

const csvBody = ["code,sig,eventId"].concat(
  Array.from(generated.entries()).map(([code, sig]) => `${code},${sig ?? ""},${EVENT_ID}`)
);

fs.writeFileSync(csvPath, csvBody.join("\n"), "utf-8");
console.log(`[done] Wrote ${generated.size} stickers to ${csvPath}.`);

function generateCode() {
  let candidate = "";
  do {
    const randomBytes = crypto.randomBytes(5).toString("hex").toUpperCase();
    candidate = `${STICKER_PREFIX}-${randomBytes.slice(0, 6)}`;
  } while (generated.has(candidate));
  return candidate;
}

function computeSignature(code, secret, length) {
  const digest = crypto.createHmac("sha256", secret).update(code).digest("hex");
  return digest.slice(0, length);
}
