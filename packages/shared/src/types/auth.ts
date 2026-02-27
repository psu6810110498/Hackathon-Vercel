/**
 * Auth types — standalone, no NextAuth dependency
 */

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  plan: 'FREE' | 'PREMIUM';
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

export interface LoginResponse {
  success: boolean;
  user: AuthUser;
}

export interface RegisterResponse {
  success: boolean;
  user: AuthUser;
}
