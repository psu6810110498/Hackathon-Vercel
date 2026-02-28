/**
 * Database model types — standalone, no Prisma dependency
 */

export type Plan = 'FREE' | 'PREMIUM';
export type Mode = 'WRITING' | 'READING';

export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  plan: Plan;
  dailyUsage: number;
}

export interface AnalysisRecord {
  id: string;
  mode: Mode;
  hskLevel: number;
  inputText: string;
  result: unknown;
  score: number | null;
  createdAt: string;
}

export interface UsageInfo {
  usage: number;
  limit: number | null;
  allowed: boolean;
  plan: Plan;
}
