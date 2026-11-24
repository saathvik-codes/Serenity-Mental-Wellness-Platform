// One place for the Serenity API address and the calls that must stay server-side
// (AI and news keys never ship in the browser bundle).
export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_API_URL ||
  import.meta.env.VITE_API_URL ||
  "https://serenity-s1io.onrender.com"
).replace(/\/+$/, "");

async function post<T>(path: string, body: unknown, timeoutMs = 60000): Promise<T> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
    return data as T;
  } finally {
    window.clearTimeout(timer);
  }
}

/** Ask the AI model (through the backend). Throws when the service is unavailable. */
export async function aiGenerate(prompt: string): Promise<string> {
  const { text } = await post<{ text: string }>("/api/ai/generate", { prompt });
  if (!text?.trim()) throw new Error("Empty AI response");
  return text.trim();
}

/** Mental-wellness news (through the backend, which holds the NewsAPI key). */
export async function fetchNews(query: string): Promise<any[]> {
  const res = await fetch(`${BACKEND_URL}/api/news?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`News request failed (${res.status})`);
  const data = await res.json();
  return Array.isArray(data.articles) ? data.articles : [];
}
