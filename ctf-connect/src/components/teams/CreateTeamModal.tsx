'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
  onTeamCreated: () => void
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  onTeamCreated,
}: CreateTeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    competition_type: '',
    skill_level: 'intermediate',
    max_members: 5,
    tags: '',
    discord_invite: '',
    github_repo: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            competition_type: formData.competition_type,
            skill_level: formData.skill_level,
            max_members: formData.max_members,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            discord_invite: formData.discord_invite,
            github_repo: formData.github_repo,
            created_by: user.id,
          },
        ])
        .select()
        .single()

      if (teamError) throw teamError

      // Add creator as team owner
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([
          {
            team_id: team.id,
            user_id: user.id,
            role: 'owner',
          },
        ])

      if (memberError) throw memberError

      onTeamCreated()
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <Dialog.Title className="text-xl font-bold mb-4">
            Create New Team
          </Dialog.Title>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Competition Type
              </label>
              <input
                type="text"
                value={formData.competition_type}
                onChange={(e) => setFormData(prev => ({ ...prev, competition_type: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="e.g., CTF, Hackathon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skill Level
              </label>
              <select
                value={formData.skill_level}
                onChange={(e) => setFormData(prev => ({ ...prev, skill_level: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Members
              </label>
              <input
                type="number"
                value={formData.max_members}
                onChange={(e) => setFormData(prev => ({ ...prev, max_members: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                min="1"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="web, crypto, forensics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discord Invite (optional)
              </label>
              <input
                type="text"
                value={formData.discord_invite}
                onChange={(e) => setFormData(prev => ({ ...prev, discord_invite: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="https://discord.gg/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                GitHub Repository (optional)
              </label>
              <input
                type="text"
                value={formData.github_repo}
                onChange={(e) => setFormData(prev => ({ ...prev, github_repo: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Team'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  )
}