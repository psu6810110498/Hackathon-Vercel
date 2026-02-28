"use client";

import { useAuthStore } from "@/store/auth";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="mb-6 text-2xl font-serif font-bold text-foreground">
        Profile Settings
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bento-card p-6">
          <h2 className="text-xl font-bold font-serif mb-2">Account Info</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Email and plan details
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex justify-center items-center text-xl font-bold">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  user.name?.charAt(0) || "U"
                )}
              </div>
              <div>
                <p className="font-semibold">{user.name || "Unnamed User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Role
                </p>
                <p className="text-sm font-medium">
                  {user.orgRole || "Member"}
                </p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Status
                </p>
                <p className="text-sm font-medium text-success-DEFAULT">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bento-card p-6 border-accent/20 border-2 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>

          <h2 className="text-xl font-bold font-serif mb-2 text-accent">
            Enterprise Plan
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Unlimited analysis & AI models
          </p>

          <div className="space-y-4">
            <p className="text-sm">
              You are currently on the Enterprise Organization plan.
            </p>
            <button
              disabled
              className="w-full py-2.5 bg-secondary text-muted-foreground rounded-md text-sm font-medium mt-auto"
            >
              Managed by Org Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
