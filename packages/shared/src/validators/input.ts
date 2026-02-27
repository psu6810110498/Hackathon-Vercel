/**
 * Input validation — shared between frontend and API
 * Migrated from lib/utils/validation.ts
 */

import { z } from 'zod';

// ============================================
// Zod Schemas
// ============================================

export const WritingAnalysisInput = z.object({
  text: z
    .string()
    .min(1, 'กรุณาพิมพ์ข้อความ')
    .max(5000, 'ข้อความยาวเกินไป (สูงสุด 5000 ตัวอักษร)'),
  hskLevel: z
    .number()
    .int()
    .min(3, 'ระดับ HSK สำหรับการเขียนต้องเป็น 3–6')
    .max(6, 'ระดับ HSK สำหรับการเขียนต้องเป็น 3–6'),
});

export const ReadingAnalysisInput = z.object({
  passage: z
    .string()
    .min(1, 'กรุณาพิมพ์ข้อความ')
    .max(10000, 'ข้อความยาวเกินไป (สูงสุด 10000 ตัวอักษร)'),
  hskLevel: z.number().int().min(1).max(6),
});

export const ExerciseGenerateInput = z.object({
  hskLevel: z.number().int().min(1).max(6).default(5),
});

export const RegisterInput = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z
    .string()
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
    .regex(/[A-Z]/, 'รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัว')
    .regex(/[^a-zA-Z0-9]/, 'รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว (เช่น !@#$%)'),
  confirmPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่าน'),
  name: z.string().min(1, 'กรุณาระบุชื่อ').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

export const LoginInput = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณาระบุรหัสผ่าน'),
});

// ============================================
// Type exports from schemas
// ============================================

export type WritingAnalysisInputType = z.infer<typeof WritingAnalysisInput>;
export type ReadingAnalysisInputType = z.infer<typeof ReadingAnalysisInput>;
export type ExerciseGenerateInputType = z.infer<typeof ExerciseGenerateInput>;
export type RegisterInputType = z.infer<typeof RegisterInput>;
export type LoginInputType = z.infer<typeof LoginInput>;

// ============================================
// Legacy validation helpers (for backward compat)
// ============================================

export function validateEssayInput(
  text: unknown,
  hskLevel: unknown
): { valid: boolean; data?: string; error?: string } {
  if (typeof text !== 'string' || !text.trim()) {
    return { valid: false, error: 'กรุณาพิมพ์บทเขียนภาษาจีน' };
  }
  const trimmed = text.trim();
  if (trimmed.length > 5000) {
    return { valid: false, error: 'ข้อความยาวเกินไป (สูงสุด 5000 ตัวอักษร)' };
  }
  return { valid: true, data: trimmed };
}

export function validateReadingInput(
  passage: unknown
): { valid: boolean; data?: string; error?: string } {
  if (typeof passage !== 'string' || !passage.trim()) {
    return { valid: false, error: 'กรุณาพิมพ์ข้อความ' };
  }
  const trimmed = passage.trim();
  if (trimmed.length > 10000) {
    return { valid: false, error: 'ข้อความยาวเกินไป' };
  }
  return { valid: true, data: trimmed };
}

export function isValidHskLevel(level: unknown): level is 1 | 2 | 3 | 4 | 5 | 6 {
  return typeof level === 'number' && Number.isInteger(level) && level >= 1 && level <= 6;
}

export function isValidHskLevelForWriting(level: unknown): level is 3 | 4 | 5 | 6 {
  return typeof level === 'number' && Number.isInteger(level) && level >= 3 && level <= 6;
}
