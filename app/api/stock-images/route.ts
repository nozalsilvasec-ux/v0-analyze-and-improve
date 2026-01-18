import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const supabase = createAdminClient()

    let query = supabase.from("stock_images").select("*").order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,tags.cs.{${search}}`)
    }

    const { data: images, error } = await query

    if (error) {
      console.error("[Stock Images API] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(images || [])
  } catch (error) {
    console.error("[Stock Images API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
