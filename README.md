<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Claude_3.5-AI-8B5CF6?style=for-the-badge&logo=anthropic" alt="Claude" />
  <img src="https://img.shields.io/badge/DeepSeek-AI-00A67E?style=for-the-badge" alt="DeepSeek" />
</p>

<h1 align="center">🇨🇳 HSK AI Coach</h1>

<p align="center">
  <strong>Enterprise-Grade Chinese Language Intelligence Platform</strong><br/>
  AI-Powered HSK 4–6 Exam Preparation for Thai Learners
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-ai-architecture">AI Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-team">Team</a>
</p>

---

## 🎯 Problem Statement

Thai learners preparing for HSK exams (Hanyu Shuiping Kaoshi — 汉语水平考试) face unique challenges: direct translation patterns, tonal confusion, and a lack of AI tools that understand **Thai-specific error patterns**. Existing tools provide generic feedback that fails to address the root causes of mistakes made by Thai speakers.

## 💡 Solution

**HSK AI Coach** is an intelligent, full-stack platform that leverages a **Dual-Model AI Pipeline** (Claude 3.5 Sonnet + DeepSeek) to deliver personalized, pedagogical feedback specifically tailored for Thai learners. Every analysis understands the common pitfalls Thai speakers encounter when writing and reading Chinese.

---

## ✨ Features

### 📊 Dashboard — Command Center

| Feature              | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| HSK Readiness Score  | Real-time prediction of exam readiness based on all activity |
| Daily Usage Tracking | Smart quota management (Free: 3/day, Premium: unlimited)     |
| Top Error Detection  | Identifies your weakest area for focused improvement         |
| Activity Timeline    | Track all analyses with scores and timestamps                |

### ✍️ Essay Writing Analyzer

- **4-Dimensional Scoring** — Grammar, Vocabulary, Coherence, Native Naturalness (0–100)
- **Character-Level Error Mapping** — Pinpoints exact errors with severity levels
- **AI Rewrite** — Generates a natural, native-sounding version for learning
- **Hanzi Highlighting** — Visual annotation of problematic characters

### 📖 Reading Intelligence

- **Auto-Summary** — Converts complex Chinese articles into Thai summaries instantly
- **Comprehension Questions** — AI-generated test questions with answer validation
- **Thai Confusion Guard** — Highlights words commonly mistranslated by Thai speakers
- **Smart Vocabulary Extraction** — Key words with pinyin, HSK level, and memory tips

### 🧠 AI Exercise Generator

- **Weakness-Driven** — Generates exercises based on your personal error history
- **Multiple Choice Format** — Instant answer checking with explanations
- **HSK 3–6 Coverage** — Exercises calibrated to each proficiency level

### 📝 Mock Exam Simulator

- **Full HSK 5 Exam** — Complete exam simulation (H51327) with all sections
- **Real-Time Scoring** — Instant feedback as you progress through the exam
- **Listening + Reading + Writing** — Covers all exam components

### 🃏 Flashcard System (SRS)

- **Spaced Repetition** — Scientifically-proven memorization algorithm (ts-fsrs)
- **HSK 3.0 Vocabulary** — Based on the latest 2021/2025 HSK standard
- **Progress Tracking** — Visual mastery indicators for each word

### 📈 Additional Features

- **History** — Complete archive of all past analyses (up to 50 entries)
- **Profile & Subscription** — Account management with Premium upgrade path (฿199/mo)
- **Progress Tracking** — Coming soon: multi-dimensional skill tracking with trend charts

---

## 🧬 AI Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Input (Chinese Text)            │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │   Dual-Model Pipeline   │
              └────────────┬────────────┘
                           │
           ┌───────────────┼───────────────┐
           │                               │
  ┌────────▼────────┐           ┌──────────▼──────────┐
  │    DeepSeek      │           │    Claude 3.5       │
  │  Linguistic      │           │    Pedagogical      │
  │  Layer           │           │    Layer             │
  ├──────────────────┤           ├─────────────────────┤
  │ • Grammar Parse  │──────────▶│ • Thai Explanation  │
  │ • Word Choice    │           │ • 4D Scoring        │
  │ • Error Detection│           │ • AI Rewrite        │
  │ • Structure      │           │ • Fix Priorities    │
  └──────────────────┘           └──────────┬──────────┘
                                            │
                              ┌─────────────▼──────────┐
                              │  Structured JSON Output │
                              │  + Error Log (Prisma)   │
                              └────────────────────────┘
```

**Why Dual-Model?**

- **DeepSeek** excels at deep linguistic parsing (grammar rules, word usage patterns)
- **Claude 3.5** excels at pedagogical explanation in Thai with cultural context

---

## 🛠️ Tech Stack

| Layer                | Technology               | Purpose                                     |
| -------------------- | ------------------------ | ------------------------------------------- |
| **Framework**        | Next.js 14 (App Router)  | Server Components + Server Actions          |
| **Language**         | TypeScript (Strict)      | Full type safety across the stack           |
| **Styling**          | Tailwind CSS + shadcn/ui | Responsive, accessible UI components        |
| **Authentication**   | NextAuth.js v5           | Google OAuth + Credentials (Email/Password) |
| **Database**         | Supabase (PostgreSQL)    | Managed database with connection pooling    |
| **ORM**              | Prisma 5                 | Type-safe database queries + migrations     |
| **AI — Linguistic**  | DeepSeek API             | Grammar parsing & error detection           |
| **AI — Pedagogical** | Claude 3.5 Sonnet        | Thai explanations & scoring                 |
| **Vocabulary**       | HSK 3.0 (2021/2025)      | 11,092 words across 7-9 levels              |
| **SRS Engine**       | ts-fsrs                  | Spaced repetition algorithm                 |
| **Deployment**       | Vercel                   | Edge-optimized hosting                      |

---

## 📥 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **PostgreSQL** database (or [Supabase](https://supabase.com) free tier)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/psu6810110498/Hackathon-Vercel.git
cd Hackathon-Vercel

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in: DATABASE_URL, AUTH_SECRET, ANTHROPIC_API_KEY, DEEPSEEK_API_KEY

# 4. Generate Prisma client & push schema
npx prisma generate
npm run db:push

# 5. Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Environment Variables

| Variable             | Description                        | Required |
| -------------------- | ---------------------------------- | -------- |
| `DATABASE_URL`       | PostgreSQL connection string       | ✅       |
| `DIRECT_URL`         | Direct database URL (Supabase)     | ✅       |
| `AUTH_SECRET`        | NextAuth.js session encryption key | ✅       |
| `AUTH_GOOGLE_ID`     | Google OAuth Client ID             | Optional |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret         | Optional |
| `ANTHROPIC_API_KEY`  | Claude 3.5 Sonnet API key          | ✅       |
| `DEEPSEEK_API_KEY`   | DeepSeek API key                   | ✅       |
| `DEMO_MODE`          | Set to `true` for mock AI data     | Optional |

---

## 📁 Project Structure

```
Hackathon-Vercel/
├── app/
│   ├── (auth)/              # Login & Registration pages
│   ├── (marketing)/         # Landing page
│   ├── api/                 # API routes (essay, reading, exercise, auth)
│   └── dashboard/           # All dashboard pages
│       ├── page.tsx          #   ├── Overview (Command Center)
│       ├── essay/            #   ├── Essay Writing Analyzer
│       ├── reading/          #   ├── Reading Intelligence
│       ├── exercise/         #   ├── AI Exercise Generator
│       ├── mock-exam/        #   ├── Mock Exam Simulator
│       ├── flashcards/       #   ├── Flashcard SRS System
│       ├── history/          #   ├── Analysis History
│       ├── profile/          #   ├── User Profile & Subscription
│       └── progress/         #   └── Progress Tracking (Coming Soon)
├── components/
│   ├── features/            # Feature-specific components
│   ├── layout/              # Sidebar, MobileNav, TopBar
│   ├── providers/           # Session & Theme providers
│   └── ui/                  # Reusable UI primitives (shadcn)
├── lib/
│   ├── ai/                  # AI pipeline (Claude + DeepSeek)
│   ├── auth/                # NextAuth configuration
│   ├── db/                  # Prisma client & queries
│   ├── hsk/                 # HSK 3.0 vocabulary & exam data
│   └── utils/               # Utility functions (cn, format, etc.)
├── prisma/
│   └── schema.prisma        # Database schema
├── types/                   # TypeScript type definitions
├── vercel.json              # Vercel deployment configuration
└── package.json
```

---

## 🧪 Available Scripts

| Script      | Command               | Description               |
| ----------- | --------------------- | ------------------------- |
| Dev Server  | `npm run dev`         | Start Next.js dev server  |
| Build       | `npm run build`       | Production build          |
| Lint        | `npm run lint`        | ESLint code quality check |
| DB Generate | `npm run db:generate` | Generate Prisma client    |
| DB Push     | `npm run db:push`     | Push schema to database   |
| DB Migrate  | `npm run db:migrate`  | Run database migrations   |
| DB Studio   | `npm run db:studio`   | Open Prisma Studio GUI    |

---

## 🔐 Authentication

HSK AI Coach supports two authentication methods:

1. **Google OAuth** — One-click sign in with Google account
2. **Email/Password** — Traditional registration with bcrypt hashing

Session management is handled by **NextAuth.js v5** with JWT strategy and Prisma adapter.

---

## 🏗️ Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add all environment variables
4. Deploy — Vercel auto-detects Next.js

### Cloudflare Quick Tunnel (Demo)

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared
cloudflared tunnel --url http://localhost:3000
```

---

## 👥 Team

**PSU Hackathon 2026** — Prince of Songkla University

---

<p align="center">
  <strong>Built with ❤️ for Thai learners of Chinese</strong><br/>
  <sub>Hackathon Submission — February 2026</sub>
</p>

<p align="center">
  <strong>License</strong>: Private / Hackathon Use<br/>
  Copyright © 2026 HSK AI Coach. All rights reserved.
</p>
