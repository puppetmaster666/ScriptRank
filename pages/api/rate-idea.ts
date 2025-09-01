// pages/api/rate-idea.ts
// Realistic business advisor with context-aware analysis

import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Business type specific context
const businessContext = {
 'business': {
   criteria: 'Consider local regulations, competition, capital requirements, permits, location factors, and operational complexity',
   marketFocus: 'Local market size, customer demand, competition density, location advantages',
   innovationFocus: 'Differentiation from existing businesses, unique value proposition, service innovations',
   executionFocus: 'Startup capital, licensing complexity, operational challenges, time to profitability'
 },
 'movie': {
   criteria: 'Analyze entertainment industry factors including production costs, distribution, audience appeal, and market trends',
   marketFocus: 'Target audience size, genre popularity, comparable film performance, distribution potential',
   innovationFocus: 'Story originality, unique elements vs existing films, creative differentiation',
   executionFocus: 'Production complexity, budget requirements, talent needs, distribution strategy'
 },
 'game': {
   criteria: 'Evaluate gaming industry dynamics including platform requirements, development complexity, and market competition',
   marketFocus: 'Genre market size, platform audience, monetization potential, competitive landscape',
   innovationFocus: 'Gameplay mechanics originality, art style uniqueness, player engagement differentiation',
   executionFocus: 'Development complexity, team requirements, budget estimates, technical feasibility'
 }
};

// Get business type specific prompt
function getAdvisorPrompt(type: string, content: string): string {
 const context = businessContext[type as keyof typeof businessContext] || businessContext.business;
 
 return `You are a realistic business advisor who gives honest, straightforward feedback without sugarcoating problems. You use clear, simple language that anyone can understand. Your goal is to help entrepreneurs improve their ideas, not crush their dreams.

BUSINESS TYPE: ${type.toUpperCase()}
CONTEXT: ${context.criteria}

IDEA: "${content}"

Provide honest but constructive analysis with EXACTLY this JSON format (use precise decimals like 6.73):

{
 "scores": {
   "market": [0.00-10.00],
   "innovation": [0.00-10.00], 
   "execution": [0.00-10.00]
 },
 "feedback": {
   "market": "[2-3 sentences about ${context.marketFocus}. Be realistic but suggest improvements if needed]",
   "innovation": "[2-3 sentences about ${context.innovationFocus}. Point out similar existing solutions but highlight potential differentiators]",
   "execution": "[2-3 sentences about ${context.executionFocus}. Be honest about challenges but suggest how to overcome them]"
 },
 "verdict": "[3-4 sentences of honest assessment. What works, what needs fixing, and specific next steps to improve the idea]",
 "nextSteps": "[2-3 specific, actionable recommendations to strengthen this idea]"
}

Scoring Guidelines (BE REALISTIC):
- Market (0-10): 0-3 = Very limited demand, 4-6 = Moderate demand, 7-8 = Strong demand, 9-10 = Massive demand
- Innovation (0-10): 0-3 = Direct copy, 4-6 = Minor improvements, 7-8 = Significant differentiation, 9-10 = Breakthrough innovation
- Execution (0-10): 0-3 = Extremely difficult, 4-6 = Challenging but doable, 7-8 = Manageable complexity, 9-10 = Straightforward

Remember: 
- Most viable ideas score 4-7. Scores above 8 are exceptional.
- Be honest about problems but always suggest solutions.
- If similar businesses exist, explain how to differentiate.
- Focus on what the entrepreneur needs to validate or improve.
- Consider real-world constraints like regulations, capital, and competition.`;
}

// Calculate weighted overall score
function calculateOverallScore(market: number, innovation: number, execution: number): number {
 // Market matters most (50%), Innovation (25%), Execution (25%)
 const overall = (market * 0.50) + (innovation * 0.25) + (execution * 0.25);
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
     error: `Need more details. At least 30 words required (you have ${wordCount}). Describe your idea, target customers, and what makes it different.`
   };
 }
 
 if (wordCount > 500) {
   return {
     valid: false,
     wordCount,
     error: `Too detailed. Maximum 500 words (you have ${wordCount}). Focus on the core concept and key differentiators.`
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

 // Validate business type
 const validTypes = ['business', 'movie', 'game'];
 if (!validTypes.includes(type)) {
   return res.status(400).json({ 
     error: 'Invalid business type',
     details: `Type must be one of: ${validTypes.join(', ')}`
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
       temperature: 0.6, // Slightly more consistent
       maxOutputTokens: 1000, // More room for detailed feedback
       topP: 0.9,
     }
   });

   const prompt = getAdvisorPrompt(type, content);
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
     // Fallback response with more constructive tone
     parsedResponse = {
       scores: {
         market: 4.50,
         innovation: 5.00,
         execution: 4.75
       },
       feedback: {
         market: "Market demand is unclear from the description. Research your target customers and validate they actually want this solution.",
         innovation: "The concept has potential but needs clearer differentiation. Study existing solutions and identify your unique advantages.",
         execution: "Execution seems challenging but achievable with proper planning. Focus on the most critical requirements first."
       },
       verdict: "This idea has potential but needs more development. The core concept is interesting, but you need to validate market demand and clarify your differentiation. Start by talking to potential customers to understand their real needs.",
       nextSteps: ["Interview 10-20 potential customers about this problem", "Research existing competitors and their weaknesses", "Create a simple prototype or mockup to test your concept"]
     };
   }

   // Ensure scores are numbers and within range
   const scores = {
     market: Math.min(10, Math.max(0, parseFloat(parsedResponse.scores.market) || 4.50)),
     innovation: Math.min(10, Math.max(0, parseFloat(parsedResponse.scores.innovation) || 5.00)),
     execution: Math.min(10, Math.max(0, parseFloat(parsedResponse.scores.execution) || 4.75))
   };

   // Round to 2 decimal places
   scores.market = Math.round(scores.market * 100) / 100;
   scores.innovation = Math.round(scores.innovation * 100) / 100;
   scores.execution = Math.round(scores.execution * 100) / 100;

   // Calculate overall score (market weighted more heavily)
   const overallScore = calculateOverallScore(scores.market, scores.innovation, scores.execution);

   // Prepare final response
   const finalResponse = {
     success: true,
     wordCount: validation.wordCount,
     score: overallScore,
     comment: parsedResponse.verdict || "Interesting concept that needs more development.",
     aiScores: {
       market: scores.market,
       innovation: scores.innovation,
       execution: scores.execution,
       overall: overallScore,
       marketFeedback: parsedResponse.feedback?.market || "Market potential needs validation.",
       innovationFeedback: parsedResponse.feedback?.innovation || "Innovation level requires clarification.",
       executionFeedback: parsedResponse.feedback?.execution || "Execution complexity needs assessment.",
       verdict: parsedResponse.verdict || "Interesting concept that needs more development.",
       nextSteps: parsedResponse.nextSteps || ["Validate market demand", "Research competitors", "Create basic prototype"]
     },
     businessType: type,
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

   // Generic error response with constructive fallback
   return res.status(500).json({
     error: 'Analysis temporarily unavailable',
     details: error.message || 'Please try again in a moment',
     fallback: {
       score: 4.85,
       comment: "Unable to complete analysis right now. Your idea shows promise - try submitting again with more specific details about your target customers and what makes your solution unique.",
       aiScores: {
         market: 4.50,
         innovation: 5.00,
         execution: 5.00,
         overall: 4.85,
         marketFeedback: "Market analysis unavailable. Focus on validating customer demand.",
         innovationFeedback: "Innovation assessment unavailable. Research existing solutions.",
         executionFeedback: "Execution analysis unavailable. Break down into smaller steps.",
         verdict: "Analysis failed, but don't give up. Refine your description and try again.",
         nextSteps: ["Add more details about target customers", "Clarify your unique value proposition", "Specify implementation challenges"]
       }
     }
   });
 }
}
