/**
 * API Client — fetch wrapper for frontend → Hono backend
 * Handles JWT cookies, error formatting, and retries
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ============================================
// Core fetch wrapper
// ============================================

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export async function fetchAPI<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Auto-send httpOnly cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        error: data?.error || `HTTP ${response.status}`,
        status: response.status,
      };
    }

    return { data, status: response.status };
  } catch (err) {
    console.error(`[API] ${endpoint}:`, err);
    return { error: 'เชื่อมต่อ server ไม่ได้', status: 0 };
  }
}

// ============================================
// Auth API
// ============================================

export const authAPI = {
  register: (body: { email: string; password: string; name?: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  logout: () =>
    fetchAPI('/auth/logout', { method: 'POST' }),

  me: () =>
    fetchAPI('/auth/me'),
};

// ============================================
// Analysis API
// ============================================

export const analysisAPI = {
  writing: (body: { text: string; hskLevel: number }) =>
    fetchAPI('/analysis/writing', { method: 'POST', body: JSON.stringify(body) }),

  reading: (body: { passage: string; hskLevel: number }) =>
    fetchAPI('/analysis/reading', { method: 'POST', body: JSON.stringify(body) }),
};

// ============================================
// Exercise API
// ============================================

export const exerciseAPI = {
  generate: (body: { hskLevel?: number }) =>
    fetchAPI('/exercise/generate', { method: 'POST', body: JSON.stringify(body) }),
};

// ============================================
// User API
// ============================================

export const userAPI = {
  usage: () => fetchAPI('/user/usage'),
};
