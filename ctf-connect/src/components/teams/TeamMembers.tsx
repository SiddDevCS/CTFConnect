'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { UserCircleIcon } from '@heroicons/react/24/solid'

interface TeamMembersProps {
  team: any
  onMemberUpdate: () => void
}

export default function TeamMembers({ team, onMemberUpdate }: TeamMembersProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleRemoveMember = async (memberId: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error
      onMemberUpdate()
    } catch (error) {
      console.error('Error removing member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId)

      if (error) throw error
      onMemberUpdate()
    } catch (error) {
      console.error('Error updating role:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Team Members</h3>
      <div className="space-y-4">
        {team.team_members.map((member: any) => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {member.profiles?.avatar_url ? (
                <Image
                  src={member.profiles.avatar_url}
                  alt={member.profiles.username || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
              )}
              <div>
                <p className="font-medium">
                  {member.profiles?.username || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member.id, e.target.value)}
                className="text-sm border-gray-300 rounded-md"
                disabled={loading}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>

              <button
                onClick={() => handleRemoveMember(member.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
                disabled={loading}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}