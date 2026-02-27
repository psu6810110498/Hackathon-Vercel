"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { RoleGate } from "@/components/auth/RoleGate";
import {
  Settings2,
  Shield,
  UserPlus,
  Mail,
  MoreHorizontal,
} from "lucide-react";

const MOCK_MEMBERS = [
  { id: 1, name: "Alex", email: "alex@example.com", role: "OWNER" },
  { id: 2, name: "Sarah T.", email: "sarah@example.com", role: "ADMIN" },
  { id: 3, name: "John Doe", email: "john@example.com", role: "MEMBER" },
];

export default function SettingsView() {
  const { user } = useAuthStore();
  const [inviteEmail, setInviteEmail] = useState("");
  const [activeTab, setActiveTab] = useState("members");

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-secondary text-foreground rounded-xl">
          <Settings2 size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Organization Settings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage members, billing, and enterprise features
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          <button
            onClick={() => setActiveTab("members")}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === "members" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}
          >
            Members & Roles
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === "billing" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}
          >
            Billing (Omise)
          </button>

          <RoleGate allowed={["ORG_ADMIN"]}>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-between ${activeTab === "security" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}
            >
              Enterprise Security <Shield size={14} className="text-accent" />
            </button>
          </RoleGate>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "members" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bento-card p-6">
                <h2 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                  <UserPlus size={18} /> Invite Members
                </h2>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <select className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap">
                    Send Invite
                  </button>
                </div>
              </div>

              <div className="bento-card overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                  <div>
                    <h2 className="text-lg font-bold font-serif hidden md:block">
                      Active Members
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {MOCK_MEMBERS.length} users in your organization
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {MOCK_MEMBERS.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {member.name}{" "}
                            {user?.email === member.email && (
                              <span className="text-xs bg-secondary px-2 border border-border rounded-full ml-2">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded inline-block
                          ${
                            member.role === "OWNER"
                              ? "bg-accent/20 text-accent border border-accent/30"
                              : member.role === "ADMIN"
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-secondary text-muted-foreground border border-border"
                          }`}
                        >
                          {member.role}
                        </span>

                        <RoleGate allowed={["ORG_ADMIN"]}>
                          <button className="text-muted-foreground hover:text-foreground p-1 transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </RoleGate>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bento-card p-8 text-center bg-card flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="mb-6 p-4 rounded-full bg-accent/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-12 h-12 text-accent"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2">
                Omise Payment Integration
              </h2>
              <p className="text-muted-foreground mb-8 max-w-sm">
                Your enterprise plan is currently active. Next billing date is
                Oct 1, 2026.
              </p>
              <button className="px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium">
                Manage Billing Portal
              </button>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bento-card p-6 border-accent/20 border-2"
            >
              <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2 text-accent">
                <Shield size={20} /> Enterprise Controls
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Advanced configurations available only to Organization Owners
                and Admins.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-sm">Force SSO & 2FA</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Require all members to use Google SSO
                    </p>
                  </div>
                  <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-sm">PDPA Data Export</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Download complete audit logs and member activity
                    </p>
                  </div>
                  <button className="text-xs font-bold bg-card border border-border px-3 py-1.5 rounded hover:bg-secondary">
                    Request Export
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
