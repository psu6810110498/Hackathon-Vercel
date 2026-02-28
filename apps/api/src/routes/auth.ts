/**
 * Auth routes — register, login, logout, me
 */

import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { hash, compare } from 'bcryptjs';
import { prisma } from '../services/db/prisma';
import { createToken, getTokenCookieOptions } from '../lib/jwt';
import { authMiddleware } from '../middleware/auth';
import { RegisterInput, LoginInput } from '@hsk/shared';

const auth = new Hono();

// ============================================
// POST /auth/register
// ============================================

auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = RegisterInput.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง' }, 400);
    }

    const { email, password, name } = parsed.data;

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return c.json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' }, 409);
    }

    // Hash password & create user
    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name: name || null },
    });

    // Issue JWT
    const token = await createToken({
      userId: user.id,
      email: user.email!,
      plan: user.plan,
    });

    setCookie(c, 'token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
    });

    return c.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    }, 201);
  } catch (err) {
    console.error('[Auth /register]', err);
    return c.json({ error: 'เกิดข้อผิดพลาด' }, 500);
  }
});

// ============================================
// POST /auth/login
// ============================================

auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = LoginInput.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง' }, 400);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true, plan: true },
    });

    if (!user || !user.password) {
      return c.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, 401);
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return c.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, 401);
    }

    // Issue JWT
    const token = await createToken({
      userId: user.id,
      email: user.email!,
      plan: user.plan,
    });

    setCookie(c, 'token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
    });

    return c.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    });
  } catch (err) {
    console.error('[Auth /login]', err);
    return c.json({ error: 'เกิดข้อผิดพลาด' }, 500);
  }
});

// ============================================
// POST /auth/logout
// ============================================

auth.post('/logout', (c) => {
  deleteCookie(c, 'token', { path: '/' });
  return c.json({ success: true });
});

// ============================================
// GET /auth/me — requires auth
// ============================================

auth.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true, email: true, name: true, image: true, plan: true },
  });

  if (!dbUser) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ user: dbUser });
});

// ============================================
// GET /auth/google — Initiate Google SSO
// ============================================

auth.get('/google', (c) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.FRONTEND_URL}/api/auth/google/callback`;

  if (!clientId) {
    return c.json({ error: 'Google Auth not configured' }, 501);
  }

  const scope = 'email profile';
  const state = Math.random().toString(36).substring(7);
  // Store state in cookie for CSRF validation ideally
  setCookie(c, 'oauth_state', state, { path: '/', httpOnly: true, maxAge: 60 * 5 });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}&access_type=offline&prompt=consent`;
  
  return c.redirect(url);
});

// ============================================
// GET /auth/google/callback — Handle Google SSO
// ============================================

auth.get('/google/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  // const savedState = getCookie(c, 'oauth_state');
  // if (state !== savedState) return c.json({ error: 'CSRF token mismatch' }, 403);

  if (!code) return c.json({ error: 'No code provided' }, 400);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.FRONTEND_URL}/api/auth/google/callback`;

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json() as any;
    if (tokenData.error) {
      console.error('Google Token Error:', tokenData);
      return c.json({ error: 'Failed to exchange token' }, 400);
    }

    // 2. Fetch user profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json() as any;

    if (!profile.email) {
      return c.json({ error: 'Email not provided by Google' }, 400);
    }

    // 3. Find or Create User
    let user = await prisma.user.findUnique({ where: { email: profile.email } });

    if (!user) {
      // Auto-provision user on SSO login
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          // Not setting password so they can only login via SSO or reset password later
        },
      });
      // Future Enhancement: If domain matches an existing Organization, auto-join them as MEMBER.
    } else if (!user.image && profile.picture) {
      // Update image if unpopulated
      user = await prisma.user.update({
        where: { id: user.id },
        data: { image: profile.picture },
      });
    }

    // 4. Issue standard App JWT Session
    const token = await createToken({
      userId: user.id,
      email: user.email!,
      plan: user.plan,
    });

    setCookie(c, 'token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
    });

    // 5. Redirect back to frontend dashboard
    return c.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error('[Auth /google/callback]', err);
    return c.json({ error: 'Google SSO login failed' }, 500);
  }
});

export { auth as authRoutes };
