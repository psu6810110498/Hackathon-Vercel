<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Turborepo-8A2BE2?style=for-the-badge&logo=turborepo" alt="Turborepo" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Claude_3.5-AI-8B5CF6?style=for-the-badge&logo=anthropic" alt="Claude" />
  <img src="https://img.shields.io/badge/DeepSeek-AI-00A67E?style=for-the-badge" alt="DeepSeek" />
</div>

<h1 align="center">🇨🇳 HSK AI Coach — Enterprise Edition</h1>

<p align="center">
  <strong>Enterprise-Grade Chinese Language Intelligence Platform</strong><br/>
  AI-Powered HSK 4–6 Exam Preparation for Thai Learners
</p>

<p align="center">
  <a href="#-architecture">Architecture</a> •
  <a href="#-features">Features</a> •
  <a href="#-security--compliance">Security</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-development">Development</a>
</p>

---

## 🏗️ Architecture: Enterprise Monorepo

We have migrated to a **Turborepo** monorepo architecture for extreme scalability, strict separation of concerns, and guaranteed type parity between the Frontend and Backend.

```bash
📦 HSK AI Coach Monorepo
 ┣ 📂 apps/
 ┃ ┣ 📂 web/         # 🖥️ Next.js Frontend (App Router, UI, Server Actions)
 ┃ ┗ 📂 api/         # ⚙️ Dedicated Backend API & Microservices (Hono / Prisma)
 ┣ 📂 packages/
 ┃ ┗ 📂 shared/      # 🔗 Single Source of Truth (Zod Schemas, Types, DTOs)
 ┗ 📂 docs/          # 📚 Technical Documentation & Roadmaps
```

**Benefits of this Architecture:**

- **Zero Type Drift:** End-to-end type safety from DB Schema ➡️ API Response ➡️ Frontend UI via `packages/shared`.
- **Independent Scaling:** The AI processing backend (`apps/api`) can scale independently of the frontend web application (`apps/web`).
- **Code Portability:** Shared validations and UI logic can easily be reused if a Mobile App (React Native) is developed in the future.

---

## ✨ Enterprise Features Breakdown

### ✍️ AI Writing Analysis (4-Dimension Scoring)

- **Deep Linguistic Parse:** Evaluates Grammar, Vocabulary, Coherence, and Native Naturalness on a strict 0-100 scale.
- **Hanzi Highlighting:** Pinpoints the exact problematic Chinese character and severity level.
- **Thai-Context Explanations:** Claude 3.5 provides native Thai explanations of _why_ the grammar is wrong (addressing direct-translation habits).

### 📝 Mock Exam Simulator & Flashcard System

- **Real HSK 5 Simulation:** Full test coverage (H51327) encompassing Listening, Reading, and Writing.
- **Spaced Repetition System (SRS):** Powered by the `ts-fsrs` algorithm to ensure long-term retention of HSK 3.0 vocabulary.

### 📊 Comprehensive Audit & Tracking

- **History Tracking:** Archives all past AI analyses, allowing users to track skill progression.
- **Enterprise Dashboard:** Command center predicting exam readiness and tracking daily usage limits.

---

## 🛡️ Security & Compliance Measures

Our infrastructure implements strict security boundaries and enterprise-grade validation:

1. **Strict Password Policies (Zero Trust Principle)**
   - Passwords must be 6+ characters, containing at least 1 uppercase letter and 1 special character (Regex Enforced).
   - Validation occurs across both the client (UI feedback) and server (API Rejection) simultaneously using the shared Zod schema.
2. **Real-time Inline Validation & Strength Meter**
   - Active password strength indicators and real-time checklist during registration.
   - `Confirm Password` exact-match validation preventing user input errors.
3. **Robust Data Validation (Zod)**
   - All incoming API requests are stripped of arbitrary data and strongly validated using `packages/shared` Zod Schemas before touching the AI or Database.
4. **Role-Based Access Control (RBAC)**
   - Secure server-side middleware enforcing authorization roles (`ADMIN`, `TEACHER`, `MEMBER`), effectively gatekeeping sensitive management endpoints.

---

## 🛠️ Tech Stack Mastery

| Layer                 | Technology                    | Purpose                                                                               |
| :-------------------- | :---------------------------- | :------------------------------------------------------------------------------------ |
| **Frontend Platform** | **Next.js 14** (App Router)   | High-performance React framework leveraging Server Components.                        |
| **Styling & UI**      | **Tailwind CSS + shadcn/ui**  | Utility-first styling combined with accessible, highly-customizable components.       |
| **Backend Services**  | **Next.js API Routes / Hono** | High-throughput data processing and AI orchestration layer.                           |
| **Database & ORM**    | **PostgreSQL + Prisma 5**     | Fully typed relational database access and robust migration strategies.               |
| **Authentication**    | **NextAuth.js v5 + bcrypt**   | Secure session management with encrypted password storage.                            |
| **AI Intelligence**   | **Claude 3.5 + DeepSeek API** | Dual-Model pipeline separating Pedagogical explanations from Deep Linguistic parsing. |
| **Type Safety**       | **TypeScript 5.6 + Zod**      | End-to-end static typing and runtime input validation.                                |

---

## 📥 Development Workflow & Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **pnpm** ≥ 9.x (Required for Monorepo workspaces)
- **PostgreSQL** Local Database

### Local Setup

```bash
# 1. Clone & Install Core Dependencies
git clone https://github.com/psu6810110498/Hackathon-Vercel.git
cd Hackathon-Vercel
pnpm install

# 2. Duplicate Env File & Supply Credentials
cp .env.example .env

# 3. Synchronize Database & Generate Types
cd apps/api
pnpm prisma db push

# 4. Boot Entire Monorepo
pnpm run dev
```

### Git Workflow & Pull Request (PR) Policy

Direct commits to `main` are strictly forbidden. All features must:

1. Reside in a designated `feat/`, `fix/`, or `refactor/` branch.
2. Undergo stringent build testing (`pnpm build`) and linting.
3. Include long-form commit messages detailing **What**, **Why**, and **Technical implementation**.
4. Be evaluated through a verified GitHub Pull Request.

---

<p align="center">
  <strong>Built with ❤️ for Enterprise Education</strong><br/>
  <sub>Prince of Songkla University — 2026</sub>
</p>
