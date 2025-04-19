// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, User, Trophy, Users, Flag, Star, Terminal, Book, Zap, Calendar } from 'lucide-react'
import EditProfileModal from '@/components/profile/EditProfileModal'

interface Profile {
  id: string
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ctf_experience: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
  interests: string[]
  preferred_roles: string[]
  availability: 'part_time' | 'full_time' | 'weekends_only' | 'flexible'
  time_zone: string
  preferred_team_size: 'small' | 'medium' | 'large'
  communication_style: 'async' | 'sync' | 'mixed'
  learning_goals: string[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.error('Error fetching user:', error)
        router.push('/login')
        return
      }
      setUser(user)
      fetchProfile(user.id)
    }

    getUser()
  }, [router])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return
    }

    setProfile(data)
  }

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const formatEnumValue = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-8">
            <div className="h-32 w-32 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center">
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.user_metadata?.full_name || 'Welcome back!'}
              </h1>
              <p className="text-white/80">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium transition-all border border-white/20"
            >
              <Edit2 className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-all"
          >
            <div className="p-3 bg-purple-100 rounded-xl">
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-500">CTFs Completed</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-all"
          >
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-500">Team Members</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-all"
          >
            <div className="p-3 bg-green-100 rounded-xl">
              <Flag className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-500">Flags Captured</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-all"
          >
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-600">0</p>
              <p className="text-sm text-gray-500">Points Earned</p>
            </div>
          </motion.div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="col-span-2 space-y-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="text-gray-500 text-sm">
                  No recent activity to show.
                </div>
              </div>
            </motion.div>

            {/* Skills & Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                  <Terminal className="w-5 h-5 mr-2 text-purple-600" />
                  Skills & Experience
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Skill Level</h3>
                  <p className="text-gray-900 font-medium">{formatEnumValue(profile.skill_level)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">CTF Experience</h3>
                  <p className="text-gray-900 font-medium">{formatEnumValue(profile.ctf_experience)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-8"
          >
            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Preferences
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Availability</h3>
                  <p className="text-gray-900">{formatEnumValue(profile.availability)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Time Zone</h3>
                  <p className="text-gray-900">{profile.time_zone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Communication Style</h3>
                  <p className="text-gray-900">{formatEnumValue(profile.communication_style)}</p>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                  <Book className="w-5 h-5 mr-2 text-purple-600" />
                  Learning Goals
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {profile.learning_goals.map((goal) => (
                    <span
                      key={goal}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditMode && (
          <EditProfileModal
            profile={profile}
            onClose={() => setIsEditMode(false)}
            onUpdate={() => fetchProfile(user.id)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}