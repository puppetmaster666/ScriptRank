// scripts/populateFakeData.ts
// Run this file locally: npx ts-node scripts/populateFakeData.ts

import { initializeApp } from 'firebase/app'
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword
} from 'firebase/auth'

// Your Firebase config - you need to fill these in
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "scriptrank-5885f",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Fake users data with FIXED aiScores structure
const fakeUsers = [
  { 
    name: 'Michael Rodriguez', 
    email: 'michael.rodriguez@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'Neon Nights',
        type: 'movie',  // Changed from 'entertainment' to 'movie'
        content: 'A cyberpunk thriller set in 2087 Tokyo. A detective with memory implants must solve murders that haven\'t happened yet. The city itself becomes a character as augmented reality bleeds into the real world.',
        aiScores: {
          overall: 8.73,
          market: 8.52,
          innovation: 9.01,
          execution: 8.64
        }
      }
    ]
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@fake.com', 
    password: 'Test123!',
    ideas: [
      {
        title: 'The Last Comedian',
        type: 'movie',
        content: 'In a world where AI has replaced all entertainment, one comedian fights to prove humans are still funny. A dark comedy that questions what makes us human.',
        aiScores: {
          overall: 8.24,
          market: 8.03,
          innovation: 8.51,
          execution: 8.18
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
          execution: 7.48
        }
      }
    ]
  },
  {
    name: 'David Park',
    email: 'david.park@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'GreenEats',
        type: 'business',
        content: 'Zero-waste meal delivery using only reusable containers tracked by blockchain. Return containers get you discounts. Partner with local restaurants.',
        aiScores: {
          overall: 8.43,
          market: 8.79,
          innovation: 8.02,
          execution: 8.31
        }
      }
    ]
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'Mind Maze VR',
        type: 'game',
        content: 'Puzzle VR game where each level is based on psychological concepts. Solve your own mind to escape. Features adaptive difficulty based on player behavior.',
        aiScores: {
          overall: 7.81,
          market: 7.53,
          innovation: 8.32,
          execution: 7.59
        }
      }
    ]
  },
  {
    name: 'Alex Thompson',
    email: 'alex.thompson@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'Pixel Dungeons',
        type: 'game',
        content: 'Roguelike mobile game with time-loop mechanics. Every death teaches you something new about the dungeon. Procedurally generated with story elements.',
        aiScores: {
          overall: 7.48,
          market: 7.82,
          innovation: 7.23,
          execution: 7.51
        }
      }
    ]
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'AI Resume Coach',
        type: 'business',
        content: 'SaaS that analyzes job postings and automatically tailors your resume to match keywords and requirements. Uses GPT to rewrite descriptions.',
        aiScores: {
          overall: 8.12,
          market: 8.47,
          innovation: 7.85,
          execution: 8.03
        }
      }
    ]
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus.johnson@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'RentMyGarage',
        type: 'business',
        content: 'Uber for storage space. Homeowners rent out garage space by the square foot, with insurance included. Smart locks for secure access.',
        aiScores: {
          overall: 7.63,
          market: 8.01,
          innovation: 7.04,
          execution: 7.82
        }
      }
    ]
  },
  {
    name: 'Jennifer Williams',
    email: 'jennifer.williams@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'Echoes of Tomorrow',
        type: 'movie',
        content: 'Sci-fi series about archaeologists who discover future artifacts buried in the past. Each artifact reveals humanity\'s fate. Mind-bending time paradoxes.',
        aiScores: {
          overall: 8.36,
          market: 8.05,
          innovation: 8.87,
          execution: 8.21
        }
      }
    ]
  },
  {
    name: 'Robert Taylor',
    email: 'robert.taylor@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'Street Kings',
        type: 'movie',
        content: 'Crime drama following chess hustlers in NYC who use the game to run an underground empire. Each chess move mirrors their criminal strategy.',
        aiScores: {
          overall: 7.71,
          market: 7.52,
          innovation: 7.94,
          execution: 7.68
        }
      }
    ]
  },
  {
    name: 'James Mitchell',
    email: 'james.mitchell@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'Battle Royale Chess',
        type: 'game',
        content: '100 players start on a giant chess board. Capture pieces to gain their powers. Last player standing wins. Real-time strategy meets classic chess.',
        aiScores: {
          overall: 8.04,
          market: 8.22,
          innovation: 8.15,
          execution: 7.76
        }
      }
    ]
  }
]

async function populateFakeData() {
  console.log('🚀 Starting to populate fake data with correct aiScores structure...')
  
  const createdIdeas: any[] = []

  // Try to use existing users or create new ones
  for (const userData of fakeUsers) {
    let userId: string
    
    try {
      // Try to sign in first (user might already exist)
      console.log(`Trying to sign in as: ${userData.name}`)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      )
      userId = userCredential.user.uid
      console.log(`✅ Signed in as existing user: ${userData.name}`)
      
    } catch (signInError: any) {
      // If sign in fails, create new user
      if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
        try {
          console.log(`Creating new user: ${userData.name}`)
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
          )
          
          const user = userCredential.user
          userId = user.uid
          
          // Update display name
          await updateProfile(user, {
            displayName: userData.name,
            photoURL: `https://ui-avatars.com/api/?name=${userData.name}&background=000&color=fff`
          })
          
          // Create user profile in Firestore
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: userData.email,
            displayName: userData.name,
            username: userData.name.toLowerCase().replace(' ', '.'),
            photoURL: `https://ui-avatars.com/api/?name=${userData.name}&background=000&color=fff`,
            createdAt: serverTimestamp(),
            subscription: {
              tier: 'free',
              submissionsRemaining: 3,
              submissionsUsedThisMonth: 0,
              resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            stats: {
              totalIdeas: 0,
              averageAIScore: 0,
              averagePublicScore: 0,
              bestIdeaScore: 0,
              totalVotesCast: 0
            }
          })
          
          console.log(`✅ Created new user: ${userData.name}`)
        } catch (createError: any) {
          console.error(`Error creating user ${userData.name}:`, createError)
          continue
        }
      } else {
        console.error(`Error signing in ${userData.name}:`, signInError)
        continue
      }
    }

    // Now create ideas for this user
    for (const idea of userData.ideas) {
      try {
        console.log(`Creating idea: ${idea.title} by ${userData.name}`)
        
        // Calculate month for archiving
        const now = new Date()
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        
        const ideaRef = await addDoc(collection(db, 'ideas'), {
          title: idea.title,
          type: idea.type,
          content: idea.content,
          userId: userId,
          userName: userData.name,
          username: userData.name.toLowerCase().replace(' ', '.'),
          userPhotoURL: `https://ui-avatars.com/api/?name=${userData.name}&background=000&color=fff`,
          
          // FIXED: Using nested aiScores structure
          aiScores: idea.aiScores,
          
          // Additional AI feedback
          aiComment: `This ${idea.type} idea shows strong potential with innovative concepts and market viability.`,
          status: idea.aiScores.overall > 8 ? 'INVEST' : idea.aiScores.overall > 7 ? 'MAYBE' : 'PASS',
          
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
          createdAt: serverTimestamp(),
          month: month
        })
        
        createdIdeas.push({
          id: ideaRef.id,
          ...idea,
          userId: userId,
          userName: userData.name
        })
        
        console.log(`✅ Created idea: ${idea.title}`)
        
      } catch (error) {
        console.error(`Error creating idea ${idea.title}:`, error)
      }
    }
  }

  console.log('🎉 Fake data population complete!')
  console.log(`Created ${createdIdeas.length} ideas`)
  
  // Display test credentials
  console.log('\n📝 Test Credentials:')
  fakeUsers.forEach(user => {
    console.log(`Email: ${user.email} | Password: Test123!`)
  })
  
  console.log('\n✨ Ideas should now appear on your website with proper aiScores structure!')
}

// Run the script
populateFakeData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
