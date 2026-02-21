import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { authConfig } from "./auth.config";
import Resend from "next-auth/providers/resend";

const { handlers, auth: internalAuth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? "HSK AI Coach <onboarding@resend.dev>",
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt", // Using JWT even with adapter for simplicity/performance
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(error) {
      console.error("NEXTAUTH_ERROR:", error);
    },
    warn(code) {
      console.warn("NEXTAUTH_WARN:", code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log("NEXTAUTH_DEBUG:", code, metadata);
      }
    },
  },
});

// Auth Bypass: Override the auth function to return a mock session if unauthenticated
export const auth = async (...args: any[]) => {
  const session = await (internalAuth as any)(...args);
  
  if (!session && process.env.NODE_ENV === "development") {
    console.log("AUTH_BYPASS: Providing mock session for development");
    return {
      user: {
        id: "cmlw9y4q600005vdl6v7xr51n",
        email: "test@example.com",
        name: "Test User (Mock)",
        plan: "PREMIUM",
      },
      expires: new Date(Date.now() + 3600 * 1000).toISOString(),
    };
  }
  
  return session;
};

export { handlers, signIn, signOut };
