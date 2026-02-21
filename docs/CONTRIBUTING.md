# แนวทางสำหรับทีม (ก่อน Push)

## ก่อน Push / Merge

1. **รันให้ผ่านบนเครื่องตัวเอง**
   ```bash
   npm run lint
   npm run build
   ```
2. **อย่า commit ค่าลับ** — ใช้เฉพาะ `.env.example` เป็นเทมเพลต ไม่ใส่ API key / password จริง
3. **ตั้งค่า env เอง** — แต่ละคน copy `.env.example` → `.env` แล้วเติมค่าจริงในเครื่องตัวเอง

## โครงสร้างโค้ด (ที่ตกลงกันแล้ว)

- **Components:** PascalCase (เช่น `EssayInput.tsx`), อยู่ใต้ `components/` แยกเป็น ui / features / layout
- **API routes:** ตรวจ auth → ตรวจ usage → validate input → logic → return
- **Types:** อยู่ที่ `types/` ใช้ทั้งแอป
- **Prompts:** แก้ที่ `lib/ai/prompts.ts` ที่เดียว

## Branch / Commit

- ทำงานบน branch แยก (เช่น `feature/xxx` หรือ `fix/yyy`) แล้วค่อย merge เข้า `main`
- Commit message ให้สื่อว่าแก้อะไร (ภาษาไทยหรืออังกฤษได้)

## เอกสารที่ควรอ่านก่อนแก้

- [SETUP.md](SETUP.md) — ติดตั้งและรัน
- [ARCHITECTURE.md](ARCHITECTURE.md) — flow ระบบ
- [API.md](API.md) — endpoint ที่มี
