"use client"

import { useState, useEffect, useCallback } from "react"
import type { Proposal, Section, TemplateContent } from "@/lib/supabase/types"

const LOCAL_PROPOSALS_KEY = "lightnote_local_proposals"
const LOCAL_PREFIX = "local-"

// Generate a unique local ID
export const generateLocalId = () => `${LOCAL_PREFIX}${crypto.randomUUID()}`

// Check if an ID is a local proposal
export const isLocalProposal = (id: string) => id.startsWith(LOCAL_PREFIX)

// Default sections for a blank proposal
export const getDefaultSections = (): Section[] => [
  {
    id: crypto.randomUUID(),
    type: "hero",
    title: "Hero",
    content: {
      title: "Untitled Proposal",
      subtitle: "Enter your subtitle here",
    },
    order: 0,
  },
  {
    id: crypto.randomUUID(),
    type: "text",
    title: "Introduction",
    content: {
      heading: "INTRODUCTION",
      text: "Start writing your proposal content here. You can add more sections using the + button.",
    },
    order: 1,
  },
]

// Starter template configurations
export const starterTemplates: Record<string, { name: string; sections: Section[] }> = {
  blank: {
    name: "Blank",
    sections: getDefaultSections(),
  },
  business: {
    name: "Business Proposal",
    sections: [
      {
        id: crypto.randomUUID(),
        type: "hero",
        title: "Hero",
        content: {
          title: "Business Proposal",
          subtitle: "Professional Solutions for Your Success",
        },
        order: 0,
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        title: "Executive Summary",
        content: {
          heading: "EXECUTIVE SUMMARY",
          text: "Provide a brief overview of your business proposal, highlighting key points and value proposition.",
        },
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        title: "Problem Statement",
        content: {
          heading: "THE CHALLENGE",
          text: "Describe the problem or challenge your client is facing that your solution addresses.",
        },
        order: 2,
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        title: "Proposed Solution",
        content: {
          heading: "OUR SOLUTION",
          text: "Detail your proposed solution and how it addresses the client's needs.",
        },
        order: 3,
      },
      {
        id: crypto.randomUUID(),
        type: "pricing",
        title: "Investment",
        content: {
          title: "Investment Options",
          items: [
            { name: "Basic Package", price: "$5,000", description: "Essential features and support" },
            { name: "Professional Package", price: "$10,000", description: "Advanced features with priority support" },
            { name: "Enterprise Package", price: "$25,000", description: "Full suite with dedicated support" },
          ],
        },
        order: 4,
      },
    ],
  },
  project: {
    name: "Project Proposal",
    sections: [
      {
        id: crypto.randomUUID(),
        type: "hero",
        title: "Hero",
        content: {
          title: "Project Proposal",
          subtitle: "Delivering Excellence on Time and Budget",
        },
        order: 0,
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        title: "Project Overview",
        content: {
          heading: "PROJECT OVERVIEW",
          text: "Outline the project scope, objectives, and expected outcomes.",
        },
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        title: "Timeline",
        content: {
          heading: "PROJECT TIMELINE",
          text: "Present the project phases, milestones, and delivery schedule.",
        },
        order: 2,
      },
      {
        id: crypto.randomUUID(),
        type: "table",
        title: "Deliverables",
        content: {
          title: "Project Deliverables",
          headers: ["Phase", "Deliverable", "Timeline", "Status"],
          rows: [
            ["Phase 1", "Requirements Analysis", "Week 1-2", "Pending"],
            ["Phase 2", "Design & Development", "Week 3-6", "Pending"],
            ["Phase 3", "Testing & QA", "Week 7-8", "Pending"],
            ["Phase 4", "Launch & Support", "Week 9-10", "Pending"],
          ],
        },
        order: 3,
      },
      {
        id: crypto.randomUUID(),
        type: "pricing",
        title: "Budget",
        content: {
          title: "Project Budget",
          items: [
            { name: "Discovery Phase", price: "$3,000", description: "Research and planning" },
            { name: "Development Phase", price: "$12,000", description: "Core implementation" },
            { name: "Launch Phase", price: "$5,000", description: "Deployment and training" },
          ],
        },
        order: 4,
      },
    ],
  },
  consulting: {
    name: "Consulting Proposal",
    sections: [
      {
        id: crypto.randomUUID(),
        type: "hero",
        title: "Hero",
        content: {
          title: "Consulting Proposal",
          subtitle: "Strategic Insights for Business Growth",
        },
        order: 0,
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        title: "About Us",
        content: {
          heading: "ABOUT OUR FIRM",
          text: "Introduce your consulting firm, expertise, and track record of success.",
        },
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        title: "Situation Analysis",
        content: {
          heading: "SITUATION ANALYSIS",
          text: "Present your analysis of the client's current situation and challenges.",
        },
        order: 2,
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        title: "Recommendations",
        content: {
          heading: "OUR RECOMMENDATIONS",
          text: "Provide strategic recommendations based on your analysis.",
        },
        order: 3,
      },
      {
        id: crypto.randomUUID(),
        type: "quote",
        title: "Testimonial",
        content: {
          text: "Working with this team transformed our business. Their strategic insights led to 40% revenue growth.",
          author: "Client Name",
          role: "CEO, Company Name",
        },
        order: 4,
      },
      {
        id: crypto.randomUUID(),
        type: "pricing",
        title: "Engagement Options",
        content: {
          title: "Engagement Options",
          items: [
            { name: "Advisory Retainer", price: "$5,000/mo", description: "Ongoing strategic guidance" },
            { name: "Project Engagement", price: "$25,000", description: "Focused 3-month engagement" },
            { name: "Full Partnership", price: "$50,000", description: "Comprehensive 6-month program" },
          ],
        },
        order: 5,
      },
    ],
  },
}

// Create a new local proposal
export const createLocalProposal = (
  name: string = "Untitled Proposal",
  starterType: keyof typeof starterTemplates = "blank",
  sourceType: "blank" | "template" | "upload" = "blank"
): Proposal => {
  const starter = starterTemplates[starterType] || starterTemplates.blank
  const now = new Date().toISOString()

  return {
    id: generateLocalId(),
    user_id: null,
    template_id: null,
    name,
    client_name: null,
    status: "draft",
    content: {
      sections: starter.sections.map((s, i) => ({
        ...s,
        id: crypto.randomUUID(), // Generate fresh IDs
        order: i,
      })),
      settings: {
        font: "Inter",
        primaryColor: "#3b82f6",
        layout: "modern",
      },
    },
    source_type: sourceType,
    original_file_path: null,
    is_favorite: false,
    created_at: now,
    last_edited_at: now,
  }
}

// Create proposal from uploaded document content
export const createProposalFromUpload = (
  name: string,
  sections: Section[]
): Proposal => {
  const now = new Date().toISOString()

  return {
    id: generateLocalId(),
    user_id: null,
    template_id: null,
    name,
    client_name: null,
    status: "draft",
    content: {
      sections,
      settings: {
        font: "Inter",
        primaryColor: "#3b82f6",
        layout: "modern",
      },
    },
    source_type: "upload",
    original_file_path: null,
    is_favorite: false,
    created_at: now,
    last_edited_at: now,
  }
}

// Storage functions
export const getLocalProposals = (): Record<string, Proposal> => {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(LOCAL_PROPOSALS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export const getLocalProposal = (id: string): Proposal | null => {
  const proposals = getLocalProposals()
  return proposals[id] || null
}

export const saveLocalProposal = (proposal: Proposal): void => {
  if (typeof window === "undefined") return
  const proposals = getLocalProposals()
  proposals[proposal.id] = {
    ...proposal,
    last_edited_at: new Date().toISOString(),
  }
  localStorage.setItem(LOCAL_PROPOSALS_KEY, JSON.stringify(proposals))
}

export const deleteLocalProposal = (id: string): void => {
  if (typeof window === "undefined") return
  const proposals = getLocalProposals()
  delete proposals[id]
  localStorage.setItem(LOCAL_PROPOSALS_KEY, JSON.stringify(proposals))
}

// Hook for managing a single local proposal
export function useLocalProposal(proposalId: string | null) {
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load proposal on mount
  useEffect(() => {
    if (!proposalId) {
      setIsLoading(false)
      return
    }

    if (isLocalProposal(proposalId)) {
      const localProposal = getLocalProposal(proposalId)
      setProposal(localProposal)
    }
    setIsLoading(false)
  }, [proposalId])

  // Update proposal
  const updateProposal = useCallback((updates: Partial<Proposal>) => {
    setProposal((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates, last_edited_at: new Date().toISOString() }
      saveLocalProposal(updated)
      return updated
    })
  }, [])

  // Update content specifically
  const updateContent = useCallback((content: TemplateContent) => {
    setProposal((prev) => {
      if (!prev) return prev
      const updated = { ...prev, content, last_edited_at: new Date().toISOString() }
      saveLocalProposal(updated)
      return updated
    })
  }, [])

  // Save to Supabase (converts local to database proposal)
  const saveToDatabase = useCallback(async (): Promise<string | null> => {
    if (!proposal) return null
    setIsSaving(true)

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: proposal.name,
          client_name: proposal.client_name,
          content: proposal.content,
          source_type: proposal.source_type,
          status: proposal.status,
          is_favorite: proposal.is_favorite,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save proposal")
      }

      const savedProposal = await response.json()
      
      // Delete the local version after successful save
      if (proposal.id && isLocalProposal(proposal.id)) {
        deleteLocalProposal(proposal.id)
      }

      return savedProposal.id
    } catch (error) {
      console.error("Failed to save to database:", error)
      return null
    } finally {
      setIsSaving(false)
    }
  }, [proposal])

  return {
    proposal,
    isLoading,
    isSaving,
    updateProposal,
    updateContent,
    saveToDatabase,
  }
}

export default useLocalProposal
