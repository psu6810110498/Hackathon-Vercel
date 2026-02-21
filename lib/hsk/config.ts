/**
 * HSK level configuration: vocab counts, writing/reading availability, min chars, scores
 */

import type { HSKLevel } from "@/types/analysis";

export interface HskLevelConfig {
  totalVocab: number;
  hasWriting: boolean;
  hasReading: boolean;
  minChars: number;
  passingScore: number;
  totalScore: number;
  writingDescription: string;
}

export const HSK_CONFIG: Record<HSKLevel, HskLevelConfig> = {
  HSK1: {
    totalVocab: 150,
    hasWriting: false,
    hasReading: true,
    minChars: 0,
    passingScore: 120,
    totalScore: 200,
    writingDescription: "ยังไม่มีส่วน Writing",
  },
  HSK2: {
    totalVocab: 300,
    hasWriting: false,
    hasReading: true,
    minChars: 0,
    passingScore: 120,
    totalScore: 200,
    writingDescription: "ยังไม่มีส่วน Writing",
  },
  HSK3: {
    totalVocab: 600,
    hasWriting: true,
    hasReading: true,
    minChars: 50,
    passingScore: 180,
    totalScore: 300,
    writingDescription: "เขียนประโยคสั้นๆ",
  },
  HSK4: {
    totalVocab: 1200,
    hasWriting: true,
    hasReading: true,
    minChars: 100,
    passingScore: 180,
    totalScore: 300,
    writingDescription: "เรียงคำให้เป็นประโยค + เขียนประโยค",
  },
  HSK5: {
    totalVocab: 2500,
    hasWriting: true,
    hasReading: true,
    minChars: 200,
    passingScore: 180,
    totalScore: 300,
    writingDescription: "เรียงประโยค + เขียนเรียงความ",
  },
  HSK6: {
    totalVocab: 5000,
    hasWriting: true,
    hasReading: true,
    minChars: 400,
    passingScore: 180,
    totalScore: 300,
    writingDescription: "สรุปบทความ (缩写) ห้ามใช้คำจากต้นฉบับ",
  },
} as const;
