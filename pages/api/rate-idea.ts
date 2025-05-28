// pages/api/rate-idea.ts

import type { NextApiRequest, NextApiResponse } from 'next';

// ✅ Define this ABOVE the handler so it’s accessible
function getPrompt(type: string, content: string): string {
  return `You're an expert creative consultant. Rate this ${type} idea on a scale from 0.01 to 10.00 and explain why. Idea: ${content}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, content } = req.body;
  if (!type || !content) {
    return res.status(400).json({ error: 'Type and content are required' });
  }

  try {
    const prompt = getPrompt(type, content);

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://scriptrank.vercel.app', // Required by OpenRouter
        'X-Title': 'MakeMeFamous' // Required by OpenRouter
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    // Ensure response is JSON
    const contentType = openRouterRes.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const textResponse = await openRouterRes.text();
      console.error('Non-JSON response:', textResponse);
      return res.status(502).json({ 
        error: 'Received non-JSON response from OpenRouter',
        response: textResponse 
      });
    }

    const result = await openRouterRes.json();

    if (!openRouterRes.ok) {
      console.error('OpenRouter API error:', result);
      return res.status(502).json({ 
        error: 'OpenRouter API failed',
        details: result.error?.message || JSON.stringify(result)
      });
    }

    const responseContent = result?.choices?.[0]?.message?.content || "";
    const scoreMatch = responseContent.match(/([0-9]+(?:\.[0-9]{1,2})?)/);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

    if (!score || isNaN(score)) {
      return res.status(200).json({
        score: 5.0,
        comment: responseContent || "AI failed to give a score. Defaulted to 5.0."
      });
    }

    return res.status(200).json({ 
      score: Math.min(10, Math.max(0.01, score)), // Clamp score between 0.01 and 10.00
      comment: responseContent 
    });

  } catch (err: any) {
    console.error("AI rating failed:", err);
    return res.status(500).json({
      error: 'Unexpected server error',
      details: err.message || String(err)
    });
  }
}
