# HSK AI Coach — การติดตั้งและรันโปรเจกต์

## 1. Prerequisites

- **Node.js** 18+ (แนะนำ 20 LTS)
- **npm** 9+
- **Git**
- บัญชี Supabase (สำหรับ Database)
- บัญชี Anthropic (สำหรับ Claude API)
- (ถ้าใช้ Magic Link) บัญชี Resend

## 2. Clone และติดตั้ง

```bash
git clone https://github.com/psu6810110498/Hackathon-Vercel.git
cd Hackathon-Vercel
npm install
```

## 3. Environment Variables

คัดลอกไฟล์ตัวอย่างแล้วกรอกค่า:

```bash
cp .env.example .env
```

แก้ไข `.env` (หรือ `.env.local`):

| ตัวแปร | คำอธิบาย |
|--------|----------|
| `NEXT_PUBLIC_APP_URL` | URL หลักของแอป (localhost หรือ production) |
| `DATABASE_URL` | Connection string จาก Supabase (แบบ connection pooling) |
| `DIRECT_URL` | Direct connection จาก Supabase (สำหรับ migrate) |
| `NEXTAUTH_SECRET` | สร้างด้วย `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ต้องตรงกับ `NEXT_PUBLIC_APP_URL` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | จาก Google Cloud Console |
| `RESEND_API_KEY` / `EMAIL_FROM` | ถ้าใช้ Magic Link ผ่าน Resend |
| `ANTHROPIC_API_KEY` | จาก Anthropic Console |
| `DEEPSEEK_API_KEY` | (ไม่บังคับ) สำหรับ DeepSeek |

## 4. Database (Prisma + Supabase)

สร้างฐานข้อมูลใน Supabase แล้วรัน:

```bash
npm run db:generate
npm run db:push
```

สำหรับ production แนะนำใช้ migration:

```bash
npm run db:migrate
```

(ถ้ามี) รัน seed:

```bash
npm run db:seed
```

## 4.1 คำศัพท์ HSK (data/hsk-vocabulary.json)

โปรเจกต์มีคำศัพท์ HSK 4–6 รวมแล้วจาก [clem109/hsk-vocabulary](https://github.com/clem109/hsk-vocabulary) (มากกว่า 4,400 คำ)

ถ้าต้องการอัปเดตคำศัพท์จาก repo อีกครั้ง:

```bash
git clone --depth 1 https://github.com/clem109/hsk-vocabulary.git /tmp/hsk-vocabulary
npm run vocab:refresh
```

หรือถ้า clone ไว้ที่อื่น: `HSK_VOCAB_REPO_PATH=/path/to/hsk-vocabulary npm run vocab:refresh`

## 5. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## 6. Common Errors และการแก้ไข

| ปัญหา | วิธีแก้ |
|--------|--------|
| `Environment variable not found: DIRECT_URL` | ต้องมี `.env` และใส่ `DATABASE_URL` / `DIRECT_URL` ก่อนรัน `npm run db:push` |
| `P1001 Can't reach database server` | ถ้าใช้ Supabase region (เช่น ap-south-1) ให้ใช้โฮสต์ pooler เดียวกับ DATABASE_URL แต่ port **5432** ใน DIRECT_URL (ไม่ใช้ `db.xxx.supabase.co`) |
| `ANTHROPIC_API_KEY is not set` | ใส่ค่าใน `.env.local` แล้ว restart `npm run dev` |
| `PrismaClientInitializationError` | ตรวจสอบ `DATABASE_URL` และ `DIRECT_URL` ใน Supabase |
| `NEXTAUTH_URL mismatch` | ให้ `NEXTAUTH_URL` กับ `NEXT_PUBLIC_APP_URL` ตรงกัน |
| Google login ไม่ทำงาน | ตรวจสอบ Authorized redirect URIs ใน Google Console เป็น `{NEXTAUTH_URL}/api/auth/callback/google` |
| Email Magic Link ไม่ส่ง | ใส่ `RESEND_API_KEY` และ `EMAIL_FROM` ที่ถูกต้อง (ต้อง verify domain ใน Resend) |

## 7. Build และ Deploy (Vercel)

```bash
npm run build
```

บน Vercel: เชื่อม GitHub repo แล้วตั้งค่า Environment Variables ตาม `.env.example` (ใช้ค่าจาก production)
