/**
 * NextAuth v5 configuration
 * Providers: Google OAuth + Email Magic Link
 * Adapter: Prisma (Supabase PostgreSQL)
 * Session: database strategy for protected dashboard routes
 */

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/db/prisma";
import type { Adapter } from "next-auth/adapters";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? "HSK AI Coach <onboarding@resend.dev>",
      // Magic link is built-in when using Resend with NextAuth
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const u = await prisma.user.findUnique({
          where: { id: user.id },
          select: { plan: true },
        });
        session.user.plan = u?.plan ?? "FREE";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      // Optional: sync plan from external source or invite
    },
  },
  debug: process.env.NODE_ENV === "development",
});
