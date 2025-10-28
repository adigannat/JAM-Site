import { functions, claimFunctionId } from "./appwrite";

export interface ClaimStickerPayload {
  code: string;
  sig?: string;
}

export interface ClaimStickerResponse {
  ok: boolean;
  claim?: {
    id: string;
    stickerId: string;
    eventId: string;
    code: string;
    stickerName?: string;
    stickerImageUrl?: string;
    stickerRarity?: string;
    claimedAt: string;
  };
  error?: string;
  status?: number;
}

export async function claimSticker(
  payload: ClaimStickerPayload
): Promise<ClaimStickerResponse> {
  const execution = await functions.createExecution(
    claimFunctionId,
    JSON.stringify(payload),
    false,
    undefined,
    "POST",
    {}
  );

  try {
    const parsed = JSON.parse(execution.response) as ClaimStickerResponse;
    return {
      ...parsed,
      status: parsed.status ?? execution.statusCode
    };
  } catch (error) {
    console.error("Failed to parse claim response", error);
    return {
      ok: false,
      error: "Invalid response from claim function",
      status: execution.statusCode
    };
  }
}
