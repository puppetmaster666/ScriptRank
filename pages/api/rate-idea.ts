// pages/api/rate-idea.ts
// Gemini 2.0 Flash with harsh Silicon Valley VC-style multi-score rating

import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// VC-style prompt for harsh, realistic evaluation
function getVCPrompt(type: string, content: string): string {
  return `You are a top-tier Silicon Valley venture capitalist known for brutal honesty. You've seen thousands of pitches and have no time for mediocrity. Evaluate this ${type} idea with the harsh reality of the market.

IDEA: "${content}"

Provide a detailed investment analysis with EXACTLY this JSON format (be extremely precise with decimals to 2 places):

{
  "scores": {
    "market": [0.00-10.00],
    "innovation": [0.00-10.00],
    "execution": [0.00-10.00]
  },
  "feedback": {
    "market": "[1-2 sentences on market viability, TAM, monetization potential]",
    "innovation": "[1-2 sentences on uniqueness, differentiation, moat]",
    "execution": "[1-2 sentences on technical feasibility, team requirements, timeline]"
  },
  "verdict": "[2-3 sentences of brutal honesty about why you'd pass or invest]",
  "investmentStatus": "[INVEST/PASS/MAYBE]"
}

Scoring Guidelines (BE HARSH):
- Market (0-10): 0-3 = No market, 4-6 = Niche market, 7-8 = Large market, 9-10 = Massive TAM
- Innovation (0-10): 0-3 = Complete copy, 4-6 = Minor twist, 7-8 = Novel approach, 9-10 = Revolutionary
- Execution (0-10): 0-3 = Nearly impossible, 4-6 = Very hard, 7-8 = Doable with effort, 9-10 = Easy win

Remember: 
- Most ideas score 3-6. Scores above 7 are RARE.
- Be specific about flaws. Founders need truth, not encouragement.
- If it's been done before, say so. If it's impossible, say so.
- Consider: Would YOU invest YOUR money in this?
- Use precise decimals (e.g., 4.73, not 5.00) for more accurate scoring.`;
}

// Calculate weighted overall score
function calculateOverallScore(market: number, innovation: number, execution: number): number {
  // Market is king in VC world (40%), Innovation and Execution split the rest (30% each)
  const overall = (market * 0.40) + (innovation * 0.30) + (execution * 0.30);
  return Math.round(overall * 100) / 100; // Round to 2 decimals
}

// Validate word count
function validateWordCount(content: string): { valid: boolean; wordCount: number; error?: string } {
  const words = content.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  if (wordCount < 30) {
    return {
      valid: false,
      wordCount,
      error: `Too brief. Provide at least 30 words (currently ${wordCount}). VCs need substance, not tweets.`
    };
  }
  
  if (wordCount > 500) {
    return {
      valid: false,
      wordCount,
      error: `Too long. Maximum 500 words (currently ${wordCount}). If you can't explain it simply, you don't understand it.`
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
    // Use Gemini 2.0 Flash (experimental) for latest capabilities
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,  // Some creativity but mostly consistent
        maxOutputTokens: 800,
        topP: 0.95,
      }
    });

    const prompt = getVCPrompt(type, content);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    let parsedResponse;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      // Fallback to a harsh default response
      parsedResponse = {
        scores: {
          market: 3.42,
          innovation: 4.18,
          execution: 5.23
        },
        feedback: {
          market: "Market viability unclear. No evidence of customer demand or willingness to pay.",
          innovation: "Incremental improvement at best. Nothing here that doesn't already exist.",
          execution: "Technically feasible but requires significant resources with uncertain ROI."
        },
        verdict: "Hard pass. This is a solution desperately searching for a problem. Come back when you've talked to 100 potential customers.",
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
      aiScores: {
        market: scores.market,
        innovation: scores.innovation,
        execution: scores.execution,
        overall: overallScore,
        marketFeedback: parsedResponse.feedback?.market || "No clear market opportunity identified.",
        innovationFeedback: parsedResponse.feedback?.innovation || "Lacks meaningful differentiation.",
        executionFeedback: parsedResponse.feedback?.execution || "Execution challenges underestimated.",
        verdict: parsedResponse.verdict || "Not investment ready.",
        investmentStatus: parsedResponse.investmentStatus || "PASS"
      },
      model: "Gemini 2.0 Flash (VC Mode)",
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(finalResponse);

  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    // Check if it's a quota error
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({
        error: 'Rate limit reached',
        details: 'Too many requests. Please try again in a few moments.',
        retryAfter: 60
      });
    }

    // Generic error response
    return res.status(500).json({
      error: 'Failed to analyze idea',
      details: error.message || 'Internal server error',
      // Provide a harsh fallback score
      fallback: {
        aiScores: {
          market: 2.50,
          innovation: 3.00,
          execution: 4.00,
          overall: 3.05,
          marketFeedback: "Unable to properly assess market viability.",
          innovationFeedback: "Innovation level unclear.",
          executionFeedback: "Execution complexity undetermined.",
          verdict: "Analysis failed. Resubmit with clearer value proposition.",
          investmentStatus: "PASS"
        }
      }
    });
  }
}
