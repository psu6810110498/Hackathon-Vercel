"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, RotateCw, Check, X, AlertCircle } from "lucide-react";

const MOCK_CARDS = [
  {
    id: 1,
    hanzi: "提高",
    pinyin: "tí gāo",
    meaning: "to raise; to increase; to improve",
    type: "Verb",
  },
  {
    id: 2,
    cast: "经验",
    pinyin: "jīng yàn",
    meaning: "experience",
    type: "Noun",
  },
  {
    id: 3,
    hanzi: "确实",
    pinyin: "què shí",
    meaning: "indeed; really; reliable",
    type: "Adverb",
  },
];

export default function FlashcardsView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentCard = MOCK_CARDS[currentIndex];

  const nextCard = (swipeDir: number) => {
    setDirection(swipeDir);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_CARDS.length);
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 flex flex-col items-center min-h-[80vh]">
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 text-accent rounded-xl">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">
              Flashcards
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Review your custom vocabulary
            </p>
          </div>
        </div>
        <div className="text-sm font-medium bg-secondary px-4 py-2 rounded-full">
          {currentIndex + 1} / {MOCK_CARDS.length}
        </div>
      </div>

      <div className="flex-1 w-full max-w-lg flex flex-col items-center justify-center relative perspective-1000 mt-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction * 100,
              rotateY: isFlipped ? 180 : 0,
            }}
            animate={{ opacity: 1, x: 0, rotateY: isFlipped ? 180 : 0 }}
            exit={{
              opacity: 0,
              x: direction * -100,
              transition: { duration: 0.2 },
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full aspect-[3/4] preserve-3d cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front of Card (Hanzi) */}
            <div className="absolute inset-0 backface-hidden bento-card flex flex-col items-center justify-center p-8 text-center bg-card border-2 hover:border-accent/40 transition-colors shadow-lg">
              <div className="absolute top-6 left-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Front
              </div>
              <div className="absolute top-6 right-6 text-xs font-bold uppercase px-3 py-1 bg-secondary rounded-full">
                {currentCard.type}
              </div>

              <h2 className="text-8xl font-serif text-cjk text-foreground">
                {currentCard.hanzi || currentCard.cast}
              </h2>
              <p className="mt-12 text-muted-foreground text-sm flex items-center gap-2">
                <RotateCw size={14} /> Tap to flip
              </p>
            </div>

            {/* Back of Card (Pinyin & Meaning) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bento-card flex flex-col items-center justify-center p-8 text-center bg-card border-2 border-accent/20 shadow-xl">
              <div className="absolute top-6 left-6 text-xs font-bold uppercase tracking-widest text-accent">
                Back
              </div>

              <h2 className="text-4xl font-sans font-medium text-foreground mb-6">
                {currentCard.pinyin}
              </h2>
              <div className="w-16 h-1 bg-accent/20 rounded-full mb-8" />
              <p className="text-2xl text-muted-foreground font-serif leading-relaxed px-4">
                {currentCard.meaning}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Reaction Controls */}
        <div className="flex items-center gap-6 mt-12">
          <button
            onClick={() => nextCard(-1)}
            className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-destructive hover:bg-destructive/10 hover:border-destructive transition-all hover:scale-110 shadow-sm"
          >
            <X size={24} />
          </button>

          <button
            onClick={() => nextCard(0)}
            className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-orange-500 hover:bg-orange-500/10 hover:border-orange-500 transition-all hover:scale-110 shadow-sm"
          >
            <AlertCircle size={20} />
          </button>

          <button
            onClick={() => nextCard(1)}
            className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-success-DEFAULT hover:bg-success-muted hover:border-success-DEFAULT transition-all hover:scale-110 shadow-sm"
          >
            <Check size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
