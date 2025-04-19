'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface InviteMembersProps {
  team: any
  onInviteSent: () => void
}

export default function InviteMembers({ team, onInviteSent }: InviteMembersProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // In a real application, you would send an email invitation here
      // For now, we'll just create a pending invitation in the database
      const { error } = await supabase
        .from('team_invites')
        .insert([
          {
            team_id: team.id,
            email,
            status: 'pending',
          },
        ])

      if (error) throw error

      setSuccess(true)
      setEmail('')
      onInviteSent()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Invite Members</h3>

      <form onSubmit={handleInvite} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-600 text-sm">
            Invitation sent successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </button>
      </form>
    </div>
  )
}