// src/components/profile/EditProfileModal.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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

interface EditProfileModalProps {
  profile: Profile
  onClose: () => void
  onUpdate: () => void
}

export default function EditProfileModal({ profile, onClose, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState<Profile>(profile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id)

      if (updateError) throw updateError

      onUpdate()
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Profile, value: any) => {
    setFormData((prev: Profile) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skill Level
              </label>
              <select
                value={formData.skill_level}
                onChange={(e) => handleInputChange('skill_level', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* CTF Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CTF Experience
              </label>
              <select
                value={formData.ctf_experience}
                onChange={(e) => handleInputChange('ctf_experience', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {['none', 'beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interests
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  'Web Security',
                  'Reverse Engineering',
                  'Binary Exploitation',
                  'Cryptography',
                  'Forensics',
                  'Network Security',
                  'OSINT',
                  'Mobile Security'
                ].map((interest) => (
                  <label key={interest} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={(e) => {
                        const newInterests = e.target.checked
                          ? [...formData.interests, interest]
                          : formData.interests.filter((i) => i !== interest)
                        handleInputChange('interests', newInterests)
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Roles
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  'Team Leader',
                  'Technical Lead',
                  'Researcher',
                  'Developer',
                  'Analyst',
                  'Documentation'
                ].map((role) => (
                  <label key={role} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferred_roles.includes(role)}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...formData.preferred_roles, role]
                          : formData.preferred_roles.filter((r) => r !== role)
                        handleInputChange('preferred_roles', newRoles)
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {['part_time', 'full_time', 'weekends_only', 'flexible'].map((availability) => (
                  <option key={availability} value={availability}>
                    {availability.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Zone
              </label>
              <select
                value={formData.time_zone}
                onChange={(e) => handleInputChange('time_zone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {[
                  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
                  'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
                  'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
                  'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+06:00', 'UTC+07:00',
                  'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
                ].map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Team Size
              </label>
              <select
                value={formData.preferred_team_size}
                onChange={(e) => handleInputChange('preferred_team_size', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {['small', 'medium', 'large'].map((size) => (
                  <option key={size} value={size}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Communication Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Communication Style
              </label>
              <select
                value={formData.communication_style}
                onChange={(e) => handleInputChange('communication_style', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                {['async', 'sync', 'mixed'].map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Learning Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Learning Goals
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  'Improve Technical Skills',
                  'Learn New Security Concepts',
                  'Build A Portfolio',
                  'Network With Others',
                  'Prepare For Certifications',
                  'Win Competitions',
                  'Start A Career In Security'
                ].map((goal) => (
                  <label key={goal} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.learning_goals.includes(goal)}
                      onChange={(e) => {
                        const newGoals = e.target.checked
                          ? [...formData.learning_goals, goal]
                          : formData.learning_goals.filter((g) => g !== goal)
                        handleInputChange('learning_goals', newGoals)
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}