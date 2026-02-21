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
  SYSTEM_PROMPT_EXERCISE,
  USER_PROMPT_EXERCISE,
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
      level: `HSK${hskLevel >= 6 ? 6 : hskLevel}` as HSKLevel,
      score: { total: 92, grammar: 23, vocabulary: 24, coherence: 22, native: 23, passed: true },
      errors: [
        { 
          id: "err-1", 
          type: "ระดับภาษา (Formal Tone)", 
          category: "vocabulary", 
          severity: "important", 
          original: "我们必须保护环境", 
          suggestion: "我们应当致力于环境保护", 
          explanation: "ในระดับ HSK 6 ควรใช้คำที่เป็นทางการมากขึ้น เช่น 致力于 (อุทิศตนเพื่อ/มุ่งมั่นเพื่อ) แทนคำพื้นฐาน", 
          position: { start: 10, end: 18 } 
        },
        { 
          id: "err-2", 
          type: "ความเชื่อมโยง (Coherence)", 
          category: "grammar", 
          severity: "minor", 
          original: "不仅要种树，也要减少污染", 
          suggestion: "不仅仅要植树造林，更要从源头上减少污染", 
          explanation: "การใช้สำนวน 植树造林 (ปลูกป่า) และ 更 (ยิ่งไปกว่านั้น) จะช่วยให้ประโยคดูสละสลวยและสื่อความหมายได้ลึกซึ้งกว่า", 
          position: { start: 25, end: 38 } 
        }
      ],
      summary: "การเขียนนี้แสดงถึงความเข้าใจในระดับ HSK 6 ได้ดีมาก มีการใช้ไวยากรณ์ขั้นสูงและความเชื่อมโยงที่ชัดเจน (Demo Analysis)",
      feedback: "คุณมีความสามารถในการใช้คำศัพท์เฉพาะทางได้ดี แต่ควรระวังเรื่องการเลือกใช้ระดับภาษา (Register) ให้เหมาะสมกับบริบทที่เป็นทางการมากขึ้น",
      nativeTip: "คนจีนนิยมใช้ 成语 (สำนวน 4 ตัว) เพื่อยกระดับความน่าเชื่อถือของบทความวิจัยหรือเรียงความเชิงวิชาการ",
      rewrite: "在当前全球化发展的背景下，环境保护已成为各国政府亟待解决的首要任务。我们不仅仅要致力于植树造林、绿化家园，更要从源头上采取有效措施减少工业污染。只有加强国际合作，才能共同构建人类命运共同体，实现可持续发展的长远目标。",
      nativeScore: 95,
      fixPriorities: [
        { issue: "ระดับภาษา (Static level)", impact: "High", suggestion: "ใช้คำจำพวก 致力于, 亟待 แทนคำกริยาพื้นฐาน" },
        { issue: "ความคล่องแคล่ว (Fluency)", impact: "Medium", suggestion: "พยายามใช้สำนวน สี่ตัว (Cheng-yu) ในบทสรุป" }
      ]
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
      level: `HSK${hskLevel >= 5 ? hskLevel : 5}` as HSKLevel,
      summary: "บทความวิเคราะห์ถึงผลกระทบของการพัฒนาเทคโนโลยีปัญญาประดิษฐ์ (AI) ที่มีต่อระบบการศึกษาในศตวรรษที่ 21 รวมถึงความท้าทายและการปรับตัวของบุคลากร (Demo Analysis)",
      vocabulary: [
        { word: "人工智能", pinyin: "réngōng zhìnéng", meaning: "ปัญญาประดิษฐ์ (AI)", example: "人工智能正在改变我们的生活方式。", hskLevel: 6 },
        { word: "飞速", pinyin: "fēisù", meaning: "อย่างรวดเร็ว (ดั่งบิน)", example: "科技正在飞速发展。", hskLevel: 5 },
        { word: "核心", pinyin: "héxīn", meaning: "แกนกลาง/หัวใจสำคัญ", example: "技术创新是教育变革的核心。", hskLevel: 5 }
      ],
      questions: [
        { 
          id: "q-1", 
          question: "根据这段文字，技术对教育的主要影响是什么？", 
          options: ["取代教师的所有工作", "改变学习和教学的方式", "降低学生的学习兴趣", "减少教育成本"], 
          correctIndex: 1, 
          explanation: "ในบทความเน้นเรื่องการเปลี่ยนแปลงรูปแบบการเรียนการสอน (改变学习和教学的方式) มากกว่าการเข้ามาแทนที่ครูทั้งหมด" 
        },
        { 
          id: "q-2", 
          question: "文中提到的‘核心’一词是指什么？", 
          options: ["技术的速度", "教育的变革", "创新的地位", "人类的智力"], 
          correctIndex: 2, 
          explanation: "คำว่า 核心 (Core) ในที่นี้ใช้ขยายคำว่า 创新 (Innovation) เพื่อบอกว่าเป็นหัวใจสำคัญของการเปลี่ยนแปลง" 
        }
      ],
      difficultWords: [
        { word: "人工智能", commonMistake: "เข้าใจว่าเป็นแค่คอมพิวเตอร์ธรรมดา", correct: "เน้นกระบวนการเลียนแบบสติปัญญาของมนุษย์" },
        { word: "飞速", commonMistake: "ใช้กับการเคลื่อนที่ของวัตถุเท่านั้น", correct: "สามารถใช้กับการพัฒนาก้าวหน้า (Development) ได้ด้วย" }
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
        id: "ex-1",
        type: "multiple-choice",
        question: "选出最合适的词语：面对复杂的情况，我们应当______，不要自乱阵脚。",
        options: ["沉着冷静", "致力于", "飞速发展", "欣喜若狂"],
        answer: "沉着冷静",
        explanation: "ในสถานการณ์ที่ซับซ้อน (复杂的情况) ควรทำตัว 'สงบนิ่งและเยือกเย็น' (沉着冷静) เพื่อไม่ให้สับสน",
        targetPattern: "HSK 6 Formal Adverbs"
      },
      {
        id: "ex-2",
        type: "fill-blank",
        question: "这项技术的研发大大______了生产效率。(A. 致力于 B. 提高了 C. 改善了 D. 增加了)",
        options: ["A", "B", "C", "D"],
        answer: "B",
        explanation: "คำว่า 效率 (Efficiency) นิยมใช้คู่กับตัวเลือก B (提高 - ยกระดับ/เพิ่มขึ้น)",
        targetPattern: "Collocation Patterns"
      }
    ];
  }

  const system = SYSTEM_PROMPT_EXERCISE;
  const user = USER_PROMPT_EXERCISE(weakPatterns, hskTarget);
  
  const raw = await callClaude(system, user);
  if (!raw) return null;

  const parsed = parseJson<{ exercises: IWritingAnalysisResult["exercises"] }>(raw);
  if (!parsed || !Array.isArray(parsed.exercises)) {
    return null;
  }

  return parsed.exercises;
}
