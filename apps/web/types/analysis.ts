/**
 * Analysis result types for Writing and Reading modes
 * HSK AI Coach — "Calm Intelligence" enhanced types
 */

// ─────────────────────────────────────
// SHARED TYPES
// ─────────────────────────────────────

export type HSKLevel =
  | "HSK1"
  | "HSK2"
  | "HSK3"
  | "HSK4"
  | "HSK5"
  | "HSK6";

export type ErrorCategory =
  | "grammar"
  | "vocabulary"
  | "coherence"
  | "measure_word"
  | "word_order"
  | "naturalness";

/** Softer severity labels (UX-reviewed) */
export type ErrorSeverity = "minor" | "important" | "must-fix";

export type ExerciseType =
  | "fill-blank"
  | "multiple-choice"
  | "error-correction";

// ─────────────────────────────────────
// WRITING TYPES (Enhanced)
// ─────────────────────────────────────

/** Single error item from writing analysis */
export interface IWritingError {
  id?: string;
  type: string;
  category?: ErrorCategory;
  severity?: ErrorSeverity;
  original: string;
  suggestion: string;
  explanation: string;
  /** เคล็ดลับสำหรับคนไทยที่มักผิดจุดนี้ */
  thaiMistakeTip?: string;
  /** อ้างอิงกฎ HSK (เช่น 把字句, 量词) */
  hskRule?: string;
  /** Character position in essay text */
  position?: { start: number; end: number };
}

/** Exercise generated from error patterns */
export interface IExercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  targetPattern: string;
}

/** 4-dimension score breakdown (25 points each = 100 total) */
export interface IScoreBreakdown {
  total: number;
  grammar: number;
  vocabulary: number;
  coherence: number;
  native: number;
  passed: boolean;
}

/** Fix priority suggestion from AI */
export interface IFixPriority {
  issue: string;
  impact: string;
  suggestion: string;
}

/** Writing analysis API result (enhanced with rewrite, native score, fix priorities) */
export interface IWritingAnalysisResult {
  level: HSKLevel;
  /** Score breakdown: grammar/vocab/coherence/native out of 25 each */
  score: number | IScoreBreakdown;
  errors: IWritingError[];
  exercises?: IExercise[];
  summary: string;
  feedback: string;
  /** คำแนะนำสำหรับคนไทยโดยเฉพาะ */
  nativeTip?: string;
  /** AI-rewritten version of the essay */
  rewrite?: string;
  /** Naturalness percentage 0-100 */
  nativeScore?: number;
  /** Top 3 fix priorities for fastest improvement */
  fixPriorities?: IFixPriority[];
}

// ─────────────────────────────────────
// READING TYPES
// ─────────────────────────────────────

/** Vocabulary item from reading analysis */
export interface IReadingVocab {
  word: string;
  pinyin: string;
  meaning: string;
  /** คนไทยมักสับสนอะไร / เคล็ดลับจำ */
  thaiTip?: string;
  example?: string;
  hskLevel?: number;
}

/** Difficult word that Thai students often misread */
export interface IDifficultWord {
  word: string;
  commonMistake: string;
  correct: string;
}

/** Comprehension question from reading analysis */
export interface IReadingQuestion {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Reading analysis API result */
export interface IReadingAnalysisResult {
  level: HSKLevel;
  summary: string;
  vocabulary: IReadingVocab[];
  questions: IReadingQuestion[];
  difficultWords?: IDifficultWord[];
}

// ─────────────────────────────────────
// GENERIC / DB TYPES
// ─────────────────────────────────────

export type IAnalysisResult =
  | IWritingAnalysisResult
  | IReadingAnalysisResult;

export type AnalysisMode = "writing" | "reading";

/** API Request payload */
export interface IAnalyzeRequest {
  text: string;
  level: HSKLevel;
  mode: AnalysisMode;
}

/** API Response wrapper */
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Get numeric score from either legacy number or IScoreBreakdown */
export function getScoreTotal(score: number | IScoreBreakdown): number {
  return typeof score === "number" ? score : score.total;
}

/** Get native score interpretation label */
export function getNativeLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90) return { label: "Native-like", color: "#2ECC8F" };
  if (score >= 70) return { label: "Natural", color: "#4BA3D9" };
  if (score >= 50) return { label: "Understandable", color: "#F5A623" };
  return { label: "Needs work", color: "#E85D5D" };
}

/** Get severity display info */
export function getSeverityInfo(severity?: ErrorSeverity): {
  label: string;
  emoji: string;
  className: string;
} {
  switch (severity) {
    case "must-fix":
      return { label: "Must Fix", emoji: "🔴", className: "severity-must-fix" };
    case "important":
      return { label: "Important", emoji: "🟠", className: "severity-important" };
    case "minor":
    default:
      return { label: "Minor", emoji: "🟡", className: "severity-minor" };
  }
}
