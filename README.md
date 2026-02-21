# HSK AI Coach

แพลตฟอร์มเตรียมสอบ **HSK 4–6** ด้วย AI สำหรับนักเรียนไทย — วิเคราะห์การเขียนและบทความอ่าน พร้อมคำศัพท์และคำถามความเข้าใจ

## Features

- **การเขียน:** วิเคราะห์บทความภาษาจีน — คะแนน, ข้อผิดพลาด (ไวยากรณ์/คำศัพท์), สรุปและข้อเสนอแนะเป็นภาษาไทย
- **การอ่าน:** วิเคราะห์บทความ — รายการคำศัพท์ (พินอิน + ความหมาย) และคำถามแบบเลือกตอบ
- **Auth:** Google OAuth + Email Magic Link (Resend)
- **Usage:** แผนฟรี 3 ครั้ง/วัน, Premium 199 บาท/เดือน (ไม่จำกัด)

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Framework| Next.js 14 (App Router) |
| Language | TypeScript (strict)    |
| Styling  | Tailwind CSS + shadcn/ui |
| Auth     | NextAuth.js v5         |
| Database | Supabase (PostgreSQL)  |
| ORM      | Prisma                 |
| AI       | Claude (Anthropic), DeepSeek (optional) |
| Deploy   | Vercel                 |

## Quick Start

```bash
git clone https://github.com/psu6810110498/Hackathon-Vercel.git
cd Hackathon-Vercel
cp .env.example .env          # หรือ .env.local — แล้วกรอกค่า
npm install
npm run db:generate
npm run db:push
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

รายละเอียดติดตั้งและแก้ปัญหา: **[docs/SETUP.md](docs/SETUP.md)**  
เช็คก่อน Build (DB + Claude + DeepSeek): **[docs/BEFORE-BUILD.md](docs/BEFORE-BUILD.md)**

## Project Structure (สรุป)

- `app/` — App Router: (auth), (dashboard), api, layout, page
- `components/` — ui (shadcn), features (writing, reading, shared), layout
- `lib/` — ai (claude, deepseek, prompts, analyzer), db (prisma, queries), auth, utils
- `types/` — analysis, auth, database
- `prisma/` — schema, seed
- `docs/` — SETUP, ARCHITECTURE, API, PROMPTS

## Documentation

- [SETUP.md](docs/SETUP.md) — การติดตั้งและรัน
- [BEFORE-BUILD.md](docs/BEFORE-BUILD.md) — เช็คก่อน Build (DB + Claude + DeepSeek)
- [CONTRIBUTING.md](docs/CONTRIBUTING.md) — แนวทางสำหรับทีม (ก่อน push)
- [PRE-PUSH-CHECKLIST.md](docs/PRE-PUSH-CHECKLIST.md) — เช็คลิสต์ก่อน push
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — สถาปัตยกรรมและ data flow
- [API.md](docs/API.md) — API endpoints
- [PROMPTS.md](docs/PROMPTS.md) — คำอธิบาย AI prompts

## License

Private / Hackathon use.
