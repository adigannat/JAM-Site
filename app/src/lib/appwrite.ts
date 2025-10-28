import { Account, Avatars, Client, Databases, Functions, Models, Query } from "appwrite";
import { env } from "./env";

export const client = new Client()
  .setEndpoint(env.VITE_APPWRITE_ENDPOINT)
  .setProject(env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const avatars = new Avatars(client);

export const databaseId = env.VITE_APPWRITE_DATABASE_ID;
export const stickersCollectionId = env.VITE_APPWRITE_STICKERS_COLLECTION_ID;
export const claimsCollectionId = env.VITE_APPWRITE_CLAIMS_COLLECTION_ID;
export const claimFunctionId = env.VITE_APPWRITE_CLAIM_FUNCTION_ID;

export type AppwriteUser = Models.User<Models.Preferences>;

export interface ClaimDocument extends Models.Document {
  userId: string;
  stickerId: string;
  eventId: string;
  code: string;
  stickerName?: string;
  stickerImageUrl?: string;
  stickerRarity?: string;
  claimedAt: string;
}

export function buildClaimsOwnerQuery(userId: string): string[] {
  return [Query.equal("userId", userId), Query.orderDesc("claimedAt")];
}
