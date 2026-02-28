"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Check, ChevronRight } from "lucide-react";

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  // Show banner only if consent is not stored
  // Simulate checking localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const consent = localStorage.getItem("hsk_pdpa_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("hsk_pdpa_consent", "true");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("hsk_pdpa_consent", "false");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[450px] z-[100] bento-card p-5 border-border shadow-2xl bg-card/95 backdrop-blur-xl"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-secondary text-primary rounded-xl shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-bold font-serif text-lg mb-1 leading-none">
                Privacy & Data Consent
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                We use strictly necessary cookies to provide your enterprise
                experience and analyze platform usage to improve AI models. By
                continuing, you agree to our{" "}
                <a
                  href="#"
                  className="underline text-foreground hover:text-primary"
                >
                  Data Processing Agreement
                </a>
                .
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-primary text-primary-foreground text-xs font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Check size={14} /> Accept Essential
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2.5 bg-secondary text-foreground text-xs font-medium rounded-lg hover:bg-secondary/70 transition-colors"
                >
                  Decline
                </button>
                <button className="p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
