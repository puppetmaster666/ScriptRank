// pages/profile/[username].tsx - FIXED VERSION
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { PageLayout, Button, Card, Badge, Tabs, EmptyState, Input, Textarea } from '@/components/designSystem'

interface UserProfile {
  uid: string
  displayName: string
  username: string
  email: string
  photoURL: string
  bio: string
  location: string
  website: string
  isPremium: boolean
  createdAt: any
  followers: string[]
  following: string[]
}

interface Idea {
  id: string
  title: string
  type: string
  content: string
  aiScore: number
  voteCount: number
  status: string
  createdAt: any
}

export default function ProfilePage() {
  const router = useRouter()
  const { username } = router.query
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [votedIdeas, setVotedIdeas] = useState<Idea[]>([])
  const [followers, setFollowers] = useState<UserProfile[]>([])
  const [following, setFollowing] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ideas')
  const [isFollowing, setIsFollowing] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({
    bio: '',
    location: '',
    website: ''
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const isOwnProfile = currentUser?.displayName?.toLowerCase().replace(' ', '.') === username ||
                       currentUser?.email?.split('@')[0] === username

  useEffect(() => {
    if (username) {
      fetchProfile()
    }
  }, [username])

  useEffect(() => {
    if (profile && currentUser) {
      // FIX: Check if followers array exists before using includes
      const followersArray = profile.followers || []
      setIsFollowing(followersArray.includes(currentUser.uid))
    }
  }, [profile, currentUser])

  const fetchProfile = async () => {
    try {
      // Find user by username
      const usersQuery = query(collection(db, 'users'), where('username', '==', username))
      const userSnapshot = await getDocs(usersQuery)
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data() as UserProfile
        
        // FIX: Ensure arrays exist
        const safeProfile = {
          ...userData,
          followers: userData.followers || [],
          following: userData.following || []
        }
        
        setProfile(safeProfile)
        setEditData({
          bio: safeProfile.bio || '',
          location: safeProfile.location || '',
          website: safeProfile.website || ''
        })
        
        // Fetch user's ideas
        const ideasQuery = query(collection(db, 'ideas'), where('userId', '==', safeProfile.uid))
        const ideasSnapshot = await getDocs(ideasQuery)
        const ideasData = ideasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Idea[]
        setIdeas(ideasData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
        
        // Fetch followers/following profiles (only if arrays have items)
        if (safeProfile.followers.length > 0) {
          const followersQuery = query(collection(db, 'users'), where('uid', 'in', safeProfile.followers.slice(0, 10)))
          const followersSnapshot = await getDocs(followersQuery)
          setFollowers(followersSnapshot.docs.map(doc => doc.data() as UserProfile))
        } else {
          setFollowers([])
        }
        
        if (safeProfile.following.length > 0) {
          const followingQuery = query(collection(db, 'users'), where('uid', 'in', safeProfile.following.slice(0, 10)))
          const followingSnapshot = await getDocs(followingQuery)
          setFollowing(followingSnapshot.docs.map(doc => doc.data() as UserProfile))
        } else {
          setFollowing([])
        }
      } else {
        router.push('/404')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!currentUser || !profile) return
    
    try {
      const userRef = doc(db, 'users', profile.uid)
      const currentUserRef = doc(db, 'users', currentUser.uid)
      
      if (isFollowing) {
        // Unfollow
        await updateDoc(userRef, {
          followers: arrayRemove(currentUser.uid)
        })
        await updateDoc(currentUserRef, {
          following: arrayRemove(profile.uid)
        })
        setIsFollowing(false)
        setProfile(prev => prev ? {
          ...prev, 
          followers: (prev.followers || []).filter(id => id !== currentUser.uid)
        } : null)
      } else {
        // Follow
        await updateDoc(userRef, {
          followers: arrayUnion(currentUser.uid)
        })
        await updateDoc(currentUserRef, {
          following: arrayUnion(profile.uid)
        })
        setIsFollowing(true)
        setProfile(prev => prev ? {
          ...prev, 
          followers: [...(prev.followers || []), currentUser.uid]
        } : null)
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error)
    }
  }

  const handleEditProfile = async () => {
    if (!currentUser || !profile) return
    
    try {
      const userRef = doc(db, 'users', profile.uid)
      await updateDoc(userRef, editData)
      setProfile(prev => prev ? {...prev, ...editData} : null)
      setEditMode(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const calculateStats = () => {
    const totalVotes = ideas.reduce((sum, idea) => sum + (idea.voteCount || 0), 0)
    const avgScore = ideas.length > 0 
      ? (ideas.reduce((sum, idea) => sum + (idea.aiScore || 0), 0) / ideas.length).toFixed(1)
      : '0.0'
    
    return { totalVotes, avgScore }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    )
  }

  if (!profile) {
    return (
      <PageLayout>
        <EmptyState 
          title="User not found"
          description="This user doesn't exist or has been removed."
          action={{ label: "Go Home", href: "/" }}
        />
      </PageLayout>
    )
  }

  const { totalVotes, avgScore } = calculateStats()
  const followersCount = (profile.followers || []).length
  const followingCount = (profile.following || []).length

  return (
    <>
      <Head>
        <title>{profile.displayName} | Make Me Famous</title>
        <meta name="description" content={profile.bio || `View ${profile.displayName}'s ideas and profile`} />
      </Head>

      <PageLayout>
        {/* Profile Header - Black Section */}
        <div className="bg-black text-white py-12 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start gap-6">
                  <img 
                    src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}&background=000&color=fff`}
                    alt={profile.displayName}
                    className="w-24 h-24 rounded-full border-4 border-white"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h1 className="text-4xl font-display font-black">
                        {profile.displayName}
                      </h1>
                      {profile.isPremium && (
                        <Badge variant="warning">PRO</Badge>
                      )}
                    </div>
                    <p className="font-body text-gray-300 mb-4">@{profile.username}</p>
                    
                    {editMode ? (
                      <div className="space-y-3">
                        <Textarea
                          label=""
                          value={editData.bio}
                          onChange={(e) => setEditData({...editData, bio: e.target.value})}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                        <Input
                          label=""
                          value={editData.location}
                          onChange={(e) => setEditData({...editData, location: e.target.value})}
                          placeholder="Location"
                        />
                        <Input
                          label=""
                          value={editData.website}
                          onChange={(e) => setEditData({...editData, website: e.target.value})}
                          placeholder="Website URL"
                        />
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={handleEditProfile}>
                            Save
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {profile.bio && (
                          <p className="font-body text-white mb-4">{profile.bio}</p>
                        )}
                        <div className="flex flex-wrap gap-4 font-body text-sm text-gray-300">
                          {profile.location && (
                            <span>📍 {profile.location}</span>
                          )}
                          {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                              🔗 {profile.website.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                          <span>📅 Joined {profile.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mt-8">
                  <div>
                    <div className="text-2xl font-bold font-ui">{ideas.length}</div>
                    <div className="font-body text-sm text-gray-400">Ideas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-ui">{totalVotes}</div>
                    <div className="font-body text-sm text-gray-400">Total Votes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-ui">{avgScore}</div>
                    <div className="font-body text-sm text-gray-400">Avg Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-ui">{followersCount}</div>
                    <div className="font-body text-sm text-gray-400">Followers</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {isOwnProfile ? (
                  <>
                    <Button 
                      variant="secondary" 
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                    <Button variant="outline" href="/submit">
                      Submit New Idea
                    </Button>
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : currentUser ? (
                  <Button 
                    variant={isFollowing ? 'secondary' : 'primary'}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                ) : (
                  <Button variant="primary" href="/register">
                    Sign In to Follow
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-black bg-gray-50">
          <div className="max-w-5xl mx-auto px-8">
            <Tabs
              tabs={[
                { id: 'ideas', label: `Ideas (${ideas.length})` },
                { id: 'voted', label: 'Voted' },
                { id: 'followers', label: `Followers (${followersCount})` },
                { id: 'following', label: `Following (${followingCount})` },
                ...(isOwnProfile ? [{ id: 'settings', label: 'Settings' }] : [])
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Ideas Tab */}
          {activeTab === 'ideas' && (
            <div className="space-y-4">
              {ideas.length > 0 ? (
                ideas.map(idea => (
                  <Link key={idea.id} href={`/ideas/${idea.id}`}>
                    <Card hover>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-display font-bold mb-2">
                            {idea.title}
                          </h3>
                          <p className="font-body text-gray-600 mb-4">
                            {idea.content.substring(0, 150)}...
                          </p>
                          <div className="flex gap-6 text-sm font-ui">
                            <span>AI Score: <strong>{idea.aiScore || 0}</strong></span>
                            <span>Votes: <strong>{idea.voteCount || 0}</strong></span>
                            <Badge variant={
                              idea.status === 'INVEST' ? 'success' :
                              idea.status === 'MAYBE' ? 'warning' : 'danger'
                            }>
                              {idea.status}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View →
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <EmptyState 
                  title="No ideas yet"
                  description={isOwnProfile ? "Submit your first idea to get started!" : "This user hasn't submitted any ideas yet."}
                  action={isOwnProfile ? { label: "Submit Idea", href: "/submit" } : undefined}
                />
              )}
            </div>
          )}

          {/* Other tabs remain the same... */}
          {activeTab === 'voted' && (
            <div className="space-y-4">
              {votedIdeas.length > 0 ? (
                votedIdeas.map(idea => (
                  <Link key={idea.id} href={`/ideas/${idea.id}`}>
                    <Card hover>
                      <h3 className="font-display font-bold">{idea.title}</h3>
                      <p className="font-body text-sm text-gray-600">
                        Voted on {idea.createdAt?.toDate?.()?.toLocaleDateString()}
                      </p>
                    </Card>
                  </Link>
                ))
              ) : (
                <EmptyState 
                  title="No votes yet"
                  description="Ideas voted on will appear here."
                />
              )}
            </div>
          )}

          {/* Followers Tab */}
          {activeTab === 'followers' && (
            <div className="grid md:grid-cols-2 gap-4">
              {followers.length > 0 ? (
                followers.map(follower => (
                  <Link key={follower.uid} href={`/profile/${follower.username}`}>
                    <Card hover>
                      <div className="flex items-center gap-3">
                        <img 
                          src={follower.photoURL || `https://ui-avatars.com/api/?name=${follower.displayName}&background=000&color=fff`}
                          alt={follower.displayName}
                          className="w-12 h-12 rounded-full border-2 border-black"
                        />
                        <div>
                          <p className="font-ui font-medium">{follower.displayName}</p>
                          <p className="font-body text-xs text-gray-600">@{follower.username}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="md:col-span-2">
                  <EmptyState 
                    title="No followers yet"
                    description="Followers will appear here."
                  />
                </div>
              )}
            </div>
          )}

          {/* Following Tab */}
          {activeTab === 'following' && (
            <div className="grid md:grid-cols-2 gap-4">
              {following.length > 0 ? (
                following.map(user => (
                  <Link key={user.uid} href={`/profile/${user.username}`}>
                    <Card hover>
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=000&color=fff`}
                          alt={user.displayName}
                          className="w-12 h-12 rounded-full border-2 border-black"
                        />
                        <div>
                          <p className="font-ui font-medium">{user.displayName}</p>
                          <p className="font-body text-xs text-gray-600">@{user.username}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="md:col-span-2">
                  <EmptyState 
                    title="Not following anyone"
                    description="Users you follow will appear here."
                  />
                </div>
              )}
            </div>
          )}

          {/* Settings Tab (Own Profile Only) */}
          {activeTab === 'settings' && isOwnProfile && (
            <div className="max-w-2xl">
              <Card>
                <h2 className="text-2xl font-display font-bold mb-6">ACCOUNT SETTINGS</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-ui font-bold mb-2">Email</h3>
                    <p className="font-body text-gray-600">{profile.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-ui font-bold mb-2">Username</h3>
                    <p className="font-body text-gray-600">@{profile.username}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-ui font-bold mb-2">Account Type</h3>
                    <p className="font-body text-gray-600">
                      {profile.isPremium ? 'Premium Account' : 'Free Account'}
                    </p>
                    {!profile.isPremium && (
                      <Button variant="primary" className="mt-3">
                        Upgrade to Premium
                      </Button>
                    )}
                  </div>
                  
                  <div className="pt-6 border-t-2 border-gray-200">
                    <h3 className="font-ui font-bold mb-2 text-red-600">Danger Zone</h3>
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </PageLayout>

      <style jsx>{`
        .font-display {
          font-family: 'DrukWide', Impact, sans-serif;
        }
        .font-ui {
          font-family: 'Bahnschrift', system-ui, sans-serif;
        }
        .font-body {
          font-family: 'Courier', 'Courier New', monospace;
        }
      `}</style>
    </>
  )
}
