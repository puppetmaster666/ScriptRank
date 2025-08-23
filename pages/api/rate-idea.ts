// pages/api/rate-idea.ts
// Harsh objective critic with simpler vocabulary

import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Harsh but clear critic prompt
function getCriticPrompt(type: string, content: string): string {
  return `You are a brutally honest ${type} critic known for harsh objectivity. You don't sugarcoat anything but you use clear, simple language that anyone can understand. No fancy business jargon or pretentious vocabulary.

IDEA: "${content}"

Provide harsh but clear analysis with EXACTLY this JSON format (use precise decimals like 4.73):

{
  "scores": {
    "market": [0.00-10.00],
    "innovation": [0.00-10.00], 
    "execution": [0.00-10.00]
  },
  "feedback": {
    "market": "[1-2 sentences about market demand in simple terms - be harsh about reality]",
    "innovation": "[1-2 sentences about originality - call out if it's been done before]",
    "execution": "[1-2 sentences about technical difficulty - be realistic about challenges]"
  },
  "verdict": "[2-3 sentences of brutal honesty using simple, clear language. No sugarcoating but no fancy words either]",
  "investmentStatus": "[INVEST/PASS/MAYBE]"
}

Scoring Guidelines (BE HARSH):
- Market (0-10): 0-3 = Nobody wants this, 4-6 = Some people might care, 7-8 = Good demand, 9-10 = Everyone needs this
- Innovation (0-10): 0-3 = Total copy, 4-6 = Small twist, 7-8 = Fresh approach, 9-10 = Never seen before
- Execution (0-10): 0-3 = Nearly impossible, 4-6 = Very difficult, 7-8 = Doable with work, 9-10 = Easy to build

Remember: 
- Most ideas deserve 3-6. Scores above 7 are RARE.
- Use simple, clear language. No MBA buzzwords or Silicon Valley slang.
- Be specific about problems. Say exactly what's wrong.
- If it exists already, name it. If it won't work, explain why.
- Would YOU actually use or invest in this? Be honest.`;
}

// Calculate weighted overall score
function calculateOverallScore(market: number, innovation: number, execution: number): number {
  // Market matters most (40%), Innovation and Execution (30% each)
  const overall = (market * 0.40) + (innovation * 0.30) + (execution * 0.30);
  return Math.round(overall * 100) / 100;
}

// Validate word count
function validateWordCount(content: string): { valid: boolean; wordCount: number; error?: string } {
  const words = content.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  if (wordCount < 30) {
    return {
      valid: false,
      wordCount,
      error: `Too short. Need at least 30 words (you have ${wordCount}). Give us real details.`
    };
  }
  
  if (wordCount > 500) {
    return {
      valid: false,
      wordCount,
      error: `Too long. Maximum 500 words (you have ${wordCount}). Get to the point.`
    };
  }
  
  return { valid: true, wordCount };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, content, title } = req.body;

  // Validate input
  if (!type || !content) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Both type and content are required'
    });
  }

  // Validate word count
  const validation = validateWordCount(content);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    // Use Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
        topP: 0.95,
      }
    });

    const prompt = getCriticPrompt(type, content);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    let parsedResponse;
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse response:', text);
      // Fallback response
      parsedResponse = {
        scores: {
          market: 3.42,
          innovation: 4.18,
          execution: 5.23
        },
        feedback: {
          market: "No clear evidence anyone wants this. You haven't shown real demand.",
          innovation: "This already exists in multiple forms. Nothing new here.",
          execution: "Technically possible but way harder than you think."
        },
        verdict: "This idea needs serious work. You're solving a problem that doesn't really exist. Come back after talking to real customers.",
        investmentStatus: "PASS"
      };
    }

    // Ensure scores are numbers and within range
    const scores = {
      market: Math.min(10, Math.max(0, parseFloat(parsedResponse.scores.market) || 3.00)),
      innovation: Math.min(10, Math.max(0, parseFloat(parsedResponse.scores.innovation) || 3.00)),
      execution: Math.min(10, Math.max(0, parseFloat(parsedResponse.scores.execution) || 3.00))
    };

    // Round to 2 decimal places
    scores.market = Math.round(scores.market * 100) / 100;
    scores.innovation = Math.round(scores.innovation * 100) / 100;
    scores.execution = Math.round(scores.execution * 100) / 100;

    // Calculate overall score
    const overallScore = calculateOverallScore(scores.market, scores.innovation, scores.execution);

    // Prepare final response
    const finalResponse = {
      success: true,
      wordCount: validation.wordCount,
      score: overallScore,
      comment: parsedResponse.verdict || "Not ready yet.",
      aiScores: {
        market: scores.market,
        innovation: scores.innovation,
        execution: scores.execution,
        overall: overallScore,
        marketFeedback: parsedResponse.feedback?.market || "No clear market identified.",
        innovationFeedback: parsedResponse.feedback?.innovation || "Nothing new here.",
        executionFeedback: parsedResponse.feedback?.execution || "Harder than you think.",
        verdict: parsedResponse.verdict || "Not ready yet.",
        investmentStatus: parsedResponse.investmentStatus || "PASS"
      },
      model: "Gemini 2.0 Flash",
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(finalResponse);

  } catch (error: any) {
    console.error('API error:', error);
    
    // Check if it's a quota error
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({
        error: 'Rate limit reached',
        details: 'Too many requests. Try again in a minute.',
        retryAfter: 60
      });
    }

    // Generic error response
    return res.status(500).json({
      error: 'Failed to analyze idea',
      details: error.message || 'Internal server error',
      fallback: {
        score: 3.05,
        comment: "Analysis failed. Try again with a clearer description.",
        aiScores: {
          market: 2.50,
          innovation: 3.00,
          execution: 4.00,
          overall: 3.05,
          marketFeedback: "Unable to assess market.",
          innovationFeedback: "Innovation level unclear.",
          executionFeedback: "Execution complexity unknown.",
          verdict: "Analysis failed. Try again with a clearer description.",
          investmentStatus: "PASS"
        }
      }
    });
  }
}
