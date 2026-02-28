"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Download,
  Search,
  Filter,
  AlertCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
// Note: Normally we'd fetch this from our trpc/axios API endpoint, but using mock for UI demo
// import { api } from '@/lib/api';

const MOCK_LOGS = [
  {
    id: "1",
    action: "EXPORT_REQUESTED",
    resource: "User Data",
    status: "COMPLETED",
    date: "2026-02-26T10:23:45Z",
    user: "alex@example.com",
  },
  {
    id: "2",
    action: "ROLE_CHANGED",
    resource: "Member: John Doe",
    status: "SUCCESS",
    date: "2026-02-25T14:12:00Z",
    user: "admin@example.com",
  },
  {
    id: "3",
    action: "ESSAY_ANALYZED",
    resource: "HSK 5 Practice",
    status: "SUCCESS",
    date: "2026-02-25T09:45:12Z",
    user: "alex@example.com",
  },
  {
    id: "4",
    action: "LOGIN_FAILED",
    resource: "Authentication",
    status: "WARNING",
    date: "2026-02-24T18:30:00Z",
    user: "unknown_ip",
  },
  {
    id: "5",
    action: "PAYMENT_PROCESSED",
    resource: "Omise Charge",
    status: "SUCCESS",
    date: "2026-02-01T00:00:00Z",
    user: "system",
  },
];

export default function AuditLogsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Simulated Async Export Feature
  const handleExport = () => {
    setIsExporting(true);
    setExportComplete(false);

    // Simulate long-running async background job
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);

      // Reset success message after 5 seconds
      setTimeout(() => setExportComplete(false), 5000);
    }, 2500);
  };

  const filteredLogs = MOCK_LOGS.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-card border border-border text-foreground rounded-xl shadow-sm">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">
              Audit Logs
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Enterprise activity and compliance monitoring
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting || exportComplete}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm",
            exportComplete
              ? "bg-success-DEFAULT text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />{" "}
              Preparing ZIP...
            </>
          ) : exportComplete ? (
            <>
              <CheckCircle2 size={18} /> Export Sent to Email
            </>
          ) : (
            <>
              <Download size={18} /> Export PDPA Data
            </>
          )}
        </button>
      </div>

      <div className="bento-card flex flex-col min-h-[500px]">
        {/* Table Header/Filters */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/30">
          <div className="relative max-w-sm w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search actions or resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
            <Filter size={16} /> Filter by Date
          </button>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-muted-foreground bg-secondary/50">
              <tr>
                <th className="px-6 py-4 font-bold">Action</th>
                <th className="px-6 py-4 font-bold">Resource</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">User / IP</th>
                <th className="px-6 py-4 font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-foreground">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <FileText size={14} className="text-muted-foreground" />{" "}
                      {log.resource}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold flex items-center gap-1.5 w-fit",
                          log.status === "SUCCESS" || log.status === "COMPLETED"
                            ? "bg-success-muted text-success-DEFAULT"
                            : log.status === "WARNING"
                              ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                              : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {log.status === "WARNING" && <AlertCircle size={10} />}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {new Date(log.date).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Search size={32} className="mb-4 opacity-20" />
              <p>No audit logs found matching &quot;{searchTerm}&quot;</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-secondary/30">
          <span>
            Showing 1 to {filteredLogs.length} of {MOCK_LOGS.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-border rounded hover:bg-secondary disabled:opacity-50"
              disabled
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border border-border rounded hover:bg-secondary disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
