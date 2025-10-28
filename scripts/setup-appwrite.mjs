import { Client, Databases } from "node-appwrite";

const {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
  DB_ID = "event_db",
  STICKERS_COLL_ID = "stickers",
  CLAIMS_COLL_ID = "claims"
} = process.env;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error(
    "Missing APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, or APPWRITE_API_KEY environment variables."
  );
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

await ensureDatabase(DB_ID, "Event Sticker Database");
await ensureStickerCollection();
await ensureClaimsCollection();

console.log("[done] Appwrite resources are configured.");

async function ensureDatabase(databaseId, name) {
  try {
    await databases.get(databaseId);
    console.log(`[ok] Database ${databaseId} already exists.`);
  } catch (err) {
    if (err.code === 404) {
      await databases.create(databaseId, name);
      console.log(`[add] Created database ${databaseId}.`);
    } else {
      throw err;
    }
  }
}

async function ensureStickerCollection() {
  await ensureCollection(DB_ID, STICKERS_COLL_ID, "Stickers", [], false);

  await ensureStringAttribute(STICKERS_COLL_ID, "code", 64, true);
  await ensureStringAttribute(STICKERS_COLL_ID, "eventId", 64, true);
  await ensureBooleanAttribute(STICKERS_COLL_ID, "active", true, true);
  await ensureStringAttribute(STICKERS_COLL_ID, "name", 128, false);
  await ensureStringAttribute(STICKERS_COLL_ID, "imageUrl", 256, false);
  await ensureStringAttribute(STICKERS_COLL_ID, "rarity", 32, false);
  await ensureStringAttribute(STICKERS_COLL_ID, "designId", 64, false);

  await ensureIndex(STICKERS_COLL_ID, "unique_code", "unique", ["code"]);
}

async function ensureClaimsCollection() {
  await ensureCollection(DB_ID, CLAIMS_COLL_ID, "Claims", [], true);

  await ensureStringAttribute(CLAIMS_COLL_ID, "userId", 64, true);
  await ensureStringAttribute(CLAIMS_COLL_ID, "stickerId", 64, true);
  await ensureStringAttribute(CLAIMS_COLL_ID, "eventId", 64, true);
  await ensureStringAttribute(CLAIMS_COLL_ID, "code", 64, true);
  await ensureStringAttribute(CLAIMS_COLL_ID, "stickerName", 128, false);
  await ensureStringAttribute(CLAIMS_COLL_ID, "stickerImageUrl", 256, false);
  await ensureStringAttribute(CLAIMS_COLL_ID, "stickerRarity", 32, false);
  await ensureDatetimeAttribute(CLAIMS_COLL_ID, "claimedAt", true);

  await ensureIndex(CLAIMS_COLL_ID, "unique_sticker", "unique", ["stickerId"]);
  await ensureIndex(CLAIMS_COLL_ID, "unique_user_sticker", "unique", ["userId", "stickerId"]);
  await ensureIndex(CLAIMS_COLL_ID, "user_lookup", "key", ["userId"], ["ASC"]);
}

async function ensureCollection(databaseId, collectionId, name, permissions, documentSecurity) {
  try {
    await databases.getCollection(databaseId, collectionId);
    console.log(`[ok] Collection ${collectionId} already exists.`);
  } catch (err) {
    if (err.code === 404) {
      await databases.createCollection(databaseId, collectionId, name, permissions, documentSecurity);
      console.log(`[add] Created collection ${collectionId}.`);
    } else {
      throw err;
    }
  }
}

async function ensureStringAttribute(collectionId, key, size, required, defaultValue = null) {
  await ensureAttribute(collectionId, key, () =>
    databases.createStringAttribute(DB_ID, collectionId, key, size, required, defaultValue, false)
  );
}

async function ensureBooleanAttribute(collectionId, key, required, defaultValue = false) {
  await ensureAttribute(collectionId, key, () =>
    databases.createBooleanAttribute(DB_ID, collectionId, key, required, defaultValue, false)
  );
}

async function ensureDatetimeAttribute(collectionId, key, required) {
  await ensureAttribute(collectionId, key, () =>
    databases.createDatetimeAttribute(DB_ID, collectionId, key, required, false)
  );
}

async function ensureAttribute(collectionId, key, createFn) {
  try {
    await databases.getAttribute(DB_ID, collectionId, key);
    console.log(`[ok] Attribute ${key} on ${collectionId} exists.`);
    return;
  } catch (err) {
    if (err.code !== 404) {
      throw err;
    }
  }

  await createFn();
  console.log(`[add] Creating attribute ${key} on ${collectionId}.`);
  await waitForAttribute(collectionId, key);
}

async function waitForAttribute(collectionId, key, retries = 20) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const attribute = await databases.getAttribute(DB_ID, collectionId, key);
    if (!attribute.status || attribute.status === "available") {
      console.log(`[ok] Attribute ${key} on ${collectionId} ready.`);
      return;
    }
    await delay(500);
  }
  throw new Error(`Attribute ${key} on ${collectionId} did not become available in time.`);
}

async function ensureIndex(collectionId, key, type, attributes, orders = []) {
  try {
    await databases.getIndex(DB_ID, collectionId, key);
    console.log(`[ok] Index ${key} on ${collectionId} exists.`);
    return;
  } catch (err) {
    if (err.code !== 404) {
      throw err;
    }
  }

  await databases.createIndex(DB_ID, collectionId, key, type, attributes, orders);
  console.log(`[add] Created index ${key} on ${collectionId}.`);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
