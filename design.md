# Lazee.dev — Design Document

> **"Stop Typing. Start Applying."**
> AI-powered browser extension that auto-fills job applications 100x faster.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Design System](#4-design-system)
5. [Page Architecture](#5-page-architecture)
6. [Component Library](#6-component-library)
7. [Landing Page Sections](#7-landing-page-sections)
8. [Database Schema](#8-database-schema)
9. [API Routes](#9-api-routes)
10. [Authentication System](#10-authentication-system)
11. [AI System](#11-ai-system)
12. [Credits & Membership System](#12-credits--membership-system)
13. [File Storage (Cloudflare R2)](#13-file-storage-cloudflare-r2)
14. [Payments (Dodo Payments)](#14-payments-dodo-payments)
15. [Profile & Dashboard](#15-profile--dashboard)
16. [SEO & Metadata](#16-seo--metadata)
17. [Extension Integration](#17-extension-integration)

---

## 1. Product Overview

**Lazee.dev** is a SaaS + browser extension combo aimed at developers and job seekers. It dramatically reduces the time spent applying for jobs by:

- **Auto-filling** repetitive form fields with saved profile data
- **Generating AI answers** to open-ended application questions
- **Managing resumes** with multi-version switching from the extension popup
- **Drafting cold DMs** directly inside Gmail compose
- **Providing a public developer profile** at `lazee.dev/u/{username}`

### Key Metrics

| Stat | Value |
|------|-------|
| Active Developers | 2,000+ |
| Fields Autofilled | 500K+ |
| Applications Submitted | 10K+ |
| Time Saved | 97% |
| Without Lazee (10 apps) | ~40 minutes |
| With Lazee (10 apps) | ~4 minutes |

### Platforms Supported

Greenhouse, Lever, SmartRecruiters, Y Combinator, Wellfound, Glassdoor, Google Forms, Notion, Airtable, Tally, Gmail, ClanX, Superteam, and 100+ more.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.9 |
| Language | TypeScript | ^5 |
| UI Library | React | 19.2.7 |
| Styling | TailwindCSS | ^4 |
| Animations | Motion (Framer Motion) | ^12.26.2 |
| Auth | NextAuth.js | v5 (beta.30) |
| Database ORM | Prisma | ^7.4.0 |
| Database | PostgreSQL | — |
| DB Adapter | `@prisma/adapter-pg` | ^7.4.0 |
| File Storage | Cloudflare R2 (S3-compatible) | — |
| Payments | Dodo Payments | ^0.3.4 |
| Forms | react-hook-form + zod | ^7 + ^4 |
| Data Fetching | TanStack React Query | ^5.90.21 |
| State Toast | Sonner | ^2.0.7 |
| Icons | lucide-react + react-icons | ^0.562 + ^5.6 |
| UI Components | Radix UI (via shadcn/ui pattern) | ^1 |
| Date Utilities | date-fns | ^4.1.0 |
| Email | Nodemailer | ^8.0.1 |
| Rate Limiting | Custom (in-memory) | — |
| Hosting | Vercel | — |
| Fonts | Inter + Outfit (Google Fonts) | — |

---

## 3. Project Structure

```
lazee.dev-nextjs/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth route group
│   │   └── login/            # Login page
│   ├── api/                  # API endpoints
│   │   ├── auth/             # NextAuth handlers
│   │   ├── chat/             # AI chat (autofill answers)
│   │   ├── checkout/         # Dodo Payments checkout
│   │   ├── customer-portal/  # Subscription management
│   │   ├── feedback/         # Feedback submissions
│   │   ├── profile/          # Profile CRUD
│   │   └── webhook/          # Dodo Payments webhook
│   ├── careers/              # Careers page
│   ├── feedback/             # Feedback page
│   ├── privacy/              # Privacy Policy
│   ├── profile/              # User Dashboard
│   │   ├── page.tsx          # Dashboard entry
│   │   ├── profile-form.tsx  # Main profile editor
│   │   ├── project-section.tsx  # Projects management
│   │   ├── resume-manager.tsx   # Resume upload/switch
│   │   └── username-manager.tsx # Custom URL setting
│   ├── terms/                # Terms of Service
│   ├── u/                    # Public profiles
│   │   └── [username]/       # Dynamic public profile page
│   ├── globals.css           # Global styles + CSS variables
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   ├── robots.ts             # SEO robots
│   └── sitemap.ts            # Dynamic sitemap
│
├── components/               # Shared UI components
│   ├── ui/                   # Primitive components (shadcn-style)
│   ├── providers/            # Context providers
│   ├── SiteHeader.tsx        # Global navigation bar
│   ├── footer.tsx            # Global footer
│   ├── AuthButton.tsx        # Login/profile CTA button
│   ├── AuthForm.tsx          # Login form (email + Google)
│   ├── ExtensionAuthSync.tsx # Syncs session to extension
│   ├── LoginSuccessModal.tsx # Post-login welcome modal
│   └── [section].tsx         # Landing page sections
│
├── hooks/                    # Custom React hooks
│   ├── use-browser.ts        # Detect Chrome vs Firefox
│   ├── useDebounce.ts        # Debounce hook
│   ├── useProfile.ts         # Profile data fetching hook
│   └── useWindowWidth.ts     # Responsive width hook
│
├── lib/                      # Core server utilities
│   ├── auth.ts               # NextAuth configuration
│   ├── constants.ts          # Extension store URLs
│   ├── cors.ts               # CORS headers helper
│   ├── credits.ts            # Credits deduction logic
│   ├── prisma.ts             # Prisma client singleton
│   ├── prompt.ts             # AI prompt builders
│   ├── rate-limit.ts         # Rate limiter middleware
│   ├── s3.ts                 # Cloudflare R2 helpers
│   └── utils.ts              # Utility functions (cn, etc.)
│
├── prisma/
│   └── schema.prisma         # Database schema
│
├── public/
│   └── llms.txt              # LLM-readable product context
│
├── generated/                # Prisma generated client
├── scripts/                  # Build/utility scripts
└── src/                      # Additional source files
```

---

## 4. Design System

### 4.1 Visual Identity

The design language of Lazee.dev follows a **neo-brutalist** aesthetic with a warm, developer-centric personality:

- **Hard borders**: `border-[3px] border-black` with no border-radius (`rounded-none`)
- **Offset shadows**: Thick drop shadows offset `4px 4px` or `6px 6px` using `rgba(0,0,0,1)` for maximum contrast
- **Hover micro-interactions**: Cards shift `-0.5px` on X/Y and shadow depth increases on hover
- **Motion**: Elements use `motion/react` for staggered entrances, typewriter effects, and pulsing animations

### 4.2 Color Palette

#### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `orange-500` | `#f97316` | Primary accent, CTAs, highlights |
| `orange-100` | `#ffedd5` | Badge backgrounds |
| `orange-50` | `#fff7ed` | Light accent fills |
| `#fefaf6` | Warm off-white | Page/main background |
| `#0d0d12` | Near-black | Dark section backgrounds (Stats, Comparison) |
| `zinc-950` | `#09090b` | Primary text |
| `zinc-700` | `#3f3f46` | Secondary text |
| `zinc-400-500` | — | Muted / captions |

#### Semantic Accent Colors (Feature Cards)

| Feature | Badge Color | Icon Color |
|---------|-------------|------------|
| AI Autofill | Orange | `text-orange-500` |
| Developer Profile | Rose | `text-rose-500` |
| Resumes | Emerald | `text-emerald-500` |
| Compatibility | Amber | `text-amber-500` |
| Cold DM | Blue | `text-blue-500` |
| Express AI Fill (Pro) | Purple | `text-purple-500` |

#### CSS Variables (OKLCH Color Space)

```css
/* Light Mode */
--background: oklch(1 0 0);               /* Pure white */
--foreground: oklch(0.13 0.028 261.692);  /* Near-black */
--primary: oklch(0.21 0.034 264.665);     /* Deep blue-gray */
--ring: oklch(0.707 0.022 261.325);

/* Dark Mode */
--background: oklch(0.13 0.028 261.692);
--primary: oklch(0.928 0.006 264.531);
```

### 4.3 Typography

| Role | Font | Class |
|------|------|-------|
| Body / UI | **Inter** | `font-sans` → `var(--font-inter)` |
| Headings | **Outfit** | `font-heading` → `var(--font-outfit)` |

Headings are typically `font-black uppercase tracking-tight`. The design uses `text-4xl` to `text-6xl` for section headers with the `font-heading` class.

### 4.4 Animations

| Name | Keyframe | Usage |
|------|----------|-------|
| `blob` | Organic translate + scale loop | Background decorative shapes |
| `fadeInDown` | Opacity + translateY from -20px | Header entry animations |
| `fadeInUp` | Opacity + translateY from +20px | Content reveal on scroll |
| `shimmer` | Background-position slide | Loading skeleton states |
| Motion stagger | `containerVariants` + `cardVariants` | Feature card grid entrances |
| Typewriter | `useState` + character loop | AI suggestion demo in card |

All scroll-triggered animations use `whileInView` with `viewport={{ once: true }}` to prevent re-triggering.

### 4.5 Button Styles

**Primary CTA (Black)**

```
h-14 border-2 border-black bg-black text-white
shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]
hover:shadow-[5px_5px_0px_0px_rgba(249,115,22,1)]
hover:-translate-y-0.5
```

**Pro/Orange CTA**

```
border-2 border-black bg-orange-500 text-white
shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
hover:-translate-y-0.5
```

**Ghost/Outline**

```
border-2 border-black bg-white hover:bg-zinc-50
shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
```

### 4.6 Card Pattern

All feature/info cards follow this neo-brutalist card style:

```
bg-white border-2 border-black rounded-none
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
hover:-translate-x-0.5 hover:-translate-y-0.5
hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
transition-[transform,box-shadow] duration-200
```

### 4.7 Grid & Layout

- **Max content width**: `max-w-6xl` (landing page main content)
- **Global max-width**: `max-w-7xl` (header, footer)
- **Grid layout**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for feature grids
- **Spacing rhythm**: Sections spaced with `mb-24` (6rem)
- **Horizontal padding**: `px-4 sm:px-8` responsive scale

### 4.8 Selection Color

```css
selection:bg-orange-500 selection:text-white
```

Text selection is styled to match the brand orange.

---

## 5. Page Architecture

### 5.1 Route Map

| Route | File | Type | Auth |
|-------|------|------|------|
| `/` | `app/page.tsx` | Landing page | Public |
| `/login` | `app/(auth)/login/` | Authentication | Public |
| `/profile` | `app/profile/page.tsx` | Dashboard | **Required** |
| `/u/[username]` | `app/u/[username]/` | Public developer profile | Public |
| `/feedback` | `app/feedback/` | Feedback form | Public |
| `/careers` | `app/careers/` | Careers page | Public |
| `/privacy` | `app/privacy/` | Privacy Policy | Public |
| `/terms` | `app/terms/` | Terms of Service | Public |
| `/api/auth/[...nextauth]` | — | Auth API | System |
| `/api/chat` | — | AI answer generation | Required |
| `/api/checkout` | — | Dodo Payment init | Required |
| `/api/customer-portal` | — | Subscription portal | Required |
| `/api/feedback` | — | Feedback submission | Public |
| `/api/profile` | — | Profile CRUD | Required |
| `/api/webhook` | — | Payment webhook | System |

### 5.2 Root Layout (`app/layout.tsx`)

The root layout wraps the entire app in these providers (inner to outer):

1. `ThemeProvider` (next-themes, defaultTheme: `"light"`)
2. `SessionProvider` (NextAuth session context)
3. `QueryProvider` (TanStack React Query)
4. `SiteHeader` (fixed top nav)
5. `<main>` (content, `pt-16` to offset fixed header, `bg-[#fefaf6]`)
6. `Footer`
7. `ExtensionAuthSync` (posts session token to extension)
8. `LoginSuccessModal` (welcome modal after first login)
9. `Toaster` (Sonner toast notifications)

---

## 6. Component Library

### 6.1 Primitive UI Components (`components/ui/`)

| Component | Description |
|-----------|-------------|
| `button.tsx` | CVA-powered button with `default`, `outline`, `ghost`, `destructive` variants |
| `input.tsx` | Styled text input |
| `textarea.tsx` | Styled textarea |
| `label.tsx` | Form label |
| `form.tsx` | react-hook-form integration with field/error wrappers |
| `select.tsx` | Radix Select with custom styling |
| `checkbox.tsx` | Radix Checkbox |
| `calendar.tsx` | React Day Picker calendar |
| `month-year-picker.tsx` | Custom month/year selector (for experience dates) |
| `combobox.tsx` | Searchable dropdown |
| `dialog.tsx` | Radix Dialog (modal) |
| `sheet.tsx` | Radix Sheet (slide-over panel) |
| `popover.tsx` | Radix Popover |
| `card.tsx` | Card container with header/content/footer |
| `toast.tsx` | Toast notification system |
| `sonner.tsx` | Sonner toast wrapper |

### 6.2 Layout Components

| Component | Description |
|-----------|-------------|
| `SiteHeader.tsx` | Fixed navigation bar with logo, nav links (Features / Pricing / FAQ), and `AuthButton` |
| `footer.tsx` | 4-column footer (Brand, Product, Support, Connect) with social links |
| `theme-provider.tsx` | Thin wrapper around `next-themes` |
| `loading.tsx` | Full-page loading spinner |

### 6.3 Auth Components

| Component | Description |
|-----------|-------------|
| `AuthButton.tsx` | Shows "Login" or user avatar/profile button based on session state |
| `AuthForm.tsx` | Login page form with Google OAuth and magic link email options |
| `SignOutButton.tsx` | Triggers NextAuth signOut |
| `LoginSuccessModal.tsx` | Welcome modal shown once after first login (detects `?login=success` param) |
| `ExtensionAuthSync.tsx` | Silently posts the auth token to the browser extension via `postMessage` |

### 6.4 Feature Components

| Component | Description |
|-----------|-------------|
| `ProjectCarousel.tsx` | Swipeable carousel for project showcase on public profiles |
| `InstallModal.tsx` | Modal that shows Chrome/Firefox store links when clicking install CTA |

---

## 7. Landing Page Sections

The landing page (`/`) renders the following sections in order:

### 7.1 Hero Section

**File**: `components/hero-section.tsx`

- Left column: badge, H1 heading ("Apply to jobs **100x faster** with AI"), paragraph, CTA button (Install Extension), "It's free" pointer, feature checklist, avatar stack with 5-star rating
- Right column: `HeroDemo` component (interactive extension popup mockup)
- Browser detection via `useBrowser` hook — shows Chrome or Firefox icon/label dynamically
- Entry animation: `motion` fade-in-up from `y: 20`

### 7.2 Logo Carousel

**File**: `components/logo-carousel.tsx`

- Infinite horizontal scroll of supported job board logos (Airtable, Glassdoor, Lever, etc.)
- Logos served from Cloudflare R2 (`pub-*.r2.dev/assets/`)
- Grayscale by default, full color on hover
- Implemented with `motion` `x: ["0%", "-50%"]` infinite loop at 25s duration

### 7.3 Comparison Section

**File**: `components/comparison-section.tsx`

- Dark background (`#0d0d12`) card with orange glow accents
- Side-by-side: "Without Lazee" (40 min) vs "With Lazee" (4 min) cards
- Animated list items that fade in sequentially using `Infinity` motion keyframes
- Illustrations: `sad-dev.png` and `happy-dev.png` from `/public`

### 7.4 How It Works Section

**File**: `components/how-it-works-section.tsx`

- 3-step horizontal grid: **Create Profile → Install Extension → Apply Anywhere**
- Dashed orange connector lines between steps (desktop only)
- Each card has an animated mini-demo graphic showing the action
- Step 3 includes an animated mock cursor clicking the "Auto Fill with Lazee" button

### 7.5 Dashboard Preview Section

**File**: `components/dashboard-preview-section.tsx`

- Visual showcase of the profile/dashboard UI
- Large component showing the product UI in context

### 7.6 Grid Features Section

**File**: `components/grid-features-section.tsx`

- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` layout with 6 cards
- Stagger entrance animation via `containerVariants` + `cardVariants`
- Each card has a color-coded badge, icon, title, description, and interactive micro-demo

| Card | Feature | Demo |
|------|---------|------|
| 1 | AI Autofill | Looping typewriter animation of an AI answer |
| 2 | Developer Profile | Profile card preview |
| 3 | Multiple Resumes | Animated resume switcher toggling "Active/Inactive" |
| 4 | 100+ Job Boards | Floating, animated ATS name badges |
| 5 | Cold DM Generator | Gmail compose mockup |
| 6 | Express AI Fill (Pro) | Checkbox animation simulating form fill |

### 7.7 Stats Section

**File**: `components/stats-section.tsx`

- Dark `#0d0d12` band with centered orange glow
- 4 stats in a responsive 2→4 column grid:
  - 2,000+ Developers | 500K+ Fields Autofilled | 10K+ Applications | 97% Time Saved

### 7.8 Pricing Section

**File**: `components/pricing-section.tsx`

- 2-column grid: **Free ($0/mo)** and **Pro ($9/mo)**
- Pro card: `border-orange-500`, orange drop-shadow, "Most Popular" rotated badge
- Free tier features: unlimited autofill, 100+ job boards, Cold DM, 200 credits/mo
- Pro tier adds: 10,000 credits, Express AI Fill, advanced reasoning, priority support
- Handles session state: logged-out → redirects to `/login`; already Pro → "Manage Subscription" → Dodo customer portal
- Checkout via `POST /api/checkout` → Dodo Payments hosted checkout URL

### 7.9 FAQ Section

**File**: `components/faq-section.tsx`

- Accordion with 8 Q&As
- Expand/collapse with `max-h` CSS transition
- Active item gets orange toggle button + lift shadow
- Topics: autofill mechanics, ATS support, credits, pricing, data stored, resumes, install, public profile

### 7.10 Footer CTA Section

**File**: `components/footer-cta-section.tsx`

- Final call-to-action section above footer

---

## 8. Database Schema

**Database**: PostgreSQL via Prisma ORM

### 8.1 Models

#### `User`

Core user record extended far beyond NextAuth defaults:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `username` | String? (unique) | Custom public profile URL slug |
| `name`, `email`, `image` | String? | Auth defaults |
| `firstName`, `middleName`, `lastName` | String? | Full name parts |
| `gender`, `veteranStatus`, `disabilityStatus` | String? | EEO fields for forms |
| `membership` | Enum (`FREE`/`PRO`) | Subscription tier |
| `credits` | Int (default 200) | AI credits balance |
| `lastCreditReset` | DateTime | Monthly reset tracking |
| `dodoCustomerId` | String? | Dodo Payments customer reference |
| `resumeUrl` | String? | Legacy/primary resume URL |
| `countryCode`, `phoneNumber`, `country`, `city` | String? | Contact info |
| `collegeName`, `introVideo` | String? | Profile extras |
| `noticePeriod` | Int? | In days |
| `jobType` | String? | Desired role type |
| `linkedin`, `twitter`, `github`, `portfolio`, `telegram`, `other`, `contactEmail` | String? | Social links |
| `specificQuestionGuidance` | Text? | Custom AI instructions |
| `coverLetter` | Text? | Default cover letter |
| `skills` | String[] | Array of skill tags |
| `currency`, `currentCtc` | String?/Float? | Compensation info |
| Relations | `resumes[]`, `experiences[]`, `projects[]`, `educations[]` | Related records |

#### `Project`

| Field | Type |
|-------|------|
| `name`, `role`, `duration` | String |
| `contribution`, `description` | Text? |
| `activeLink`, `githubLink`, `logoUrl` | String? |
| `screenshots` | String[] |
| `stacks` | String[] |
| `isTopProject` | Boolean |

#### `Resume`

| Field | Type |
|-------|------|
| `key` | String (S3/R2 key) |
| `url` | String (public URL) |
| `name` | String (original filename) |
| `version` | Int |
| `isPrimary` | Boolean |

#### `Experience`

| Field | Type |
|-------|------|
| `companyName`, `role`, `location` | String |
| `companyWebsite` | String? |
| `startDate`, `endDate` | DateTime? |
| `isCurrent` | Boolean |
| `description` | Text? |

#### `Education`

| Field | Type |
|-------|------|
| `schoolName`, `degree`, `fieldOfStudy` | String |
| `startDate`, `endDate` | DateTime? |
| `isCurrent` | Boolean |
| `description` | Text? |

#### `EarlyAccess`

Simple email waitlist model (`email`, `createdAt`).

#### NextAuth Models

`Account`, `Session`, `VerificationToken` — standard NextAuth v5 Prisma adapter models.

---

## 9. API Routes

All routes live in `app/api/`.

### `POST /api/chat`

AI answer generation for the browser extension.
- **Auth**: Required (extension sends session token)
- **Input**: Question text + user profile context
- **Logic**: Builds system prompt via `buildSystemPrompt()`, calls AI API, deducts 2 credits per call
- **Rate limiting**: `lib/rate-limit.ts`

### `POST /api/checkout`

Creates a Dodo Payments hosted checkout session.
- **Auth**: Required
- **Input**: `{ product_cart, customer }`
- **Returns**: `{ checkout_url }` → redirect to Dodo hosted page

### `GET /api/customer-portal`

Redirects to Dodo Payments subscription management portal.
- **Auth**: Required
- **Query**: `?customer_id=...`

### `POST /api/feedback`

Stores user feedback (via Notion API — `@notionhq/client` dependency).

### `GET /api/profile`

Returns full user profile with related data (experiences, projects, educations, resumes).

### `POST /api/profile`

Updates user profile fields.

### `POST /api/webhook`

Handles Dodo Payments webhooks to update membership status on successful payment.

### `GET|POST /api/auth/[...nextauth]`

NextAuth.js v5 catch-all handler.

---

## 10. Authentication System

**Provider**: NextAuth.js v5 with Prisma adapter

### Auth Methods

1. **Google OAuth** — Social login via Google
2. **Email (Magic Link / Nodemailer)** — Passwordless email login via SMTP

### Session Strategy

`"jwt"` — Session stored in a signed JWT cookie (no database session table lookups on every request).

### Custom Logic

**New user signup (email provider)**:
- Non-Gmail email signups start with `credits: 0` (anti-abuse)
- Gmail addresses get the default 200 credits

**Account linking (Google)**:
- If a user previously signed up via email with 0 credits and links Google, credits are upgraded to 200

### Extension Auth Sync (`ExtensionAuthSync.tsx`)

After login, the web app posts the session token via `postMessage` to the browser extension, enabling the extension to make authenticated API calls.

### Custom Email Template

Auth emails are branded with Lazee's visual identity: orange header (`#f26c0d`), hard black borders, neo-brutalist button style.

---

## 11. AI System

### System Prompt (`lib/prompt.ts`)

The `buildSystemPrompt(user)` function generates a rich system prompt that:

1. Establishes the AI persona as the user (first-person voice)
2. Lists skills, experience history, education, and top projects
3. Provides specific guidance for common questions ("Tell me about yourself", "Where did you find this job?")
4. Injects custom `specificQuestionGuidance` if the user has set it
5. Includes all contact details, social links, CTC, notice period

**Critical rules enforced**:
- Always answer in first person
- Raw values only for contact fields (no "My email is…")
- Never use em dashes
- Never write "NA" if a reasonable answer can be given

### Cold DM Prompt (`buildColdDmPrompt()`)

A separate prompt builder for Gmail cold outreach messages supporting:

**Message Types**: `job-inquiry`, `networking`, `collaboration`, `freelance`, `custom`

**Tones**: `professional`, `casual`, `friendly`, `genz`

The Gen Z tone uses modern slang (`fr fr`, `no cap`, `vibes`, `cooking`) while still making a clear job/opportunity request.

**Rules**: Max 2-3 paragraphs, under 150 words, must include CTA, sign off with real name.

---

## 12. Credits & Membership System

### Tiers

| Feature | Free | Pro ($9/mo) |
|---------|------|-------------|
| Profile autofill | Unlimited | Unlimited |
| Job boards supported | 100+ | 100+ |
| Cold DM Generator | Yes | Yes |
| AI credits / month | 200 | 10,000 |
| Express AI Fill | No | Yes |
| Advanced AI reasoning | No | Yes |
| Priority support | No | Yes |

### Credit Mechanics

- AI fill = **2 credits per field**
- Credits reset monthly (tracked via `lastCreditReset`)
- Balance stored on `User.credits`
- Deduction handled in `lib/credits.ts`

### Membership Enum

```prisma
enum Membership {
  FREE
  PRO
}
```

---

## 13. File Storage (Cloudflare R2)

**Package**: `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`

Cloudflare R2 is used as an S3-compatible object store for:
- **User resumes** (PDF uploads, stored per user with versioning)
- **Profile assets** (logo, site images served via `pub-*.r2.dev`)

Resumes are stored with a key pattern like `resumes/{userId}/{uuid}.pdf` and referenced in the `Resume` model.

The `lib/s3.ts` file contains helpers for:
- Generating presigned upload URLs
- Generating presigned download/public URLs
- Deleting objects

---

## 14. Payments (Dodo Payments)

**Package**: `@dodopayments/nextjs`

### Flow

1. User clicks "Get Pro" on pricing page
2. If not logged in → redirect to `/login`
3. `POST /api/checkout` creates a Dodo checkout session
4. User is redirected to Dodo hosted checkout page
5. On success → redirect to `/profile?payment=success`
6. Dodo webhook (`POST /api/webhook`) fires → updates `User.membership = PRO` and stores `dodoCustomerId`
7. If already Pro → "Manage Subscription" → `GET /api/customer-portal?customer_id=...`

### Product ID

Configured via `NEXT_PUBLIC_DODO_PAYMENTS_PRODUCT_ID` env variable.

---

## 15. Profile & Dashboard

### Profile Form (`app/profile/profile-form.tsx`)

The main profile editor is a comprehensive form covering all user data:

- **Personal Info**: First/middle/last name, gender, EEO fields
- **Contact**: Email, phone (with country code from `phone_list.json`), country, city, postal code
- **Job Preferences**: Job type, notice period, CTC (currency + amount)
- **Social Links**: LinkedIn, GitHub, Twitter, Portfolio, Telegram, other
- **AI Settings**: Custom question guidance, cover letter
- **Skills**: Tag input for skills array
- **Education**: Full CRUD for education history
- **Experience**: Full CRUD for work experience

### Project Section (`app/profile/project-section.tsx`)

Full CRUD for projects with fields: name, role, description, stacks, contribution, duration, activeLink, githubLink, logoUrl, screenshots, `isTopProject` flag.

### Resume Manager (`app/profile/resume-manager.tsx`)

- Multi-resume upload via R2 presigned URLs
- Set active/primary resume
- Rename, delete resumes
- Visually shows all uploaded resumes with version numbers

### Username Manager (`app/profile/username-manager.tsx`)

- Set and update custom username
- Username becomes the public profile URL slug (`lazee.dev/u/{username}`)
- Validation for uniqueness and format

### Public Profile (`app/u/[username]/`)

- SSG-friendly public profile page
- Shows: avatar, name, title, skills, experience, projects (carousel), social links
- Shareable link format: `lazee.dev/u/tusharsoni014`

---

## 16. SEO & Metadata

### Global Metadata (`app/layout.tsx`)

- **Title**: "Lazee.dev — Job Applications, 100x Faster"
- **Title template**: `%s | Lazee.dev`
- **Description**: AI-powered browser extension for job autofill
- **Keywords**: job application autofill, AI job apply, browser extension, etc.
- **Open Graph**: Full OG tags with `og.jpg` (1024x538)
- **Twitter Card**: `summary_large_image` with creator `@tusharsoni014`
- **Robots**: Full index/follow with generous Googlebot crawl settings

### Dynamic Routes

- `app/robots.ts` — Generates `robots.txt`
- `app/sitemap.ts` — Generates dynamic XML sitemap including public profile URLs

### `public/llms.txt`

A structured, LLM-readable product context file at `/llms.txt` that describes the product, features, pricing, tech stack, and pages in plain text — useful for AI crawlers and LLM context ingestion.

---

## 17. Extension Integration

The web app integrates tightly with the browser extension through these mechanisms:

### 1. Auth Token Sync (`ExtensionAuthSync.tsx`)

After a successful login, this client component posts the session token to the extension using `window.postMessage`. The extension listens for this message and stores the token for making API calls.

### 2. Extension Download Links (`lib/constants.ts`)

```ts
CHROME_EXTENSION_URL = "https://chromewebstore.google.com/detail/lazeedev-ai-job-autofill/hkompooiicoamiambpjhbbmimjefgiii"
FIREFOX_EXTENSION_URL = "https://addons.mozilla.org/en-US/firefox/addon/lazeedev/"
```

### 3. Browser Detection (`hooks/use-browser.ts`)

Custom hook to detect Chrome vs Firefox in the browser. Used to:
- Show the correct browser icon (Chrome/Firefox) on the CTA button
- Show "Add to Chrome" vs "Add to Firefox" text
- Show Firefox-specific install steps in the `InstallModal`

### 4. `InstallModal` (`components/install-modal.tsx`)

A dialog wrapper that shows the appropriate extension store link based on the detected browser. Used as a wrapper around CTA buttons throughout the landing page.

---

## Appendix: Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret key |
| `AUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `EMAIL_SERVER_HOST` | SMTP host |
| `EMAIL_SERVER_PORT` | SMTP port |
| `EMAIL_SERVER_USER` | SMTP username |
| `EMAIL_SERVER_PASSWORD` | SMTP password |
| `EMAIL_FROM` | Sender email address |
| `NEXT_PUBLIC_DODO_PAYMENTS_PRODUCT_ID` | Dodo product ID for Pro plan |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Cloudflare R2 public base URL |
| `AWS_ACCESS_KEY_ID` | R2 access key |
| `AWS_SECRET_ACCESS_KEY` | R2 secret key |
| `AWS_REGION` | R2 region |
| `S3_BUCKET_NAME` | R2 bucket name |

---

*Last updated: July 2026 — Lazee.dev v0.1.0*
