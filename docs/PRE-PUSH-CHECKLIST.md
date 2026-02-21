# เช็คลิสต์ก่อน Push ครั้งแรก

- [ ] ไม่มีไฟล์ `.env` ใน staging (มีแค่ `.env.example`)
- [ ] รัน `npm run db:push` ผ่านแล้ว (ดู [BEFORE-BUILD.md](BEFORE-BUILD.md))
- [ ] รัน `npm run test:apis` ผ่านขั้น Database (และ Claude ถ้าต้องการวิเคราะห์ได้)
- [ ] รัน `npm run lint` ผ่าน
- [ ] รัน `npm run build` ผ่าน
- [ ] ตรวจว่า branch ปัจจุบันถูกต้อง (เช่น `main` หรือ feature branch)
