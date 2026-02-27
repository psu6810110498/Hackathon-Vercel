"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { api } from "@/lib/api";

const ANALYSIS_MOCK = {
  score: 85,
  pinyin: "wǒ jīn tiān qù xué xiào...",
  grammarErrors: [
    {
      id: 1,
      text: "去学校",
      type: "Vocab",
      severity: "minor",
      suggestion: "Use a more advanced word for HSK 5",
    },
    {
      id: 2,
      text: "因为所以",
      type: "Grammar",
      severity: "important",
      suggestion: "Sentence structure feels unnatural here",
    },
  ],
  vocabHighlights: ["学校", "因为", "所以", "今天"],
  dimensions: [
    { label: "Grammar", value: 80 },
    { label: "Vocabulary", value: 90 },
    { label: "Coherence", value: 75 },
    { label: "Task Response", value: 95 },
  ],
};

export default function WritingAnalysisView() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setErrorMsg(null);

    try {
      // Send essay to actual AI backend
      const res = await api.post("/analysis/writing", {
        text,
        hskLevel: 4, // Defaulting to 4 for now, could wire up the select box later
      });

      const analysisData = res.data.result;

      // If AI flagged it as nonsense (passed: false)
      if (analysisData.score && analysisData.score.passed === false) {
        setErrorMsg(
          analysisData.summary ||
            "AI rejected this text as nonsense. Please write meaningful Chinese.",
        );
        setIsAnalyzing(false);
        return;
      }

      // Map backend response shape to frontend UI shape
      setResult({
        score: analysisData.score?.total || 0,
        grammarErrors: analysisData.errors || [],
        vocabHighlights: [], // Optional
        dimensions: [
          { label: "Grammar", value: analysisData.score?.grammar || 0 },
          { label: "Vocabulary", value: analysisData.score?.vocabulary || 0 },
          { label: "Coherence", value: analysisData.score?.coherence || 0 },
          { label: "Native Feel", value: analysisData.score?.native || 0 },
        ],
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.error || "Failed to analyze. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <PenTool size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Writing Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Get instant feedback on your Chinese essays
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Area */}
        <div className="bento-card flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
            <span className="text-sm font-semibold">Your Essay</span>
            <select className="text-sm bg-transparent border border-border rounded px-2 py-1 outline-none">
              <option>HSK 4</option>
              <option>HSK 5</option>
              <option>HSK 6</option>
            </select>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isAnalyzing}
            placeholder="Type or paste your Chinese text here (e.g. 我今天...)"
            className="flex-1 w-full p-4 min-h-[300px] resize-none focus:outline-none bg-transparent text-lg leading-relaxed text-cjk"
          />
          {errorMsg && (
            <div className="mx-4 mt-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-start gap-2 border border-destructive/20">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="p-4 border-t border-border flex justify-between items-center bg-secondary/30 mt-auto">
            <span className="text-xs text-muted-foreground font-mono">
              {text.length} characters
            </span>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium shadow-md hover:bg-primary/90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <PenTool size={18} />
              )}
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="h-full flex flex-col">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8 bento-card border-dashed"
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <PenTool size={24} className="text-muted-foreground" />
                </div>
                <h3 className="font-serif text-xl font-medium">
                  Ready when you are
                </h3>
                <p className="text-muted-foreground mt-2 max-w-xs text-sm">
                  Write your essay and click Analyze to see your score, grammar
                  corrections, and vocabulary insights.
                </p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 bento-card"
              >
                {/* Score Processing Ring Animation */}
                <div className="relative w-32 h-32 mb-8">
                  <svg
                    className="w-full h-full animate-spin text-secondary"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="70 200"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-primary font-serif italic text-2xl animate-pulse">
                    AI
                  </div>
                </div>
                <h3 className="font-serif text-lg animate-pulse text-primary tracking-widest">
                  Evaluating structures...
                </h3>
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-4 h-full"
              >
                {/* Score & Dimensions Card */}
                <div className="bento-card p-6 flex flex-col sm:flex-row gap-8 items-center">
                  <div className="relative w-28 h-28 flex shrink-0 items-center justify-center">
                    <svg
                      viewBox="0 0 36 36"
                      className="w-full h-full transform -rotate-90"
                    >
                      <path
                        className="text-secondary stroke-current"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <motion.path
                        className="text-primary stroke-current"
                        strokeWidth="3"
                        strokeDasharray={`${result.score}, 100`}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: `${result.score}, 100` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold font-serif">
                        {result.score}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Score
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    {result.dimensions.map((dim: any, i: number) => (
                      <div key={dim.label} className="w-full">
                        <div className="flex justify-between text-xs font-medium mb-1.5">
                          <span>{dim.label}</span>
                          <span className="text-muted-foreground">
                            {dim.value}/100
                          </span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dim.value}%` }}
                            transition={{
                              duration: 1,
                              delay: 0.5 + i * 0.1,
                              ease: "easeOut",
                            }}
                            className="h-full bg-accent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback Cards sliding in */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                  <h3 className="font-serif font-bold text-lg sticky top-0 bg-background/95 backdrop-blur py-2 z-10 flex items-center justify-between">
                    AI Feedback{" "}
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-sans">
                      {result.grammarErrors.length} notices
                    </span>
                  </h3>

                  {result.grammarErrors.map((err: any, i: number) => (
                    <motion.div
                      key={err.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.15 }}
                      className="bento-card p-4 border-l-4 border-l-primary"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-cjk text-foreground">
                            {err.text}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {err.suggestion}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded font-bold ${err.severity === "important" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" : "bg-secondary text-muted-foreground"}`}
                        >
                          {err.type}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="mt-6"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Target Vocabulary Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.vocabHighlights.map((v: string, i: number) => (
                        <motion.span
                          key={v}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 1.6 + i * 0.05 }}
                          className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-full text-sm font-medium text-cjk"
                        >
                          {v}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
