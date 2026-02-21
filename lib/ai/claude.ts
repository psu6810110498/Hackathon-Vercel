/**
 * Claude API client and config (Anthropic)
 * Used as primary AI for writing and reading analysis
 */

import Anthropic from "@anthropic-ai/sdk";

const model = "claude-3-5-sonnet-20240620";
const maxTokens = 4096;

/**
 * Get configured Anthropic client (uses ANTHROPIC_API_KEY from env)
 */
export function getClaudeClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey: key });
}

/**
 * Call Claude with system + user messages and return text content
 * @param system - System prompt
 * @param user - User message
 * @returns Assistant message text or null on failure
 */
export async function callClaude(
  system: string,
  user: string
): Promise<string | null> {
  try {
    const client = getClaudeClient();
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    });

    const block = response.content.find((b) => b.type === "text");
    if (block && block.type === "text") {
      return block.text;
    }
    return null;
  } catch (err) {
    console.error("[Claude] Error:", err);
    return null;
  }
}

export const CLAUDE_MODEL = model;
export const CLAUDE_MAX_TOKENS = maxTokens;
