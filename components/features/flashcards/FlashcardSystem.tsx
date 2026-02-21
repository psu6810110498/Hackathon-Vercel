"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Brain,
  Layers,
  Sparkles,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Flashcard {
  word: string;
  pinyin: string;
  meaning: string;
  example?: string;
  thaiTip?: string;
}

type HSKLevel = 4 | 5 | 6;
type Category = "all" | "vocabulary" | "grammar" | "mistakes";

export function FlashcardSystem() {
  const [level, setLevel] = useState<HSKLevel>(4);
  const [category, setCategory] = useState<Category>("all");
  const [isStarted, setIsStarted] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, unsure: 0 });

  // Mock data for initial implementation - will be connected to API later
  const mockCards: Record<HSKLevel, Flashcard[]> = {
    4: [
      {
        word: "即便",
        pinyin: "jíbiàn",
        meaning: "ถึงแม้ว่า",
        example: "即便下雨，我也要去。",
        thaiTip: "มักใช้คู่กับ 也",
      },
      {
        word: "竟然",
        pinyin: "jìngrán",
        meaning: "คิดไม่ถึงว่า / กลับ (ปรากฏว่า)",
        example: "他竟然不知道這件事。",
        thaiTip: "แสดงความประหลาดใจ",
      },
      {
        word: "肯定",
        pinyin: "kěndìng",
        meaning: "แน่นอน / ยืนยัน",
        example: "我肯定他會來。",
        thaiTip: "ใช้เป็นได้ทั้ง Adj และ Verb",
      },
    ],
    5: [
      {
        word: "仿佛",
        pinyin: "fǎngfú",
        meaning: "ราวกับว่า",
        example: "他仿佛沒聽到我說話。",
        thaiTip: "ใช้ในภาษาเขียนบ่อยกว่า 好像",
      },
      {
        word: "恭喜",
        pinyin: "gōngxǐ",
        meaning: "ยินดีด้วย",
        example: "恭喜你發財！",
        thaiTip: "ใช้ซ้ำกันเป็น 恭喜恭喜 ได้",
      },
    ],
    6: [
      {
        word: "譬如",
        pinyin: "pìrú",
        meaning: "ตัวอย่างเช่น",
        example: "譬如說...",
        thaiTip: "ภาษาทางการของ 比如",
      },
    ],
  };

  const startSession = () => {
    // In a real app, this would fetch from /api/flashcards?level=x&category=y
    setCards(mockCards[level]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsStarted(true);
    setStats({ correct: 0, wrong: 0, unsure: 0 });
  };

  const handleScore = (type: "correct" | "wrong" | "unsure") => {
    setStats((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    } else {
      // Finished
      setIsStarted(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-black text-white shadow-2xl shadow-black/20">
            <Layers size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Flashcards อัจฉริยะ
          </h1>
          <p className="text-zinc-500 max-w-sm mx-auto">
            เลือกเป้าหมายและโหมดที่คุณต้องการฝึกฝน
            ระบบจะดัดแปลงตามความก้าวหน้าของคุณ
          </p>
        </div>

        <div className="grid gap-6 p-8 rounded-[32px] border border-black/[0.03] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
            <Sparkles size={120} />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
              ระดับ HSK
            </label>
            <div className="flex gap-2 p-1 rounded-xl bg-zinc-50 border border-black/5">
              {[4, 5, 6].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l as HSKLevel)}
                  className={cn(
                    "flex-1 py-3 rounded-lg text-sm font-semibold transition-all",
                    level === l
                      ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                      : "text-zinc-400 hover:text-zinc-600",
                  )}
                >
                  HSK {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
              หมวดหมู่
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "all", label: "ทั้งหมด", icon: Layers },
                { id: "vocabulary", label: "คำศัพท์", icon: Command },
                { id: "grammar", label: "ไวยากรณ์", icon: Brain },
                { id: "mistakes", label: "จุดที่เคยผิด", icon: XCircle },
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id as Category)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all text-left",
                      category === cat.id
                        ? "bg-black text-white border-black"
                        : "bg-white border-black/[0.05] text-zinc-600 hover:border-black/20 hover:bg-zinc-50",
                    )}
                  >
                    <Icon
                      size={18}
                      className={
                        category === cat.id ? "text-white" : "text-zinc-400"
                      }
                    />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={startSession}
            className="w-full h-14 rounded-2xl bg-black text-white hover:bg-zinc-800 text-lg font-semibold mt-4 shadow-xl shadow-black/10 active:scale-[0.98] transition-all"
          >
            เริ่มฝึกฝน
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-xl mx-auto h-[600px] flex flex-col pt-4">
      {/* Top Bar Stats */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsStarted(false)}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-400 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Session Progress
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-black">
                {currentIndex + 1} / {cards.length}
              </span>
              <div className="w-24 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / cards.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 font-mono">
              {stats.correct}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100">
            <XCircle size={12} className="text-rose-500" />
            <span className="text-[10px] font-bold text-rose-600 font-mono">
              {stats.wrong}
            </span>
          </div>
        </div>
      </div>

      {/* Card Wrapper */}
      <div
        className="flex-1 relative perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={cn(
            "w-full h-full relative transition-all duration-500 preserve-3d shadow-2xl rounded-[32px]",
            isFlipped ? "rotate-y-180" : "",
          )}
        >
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-[32px] border border-black/5 flex flex-col items-center justify-center p-8">
            <div className="absolute top-8 left-8 p-3 rounded-full bg-blue-50/50 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <RotateCcw size={16} />
            </div>
            <h2 className="text-7xl font-bold text-black mb-4 tracking-tighter">
              {currentCard.word}
            </h2>
            <p className="text-zinc-300 text-sm font-medium tracking-widest uppercase">
              Tap to reveal
            </p>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-[32px] border border-black/5 flex flex-col p-8 overflow-hidden">
            {/* Glossy Overlay */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-black/5 to-transparent" />

            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                  Pinyin
                </span>
                <p className="text-2xl font-semibold text-black mt-2 tracking-tight">
                  {currentCard.pinyin}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">
                  Native Tip
                </span>
                <p className="text-xs font-medium text-emerald-700 mt-2 max-w-[120px]">
                  {currentCard.thaiTip}
                </p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                  Meaning (Thai)
                </label>
                <div className="text-2xl font-bold text-black leading-tight">
                  {currentCard.meaning}
                </div>
              </div>

              {currentCard.example && (
                <div className="bg-zinc-50 rounded-2xl p-5 border border-black/[0.03]">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-3">
                    Example Usage
                  </label>
                  <p className="text-xl text-black font-medium leading-relaxed mb-1">
                    {currentCard.example}
                  </p>
                  <p className="text-[10px] text-zinc-400 italic">
                    Extracted from your previous writing errors
                  </p>
                </div>
              )}
            </div>

            <p className="text-center text-zinc-300 text-[10px] font-mono mt-4 uppercase tracking-widest">
              Tap to flip back
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className={cn(
          "flex gap-3 mt-8 transition-all duration-300 h-16",
          isFlipped
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScore("wrong");
          }}
          className="flex-1 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
        >
          <XCircle size={18} /> จำไม่ได้
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScore("unsure");
          }}
          className="flex-1 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors"
        >
          <HelpCircle size={18} /> ไม่แน่ใจ
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleScore("correct");
          }}
          className="flex-1 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
        >
          <CheckCircle2 size={18} /> จำได้แม่น
        </button>
      </div>
      <div
        className={cn(
          "flex items-center justify-center mt-8 text-zinc-400 transition-all duration-300",
          isFlipped ? "opacity-0" : "opacity-100",
        )}
      >
        <p className="text-xs font-medium flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full border border-black/5">
          <Sparkles size={12} /> คลิกที่บัตรเพื่อดูเฉลย
        </p>
      </div>
    </div>
  );
}
