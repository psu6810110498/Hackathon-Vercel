/**
 * DeepSeek API client and config
 * Used as secondary AI for Chinese-specific analysis (optional enrichment)
 */

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

/**
 * Call DeepSeek API with messages and return assistant content
 * @param system - System prompt
 * @param user - User message
 * @returns Assistant message text or null on failure
 */
export async function callDeepSeek(
  system: string,
  user: string
): Promise<string | null> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    return null; // Optional: no error, just skip
  }
  try {
    const res = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: 1024,
      }),
    });
    if (!res.ok) {
      console.error("[DeepSeek] HTTP error:", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    return content ?? null;
  } catch (err) {
    console.error("[DeepSeek] Error:", err);
    return null;
  }
}

export const DEEPSEEK_MODEL = MODEL;
