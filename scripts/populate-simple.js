// scripts/populate-simple.js
// Run this in your browser console while on your website

async function populateFakeIdeas() {
  // Check if Firebase is available
  if (typeof firebase === 'undefined') {
    console.error('Firebase not found. Make sure you run this on your website.');
    return;
  }

  console.log('🚀 Starting to populate fake ideas...');

  // Get current user (you need to be logged in)
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    console.error('Please log in first!');
    return;
  }

  const db = firebase.firestore();
  
  // Fake ideas data with proper aiScores structure
  const fakeIdeas = [
    {
      title: 'Neon Nights',
      type: 'movie',
      content: 'A cyberpunk thriller set in 2087 Tokyo. A detective with memory implants must solve murders that haven\'t happened yet. The city itself becomes a character as augmented reality bleeds into the real world.',
      aiScores: {
        overall: 8.73,
        market: 8.52,
        innovation: 9.01,
        execution: 8.64,
        verdict: "Strong cyberpunk concept with fresh take on detective noir. Market timing is perfect with current sci-fi trends.",
        marketFeedback: "Cyberpunk is hot right now. Netflix would eat this up.",
        innovationFeedback: "Memory implant detective is fresh. Predicting murders is brilliant.",
        executionFeedback: "VFX will be expensive but doable with current tech.",
        investmentStatus: "INVEST"
      }
    },
    {
      title: 'The Last Comedian',
      type: 'movie',
      content: 'In a world where AI has replaced all entertainment, one comedian fights to prove humans are still funny. A dark comedy that questions what makes us human.',
      aiScores: {
        overall: 8.24,
        market: 8.03,
        innovation: 8.51,
        execution: 8.18,
        verdict: "Timely concept that taps into AI anxieties. Could be this generation's Truman Show.",
        marketFeedback: "Comedy about AI is very timely. Wide appeal.",
        innovationFeedback: "Fresh angle on AI dystopia through comedy lens.",
        executionFeedback: "Simple concept, relies on strong script and acting.",
        investmentStatus: "INVEST"
      }
    },
    {
      title: 'Memory Lane VR',
      type: 'game',
      content: 'A VR game where players literally walk through their memories and can change small details to alter their present. Each choice creates ripple effects.',
      aiScores: {
        overall: 7.92,
        market: 8.21,
        innovation: 8.05,
        execution: 7.48,
        verdict: "Solid VR concept but execution challenges are significant. Market is ready for this.",
        marketFeedback: "VR market growing. Emotional games sell well.",
        innovationFeedback: "Memory manipulation in VR is relatively fresh.",
        executionFeedback: "Complex branching narratives are hard to execute well.",
        investmentStatus: "MAYBE"
      }
    },
    {
      title: 'GreenEats',
      type: 'business',
      content: 'Zero-waste meal delivery using only reusable containers tracked by blockchain. Return containers get you discounts. Partner with local restaurants.',
      aiScores: {
        overall: 8.43,
        market: 8.79,
        innovation: 8.02,
        execution: 8.31,
        verdict: "Sustainability meets convenience. Strong market fit but operational complexity is high.",
        marketFeedback: "Eco-conscious consumers are a growing market.",
        innovationFeedback: "Blockchain for container tracking is clever.",
        executionFeedback: "Logistics will be challenging but not impossible.",
        investmentStatus: "INVEST"
      }
    },
    {
      title: 'Mind Maze VR',
      type: 'game',
      content: 'Puzzle VR game where each level is based on psychological concepts. Solve your own mind to escape. Features adaptive difficulty based on player behavior.',
      aiScores: {
        overall: 7.81,
        market: 7.53,
        innovation: 8.32,
        execution: 7.59,
        verdict: "Innovative concept but niche market. Could be a cult hit rather than mainstream.",
        marketFeedback: "Puzzle VR is niche but passionate audience.",
        innovationFeedback: "Psychology-based puzzles are unique.",
        executionFeedback: "Adaptive difficulty is complex to balance.",
        investmentStatus: "MAYBE"
      }
    },
    {
      title: 'AI Resume Coach',
      type: 'business',
      content: 'SaaS that analyzes job postings and automatically tailors your resume to match keywords and requirements. Uses GPT to rewrite descriptions.',
      aiScores: {
        overall: 8.12,
        market: 8.47,
        innovation: 7.85,
        execution: 8.03,
        verdict: "Solid B2C SaaS with clear value prop. Crowded market but good execution could win.",
        marketFeedback: "Job seekers always need help. Large market.",
        innovationFeedback: "Not groundbreaking but good application of AI.",
        executionFeedback: "Technically straightforward with existing APIs.",
        investmentStatus: "INVEST"
      }
    },
    {
      title: 'Street Kings',
      type: 'movie',
      content: 'Crime drama following chess hustlers in NYC who use the game to run an underground empire. Each chess move mirrors their criminal strategy.',
      aiScores: {
        overall: 7.71,
        market: 7.52,
        innovation: 7.94,
        execution: 7.68,
        verdict: "Decent concept but feels familiar. Needs a unique hook to stand out.",
        marketFeedback: "Crime dramas are saturated. Chess angle helps.",
        innovationFeedback: "Chess as metaphor has been done but not quite like this.",
        executionFeedback: "Standard production requirements.",
        investmentStatus: "MAYBE"
      }
    },
    {
      title: 'Battle Royale Chess',
      type: 'game',
      content: '100 players start on a giant chess board. Capture pieces to gain their powers. Last player standing wins. Real-time strategy meets classic chess.',
      aiScores: {
        overall: 8.04,
        market: 8.22,
        innovation: 8.15,
        execution: 7.76,
        verdict: "Chess battle royale could tap into both markets. Streaming potential is high.",
        marketFeedback: "Battle royale still popular. Chess is having a moment.",
        innovationFeedback: "First real chess battle royale concept.",
        executionFeedback: "Balancing 100 players will be challenging.",
        investmentStatus: "INVEST"
      }
    }
  ];

  // Create ideas
  let created = 0;
  for (const ideaData of fakeIdeas) {
    try {
      // Add current month for archiving
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      // Create the idea document
      await db.collection('ideas').add({
        ...ideaData,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        username: currentUser.displayName?.toLowerCase().replace(' ', '.') || 'anonymous',
        userPhotoURL: currentUser.photoURL || '',
        
        // Public voting
        publicScore: {
          average: 0,
          count: 0,
          sum: 0
        },
        
        votes: [],
        voteCount: 0,
        views: Math.floor(Math.random() * 500) + 100,
        
        // Timestamps
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        month: month
      });
      
      created++;
      console.log(`✅ Created: ${ideaData.title}`);
    } catch (error) {
      console.error(`❌ Failed to create ${ideaData.title}:`, error);
    }
  }

  console.log(`\n🎉 Done! Created ${created} ideas.`);
  console.log('Refresh the page to see them on the leaderboard!');
}

// Run it
populateFakeIdeas();
