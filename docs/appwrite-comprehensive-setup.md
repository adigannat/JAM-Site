# Comprehensive Appwrite Setup for JAM Events Website

This guide covers the complete Appwrite backend configuration for the JAM Events website, including all databases, collections, storage buckets, and recommended automations.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Database & Collections](#database--collections)
3. [Storage Buckets](#storage-buckets)
4. [Indexes](#indexes)
5. [Permissions](#permissions)
6. [Appwrite Functions (Optional)](#appwrite-functions-optional)
7. [Environment Variables](#environment-variables)
8. [Testing](#testing)

---

## 1. Project Setup

### Create Appwrite Project

1. Log into your Appwrite Console
2. Create a new project or use existing project
3. Copy your Project ID and Endpoint to your `.env` file

**Environment Variables:**
```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=Event Site
```

---

## 2. Database & Collections

### Create Database

1. Navigate to **Databases** in Appwrite Console
2. Click **Create Database**
3. Database ID: `jam_events`
4. Database Name: `JAM Events Database`

### Collection 1: Signups (`jam_signups`)

**Purpose:** Store community signup form submissions

**Attributes:**

| Attribute          | Type     | Size    | Required | Default | Array |
|--------------------|----------|---------|----------|---------|-------|
| `fullName`         | string   | 80      | Yes      | -       | No    |
| `email`            | email    | 191     | Yes      | -       | No    |
| `phone`            | string   | 32      | No       | ""      | No    |
| `eventInterests`   | string   | 50      | Yes      | -       | Yes   |
| `notes`            | string   | 400     | No       | ""      | No    |
| `marketingConsent` | boolean  | -       | Yes      | false   | No    |
| `createdAt`        | datetime | -       | Yes      | now()   | No    |

**Indexes:**
- `email_idx` - Attribute: `email`, Order: ASC (for duplicate detection)

---

### Collection 2: Events (`events`)

**Purpose:** Store upcoming and past events

**Attributes:**

| Attribute       | Type     | Size    | Required | Default | Array |
|-----------------|----------|---------|----------|---------|-------|
| `title`         | string   | 150     | Yes      | -       | No    |
| `description`   | string   | 1000    | Yes      | -       | No    |
| `date`          | datetime | -       | Yes      | -       | No    |
| `location`      | string   | 200     | Yes      | -       | No    |
| `eventType`     | string   | 100     | Yes      | -       | No    |
| `status`        | string   | 20      | Yes      | -       | No    |
| `imageIds`      | string   | 100     | No       | -       | Yes   |
| `attendees`     | integer  | -       | No       | 0       | No    |
| `maxAttendees`  | integer  | -       | No       | -       | No    |
| `price`         | float    | -       | No       | 0       | No    |
| `highlights`    | string   | 100     | No       | -       | Yes   |
| `createdAt`     | datetime | -       | Yes      | now()   | No    |
| `updatedAt`     | datetime | -       | Yes      | now()   | No    |

**Valid Status Values:** `upcoming`, `ongoing`, `past`

**Indexes:**
- `date_idx` - Attribute: `date`, Order: DESC
- `status_idx` - Attribute: `status`, Order: ASC

---

### Collection 3: Testimonials (`testimonials`)

**Purpose:** Client testimonials and reviews

**Attributes:**

| Attribute      | Type     | Size    | Required | Default | Array |
|----------------|----------|---------|----------|---------|-------|
| `clientName`   | string   | 100     | Yes      | -       | No    |
| `clientRole`   | string   | 100     | No       | ""      | No    |
| `companyName`  | string   | 150     | No       | ""      | No    |
| `rating`       | integer  | -       | Yes      | 5       | No    |
| `testimonial`  | string   | 800     | Yes      | -       | No    |
| `eventType`    | string   | 100     | No       | ""      | No    |
| `imageId`      | string   | 100     | No       | ""      | No    |
| `featured`     | boolean  | -       | Yes      | false   | No    |
| `createdAt`    | datetime | -       | Yes      | now()   | No    |

**Indexes:**
- `featured_idx` - Attribute: `featured`, Order: DESC
- `created_idx` - Attribute: `createdAt`, Order: DESC

---

### Collection 4: Newsletter (`newsletter`)

**Purpose:** Newsletter subscription list

**Attributes:**

| Attribute          | Type     | Size    | Required | Default | Array |
|--------------------|----------|---------|----------|---------|-------|
| `email`            | email    | 191     | Yes      | -       | No    |
| `name`             | string   | 100     | No       | ""      | No    |
| `subscriptionDate` | datetime | -       | Yes      | now()   | No    |
| `isActive`         | boolean  | -       | Yes      | true    | No    |

**Indexes:**
- `email_idx` - Attribute: `email`, Order: ASC (unique constraint)

---

### Collection 5: Inquiries (`inquiries`)

**Purpose:** Contact form submissions and event inquiries

**Attributes:**

| Attribute    | Type     | Size    | Required | Default | Array |
|--------------|----------|---------|----------|---------|-------|
| `name`       | string   | 100     | Yes      | -       | No    |
| `email`      | email    | 191     | Yes      | -       | No    |
| `phone`      | string   | 32      | No       | ""      | No    |
| `eventType`  | string   | 100     | Yes      | -       | No    |
| `eventDate`  | string   | 50      | No       | ""      | No    |
| `guestCount` | integer  | -       | No       | 0       | No    |
| `budget`     | string   | 50      | No       | ""      | No    |
| `message`    | string   | 2000    | Yes      | -       | No    |
| `status`     | string   | 20      | Yes      | "new"   | No    |
| `createdAt`  | datetime | -       | Yes      | now()   | No    |

**Valid Status Values:** `new`, `contacted`, `converted`, `closed`

**Indexes:**
- `status_idx` - Attribute: `status`, Order: ASC
- `created_idx` - Attribute: `createdAt`, Order: DESC

---

## 3. Storage Buckets

### Bucket 1: Events Gallery (`events_gallery`)

**Purpose:** Store event photos and media

**Settings:**
- Maximum File Size: 10MB
- Allowed File Extensions: `jpg`, `jpeg`, `png`, `webp`, `gif`
- Compression: Enabled
- Encryption: Enabled
- Antivirus: Enabled

**Permissions:**
- Read: `Any` (public viewing)
- Create: `Role: team` (admin uploads only)
- Update: `Role: team`
- Delete: `Role: team`

---

### Bucket 2: Team Photos (`team_photos`)

**Purpose:** Team member headshots and photos

**Settings:**
- Maximum File Size: 5MB
- Allowed File Extensions: `jpg`, `jpeg`, `png`, `webp`
- Compression: Enabled
- Encryption: Enabled

**Permissions:**
- Read: `Any`
- Create/Update/Delete: `Role: team`

---

### Bucket 3: Client Logos (`client_logos`)

**Purpose:** Partner and client company logos

**Settings:**
- Maximum File Size: 2MB
- Allowed File Extensions: `jpg`, `jpeg`, `png`, `webp`, `svg`
- Compression: Enabled

**Permissions:**
- Read: `Any`
- Create/Update/Delete: `Role: team`

---

## 4. Indexes

All indexes are listed above with each collection. Key indexes for performance:

### Critical Indexes
1. **Signups** - `email` (duplicate prevention)
2. **Events** - `date`, `status` (filtering and sorting)
3. **Testimonials** - `featured`, `createdAt` (featured testimonials)
4. **Newsletter** - `email` (duplicate prevention)
5. **Inquiries** - `status`, `createdAt` (inquiry management)

---

## 5. Permissions

### Public Collections (Read-Only)
- **Events**: Any user can read, only team can create/update/delete
- **Testimonials**: Any user can read, only team can manage
- **Team Photos**: Public read access

### User-Generated Collections (Create-Only)
- **Signups**: Any user can create (unauthenticated), only team can read
- **Newsletter**: Any user can create, only team can read/manage
- **Inquiries**: Any user can create, only team can read/manage

### Recommended Permission Settings

**For Public Read Collections (Events, Testimonials):**
```
Read: Any
Create: Role:team
Update: Role:team
Delete: Role:team
```

**For User Submission Collections (Signups, Newsletter, Inquiries):**
```
Create: Any
Read: Role:team
Update: Role:team
Delete: Role:team
```

**Note:** Create a team role for admin users to manage content.

---

## 6. Appwrite Functions (Optional)

### Function 1: Email Notification on Signup

**Trigger:** `databases.jam_events.collections.jam_signups.documents.*.create`

**Purpose:** Send email notification to team when new signup occurs

**Example Node.js Function:**
```javascript
import { Client, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  // Send email notification using your email service
  // (SendGrid, Mailgun, AWS SES, etc.)

  return res.json({ success: true });
};
```

---

### Function 2: Newsletter Welcome Email

**Trigger:** `databases.jam_events.collections.newsletter.documents.*.create`

**Purpose:** Send welcome email to new newsletter subscribers

---

### Function 3: Inquiry Auto-Response

**Trigger:** `databases.jam_events.collections.inquiries.documents.*.create`

**Purpose:** Send automatic confirmation email to inquiry submitters

---

### Function 4: Image Optimization

**Trigger:** Manual or scheduled

**Purpose:** Automatically optimize and resize uploaded images

---

## 7. Environment Variables

Copy this to your `.env` and `.env.example`:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68f8c91600302ad3cdd2
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=Event Site
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_DATABASE_ID=jam_events

# Collections
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=jam_signups
NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID=events
NEXT_PUBLIC_APPWRITE_TESTIMONIALS_COLLECTION_ID=testimonials
NEXT_PUBLIC_APPWRITE_NEWSLETTER_COLLECTION_ID=newsletter
NEXT_PUBLIC_APPWRITE_INQUIRIES_COLLECTION_ID=inquiries

# Storage Buckets
NEXT_PUBLIC_APPWRITE_EVENTS_BUCKET_ID=events_gallery
NEXT_PUBLIC_APPWRITE_TEAM_BUCKET_ID=team_photos
NEXT_PUBLIC_APPWRITE_CLIENTS_BUCKET_ID=client_logos
```

---

## 8. Testing

### Test Checklist

#### Database Tests
- [ ] Create a test signup and verify it appears in `jam_signups`
- [ ] Try duplicate email signup and verify error handling
- [ ] Create test events with different statuses
- [ ] Add testimonials with featured flag
- [ ] Subscribe to newsletter with duplicate email test

#### Storage Tests
- [ ] Upload test images to each bucket
- [ ] Verify public access to images via URL
- [ ] Test file size and type restrictions
- [ ] Verify compression is working

#### Function Tests (if implemented)
- [ ] Verify email notifications are sent
- [ ] Check auto-response emails
- [ ] Test image optimization

#### Permission Tests
- [ ] Verify unauthenticated users can submit forms
- [ ] Ensure unauthenticated users cannot read sensitive data
- [ ] Test team role can manage all content

---

## 9. Production Checklist

Before going live:

1. **Security**
   - [ ] Review all permission settings
   - [ ] Enable rate limiting on collections
   - [ ] Set up API key rotation policy
   - [ ] Enable Appwrite security headers

2. **Performance**
   - [ ] Verify all indexes are created
   - [ ] Enable CDN for storage buckets
   - [ ] Set up caching policies
   - [ ] Monitor database query performance

3. **Backup**
   - [ ] Set up automated database backups
   - [ ] Configure storage bucket backup policy
   - [ ] Document recovery procedures

4. **Monitoring**
   - [ ] Set up Appwrite monitoring
   - [ ] Configure alerts for errors
   - [ ] Track usage metrics
   - [ ] Monitor storage limits

---

## Support & Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord Community](https://appwrite.io/discord)
- Project Maintainer: JAM Events Development Team

---

**Last Updated:** October 2025
