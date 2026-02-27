"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Download,
  Trash2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function PrivacySettingsPage() {
  const { user } = useAuthStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      setMessage(null);
      // Calls the /compliance/export API
      const response = await api.get("/compliance/export", {
        responseType: "blob", // Important for downloading files
      });

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `hsk_data_export_${user?.id || "user"}.json`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage({
        type: "success",
        text: "Data exported successfully. Check your downloads.",
      });
    } catch (error) {
      console.error("Export error:", error);
      setMessage({
        type: "error",
        text: "Failed to export data. Please try again later.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;

    try {
      setIsDeleting(true);
      setMessage(null);

      await api.delete("/compliance/account");

      // Simulate logout or redirect
      setMessage({
        type: "success",
        text: "Account has been scheduled for deletion.",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Delete error:", error);
      setMessage({
        type: "error",
        text: "Failed to delete account. Please contact support.",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-secondary text-foreground rounded-xl">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Privacy & Compliance
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your personal data, export activity, or request account
            deletion.
          </p>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-lg text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-500/10 text-green-600 border border-green-500/20"
              : "bg-red-500/10 text-red-600 border border-red-500/20"
          }`}
        >
          {message.type === "success" ? (
            <ShieldCheck size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          {message.text}
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Export Data Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-card p-6"
        >
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-bold font-serif mb-2 flex items-center gap-2">
                <Download size={20} className="text-primary" />
                Export Personal Data
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Download a machine-readable JSON file containing all your
                personal information, analysis history, and cognitive profile.
                Complying with GDPR/PDPA Right to Access.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="shrink-0 px-6 py-2.5 bg-secondary text-foreground border border-border hover:bg-secondary/80 font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? (
                <span className="animate-pulse">Preparing...</span>
              ) : (
                <>
                  <Download size={16} /> Export JSON
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Delete Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card p-6 border-red-500/20"
        >
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-bold font-serif mb-2 flex items-center gap-2 text-red-500">
                <Trash2 size={20} />
                Delete Account
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Permanently delete your account and all associated data. This
                action cannot be undone. We will retain anonymized audit logs as
                required by law.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="shrink-0 px-6 py-2.5 bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
              <AlertTriangle size={20} /> Are you absolutely sure?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone. This will permanently delete your
              account, remove your writing analyses, and wipe your cognitive
              profile.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-foreground">
                Please type{" "}
                <span className="font-mono font-bold text-red-500">DELETE</span>{" "}
                to confirm.
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || isDeleting}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Confirm Deletion"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
