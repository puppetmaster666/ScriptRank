import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { synopsis } = req.body;
  if (!synopsis) {
    return res.status(400).json({ error: 'Synopsis is required' });
  }

  try {
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: 'user',
            content: `You are an AI script reviewer. Do not invent any details. Only use the exact information in the synopsis provided.

Rate the script on a scale from 0.01 to 10.00. Provide a brief, direct critique based strictly on the content of the synopsis — not on your imagination.

Avoid making up scenes, actors, characters, or plot points. Just assess the writing clarity, originality, and potential based only on the synopsis provided.

Here is the synopsis:\n\n${synopsis}`
          }
        ]
      }),
    });

    const raw = await openRouterRes.text();
    console.log("🧠 OpenRouter raw response:", raw);

    if (!openRouterRes.ok) {
      return res.status(502).json({ error: 'OpenRouter API failed', raw });
    }

    const result = JSON.parse(raw);
    const content = result?.choices?.[0]?.message?.content || "";

    const match = content.match(/([0-9]+(?:\.[0-9]{1,2})?)/);
    const score = match ? parseFloat(match[1]) : null;

    if (!score || isNaN(score)) {
      return res.status(200).json({
        score: 5.0,
        comment: content || "AI failed to give a score. Defaulted to 5.0."
      });
    }

    return res.status(200).json({ score, comment: content });

  } catch (err: any) {
    console.error("❌ AI rating failed:", err);
    return res.status(500).json({
      error: 'Unexpected server error',
      details: err.message || String(err)
    });
  }
}
