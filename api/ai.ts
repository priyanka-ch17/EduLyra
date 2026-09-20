// Optional Vercel serverless endpoint.
// The browser never receives OPENAI_API_KEY. In local Vite demo mode,
// src/services/aiService.ts falls back to deterministic demo data.
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI is not configured" });

  try {
    const { action, input } = req.body || {};
    const prompt = action === "recommendCareer"
      ? `Return JSON only with key recommendations. Recommend four career roles for a student with skills ${JSON.stringify(input?.skills || [])} and interests ${input?.interests || ""}. Each item must have role, match (0-100), required (string[]), missing (string[]), courses (string[]), projects (string[]).`
      : `Return concise JSON for action ${action}. Input: ${JSON.stringify(input)}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a career intelligence engine. Never invent personal facts. Return valid JSON only." },
          { role: "user", content: prompt }
        ]
      })
    });
    if (!response.ok) return res.status(502).json({ error: "AI provider request failed" });
    const data = await response.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    return res.status(200).json(parsed);
  } catch {
    return res.status(500).json({ error: "AI request failed" });
  }
}