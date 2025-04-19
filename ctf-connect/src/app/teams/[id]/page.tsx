'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import CreateTeamModal from '@/components/teams/CreateTeamModal'
import TeamCard from '@/components/teams/TeamCard'

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    console.log('Component mounted') // Debug log
    checkAuth()
  }, [])

  const checkAuth = async () => {
    console.log('Checking auth...') // Debug log
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('Auth result:', { user, error: authError }) // Debug log

      if (!user) {
        console.log('No user found, redirecting to login') // Debug log
        router.push('/login')
        return
      }

      fetchTeams(user.id)
    } catch (error) {
      console.error('Auth check error:', error) // Debug log
      setError('Authentication error')
    }
  }

  const fetchTeams = async (userId: string) => {
    console.log('Fetching teams for user:', userId) // Debug log
    try {
      // First get the user's teams
      const { data: userTeams, error: userTeamsError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId)

      console.log('User teams result:', { userTeams, error: userTeamsError }) // Debug log

      if (userTeamsError) throw userTeamsError

      const teamIds = userTeams?.map(ut => ut.team_id) || []
      console.log('Team IDs:', teamIds) // Debug log

      if (teamIds.length > 0) {
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select(`
            *,
            team_members (
              user_id,
              role
            )
          `)
          .in('id', teamIds)

        console.log('Teams result:', { teams, error: teamsError }) // Debug log

        if (teamsError) throw teamsError
        setTeams(teams || [])
      } else {
        console.log('No teams found') // Debug log
        setTeams([])
      }
    } catch (error: any) {
      console.error('Error fetching teams:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  console.log('Render state:', { loading, teams, error }) // Debug log

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Teams</h1>
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
          }, null, 2)}
        </pre>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
        onTeamCreated={() => fetchTeams((supabase.auth.getUser() as any).data?.user?.id)}
      />
    </div>
  )
}