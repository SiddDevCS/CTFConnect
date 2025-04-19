// src/types/project.ts
export interface Project {
    id: string
    title: string
    description: string
    status: 'active' | 'completed' | 'archived'
    github_url: string | null
    documentation_url: string | null
    tech_stack: string[]
    category: string
    created_at: string
    updated_at: string
    user_id: string
    team_id: string | null
    is_public: boolean
  }