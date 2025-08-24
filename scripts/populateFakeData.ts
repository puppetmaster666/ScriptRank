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
  updateProfile
} from 'firebase/auth'

// Your Firebase config
const firebaseConfig = {
  // Copy your config from .env.local
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Fake users data
const fakeUsers = [
  { 
    name: 'Michael Rodriguez', 
    email: 'michael.rodriguez@fake.com',
    password: 'Test123!',
    ideas: [
      {
        title: 'Neon Nights',
        type: 'entertainment',
        content: 'A cyberpunk thriller set in 2087 Tokyo. A detective with memory implants must solve murders that haven\'t happened yet.',
        aiScore: 8.7
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
        type: 'entertainment',
        content: 'In a world where AI has replaced all entertainment, one comedian fights to prove humans are still funny.',
        aiScore: 8.2
      },
      {
        title: 'Memory Lane VR',
        type: 'game',
        content: 'A VR game where players literally walk through their memories and can change small details to alter their present.',
        aiScore: 7.9
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
        content: 'Zero-waste meal delivery using only reusable containers tracked by blockchain. Return containers get you discounts.',
        aiScore: 8.4
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
        content: 'Puzzle VR game where each level is based on psychological concepts. Solve your own mind to escape.',
        aiScore: 7.8
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
        content: 'Roguelike mobile game with time-loop mechanics. Every death teaches you something new about the dungeon.',
        aiScore: 7.5
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
        content: 'SaaS that analyzes job postings and automatically tailors your resume to match keywords and requirements.',
        aiScore: 8.1
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
        content: 'Uber for storage space. Homeowners rent out garage space by the square foot, with insurance included.',
        aiScore: 7.6
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
        type: 'entertainment',
        content: 'Sci-fi series about archaeologists who discover future artifacts buried in the past. Each artifact reveals humanity\'s fate.',
        aiScore: 8.3
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
        type: 'entertainment',
        content: 'Crime drama following chess hustlers in NYC who use the game to run an underground empire.',
        aiScore: 7.7
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
        content: '100 players start on a giant chess board. Capture pieces to gain their powers. Last player standing wins.',
        aiScore: 8.0
      }
    ]
  }
]

async function populateFakeData() {
  console.log('🚀 Starting to populate fake data...')
  
  const createdUsers: any[] = []
  const createdIdeas: any[] = []

  // Step 1: Create fake user accounts
  for (const userData of fakeUsers) {
    try {
      console.log(`Creating user: ${userData.name}`)
      
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      )
      
      const user = userCredential.user
      
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
        role: 'user',
        isPremium: Math.random() > 0.7, // 30% premium users
        bio: `Creative professional passionate about innovative ideas.`,
        location: 'San Francisco, CA',
        website: `https://${userData.name.toLowerCase().replace(' ', '')}.com`
      })
      
      createdUsers.push({
        ...userData,
        uid: user.uid
      })
      
      console.log(`✅ Created user: ${userData.name}`)
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`User ${userData.email} already exists, skipping...`)
      } else {
        console.error(`Error creating user ${userData.name}:`, error)
      }
    }
  }

  // Step 2: Create ideas for each user
  for (const user of createdUsers) {
    for (const idea of user.ideas) {
      try {
        console.log(`Creating idea: ${idea.title} by ${user.name}`)
        
        const ideaRef = await addDoc(collection(db, 'ideas'), {
          title: idea.title,
          type: idea.type,
          content: idea.content,
          userId: user.uid,
          userName: user.name,
          userPhotoURL: `https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`,
          aiScore: idea.aiScore,
          aiComment: 'This idea shows strong potential with innovative concepts and market viability.',
          votes: [],
          views: Math.floor(Math.random() * 500) + 100,
          createdAt: serverTimestamp(),
          status: idea.aiScore > 8 ? 'INVEST' : idea.aiScore > 7 ? 'MAYBE' : 'PASS'
        })
        
        createdIdeas.push({
          id: ideaRef.id,
          ...idea,
          userId: user.uid,
          userName: user.name
        })
        
        console.log(`✅ Created idea: ${idea.title}`)
        
      } catch (error) {
        console.error(`Error creating idea ${idea.title}:`, error)
      }
    }
  }

  // Step 3: Add cross-voting between users
  console.log('Adding votes between users...')
  
  for (const idea of createdIdeas) {
    // Each idea gets votes from 3-7 random users
    const voteCount = Math.floor(Math.random() * 5) + 3
    const voters = createdUsers
      .filter(u => u.uid !== idea.userId) // Can't vote for own idea
      .sort(() => Math.random() - 0.5)
      .slice(0, voteCount)
    
    const votes = voters.map(voter => ({
      userId: voter.uid,
      userName: voter.name,
      value: Math.random() > 0.3 ? 1 : -1, // 70% upvotes
      createdAt: new Date()
    }))
    
    try {
      await setDoc(doc(db, 'ideas', idea.id), {
        votes: votes,
        voteCount: votes.reduce((sum, v) => sum + v.value, 0)
      }, { merge: true })
      
      console.log(`✅ Added ${votes.length} votes to "${idea.title}"`)
    } catch (error) {
      console.error(`Error adding votes to ${idea.title}:`, error)
    }
  }

  // Step 4: Add some comments
  console.log('Adding comments...')
  
  const comments = [
    'This is brilliant! Would love to see this developed.',
    'Interesting concept, but how would you handle the technical challenges?',
    'I\'ve been thinking about something similar. Let\'s connect!',
    'This could really disrupt the industry.',
    'Love the creativity here. Have you considered the legal aspects?',
    'Solid idea! The market is definitely ready for this.',
    'This reminds me of another successful project. Great potential!',
    'Would definitely use this. When can we expect a prototype?'
  ]
  
  for (const idea of createdIdeas.slice(0, 5)) { // Add comments to first 5 ideas
    const commentCount = Math.floor(Math.random() * 3) + 1
    
    for (let i = 0; i < commentCount; i++) {
      const commenter = createdUsers[Math.floor(Math.random() * createdUsers.length)]
      
      try {
        await addDoc(collection(db, 'ideas', idea.id, 'comments'), {
          userId: commenter.uid,
          userName: commenter.name,
          userPhotoURL: `https://ui-avatars.com/api/?name=${commenter.name}&background=000&color=fff`,
          content: comments[Math.floor(Math.random() * comments.length)],
          createdAt: serverTimestamp()
        })
        
        console.log(`✅ Added comment to "${idea.title}"`)
      } catch (error) {
        console.error(`Error adding comment:`, error)
      }
    }
  }

  console.log('🎉 Fake data population complete!')
  console.log(`Created ${createdUsers.length} users and ${createdIdeas.length} ideas`)
  
  // Display credentials for testing
  console.log('\n📝 Test Credentials:')
  createdUsers.forEach(user => {
    console.log(`Email: ${user.email} | Password: Test123!`)
  })
}

// Run the script
populateFakeData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
