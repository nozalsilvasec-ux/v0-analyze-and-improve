import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const maxDuration = 30

// GET /api/media/[id] - Get a single media asset
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: asset, error } = await supabase.from("media_assets").select("*").eq("id", id).single()

    if (error || !asset) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 })
    }

    // Get fresh public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("proposal-assets").getPublicUrl(asset.storage_path)

    return NextResponse.json({
      asset,
      url: publicUrl,
    })
  } catch (error) {
    console.error("[Media API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/media/[id] - Delete a media asset
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get asset to find storage path
    const { data: asset, error: fetchError } = await supabase
      .from("media_assets")
      .select("storage_path")
      .eq("id", id)
      .single()

    if (fetchError || !asset) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 })
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage.from("proposal-assets").remove([asset.storage_path])

    if (storageError) {
      console.error("[Media API] Storage delete error:", storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase.from("media_assets").delete().eq("id", id)

    if (dbError) {
      console.error("[Media API] DB delete error:", dbError)
      return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Media API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
