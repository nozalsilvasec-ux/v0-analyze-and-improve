import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const maxDuration = 60

// GET /api/media - List media assets
export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()

    const { searchParams } = new URL(request.url)
    const proposalId = searchParams.get("proposal_id")
    const fileType = searchParams.get("file_type")

    let query = supabase.from("media_assets").select("*").order("created_at", { ascending: false })

    if (proposalId) {
      query = query.eq("proposal_id", proposalId)
    }

    if (fileType) {
      query = query.ilike("file_type", `%${fileType}%`)
    }

    const { data: assets, error } = await query

    if (error) {
      console.error("[Media API] Error fetching assets:", error)
      return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 })
    }

    return NextResponse.json({ assets: assets || [] })
  } catch (error) {
    console.error("[Media API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/media - Upload a new media file
export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()

    let file: File | null = null
    let proposalId: string | null = null

    try {
      const formData = await request.formData()

      const fileEntry = formData.get("file")
      if (fileEntry && fileEntry instanceof File) {
        file = fileEntry
      }

      const proposalIdEntry = formData.get("proposal_id")
      if (proposalIdEntry && typeof proposalIdEntry === "string") {
        proposalId = proposalIdEntry
      }
    } catch (parseError) {
      console.error("[Media API] FormData parse error:", parseError)
      return NextResponse.json({ error: "Failed to parse upload data. Please try again." }, { status: 400 })
    }

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    const { data: asset, error: dbError } = await supabase
      .from("media_assets")
      .insert({
        user_id: null,
        proposal_id: proposalId || null,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: dataUrl, // Store as data URL
        metadata: {
          original_name: file.name,
          encoding: "base64",
        },
      })
      .select()
      .single()

    if (dbError) {
      console.error("[Media API] DB error:", dbError)
      return NextResponse.json({ error: "Failed to save media record" }, { status: 500 })
    }

    return NextResponse.json(
      {
        asset,
        url: dataUrl,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Media API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
