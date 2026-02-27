"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BuildingIcon, Check, ChevronDown, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// Mock data for organizations
const MOCK_ORGS = [
  { id: "1", name: "Personal Workspace", type: "Personal", logo: "P" },
  { id: "2", name: "Shanghai University Prep", type: "Enterprise", logo: "S" },
  { id: "3", name: "HSK Study Group B", type: "Team", logo: "H" },
];

export function OrgSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeOrg, setActiveOrg] = useState(MOCK_ORGS[0]);
  const queryClient = useQueryClient();

  const handleSwitch = (org: (typeof MOCK_ORGS)[0]) => {
    setActiveOrg(org);
    setIsOpen(false);

    // Core Isolation Mechanic: Reset all React Query cache on org switch
    // This ensures data from Org A doesn't accidentally leak into Org B's views
    queryClient.clear();

    // Additional logic to re-fetch would happen here or automatically via hooks
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-secondary transition-colors"
      >
        <div className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold leading-none">
          {activeOrg.logo}
        </div>
        <span className="max-w-[120px] truncate">{activeOrg.name}</span>
        <ChevronDown
          size={14}
          className={cn(
            "text-muted-foreground transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-12 right-0 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden backdrop-blur-xl"
          >
            <div className="p-2 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2 py-1">
                Your Workspaces
              </p>
            </div>

            <div className="p-2 space-y-1">
              {MOCK_ORGS.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSwitch(org)}
                  className={cn(
                    "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-left transition-colors",
                    activeOrg.id === org.id
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded flex items-center justify-center text-sm font-bold",
                      activeOrg.id === org.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border",
                    )}
                  >
                    {org.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{org.name}</p>
                    <p className="text-[10px] uppercase tracking-wider">
                      {org.type}
                    </p>
                  </div>
                  {activeOrg.id === org.id && (
                    <Check size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-border bg-secondary/30">
              <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <div className="w-8 h-8 rounded border border-dashed border-border flex items-center justify-center">
                  <Plus size={16} />
                </div>
                Create Organization
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
