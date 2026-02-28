"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, CheckCircle, ChevronRight, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  type: "Listening" | "Reading";
  text: string;
  options: string[];
  correctAnswer: number;
}

const MOCK_EXAM: { title: string; duration: number; questions: Question[] } = {
  title: "HSK 5 Practice Test A",
  duration: 45 * 60, // 45 minutes in seconds
  questions: [
    {
      id: "q1",
      type: "Reading",
      text: "既然你已经决定了，我们就______你的选择。",
      options: ["A. 放弃", "B. 尊重", "C. 破坏", "D. 怀疑"],
      correctAnswer: 1,
    },
    {
      id: "q2",
      type: "Reading",
      text: "这次会议的主要目的是______下一季度的销售计划。",
      options: ["A. 讨论", "B. 抱怨", "C. 逃避", "D. 犹豫"],
      correctAnswer: 0,
    },
    {
      id: "q3",
      type: "Listening",
      text: "听音频并选择正确的答案... (Audio Placeholder)",
      options: [
        "A. 他迟到了",
        "B. 航班取消了",
        "C. 他忘记带护照",
        "D. 天气不好",
      ],
      correctAnswer: 2,
    },
  ],
};

export default function MockExamView() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(MOCK_EXAM.duration);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hasStarted, isFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelect = (optIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: optIndex }));
  };

  const nextQuestion = () => {
    if (currentQ < MOCK_EXAM.questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    MOCK_EXAM.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    return Math.round((correct / MOCK_EXAM.questions.length) * 100);
  };

  if (isFinished) {
    const score = calculateScore();
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bento-card p-10 flex flex-col items-center text-center w-full"
        >
          <div className="w-24 h-24 rounded-full bg-success-muted flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-success-DEFAULT" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-2">
            Exam Completed!
          </h2>
          <p className="text-muted-foreground mb-8">
            You have finished {MOCK_EXAM.title}
          </p>

          <div className="flex items-center gap-12 mb-10">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Final Score
              </p>
              <p className="text-5xl font-mono font-bold text-primary">
                {score}
                <span className="text-2xl text-muted-foreground">/100</span>
              </p>
            </div>
            <div className="w-[1px] h-16 bg-border" />
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Time Spent
              </p>
              <p className="text-3xl font-mono font-medium">
                {formatTime(MOCK_EXAM.duration - timeLeft)}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-card border border-border rounded-full hover:bg-secondary font-medium transition-colors"
          >
            Review Answers
          </button>
        </motion.div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card p-10 w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
              <Timer size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              {MOCK_EXAM.title}
            </h1>
            <p className="text-muted-foreground mt-2">
              Simulate real examination conditions
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-secondary p-4 rounded-xl text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Questions
              </p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {MOCK_EXAM.questions.length}
              </p>
            </div>
            <div className="bg-secondary p-4 rounded-xl text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Duration
              </p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {Math.floor(MOCK_EXAM.duration / 60)} mins
              </p>
            </div>
          </div>

          <button
            onClick={() => setHasStarted(true)}
            className="w-full py-4 bg-primary text-primary-foreground text-lg font-bold rounded-xl hover:bg-primary/90 transition-transform active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            Start Exam Now
          </button>
        </motion.div>
      </div>
    );
  }

  const question = MOCK_EXAM.questions[currentQ];

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-card border border-border p-4 rounded-2xl shadow-sm sticky top-20 z-10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              {MOCK_EXAM.title}
            </span>
            <span className="text-sm font-medium">
              Question {currentQ + 1} of {MOCK_EXAM.questions.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "font-mono text-xl font-bold px-3 py-1 rounded-md",
              timeLeft < 300
                ? "bg-destructive/10 text-destructive animate-pulse"
                : "bg-secondary text-foreground",
            )}
          >
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setIsFinished(true)}
            className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors px-3 py-1"
          >
            Submit Early
          </button>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bento-card p-6 md:p-10"
        >
          <div className="mb-6 inline-flex px-3 py-1 rounded bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest">
            {question.type} Section
          </div>

          <h2 className="text-2xl md:text-3xl font-serif text-cjk text-foreground leading-relaxed mb-10">
            {question.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((opt, idx) => {
              const isSelected = answers[currentQ] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={cn(
                    "p-4 rounded-xl text-left border-2 transition-all font-cjk text-lg",
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card hover:border-primary/40 hover:bg-secondary/50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {isSelected && (
                        <CheckCircle
                          size={14}
                          className="text-primary-foreground"
                        />
                      )}
                    </div>
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex justify-between items-center border-t border-border pt-6">
            <button
              onClick={() => setCurrentQ((prev) => Math.max(0, prev - 1))}
              disabled={currentQ === 0}
              className="px-6 py-2.5 rounded-lg border border-border font-medium text-muted-foreground disabled:opacity-30 hover:bg-secondary transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-md"
            >
              {currentQ === MOCK_EXAM.questions.length - 1
                ? "Finish Exam"
                : "Next Question"}
              {currentQ !== MOCK_EXAM.questions.length - 1 && (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
