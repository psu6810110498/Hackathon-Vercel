"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  HelpCircle,
  PenLine,
  BookOpen,
  Headphones,
} from "lucide-react";
import { IHskExam, IHskSection } from "@/lib/hsk/types";
import { cn } from "@/lib/utils/cn";

interface MockExamPlayerProps {
  exam: IHskExam;
}

export function MockExamPlayer({ exam }: MockExamPlayerProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(exam.totalTime * 60);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);

  // Audio State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const currentSection = exam.sections[currentSectionIndex];

  // Timer Effect
  useEffect(() => {
    if (isExamStarted && !isExamFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isExamFinished) {
      handleFinish();
    }
  }, [isExamStarted, isExamFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatAudioTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentProgress =
    (Object.keys(answers).length /
      exam.sections.reduce((acc, s) => acc + s.questions.length, 0)) *
    100;

  const handleStart = () => setIsExamStarted(true);

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleFinish = () => {
    setIsExamFinished(true);
    if (audioRef.current) audioRef.current.pause();
  };

  const goToSection = (index: number) => {
    if (index >= 0 && index < exam.sections.length) {
      setCurrentSectionIndex(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!isExamStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center page-enter">
        <div className="bg-white bento-card p-10 max-w-2xl w-full">
          <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen size={40} />
          </div>
          <h1 className="text-3xl font-heading mb-4 text-black">
            Mock Exam: {exam.id}
          </h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-zinc-50 rounded-2xl border border-black/5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono mb-1">
                Time
              </p>
              <p className="text-xl font-bold text-black">{exam.totalTime}m</p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-black/5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono mb-1">
                Level
              </p>
              <p className="text-xl font-bold text-black">HSK {exam.level}</p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-black/5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono mb-1">
                Questions
              </p>
              <p className="text-xl font-bold text-black">
                {exam.sections.reduce((acc, s) => acc + s.questions.length, 0)}
              </p>
            </div>
          </div>
          <div className="text-left space-y-4 mb-10 text-zinc-600 text-sm">
            <p className="flex items-start gap-3">
              <span className="h-5 w-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={12} />
              </span>
              จำลองสถานการณ์จริง: ระบบจะนับเวลาถอยหลังและล็อคการส่งเมื่อหมดเวลา
            </p>
            <p className="flex items-start gap-3">
              <span className="h-5 w-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={12} />
              </span>
              พาร์ทการฟังจะมีไฟล์เสียงให้คุณควบคุมได้เอง
            </p>
            <p className="flex items-start gap-3">
              <span className="h-5 w-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <HelpCircle size={12} />
              </span>
              คำแนะนำ: ตรวจสอบความพร้อมของอินเทอร์เน็ตและหูฟังก่อนเริ่ม
            </p>
          </div>
          <button
            onClick={handleStart}
            className="w-full bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
          >
            Start Exam Now
          </button>
        </div>
      </div>
    );
  }

  if (isExamFinished) {
    // Basic Result Calculation
    let score = 0;
    let totalQuestions = 0;
    exam.sections.forEach((section) => {
      section.questions.forEach((q) => {
        if (q.type !== "writing") {
          totalQuestions++;
          if (q.type === "multiple-choice" && answers[q.id] === q.correctIndex)
            score++;
          if (
            q.type === "ordering" &&
            String(answers[q.id]).trim().replace(/\s/g, "") ===
              String(q.correctAnswer).trim().replace(/\s/g, "")
          )
            score++;
        }
      });
    });

    return (
      <div className="max-w-4xl mx-auto page-enter py-10">
        <div className="bg-white bento-card p-10 text-center">
          <div className="h-20 w-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-heading mb-2 text-black">
            Exam Submitted!
          </h1>
          <p className="text-zinc-500 mb-10">
            ระบบได้รับชุดข้อสอบ {exam.id} ของคุณแล้ว
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-zinc-50 rounded-2xl border border-black/5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono mb-2">
                Estimated Score
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-black">{score}</span>
                <span className="text-zinc-400">/ {totalQuestions}</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2">
                Objective Sections Only
              </p>
            </div>
            <div className="p-6 bg-zinc-50 rounded-2xl border border-black/5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono mb-2">
                Time Used
              </p>
              <p className="text-4xl font-bold text-black">
                {exam.totalTime - Math.floor(timeLeft / 60)}m
              </p>
              <p className="text-[10px] text-zinc-400 mt-2">
                of {exam.totalTime}m budget
              </p>
            </div>
            <div className="p-6 bg-zinc-50 rounded-2xl border border-black/5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono mb-2">
                Completion
              </p>
              <p className="text-4xl font-bold text-black">
                {Math.round(currentProgress)}%
              </p>
              <p className="text-[10px] text-zinc-400 mt-2">
                Answered questions
              </p>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-2xl p-6 text-left mb-10 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  What&apos;s next?
                </h4>
                <p className="text-sm text-blue-800/70 leading-relaxed">
                  พาร์ทการเขียน (Writing) กำลังถูกส่งไปให้ AI ประเมินผลเชิงลึก
                  คะแนนตัวอย่างนี้เป็นเพียงคะแนนจากพาร์ทการฟังและการอ่านเท่านั้น
                  ผลวิเคราะห์ฉบับสมบูรณ์จะอัปเดตใน Dashboard ของคุณภายใน 1-2
                  นาที
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 bg-black text-white py-4 rounded-2xl font-semibold hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.98]"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/dashboard/history"
              className="flex-1 bg-white items-center justify-center flex gap-2 border border-black/10 py-4 rounded-2xl font-semibold hover:bg-zinc-50 transition-all active:scale-[0.98]"
            >
              View Detailed Review
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-32">
      {/* ── Fixed Header ── */}
      <div className="sticky top-[60px] z-50 bg-white/80 backdrop-blur-md border-b border-black/5 mb-8 -mx-4 px-4 py-4 md:-mx-8 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <h2 className="font-heading text-xl text-black flex items-center gap-2">
              <span className="text-zinc-400 font-mono text-sm">{exam.id}</span>
              <span className="hidden sm:inline">Mock Exam</span>
            </h2>
            <div className="h-4 w-[1px] bg-black/10 hidden sm:block" />
            <div className="flex items-center gap-2 text-zinc-600 bg-zinc-100/50 px-3 py-1 rounded-full text-sm">
              <Clock
                size={14}
                className={timeLeft < 300 ? "text-rose-500 animate-pulse" : ""}
              />
              <span
                className={cn(
                  "font-mono font-medium",
                  timeLeft < 300 ? "text-rose-600" : "text-black",
                )}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1 mr-4">
              {exam.sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => goToSection(idx)}
                  className={cn(
                    "px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-all",
                    currentSectionIndex === idx
                      ? "bg-black text-white"
                      : "text-zinc-400 hover:text-black hover:bg-zinc-100",
                  )}
                >
                  {section.title.split(" ")[0]}
                </button>
              ))}
            </div>
            <button
              onClick={handleFinish}
              className="bg-black text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-800 flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Send size={15} />
              Finish Test
            </button>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="absolute bottom-0 left-0 h-[3px] bg-blue-500/20 w-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* ── Main Question Area ── */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bento-card p-6 md:p-8 bg-white page-enter">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-zinc-50 border border-black/5 rounded-xl flex items-center justify-center text-black">
                {currentSection.id === "listening" ? (
                  <Headphones size={20} />
                ) : currentSection.id === "reading" ? (
                  <BookOpen size={20} />
                ) : (
                  <PenLine size={20} />
                )}
              </div>
              <div>
                <h3 className="font-heading text-lg text-black">
                  {currentSection.title}
                </h3>
                <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-mono">
                  Section {currentSectionIndex + 1} of {exam.sections.length}
                </p>
              </div>
            </div>

            <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 mb-10">
              <p className="text-xs text-amber-900 leading-relaxed whitespace-pre-line">
                {currentSection.instructions}
              </p>
            </div>

            {/* Listening Audio Control */}
            {currentSection.id === "listening" && exam.audioUrl && (
              <div className="mb-10 bg-zinc-900 rounded-3xl p-6 flex flex-col items-center gap-4 shadow-xl">
                <audio
                  ref={audioRef}
                  src={exam.audioUrl}
                  onPlay={() => setIsAudioPlaying(true)}
                  onPause={() => setIsAudioPlaying(false)}
                  onTimeUpdate={(e) =>
                    setAudioTime((e.target as HTMLAudioElement).currentTime)
                  }
                  onLoadedMetadata={(e) =>
                    setAudioDuration((e.target as HTMLAudioElement).duration)
                  }
                />
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime -= 10;
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => {
                      if (isAudioPlaying) {
                        audioRef.current?.pause();
                      } else {
                        audioRef.current?.play();
                      }
                    }}
                    className="h-16 w-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                    {isAudioPlaying ? (
                      <Pause size={32} />
                    ) : (
                      <Play size={32} className="ml-1" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime += 10;
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                <div className="w-full max-w-md">
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mb-2 relative">
                    <div
                      className="h-full bg-blue-500 transition-all duration-100"
                      style={{
                        width: `${(audioTime / (audioDuration || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>{formatAudioTime(audioTime)}</span>
                    <span className="text-zinc-400">{exam.id}.mp3</span>
                    <span>{formatAudioTime(audioDuration)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-12">
              {currentSection.questions.map((q, idx) => (
                <div key={q.id} id={`q-${q.id}`} className="reveal-1">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-lg font-bold text-black font-mono">
                      {q.id}.
                    </span>
                    {q.instructions && (
                      <p className="text-lg text-black leading-relaxed font-hanzi">
                        {q.instructions}
                      </p>
                    )}
                  </div>

                  {q.type === "multiple-choice" && (
                    <div className="grid sm:grid-cols-2 gap-3 ml-8">
                      {q.options?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswer(q.id, oIdx)}
                          className={cn(
                            "group flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                            answers[q.id] === oIdx
                              ? "bg-black border-black text-white shadow-lg"
                              : "bg-white border-black/5 hover:border-black/20 text-zinc-600 hover:bg-zinc-50",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-md font-mono text-[10px] font-bold border shrink-0",
                              answers[q.id] === oIdx
                                ? "bg-white/10 border-white/20 text-white"
                                : "bg-zinc-100 border-black/5 text-zinc-400",
                            )}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-sm font-medium">{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === "ordering" && (
                    <div className="ml-8 space-y-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {q.options?.map((word, wIdx) => (
                          <span
                            key={wIdx}
                            className="px-3 py-1.5 bg-zinc-50 border border-black/5 rounded-lg text-sm text-black font-hanzi"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                        placeholder="Type the correct sentence order..."
                        className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none font-hanzi"
                      />
                    </div>
                  )}

                  {q.type === "writing" && (
                    <div className="ml-8">
                      <textarea
                        rows={8}
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                        placeholder="เขียนภาษาจีนตรงนี้ (Write your answer in Chinese)..."
                        className="w-full bg-white border border-black/10 rounded-2xl px-6 py-5 text-base focus:ring-2 focus:ring-black outline-none font-hanzi leading-relaxed"
                      />
                      <div className="flex justify-between items-center mt-3 text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
                        <span>Min 80 characters suggested</span>
                        <span>{(answers[q.id] || "").length} Characters</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-black/5 flex justify-between items-center">
              <button
                onClick={() => goToSection(currentSectionIndex - 1)}
                disabled={currentSectionIndex === 0}
                className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-black disabled:opacity-0 transition-colors"
              >
                <ChevronLeft size={16} />
                Previous Section
              </button>

              <button
                onClick={() => {
                  if (currentSectionIndex === exam.sections.length - 1) {
                    handleFinish();
                  } else {
                    goToSection(currentSectionIndex + 1);
                  }
                }}
                className="bg-zinc-100 text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all flex items-center gap-2"
              >
                {currentSectionIndex === exam.sections.length - 1
                  ? "Submit Exam"
                  : "Next Section"}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Sidebar Navigation ── */}
        <div className="lg:col-span-4 sticky top-[132px] space-y-6">
          <div className="bento-card p-6 bg-white reveal-2">
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-5">
              Question Navigator
            </h4>
            <div className="space-y-6">
              {exam.sections.map((section, sIdx) => (
                <div key={section.id}>
                  <p className="text-[11px] font-bold text-black mb-3 flex justify-between items-center">
                    {section.title}
                    <span className="text-zinc-400 text-[9px] font-mono">
                      {
                        section.questions.filter(
                          (q) => answers[q.id] !== undefined,
                        ).length
                      }
                      /{section.questions.length}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {section.questions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentSectionIndex(sIdx);
                          setTimeout(() => {
                            const el = document.getElementById(`q-${q.id}`);
                            el?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }, 100);
                        }}
                        className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-mono transition-all",
                          answers[q.id] !== undefined
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : currentSectionIndex === sIdx
                              ? "bg-zinc-50 text-zinc-400 border border-zinc-200"
                              : "bg-transparent text-zinc-300 border border-transparent",
                        )}
                      >
                        {q.id}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card p-6 bg-zinc-900 text-white reveal-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Headphones size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold">Listening Monitor</p>
                <p className="text-[9px] text-zinc-400 font-mono">
                  {exam.id}.MP3
                </p>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
              พาร์ทการฟังจะเล่นต่อเนื่องเหมือนข้อสอบจริง
              กรุณาบริหารจัดการเวลาในแต่ละข้อให้ดี
            </p>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white text-[11px] py-2 rounded-lg font-semibold transition-colors">
              Toggle Transcription Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Link for Results
function Link({ href, children, className }: any) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
