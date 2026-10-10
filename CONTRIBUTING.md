# Contributing to Lazee.dev

Thank you for your interest in contributing to **Lazee.dev**! 🎉

Lazee.dev is an open-source, AI-powered browser automation and developer platform designed to eliminate repetitive application friction and help developers apply 100x faster. We welcome contributions of all types — from bug fixes and documentation to new features and browser extension enhancements.

This guide provides everything you need to know to get your local environment running quickly, smoothly, and without external API dependencies.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start for Local Development](#quick-start-for-local-development)
  - [Option A: Automated One-Command Setup (Recommended)](#option-a-automated-one-command-setup-recommended)
  - [Option B: Manual Step-by-Step Setup](#option-b-manual-step-by-step-setup)
- [Local Developer Authentication (Zero-Config Dev Mode)](#local-developer-authentication-zero-config-dev-mode)
- [Database Management](#database-management)
- [Project Directory Structure](#project-directory-structure)
- [Contribution Workflow](#contribution-workflow)
  - [1. Branch Naming](#1-branch-naming)
  - [2. Commit Messages (Conventional Commits)](#2-commit-messages-conventional-commits)
  - [3. Code Style & Linting](#3-code-style--linting)
  - [4. Submitting a Pull Request](#4-submitting-a-pull-request)
- [Getting Help](#getting-help)

---

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Node.js**: `v20.x` or higher (Node `v22` / `v24` supported)
- **npm**: `v10.x` or higher
- **Docker & Docker Compose**: v2.20.0 or later (Docker Desktop on Windows/macOS or Docker Engine on Linux)
- **Git**

---

## Quick Start for Local Development

### Option A: Automated One-Command Setup (Recommended)

We provide a unified local setup runner that handles environment file initialization, database container orchestration, schema synchronization, and mock data seeding automatically:

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/lazee.dev.next.git
cd lazee.dev.next

# 2. Install dependencies
npm install

# 3. Run the automated contributor setup
npm run setup

# 4. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Manual Step-by-Step Setup

If you prefer running each step manually:

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/<your-username>/lazee.dev.next.git
   cd lazee.dev.next
   npm install
   ```

2. **Copy the environment configuration:**
   ```bash
   cp .env.example .env.local
   ```
   > The default `.env.example` comes pre-configured with local credentials that work out-of-the-box with Docker Compose.

3. **Start the PostgreSQL database:**
   ```bash
   npm run db:up
   ```
   *(runs `docker compose up -d`)*

4. **Synchronize the Prisma schema:**
   ```bash
   npm run db:push
   ```

5. **Seed local test data (mock developer profile, jobs, and settings):**
   ```bash
   npm run db:seed
   ```

6. **Start the Next.js development server:**
   ```bash
   npm run dev
   ```

---

## Local Developer Authentication (Zero-Config Dev Mode)

To allow contributors to work on the UI, forms, and workflows without requiring personal Google Cloud OAuth credentials or SMTP email servers, Lazee includes a built-in **Local Dev Login**:

1. Navigate to the login page at [http://localhost:3000/login](http://localhost:3000/login).
2. You will see a dedicated **Local Dev Mode** banner.
3. Click **⚡ 1-Click Dev Sign In**.
4. You will instantly be logged in as `dev@lazee.dev` with:
   - Pre-seeded developer profile with skills, experience, projects, and education
   - Pro membership with 500 test credits
   - Admin privileges (allowing testing of the `/careers` admin job posting dashboard)

### Optional External Services

For 95% of contributions, dummy environment values are sufficient. However, if you are explicitly testing specific integrations:

| Service | Environment Variables | Notes |
|---------|-----------------------|-------|
| **AI Generation** | `OPENROUTER_API_KEY` | Set a valid [OpenRouter](https://openrouter.ai/) key to test live AI suggestions |
| **Resume Storage** | `CLOUDFLARE_S3_BUCKET`, `S3_*` | Set Cloudflare R2 / S3 credentials to test file upload pipelines |
| **Payments** | `DODO_PAYMENTS_API_KEY`, `NEXT_PUBLIC_DODO_PAYMENTS_PRODUCT_ID` | Use [Dodo Payments Test Mode](https://dodopayments.com/) keys |
| **Notion** | `NOTION_API_KEY`, `NOTION_FEEDBACK_DATABASE_ID` | For feedback form database sync |

---

## Database Management

The following scripts are available in [package.json](file:///c:/open-source/lazee.dev.next/package.json) to manage your local PostgreSQL instance:

| Command | Description |
|---------|-------------|
| `npm run db:up` | Starts the PostgreSQL container via Docker Compose in the background |
| `npm run db:down` | Stops the PostgreSQL container |
| `npm run db:push` | Pushes changes in `prisma/schema.prisma` directly to your local database |
| `npm run db:seed` | Seeds mock developer data and sample career postings |
| `npm run db:studio` | Launches Prisma Studio GUI at `http://localhost:5555` to view/edit database records |
| `npm run db:reset` | Resets the local database schema and re-seeds initial data |

---

## Project Directory Structure

```text
lazee.dev.next/
├── app/                  # Next.js App Router pages and API routes
│   ├── (auth)/          # Authentication pages (login, sign-in)
│   ├── api/             # Backend REST API routes
│   ├── careers/         # Job listings and admin posting panel
│   ├── profile/         # User profile management and resume view
│   ├── u/[username]/    # Public developer portfolio page
│   └── layout.tsx       # Root layout and theme providers
├── components/          # Reusable UI components & Radix primitives
│   ├── ui/              # Buttons, modals, cards, badges
│   └── ...              # Domain-specific components
├── lib/                 # Core utilities, Auth.js config, Prisma client
│   ├── auth.ts          # NextAuth v5 configuration & Dev Login provider
│   ├── prisma.ts        # Prisma client with connection pooling
│   └── credits.ts       # Credit replenishment & tracking
├── prisma/              # Prisma ORM schema and seed scripts
│   ├── schema.prisma    # Database models and relations
│   └── seed.mjs         # Mock data seeder
├── public/              # Static assets, icons, logos
├── scripts/             # Developer automation scripts (setup.mjs)
├── docker-compose.yml   # Local PostgreSQL service definition
├── .env.example         # Template for environment configuration
└── package.json         # Scripts and project dependencies
```

---

## Contribution Workflow

### 1. Branch Naming

Create a feature branch from the `main` branch using a clear prefix:

- `feat/feature-name` — for new features
- `fix/bug-description` — for bug fixes
- `docs/topic` — for documentation updates
- `refactor/scope` — for code restructuring without feature changes
- `chore/task` — for dependency upgrades or tooling updates

```bash
git checkout -b feat/enhance-resume-preview
```

### 2. Commit Messages (Conventional Commits)

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add export to PDF option on profile page`
- `fix: resolve ECONNREFUSED retry handling in prisma client`
- `docs: update quick start instructions in README`
- `chore: update tailwindcss dependencies`

### 3. Code Style & Linting

Before creating a commit or pull request, verify that your code adheres to ESLint rules and TypeScript types:

```bash
# Run ESLint checks
npm run lint

# Verify production build and TypeScript compilation
npm run build
```

### 4. Submitting a Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of `Sahill357/lazee.dev.next`.
3. Provide a clear description of the problem solved, changes made, and steps to test.
4. Link any related issues (e.g. `Closes #42`).

---

## Getting Help

If you run into issues or have questions:
- Open an issue on GitHub
- Check existing issues and pull requests
- Reach out to the maintainers

Happy coding! 🚀
