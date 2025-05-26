import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { synopsis } = req.body;
  if (!synopsis) return res.status(400).json({ error: 'Synopsis is required' });

  try {
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct:free',
        messages: [{
          role: 'user',
          content: `Rate the following movie script synopsis on a scale from 0.01 to 10.00 with a short comment. Be harsh:\n\n${synopsis}`
        }]
      })
    });
    const result = await openRouterRes.json();
    const content = result?.choices?.[0]?.message?.content || "";
    const match = content.match(/([0-9]+(?:\.[0-9]{1,2})?)/);
    const score = match ? parseFloat(match[1]) : null;
    res.status(200).json({ score, comment: content });
  } catch (err) {
    res.status(500).json({ error: 'AI rating failed', details: err });
  }
}
