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

  // Rich vocabulary data — 15 cards per level for comprehensive practice
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
        example: "他竟然不知道这件事。",
        thaiTip: "แสดงความประหลาดใจ",
      },
      {
        word: "肯定",
        pinyin: "kěndìng",
        meaning: "แน่นอน / ยืนยัน",
        example: "我肯定他会来。",
        thaiTip: "ใช้เป็นได้ทั้ง Adj และ Verb",
      },
      {
        word: "尽管",
        pinyin: "jǐnguǎn",
        meaning: "ถึงแม้ว่า / เชิญตามสบาย",
        example: "尽管天气很冷，他还是去跑步了。",
        thaiTip: "คล้าย 虽然 แต่เน้นกว่า ใช้คู่กับ 还是/但是",
      },
      {
        word: "难免",
        pinyin: "nánmiǎn",
        meaning: "หลีกเลี่ยงไม่ได้",
        example: "刚开始学，犯错是难免的。",
        thaiTip: "ใช้กับสิ่งที่ไม่ดีที่เลี่ยงไม่ได้",
      },
      {
        word: "否则",
        pinyin: "fǒuzé",
        meaning: "มิฉะนั้น / ไม่เช่นนั้น",
        example: "你要早点出发，否则会迟到。",
        thaiTip: "ใช้เชื่อมประโยคเตือน คล้าย 'ไม่งั้น'",
      },
      {
        word: "果然",
        pinyin: "guǒrán",
        meaning: "จริงอย่างที่คาดไว้",
        example: "天气预报说会下雨，果然下了。",
        thaiTip: "ตรงข้ามกับ 竟然 (คาดว่าจะเป็น vs ไม่คาดว่าจะเป็น)",
      },
      {
        word: "既然",
        pinyin: "jìrán",
        meaning: "ในเมื่อ / เนื่องจากว่า",
        example: "既然你不想去，那就别去了。",
        thaiTip: "ใช้คู่กับ 就 เสมอ",
      },
      {
        word: "逐渐",
        pinyin: "zhújiàn",
        meaning: "ค่อยๆ / ทีละน้อย",
        example: "他的中文水平逐渐提高了。",
        thaiTip: "เป็นทางการกว่า 慢慢",
      },
      {
        word: "反而",
        pinyin: "fǎn'ér",
        meaning: "กลับกัน / ตรงกันข้าม",
        example: "吃了药，病反而更严重了。",
        thaiTip: "ผลลัพธ์ตรงข้ามกับที่คาดไว้",
      },
      {
        word: "毕竟",
        pinyin: "bìjìng",
        meaning: "ท้ายที่สุดแล้ว / อย่างไรก็ตาม",
        example: "他毕竟是你的父亲，你应该尊重他。",
        thaiTip: "ใช้เหตุผลสนับสนุน คล้าย 'ยังไงก็'",
      },
      {
        word: "何况",
        pinyin: "hékuàng",
        meaning: "ยิ่งกว่านั้น / นับประสาอะไร",
        example: "大人都做不到，何况小孩？",
        thaiTip: "ใช้คู่ 连...都 ได้",
      },
      {
        word: "显然",
        pinyin: "xiǎnrán",
        meaning: "เห็นได้ชัดว่า",
        example: "他显然没有准备好。",
        thaiTip: "ใช้หน้าประโยคได้เลย = Obviously",
      },
      {
        word: "似乎",
        pinyin: "sìhū",
        meaning: "ดูเหมือนว่า",
        example: "他似乎不太高兴。",
        thaiTip: "ทางการกว่า 好像",
      },
      {
        word: "总之",
        pinyin: "zǒngzhī",
        meaning: "โดยรวมแล้ว / สรุปว่า",
        example: "总之，我不同意这个计划。",
        thaiTip: "ใช้สรุปท้ายย่อหน้า = In short",
      },
    ],
    5: [
      {
        word: "仿佛",
        pinyin: "fǎngfú",
        meaning: "ราวกับว่า",
        example: "他仿佛没听到我说话。",
        thaiTip: "ใช้ในภาษาเขียนบ่อยกว่า 好像",
      },
      {
        word: "恭喜",
        pinyin: "gōngxǐ",
        meaning: "ยินดีด้วย",
        example: "恭喜你发财！",
        thaiTip: "ใช้ซ้ำกันเป็น 恭喜恭喜 ได้",
      },
      {
        word: "未必",
        pinyin: "wèibì",
        meaning: "ไม่จำเป็นต้อง / ไม่แน่",
        example: "贵的东西未必好。",
        thaiTip: "ตรงข้ามกับ 一定, ใช้ปฏิเสธอย่างสุภาพ",
      },
      {
        word: "难怪",
        pinyin: "nánguài",
        meaning: "ไม่แปลกเลย / เพราะอย่างนี้เอง",
        example: "难怪他今天没来，原来生病了。",
        thaiTip: "ใช้เมื่อเข้าใจเหตุผลแล้ว = No wonder",
      },
      {
        word: "何必",
        pinyin: "hébì",
        meaning: "จำเป็นอะไร / ไม่จำเป็นต้อง",
        example: "何必那么着急呢？",
        thaiTip: "ใช้ถามเชิงแนะนำ = Why bother?",
      },
      {
        word: "迫不及待",
        pinyin: "pòbùjídài",
        meaning: "รอไม่ไหว / กระวนกระวาย",
        example: "他迫不及待地打开了礼物。",
        thaiTip: "สำนวน 4 พยางค์ (成语) ที่ใช้บ่อยมาก",
      },
      {
        word: "恐怕",
        pinyin: "kǒngpà",
        meaning: "เกรงว่า / น่าจะ",
        example: "恐怕我们要迟到了。",
        thaiTip: "ไม่ได้แปลว่า 'กลัว' อย่างเดียว ใช้เดาได้",
      },
      {
        word: "不由得",
        pinyin: "bùyóude",
        meaning: "อดไม่ได้ที่จะ",
        example: "听到这个消息，她不由得哭了。",
        thaiTip: "= 忍不住 (อดไม่ได้)",
      },
      {
        word: "从而",
        pinyin: "cóng'ér",
        meaning: "จึง / ดังนั้น (ผลที่ตามมา)",
        example: "他努力学习，从而取得了好成绩。",
        thaiTip: "ทางการกว่า 所以, ใช้ในภาษาเขียน",
      },
      {
        word: "不禁",
        pinyin: "bùjīn",
        meaning: "อดไม่ได้ / โดยไม่รู้ตัว",
        example: "他不禁笑了起来。",
        thaiTip: "คล้าย 不由得 แต่มักใช้กับอารมณ์",
      },
      {
        word: "究竟",
        pinyin: "jiūjìng",
        meaning: "แท้จริงแล้ว / กันแน่",
        example: "你究竟想要什么？",
        thaiTip: "ใช้เน้นคำถาม = ตกลง...มันคืออะไรกันแน่",
      },
      {
        word: "一旦",
        pinyin: "yīdàn",
        meaning: "หากว่า / ทันทีที่",
        example: "一旦做出决定，就不能改了。",
        thaiTip: "ใช้คู่กับ 就 เสมอ, เน้นว่าเกิดขึ้นแล้วกลับไม่ได้",
      },
      {
        word: "宁可",
        pinyin: "nìngkě",
        meaning: "สู้...ดีกว่า / ยอม...ดีกว่า",
        example: "我宁可走路，也不坐他的车。",
        thaiTip: "ใช้คู่กับ 也不 = ยอม A ดีกว่า B",
      },
      {
        word: "以免",
        pinyin: "yǐmiǎn",
        meaning: "เพื่อเลี่ยง / เพื่อไม่ให้",
        example: "你早点出发，以免迟到。",
        thaiTip: "ใช้ต่อท้ายคำแนะนำ = lest / to avoid",
      },
      {
        word: "无论",
        pinyin: "wúlùn",
        meaning: "ไม่ว่า...ก็",
        example: "无论你去哪儿，我都跟着你。",
        thaiTip: "ใช้คู่กับ 都/也 เสมอ, ทางการกว่า 不管",
      },
    ],
    6: [
      {
        word: "譬如",
        pinyin: "pìrú",
        meaning: "ตัวอย่างเช่น",
        example: "譬如说，你可以选择坐飞机或火车。",
        thaiTip: "ภาษาทางการของ 比如",
      },
      {
        word: "倘若",
        pinyin: "tǎngruò",
        meaning: "หากว่า / สมมติว่า",
        example: "倘若明天下雨，我们就改期。",
        thaiTip: "ทางการกว่า 如果, ใช้ในภาษาเขียน",
      },
      {
        word: "不妨",
        pinyin: "bùfáng",
        meaning: "ลอง...ก็ได้ / ไม่เสียหายที่จะ",
        example: "你不妨试试这种方法。",
        thaiTip: "ใช้แนะนำอย่างสุภาพ = might as well",
      },
      {
        word: "固然",
        pinyin: "gùrán",
        meaning: "แม้จะ...ก็จริง (แต่...)",
        example: "钱固然重要，但健康更重要。",
        thaiTip: "ใช้ยอมรับข้อดี + ตามด้วย 但是 ชี้ข้อเสีย",
      },
      {
        word: "索性",
        pinyin: "suǒxìng",
        meaning: "เลยทำไปเลย / สู้ทำ...ไปเลย",
        example: "既然来了，索性多待几天。",
        thaiTip: "ตัดสินใจทำอะไรไปเลย = might as well just",
      },
      {
        word: "莫非",
        pinyin: "mòfēi",
        meaning: "หรือว่า / ไม่ใช่ว่า...หรอ",
        example: "莫非你已经知道了？",
        thaiTip: "ใช้เดาอย่างประหลาดใจ = Could it be that...?",
      },
      {
        word: "与其",
        pinyin: "yǔqí",
        meaning: "แทนที่จะ...สู้...ดีกว่า",
        example: "与其抱怨，不如行动。",
        thaiTip: "ใช้คู่กับ 不如 เสมอ",
      },
      {
        word: "不免",
        pinyin: "bùmiǎn",
        meaning: "หลีกเลี่ยงไม่ได้ / ย่อม",
        example: "第一次做，不免有些紧张。",
        thaiTip: "คล้าย 难免 แต่ทางการกว่า",
      },
      {
        word: "诸如",
        pinyin: "zhūrú",
        meaning: "เช่น (หลายอย่าง)",
        example: "诸如此类的问题还有很多。",
        thaiTip: "ทางการกว่า 比如, ใช้ยกตัวอย่างหลายๆ อัน",
      },
      {
        word: "势必",
        pinyin: "shìbì",
        meaning: "จะต้อง / ย่อมเป็นไปอย่างนั้น",
        example: "不改革，势必落后。",
        thaiTip: "ผลที่ต้องเกิดขึ้นแน่นอน = inevitably",
      },
      {
        word: "无非",
        pinyin: "wúfēi",
        meaning: "ก็แค่ / ไม่มีอะไรนอกจาก",
        example: "他无非是想引起你的注意。",
        thaiTip: "ลดความสำคัญ = nothing more than",
      },
      {
        word: "一味",
        pinyin: "yīwèi",
        meaning: "แต่เพียงอย่างเดียว / มัวแต่",
        example: "不能一味地依赖别人。",
        thaiTip: "เชิงตำหนิ = blindly / only doing X",
      },
      {
        word: "岂不",
        pinyin: "qǐbù",
        meaning: "ไม่ใช่หรอ / มิใช่...หรอกหรือ",
        example: "这样做岂不是更好？",
        thaiTip: "ใช้ถามเชิงวาทศิลป์ = Wouldn't it be...?",
      },
      {
        word: "未免",
        pinyin: "wèimiǎn",
        meaning: "ค่อนข้างจะ...เกินไป",
        example: "你这样说未免太过分了。",
        thaiTip: "เชิงวิจารณ์ = rather too much",
      },
      {
        word: "不得已",
        pinyin: "bùdéyǐ",
        meaning: "จำเป็นจำใจ / ไม่มีทางเลือก",
        example: "我是不得已才这样做的。",
        thaiTip: "= ทำเพราะจำเป็น ไม่ได้อยากทำ",
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
