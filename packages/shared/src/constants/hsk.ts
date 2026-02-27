/**
 * HSK Constants — shared between frontend and API
 * Migrated from lib/hsk/config.ts (constants only)
 */

export const HSK_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export type HskLevel = (typeof HSK_LEVELS)[number];
export type WritingHskLevel = 3 | 4 | 5 | 6;

export const HSK_CONFIG = {
  HSK1: { level: 1, vocabCount: 150, minChars: 0, label: 'HSK 1 — 入门' },
  HSK2: { level: 2, vocabCount: 300, minChars: 0, label: 'HSK 2 — 基础' },
  HSK3: { level: 3, vocabCount: 600, minChars: 50, label: 'HSK 3 — 中级' },
  HSK4: { level: 4, vocabCount: 1200, minChars: 80, label: 'HSK 4 — 中高级' },
  HSK5: { level: 5, vocabCount: 2500, minChars: 100, label: 'HSK 5 — 高级' },
  HSK6: { level: 6, vocabCount: 5000, minChars: 120, label: 'HSK 6 — 精通' },
} as const;

export type HskConfigKey = keyof typeof HSK_CONFIG;

export const MAX_DAILY_USAGE_FREE = 3;
export const MAX_DAILY_USAGE_PREMIUM = 50;
