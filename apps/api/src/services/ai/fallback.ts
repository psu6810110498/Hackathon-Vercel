/**
 * AI Fallback Chain
 * Claude 3.5 → DeepSeek → Claude Haiku → cached result → error
 * Handles timeouts, rate limits, and provider failures
 */

import { callClaude, getClaudeClient } from './claude';
import { callDeepSeek } from './deepseek';
import { getCachedResult } from '../cache/aiCache';

const TIMEOUT_MS = 30_000;

/**
 * Call AI with fallback chain
 * @returns AI response text or null
 */
export async function callWithFallback(
  system: string,
  user: string,
  mode: string = 'default',
  hskLevel: number = 0
): Promise<{ text: string | null; provider: string; latencyMs: number }> {
  const start = Date.now();

  // 1. Try Claude 3.5 (primary)
  try {
    const result = await Promise.race([
      callClaude(system, user),
      timeout(TIMEOUT_MS),
    ]);
    if (result) {
      return { text: result, provider: 'claude-3.5', latencyMs: Date.now() - start };
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.warn('[Fallback] Claude 3.5 failed:', error.message?.slice(0, 100));
  }

  // 2. Fallback → DeepSeek
  try {
    const result = await Promise.race([
      callDeepSeek(system, user),
      timeout(TIMEOUT_MS),
    ]);
    if (result) {
      return { text: result, provider: 'deepseek', latencyMs: Date.now() - start };
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.warn('[Fallback] DeepSeek failed:', error.message?.slice(0, 100));
  }

  // 3. Fallback → Claude Haiku (fast, cheap)
  try {
    const client = getClaudeClient();
    const response = await Promise.race([
      client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2048,
        system,
        messages: [{ role: 'user', content: user }],
      }),
      timeout(15_000),
    ]);
    if (response) {
      const block = (response as { content?: Array<{ type: string; text?: string }> }).content?.find(b => b.type === 'text');
      if (block?.text) {
        return { text: block.text, provider: 'claude-haiku', latencyMs: Date.now() - start };
      }
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.warn('[Fallback] Claude Haiku failed:', error.message?.slice(0, 100));
  }

  // 4. Last resort → return cached result if available
  const cached = await getCachedResult(mode, '', hskLevel);
  if (cached) {
    console.warn('[Fallback] All AI providers failed, returning cache');
    return { text: JSON.stringify(cached), provider: 'cache-fallback', latencyMs: Date.now() - start };
  }

  // 5. All failed
  return { text: null, provider: 'none', latencyMs: Date.now() - start };
}

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
}
