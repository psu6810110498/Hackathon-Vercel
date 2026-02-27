/**
 * JWT utilities using jose library
 * Handles token creation, verification, and cookie management
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// ============================================
// Types
// ============================================

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  plan: string;
}

// ============================================
// Config
// ============================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret-change-me'
);

const TOKEN_EXPIRY = '30d'; // 30 days
const ISSUER = 'hsk-ai-coach';

// ============================================
// Token Operations
// ============================================

/**
 * Create a signed JWT token
 */
export async function createToken(payload: Omit<TokenPayload, 'iat' | 'exp' | 'iss'>): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: ISSUER,
    });
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

// ============================================
// Cookie Helpers
// ============================================

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export function getTokenCookieOptions(): string {
  const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
  const parts = [
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (IS_PRODUCTION) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function getClearCookieOptions(): string {
  return 'Max-Age=0; Path=/; HttpOnly; SameSite=Lax';
}
