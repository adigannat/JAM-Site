import crypto from "node:crypto";
import {
  Account,
  Client,
  Databases,
  ID,
  Models,
  Permission,
  Query,
  Role
} from "node-appwrite";
import { z } from "zod";

const envSchema = z.object({
  APPWRITE_ENDPOINT: z.string().url(),
  APPWRITE_PROJECT_ID: z.string().min(1),
  APPWRITE_API_KEY: z.string().min(1),
  DB_ID: z.string().min(1),
  STICKERS_COLL_ID: z.string().min(1),
  CLAIMS_COLL_ID: z.string().min(1),
  SIGNING_SECRET: z.string().optional()
});

const payloadSchema = z.object({
  code: z.string().min(1, "Code is required"),
  sig: z.string().min(1).optional()
});

interface FunctionContext {
  req: {
    body: string | null;
    headers: Record<string, string>;
  };
  res: {
    json: (payload: unknown, status?: number) => void;
  };
  log: (message: string) => void;
  error: (message: string) => void;
}

interface StickerDocument extends Models.Document {
  code: string;
  eventId: string;
  active: boolean;
  name?: string;
  imageUrl?: string;
  rarity?: string;
}

export default async function handler({
  req,
  res,
  log,
  error
}: FunctionContext): Promise<void> {
  const config = envSchema.safeParse({
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
    DB_ID: process.env.DB_ID,
    STICKERS_COLL_ID: process.env.STICKERS_COLL_ID,
    CLAIMS_COLL_ID: process.env.CLAIMS_COLL_ID,
    SIGNING_SECRET: process.env.SIGNING_SECRET
  });

  if (!config.success) {
    error(`Invalid configuration: ${JSON.stringify(config.error.flatten())}`);
    res.json(
      {
        ok: false,
        error: "Function misconfigured. Contact the event team.",
        status: 500
      },
      500
    );
    return;
  }

  const env = config.data;

  const authUserId = req.headers["x-appwrite-user-id"];
  const authUserJwt = req.headers["x-appwrite-user-jwt"];

  if (!authUserId || !authUserJwt) {
    res.json(
      {
        ok: false,
        error: "Authentication required.",
        status: 401
      },
      401
    );
    return;
  }

  const parsedPayload = safeJsonParse(req.body);
  const payloadResult = payloadSchema.safeParse(parsedPayload);

  if (!payloadResult.success) {
    res.json(
      {
        ok: false,
        error: "Invalid request payload.",
        status: 400
      },
      400
    );
    return;
  }

  const payload = payloadResult.data;

  if (env.SIGNING_SECRET) {
    if (!payload.sig) {
      res.json(
        {
          ok: false,
          error: "Signed stickers require a signature.",
          status: 401
        },
        401
      );
      return;
    }

    const expected = computeSignature(payload.code, env.SIGNING_SECRET, payload.sig.length);
    if (!timingSafeEqual(expected, payload.sig)) {
      res.json(
        {
          ok: false,
          error: "Signature mismatch.",
          status: 401
        },
        401
      );
      return;
    }
  }

  const privilegedClient = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

  const userClient = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setJWT(authUserJwt);

  const account = new Account(userClient);
  const databases = new Databases(privilegedClient);

  let currentUser;
  try {
    currentUser = await account.get();
  } catch (fetchError) {
    error(`Failed to resolve user: ${String(fetchError)}`);
    res.json(
      {
        ok: false,
        error: "Authentication expired. Please sign in again.",
        status: 401
      },
      401
    );
    return;
  }

  try {
    const stickerList = await databases.listDocuments<StickerDocument>(
      env.DB_ID,
      env.STICKERS_COLL_ID,
      [Query.equal("code", payload.code), Query.equal("active", true)]
    );

    const sticker = stickerList.documents[0];

    if (!sticker || sticker.active === false) {
      res.json(
        {
          ok: false,
          error: "Invalid or inactive sticker.",
          status: 404
        },
        404
      );
      return;
    }

    const claimedAt = new Date().toISOString();

    try {
      const claimDoc = await databases.createDocument(
        env.DB_ID,
        env.CLAIMS_COLL_ID,
        ID.unique(),
        {
          userId: currentUser.$id,
          stickerId: sticker.$id,
          eventId: sticker.eventId,
          code: sticker.code,
          stickerName: sticker.name,
          stickerImageUrl: sticker.imageUrl,
          stickerRarity: sticker.rarity,
          claimedAt
        },
        [Permission.read(Role.user(currentUser.$id))]
      );

      await deactivateSticker(databases, env.DB_ID, env.STICKERS_COLL_ID, sticker.$id, log);

      res.json(
        {
          ok: true,
          claim: {
            id: claimDoc.$id,
            stickerId: sticker.$id,
            eventId: sticker.eventId,
            code: sticker.code,
            stickerName: sticker.name,
            stickerImageUrl: sticker.imageUrl,
            stickerRarity: sticker.rarity,
            claimedAt
          }
        },
        200
      );
    } catch (claimError) {
      if (isConflictError(claimError)) {
        res.json(
          {
            ok: false,
            error: "Sticker already claimed.",
            status: 409
          },
          409
        );
        return;
      }

      throw claimError;
    }
  } catch (unknownError) {
    error(`Unhandled error: ${String(unknownError)}`);
    res.json(
      {
        ok: false,
        error: "Unable to claim sticker at this time.",
        status: 500
      },
      500
    );
  }
}

function safeJsonParse(body: string | null): unknown {
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function computeSignature(code: string, secret: string, length: number): string {
  const digest = crypto.createHmac("sha256", secret).update(code).digest("hex");
  return digest.slice(0, length);
}

function timingSafeEqual(expected: string, provided: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

async function deactivateSticker(
  databases: Databases,
  databaseId: string,
  stickersCollectionId: string,
  stickerId: string,
  log: (message: string) => void
) {
  try {
    await databases.updateDocument(databaseId, stickersCollectionId, stickerId, {
      active: false
    });
  } catch (updateError) {
    log(`Failed to deactivate sticker ${stickerId}: ${String(updateError)}`);
  }
}

function isConflictError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 409;
}
