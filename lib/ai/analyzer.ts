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
  IReadingVocab,
  IReadingQuestion,
  IScoreBreakdown,
  HSKLevel,
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

  const parsed = parseJson<Record<string, unknown>>(raw);
  if (!parsed || !Array.isArray(parsed.errors)) return null;

  const scoreNum =
    typeof parsed.score === "number"
      ? parsed.score
      : parsed.score && typeof parsed.score === "object" && typeof (parsed.score as IScoreBreakdown).total === "number"
        ? (parsed.score as IScoreBreakdown).total
        : 0;
  const level = (parsed.level as HSKLevel) ?? (hskLevel === 6 ? "HSK6" : hskLevel === 5 ? "HSK5" : hskLevel === 4 ? "HSK4" : hskLevel === 3 ? "HSK3" : "HSK4");

  const errors: IWritingError[] = (parsed.errors as unknown[] || []).map((e: unknown, i: number) => {
    const x = e as Record<string, unknown>;
    return {
      id: typeof x?.id === "string" ? x.id : `err-${i}`,
      type: String(x?.type ?? "อื่นๆ"),
      category: x?.category as IWritingError["category"],
      severity: x?.severity as IWritingError["severity"],
      original: String(x?.original ?? ""),
      suggestion: String(x?.suggestion ?? ""),
      explanation: String(x?.explanation ?? ""),
      thaiMistakeTip: x?.thaiMistakeTip != null ? String(x.thaiMistakeTip) : undefined,
      hskRule: x?.hskRule != null ? String(x.hskRule) : undefined,
      position:
        x?.position && typeof x.position === "object"
          ? (x.position as { start: number; end: number })
          : undefined,
    };
  });

  const result: IWritingAnalysisResult = {
    level,
    score: Math.min(100, Math.max(0, Math.round(scoreNum))),
    errors,
    exercises: Array.isArray(parsed.exercises) ? (parsed.exercises as IWritingAnalysisResult["exercises"]) : undefined,
    summary: String(parsed.summary ?? ""),
    feedback: String(parsed.feedback ?? ""),
    nativeTip: parsed.nativeTip != null ? String(parsed.nativeTip) : undefined,
  };
  return result;
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

  const level = (parsed.level as HSKLevel) ?? (hskLevel === 6 ? "HSK6" : hskLevel === 5 ? "HSK5" : hskLevel === 4 ? "HSK4" : hskLevel === 3 ? "HSK3" : "HSK4");

  const vocabulary: IReadingVocab[] = (parsed.vocabulary || []).map((v: unknown) => {
    const x = v as Record<string, unknown>;
    return {
      word: String(x?.word ?? ""),
      pinyin: String(x?.pinyin ?? ""),
      meaning: String(x?.meaning ?? ""),
      thaiTip: x?.thaiTip != null ? String(x.thaiTip) : undefined,
      example: x?.example != null ? String(x.example) : undefined,
      hskLevel: x?.hskLevel != null ? Number(x.hskLevel) : undefined,
    };
  });

  const questions: IReadingQuestion[] = (parsed.questions || []).map((q: unknown, i: number) => {
    const y = q as Record<string, unknown>;
    return {
      id: typeof y?.id === "string" ? y.id : `q-${i}`,
      question: String(y?.question ?? ""),
      options: Array.isArray(y?.options) ? (y.options as string[]) : [],
      correctIndex: Number(y?.correctIndex ?? 0),
      explanation: String(y?.explanation ?? ""),
    };
  });

  return {
    level,
    vocabulary,
    questions,
    difficultWords: Array.isArray(parsed.difficultWords) ? (parsed.difficultWords as IReadingAnalysisResult["difficultWords"]) : undefined,
    summary: String(parsed.summary ?? ""),
  };
}
