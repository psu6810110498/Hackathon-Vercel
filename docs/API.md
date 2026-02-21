# HSK AI Coach — API Documentation

Base URL: `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`)

ทุก endpoint ที่ต้อง auth จะคืน `401` ถ้าไม่ได้ล็อกอิน

---

## POST /api/analyze (Writing Analysis)

วิเคราะห์บทความเขียน (ไวยากรณ์, คำศัพท์, คะแนน)

### Request

- **Headers:** `Content-Type: application/json`
- **Body:**
  - `text` (string, required): บทความภาษาจีน (50–2000 ตัวอักษร)
  - `hskLevel` (number, required): 4, 5 หรือ 6

### Response 200

```json
{
  "success": true,
  "result": {
    "score": 75,
    "level": "HSK5",
    "errors": [
      {
        "type": "ไวยากรณ์",
        "original": "我去了北京",
        "suggestion": "我去过北京",
        "explanation": "อธิบาย..."
      }
    ],
    "summary": "สรุปภาษาไทย",
    "feedback": "ข้อเสนอแนะภาษาไทย"
  },
  "usage": 1
}
```

### Errors

- **400:** ข้อมูลไม่ครบหรือไม่ผ่าน validation (ข้อความสั้น/ยาวเกิน, ระดับ HSK ไม่ถูก)
- **401:** ไม่ได้เข้าสู่ระบบ
- **429:** ใช้สิทธิ์ฟรีครบ 3 ครั้ง/วันแล้ว
- **500:** วิเคราะห์ไม่สำเร็จหรือ error ภายใน

---

## POST /api/reading (Reading Analysis)

วิเคราะห์บทความอ่าน (คำศัพท์ + คำถามความเข้าใจ)

### Request

- **Headers:** `Content-Type: application/json`
- **Body:**
  - `passage` (string, required): บทความภาษาจีน (100–5000 ตัวอักษร)
  - `hskLevel` (number, required): 4, 5 หรือ 6

### Response 200

```json
{
  "success": true,
  "result": {
    "level": "HSK5",
    "vocabulary": [
      {
        "word": "词语",
        "pinyin": "cíyǔ",
        "meaning": "ความหมาย",
        "example": "ตัวอย่างประโยค"
      }
    ],
    "questions": [
      {
        "question": "คำถาม",
        "options": ["A", "B", "C", "D"],
        "correctIndex": 0,
        "explanation": "อธิบายภาษาไทย"
      }
    ],
    "summary": "สรุปบทความภาษาไทย"
  },
  "usage": 2
}
```

### Errors

- **400 / 401 / 429 / 500:** เหมือน `/api/analyze`

---

## GET /api/usage (Daily Usage)

ตรวจสอบจำนวนครั้งที่ใช้วิเคราะห์วันนี้ (สำหรับแสดงใน UI)

### Request

- ไม่มี body (ใช้ session จาก cookie)

### Response 200

```json
{
  "usage": 2,
  "limit": 3,
  "allowed": true,
  "plan": "FREE"
}
```

- **Premium:** `limit` เป็น `null`, `allowed` เป็น `true`
- **401:** ไม่ได้ล็อกอิน (อาจส่ง `usage: 0`, `limit: 3`, `plan: "FREE"` กลับมาได้ ขึ้นกับ implementation)

---

## Auth

- **NextAuth:** `GET/POST /api/auth/*` ใช้โดย NextAuth (sign in, callback, sign out)
- หน้า dashboard ต้องมี session; ไม่มีจะ redirect ไป `/login?callbackUrl=/dashboard`
