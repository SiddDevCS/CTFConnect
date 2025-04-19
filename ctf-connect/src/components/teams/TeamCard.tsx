import { UserGroupIcon, TagIcon, TrophyIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  description?: string
  avatar_url?: string
  competition_type?: string
  skill_level?: string
  max_members: number
  tags?: string[]
  team_members: Array<{
    user_id: string
    role: string
  }>
}

interface TeamCardProps {
  team: Team
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
              {team.competition_type && (
                <p className="text-sm text-gray-500 flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-1" />
                  {team.competition_type}
                </p>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {team.team_members?.length || 0}/{team.max_members} members
          </div>
        </div>

        {team.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {team.description}
          </p>
        )}

        {team.tags && team.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {team.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {team.skill_level && (
          <div className="mt-4 text-sm">
            <span className={`px-2 py-1 rounded ${
              {
                beginner: 'bg-green-100 text-green-800',
                intermediate: 'bg-blue-100 text-blue-800',
                advanced: 'bg-purple-100 text-purple-800',
                expert: 'bg-red-100 text-red-800'
              }[team.skill_level]
            }`}>
              {team.skill_level}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}