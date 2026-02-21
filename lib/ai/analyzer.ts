/**
 * Main analysis orchestrator: calls Claude (primary)
 * Parses enhanced JSON response with 4D score, rewrite, native score
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
  IFixPriority,
  HSKLevel,
  ErrorSeverity,
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
 * Normalize severity from AI response to our softer labels
 */
function normalizeSeverity(raw: unknown): ErrorSeverity {
  const s = String(raw ?? "").toLowerCase();
  if (s === "must-fix" || s === "must_fix" || s === "comprehension_breaking" || s === "high") return "must-fix";
  if (s === "important" || s === "structural" || s === "medium") return "important";
  return "minor";
}

/**
 * Analyze essay (writing mode) — enhanced with 4D scoring
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

  // Parse score — handle both old (number) and new (breakdown object) format
  let scoreBreakdown: IScoreBreakdown;
  if (parsed.score && typeof parsed.score === "object" && !Array.isArray(parsed.score)) {
    const s = parsed.score as Record<string, unknown>;
    const grammar = Math.min(25, Math.max(0, Number(s.grammar ?? 0)));
    const vocabulary = Math.min(25, Math.max(0, Number(s.vocabulary ?? 0)));
    const coherence = Math.min(25, Math.max(0, Number(s.coherence ?? 0)));
    const native = Math.min(25, Math.max(0, Number(s.native ?? 0)));
    const total = grammar + vocabulary + coherence + native;
    scoreBreakdown = {
      total: Math.round(total),
      grammar: Math.round(grammar),
      vocabulary: Math.round(vocabulary),
      coherence: Math.round(coherence),
      native: Math.round(native),
      passed: total >= 60,
    };
  } else {
    // Legacy single number score
    const num = Math.min(100, Math.max(0, Math.round(Number(parsed.score ?? 0))));
    scoreBreakdown = {
      total: num,
      grammar: Math.round(num * 0.3),
      vocabulary: Math.round(num * 0.25),
      coherence: Math.round(num * 0.25),
      native: Math.round(num * 0.2),
      passed: num >= 60,
    };
  }

  const level = (parsed.level as HSKLevel) ?? (`HSK${hskLevel}` as HSKLevel);

  const errors: IWritingError[] = ((parsed.errors as unknown[]) || []).map((e: unknown, i: number) => {
    const x = e as Record<string, unknown>;
    return {
      id: typeof x?.id === "string" ? x.id : `err-${i}`,
      type: String(x?.type ?? "อื่นๆ"),
      category: (x?.category as IWritingError["category"]) ?? "grammar",
      severity: normalizeSeverity(x?.severity),
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

  // Parse fix priorities
  const fixPriorities: IFixPriority[] = Array.isArray(parsed.fixPriorities)
    ? (parsed.fixPriorities as unknown[]).map((fp: unknown) => {
        const f = fp as Record<string, unknown>;
        return {
          issue: String(f?.issue ?? ""),
          impact: String(f?.impact ?? ""),
          suggestion: String(f?.suggestion ?? ""),
        };
      }).slice(0, 3)
    : [];

  const result: IWritingAnalysisResult = {
    level,
    score: scoreBreakdown,
    errors,
    exercises: Array.isArray(parsed.exercises) ? (parsed.exercises as IWritingAnalysisResult["exercises"]) : undefined,
    summary: String(parsed.summary ?? ""),
    feedback: String(parsed.feedback ?? ""),
    nativeTip: parsed.nativeTip != null ? String(parsed.nativeTip) : undefined,
    rewrite: parsed.rewrite != null ? String(parsed.rewrite) : undefined,
    nativeScore: parsed.nativeScore != null ? Math.min(100, Math.max(0, Number(parsed.nativeScore))) : undefined,
    fixPriorities: fixPriorities.length > 0 ? fixPriorities : undefined,
  };
  return result;
}

/**
 * Analyze reading passage — primary: Claude (unchanged)
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

  const level = (parsed.level as HSKLevel) ?? (`HSK${hskLevel}` as HSKLevel);

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
