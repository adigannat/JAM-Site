import { z } from "zod";

const envSchema = z.object({
  VITE_APPWRITE_ENDPOINT: z.string().url(),
  VITE_APPWRITE_PROJECT_ID: z.string().min(1),
  VITE_APPWRITE_DATABASE_ID: z.string().min(1),
  VITE_APPWRITE_STICKERS_COLLECTION_ID: z.string().min(1),
  VITE_APPWRITE_CLAIMS_COLLECTION_ID: z.string().min(1),
  VITE_APPWRITE_CLAIM_FUNCTION_ID: z.string().min(1)
});

// Demo/fallback values for development
const DEMO_VALUES = {
  VITE_APPWRITE_ENDPOINT: "https://cloud.appwrite.io/v1",
  VITE_APPWRITE_PROJECT_ID: "demo_project",
  VITE_APPWRITE_DATABASE_ID: "event_db",
  VITE_APPWRITE_STICKERS_COLLECTION_ID: "stickers",
  VITE_APPWRITE_CLAIMS_COLLECTION_ID: "claims",
  VITE_APPWRITE_CLAIM_FUNCTION_ID: "claimSticker"
};

const parsed = envSchema.safeParse({
  VITE_APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
  VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  VITE_APPWRITE_STICKERS_COLLECTION_ID:
    import.meta.env.VITE_APPWRITE_STICKERS_COLLECTION_ID,
  VITE_APPWRITE_CLAIMS_COLLECTION_ID:
    import.meta.env.VITE_APPWRITE_CLAIMS_COLLECTION_ID,
  VITE_APPWRITE_CLAIM_FUNCTION_ID:
    import.meta.env.VITE_APPWRITE_CLAIM_FUNCTION_ID
});

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  const missingVars = Object.keys(errors).join(", ");

  console.warn(
    "%c⚠️ Environment Configuration Missing - Using Demo Mode",
    "color: #f6b73c; font-size: 16px; font-weight: bold"
  );
  console.warn("Missing or invalid environment variables:", errors);
  console.warn(
    "\n📋 To use real Appwrite backend:\n" +
    "1. Go to https://cloud.appwrite.io and get your Project ID\n" +
    "2. Create/edit .env file in the project root\n" +
    "3. Add: VITE_APPWRITE_PROJECT_ID=your_actual_project_id\n" +
    "4. Restart the development server (Ctrl+C then npm run dev)\n" +
    `\n⚠️  Demo mode active - authentication and scanning won't work`
  );

  // Use demo values to let the app load
  console.info(
    "%c🎨 App loaded in DEMO MODE - UI only, backend features disabled",
    "color: #5A39F4; font-weight: bold"
  );
}

export const env = parsed.success ? parsed.data : DEMO_VALUES;
export const isDemoMode = !parsed.success;
