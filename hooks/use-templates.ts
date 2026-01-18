"use client"

import useSWR from "swr"
import type { Template } from "@/lib/supabase/types"

interface TemplatesResponse {
  templates: Template[]
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

export function useTemplates(options?: { category?: string; search?: string; filter?: string; limit?: number }) {
  const params = new URLSearchParams()
  if (options?.category) params.set("category", options.category)
  if (options?.search) params.set("search", options.search)
  if (options?.filter) params.set("filter", options.filter)
  if (options?.limit) params.set("limit", options.limit.toString())

  const queryString = params.toString()
  const url = `/api/templates${queryString ? `?${queryString}` : ""}`

  const { data, error, isLoading, mutate } = useSWR<TemplatesResponse>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })

  return {
    templates: data?.templates || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useTemplate(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ template: Template }>(
    id ? `/api/templates/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  )

  return {
    template: data?.template || null,
    isLoading,
    error,
    mutate,
  }
}
