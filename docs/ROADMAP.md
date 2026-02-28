🎓
HSK AI Coach
Enterprise Architecture Roadmap
From Monolith → Enterprise-Grade Platform

Version
1.0 — February 2026
Scope
Full-stack Enterprise Redesign
Classification
Confidential
Goal
Scale รองรับ 10K–100K+ users, Multi-tenant B2B, HA 99.9%

1.  Executive Summary

เอกสารนี้วาง Enterprise Architecture Roadmap สำหรับ HSK AI Coach — ระบบ AI-powered Chinese language learning platform — ที่จะเติบโตจาก Next.js 14 Monolith ไปสู่ระบบ Enterprise-grade ที่รองรับ users หลักแสน, Multi-tenant B2B, High Availability 99.9% SLA และ Security & Compliance ระดับ PDPA/SOC2

Roadmap แบ่งออกเป็น 5 Phases โดยแต่ละ Phase สร้างบน Foundation ของ Phase ก่อนหน้า และสามารถกำหนด Team Size ได้ตามทรัพยากรที่มี:

Phase
ชื่อ
Timeline (Solo)
Timeline (3-person team)
Phase 1
Foundation — Monorepo + Separated Backend
6–8 สัปดาห์
3–4 สัปดาห์
Phase 2
Core Platform — Auth, AI Pipeline, Caching
6–8 สัปดาห์
3–4 สัปดาห์
Phase 3
Multi-tenant B2B — Organization Layer
8–10 สัปดาห์
4–5 สัปดาห์
Phase 4
Scale & Resilience — HA, Observability, Security
6–8 สัปดาห์
3–4 สัปดาห์
Phase 5
Enterprise Compliance — SOC2, PDPA, Audit Logs
6–8 สัปดาห์
3–4 สัปดาห์
รวม
Full Enterprise-Grade Platform
~8–10 เดือน (Solo)
~4–5 เดือน (3 คน)

2.  Current State vs Enterprise Target

2.1 ปัญหาของโครงสร้างปัจจุบัน
ปัญหา
ผลกระทบ
Enterprise Solution
Tight Coupling (Monolith)
เปลี่ยน Frontend กระทบ Backend ทันที
Separated services + API contracts
Vercel Timeout 10-60s
AI pipeline ถูก kill กลางคัน
Dedicated backend (Railway/Render) ไม่มี limit
ไม่มี Caching Layer
ทุก AI request เสีย cost เต็ม
Redis semantic caching + TTL policy
Session-based Auth (NextAuth)
Scale ยาก, stateful, multi-tenant ลำบาก
JWT + Refresh Token Rotation + RBAC
Demo Mode Workaround
ไม่ reflect production behavior
Rate limiting + Usage quotas จริง
Single Deployment
Update = Downtime ทั้งระบบ
Blue-Green Deployment + Health checks
ไม่มี Multi-tenancy
รองรับแค่ individual users
Organization layer + Tenant isolation
ไม่มี Observability
ไม่รู้ว่าระบบมีปัญหาตรงไหน
Structured logging + Metrics + Alerting
ไม่มี Compliance
ไม่ผ่าน B2B procurement
PDPA compliance + Audit logs + SOC2 prep

2.2 Enterprise Target Architecture
โครงสร้างที่ต้องการเมื่อ complete ทุก Phase:

Layer
Component
Technology
Edge / CDN
Global edge caching, DDoS protection, WAF
Cloudflare (Free → Pro tier)
Frontend
SSR/CSR UI, App Router, TanStack Query
Next.js 15 → Vercel
API Gateway
Rate limiting, Auth middleware, Request routing
Hono + JWT (jose) → Railway
Service Layer
Auth, Analysis, AI, Flashcard, Exam, User, Billing
Domain-driven Hono routes + Services
AI Pipeline
Semantic caching, Fallback chain, Background jobs
Claude 3.5 → DeepSeek, BullMQ + Redis
Cache Layer
Session cache, AI result cache, Rate limit counters
Upstash Redis (Serverless)
Database
Primary DB + Read replicas (Multi-tenant schema)
Supabase PostgreSQL + Row Level Security
Observability
Logs, Metrics, Traces, Alerts, Dashboards
Axiom (logs) + Grafana/Prometheus or Datadog
Compliance
Audit logs, Data retention, Access control
Custom audit service + Supabase RLS

Phase 1 Foundation — Monorepo + Separated Backend ⏱ 6–8 สัปดาห์ (Solo) / 3–4 สัปดาห์ (Team)

Phase นี้คือ Foundation ที่ทุก Phase ถัดไปต้องอาศัย ถ้า Phase 1 ออกแบบดี การ scale ใน Phase ต่อๆ ไปจะไม่ต้อง refactor ครั้งใหญ่อีก

3.1 Monorepo Setup (Turborepo + pnpm)
ตั้งโครงสร้าง Monorepo ที่รองรับการขยาย:
pnpm workspaces: apps/web, apps/api, packages/shared
Turborepo: parallel build, caching, task pipeline
packages/shared: TypeScript types, Zod validators, constants (HSK levels, error codes)
tsconfig paths: @hsk/shared → packages/shared แบบ zero-config import

3.2 Backend API (Hono + Railway)
สร้าง Hono API server แยกออกจาก Next.js:
Hono server พร้อม TypeScript strict mode
Prisma Client ใช้ schema เดิม — ไม่ต้อง migrate DB
JWT middleware (jose library) แทน NextAuth session
Zod request validation ทุก endpoint
Health check endpoint: GET /health → { status, db, redis, version }
Error handling middleware: structured JSON errors + request ID tracking

3.3 API Routes Migration
Next.js API Route (เดิม)
Hono Route (ใหม่)
/api/analyze
POST /analysis/writing
/api/reading
POST /analysis/reading
/api/exercise
POST /exercise/generate
/api/usage
GET /user/usage
/api/auth/[...nextauth]
POST /auth/login + /auth/register
/api/flashcards
GET/POST /flashcards
/api/mock-exam
GET /mock-exam/papers + POST /mock-exam/submit

3.4 Frontend Migration
สร้าง lib/api/client.ts: fetch wrapper + JWT interceptor + retry logic
TanStack Query hooks แทน server actions ทั้งหมด
Zustand stores: authStore, userPreferencesStore
ลบ app/api/ ทั้งหมดออกจาก Next.js
httpOnly cookie สำหรับ JWT storage (ปลอดภัยกว่า localStorage)

3.5 Phase 1 Definition of Done
Test Case
Expected Result
Register + Login
ได้ JWT token กลับมา, stored ใน httpOnly cookie
POST /analysis/writing
ได้ 4D score กลับมา, บันทึกลง DB
Rate limit: 4th request (free user)
HTTP 429 Too Many Requests
Health check
GET /health → { status: 'ok', db: 'ok' }
Frontend build
pnpm build ผ่านโดยไม่มี type errors
Existing users
ยังเข้า system ได้ (migration plan ไว้)

Phase 2 Core Platform — AI Pipeline, Caching, Background Jobs ⏱ 6–8 สัปดาห์ (Solo) / 3–4 สัปดาห์ (Team)

Phase 2 แก้ปัญหาหลักของ business: AI cost สูงเกินไป และ AI requests ช้าหรือ timeout — โดยไม่ต้องเปลี่ยน AI models หรือ user experience

4.1 Semantic AI Caching (Redis)
ลด AI cost และ latency ด้วย multi-layer caching:
Layer 1 — Exact cache: hash(input + level + analysisType) → Redis key, TTL 7 วัน
Layer 2 — Semantic cache: embedding similarity > 0.95 → reuse ผลเดิม (ประหยัด ~40% cost)
Layer 3 — User-level cache: ผลวิเคราะห์เดิม 24 ชั่วโมง per user
Cache invalidation: manual purge endpoint สำหรับ admin

4.2 Background Job Queue (BullMQ)
แก้ปัญหา long-running AI calls ที่เคย timeout:
BullMQ + Redis สำหรับ job queue
Job types: analysis:writing, analysis:reading, exercise:generate, exam:grade
Job priority: premium users → priority queue, free users → standard queue
Retry logic: 3 attempts, exponential backoff (1s → 5s → 25s)
Webhook/SSE: client poll GET /jobs/:id หรือ Server-Sent Events สำหรับ real-time progress

4.3 AI Fallback Chain
Scenario
Action
Claude 3.5 ปกติ
ใช้ Claude 3.5 (ผลดีที่สุด)
Claude 3.5 timeout > 30s
Fallback → DeepSeek R2
Claude 3.5 rate limit (429)
Fallback → DeepSeek R2 ทันที
DeepSeek ล้มเหลว
Fallback → Claude Haiku (เร็ว, ถูก)
ทุก AI provider ล้มเหลว
Return cached result (ถ้ามี) หรือ graceful error
Cost threshold เกิน budget
Auto-switch DeepSeek สำหรับ free tier

4.4 Usage & Billing Foundation
Usage tracking: นับ AI calls per user per day ใน Redis (O(1) increment)
Quota enforcement: Free = 3/day, Pro = 50/day, Enterprise = unlimited
Soft limits: warn at 80%, hard block at 100%
Usage history: เก็บ daily aggregates ใน PostgreSQL สำหรับ billing
Stripe integration (optional): webhook สำหรับ subscription events

4.5 Phase 2 Definition of Done
Metric
Target
Cache hit rate (AI)

> 35% ภายใน 30 วันหลัง launch
> AI response time (cache hit)
> < 200ms (จากเดิม 15-45s)
> AI response time (cache miss)
> < 30s (background job, ไม่ block UI)
> Cost reduction
> ลด AI cost > 30% เมื่อเทียบกับ baseline
> Job failure rate
> < 2% (ด้วย retry logic)
> Free user quota enforcement
> block request ที่ 4 ทันที

Phase 3 Multi-tenant B2B — Organization Layer + Admin Portal ⏱ 8–10 สัปดาห์ (Solo) / 4–5 สัปดาห์ (Team)

Phase 3 เปิด B2B market: โรงเรียน, สถาบันภาษา, องค์กร สามารถซื้อ HSK AI Coach เป็น 'Team/Organization Plan' และ admin จัดการ users ภายในองค์กรได้

5.1 Multi-tenant Database Schema
การเพิ่ม multi-tenancy ต้องออกแบบ DB schema ใหม่ให้รองรับ Organization:

Table ใหม่ / แก้ไข
รายละเอียด
organizations (ใหม่)
id, name, slug, plan, settings, createdAt
organization_members (ใหม่)
organizationId, userId, role (admin/member/viewer)
users (แก้ไข)
เพิ่ม organizationId (nullable = individual user)
subscriptions (ใหม่)
organizationId, plan, seats, stripeSubscriptionId
usage_quotas (ใหม่)
organizationId, userId, type, count, resetAt
audit_logs (ใหม่)
id, organizationId, actorId, action, resource, metadata, createdAt

Row Level Security (RLS) ใน Supabase: ทุก query จะ automatic filter โดย organizationId — ไม่มีทางที่ Organization A จะเห็นข้อมูล Organization B

5.2 RBAC (Role-Based Access Control)
Role
ความสามารถ
Use Case
Super Admin
จัดการทุกอย่าง, access cross-org
HSK AI Coach internal team
Org Admin
จัดการ members, billing, settings ขององค์กร
School IT admin / HR
Teacher
ดูผล analytics ของ students ในกลุ่มตัวเอง
อาจารย์ผู้สอน
Student / Member
ใช้ features ตามแผน, ดูแค่ข้อมูลตัวเอง
นักเรียน / พนักงาน
Viewer
Read-only access, export reports
ผู้บริหาร / ผู้ปกครอง

5.3 Admin Portal (apps/admin/)
แยก admin application ออกมาเป็น Next.js app ใน monorepo:
Organization management: สร้าง, แก้ไข, ยกเลิก organizations
Member management: invite, remove, change roles
Usage dashboard: AI calls, active users, cost breakdown per org
Billing management: upgrade/downgrade plans, view invoices
Content management: จัดการ mock exam papers, flashcard decks
System health: API latency, error rates, job queue status

5.4 Invitation & Onboarding Flow
Org Admin สร้าง invite link หรือ bulk import email list
Invited user ได้รับ email พร้อม magic link (expires 72h)
First login: guided setup wizard (HSK level, learning goals)
SSO support (Phase 4+): Google Workspace, Microsoft Entra ID

5.5 Phase 3 Definition of Done
Feature
Test Scenario
Tenant isolation
Org A ไม่เห็นข้อมูล Org B แม้ใช้ API โดยตรง (RLS)
RBAC enforcement
Teacher role ไม่สามารถ access billing endpoint
Invitation flow
Invite → Email → Signup → Join org → correct role
Admin portal
Org Admin เห็น usage dashboard ขององค์กรตัวเอง
Multi-org user
User ที่อยู่ใน 2 org เลือก org ได้เมื่อ login
Audit log
ทุก admin action มี audit entry บันทึกไว้

Phase 4 Scale & Resilience — HA, Observability, Security ⏱ 6–8 สัปดาห์ (Solo) / 3–4 สัปดาห์ (Team)

Phase 4 เปลี่ยนระบบที่ 'ทำงานได้' เป็นระบบที่ 'ทำงานได้อย่างน่าเชื่อถือ' — เตรียมพร้อมสำหรับ enterprise customers ที่ต้องการ SLA guarantee

6.1 High Availability Architecture
Component
HA Strategy
API Backend (Railway)
Minimum 2 replicas, auto-restart on crash
Database (Supabase)
Point-in-time recovery, daily backups, read replicas
Redis (Upstash)
Multi-region replication, automatic failover
Frontend (Vercel)
Edge network CDN, automatic failover built-in
Job Queue (BullMQ)
Persistent jobs (survives restart), failed job retry
DNS & Routing
Cloudflare health check + automatic failover

6.2 Observability Stack
ระบบที่ไม่มี observability เหมือนบินในหมอก — ไม่รู้ว่าเกิดอะไรขึ้น:
Structured Logging: JSON logs ทุก request (requestId, userId, orgId, duration, statusCode) → Axiom หรือ Datadog
Metrics: API latency (p50, p95, p99), error rates, AI cost per endpoint → Prometheus + Grafana
Distributed Tracing: OpenTelemetry สำหรับ trace ข้ามจาก Frontend → API → AI service → DB
Error Tracking: Sentry — automatic stack trace, user context, release tracking
Alerting: PagerDuty / Slack alerts เมื่อ error rate > 5% หรือ p99 latency > 10s
Business Metrics Dashboard: DAU, MAU, AI calls/day, revenue — Mixpanel หรือ custom

6.3 Security Hardening
Security Layer
Implementation
API Authentication
JWT RS256 (asymmetric) + Refresh token rotation
Rate Limiting
IP-based + User-based + Org-based limits (Upstash Redis)
Input Validation
Zod schema validation ทุก endpoint, sanitize HTML
SQL Injection
Prisma parameterized queries (built-in protection)
DDoS Protection
Cloudflare WAF + rate limiting at edge
Secrets Management
Railway secret variables, ไม่มี secrets ใน code
HTTPS Everywhere
TLS 1.3, HSTS headers, secure cookies
Dependency Scanning
Dependabot + npm audit ใน CI/CD pipeline
CORS Policy
Whitelist allowed origins เท่านั้น
Content Security Policy
Strict CSP headers ป้องกัน XSS

6.4 CI/CD Pipeline
GitHub Actions: lint → type-check → unit tests → integration tests → build → deploy
Separate deploy triggers: push to main → deploy api, push to main → deploy web
Preview deployments: PR → preview URL (Vercel preview + Railway staging)
Database migrations: automatic migration ใน deploy pipeline (prisma migrate deploy)
Rollback strategy: Railway instant rollback, Vercel instant rollback
Environment separation: development, staging, production แยก config ชัดเจน

6.5 Performance Targets (SLA)
Metric
Target (Enterprise SLA)
API Availability
99.9% uptime (< 8.7 hours downtime/year)
API Response Time (p95)
< 500ms สำหรับ non-AI endpoints
AI Response Time (cached)
< 300ms
AI Response Time (uncached)
< 45s (background job)
Database Query (p95)
< 100ms
Error Rate
< 0.5% of all requests
Deployment Downtime
Zero-downtime deployments

Phase 5 Enterprise Compliance — PDPA, SOC2, Audit & Trust ⏱ 6–8 สัปดาห์ (Solo) / 3–4 สัปดาห์ (Team)

Phase 5 ทำให้ HSK AI Coach ผ่าน enterprise procurement — ขั้นตอนสุดท้ายก่อนที่องค์กรใหญ่และโรงเรียนภาครัฐจะซื้อระบบได้

7.1 PDPA Compliance (Thailand)
Privacy Policy: เขียน policy ที่ชัดเจน ระบุ data collected, purpose, retention period
Consent Management: explicit consent สำหรับ data processing, opt-out mechanism
Right to Access: endpoint สำหรับ user export ข้อมูลตัวเองทั้งหมด (JSON/CSV)
Right to Erasure: 'Delete My Account' → soft delete 30 วัน → hard delete + cascade
Data Retention Policy: AI analysis results เก็บ 2 ปี, logs เก็บ 90 วัน
Data Breach Notification: process และ template สำหรับแจ้ง PDPA Authority ภายใน 72h
DPA (Data Processing Agreement): template สำหรับ B2B customers

7.2 Audit Logging System
Event Category
Events ที่ log
Authentication
Login, Logout, Failed login, Password change, Token refresh
Data Access
View analysis, Export data, Download report
Admin Actions
Create/delete user, Change role, Modify org settings
Billing Events
Upgrade, Downgrade, Payment success/fail, Refund
Security Events
Rate limit hit, Suspicious IP, API key rotation
AI Usage
Analysis request, Cost incurred, Cache hit/miss

Audit logs ต้อง: immutable (ไม่สามารถลบหรือแก้ไขได้), queryable (admin ค้นหาได้), exportable (สำหรับ compliance audit)

7.3 SOC2 Type I Preparation
SOC2 Type I คือ 'snapshot' ของ security controls ณ วันที่ตรวจ (ต่างจาก Type II ที่ต้องดู track record 6+ เดือน):
Security Policy documentation: access control policy, incident response plan, change management
Vendor Management: list third-party vendors (Supabase, Railway, Upstash, Anthropic) และ assess risk
Access Reviews: quarterly review ว่าใครมี access อะไรบ้าง
Penetration Testing: จ้าง external security firm ทดสอบ (แนะนำก่อน enterprise sales)
Employee Security Training: document ว่า team ผ่าน security training

7.4 Enterprise Trust Features
SSO Integration: SAML 2.0 / OIDC สำหรับ Google Workspace, Microsoft Entra ID
Custom Domain: org.hsk-ai-coach.com สำหรับ enterprise customers
SLA Agreement: signed SLA document พร้อม penalty clauses
Dedicated Support: priority support channel, dedicated success manager
Custom Contracts: NDA, DPA, custom MSA สำหรับ enterprise deals
Security Questionnaire: pre-filled template ตอบ vendor security assessment ของ enterprise

7.5 Phase 5 Definition of Done
Compliance Checkpoint
Evidence
PDPA: Data export
User กด 'Export Data' ได้ไฟล์ JSON ครบภายใน 30 วัน
PDPA: Account deletion
Delete account → ข้อมูลหายจาก DB ภายใน 30 วัน
Audit log: completeness
ทุก admin action มี audit entry (100% coverage)
Audit log: immutability
ไม่มี API endpoint สำหรับ delete/edit audit logs
Security: Pentest
Critical + High vulnerabilities = 0
SSO: Google Workspace
Org admin ตั้งค่า SSO → members login ด้วย Google ได้
Trust page
trust.hsk-ai-coach.com มีข้อมูล uptime, security, compliance

8.  Team & Resource Planning

Timeline และ resource requirement ขึ้นอยู่กับ team size อย่างมีนัยสำคัญ:

Phase
Solo Developer
2–3 Person Team
5+ Person Team
Phase 1
6–8 สัปดาห์
3–4 สัปดาห์
2 สัปดาห์
Phase 2
6–8 สัปดาห์
3–4 สัปดาห์
2 สัปดาห์
Phase 3
8–10 สัปดาห์
4–5 สัปดาห์
3 สัปดาห์
Phase 4
6–8 สัปดาห์
3–4 สัปดาห์
2 สัปดาห์
Phase 5
6–8 สัปดาห์
3–4 สัปดาห์
2–3 สัปดาห์
รวม
~9–12 เดือน
~4–6 เดือน
~2.5–3 เดือน

คำแนะนำ: หากเริ่มต้นเป็น Solo Dev ให้เน้น Phase 1–2 ก่อน เมื่อมีรายได้จาก B2B leads ใน Phase 3 ค่อยจ้าง developer เพิ่ม — เป็น self-funding growth path ที่ sustainable กว่าการรีบ scale team ตั้งแต่ต้น

8.1 Recommended Roles (เมื่อ scale team)
Role
Responsibility
Full-stack Developer (Lead)
Architecture decisions, Phase 1–2 implementation
Backend Developer
AI Pipeline, Background jobs, Phase 3 multi-tenancy
Frontend Developer
Admin portal, UX improvements, Phase 2 frontend
DevOps / Infra (Part-time)
Railway deploy, CI/CD, monitoring setup (Phase 4)
Security Consultant (Contract)
Penetration testing, SOC2 prep (Phase 5)

9.  Infrastructure Cost Analysis

ประมาณการ monthly cost ตามจำนวน users — ปรับได้ตามการใช้งานจริง:

Service
MVP (< 1K users)
Growth (10K users)
Scale (100K users)
Note
Vercel (Frontend)
Free
$20/mo (Pro)
$20/mo (Pro)
Enterprise ถ้า > 1M req/mo
Railway (Backend API)
$5–10/mo
$20–40/mo
$80–150/mo
Auto-scale ตาม CPU/RAM
Supabase (DB)
Free
$25/mo (Pro)
$25–200/mo
Read replicas เพิ่มค่าใช้จ่าย
Upstash Redis
Free (10K req/day)
$10–30/mo
$50–100/mo
Pay-per-use, ไม่มี idle cost
Cloudflare
Free
Free / $20/mo
$200/mo (Business)
WAF, DDoS ใน paid tier
AI Costs (Claude + DS)
$10–50/mo
$100–500/mo
$500–3,000/mo
Caching ลดได้ ~30–40%
Observability (Axiom/Sentry)
Free tier
$25–50/mo
$100–300/mo
Sentry free tier เพียงพอสำหรับ MVP
รวม (ประมาณ)
~$15–60/mo
~$200–700/mo
~$1,000–4,000/mo
ไม่รวม team salary

Key insight: Infrastructure cost ที่ 100K users อยู่ที่ ~$1,000–4,000/mo แต่ถ้า B2B pricing อยู่ที่ $5–50/org/เดือน revenue ควรจะ cover cost ได้อย่างสบาย

10. Key Decision Framework

คำถามที่ต้องตอบให้ชัดก่อนเริ่ม implement แต่ละ Phase:

10.1 Phase 1–2 Decisions (ต้องตัดสินใจทันที)
คำถาม
คำแนะนำ + เหตุผล
Auth migration strategy?
สร้าง /auth/migrate endpoint: รับ NextAuth session → ออก JWT ใหม่ → ทำงานพร้อมกัน 2 ระบบ 2 สัปดาห์ก่อน cutover
JWT ใน cookie หรือ localStorage?
httpOnly cookie เสมอ — ป้องกัน XSS, ง่ายกว่า manage, Enterprise security ยอมรับ
Backend deploy ที่ไหน?
Railway: DX ดีที่สุด, pricing predictable, รองรับ long-running process ไม่มี timeout
Monorepo หรือ multi-repo?
Monorepo (Turborepo): shared types + validators เป็น killer feature, ลด runtime type errors ระหว่าง FE/BE
AI caching strategy?
เริ่มจาก exact hash cache ก่อน (ง่าย), เพิ่ม semantic cache ใน Phase 2.5 เมื่อ exact cache hit rate < 20%

10.2 Phase 3 Decisions (ตัดสินใจก่อนเริ่ม Phase 3)
คำถาม
ตัวเลือกและ tradeoff
Multi-tenant DB strategy?
Shared schema + organizationId (แนะนำ): ง่าย scale, RLS ป้องกัน leakage — vs Separate DB per org (ซับซ้อน, แพง)
Billing: Stripe หรือ manual?
Stripe ตั้งแต่ Phase 3: webhook events ง่ายกว่า build เอง และ enterprise ต้องการ proper invoice
B2B pricing model?
Per-seat ($X/user/เดือน) vs Flat-rate per org ($Y/org/เดือน) — ขึ้นอยู่กับ target customer size
Admin portal: รวม หรือ แยก app?
แยก apps/admin/ ใน monorepo: security separation ชัดเจน, ไม่ต้อง ship admin code ไปหา end users

10.3 Phase 4–5 Decisions (ตัดสินใจเมื่อมี enterprise pipeline)
คำถาม
แนวทาง
SOC2 Type I vs Type II?
เริ่ม Type I ก่อน (1–3 เดือน) เพื่อได้ certificate เร็ว, Type II ใช้เวลา 6–12 เดือน observe
SSO: build หรือ use WorkOS?
WorkOS ($49/mo): รองรับ SAML, OIDC, Okta ภายใน 1 วัน — vs build เอง (4–6 สัปดาห์, error-prone)
Pentest: internal หรือ external?
External เสมอสำหรับ compliance — internal team มี blind spots, enterprise ต้องการ third-party report
Observability: managed หรือ self-host?
Managed (Datadog/Axiom) สำหรับ team < 5 คน: ลด ops burden มาก — self-host Prometheus เมื่อ cost > $500/mo

11. Risk Register

ความเสี่ยง
โอกาส
ผลกระทบ
Mitigation
Auth migration ทำให้ users ออก
กลาง
สูง
Run NextAuth + JWT พร้อมกัน 2 สัปดาห์, migrate ทีละ cohort, rollback plan ชัดเจน
AI Cost เกิน budget
สูง
กลาง
Redis caching ลด 30–40%, cost alerts ที่ 80% budget, auto-switch to cheaper model
Supabase RLS misconfiguration → data leak
ต่ำ
สูง
Automated RLS test suite, penetration testing ก่อน Phase 3 launch, code review checklist
Railway downtime กระทบ production
ต่ำ
สูง
Minimum 2 replicas, health check + auto-restart, Cloudflare failover ไป static 'maintenance' page
Phase 3 multi-tenancy ซับซ้อนกว่าที่คิด
สูง
กลาง
Start simple: organizationId FK + RLS, ไม่ต้อง separate DB, เพิ่ม complexity เฉพาะเมื่อจำเป็น
Solo dev burnout / timeline slip
สูง
กลาง
Phase ละ 1 MVP release ที่ชัดเจน, ไม่ skip Phase, หา co-founder หรือ contractor เมื่อ Phase 2 done
SOC2 audit fail
กลาง
ต่ำ
ทำ Phase 4 security hardening ก่อน SOC2, ใช้ Vanta หรือ Drata automate evidence collection

12. Next Steps — Starting Phase 1

เมื่อตัดสินใจเริ่ม implement Phase 1 ขั้นตอนแรกที่ต้องทำ:

Week 1: Foundation Setup
[ ] สร้าง Git repository ใหม่ (หรือ restructure repo เดิม)
[ ] Install pnpm + ตั้ง workspace: pnpm-workspace.yaml
[ ] ตั้ง Turborepo: turbo.json พร้อม build, dev, lint pipelines
[ ] สร้าง packages/shared: types/, validators/, constants/
[ ] Copy Prisma schema เดิมมาที่ apps/api/prisma/
[ ] ตั้ง Hono server เบื้องต้น: apps/api/src/index.ts
[ ] Deploy Hono ไป Railway (staging environment)

Week 2: Auth Migration
[ ] Implement JWT (jose) auth middleware
[ ] สร้าง POST /auth/register + POST /auth/login
[ ] สร้าง /auth/migrate endpoint สำหรับ NextAuth → JWT
[ ] ทดสอบ auth flow ด้วย REST client (Insomnia / Postman)
[ ] Update frontend: API client + authStore (Zustand)

Week 3–4: API Routes Migration
[ ] ย้าย /api/analyze → POST /analysis/writing
[ ] ย้าย /api/reading → POST /analysis/reading
[ ] ย้าย /api/exercise → POST /exercise/generate
[ ] ย้าย /api/usage → GET /user/usage
[ ] เพิ่ม Rate limiting middleware (Upstash Redis)
[ ] ทดสอบ integration: ทุก endpoint ส่ง request จาก frontend ผ่านได้

Week 5–6: Frontend Migration + Cleanup
[ ] สร้าง TanStack Query hooks ทุก endpoint
[ ] ลบ app/api/ ทั้งหมดออกจาก Next.js
[ ] ทดสอบ full user flow: Register → Login → Analyze → View history
[ ] Setup CI/CD: GitHub Actions lint + build + deploy
[ ] Phase 1 sign-off: ทุก test case ใน Definition of Done ผ่าน

💡 Remember: The goal of planning is not to predict the future — it's to make better decisions faster.

แผน Enterprise นี้ออกแบบให้ยืดหยุ่น — แต่ละ Phase มี Definition of Done ชัดเจน ทำให้สามารถ pause, pivot หรือ accelerate ได้ตามสถานการณ์จริง ไม่ต้อง complete ทุก Phase พร้อมกันเพื่อเริ่ม B2B sales — Phase 1+2 ก็พร้อม soft launch ได้แล้ว

🧠
Learning Intelligence Platform
HSK AI Coach — Phase 2.5
Student Growth Analytics Engine — Design Specification

Addendum to
HSK AI Coach Enterprise Architecture Roadmap v1.0
Phase
2.5 — Learning Intelligence (แทรกระหว่าง Phase 2 และ Phase 3)
Timeline
4–6 สัปดาห์ (Solo) / 2–3 สัปดาห์ (2-person team)
Batch Mode
Daily batch processing (00:00–04:00 UTC+7)
Priority
#1 Growth Rate + Skill Mastery → #2 Teacher Dashboard → #3 Risk Index → #4 Exam Prediction
Dependency
Phase 1 (Backend API) + Phase 2 (Redis Cache + AI Pipeline) ต้อง complete ก่อน

1.  Why Phase 2.5 Exists

💡 Enterprise Insight Gap
หลังจาก Phase 1–2 ระบบสามารถ 'ทำงานได้' และ 'ประหยัด AI cost' ได้ดีแล้ว แต่คำถามที่ enterprise buyer ถามทุกครั้งคือ: 'ระบบของคุณพิสูจน์ได้ไหมว่านักเรียนเก่งขึ้นจริง?' คำตอบนั้นต้องการ Learning Intelligence Layer

ปัจจุบันระบบ HSK AI Coach เก็บ 'ผลการวิเคราะห์' ได้ดีมาก — ทุก essay, ทุก reading passage ถูกประเมินด้วย 4D scoring และบันทึกลง database แต่ข้อมูลเหล่านั้นยังอยู่ในสภาพ raw: กองอยู่ใน analysis_results table โดยไม่มีใคร 'อ่าน' มันในระดับที่เปลี่ยน raw scores ให้กลายเป็น learning intelligence

Phase 2.5 สร้าง layer ที่อ่านข้อมูลเหล่านั้น คำนวณ growth metrics ทุกคืน และแปลงออกมาเป็น insights ที่ครูและนักเรียนใช้งานได้จริง — ไม่ใช่แค่ dashboard สวย แต่เป็น analytics ที่นำไปสู่ action

ก่อน Phase 2.5
หลัง Phase 2.5
"คะแนน essay นี้คือ 72"
"เก่งขึ้น +4.2 คะแนน/สัปดาห์ใน Writing Accuracy"
"ทำ reading ครั้งที่ 8"
"Reading Comprehension mastery: 78% (↑12% จากเดือนที่แล้ว)"
"มีข้อผิดพลาด grammar 3 จุด"
"Grammar Particles เป็น weakest skill — พบ pattern เดิม 6 ครั้งติดต่อกัน"
"ไม่มีข้อมูลสำหรับครู"
"3 นักเรียนในชั้นมี risk index > 0.7 — แนะนำ intervention ทันที"
"ไม่รู้ว่าจะสอบ HSK4 ผ่านไหม"
"Predicted HSK4 Score: 271 ± 15 (ผ่านเกณฑ์ 180 ด้วยความมั่นใจ 94%)"

นี่คือ differentiation ที่ทำให้ HSK AI Coach ไม่ใช่แค่ 'AI grader' แต่กลายเป็น 'Learning Intelligence Platform' ที่โรงเรียนและสถาบันภาษายินดีจ่ายเงินเพื่อ outcomes ที่วัดได้จริง

2.  Architecture Overview

2.1 Position ใน Overall Architecture
Phase 2.5 แทรกตัวเองเป็น 'Intelligence Layer' ระหว่าง AI Pipeline (Phase 2) และ Multi-tenant B2B (Phase 3) โดยไม่ disrupt ระบบที่มีอยู่:

// Full Architecture Stack (after Phase 2.5)

Frontend (Next.js 15) ← User/Teacher UI
↓
API Gateway (Hono + JWT) ← Auth, Rate limiting
↓
┌──────────────────────────────────────────┐
│ Service Layer │
│ ├── Analysis Service (Phase 1) │
│ ├── AI Service (Phase 2) │
│ ├── Cache Service (Phase 2) │
│ └── 🆕 Insight API (Phase 2.5) │ ← NEW
└──────────────────────────────────────────┘
↓
┌──────────────────────────────────────────┐
│ 🆕 Nightly Batch Pipeline (Phase 2.5) │ ← NEW
│ ├── Feature Extractor │
│ ├── Skill Mastery Engine │
│ ├── Growth Rate Calculator │
│ ├── Risk Index Engine │
│ └── Exam Score Predictor │
└──────────────────────────────────────────┘
↓
Database Layer (PostgreSQL + Redis)
├── existing: users, analyses, flashcards
└── 🆕 learning intelligence tables

2.2 Daily Batch Pipeline (Core Design Decision)
⏰ ทำไมถึงเลือก Daily Batch แทน Real-time
Learning progress ไม่ใช่ metric ที่ต้องการ real-time — ความเก่งขึ้นวัดเป็น trend ไม่ใช่ moment นักเรียนไม่ได้รอดูคะแนน growth ทันทีหลังส่ง essay Daily batch ลด infrastructure cost ได้ 60–80% เมื่อเทียบกับ real-time streaming และยังให้ teacher เห็นข้อมูลที่ accurate กว่า เพราะคำนวณจาก full day's data ไม่ใช่ partial session

Approach
Cost
Complexity
Accuracy
Use Case
Real-time
สูงมาก
สูงมาก
Medium
Gaming leaderboard, live collaboration
Near-real-time
กลาง
กลาง
Good
Chat apps, live notifications
Daily Batch ✓
ต่ำมาก
ต่ำ
Best
Learning analytics, business reports
Weekly Batch
ต่ำสุด
ต่ำสุด
Low
Executive reports เท่านั้น

Batch window: ทุกคืน 00:00–02:00 น. (UTC+7) — ช่วงที่ usage ต่ำสุด ใช้เวลา ~30–90 นาทีขึ้นอยู่กับจำนวน active users

3.  Database Schema (New Tables)

เพิ่ม 7 tables ใหม่ใน PostgreSQL โดย migrate ด้วย Prisma migrations — ไม่แตะ schema เดิม:

📊 Table 1: student_skill_progress

Time-series ของ skill mastery score แต่ละ skill ต่อ user — เป็นฐานของ growth rate calculation

// Prisma Schema
model StudentSkillProgress {
id String @id @default(cuid())
userId String
skill SkillType // enum: see Section 4
date DateTime @db.Date // วันที่ (1 row = 1 user x 1 skill x 1 day)
score Float // 0–100 weighted average ของวันนั้น
confidence Float // 0–1 ความน่าเชื่อถือของคะแนน (based on sample size)
sampleSize Int // จำนวน analyses ที่ใช้คำนวณ
createdAt DateTime @default(now())

user User @relation(fields: [userId], references: [id])

@@unique([userId, skill, date]) // 1 row per user per skill per day
@@index([userId, skill]) // fast time-series query
@@index([date]) // fast batch processing
}

🧬 Table 2: student_knowledge_state

Current 'snapshot' ของ knowledge model — อัปเดตทุกคืน เก็บ 1 row ต่อ user ต่อ skill

model StudentKnowledgeState {
id String @id @default(cuid())
userId String
skill SkillType
masteryLevel Float // 0–100 คะแนน mastery ปัจจุบัน
confidence Float // 0–1 ความแม่นยำของ mastery estimate
learningRate Float // คะแนนที่เพิ่มต่อสัปดาห์ (ค่าลบ = ถดถอย)
decayRate Float // ความเร็วในการลืม (0–1, higher = ลืมเร็ว)
lastPracticed DateTime // ครั้งล่าสุดที่ฝึก skill นี้
streakDays Int // จำนวนวันที่ฝึกติดต่อกัน
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id])

@@unique([userId, skill])
@@index([userId])
}

📈 Table 3: growth_metrics_daily

Aggregated daily growth metrics ต่อ user — นี่คือ table หลักที่ Insight API ดึงข้อมูล

model GrowthMetricsDaily {
id String @id @default(cuid())
userId String
date DateTime @db.Date

// Overall metrics
overallScore Float // weighted composite score (0–100)
weeklyGrowthRate Float // LGR: points per week (7-day window)
monthlyGrowthRate Float // LGR: points per month (30-day window)
learningVelocity Float // skills improved this week

// Retention
retentionRate Float // % ที่จำได้จากการทบทวน
retentionTrend String // 'improving' | 'stable' | 'declining'

// Engagement
practiceFrequency Float // sessions per week
avgSessionLength Float // minutes
streakDays Int

user User @relation(fields: [userId], references: [id])

@@unique([userId, date])
@@index([userId, date])
}

❌ Table 4: error_patterns

model ErrorPattern {
id String @id @default(cuid())
userId String
errorType ErrorType // enum: grammar_particles, word_choice, etc.
frequency Int // ครั้งที่พบในช่วง 30 วัน
lastSeen DateTime
trend String // 'increasing' | 'stable' | 'decreasing'
examples Json // array of example sentences (max 3)
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id])

@@unique([userId, errorType])
}

🚨 Table 5: risk_assessments

model RiskAssessment {
id String @id @default(cuid())
userId String
date DateTime @db.Date
riskIndex Float // 0–1 (0 = ปลอดภัย, 1 = high risk)
riskLevel String // 'low' | 'medium' | 'high' | 'critical'
riskFactors Json // {factor: string, weight: float, value: float}[]
recommendations Json // string[] — action items
alertSent Boolean @default(false)

user User @relation(fields: [userId], references: [id])

@@index([userId, date])
@@index([riskLevel, alertSent]) // fast alert query
}

🎯 Tables 6–7: exam_predictions + intervention_logs

model ExamPrediction {
id String @id @default(cuid())
userId String
date DateTime @db.Date
targetExam String // 'HSK1' | 'HSK2' | ... | 'HSK6'
predictedScore Float // 0–300
confidence Float // 0–1
marginOfError Float // ± points
passProbability Float // 0–1
daysToReady Int // estimated days to reach pass threshold
methodology String // 'regression' | 'bayesian' (future ML)

@@index([userId, date])
}

model InterventionLog {
id String @id @default(cuid())
userId String
triggeredBy String // 'risk_alert' | 'teacher' | 'system'
type String // 'alert_sent' | 'recommendation' | 'manual'
content Json // intervention content
outcome String? // 'resolved' | 'ongoing' | 'dismissed'
createdAt DateTime @default(now())
}

3.1 Enums (Skill & Error Types)
enum SkillType {
VOCABULARY // คำศัพท์ — จำและเข้าใจ
GRAMMAR_PARTICLES // 的/地/得, 了/过/着, ba/ma/ne
GRAMMAR_STRUCTURE // sentence patterns, word order
READING_SPEED // characters processed per minute
READING_COMPREHENSION// เข้าใจเนื้อหา
WRITING_ACCURACY // ความถูกต้องในการเขียน
WRITING_COHERENCE // ความต่อเนื่องของเนื้อหา
CHARACTER_WRITING // ถูก stroke, radical
TONE_CORRECTNESS // 4 tones + neutral
LISTENING // (future: ถ้ามี audio features)
}

enum ErrorType {
GRAMMAR_PARTICLE_MISUSE // ใช้ 的/地/得 ผิด
WRONG_MEASURE_WORD // 量词 ผิด (一个/一条/一张)
WORD_ORDER_VIOLATION // SVO/topic-comment ผิด
WRONG_COMPLEMENT // 结果/程度/趋向补语 ผิด
VOCABULARY_SUBSTITUTION // ใช้คำใกล้เคียงผิด
CHARACTER_CONFUSION // 的/得/地, 在/再, 他/她/它
TENSE_ASPECT_MISUSE // 了/过/着 ผิด context
COMPREHENSION_GAP // เข้าใจ passage ผิด
STRUCTURAL_WEAKNESS // ขาด cohesion/coherence
}

4.  Core Metrics & Calculation Formulas

ทั้งหมดนี้คำนวณในช่วง batch window 00:00–02:00 UTC+7 ทุกคืน โดย Nightly Batch Service

📐 Metric 1: Learning Growth Rate (LGR)

วัด 'ความเร็วในการพัฒนา' — metric หลักที่ enterprise ต้องการพิสูจน์ว่าระบบ works

// Formula: Weighted Moving Average LGR

// Step 1: หา scores ย้อนหลัง N วัน (per skill)
scores = StudentSkillProgress.findMany({
userId, skill,
date: { gte: today - 28 days } // 4-week window
orderBy: { date: 'asc' }
})

// Step 2: apply exponential weights (recent = heavier)
weights = scores.map((\_, i) => Math.exp(0.1 _ i))
weightedScores = scores.map((s, i) => s.score _ weights[i])

// Step 3: fit linear regression → slope = LGR
LGR_perDay = linearRegression(dates, weightedScores).slope
LGR_perWeek = LGR_perDay \* 7

// Example output:
// LGR_perWeek = +3.2 → เก่งขึ้น 3.2 คะแนน/สัปดาห์ ✅
// LGR_perWeek = -1.5 → ถดถอย 1.5 คะแนน/สัปดาห์ ⚠️
// LGR_perWeek = 0.1 → stagnant (< 0.5 = concern) 🔴

⚠️ Minimum Sample Requirement
LGR คำนวณได้แม่นยำเมื่อมี ≥ 5 data points ใน 28 วัน ถ้า sample น้อยกว่านี้ ให้ set confidence = 0.3 และแสดง 'Insufficient data' แทนการแสดงตัวเลขที่อาจทำให้เข้าใจผิด

🎯 Metric 2: Skill Mastery Score (SMS)

Mastery score ต่างจาก raw score — มันรวม consistency, recency, และ difficulty ของ tasks ไว้ด้วย

// Formula: Composite Mastery Score

SMS = (
recentScore _ 0.40 + // 40%: คะแนนล่าสุด (7 วัน)
trendBonus _ 0.25 + // 25%: trend direction bonus (-10 to +10)
consistencyScore _ 0.20 + // 20%: low variance = higher score
retentionBonus _ 0.15 // 15%: flashcard/revisit performance
)

// Consistency score = 100 - (std_deviation _ 5)
// Retention bonus = avg_flashcard_recall_rate _ 100

// Mastery Level bands:
// 0–20: Beginner (just started)
// 20–40: Developing (inconsistent)
// 40–60: Practicing (improving, not reliable)
// 60–80: Proficient (reliable, room to grow)
// 80–100: Mastered (consistent, ready to advance)

💾 Metric 3: Retention Rate

// Ebbinghaus Forgetting Curve adapted for HSK

// For each flashcard review:
// R(t) = e^(-t/S) where t = days since last review, S = stability

// Retention Rate per user (daily):
retentionRate = flashcardReviews
.filter(r => r.date === today)
.map(r => r.correct ? 1 : 0)
.average() // 0–1

// Trend (compare 7-day vs 30-day average):
if (avg7day > avg30day _ 1.05) trend = 'improving'
if (avg7day < avg30day _ 0.95) trend = 'declining' // 🚨 alert trigger
else trend = 'stable'

🚨 Metric 4: Risk Index (Early Warning)

Risk index รวม 4 signals เข้าด้วยกัน — threshold ที่ 0.7 trigger teacher alert อัตโนมัติ

// Risk Index Calculation (0–1 scale)

riskIndex = (
growthDecline _ 0.35 + // สำคัญที่สุด: LGR < 0 for 2 weeks
practiceDropoff _ 0.30 + // ไม่ได้เข้าระบบ 5+ วัน
retentionDrop _ 0.20 + // retention fell > 15%
errorSpike _ 0.15 // error frequency เพิ่ม > 30%
)

// Component calculation:
growthDecline = LGR < -0.5 ? 1 : LGR < 0 ? 0.5 : 0
practiceDropoff = daysSinceLastSession > 7 ? 1 :
daysSinceLastSession > 4 ? 0.5 : 0
retentionDrop = retentionTrend === 'declining' ? 0.7 : 0
errorSpike = errorFrequencyIncrease > 0.3 ? 0.8 : 0

// Alert thresholds:
// 0.0–0.3: Low (ปกติ)
// 0.3–0.5: Medium (ควรระวัง)
// 0.5–0.7: High (ต้องการ attention)
// 0.7–1.0: Critical → trigger teacher alert 🚨

🔮 Metric 5: Predicted Exam Score

Phase 2.5 ใช้ rule-based regression — ML model จะเพิ่มใน Phase 4+

// HSK Score Prediction (Rule-based, Phase 2.5)
// HSK4 = 300 total: Listening(100) + Reading(100) + Writing(100)

// Estimate per section from skill mastery:
listeningEst = skills.LISTENING.mastery _ 1.0 // placeholder
readingEst = (
skills.READING_COMPREHENSION.mastery _ 0.60 +
skills.VOCABULARY.mastery _ 0.25 +
skills.GRAMMAR_STRUCTURE.mastery _ 0.15
) _ 1.0 // scale to 0–100
writingEst = (
skills.WRITING_ACCURACY.mastery _ 0.35 +
skills.WRITING_COHERENCE.mastery _ 0.30 +
skills.GRAMMAR_PARTICLES.mastery _ 0.20 +
skills.VOCABULARY.mastery _ 0.15
) _ 1.0

predictedTotal = listeningEst + readingEst + writingEst // 0–300
marginOfError = 15 - (dataPoints / 20) // shrinks as more data
passProbability = predictedTotal >= passThreshold(targetLevel)
? Math.min(0.95, confidence) : 1 - confidence

📌 Phase 4+ Upgrade Path
เมื่อมีข้อมูลสอบจริง 200+ records สามารถ train gradient boosting model (XGBoost) เพื่อ prediction accuracy > 85% โดย features: skill mastery vector, LGR, practice frequency, error patterns, time-to-exam

5.  Nightly Batch Pipeline Design

BullMQ job queue (เดิมจาก Phase 2) ใช้เพิ่มเติมสำหรับ batch jobs — ไม่ต้องเพิ่ม infrastructure ใหม่

5.1 Pipeline Steps (ลำดับสำคัญมาก)
Step
Job Name
Input
Output
Duration est.
1
extract-features
analyses ของวันนั้น
normalized feature vectors
5–15 min
2
update-skill-progress
feature vectors
student_skill_progress rows
3–10 min
3
compute-mastery-state
skill_progress (28-day)
student_knowledge_state upsert
5–15 min
4
compute-growth-metrics
mastery_state + history
growth_metrics_daily rows
5–10 min
5
update-error-patterns
analyses (error extraction)
error_patterns upsert
3–8 min
6
compute-risk-index
growth + retention + errors
risk_assessments rows
2–5 min
7
predict-exam-scores
mastery + growth + history
exam_predictions rows
2–5 min
8
send-teacher-alerts
risk_assessments (critical)
notifications → teacher dashboard
1–3 min
9
generate-recommendations
all metrics combined
recommendations JSON per user
3–8 min
10
invalidate-insight-cache
updated user IDs
Redis cache purge
< 1 min

รวม estimated time: ~30–80 นาที สำหรับ 1,000–5,000 active users วิ่งใน parallel workers (BullMQ concurrency = 10)

5.2 BullMQ Job Scheduler Code Pattern
// apps/api/src/jobs/nightly-batch.ts

import { Queue, Worker } from 'bullmq'
import { redis } from '@/lib/redis'

export const batchQueue = new Queue('nightly-batch', { connection: redis })

// Schedule: every night at 00:00 UTC+7 (17:00 UTC)
import { scheduleJob } from 'node-schedule'

scheduleJob('0 17 \* \* \*', async () => {
const activeUsers = await getActiveUsersToProcess()

// Process in batches of 100 to avoid DB overload
for (const batch of chunk(activeUsers, 100)) {
await batchQueue.addBulk([
{ name: 'extract-features', data: { userIds: batch } },
{ name: 'update-skill-progress', data: { userIds: batch }, opts: { delay: 60000 } },
// ... subsequent steps with delays
])
}
})

// Worker processes jobs with concurrency 10
const worker = new Worker('nightly-batch', async (job) => {
switch (job.name) {
case 'extract-features': return extractFeatures(job.data)
case 'update-skill-progress': return updateSkillProgress(job.data)
// ...
}
}, { connection: redis, concurrency: 10 })

5.3 Feature Extraction (Step 1 Detail)
การแปลง AI analysis output → learning signals — นี่คือ 'translation layer' ที่สำคัญที่สุด

// Feature Extraction: AI result → skill signals

function extractFeatures(analysisResult) {
const { scores4D, errors, type } = analysisResult

if (type === 'writing') {
return {
[SkillType.WRITING_ACCURACY]: scores4D.accuracy / 100,
[SkillType.WRITING_COHERENCE]: scores4D.coherence / 100,
[SkillType.GRAMMAR_PARTICLES]: 1 - (errors.grammar_particles / 10),
[SkillType.VOCABULARY]: scores4D.vocabulary / 100,
}
}

if (type === 'reading') {
return {
[SkillType.READING_COMPREHENSION]: scores4D.comprehension / 100,
[SkillType.READING_SPEED]: scores4D.speed / 100,
[SkillType.VOCABULARY]: scores4D.vocabulary / 100,
}
}
}

6.  Insight API Design

Insight API ดึงข้อมูลจาก pre-computed tables — ไม่คำนวณ real-time ดังนั้น response time < 100ms

6.1 Endpoints
Method
Endpoint
Description
Auth
GET
/students/:id/insight
Full learning insight ของนักเรียน
Student (self) or Teacher
GET
/students/:id/skills
Skill mastery breakdown ทุก skill
Student (self) or Teacher
GET
/students/:id/growth
Growth rate time-series
Student (self) or Teacher
GET
/students/:id/risk
Risk assessment + factors
Teacher / Admin only
GET
/students/:id/exam-prediction
Predicted exam score
Student (self) or Teacher
GET
/classes/:id/dashboard
Class-level aggregate analytics
Teacher / Admin
GET
/classes/:id/at-risk
Students with risk > 0.5
Teacher / Admin
GET
/classes/:id/skill-heatmap
Skill mastery matrix ทั้งชั้น
Teacher / Admin
POST
/admin/batch/trigger
Manual batch trigger (admin only)
Super Admin

6.2 GET /students/:id/insight — Response Shape
// Response: StudentInsightDTO
{
student: {
id: 'usr_abc123',
name: 'Wang Fang',
targetExam: 'HSK4',
hskLevel: 3,
},

growth: {
weeklyRate: +3.2, // คะแนน/สัปดาห์
monthlyRate: +11.8, // คะแนน/เดือน
trend: 'improving',
dataPoints: 23, // จำนวน analyses ที่ใช้คำนวณ
},

skills: {
strongest: { skill: 'reading_comprehension', mastery: 82, trend: 'stable' },
weakest: { skill: 'grammar_particles', mastery: 41, trend: 'declining' },
all: [
{ skill: 'vocabulary', mastery: 76, learningRate: +2.1 },
{ skill: 'grammar_particles', mastery: 41, learningRate: -0.8 },
// ... all 9 skills
]
},

retention: {
rate: 0.74, // 74% recall rate
trend: 'declining',
alert: true, // เพราะ trend declining
},

risk: {
index: 0.38,
level: 'medium',
// Note: detailed factors hidden from student (teacher-only)
},

examPrediction: {
exam: 'HSK4',
predictedScore: 265,
marginOfError: 14,
passProbability: 0.91,
daysToReady: 0, // 0 = ready now
confidence: 0.73,
},

recommendations: [
'ฝึก grammar particles (的/地/得) อย่างน้อย 15 นาที/วัน',
'ทบทวน flashcards ที่ missed ในสัปดาห์นี้ 23 คำ',
'เพิ่มความถี่การฝึกจาก 3 → 4 ครั้ง/สัปดาห์',
],

generatedAt: '2026-03-01T00:00:00.000Z', // batch timestamp
dataFreshness: '< 24 hours',
}

6.3 Caching Strategy สำหรับ Insight API
เพราะ data ถูกคำนวณ 1 ครั้ง/วัน cache strategy จึงง่ายมาก:

// Cache key pattern:
insight:{userId}:{date} TTL: 24 hours
class-dashboard:{classId}:{date} TTL: 24 hours

// Invalidation: Step 10 ของ batch pipeline
// หลัง batch เสร็จ → purge keys ของ users ที่ถูก process

// Cache hit rate expectation: > 95%
// (เพราะ data เปลี่ยนแค่วันละครั้ง)

7.  Teacher Dashboard — UX & Components

Teacher Dashboard คือ 'Enterprise Killer Feature' — สิ่งที่ทำให้โรงเรียนเลือก HSK AI Coach แทนที่จะซื้อเครื่องมือทั่วไป

7.1 Dashboard Layout
// Teacher Dashboard: apps/admin/app/dashboard/class/[id]/page.tsx

Layout:
┌─────────────────────────────────────────────────────────┐
│ Class Overview Bar │
│ [Class Average: 68.4] [Active Students: 24/28] │
│ [Avg Growth: +2.8/wk] [At-Risk: 3] [Predicted Pass: 89%]│
├─────────────────────┬───────────────────────────────────┤
│ 🚨 At-Risk Students│ 📈 Skill Heatmap │
│ (sorted by risk) │ (skill × student matrix) │
│ │ │
├─────────────────────┴───────────────────────────────────┤
│ 📊 Student Growth Table │
│ (sortable: name / growth / mastery / risk / last seen) │
├─────────────────────────────────────────────────────────┤
│ 🏆 Top Improving │ 🔻 Needs Attention │
│ (top 5 this week) │ (bottom 5 this week) │
└─────────────────────────────────────────────────────────┘

7.2 Skill Heatmap (Signature Visual)
Heatmap เป็น visual สำคัญที่สุดของ Teacher Dashboard — teacher เห็นทันทีว่า 'skill ไหนชั้นนี้อ่อน'

Wang F.
Li M.
Chen H.
Zhang Y.
Class Avg
Vocabulary
82
71
88
65
76
Grammar Particles
41
38
55
29
41 🔴
Reading Comp.
78
82
75
70
76
Writing Accuracy
65
58
72
48
61
Tone Correctness
70
65
80
55
68

ในระบบจริง ตาราง heatmap จะแสดงด้วยสีตาม mastery level: สีเขียว (≥80) → สีเหลือง (60–79) → สีแดง (<60)

7.3 Smart Alert System
Trigger
Threshold
Alert Type
Recipient
Growth stagnation
LGR < 0.5 for 14d
In-app + Email
Teacher
Retention drop

> 15% decline
> In-app
> Teacher
> Error spike
> 30% increase
> In-app
> Teacher
> Risk index critical
> 0.7
> In-app + Email
> Teacher + Admin
> No login streak
> 7 days
> In-app
> Teacher
> Predicted score drop
> 10 points/week
> In-app + Email
> Teacher
> Class avg below target
> < 60%
> Weekly report
> Admin

Alert frequency: นักเรียน 1 คน รับ alert ได้ไม่เกิน 1 ครั้ง/24 ชั่วโมง เพื่อป้องกัน notification fatigue

8.  Implementation Plan

4–6 wk
Total Duration
Solo developer
Phase 2
Dependency
must be complete
7
New Tables
Prisma migration
9
New Endpoints
Insight API

8.1 Week-by-Week Breakdown
Week
Focus
Deliverable
1
Schema + Batch Infrastructure
7 tables migrated, BullMQ scheduler ทำงาน, Feature extractor ทดสอบ
2
Skill Engine + Growth Metrics
Step 1–4 batch pipeline ทำงานกับ data จริง, unit tests ผ่าน
3
Risk + Prediction + Alerts
Step 5–9 ครบ, teacher alert ส่ง email ได้, manual trigger ได้
4
Insight API + Caching
ทุก endpoint ใน Section 6.1 ทำงาน, Redis cache hit > 90%
5
Teacher Dashboard v1
Heatmap + At-risk list + Growth table ใน admin portal
6
Testing + QA + Documentation
Integration tests ผ่าน, API documented, batch error handling robust

8.2 Definition of Done — Phase 2.5
Test Case
Expected Result
Batch runs nightly
00:00 UTC+7 → batch completes ภายใน 2 ชั่วโมง, ไม่มี failed jobs
Student insight API
GET /students/:id/insight → response < 150ms, ข้อมูล fresh < 24h
Growth rate accuracy
LGR คำนวณถูกต้อง: test user ที่คะแนนเพิ่ม 5 คะแนน/สัปดาห์ → LGR ≈ 5
Risk alert trigger
User ที่ไม่ login 7 วัน + declining → risk > 0.7 → teacher ได้ alert
Teacher dashboard load
Class dashboard (28 students) โหลด < 2s
Skill heatmap
ครูเห็น skill matrix ของทุกนักเรียนในชั้น color-coded ถูกต้อง
Exam prediction
User ที่ mastery = 70 ทุก skill → predicted HSK4 ≈ 210 (±15)
Zero regression
Phase 1–2 features ทุกอย่างยังทำงานได้ปกติ

9.  Business Impact & Enterprise Positioning

💰 Why This Unlocks Enterprise Sales
B2B buyers (โรงเรียน, สถาบันภาษา, HR departments) ไม่ซื้อ 'AI grader' — พวกเขาซื้อ 'outcomes' และ 'accountability' Learning Intelligence Layer เปลี่ยน pitch จาก 'เราให้ feedback ดี' เป็น 'เราพิสูจน์ได้ว่านักเรียนเก่งขึ้นกี่ % ใน X สัปดาห์' นั่นคือ value proposition ที่ justify enterprise pricing

9.1 New Revenue Streams ที่ Phase 2.5 Enable
Product
Target Buyer
Price Range
Enabled by
Teacher Analytics Add-on
School / Institute
$50–200/teacher/mo
Teacher Dashboard + Alerts
Student Progress Reports
Parent / Student
$5–15/student/mo
Insight API + Exam Prediction
Outcome-based Pricing
Enterprise contract
Per 'pass rate'
Exam Prediction accuracy
Class Analytics License
Language school
$500–2K/class/yr
Heatmap + Class Dashboard
API Access (B2B2C)
EdTech platform
Per API call
Insight API as product

9.2 Competitive Moat
Learning Intelligence สร้าง switching cost ที่แข็งแกร่ง — ยิ่งใช้ระบบนาน data ก็ยิ่ง rich ทำให้ prediction accuracy ดีขึ้น และนักเรียนยิ่งไม่อยากย้ายไปใช้ระบบอื่นที่ต้องเริ่มต้น knowledge model ใหม่

Competitor Type
ทำได้
HSK AI Coach Phase 2.5 เพิ่ม
Generic AI Essay Grader
คะแนน + feedback

- Growth trend, Skill mastery, Prediction
  LMS (Moodle, Canvas)
  ส่งงาน, เก็บคะแนน
- AI analysis, Intelligence, Insights
  Duolingo / HelloChinese
  gamification, streak
- Deep writing analysis, Enterprise tools
  Human tutor tracking
  manual assessment
- Scale (1 teacher → 100 students), Automation

  9.3 New SLA Metrics สำหรับ Enterprise Contracts
  Metric
  Target
  Measurement
  Insight API response time
  < 150ms
  p95 latency
  Batch completion time
  < 2 hours
  00:00–02:00 window
  Batch success rate

  > 99.5%
  > jobs with no error
  > Skill classification precision
  > 85%
  > manual validation sample
  > Exam prediction accuracy
  > 75%
  > vs actual exam results
  > Risk alert precision
  > 70%
  > alerts that led to real intervention
  > Data freshness
  > < 24 hours
  > time since last batch

10. Updated Full Roadmap (with Phase 2.5)

Phase
ชื่อ
Core Output
Solo Timeline
Team Timeline
Phase 1
Foundation — Monorepo + Separated Backend
Hono API + JWT Auth
6–8 wk
3–4 wk
Phase 2
Core Platform — AI Pipeline + Redis Cache
Cached AI + BullMQ
6–8 wk
3–4 wk
Phase 2.5
Learning Intelligence Platform ⭐ NEW
Insight API + Teacher Dashboard
4–6 wk
2–3 wk
Phase 3
Multi-tenant B2B — Organization Layer
Org + RBAC + Admin portal
8–10 wk
4–5 wk
Phase 4
Scale & Resilience — HA + Observability
99.9% SLA + Monitoring
6–8 wk
3–4 wk
Phase 5
Enterprise Compliance — PDPA + SOC2
Audit logs + Trust page
6–8 wk
3–4 wk
รวม
Full Enterprise-Grade Learning Intelligence Platform
EdTech Enterprise Moat
~10–13 เดือน
~4–5 เดือน

⭐ Phase 2.5 คือ Enterprise Differentiation ที่แท้จริง
Infrastructure ดี (Phase 1–2) + Compliance (Phase 3–5) เป็นสิ่งที่ competitor สามารถ replicate ได้ แต่ Learning Intelligence ที่ built จาก proprietary data ของ users ตัวเอง — knowledge models, growth patterns, skill taxonomies ที่ trained บน HSK-specific data — คือ moat ที่แท้จริงที่ยากจะ copy

📌 Next Actions

Complete Phase 1 (Backend API) + Phase 2 (AI Pipeline + Redis) ก่อน — Phase 2.5 ต้องการทั้งสอง
เริ่ม Phase 2.5 ด้วย Prisma schema migration (Section 3) — ไม่กระทบ production
Build Feature Extractor ก่อน — เป็น foundation ที่ steps อื่นทั้งหมดต้องการ
Run batch manually ครั้งแรกกับ seed data เพื่อ validate formulas ก่อน schedule production
Teacher Dashboard v1 ไม่ต้องสวย — ต้องการแค่ heatmap + at-risk list สำหรับ enterprise demo

🏛
Enterprise Governance Supplement
HSK AI Coach — Sections 13–18
Addendum to Enterprise Architecture Roadmap v1.0

Addendum to
Enterprise Architecture Roadmap v1.0 + Phase 2.5 Learning Intelligence
Sections
13 Data Governance · 14 Disaster Recovery · 15 AI Risk · 16 Customer Success · 17 Learning Intelligence · 18 Governance Controls
Classification
Confidential — Internal Use Only
Purpose
Enterprise governance completeness — ครอบคลุม SOC2 audit, education procurement, technical due diligence

💡 ทำไมต้องมี Sections 13–18
Infrastructure ดี (Phase 1–2) + Compliance framework (Phase 3–5) เป็นจุดเริ่มต้น แต่ enterprise procurement จะถามลึกกว่านั้น: ข้อมูลถูก classify ยังไง? ถ้าระบบ crash แล้วทำอะไร? AI ให้คะแนนผิดแล้วรับผิดชอบยังไง? ทีมใครดูแลอะไร? — Section 13–18 ตอบคำถามเหล่านี้ครบ

Governance Sections Overview

Section
หัวข้อ
Map ไป Phase
Enterprise Value
13
Data Governance Model
Phase 4 + 5
Data classification, lineage, AI vendor DPA
14
Disaster Recovery Playbook
Phase 4
RTO/RPO, runbooks, DR drill schedule
15
AI Model Risk Management
Phase 2 + 4
Hallucination detection, prompt defense, drift monitoring
16
Customer Success & Support
Phase 3 + 4
Support SLA, status page, incident comms
17
Learning Intelligence Architecture
Phase 3+
Knowledge graph, weakness detection, teacher dashboard
18
Governance Controls
Phase 4 + 5
Ownership matrix, evidence retention, security severity

Updated Table
Content Added
Section 2.3
Enterprise Target Architecture — เพิ่ม 6 layers: Data Governance, DR, AI Safety, Customer Success, Learning Intelligence, Governance Controls
Section 11.1
Risk Register — เพิ่ม 7 risks ใหม่ ครอบคลุม governance gaps

Section 13 Data Governance Model
Data Classification · Lineage · Access Policy · AI Vendor DPA

🗺 Phase Mapping: Phase 4: Data classification tags, access logging · Phase 5: Data lineage docs, DPA templates, training data policy

Enterprise audit จะถามเรื่อง data classification เป็นอย่างแรก — ถ้าไม่มี = ไม่ผ่าน procurement สิ่งที่ต้องการคือ: รู้ว่าข้อมูลอะไรอยู่ที่ไหน, ใครเข้าถึงได้, และถ้าเกิด breach จะรู้ว่า scope ครอบคลุมอะไร

13.1 Data Classification Tiers
Tier
Classification
ตัวอย่างข้อมูล
Encryption
Retention
Access
Tier 1Critical PII
🔴 RESTRICTED
ชื่อ-นามสกุล, email, password hash, payment info
AES-256 at rest + TLS in transit
ตาม PDPA (ลบเมื่อ user ขอ)
RBAC — Admin + Owner only
Tier 2Learning Data
🟠 CONFIDENTIAL
ผลวิเคราะห์ AI, คะแนนสอบ, ประวัติการเรียน
AES-256 at rest
2 ปี (configurable per org)
User + Teacher + Org Admin
Tier 3Analytics
🟡 INTERNAL
Click events, session duration, feature usage
TLS in transit
90 วัน (aggregate แล้วลบ raw)
Analytics team + Org Admin
Tier 4System Logs
🟡 INTERNAL
API logs, error logs, performance metrics
TLS in transit
90 วัน
DevOps + Super Admin
Tier 5Public
🟢 PUBLIC
HSK vocabulary lists, marketing content
N/A
Indefinite
Everyone

13.2 Data Lineage Tracking
// Data Flow Diagram
User Input (Tier 2) → API Gateway (Logged) → AI Service (Claude/DeepSeek) → AI Response (Tier 2)
AI Response → Redis Cache (TTL 7d) + PostgreSQL (Tier 2, 2yr retention)
PostgreSQL → Analytics Aggregate (Tier 3, 90d)
API Gateway → Audit Log (Tier 4, 90d)

ทุก data point มี origin tag: user_input / ai_generated / system_derived
Data flow documentation: ระบุว่า data ไหลจากไหนไปไหน ใครมีสิทธิ์เข้าถึง
Third-party data sharing: Claude API ส่ง user input → ต้อง document ใน DPA

13.3 Data Access Justification Policy
Action
Justification Required
Approval
Logged
View own data
ไม่ต้อง
Self
✅
View student data (Teacher)
ต้อง — assigned students only
Automatic (RBAC)
✅
Export org data (Admin)
ต้อง — business justification
Org Admin self-approve
✅
Access cross-org data
ต้อง — written justification
Super Admin approval
✅
Bulk data export
ต้อง — compliance/legal reason
Super Admin + 2FA
✅

13.4 AI Model Training Data Governance
Policy
Rule
User data สำหรับ train
ไม่เคย — ไม่ส่ง user data ให้ AI vendors สำหรับ training
Prompt/completion logging
Log prompt structure (ไม่ log user content) สำหรับ debugging
AI vendor DPA
ต้องมี DPA กับ Anthropic + DeepSeek ระบุ data handling policy
Opt-out mechanism
User/Org สามารถ opt-out จาก analytics aggregation ได้

13.5 Definition of Done
✅ Check
Evidence Required
Data classification
ทุก table ใน DB มี classification tag documented
Access justification
Cross-org access ต้อง approval workflow — tested end-to-end
AI vendor DPA
Signed DPA กับ Anthropic และ DeepSeek
Lineage diagram
Auto-generated data flow diagram จาก code annotations

Section 14 Disaster Recovery Playbook
RTO/RPO · Failover Drills · Incident Runbooks · Backup Strategy

🗺 Phase Mapping: Phase 4: DR runbooks, failover automation, backup strategy, drill schedule

SOC2 auditor จะดู DR playbook ละเอียดมาก — ต้องเป็นเอกสาร step-by-step ที่ใครก็ execute ได้ ไม่ใช่แค่ 'เรามี backup' แต่ต้องพิสูจน์ว่า backup ใช้งานได้จริงด้วย drill

14.1 RTO / RPO Targets
Component
RPO (max data loss)
RTO (max downtime)
Recovery Method
PostgreSQL (Supabase)
5 นาที
30 นาที
Point-in-time recovery (PITR)
Redis Cache
0 (ephemeral OK)
5 นาที
Rebuild from DB
API Backend
0 (stateless)
10 นาที
Redeploy from Git (Railway)
Frontend
0 (stateless)
5 นาที
Vercel instant rollback
BullMQ Jobs
0 (persistent in Redis)
15 นาที
Redis restart + retry
Audit Logs
0
30 นาที
Supabase PITR

14.2 Failover Simulation Schedule
Drill
Frequency
Participants
Duration
API server kill & restart
Monthly
DevOps
30 นาที
Database failover to backup
Quarterly
Backend + DevOps
2 ชั่วโมง
Redis flush — cache rebuild
Monthly
Backend
1 ชั่วโมง
Full DR simulation (all systems)
Semi-annually
All team
Half day
Tabletop exercise (walkthrough)
Quarterly
All team
1 ชั่วโมง

14.3 Incident Runbooks
Scenario A: Database Down
Step
Action
Owner
1 DETECT
Supabase health check fails / PagerDuty alert fires
System (auto)
2 ASSESS
Check Supabase status page + dashboard
On-call engineer
3 FAILOVER
If Supabase outage: switch to read replica (if available)
Backend Lead
4 NOTIFY
Post to #incident Slack, update status.hsk-ai-coach.com
On-call engineer
5 RECOVER
Wait for Supabase recovery OR restore from latest backup
DevOps
6 VERIFY
Run smoke tests: health check + sample queries
QA / Backend
7 POSTMORTEM
Document timeline, root cause, action items within 48h
Engineering Lead

Scenario B: API Backend Crash Loop
Step
Action
Owner
1 DETECT
Railway health check fails, Cloudflare 502 errors spike
System (auto)
2 ASSESS
Check Railway logs for crash reason
DevOps
3 ROLLBACK
Railway instant rollback to last stable deploy
DevOps
4 NOTIFY
Update status page, notify affected enterprise orgs
Customer Success
5 FIX
Debug on staging, deploy fix through CI/CD
Backend Lead
6 VERIFY
Health check + integration test suite
QA
7 POSTMORTEM
Document within 48h
Engineering Lead

Scenario C: AI Provider Complete Outage
Step
Action
Owner
1 DETECT
AI fallback chain exhausted, all providers return errors
System (auto)
2 ASSESS
Check Anthropic + DeepSeek status pages
Backend Lead
3 CACHE
Serve cached results where available
System (auto)
4 DEGRADE
Show 'AI temporarily unavailable' UI, enable offline features
Frontend
5 NOTIFY
Proactive notification to enterprise customers
Customer Success
6 RECOVER
Monitor provider recovery, auto-resume when healthy
System (auto)
7 POSTMORTEM
Review fallback chain effectiveness
Engineering Lead

Scenario D: Data Corruption / Accidental Deletion
Step
Action
Owner
1 DETECT
User report OR automated data integrity check
System / User
2 FREEZE
Immediately stop writes to affected tables
Backend Lead
3 ASSESS
Determine scope: which records, which time window
Backend + DPO
4 RESTORE
Supabase PITR to timestamp before corruption
DevOps
5 REPLAY
Re-apply valid transactions from audit logs
Backend Lead
6 VERIFY
Data integrity checks + affected user verification
QA + Backend
7 NOTIFY
Notify affected users/orgs about data restoration
Customer Success + Legal
8 POSTMORTEM
Root cause + prevention measures
Engineering Lead

14.4 Backup Strategy
Data
Method
Frequency
Retention
Location
PostgreSQL
Supabase PITR (auto)
Continuous
7 วัน (Pro)
Supabase infra
PostgreSQL
Manual pg_dump export
Daily
30 วัน
Cloud Storage (encrypted)
Redis
RDB snapshot + AOF
Hourly
24 ชั่วโมง
Upstash managed
Audit Logs
Separate backup stream
Daily
1 ปี
Cloud Storage (immutable)
App Code
Git repository
Every push
Indefinite
GitHub
Secrets/Config
Encrypted export
Weekly
90 วัน
Offline encrypted storage

14.5 Definition of Done
✅ Check
Evidence Required
RTO met
DR drill: system recovered within RTO target per component
RPO met
Restored data matches expected state (loss < RPO threshold)
Runbooks tested
Each scenario (A–D) executed at least 1x in staging
Backup verified
Monthly: backup restoration test passes, data integrity confirmed

Section 15 AI Model Risk Management
Hallucination Monitoring · Output Safety · Prompt Defense · Drift Monitoring

🗺 Phase Mapping: Phase 2: Output validation (Zod), prompt injection defense, basic hallucination check · Phase 4: Full drift monitoring, explainability, quarterly audits

Education sector ต้องการ explainability — ถ้า AI ให้คะแนนผิด ต้องอธิบายได้ว่าทำไม โรงเรียนและผู้ปกครองจะถามว่า 'ทำไม AI ถึงบอกว่าลูกฉันอ่อน grammar?' ระบบต้องตอบได้

15.1 Hallucination Monitoring
Metric
Detection Method
Threshold
Action
Score consistency
เปรียบเทียบ AI score กับ reference answer
Deviation > 20% จาก expected range
Flag for human review
Character recognition
ตรวจจับ characters ที่ไม่อยู่ใน HSK vocab list
Any non-HSK character in HSK analysis
Auto-correct หรือ flag
Grammar rule accuracy
Cross-check AI grammar suggestions กับ rule DB
Accuracy < 90% per batch
Alert + model switch
Factual grounding
ตรวจจับ AI fabricated pinyin/meanings
Any mismatch กับ HSK dictionary
Block response + fallback

// Automated Validation Pipeline
AI Response → Validation Layer → [Pass] → Return to User
→ [Fail] → Flag + Fallback Response + Alert

15.2 Output Safety Policy
Rule
Implementation
Content filter
AI output ต้องไม่มี inappropriate content (education context)
Age-appropriate
ถ้า org ตั้ง student_age < 18 → strict content filtering
Cultural sensitivity
ไม่มี content ที่ offensive ต่อ Chinese/Thai/international culture
Bias detection
Monthly audit: ตรวจว่า AI ให้คะแนนเท่าเทียม regardless of input style
Score calibration
Quarterly: human expert review sample AI scores vs human grading

15.3 Prompt Injection Defense
Layer
Defense Implementation
Input sanitization
Strip system-prompt-like patterns จาก user input ก่อนส่ง AI
Prompt isolation
User input อยู่ใน delimited block <user_input>...</user_input>
Output validation
AI response ต้อง match expected JSON schema (Zod validation)
Rate limiting
ป้องกัน brute-force prompt injection attempts
Monitoring
Log suspicious patterns: 'ignore previous', 'system:', etc. → alert

15.4 Model Performance Drift Monitoring
Metric
Baseline
Check Frequency
Alert Threshold
Average score (writing)
Established after 1K analyses
Daily
±15% deviation from 30-day mean
Response latency
p95 baseline per model
Real-time

> 2x baseline
> JSON parse failure rate
> < 1%
> Daily
> 3%
> User satisfaction (thumbs)
> 80% positive
> Weekly
> < 70% positive
> Cache hit quality
> No complaints on cached results
> Weekly
> 2 complaints/week

15.5 Explainability Policy (Education Sector)
ทุก AI analysis ต้องมี transparency section — โรงเรียนต้องรู้ว่า AI ใช้ criteria อะไร และมั่นใจแค่ไหน:

// Every AI analysis response includes:
{
"analysis": { ... },
"explainability": {
"model_used": "claude-3.5-sonnet",
"scoring_criteria": ["grammar", "vocabulary", "coherence", "fluency"],
"confidence_score": 0.87,
"scoring_rubric_version": "v2.1",
"human_review_recommended": false,
"limitations_note": "AI scoring is indicative, not definitive. Consult teacher for official grading."
}
}

15.6 Definition of Done
✅ Check
Evidence Required
Hallucination detection
Auto-flag rate < 2% of all responses, validated with test suite
Prompt injection
100% of known injection patterns blocked (test suite of 50+ patterns)
Drift monitoring
Dashboard: daily model performance metrics visible to team
Explainability
Every AI response includes explainability metadata (validated by Zod schema)

Section 16 Customer Success & Support Architecture
Support SLA · Ticket Routing · Incident Comms · Status Page

🗺 Phase Mapping: Phase 3: Basic support email, ticket tracking, status page · Phase 4: SLA enforcement, auto-classification, PagerDuty integration

Enterprise SaaS ที่ไม่มี support infrastructure = ไม่ผ่าน procurement, trust page incomplete นี่คือ operational layer ที่ทำให้ customer รู้สึกว่าจ่ายเงินแล้วคุ้ม

16.1 Support SLA Tiers
Priority
Plan
Response Time
Resolution Time
Channels
P0 — System Down
All plans
15 นาที
2 ชั่วโมง
PagerDuty → Phone/Slack
P1 — Major Feature Broken
Enterprise
1 ชั่วโมง
8 ชั่วโมง
Email + Slack dedicated
P1 — Major Feature Broken
Pro
4 ชั่วโมง
24 ชั่วโมง
Email
P2 — Minor Issue
Enterprise
4 ชั่วโมง
48 ชั่วโมง
Email + Slack
P2 — Minor Issue
Pro
24 ชั่วโมง
5 business days
Email
P3 — Feature Request
All plans
48 ชั่วโมง
Roadmap review
Email + Portal

16.2 Ticket Auto-Classification
// Auto-classification triggers
P0: Health check failure, > 5% error rate, DB connection lost, auth service down
P1: AI service degraded (> 30s latency), auth failures > 5/min, billing errors
P2: UI bugs, slow performance (< 2x SLA), feature incomplete
P3: Feature request, enhancement, general inquiry

// Routing flow
Incoming Ticket → Auto-classify Priority
→ P0: PagerDuty On-call Engineer → #incident Slack
→ P1 (Enterprise): Dedicated CSM → Email + Slack
→ P1 (Pro): Support Queue → Email Response
→ P2/P3: Support Queue FIFO → Email Response

16.3 Incident Communication Protocol
Time
Action
Owner
Channel
T+0
Alert fires OR user report
System / User
PagerDuty + Slack
T+5m
Acknowledge incident, incident commander assigned
On-call engineer
Status page: 'Investigating'
T+15m
Initial assessment posted
On-call engineer
Slack #incident + Status page
T+30m
Enterprise customers notified proactively
Customer Success
Direct email/Slack
Resolution
Fix deployed and verified
Engineering
Status page: 'Resolved'
T+48h
Postmortem published
Engineering Lead
Internal + shared with enterprise

16.4 Status Page Automation
Technology: Betteruptime.com (free tier) หรือ Instatus → status.hsk-ai-coach.com

Component Monitored
Check Type
Frequency
Auto-update Rule
API Backend (Railway)
HTTP health check
30 วินาที
3 failures → 'Degraded'
Frontend (Vercel)
HTTP response check
1 นาที
2 failures → 'Degraded'
AI Services (Claude)
API ping
5 นาที
2 failures → 'AI Degraded'
Database (Supabase)
Connection check
1 นาที
2 failures → 'Degraded'
Redis (Upstash)
Ping
1 นาที
3 failures → 'Degraded'
Background Jobs
Queue depth check
5 นาที
Depth > 1K → 'Degraded'

16.5 Customer Success Program (Enterprise)
Activity
Frequency
Deliverable
Onboarding kickoff
Day 1
Setup guide + assigned CSM + integration checklist
Health check call
Monthly
Usage report + optimization tips + adoption metrics
QBR (Quarterly Business Review)
Quarterly
ROI report + feature roadmap preview + renewal forecast
Renewal discussion
60 days before expiry
Renewal proposal + upsell options
NPS survey
Semi-annually
NPS score + action plan for improvement

16.6 Definition of Done
✅ Check
Evidence Required
Status page
status.hsk-ai-coach.com live, auto-updating with correct component status
P0 response
Simulated P0 incident → acknowledged within 15 min
Ticket routing
Auto-classify test: 10 sample tickets correctly routed to correct tier
Enterprise CSM
Onboarding playbook documented + tested with 1 pilot org

Section 17 Learning Intelligence Architecture
Knowledge Graph · Weakness Detection · Adaptive Recommendations · Teacher Dashboard

🗺 Phase Mapping: Phase 2: Data collection instrumentation · Phase 3: Basic analytics, teacher dashboard · Phase 4+: Predicted scores, adaptive recommendations, cross-org benchmarking

⭐ Enterprise Differentiator
นี่คือสิ่งที่ทำให้ HSK AI Coach ไม่ใช่แค่ 'AI grading tool' แต่เป็น education intelligence system — competitive moat ที่คู่แข่งลอกได้ยาก เพราะ knowledge models ถูก build จาก proprietary usage data ที่สะสมตามเวลา

17.1 Learning Intelligence Architecture
Data Collection Layer:
Writing Analysis · Reading Scores · Exercise Performance
Mock Exam Results · Flashcard Review Patterns · Session Engagement
↓
Learning Analytics Engine:
Knowledge Graph Builder · Weakness Detection Algorithm
Progress Trajectory Model · Spaced Repetition Optimizer · Cohort Comparison
↓
Intelligence Output:
Personal Learning Path · Teacher Dashboard · Parent Reports
Org-level Insights · Content Recommendation Engine

17.2 Core Analytics Components
17.2.1 Knowledge Graph per Student
// Student Knowledge State (stored in PostgreSQL)
{
"student*id": "usr_123",
"hsk_level": 4,
"knowledge_nodes": {
"grammar*把*construction": { "mastery": 0.72, "last_tested": "2026-02-20", "weak_areas": ["word_order"] },
"vocab_business_terms": { "mastery": 0.45, "last_tested": "2026-02-18", "weak_areas": ["tone_marks"] },
"reading_long_passages": { "mastery": 0.88, "last_tested": "2026-02-25", "weak_areas": [] }
},
"recommended_focus": ["vocab_business_terms", "grammar*把\_construction"],
"predicted_exam_score": { "hsk4": 245, "confidence": 0.78 }
}

17.2.2 Weakness Detection Algorithm
Input Data
Analysis
Output
Writing scores (4D: grammar, vocab, coherence, fluency)
ถ้า dimension ใด < 60% consistently (3+ analyses)
Flag as weak area
Exercise errors
Pattern matching: ผิดประเภทเดียวกัน > 3 ครั้ง
Identify error pattern
Mock exam sections
Section scores below HSK pass threshold
Priority study areas
Time-on-task
Sections ที่ใช้เวลานานผิดปกติ
Difficulty indicators

17.2.3 Adaptive Content Recommendations
// Recommendation Logic
IF student.weakness = 'grammar\_把\_construction'
AND student.mastery < 0.6
AND days_since_last_practice > 3
THEN recommend:

1. Exercise: 把\_sentence_patterns (difficulty: graduated)
2. Writing prompt: 把\_usage_in_context
3. Flashcard deck: 把\_example_sentences

17.3 Teacher & Organization Dashboards
For Teachers:
Widget
Data Source
Insight
Class skill heatmap
Knowledge graphs aggregated
ดู weak areas ของทั้ง class ใน 1 view
Student ranking
Mastery scores + LGR
Top/bottom performers พร้อม trends
Predicted pass rates
Trajectory model
คาดการณ์ % pass rate for upcoming HSK exam
Intervention alerts
Risk index
Auto-alert เมื่อ student struggling > 2 สัปดาห์

For Organizations:
Widget
Data Source
Insight
Overall progress
All students aggregated
ROI: average improvement over time
Cost per improvement
AI usage + learning outcome
ค่า AI cost ต่อ 1 point improvement
Engagement metrics
Session data
ใคร active, ใครไม่ active — risk of churn
Benchmark comparison
Cross-org anonymized (opt-in)
เทียบ org ตัวเองกับ platform average

17.4 Spaced Repetition Intelligence
Feature
Implementation
SM-2+ algorithm
Modified SuperMemo algorithm ใช้ HSK-specific review intervals
Cross-feature signal
ถ้า writing analysis ใช้ vocabulary ถูก → ลด flashcard review frequency
Difficulty calibration
Adjust difficulty ตาม actual error rate ไม่ใช่ fixed schedule
Group study patterns
ถ้าทั้ง class ผิดคำเดียวกัน 80% → flag เป็น 'commonly difficult' content

17.5 B2B Value Proposition
Feature
Value สำหรับ School / Org
Predicted HSK pass rate
โรงเรียนรู้ล่วงหน้าว่านักเรียนจะสอบผ่านไหม — proof of ROI
Auto intervention alerts
ตระหนักปัญหาก่อนที่นักเรียนจะสอบตก — prevent churn
Class weakness heatmap
อาจารย์ปรับหลักสูตรตาม data ไม่ใช่ gut feeling
ROI dashboard
องค์กรเห็นว่าเงินที่ลงทุนได้ผลจริง — justify renewal
Benchmark comparison
เทียบกับสถาบันอื่นทั่วประเทศ (opt-in, anonymized)

17.6 Implementation Timeline
Sub-phase
Timing
Deliverable
Data collection instrumentation
Phase 2 (alongside AI pipeline)
Event tracking for all learning actions
Basic analytics (per-student)
Phase 3 (alongside multi-tenant)
Weakness detection + progress tracking
Teacher dashboard v1
Phase 3 (admin portal)
Class heatmap + student ranking + alerts
Advanced intelligence
Phase 4+
Predicted scores, adaptive recommendations
Cross-org benchmarking
Phase 5
Anonymized comparison (opt-in orgs)

17.7 Definition of Done
✅ Check
Evidence Required
Knowledge graph
Student profile page shows mastery breakdown per HSK topic area
Weakness detection
Auto-flag accuracy > 80% (validated against teacher assessment on 50 students)
Teacher dashboard
Class heatmap renders with real student data, color-coded correctly
Predicted score
Predictions within ±15% of actual HSK score (validated with 50+ students)
Recommendations
Students who follow recommendations improve 20%+ faster vs control group

Section 18 Governance Controls
Control Ownership · Evidence Retention · Security Severity Scale · SEV-1 Protocol

🗺 Phase Mapping: Phase 4: Ownership matrix, security severity, evidence collection · Phase 5: Evidence retention enforced, SOC2 audit, SEV-1 drill

ส่วนสุดท้ายที่ทำให้ governance loop ครบสมบูรณ์ — SOC2 auditor จะถาม 3 เรื่องนี้แน่นอน: ใครรับผิดชอบอะไร, evidence เก็บไว้นานแค่ไหน, และถ้าเกิด security incident จะทำอะไร

18.1 Control Ownership Matrix
Control
Owner
Backup
Review Frequency
Data classification enforcement
Data Protection Officer
CTO
Quarterly
DR execution & drill
DevOps Lead
Backend Lead
After each drill
AI model safety & calibration
AI/ML Lead
Backend Lead
Monthly
Incident response coordination
Engineering Lead
DevOps Lead
After each incident
Access control & RBAC policy
Security Lead / CTO
Org Admin
Quarterly
Audit log integrity
DevOps Lead
CTO
Monthly
Compliance (PDPA/SOC2)
Data Protection Officer
Legal Counsel
Quarterly
Status page & SLA monitoring
DevOps Lead
Customer Success Mgr
Weekly
Learning analytics accuracy
Product Lead
AI/ML Lead
Monthly
Vendor security assessment
CTO
Data Protection Officer
Annually

หมายเหตุ: Owner = รับผิดชอบหลักในการ implement และ maintain · Backup = ทำหน้าที่แทนเมื่อ Owner ไม่อยู่

18.2 Evidence Retention Policy
Evidence Type
Retention
Storage
Immutable
DR drill reports
3 ปี
Cloud Storage (encrypted)
✅
Incident postmortems
5 ปี
Cloud Storage (encrypted)
✅
Audit logs (system)
3 ปี minimum
Supabase + Cloud Storage backup
✅
Penetration test reports
5 ปี
Offline encrypted storage
✅
Access review records
3 ปี
Document storage
✅
SOC2 evidence artifacts
5 ปี
Vanta/Drata or manual folder
✅
Data breach notification records
7 ปี (PDPA requirement)
Legal archive
✅
Change management records
3 ปี
GitHub + CI/CD logs
✅
Security training records
Duration of employment + 2 ปี
HR system
✅
Vendor DPA/contracts
Duration of contract + 3 ปี
Legal archive
✅

⚠️ Retention Rules
ทุก evidence ต้อง immutable — ไม่สามารถแก้ไขหรือลบได้โดยไม่มี audit trail · Auto-delete policy: evidence ที่เกิน retention period → auto-archive → manual review → delete (ไม่ auto-delete ทันที) · Backup: ทุกประเภทต้องมี off-site backup อย่างน้อย 1 location

18.3 Security Incident Severity Scale
Severity
Definition
ตัวอย่าง
Response Time
Escalation
SEV-1Critical
Data breach, unauthorized PII access, system compromise
User data leaked, admin compromised, SQL injection successful
15 นาที
CTO + Legal + DPO immediately
SEV-2High
Unauthorized access attempt detected, vulnerability exploited
Brute force detected, XSS found in production
1 ชั่วโมง
Engineering Lead + CTO
SEV-3Medium
Policy violation, suspicious activity, failed security control
Expired SSL, failed access review, unjustified data access
4 ชั่วโมง
Security Lead
SEV-4Low
Security improvement needed, informational finding
Dependency with low-severity CVE, documentation gap
24 ชั่วโมง
DevOps + ticket created

18.4 SEV-1 Response Protocol (Data Breach)
นี่คือ step-by-step ที่ต้องทำเมื่อเกิด data breach — ต้องมีเป็น document ก่อน SOC2 audit:

Time
Action
Owner
T+0
Incident detected (automated alert or user report)
System / Security Lead
T+15m
Incident commander assigned (CTO or designated delegate)
CTO
T+30m
Contain: isolate affected systems, revoke compromised credentials
DevOps + Backend Lead
T+1h
Assess: determine scope (what data affected, how many users)
Backend + DPO
T+2h
Legal consultation: PDPA notification requirements assessed
Legal Counsel + DPO
T+24h
Internal incident report drafted
Engineering Lead
T+72h
PDPA Authority notified (required by law if PII affected)
DPO + Legal
T+72h
Affected users and organizations notified
Customer Success + Legal
T+7d
Full postmortem + remediation plan published internally
Engineering Lead + CTO
T+30d
All remediation actions completed and independently verified
Security Lead

18.5 Definition of Done
✅ Check
Evidence Required
Control ownership
Every control has documented owner + backup + review schedule
Evidence retention
Retention policy enforced with automated alerts for expiring evidence
Security severity
SEV-1 drill completed: full protocol executed within defined timeline
Evidence audit
All SOC2 Type I evidence collected, organized, and reviewed by DPO

11.1 Risk Register — Additional Entries

Supplement ต่อจาก Section 11 ในเอกสารหลัก — ความเสี่ยงเพิ่มเติมที่เกิดจาก governance layers ใหม่:

ความเสี่ยง
โอกาส
ผลกระทบ
Mitigation
Data classification ไม่ consistent ข้ามระบบ
กลาง
สูง
Automated schema validation + CI check ว่าทุก table มี classification tag
DR drill เปิดเผยปัญหาที่ไม่เคยรู้
สูง
กลาง
เริ่ม drill ใน staging ก่อน, ค่อยขยายไป production — expect surprises
AI hallucination ทำให้นักเรียนเรียนผิด
กลาง
สูง
Validation layer + disclaimer + teacher review flag + monthly calibration
Learning analytics ใช้ data ไม่พอในช่วงแรก
สูง
ต่ำ
Start with rule-based ก่อน, เพิ่ม ML เมื่อ data > 500 student-analyses
Support SLA ไม่ meet เมื่อ team เล็ก
สูง
กลาง
Automate P0 detection + response, manual เฉพาะ P1+ จนกว่าจะมี CSM
Control ownership ไม่ชัดเจนเมื่อ team เปลี่ยน
กลาง
กลาง
Quarterly ownership review + documented handoff process เมื่อ role เปลี่ยน
Evidence สูญหายก่อน audit
ต่ำ
สูง
Automated backup + immutable storage + quarterly evidence completeness check

2.3 Enterprise Target Architecture — Additional Layers

Supplement ต่อจาก Section 2.2 — เพิ่ม 6 governance layers ที่สมบูรณ์แบบระบบ Enterprise:

Layer
Component
Technology
Data Governance
Classification, Lineage, Access Policy, AI vendor DPA
Custom tags + Audit service + DPA docs
Disaster Recovery
Backup, Failover automation, Step-by-step Runbooks
Supabase PITR + Cloud Storage + Runbook docs
AI Safety
Hallucination check, Prompt defense, Drift monitoring
Zod validation + Custom monitoring + Dashboards
Customer Success
Support SLA tiers, Status page, Incident comms protocol
Betteruptime + PagerDuty + Linear/GitHub Issues
Learning Intelligence
Knowledge graph, Weakness detection, Adaptive recommendations
Custom analytics engine + PostgreSQL aggregations
Governance Controls
Ownership matrix, Evidence retention, Security severity scale
Policy docs + Vanta/Drata + Automated alerts

🏁 Roadmap Completeness Checklist

Enterprise Architecture Roadmap v1.0 (Phase 1–5) ✅
Phase 2.5 Learning Intelligence Platform ✅
Section 13: Data Governance Model ✅
Section 14: Disaster Recovery Playbook ✅
Section 15: AI Model Risk Management ✅
Section 16: Customer Success & Support Architecture ✅
Section 17: Learning Intelligence Architecture ✅
Section 18: Governance Controls ✅

ด้วยเอกสารทั้งหมดนี้ HSK AI Coach Roadmap ครอบคลุมทุก enterprise governance domain — พร้อมผ่าน enterprise security review, technical due diligence, SOC2 audit, และ education procurement screening
