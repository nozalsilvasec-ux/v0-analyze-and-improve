"use client"

import { useState, useEffect, useCallback } from "react"

export interface LocalMediaAsset {
  id: string
  file_name: string
  file_url: string // base64 data URL
  file_type: string
  file_size: number
  created_at: string
  proposal_id?: string
}

const STORAGE_KEY = "proposal-media-assets"

// Helper to get assets from localStorage
function getStoredAssets(): LocalMediaAsset[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Helper to save assets to localStorage
function saveStoredAssets(assets: LocalMediaAsset[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets))
  } catch (err) {
    console.error("Failed to save to localStorage:", err)
  }
}

export function useMedia(options?: { proposalId?: string; fileType?: string }) {
  const [assets, setAssets] = useState<LocalMediaAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Load assets from localStorage on mount
  useEffect(() => {
    try {
      let storedAssets = getStoredAssets()

      // Filter by proposalId if provided
      if (options?.proposalId) {
        storedAssets = storedAssets.filter((a) => a.proposal_id === options.proposalId)
      }

      // Filter by fileType if provided
      if (options?.fileType) {
        storedAssets = storedAssets.filter((a) => a.file_type.startsWith(options.fileType!))
      }

      setAssets(storedAssets)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load assets"))
    } finally {
      setIsLoading(false)
    }
  }, [options?.proposalId, options?.fileType])

  // Mutate function to refresh assets
  const mutate = useCallback(() => {
    let storedAssets = getStoredAssets()
    if (options?.proposalId) {
      storedAssets = storedAssets.filter((a) => a.proposal_id === options.proposalId)
    }
    if (options?.fileType) {
      storedAssets = storedAssets.filter((a) => a.file_type.startsWith(options.fileType!))
    }
    setAssets(storedAssets)
  }, [options?.proposalId, options?.fileType])

  return {
    assets,
    isLoading,
    error,
    mutate,
  }
}

export function useMediaUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File, proposalId?: string): Promise<LocalMediaAsset> => {
    setIsUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Validate file size (max 5MB for localStorage)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 5MB.")
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Allowed: JPEG, PNG, GIF, WebP")
      }

      setProgress(20)

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setProgress(60)

      // Create asset object
      const asset: LocalMediaAsset = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file_name: file.name,
        file_url: base64,
        file_type: file.type,
        file_size: file.size,
        created_at: new Date().toISOString(),
        proposal_id: proposalId,
      }

      setProgress(80)

      // Save to localStorage
      const existingAssets = getStoredAssets()
      const updatedAssets = [asset, ...existingAssets]
      saveStoredAssets(updatedAssets)

      setProgress(100)
      return asset
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed"
      setError(message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const deleteAsset = async (id: string) => {
    const existingAssets = getStoredAssets()
    const updatedAssets = existingAssets.filter((a) => a.id !== id)
    saveStoredAssets(updatedAssets)
    return { success: true }
  }

  return {
    upload,
    deleteAsset,
    isUploading,
    progress,
    error,
  }
}
