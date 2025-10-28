import { Query } from "appwrite";
import {
  ClaimDocument,
  claimsCollectionId,
  databaseId,
  databases
} from "./appwrite";

export interface UserClaim {
  id: string;
  stickerId: string;
  eventId: string;
  code: string;
  stickerName?: string;
  stickerImageUrl?: string;
  stickerRarity?: string;
  claimedAt: string;
}

export async function fetchUserClaims(userId: string): Promise<UserClaim[]> {
  const response = await databases.listDocuments<ClaimDocument>(
    databaseId,
    claimsCollectionId,
    [Query.equal("userId", userId), Query.orderDesc("claimedAt")]
  );

  return response.documents.map((doc) => ({
    id: doc.$id,
    stickerId: doc.stickerId,
    eventId: doc.eventId,
    code: doc.code,
    stickerName: doc.stickerName,
    stickerImageUrl: doc.stickerImageUrl,
    stickerRarity: doc.stickerRarity,
    claimedAt: doc.claimedAt
  }));
}
