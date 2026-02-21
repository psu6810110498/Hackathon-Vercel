# HSK AI Coach: Enterprise Language Intelligence

> แพลตฟอร์มเตรียมสอบ **HSK 4–6** ด้วย AI สำหรับนักเรียนไทย — วิเคราะห์การเขียนและบทความอ่าน พร้อมคำศัพท์และคำถามความเข้าใจ

HSK AI Coach is a sophisticated, full-stack linguistic intelligence platform designed to bridge the gap between intermediate Chinese mastery and professional proficiency. By leveraging state-of-the-art Large Language Models (LLMs) and the **New HSK 3.0 (2021/2025) Standard**, it provides personalized, pedagogical feedback tailored specifically to the unique errors made by Thai learners.

---

## 🚀 The Intelligence Core: Dual-Model Pipeline

Unlike generic AI tools, HSK AI Coach utilizes a proprietary **Dual-Model Pipeline** to ensure extreme linguistic accuracy:

1.  **Linguistic Layer (DeepSeek)**: ทำหน้าที่ตรวจตราไวยากรณ์ (Grammar Parsing) และการเลือกใช้คำ (Word Choice) ในเชิงลึก
2.  **Pedagogical Layer (Claude 3.5)**: ทำหน้าที่เป็น "ครูสอนภาษาไทย" ที่สรุปข้อมูลจากการวิเคราะห์ เป็นข้อเสนอแนะที่เข้าใจง่าย ให้คะแนน 4 มิติ และเขียนใหม่ (Rewrite) ให้สละสลวยแบบคนจีน

---

## 🛠️ Main Menu Modules

### 1. 📊 Overview (Command Center)

- **HSK Readiness Score**: ทำนายความพร้อมในการสอบ HSK แบบ Real-time
- **Daily Analytics**: ติดตามการใช้งานรายวันตามโควต้าแผนฟรี 3 ครั้ง/วัน

### 2. ✍️ Essay Grader (การเขียน)

- **4D Scoring**: วิเคราะห์คะแนน Grammar, Vocabulary, Coherence และ Native Naturalness (คะแนนเต็ม 100)
- **Error Mapping**: ระบุตำแหน่งข้อผิดพลาดรายตัวอักษร พร้อมระดับความรุนแรง (Severity)
- **AI Rewrite**: สร้างตัวอย่างการเขียนที่ถูกต้องและเป็นธรรมชาติที่สุดเพื่อการศึกษา

### 3. 📖 Reading (การอ่าน)

- **Auto-Summary**: สรุปบทความภาษาจีนที่ซับซ้อนให้เป็นภาษาไทยทันที
- **HSK 3.0 Vocab**: สกัดคำศัพท์สำคัญพร้อมพินอิน ระดับคำศัพท์ และเคล็ดลับการจำสำหรับคนไทย
- **Difficult Words Guard**: ไฮไลท์คำศัพท์ที่คนไทยมักจะแปลหรือเข้าใจผิดบ่อยๆ (Common Traps)

### 4. 🧠 Practice (แบบฝึกหัดเฉพาะบุคคล)

- **Weakness-Driven**: AI ดึงข้อมูลจากประวัติข้อผิดพลาดของคุณ (ErrorLog) มาสร้างโจทย์
- **Tailored Tasks**: สร้างแบบฝึกหัดเติมคำ, เลือกตอบ หรือแก้ประโยคที่เน้นจุดอ่อนของคุณโดยเฉพาะ

### 5. 🎯 Mock Exam & 🃏 Flashcards (Roadmap)

- **Exam Simulation**: ข้อสอบจำลอง HSK 4-6 เต็มรูปแบบ พร้อมระบบจับเวลา
- **SRS Flashcards**: ระบบบัตรคำศัพท์อัจฉริยะ (Spaced Repetition) เพื่อการจำที่ยั่งยืน

---

## 🛠️ Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Next.js 14 (App Router)               |
| Language  | TypeScript (strict)                   |
| Styling   | Tailwind CSS + shadcn/ui              |
| Auth      | NextAuth.js v5 (Google OAuth)         |
| Database  | Supabase (PostgreSQL) + Prisma ORM    |
| AI        | Claude 3.5 & DeepSeek (Dual Pipeline) |
| Standard  | New HSK 3.0 (2021/2025) Vocab System  |

---

## 📥 Quick Start

```bash
git clone https://github.com/psu6810110498/Hackathon-Vercel.git
cd Hackathon-Vercel
cp .env.example .env          # กรอกค่า API Keys และ DATABASE_URL
npm install
npm run db:push               # ดัน Schema ไปยัง Database
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

---

## 📄 Documentation & Guides

- [SETUP.md](docs/SETUP.md) — การติดตั้งและรันอย่างละเอียด
- [BEFORE-BUILD.md](docs/BEFORE-BUILD.md) — เช็คลิสต์ก่อน Deploy (DB + AI Config)
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — เจาะลึกโครงสร้างระบบและ Data Flow
- [PROMPTS.md](docs/PROMPTS.md) — รายละเอียด AI Prompt Engineering ที่ใช้ในระบบ

---

**License**: Private / Hackathon Use.  
Copyright © 2026 HSK AI Coach. All rights reserved.
