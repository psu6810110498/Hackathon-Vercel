# HSK AI Coach — สถาปัตยกรรมระบบ

## 1. System Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js 14  │────▶│   Supabase  │
│  (React)    │     │  App Router  │     │ (PostgreSQL) │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  NextAuth   │
                    │  (Session)  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │ /api/    │  │ /api/    │  │ /api/    │
       │ analyze  │  │ reading  │  │ usage    │
       └────┬─────┘  └────┬─────┘  └──────────┘
            │             │
            ▼             ▼
       ┌─────────────────────────┐
       │  lib/ai/analyzer.ts     │
       │  (Claude / DeepSeek)    │
       └─────────────────────────┘
```

## 2. Data Flow

1. **ผู้ใช้** เลือกโหมด (เขียน/อ่าน) → กรอกข้อความ + ระดับ HSK → กดวิเคราะห์
2. **Frontend** เรียก `POST /api/analyze` หรือ `POST /api/reading` พร้อม `text` / `passage` และ `hskLevel`
3. **API Route** ตรวจสอบ session → ตรวจสอบ usage limit (ฟรี 3 ครั้ง/วัน) → validate input → เรียก `analyzer`
4. **Analyzer** เรียก Claude กับ prompt ที่กำหนด → parse JSON → คืนผล
5. **API** บันทึกผลลง `Analysis` ใน DB → เพิ่ม `dailyUsage` → ส่งผลกลับ frontend
6. **Frontend** แสดงคะแนน, ข้อผิดพลาด, คำศัพท์, คำถาม ตามโหมด

## 3. AI Pipeline

- **Primary:** Claude (Anthropic) — ใช้วิเคราะห์ทั้ง Writing และ Reading
- **Secondary:** DeepSeek — (optional) สำหรับเสริมการวิเคราะห์ภาษาจีน
- **Prompts:** อยู่ที่ `lib/ai/prompts.ts` ทั้งหมด เพื่อให้ทีมแก้และ version ได้ง่าย
- **Output:** AI ถูกกำหนดให้ตอบเป็น JSON เท่านั้น เพื่อให้ parse และเก็บลง DB ได้

## 4. Database Schema (สรุป)

- **User:** บัญชี, แผน (FREE/PREMIUM), dailyUsage, lastUsageDate
- **Analysis:** ผลวิเคราะห์แต่ละครั้ง (mode, hskLevel, inputText, result JSON, score)
- **Account / Session / VerificationToken:** สำหรับ NextAuth (Google, Magic Link)

การ reset usage: ถ้า `lastUsageDate` ไม่ใช่วันนี้ (UTC) จะ reset `dailyUsage` เป็น 0 เมื่อมีการเช็คหรือวิเคราะห์

## 5. Future Scaling

- **Caching:** cache ผลวิเคราะห์ที่ input เดิม (hash ของ text + level) เพื่อลด API cost
- **Queue:** สำหรับ Premium อาจใช้ queue (เช่น Vercel Queue หรือ Redis) เพื่อจำกัด concurrency กับ Claude
- **RAG:** ใช้ `data/hsk-rules.json` หรือข้อมูลใน DB เป็น context เพิ่มใน prompt
- **Monitoring:** ใช้ Vercel Analytics และ log error ไป Sentry/Logtail
