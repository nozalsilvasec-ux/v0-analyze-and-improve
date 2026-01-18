import useSWR from "swr"

interface BlockTemplate {
  id: string
  name: string
  description: string | null
  category: string
  preview_url: string | null
  content: Record<string, unknown>
  is_premium: boolean
  usage_count: number
  created_at: string
}

interface StockImage {
  id: string
  name: string
  url: string
  category: string
  tags: string[]
  is_premium: boolean
  created_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export function useBlocks(category?: string, search?: string) {
  const params = new URLSearchParams()
  if (category) params.set("category", category)
  if (search) params.set("search", search)

  const { data, error, isLoading, mutate } = useSWR<BlockTemplate[]>(`/api/blocks?${params.toString()}`, fetcher)

  return {
    blocks: data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useStockImages(category?: string, search?: string) {
  const params = new URLSearchParams()
  if (category) params.set("category", category)
  if (search) params.set("search", search)

  const { data, error, isLoading, mutate } = useSWR<StockImage[]>(`/api/stock-images?${params.toString()}`, fetcher)

  return {
    images: data || [],
    isLoading,
    error,
    mutate,
  }
}

export type { BlockTemplate, StockImage }
