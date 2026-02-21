# HSK AI Coach — AI Prompts

Prompts ทั้งหมดอยู่ที่ `lib/ai/prompts.ts` เพื่อให้ทีมแก้และเก็บ version ได้ง่าย

## Writing (บทความเขียน)

- **System:** กำหนดบทบาทเป็น HSK writing coach สำหรับนักเรียนไทย; ออกแบบให้ตอบเป็น JSON เท่านั้น (score, level, errors[], summary, feedback)
- **User:** ส่งระดับ HSK และข้อความบทความ
- **Output:** ต้องเป็น JSON ที่ parse ได้ ไม่มี markdown หรือข้อความนำหน้า

## Reading (บทความอ่าน)

- **System:** กำหนดบทบาทเป็น HSK reading coach; ตอบเป็น JSON (level, vocabulary[], questions[], summary)
- **User:** ส่งระดับ HSK และบทความ
- **Output:** vocabulary แต่ละรายการมี word, pinyin, meaning, example (optional); questions มี question, options, correctIndex, explanation

## DeepSeek (เสริม, ไม่บังคับ)

- ใช้ตรวจประโยค/วลีสั้นๆ
- ตอบเป็น JSON: `{ "issues": string[], "suggestions": string[] }`
- ถ้าไม่มี `DEEPSEEK_API_KEY` จะไม่เรียก DeepSeek

## Best Practices

- แก้ prompt ใน `prompts.ts` เท่านั้น
- ทดสอบกับข้อความจริงหลายระดับ (HSK 4–6) หลังแก้
- ตรวจสอบว่า AI ตอบเป็น JSON ที่ parse ได้ (มี fallback ใน `analyzer.ts`)
