/**
 * ตรวจสอบก่อน Build: DB (Prisma), Claude API, DeepSeek API
 * รัน: npm run test:apis (โหลด .env อัตโนมัติ)
 */

import "dotenv/config";
import { callClaude } from "../lib/ai/claude";
import { callDeepSeek } from "../lib/ai/deepseek";
import { prisma } from "../lib/db/prisma";

async function main() {
  const results = { db: false, claude: false, deepseek: false };

  // 1. Prisma / Database
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.db = true;
    console.log("✅ Database (Prisma + Supabase): พร้อม");
  } catch (e) {
    console.log("❌ Database:", (e as Error).message);
  }

  // 2. Claude API
  try {
    const out = await callClaude("You are helpful.", "Reply with exactly: OK");
    if (out && out.trim().toUpperCase().includes("OK")) {
      results.claude = true;
      console.log("✅ Claude API: พร้อม");
    } else if (out === null) {
      console.log("❌ Claude API: เรียกไม่สำเร็จ (เช็ค ANTHROPIC_API_KEY หรือเครดิตที่ console.anthropic.com)");
    } else {
      results.claude = true;
      console.log("✅ Claude API: ตอบกลับได้ (ได้:", out.slice(0, 60) + "...)");
    }
  } catch (e) {
    const msg = (e as Error).message;
    if (msg.includes("credit") || msg.includes("400") || msg.includes("429")) {
      console.log("⚠️  Claude API: Key ใช้ได้ แต่เครดิตหมด/จำกัด — เติมเครดิตที่ Anthropic");
    } else {
      console.log("❌ Claude API:", msg);
    }
  }

  // 3. DeepSeek API (optional)
  try {
    const out = await callDeepSeek("You are helpful.", "Reply with exactly: OK");
    if (out !== null && out.trim().toUpperCase().includes("OK")) {
      results.deepseek = true;
      console.log("✅ DeepSeek API: พร้อม");
    } else if (process.env.DEEPSEEK_API_KEY) {
      console.log("⚠️  DeepSeek API: key มีแต่ตอบไม่ผ่าน (อาจเครดิตหมด) — ไม่บังคับสำหรับ Build");
    } else {
      console.log("⏭️  DeepSeek API: ข้าม (ไม่มี DEEPSEEK_API_KEY)");
    }
  } catch (e) {
    console.log("❌ DeepSeek API:", (e as Error).message);
  }

  await prisma.$disconnect();

  const required = results.db;
  const recommended = results.claude;
  console.log(
    "\n" +
      (required && recommended
        ? "✅ พร้อม Build (DB + Claude ผ่าน)"
        : required
          ? "⚠️  Build ได้ แต่ Claude ยังไม่ผ่าน — ควรเติมเครดิต Anthropic ก่อนใช้ฟีเจอร์วิเคราะห์"
          : "🔴 ยังไม่พร้อม: ต้องผ่าน DB (รัน npm run db:push ก่อน)")
  );
  process.exit(required ? 0 : 1);
}

main();
