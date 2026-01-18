import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    console.log("[v0] [Blocks API] Fetching blocks, category:", category, "search:", search)
    console.log("[v0] [Blocks API] SUPABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("[v0] [Blocks API] SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    const supabase = createAdminClient()

    let query = supabase.from("block_templates").select("*").order("usage_count", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: blocks, error } = await query

    console.log("[v0] [Blocks API] Query result - blocks count:", blocks?.length, "error:", error?.message)

    if (error) {
      console.error("[Blocks API] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(blocks || [])
  } catch (error) {
    console.error("[Blocks API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 })
  }
}
