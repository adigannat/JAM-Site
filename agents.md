## Event Site – LLM Agent Guide

This guide is the source of truth for autonomous or human agents working in `event-site`. It captures the current architecture, Appwrite integrations, conventions, and the guardrails you should respect when shipping updates.

---

### 1. Mission Snapshot
- **Experience**: Multi-route marketing site for JAM Events that blends storytelling with actionable conversions (signups, newsletter, inquiries).
- **Framework**: Next.js 15 App Router with React 19 (all TypeScript).
- **Styling**: Tailwind CSS v4 + bespoke utilities (`src/styles/globals.css`), animated gradients, Framer Motion transitions.
- **Appwrite Usage**:
  - Lead capture (`signup` collection)
  - Upcoming/past events (`events` collection + storage)
  - Featured testimonials (`testimonials` collection + storage)
  - Newsletter subscriptions (`newsletter` collection)
  - Detailed inquiries (`inquiries` collection)
- **Validation & Forms**: `react-hook-form` + `zod` in signup/newsletter; controlled form handling in contact flow.
- **Tooling**: ESLint (`next/core-web-vitals`, `next/typescript`), Prettier (Tailwind plugin), strict TypeScript, `framer-motion`.

Primary objective: deliver a premium event-planning funnel that can grow into a content-managed marketing site backed entirely by Appwrite data.

---

### 2. Repository Topology
```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, SEO metadata, sticky navigation
│   │   ├── page.tsx                # Home experience (hero, highlights, events, testimonials…)
│   │   ├── about/page.tsx          # Brand story, values, team, shared components
│   │   ├── events/page.tsx         # Upcoming + past events, signup CTA
│   │   ├── services/page.tsx       # Services catalogue, process, testimonials
│   │   └── contact/page.tsx        # Inquiry form, office info, FAQs
│   ├── components/
│   │   ├── Navigation.tsx          # Scroll-aware nav & mobile menu
│   │   ├── Hero.tsx / Highlights.tsx / Services.tsx
│   │   ├── EventsGallery.tsx       # Fetches upcoming events from Appwrite
│   │   ├── PastEvents.tsx          # Case-study style highlights
│   │   ├── Testimonials.tsx        # Fetches featured testimonials + avatars
│   │   ├── Partners.tsx            # Client/partner grid (ready for storage logos)
│   │   ├── Team.tsx                # Team bios (extendable with storage avatars)
│   │   ├── SignupForm.tsx          # Lead capture with duplicate prevention
│   │   ├── Newsletter.tsx          # Newsletter opt-in (Appwrite-backed)
│   │   ├── ContactForm.tsx         # Detailed inquiry submission
│   │   └── Footer.tsx              # Global footer and contact links
│   ├── lib/
│   │   └── appwrite.ts             # Client setup, typed helpers, storage utilities
│   └── styles/
│       └── globals.css             # Tailwind import + shared utility classes
├── docs/appwrite-setup.md          # Database, collection, and bucket checklist
├── README.md                       # Public overview (kept in sync with this file)
├── .env(.example)                  # Public Appwrite identifiers
└── Tooling configs (package.json, tsconfig.json, eslint, prettier, postcss…)
```

Refer to component files when altering UX—they are intentionally modular to allow reuse across routes.

---

### 3. Environment & Appwrite Requirements
Populate `.env` (and `.env.example`) with the following **public** identifiers:

- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_PUBLIC_APPWRITE_PROJECT_NAME`
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
- Collections:
  - `NEXT_PUBLIC_APPWRITE_COLLECTION_ID` (signups)
  - `NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID`
  - `NEXT_PUBLIC_APPWRITE_TESTIMONIALS_COLLECTION_ID`
  - `NEXT_PUBLIC_APPWRITE_NEWSLETTER_COLLECTION_ID`
  - `NEXT_PUBLIC_APPWRITE_INQUIRIES_COLLECTION_ID`
- Storage buckets:
  - `NEXT_PUBLIC_APPWRITE_EVENTS_BUCKET_ID`
  - `NEXT_PUBLIC_APPWRITE_TEAM_BUCKET_ID`
  - `NEXT_PUBLIC_APPWRITE_CLIENTS_BUCKET_ID`

`docs/appwrite-setup.md` spells out attribute schemas, indexes (e.g., email uniqueness), and permission guidance. Client-side writes require `create` access for anonymous users; keep `read/update/delete` locked to trusted roles.

---

### 4. Commands & Quality Gates
- `npm install` – install dependencies.
- `npm run dev` – dev server @ `http://localhost:3000`.
- `npm run build` / `npm run start` – production pipeline.
- `npm run lint` – Next.js ESLint bundle (must be clean).
- `npx prettier --write .` – optional formatting sweep before commits.

No automated tests exist yet. If you introduce non-trivial logic, add Jest/RTL or Playwright harnesses.

---

### 5. Runtime Architecture
1. **Global layout (`src/app/layout.tsx`)**
   - Applies Inter + Poppins fonts, comprehensive metadata (Open Graph, Twitter, robots).
   - Renders `Navigation` globally and offsets page content.

2. **Navigation (`src/components/Navigation.tsx`)**
   - Client component watching scroll to toggle background/shadow.
   - Handles responsive menu state and quick CTA to `/contact`.

3. **Home (`src/app/page.tsx`)**
   - Orchestrates marquee sections in order: `Hero`, `Highlights`, `EventsGallery`, `Testimonials`, `Partners`, `Newsletter`, `Footer`.
   - Animated gradient backdrop reused via absolute layers.

4. **Events route**
   - Fetches live upcoming events (`fetchEvents("upcoming")`) and surfaces static past case studies.
   - Reuses `SignupForm` to keep conversions close to content.

5. **Services route**
   - Uses `Services` component (pricing tiers/process), NPS stats, and CTA blocks.
   - Drops in testimonials & partners to reinforce credibility.

6. **About route**
   - Story-driven hero, values grid, team bios (`Team` component ready for Appwrite avatars), plus shared social proof sections.

7. **Contact route**
   - `ContactForm` posts to `submitInquiry` with rich payload (event type, budget, guest count, message). Surfaces error states for misconfiguration.
   - Additional cards highlight response time, locations, and direct-contact options.

8. **Data layer (`src/lib/appwrite.ts`)**
   - Configures `Client`, `Databases`, `Storage`, exports typed `SignupPayload`, `Event`, `Testimonial`, `NewsletterSubscription`, `Inquiry`.
   - Helpers:
     - `submitSignup`, `subscribeNewsletter`, `submitInquiry` (all guard against duplicates and missing config).
     - `fetchEvents`, `fetchTestimonials` with optional filters.
     - Storage utilities `getImageUrl`, `getEventImages`.
   - Throws `AppwriteEnvironmentError` when env is incomplete, aiding debugging.

---

### 6. Styling & UX Principles
- Tailwind utilities keep styles consistent; `globals.css` holds gradient helpers, focus rings, and base text styling.
- Soft-motion palette using Tailwind animations and Framer Motion (`PageTransition.tsx`) for future transitions.
- Components ship with loading skeletons (events/testimonials) to cover async fetch states.
- Forms respect accessibility: labeled inputs, focus-visible outlines, inline validation, descriptive messaging.

---

### 7. Agent Workflow Checklist
1. **Recon first** – skim the relevant page/component plus `lib/appwrite.ts` before implementing changes.
2. **Schema alignment** – any change to form fields or data flows must update:
   - Component schema/validators/defaults
   - `SignupPayload`/related types in `lib/appwrite.ts`
   - Appwrite collection attributes
   - `.env.example` and `docs/appwrite-setup.md`
3. **Environment hygiene** – only add `NEXT_PUBLIC_` variables for values safe to expose; push secrets to server actions/functions if required later.
4. **Quality gate** – run `npm run lint`; add tests when logic grows.
5. **Formatting** – let Prettier manage Tailwind class order. Avoid manual re-sorting.
6. **Documentation** – update this guide and README when architecture, env vars, or workflows evolve.

---

### 8. Extension Opportunities
- Bind partner/team sections to Appwrite storage for real imagery.
- Build admin dashboards or API routes to manage events/testimonials/inquiries.
- Integrate analytics and conversion tracking.
- Introduce automated testing and CI workflows.
- Extract a design-system layer (buttons, cards, badges) as the UI catalog expands.

---

### 9. Known Follow-Ups
- Upload real assets to storage buckets and wire into Partners/Team components.
- Add tests to protect complex flows (newsletter + inquiry submissions).
- Populate `next.config.mjs` if remote images/domains become necessary.
- Review `docs/appwrite-setup.md` alongside any schema or env updates.

---

### 10. Quick Reference
- Home composition: `src/app/page.tsx`
- Navigation: `src/components/Navigation.tsx`
- Signup form: `src/components/SignupForm.tsx`
- Newsletter: `src/components/Newsletter.tsx`
- Contact form: `src/components/ContactForm.tsx`
- Appwrite helpers & types: `src/lib/appwrite.ts`
- Env template: `.env.example`
- Documentation: `README.md`, `docs/appwrite-setup.md`
- Commands: `npm run dev`, `npm run lint`, `npm run build`

Keep this doc current—future agents rely on it to understand the system quickly and deliver high-quality updates without regressions.
