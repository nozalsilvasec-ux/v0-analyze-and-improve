import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { CreateTemplateRequest } from "@/lib/supabase/types"

export const maxDuration = 30

// GET /api/templates - List all templates
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Parse query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const filter = searchParams.get("filter")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build query - get all templates
    let query = supabase
      .from("templates")
      .select("*")
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (filter === "public") {
      query = query.eq("is_public", true)
    }

    const { data: templates, error } = await query

    if (error) {
      console.error("[Templates API] Error fetching templates:", error)
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
    }

    // Get total count for pagination
    const { count } = await supabase.from("templates").select("*", { count: "exact", head: true })

    return NextResponse.json({
      templates: templates || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[Templates API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/templates - Create a new template
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const body: CreateTemplateRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.category || !body.content) {
      return NextResponse.json({ error: "Missing required fields: name, category, content" }, { status: 400 })
    }

    const { data: template, error } = await supabase
      .from("templates")
      .insert({
        user_id: null,
        name: body.name,
        description: body.description || null,
        category: body.category,
        content: body.content,
        is_public: body.is_public ?? true,
        is_premium: false,
        thumbnail_url: body.thumbnail_url || null,
        usage_count: 0,
        rating: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[Templates API] Error creating template:", error.message)
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
    }

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error("[Templates API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
