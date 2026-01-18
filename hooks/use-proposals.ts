"use client"

import useSWR from "swr"
import type { Proposal } from "@/lib/supabase/types"

interface ProposalsResponse {
  proposals: Proposal[]
  total: number
  limit: number
  offset: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to fetch")
  }
  return res.json()
}

export function useProposals(options?: { status?: string; search?: string; filter?: string; limit?: number }) {
  const params = new URLSearchParams()
  if (options?.status) params.set("status", options.status)
  if (options?.search) params.set("search", options.search)
  if (options?.filter) params.set("filter", options.filter)
  if (options?.limit) params.set("limit", options.limit.toString())

  const queryString = params.toString()
  const url = `/api/proposals${queryString ? `?${queryString}` : ""}`

  const { data, error, isLoading, mutate } = useSWR<ProposalsResponse>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })

  return {
    proposals: data?.proposals || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useProposal(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ proposal: Proposal }>(
    id ? `/api/proposals/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  )

  return {
    proposal: data?.proposal || null,
    isLoading,
    error,
    mutate,
  }
}

// Helper function to create a proposal from a template
export async function createProposalFromTemplate(templateId: string, name: string, clientName?: string) {
  const res = await fetch("/api/proposals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      template_id: templateId,
      name,
      client_name: clientName,
      source_type: "template",
    }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to create proposal")
  }

  return res.json()
}

// Helper function to update proposal
export async function updateProposal(id: string, updates: Partial<Proposal>) {
  const res = await fetch(`/api/proposals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to update proposal")
  }

  return res.json()
}

// Helper function to toggle favorite
export async function toggleFavorite(id: string, currentValue: boolean) {
  return updateProposal(id, { is_favorite: !currentValue })
}
