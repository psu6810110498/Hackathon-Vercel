/**
 * Auth and User types (extend NextAuth when needed)
 */

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan?: string;
    } & DefaultSession["user"];
  }
}

export type { Session, User } from "next-auth";
