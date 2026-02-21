import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Password Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const email = (credentials.email as string).toLowerCase().trim();

        try {
          const user = await prisma.user.findUnique({
            where: { email }
          });
          
          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) return null;
          
          return user;
        } catch (error) {
          console.error("AUTH_ERROR:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          console.log("AUTH: JWT callback - initial sign in for:", user.email);
          token.id = user.id;
          const u = await prisma.user.findUnique({
            where: { id: user.id },
            select: { plan: true },
          });
          token.plan = u?.plan || "FREE";
        }
        return token;
      } catch (error) {
        console.error("AUTH: JWT callback error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user && token) {
          session.user.id = token.id as string;
          session.user.plan = token.plan as string;
          console.log("AUTH: Session established for:", session.user.email);
        }
        return session;
      } catch (error) {
        console.error("AUTH: Session callback error:", error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
} satisfies NextAuthConfig;
