# ก่อน Build — เช็คให้ครบ 10/10

ทำตาม 3 ขั้นนี้ให้ผ่าน แล้วค่อย `npm run build` / deploy

---

## 1. Prisma ต่อ Supabase (Database)

```bash
npm run db:push
```

- **ถ้าผ่าน** = เห็นข้อความ `Your database is now in sync with your Prisma schema` → Database พร้อมใช้งาน ✅
- **ถ้าไม่ผ่าน:** เช็ค `DATABASE_URL` และ `DIRECT_URL` ใน `.env` (ดู [SETUP.md](SETUP.md) และข้อความ error P1001)

---

## 2. ทดสอบ Claude API

```bash
npm run test:apis
```

สคริปต์จะเรียก Claude ด้วยข้อความสั้นๆ:
- **ถ้าเห็น "✅ Claude API: พร้อม"** = API ตอบได้ พร้อมใช้วิเคราะห์ ✅
- **ถ้าเห็น "เครดิตหมด" / 400** = Key ใช้ได้ แต่ต้องเติมเครดิตที่ [Anthropic Console](https://console.anthropic.com/) — Build ได้ แต่ฟีเจอร์วิเคราะห์จะ error จนกว่าเครดิตจะพอ
- **ถ้าเห็น "ANTHROPIC_API_KEY"** = ยังไม่ได้ใส่ key ใน `.env`

---

## 3. ทดสอบ DeepSeek API (ไม่บังคับ)

คำสั่งเดียวกัน:

```bash
npm run test:apis
```

- **ถ้าเห็น "✅ DeepSeek API: พร้อม"** = ใช้เป็นตัวเสริมวิเคราะห์จีนได้ ✅
- **ถ้าไม่มี DEEPSEEK_API_KEY** = ข้ามได้ (แอปใช้ Claude เป็นหลัก)
- **ถ้า key มีแต่เครดิตหมด** = เติมเครดิตที่ DeepSeek หรือปิดใช้ก่อนก็ได้

---

## สรุป: Setup 10/10

| ขั้นตอน | คำสั่ง | ต้องผ่านสำหรับ Build? |
|--------|--------|------------------------|
| 1. Database | `npm run db:push` | ✅ ต้อง |
| 2. Claude | `npm run test:apis` | แนะนำ (ถ้าเครดิตหมด Build ได้แต่วิเคราะห์จะ error) |
| 3. DeepSeek | `npm run test:apis` | ไม่บังคับ |

**ก่อน push / deploy แนะนำ:** รัน `npm run db:push` แล้ว `npm run test:apis` ให้ผ่านขั้น 1 และถ้าทำได้ขั้น 2 แล้วค่อย `npm run build`
