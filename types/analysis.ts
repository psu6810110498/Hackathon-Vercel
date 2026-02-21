/**
 * Analysis result types for Writing and Reading modes
 * Last updated: HanziAI Hackathon — Core Value types
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
  | "word_order";

export type ErrorSeverity = "high" | "medium" | "low";

export type ExerciseType =
  | "fill-blank"
  | "multiple-choice"
  | "error-correction";

// ─────────────────────────────────────
// WRITING TYPES
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
  /** Core Value — เคล็ดลับสำหรับคนไทยที่มักผิดจุดนี้ */
  thaiMistakeTip?: string;
  /** อ้างอิงกฎ HSK (เช่น 把字句, 量词) */
  hskRule?: string;
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

/** Score breakdown */
export interface IScoreBreakdown {
  total: number;
  grammar: number;
  vocabulary: number;
  coherence: number;
  passed: boolean;
}

/** Writing analysis API result */
export interface IWritingAnalysisResult {
  level: HSKLevel;
  /** รองรับทั้ง score ตัวเลขเดิม และ breakdown */
  score: number | IScoreBreakdown;
  errors: IWritingError[];
  exercises?: IExercise[];
  summary: string;
  feedback: string;
  /** Core Value — คำแนะนำสำหรับคนไทยโดยเฉพาะ */
  nativeTip?: string;
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

/** Get numeric score from either legacy number or IScoreBreakdown (for DB/UI) */
export function getScoreTotal(score: number | IScoreBreakdown): number {
  return typeof score === "number" ? score : score.total;
}
