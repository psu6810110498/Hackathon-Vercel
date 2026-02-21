# แผนแบ่งงาน — คุณ + เพื่อน

แนะนำ 2 แบบ: แบ่งตาม **Feature** หรือแบ่งตาม **Layer** เลือกแบบที่เหมาะกับความถนัดของทั้งคู่

---

## แบบ A: แบ่งตาม Feature (เหมาะถ้าทั้งคู่ทำได้ทั้ง Front + Back)

| คน | หน้าที่ | โฟลเดอร์/ไฟล์หลัก | งานตัวอย่าง |
|----|--------|-------------------|-------------|
| **คนที่ 1** | **โฟลว์การเขียน (Writing)** | `app/(dashboard)/page.tsx` (โหมด Writing), `components/features/writing/*`, `app/api/analyze/route.ts`, prompt การเขียนใน `lib/ai/prompts.ts` | ปรับ UI ฟอร์มเขียน, แก้ prompt วิเคราะห์เรียงความ, เพิ่มชนิด error / คะแนน |
| **คนที่ 2** | **โฟลว์การอ่าน (Reading)** | `app/(dashboard)/page.tsx` (โหมด Reading), `components/features/reading/*`, `app/api/reading/route.ts`, prompt การอ่านใน `lib/ai/prompts.ts` | ปรับ UI ฟอร์มอ่าน, แก้ prompt คำศัพท์/คำถาม, ปรับ VocabCard / QuestionCard |

**ร่วมกัน:** หน้า Dashboard (สลับโหมด), `types/analysis.ts`, `lib/ai/analyzer.ts` — ตกลง interface แล้วค่อยแยก implement กัน

---

## แบบ B: แบ่งตาม Layer (เหมาะถ้าคนหนึ่งเน้น UI อีกคนเน้น Logic/API)

| คน | หน้าที่ | โฟลเดอร์/ไฟล์หลัก | งานตัวอย่าง |
|----|--------|-------------------|-------------|
| **คนที่ 1 — Frontend / UX** | UI, หน้า, component, theme | `app/**/*.tsx` (ยกเว้น api), `components/**/*` | หน้า Landing, Login, Dashboard, History, Profile, ปรับ theme/สี/ฟอนต์, ปรับ Navbar/Sidebar |
| **คนที่ 2 — Backend / API / Data** | API, DB, AI, Auth | `app/api/**/*`, `lib/**/*`, `prisma/*`, `types/*` | เพิ่ม/แก้ API, ปรับ Prisma schema, แก้ prompt และ analyzer, usage limit, CognitiveProfile |

**ร่วมกัน:** ตกลง API contract (request/response) กับ `types/` ก่อน แล้วแต่ละคนทำฝั่งตัวเอง

---

## กติการ่วม (ทั้งสองแบบ)

1. **Branch:** ทำงานบน branch แยก (เช่น `feature/writing-ui`, `feature/reading-api`) แล้วค่อย merge เข้า `main` หลัง review/ทดสอบ
2. **Types:** แก้ `types/*` ต้องบอกอีกฝ่าย เพราะกระทบทั้ง front และ back
3. **API contract:** แก้ request/response ของ `/api/analyze` หรือ `/api/reading` ต้องบอกอีกฝ่าย (ดู [API.md](API.md))
4. **Prompts:** แก้ `lib/ai/prompts.ts` ควรมี comment หรือ commit message บอกว่าเปลี่ยนอะไร (อีกฝ่ายอาจต้องปรับ parser ใน `analyzer.ts`)

---

## สิ่งที่ยังไม่มีในโปรเจกต์ (เลือกแบ่งกันทำต่อ)

| งาน | แนะนำให้ | หมายเหตุ |
|-----|----------|----------|
| หน้า Flashcard / SRS | คนที่รับผิดชอบ Reading หรือ Backend | ใช้ `lib/hsk/srs.ts` + model Flashcard |
| Premium / ชำระเงิน 199 บาท | Backend + หนึ่งคนทำ UI หน้า Profile | ต้องเลือกช่องทาง (Stripe/อื่น) |
| แสดง CognitiveProfile / weak patterns | Frontend + หนึ่งคนทำ API/query | มี schema + query ใน `lib/db/queries.ts` แล้ว |
| ปรับปรุง Error UI / Loading state | คนที่รับผิดชอบ Frontend | components/features/writing, reading |
| RAG / ใส่ hsk-rules ใน prompt | Backend | อ่าน `data/hsk-rules.json` ใน `lib/ai/prompts.ts` |

---

## สรุปสั้นๆ

- **แบบ A:** แบ่งตาม Feature (คน 1 = Writing, คน 2 = Reading) — ดีถ้าอยากให้แต่ละคน “ถือหนึ่งโฟลว์ครบตั้งแต่ UI ถึง API”
- **แบบ B:** แบ่งตาม Layer (คน 1 = Frontend, คน 2 = Backend) — ดีถ้าคนหนึ่งชอบทำ UI อีกคนชอบทำ logic/DB/AI

เลือกแบบใดแบบหนึ่งแล้วตกลงกันว่าใครเป็น “คนที่ 1” / “คนที่ 2” แล้วค่อยแยก branch ตามตารางด้านบนได้เลย
