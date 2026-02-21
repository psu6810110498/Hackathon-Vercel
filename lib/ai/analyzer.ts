/**
 * Main analysis orchestrator: calls Claude (primary), optional DeepSeek fallback
 * Parses JSON from AI and normalizes for API response
 */

import { callClaude } from "./claude";
import { callDeepSeek } from "./deepseek";
import {
  SYSTEM_PROMPT_WRITING,
  USER_PROMPT_WRITING,
  SYSTEM_PROMPT_READING,
  USER_PROMPT_READING,
} from "./prompts";
import type {
  IWritingAnalysisResult,
  IReadingAnalysisResult,
  IWritingError,
} from "@/types/analysis";

/**
 * Extract JSON from AI response (strip markdown code blocks if present)
 */
function parseJson<T>(raw: string): T | null {
  const trimmed = raw.trim();
  let jsonStr = trimmed;
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    jsonStr = codeBlock[1].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

/**
 * Analyze essay (writing mode) — primary: Claude
 */
export async function analyzeWriting(
  essay: string,
  hskLevel: number
): Promise<IWritingAnalysisResult | null> {
  const system = SYSTEM_PROMPT_WRITING;
  const user = USER_PROMPT_WRITING(hskLevel, essay);
  const raw = await callClaude(system, user);
  if (!raw) return null;

  const parsed = parseJson<IWritingAnalysisResult>(raw);
  if (!parsed || typeof parsed.score !== "number" || !Array.isArray(parsed.errors)) {
    return null;
  }

  // Normalize errors
  const errors: IWritingError[] = (parsed.errors || []).map((e: unknown) => {
    const x = e as Record<string, unknown>;
    return {
      type: String(x?.type ?? "อื่นๆ"),
      original: String(x?.original ?? ""),
      suggestion: String(x?.suggestion ?? ""),
      explanation: String(x?.explanation ?? ""),
      position:
        x?.position && typeof x.position === "object"
          ? (x.position as { start: number; end: number })
          : undefined,
    };
  });

  return {
    score: Math.min(100, Math.max(0, Math.round(parsed.score))),
    level: parsed.level ?? (hskLevel === 6 ? "HSK6" : hskLevel === 5 ? "HSK5" : "HSK4"),
    errors,
    summary: String(parsed.summary ?? ""),
    feedback: String(parsed.feedback ?? ""),
  };
}

/**
 * Analyze reading passage — primary: Claude
 */
export async function analyzeReading(
  passage: string,
  hskLevel: number
): Promise<IReadingAnalysisResult | null> {
  const system = SYSTEM_PROMPT_READING;
  const user = USER_PROMPT_READING(hskLevel, passage);
  const raw = await callClaude(system, user);
  if (!raw) return null;

  const parsed = parseJson<IReadingAnalysisResult>(raw);
  if (!parsed || !Array.isArray(parsed.vocabulary) || !Array.isArray(parsed.questions)) {
    return null;
  }

  return {
    level: parsed.level ?? (hskLevel === 6 ? "HSK6" : hskLevel === 5 ? "HSK5" : "HSK4"),
    vocabulary: (parsed.vocabulary || []).map((v: unknown) => {
      const x = v as Record<string, unknown>;
      return {
        word: String(x?.word ?? ""),
        pinyin: String(x?.pinyin ?? ""),
        meaning: String(x?.meaning ?? ""),
        example: x?.example != null ? String(x.example) : undefined,
      };
    }),
    questions: (parsed.questions || []).map((q: unknown) => {
      const y = q as Record<string, unknown>;
      return {
        question: String(y?.question ?? ""),
        options: Array.isArray(y?.options) ? (y.options as string[]) : [],
        correctIndex: Number(y?.correctIndex ?? 0),
        explanation: String(y?.explanation ?? ""),
      };
    }),
    summary: String(parsed.summary ?? ""),
  };
}
