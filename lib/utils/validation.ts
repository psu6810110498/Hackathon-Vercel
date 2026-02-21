/**
 * Input validators for API and forms
 */

const MIN_ESSAY_LENGTH = 50;
const MAX_ESSAY_LENGTH = 2000;
const MIN_READING_LENGTH = 100;
const MAX_READING_LENGTH = 5000;
const VALID_HSK_LEVELS = [1, 2, 3, 4, 5, 6] as const;
const VALID_HSK_LEVELS_WRITING = [3, 4, 5, 6] as const;

/**
 * Validate HSK level (1–6) for reading or general use
 */
export function isValidHskLevel(level: unknown): level is 1 | 2 | 3 | 4 | 5 | 6 {
  return (
    typeof level === "number" &&
    Number.isInteger(level) &&
    (VALID_HSK_LEVELS as readonly number[]).includes(level)
  );
}

/**
 * Validate HSK level for writing (3–6 only; 1–2 have no writing)
 */
export function isValidHskLevelForWriting(level: unknown): level is 3 | 4 | 5 | 6 {
  return (
    typeof level === "number" &&
    Number.isInteger(level) &&
    (VALID_HSK_LEVELS_WRITING as readonly number[]).includes(level)
  );
}

/**
 * Validate essay input length and type
 */
export function validateEssayInput(text: unknown): {
  valid: boolean;
  error?: string;
  data?: string;
} {
  if (typeof text !== "string") {
    return { valid: false, error: "ข้อความต้องเป็นตัวอักษร" };
  }
  const trimmed = text.trim();
  if (trimmed.length < MIN_ESSAY_LENGTH) {
    return {
      valid: false,
      error: `กรุณาพิมพ์อย่างน้อย ${MIN_ESSAY_LENGTH} ตัวอักษร`,
    };
  }
  if (trimmed.length > MAX_ESSAY_LENGTH) {
    return {
      valid: false,
      error: `ข้อความยาวเกิน ${MAX_ESSAY_LENGTH} ตัวอักษร`,
    };
  }
  return { valid: true, data: trimmed };
}

/**
 * Validate reading passage input
 */
export function validateReadingInput(text: unknown): {
  valid: boolean;
  error?: string;
  data?: string;
} {
  if (typeof text !== "string") {
    return { valid: false, error: "ข้อความต้องเป็นตัวอักษร" };
  }
  const trimmed = text.trim();
  if (trimmed.length < MIN_READING_LENGTH) {
    return {
      valid: false,
      error: `กรุณาพิมพ์อย่างน้อย ${MIN_READING_LENGTH} ตัวอักษร`,
    };
  }
  if (trimmed.length > MAX_READING_LENGTH) {
    return {
      valid: false,
      error: `ข้อความยาวเกิน ${MAX_READING_LENGTH} ตัวอักษร`,
    };
  }
  return { valid: true, data: trimmed };
}

export {
  MIN_ESSAY_LENGTH,
  MAX_ESSAY_LENGTH,
  MIN_READING_LENGTH,
  MAX_READING_LENGTH,
  VALID_HSK_LEVELS,
  VALID_HSK_LEVELS_WRITING,
};
