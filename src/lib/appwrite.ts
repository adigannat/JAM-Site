import { Account, Client, Databases, ID, Query, Storage } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;
const eventsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID;
const testimonialsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_TESTIMONIALS_COLLECTION_ID;
const newsletterCollectionId = process.env.NEXT_PUBLIC_APPWRITE_NEWSLETTER_COLLECTION_ID;
const inquiriesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_INQUIRIES_COLLECTION_ID;
const eventsBucketId = process.env.NEXT_PUBLIC_APPWRITE_EVENTS_BUCKET_ID;
const teamBucketId = process.env.NEXT_PUBLIC_APPWRITE_TEAM_BUCKET_ID;
const clientsBucketId = process.env.NEXT_PUBLIC_APPWRITE_CLIENTS_BUCKET_ID;

if (!endpoint || !projectId) {
  // eslint-disable-next-line no-console
  console.warn(
    "Appwrite client is missing NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID"
  );
}

const client = new Client();

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export type SignupPayload = {
  fullName: string;
  email: string;
  phone?: string;
  eventInterests: string[];
  notes?: string;
  marketingConsent: boolean;
};

export type Event = {
  $id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  eventType: string;
  status: "upcoming" | "ongoing" | "past";
  imageIds: string[];
  attendees?: number;
  maxAttendees?: number;
  price?: number;
  highlights?: string[];
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  $id: string;
  clientName: string;
  clientRole?: string;
  companyName?: string;
  rating: number;
  testimonial: string;
  eventType?: string;
  imageId?: string;
  featured: boolean;
  createdAt: string;
};

export type NewsletterSubscription = {
  $id: string;
  email: string;
  name?: string;
  subscriptionDate: string;
  isActive: boolean;
};

export type Inquiry = {
  $id: string;
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  guestCount?: number;
  budget?: string;
  message: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: string;
};

export class AppwriteEnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppwriteEnvironmentError";
  }
}

export class DuplicateSignupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateSignupError";
  }
}

function assertEnv() {
  if (!endpoint || !projectId) {
    throw new AppwriteEnvironmentError(
      "Missing Appwrite endpoint or project ID. Update your environment variables."
    );
  }

  if (!databaseId || !collectionId) {
    throw new AppwriteEnvironmentError(
      "Missing Appwrite database or collection ID. Update your environment variables."
    );
  }
}

export async function submitSignup(payload: SignupPayload) {
  assertEnv();

  const normalizedEmail = payload.email.toLowerCase();

  const existing = await databases.listDocuments(databaseId!, collectionId!, [
    Query.equal("email", normalizedEmail),
  ]);

  if (existing.total > 0) {
    throw new DuplicateSignupError("This email address is already registered.");
  }

  return databases.createDocument(databaseId!, collectionId!, ID.unique(), {
    fullName: payload.fullName,
    email: normalizedEmail,
    phone: payload.phone ?? "",
    eventInterests: payload.eventInterests,
    notes: payload.notes ?? "",
    marketingConsent: payload.marketingConsent,
    createdAt: new Date().toISOString(),
  });
}

// Fetch events with optional filtering
export async function fetchEvents(status?: "upcoming" | "past" | "ongoing") {
  if (!databaseId || !eventsCollectionId) return { documents: [], total: 0 };

  const queries = [Query.orderDesc("date"), Query.limit(100)];
  if (status) {
    queries.push(Query.equal("status", status));
  }

  return databases.listDocuments(databaseId, eventsCollectionId, queries);
}

// Fetch featured testimonials
export async function fetchTestimonials(featured = false) {
  if (!databaseId || !testimonialsCollectionId)
    return { documents: [], total: 0 };

  const queries = [Query.orderDesc("createdAt"), Query.limit(50)];
  if (featured) {
    queries.push(Query.equal("featured", true));
  }

  return databases.listDocuments(databaseId, testimonialsCollectionId, queries);
}

// Subscribe to newsletter
export async function subscribeNewsletter(email: string, name?: string) {
  assertEnv();

  if (!newsletterCollectionId) {
    throw new AppwriteEnvironmentError("Newsletter collection ID is missing.");
  }

  const normalizedEmail = email.toLowerCase();

  // Check for existing subscription
  const existing = await databases.listDocuments(
    databaseId!,
    newsletterCollectionId,
    [Query.equal("email", normalizedEmail)]
  );

  if (existing.total > 0) {
    throw new DuplicateSignupError(
      "This email is already subscribed to our newsletter."
    );
  }

  return databases.createDocument(
    databaseId!,
    newsletterCollectionId,
    ID.unique(),
    {
      email: normalizedEmail,
      name: name || "",
      subscriptionDate: new Date().toISOString(),
      isActive: true,
    }
  );
}

// Submit inquiry/contact form
export async function submitInquiry(data: Omit<Inquiry, "$id" | "status" | "createdAt">) {
  assertEnv();

  if (!inquiriesCollectionId) {
    throw new AppwriteEnvironmentError("Inquiries collection ID is missing.");
  }

  return databases.createDocument(databaseId!, inquiriesCollectionId, ID.unique(), {
    ...data,
    status: "new",
    createdAt: new Date().toISOString(),
  });
}

// Get image URL from storage
export function getImageUrl(bucketId: string, fileId: string) {
  if (!endpoint || !projectId) return "";
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}

// Get event images
export function getEventImages(imageIds: string[]) {
  if (!eventsBucketId) return [];
  return imageIds.map((id) => getImageUrl(eventsBucketId, id));
}

export {
  client,
  account,
  databases,
  storage,
  eventsCollectionId,
  testimonialsCollectionId,
  newsletterCollectionId,
  inquiriesCollectionId,
  eventsBucketId,
  teamBucketId,
  clientsBucketId,
};
