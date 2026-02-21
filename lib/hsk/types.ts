/**
 * HSK Mock Exam Types
 */

export type HSKExamLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface IHskQuestion {
  id: number;
  type: "multiple-choice" | "fill-in-the-blank" | "ordering" | "writing";
  instructions?: string; // Specific instructions for this question (e.g. for Writing)
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string;
  image?: string;
  audioSegment?: string; // Optional segment of the main MP3
}

export interface IHskSection {
  id: string;
  title: string;
  instructions: string;
  questions: IHskQuestion[];
}

export interface IHskExam {
  id: string; // e.g., H51327
  level: HSKExamLevel;
  totalTime: number; // in minutes
  audioUrl?: string; // Path to the listening audio file
  sections: IHskSection[];
}
