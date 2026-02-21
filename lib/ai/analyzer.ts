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
import { getWordLevel } from "../hsk/validator";
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
  // Master Plan Phase 6: Demo Fail-Safe Mode
  if (process.env.DEMO_MODE === "true") {
    console.log("[Demo Mode] Returning mock writing analysis response.");
    return {
      level: `HSK${hskLevel}` as HSKLevel,
      score: { total: 85, grammar: 22, vocabulary: 21, coherence: 22, native: 20, passed: true },
      errors: [
        { id: "demo-1", type: "คำศัพท์", category: "vocabulary", severity: "minor", original: "高幸", suggestion: "高兴", explanation: "สะกดผิด คำว่า ดีใจ คือ 高兴", position: { start: 0, end: 2 } }
      ],
      summary: "สำหรับการเขียนครั้งนี้ทำได้ดีมากครับ (Demo)",
      feedback: "เขียนได้ลื่นไหลและใช้โครงสร้างประโยคที่ถูกต้อง",
      nativeTip: "คนไทยมักสะกดคำว่า 高兴 ผิดบ่อยๆ",
      rewrite: "我今天很高兴。(Demo Rewrite)",
      nativeScore: 88,
    };
  }

  let deepseekContext: string | undefined;
  try {
    const dsResult = await callDeepSeek(
      `You are a strict Chinese parsing engine. Check for grammar and wording. Return plain text notes.`,
      `Text:\n${essay}`
    );
    if (dsResult) {
      deepseekContext = dsResult;
    }
  } catch (err) {
    console.error("[DeepSeek pipeline] Failed, falling back directly to Claude.", err);
  }

  const system = SYSTEM_PROMPT_WRITING;
  const user = USER_PROMPT_WRITING(hskLevel, essay, deepseekContext);
  
  let raw: string | null = null;
  // Master plan 1.2 Failure Safe Logic: invalid JSON -> retry once
  let retryCount = 0;
  
  while (retryCount < 2) {
    raw = await callClaude(system, user);
    if (!raw) {
      retryCount++;
      continue;
    }
    
    const parsedTest = parseJson<Record<string, unknown>>(raw);
    if (!parsedTest || !Array.isArray(parsedTest.errors)) {
      console.warn(`[Claude pipeline] Invalid JSON format. Retry: ${retryCount + 1}`);
      retryCount++;
      continue;
    }
    break; // Success
  }

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
  // Master Plan Phase 6: Demo Fail-Safe Mode
  if (process.env.DEMO_MODE === "true") {
    console.log("[Demo Mode] Returning mock reading analysis response.");
    return {
      level: `HSK${hskLevel}` as HSKLevel,
      summary: "บทความนี้พูดถึงการท่องเที่ยวในปักกิ่ง (Demo Summary)",
      vocabulary: [
        { word: "北京", pinyin: "Běijīng", meaning: "ปักกิ่ง", example: "我住在北京。" }
      ],
      questions: [
        { id: "demo-q1", question: "บทความนี้พูดถึงเมืองอะไร?", options: ["เซี่ยงไฮ้", "ปักกิ่ง", "หางโจว", "เฉิงตู"], correctIndex: 1, explanation: "ในบทความระบุชัดเจนว่าท่องเที่ยวในปักกิ่ง" }
      ],
      difficultWords: [
        { word: "北京", commonMistake: "ไป๋จิง", correct: "เป่ยจิง" }
      ]
    };
  }

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
    const word = String(x?.word ?? "");
    // Cross-reference with our strict 2025 list
    const actualLevel = getWordLevel(word);
    
    return {
      word,
      pinyin: String(x?.pinyin ?? ""),
      meaning: String(x?.meaning ?? ""),
      thaiTip: x?.thaiTip != null ? String(x.thaiTip) : undefined,
      example: x?.example != null ? String(x.example) : undefined,
      hskLevel: actualLevel !== null ? actualLevel : (x?.hskLevel != null ? Number(x.hskLevel) : undefined),
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

/**
 * Generate Personalized Exercises — primary: Claude
 */
export async function generateExercises(
  weakPatterns: string,
  hskTarget: number
): Promise<IWritingAnalysisResult["exercises"] | null> {
  // Master Plan Phase 6: Demo Fail-Safe Mode
  if (process.env.DEMO_MODE === "true") {
    console.log("[Demo Mode] Returning mock exercise response.");
    return [
      {
        id: "demo-ex-1",
        type: "multiple-choice",
        question: "ฉันชอบกินแอปเปิ้ล (ภาษาจีนคือ?)",
        options: ["我喜欢吃苹果", "我喜欢看苹果", "我喜欢买苹果", "我喜欢做苹果"],
        answer: "我喜欢吃苹果",
        explanation: "คำว่า 'กิน' คือ 吃 (chī)",
        targetPattern: "Basic Vocabulary"
      }
    ];
  }

  const system = import("./prompts").then((m) => m.SYSTEM_PROMPT_EXERCISE);
  const user = import("./prompts").then((m) => m.USER_PROMPT_EXERCISE(weakPatterns, hskTarget));
  
  const raw = await callClaude(await system, await user);
  if (!raw) return null;

  const parsed = parseJson<{ exercises: IWritingAnalysisResult["exercises"] }>(raw);
  if (!parsed || !Array.isArray(parsed.exercises)) {
    return null;
  }

  return parsed.exercises;
}
