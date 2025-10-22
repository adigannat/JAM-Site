# JAM Events Experience Platform

A multi-page marketing experience for JAM Events built with Next.js 15 and Appwrite. The site blends immersive storytelling with data-driven sections—live event listings, testimonials, newsletter opt-ins, and inquiries all flow into Appwrite so the team can act quickly.

---

## ✨ Feature Highlights
- **Global navigation** with scroll-aware styling, mobile menu, and quick CTAs.
- **Home experience** that layers hero storytelling, service highlights, live events, testimonials, partner carousel, and newsletter signup.
- **Dedicated routes** for Events, Services, About, and Contact—each combining rich content blocks with data pulled from Appwrite.
- **Appwrite-backed interactions**:
  - Lead capture (`SignupForm`) with duplicate protection.
  - Newsletter subscriptions (`Newsletter`) with inline status messaging.
  - Inquiry form (`ContactForm`) that records detailed briefs for the sales team.
  - Dynamic event gallery and featured testimonials that hydrate from Appwrite collections and storage buckets.
- **Modern visual language**: Tailwind CSS v4 utilities, animated gradients, Framer Motion transitions, and accessible focus states.

---

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with custom utilities in `src/styles/globals.css`
- **Animation**: Framer Motion (page/section transitions)
- **Forms & Validation**: `react-hook-form` + `zod`
- **Platform SDK**: Appwrite JavaScript SDK (`appwrite` 18.x) for databases and storage
- **Linting/Formatting**: ESLint (`next/core-web-vitals`, `next/typescript`) and Prettier with the Tailwind plugin

---

## 📁 Directory Overview
```
.
├── public/                       # Static assets (favicons, og image stubs, etc.)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Global layout, head metadata, navigation wrapper
│   │   ├── page.tsx              # Home experience
│   │   ├── about/page.tsx        # Story, values, team, shared testimonials & partners
│   │   ├── events/page.tsx       # Upcoming & past events + lead capture
│   │   ├── services/page.tsx     # Service catalogue and process highlights
│   │   └── contact/page.tsx      # Full-screen inquiry form and contact details
│   ├── components/               # Reusable sections & UI primitives
│   │   ├── ContactForm.tsx       # Appwrite-backed inquiry form
│   │   ├── EventsGallery.tsx     # Upcoming events (Appwrite + Storage imagery)
│   │   ├── Newsletter.tsx        # Newsletter opt-in with duplicate handling
│   │   ├── Navigation.tsx        # Sticky header with responsive menu
│   │   ├── Partners.tsx          # Placeholder partner grid
│   │   ├── PastEvents.tsx        # Archive blocks (static copy, extendable)
│   │   ├── Services.tsx / Testimonials.tsx / Team.tsx / etc.
│   │   └── SignupForm.tsx        # Lead capture for curated experiences
│   ├── lib/
│   │   └── appwrite.ts           # Client config, typed helpers, data fetchers
│   └── styles/
│       └── globals.css           # Tailwind import + shared gradient/focus utilities
├── docs/
│   └── appwrite-setup.md         # Database, collection, and bucket configuration
├── agents.md                     # Orientation for LLM and human contributors
├── .env / .env.example           # Public Appwrite identifiers
├── package.json                  # Scripts & dependencies
├── tsconfig.json                 # TypeScript compiler settings
├── .eslintrc.json                # ESLint configuration
├── postcss.config.mjs            # Tailwind/PostCSS pipeline
└── prettier.config.js            # Prettier (Tailwind aware)
```

See `agents.md` for a deeper architectural walkthrough tailored to contributors.

---

## ⚙️ Prerequisites
1. **Node.js** 20.x (LTS recommended) and npm.
2. An **Appwrite** instance/project with permission to create databases, collections, and storage buckets (cloud or self-hosted).

---

## 🚀 Getting Started
```bash
# install dependencies
npm install

# local development
npm run dev    # http://localhost:3000

# linting
npm run lint

# production build & preview
npm run build
npm run start
```

---

## 🔐 Environment Variables
Copy `.env.example` to `.env` and populate the IDs from your Appwrite project:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite HTTP endpoint (e.g. https://cloud.appwrite.io/v1) |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Project ID that the public client connects to |
| `NEXT_PUBLIC_APPWRITE_PROJECT_NAME` | Used for display in UI |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | Primary database containing all collections |
| `NEXT_PUBLIC_APPWRITE_COLLECTION_ID` | Lead capture (signup form) collection |
| `NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID` | Upcoming events records |
| `NEXT_PUBLIC_APPWRITE_TESTIMONIALS_COLLECTION_ID` | Client testimonials |
| `NEXT_PUBLIC_APPWRITE_NEWSLETTER_COLLECTION_ID` | Newsletter subscriptions |
| `NEXT_PUBLIC_APPWRITE_INQUIRIES_COLLECTION_ID` | Detailed contact/inquiry submissions |
| `NEXT_PUBLIC_APPWRITE_EVENTS_BUCKET_ID` | Storage bucket for event imagery |
| `NEXT_PUBLIC_APPWRITE_TEAM_BUCKET_ID` | Storage bucket for team/testimonial avatars |
| `NEXT_PUBLIC_APPWRITE_CLIENTS_BUCKET_ID` | Storage bucket for partner/client logos |

All values are public-facing. Do **not** embed Appwrite API keys in the client—use server actions or Appwrite Functions when privileged operations are required.

---

## 🗄 Appwrite Resources
Follow `docs/appwrite-setup.md` for attribute-level detail. At a glance:

- **Collections**
  - `jam_signups`: full name, email, phone, interests, notes, marketing consent.
  - `events`: event metadata (title, description, date, location, status, imagery, highlights, ticketing).
  - `testimonials`: client quotes, rating, optional avatar reference.
  - `newsletter`: active subscriptions and timestamps.
  - `inquiries`: inquiry payload from the contact page, including guest count and budget.
- **Indexes**
  - Email uniqueness on `jam_signups` and `newsletter`.
  - Status/date ordering on event collections.
- **Buckets**
  - `events_gallery`, `team_photos`, `client_logos` for hero images, avatars, and logo walls.

Ensure unauthenticated users have `create` permissions where client-side writes occur (signups, newsletter, inquiries). Lock down `read/update/delete` to team members or API keys.

---

## 🧱 Architecture At A Glance
- **`src/app/layout.tsx`**  
  Injects Inter/Poppins fonts, sets comprehensive SEO metadata (Open Graph, Twitter, robots), renders the sticky `Navigation`, and offsets page content.

- **`src/components/Navigation.tsx`**  
  Client component that reacts to scroll, toggles a mobile drawer, and exposes quick “Get Started” CTA.

- **Home (`src/app/page.tsx`)**  
  Orchestrates the marquee sections: `Hero`, `Highlights`, `EventsGallery`, `Testimonials`, `Partners`, `Newsletter`, `Footer`. Animated gradient layers are shared here.

- **Events page**  
  Reuses `EventsGallery` (Appwrite fetch), `PastEvents` (static showcase), and `SignupForm` so visitors can register for curated experiences.

- **Services page**  
  Highlights service categories, production workflow, and reuses testimonials/partners to reinforce credibility.

- **About page**  
  Introduces the team via `Team` component (ready for Appwrite avatars), restates values, and loops in shared testimonials/partners/newsletter.

- **Contact page**  
  Anchored by `ContactForm`, which posts to `submitInquiry` and provides success/error messaging. Additional cards expose direct contact details, office information, and FAQ items.

- **`src/lib/appwrite.ts`**  
  Centralized Appwrite client with helpers for signups, events, testimonials, newsletter subscriptions, inquiries, and storage URL building. Typed payloads keep data flows predictable and surface environment misconfiguration early.

---

## 🎨 Design & UX Notes
- Tailwind utility-first styling ensures consistency; `globals.css` houses gradient helpers, focus rings, and default typography.
- Animated gradients (`animate-pulse`) and Framer Motion transitions set the tone without sacrificing performance.
- Components include accessible keyboard/focus handling and descriptive messaging for validation states.
- Loading skeletons ship with data-driven sections (events/testimonials) to reduce layout shift.

---

## 🧭 Roadmap Ideas
- Surface Appwrite-stored content on the Services/About pages (team bios, partner logos) once assets are uploaded.
- Add admin tooling or protected routes to manage events and inquiries.
- Integrate analytics + conversion tracking.
- Introduce automated test coverage (Jest/RTL for logic, Playwright for flows).
- Build a design system folder for shared UI primitives (buttons, cards, badges) as the component catalog grows.

---

## 🤝 Contributing
- Read `agents.md` for contributor workflow expectations (env hygiene, schema sync, testing, documentation).
- Run `npm run lint` before committing; optionally `npx prettier --write .`.
- Open issues/PRs describing schema changes so Appwrite configuration stays aligned.

---

## 📄 License
MIT (see `LICENSE`)

---

Bring your experiences to life—if you have questions or ideas, open an issue or reach out. Let’s build unforgettable events together. 🎉
