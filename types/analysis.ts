/**
 * Analysis result types for Writing and Reading modes
 */

/** Single error item from writing analysis */
export interface IWritingError {
  type: string;
  original: string;
  suggestion: string;
  explanation: string;
  position?: { start: number; end: number };
}

/** Writing analysis API result */
export interface IWritingAnalysisResult {
  score: number;
  level: "HSK4" | "HSK5" | "HSK6";
  errors: IWritingError[];
  summary: string;
  feedback: string;
}

/** Vocabulary item from reading analysis */
export interface IReadingVocab {
  word: string;
  pinyin: string;
  meaning: string;
  example?: string;
}

/** Comprehension question from reading analysis */
export interface IReadingQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Reading analysis API result */
export interface IReadingAnalysisResult {
  level: "HSK4" | "HSK5" | "HSK6";
  vocabulary: IReadingVocab[];
  questions: IReadingQuestion[];
  summary: string;
}

/** Generic analysis payload for DB storage */
export type IAnalysisResult = IWritingAnalysisResult | IReadingAnalysisResult;
