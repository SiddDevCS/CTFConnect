export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    tables: {
      profiles: {
        Row: {
          id: string
          username: string
          bio: string | null
          skills: string[]
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          discord_handle: string | null
          github_username: string | null
          linkedin_url: string | null
          open_to_invites: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          bio?: string | null
          skills?: string[]
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          discord_handle?: string | null
          github_username?: string | null
          linkedin_url?: string | null
          open_to_invites?: boolean
          avatar_url?: string | null
        }
        Update: Partial<Database['public']['tables']['profiles']['Insert']>
      }
    }
  }
}