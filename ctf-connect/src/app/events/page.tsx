// src/app/events/page.tsx
import { CalendarDays, Globe, Clock, Users, ExternalLink, Trophy, Target } from 'lucide-react'
import { format } from 'date-fns'

// Types for the CTFTime API response
interface CTFEvent {
  id: number
  title: string
  description: string
  url: string
  logo: string
  format: string
  participants: number
  start: string
  finish: string
  restrictions: string
  format_id: number
  ctftime_url: string
  location: string
  live_feed: string
  organizers: Array<{
    id: number
    name: string
  }>
  weight: number
}

// Format date with time
function formatDateTime(dateString: string) {
  return format(new Date(dateString), 'MMM d, yyyy - h:mm a')
}

// Calculate event duration in days
function getEventDuration(start: string, finish: string) {
  const startDate = new Date(start)
  const finishDate = new Date(finish)
  const diffTime = Math.abs(finishDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Event Card Component
function EventCard({ event }: { event: CTFEvent }) {
  const duration = getEventDuration(event.start, event.finish)
  
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Gradient overlay at the top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex-1 group-hover:text-purple-600 transition-colors">
            {event.title}
          </h3>
          <span className={`
            px-4 py-1.5 rounded-full text-sm font-medium transition-all
            ${event.format === 'ATTACK-DEFENSE' ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-700' :
              event.format === 'TEAM' ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700' :
              'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700'}
          `}>
            {event.format}
          </span>
        </div>

        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-start space-x-3 text-gray-600">
            <CalendarDays className="w-5 h-5 text-purple-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Starts: <span className="text-gray-900">{formatDateTime(event.start)}</span>
              </p>
              <p className="text-sm font-medium">
                Ends: <span className="text-gray-900">{formatDateTime(event.finish)}</span>
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-3 text-gray-600">
            <Clock className="w-5 h-5 text-purple-500" />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Duration:</span>
              <span className="text-sm text-gray-900">{duration} day{duration > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Participants */}
          {event.participants > 0 && (
            <div className="flex items-center space-x-3 text-gray-600">
              <Users className="w-5 h-5 text-purple-500" />
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Participants:</span>
                <span className="text-sm text-gray-900">{event.participants}</span>
              </div>
            </div>
          )}

          {/* Location */}
          {event.location && (
            <div className="flex items-center space-x-3 text-gray-600">
              <Globe className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-900">{event.location}</span>
            </div>
          )}

          {/* Weight/Points */}
          {event.weight && (
            <div className="flex items-center space-x-3 text-gray-600">
              <Trophy className="w-5 h-5 text-purple-500" />
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Weight:</span>
                <span className="text-sm text-gray-900">{event.weight.toFixed(2)} points</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-100">
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Register Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
          
          <div className="flex items-center space-x-4">
            <a
              href={event.ctftime_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center"
            >
              <Target className="w-4 h-4 mr-1" />
              CTFtime
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading Skeleton
function EventSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden animate-pulse">
      <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between">
          <div className="w-28 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

// Main Page Component
export default async function EventsPage() {
  let events: CTFEvent[] = []
  let error = null

  try {
    const response = await fetch('https://ctftime.org/api/v1/events/?limit=20', {
      headers: {
        'User-Agent': 'CTF Connect - Educational Platform',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }

    events = await response.json()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch events'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Upcoming CTF Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest Capture The Flag competitions from around the world.
            Join challenges, learn new skills, and compete with the best.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {error ? (
            <div className="col-span-full text-center">
              <div className="bg-red-50 rounded-lg p-6 inline-block">
                <h3 className="text-red-800 font-medium mb-2">Error Loading Events</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No events found</p>
            </div>
          ) : (
            events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}