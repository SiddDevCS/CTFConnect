'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import CreateTeamModal from '@/components/teams/CreateTeamModal'
import TeamCard from '@/components/teams/TeamCard'

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      // Simple query without any joins or complex conditions
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, description, avatar_url')

      if (error) throw error

      console.log('Teams data:', data) // Debug log
      setTeams(data || [])
    } catch (error: any) {
      console.error('Error:', error) // Debug log
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Teams</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          Create Team
        </button>
      </div>

      {/* Debug info */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify({
            loading,
            teamsCount: teams.length,
            error,
            teams
          }, null, 2)}
        </pre>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-2">Error: {error}</div>
          <button 
            onClick={fetchTeams}
            className="text-purple-600 hover:text-purple-700"
          >
            Try again
          </button>
        </div>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No teams yet</h3>
          <p className="mt-2 text-gray-600">
            Create a new team or join an existing one to get started.
          </p>
        </div>
      )}

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTeamCreated={fetchTeams}
      />
    </div>
  )
}