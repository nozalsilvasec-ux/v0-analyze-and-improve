// Database types based on Supabase schema

export interface Template {
  id: string
  user_id?: string | null // Made optional since auth removed
  name: string
  description: string | null
  category: string
  thumbnail_url: string | null
  content: TemplateContent
  is_public: boolean
  is_premium: boolean
  usage_count: number
  rating: number
  created_at: string
  updated_at: string
}

export interface TemplateContent {
  sections: Section[]
  settings?: {
    font?: string
    primaryColor?: string
    layout?: "standard" | "minimal" | "modern"
  }
}

export interface Section {
  id: string
  type: "hero" | "text" | "image" | "pricing" | "quote" | "table" | "header" | "footer"
  title?: string
  content: Record<string, unknown>
  order: number
}

export interface Proposal {
  id: string
  user_id?: string | null // Made optional since auth removed
  template_id: string | null
  name: string
  client_name: string | null
  status: "draft" | "review" | "sent" | "accepted" | "rejected"
  content: TemplateContent
  source_type: "template" | "upload" | "blank"
  original_file_path: string | null
  is_favorite: boolean
  created_at: string
  last_edited_at: string
}

export interface ProposalSection {
  id: string
  proposal_id: string
  section_order: number
  section_type: string
  title: string | null
  content: string
  settings: Record<string, unknown>
  created_at: string
}

export interface MediaAsset {
  id: string
  user_id?: string | null // Made optional since auth removed
  proposal_id: string | null
  storage_path: string
  file_name: string
  file_type: string
  file_size: number
  metadata: Record<string, unknown>
  created_at: string
}

export interface Generation {
  id: string
  user_id?: string | null // Made optional since auth removed
  proposal_id: string | null
  prompt: string
  response: string | null
  model: string
  tokens_used: number
  created_at: string
}

// API Request/Response types
export interface CreateTemplateRequest {
  name: string
  description?: string
  category: string
  content: TemplateContent
  is_public?: boolean
  thumbnail_url?: string
}

export interface UpdateTemplateRequest {
  name?: string
  description?: string
  category?: string
  content?: TemplateContent
  is_public?: boolean
  thumbnail_url?: string
}

export interface CreateProposalRequest {
  template_id?: string
  name: string
  client_name?: string
  content?: TemplateContent
  source_type?: "template" | "upload" | "blank"
}

export interface UpdateProposalRequest {
  name?: string
  client_name?: string
  status?: "draft" | "review" | "sent" | "accepted" | "rejected"
  content?: TemplateContent
  is_favorite?: boolean
}

// Template categories
export const TEMPLATE_CATEGORIES = [
  "Sales",
  "Marketing",
  "Consulting",
  "Engineering",
  "Design",
  "Finance",
  "Product",
  "HR",
  "Legal",
  "Other",
] as const

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]
