import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { CreateProposalRequest } from "@/lib/supabase/types"

export const maxDuration = 30

// GET /api/proposals - List all proposals
export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()

    // Parse query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const filter = searchParams.get("filter")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build query
    let query = supabase
      .from("proposals")
      .select("*, templates(name, category, thumbnail_url)")
      .order("last_edited_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,client_name.ilike.%${search}%`)
    }

    if (filter === "favorites") {
      query = query.eq("is_favorite", true)
    } else if (filter === "recent") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      query = query.gte("last_edited_at", oneWeekAgo.toISOString())
    }

    const { data: proposals, error } = await query

    if (error) {
      console.error("[Proposals API] Error fetching proposals:", error)
      return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
    }

    // Get total count
    const { count } = await supabase.from("proposals").select("*", { count: "exact", head: true })

    return NextResponse.json({
      proposals: proposals || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[Proposals API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/proposals - Create a new proposal
export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()

    const body: CreateProposalRequest = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Missing required field: name" }, { status: 400 })
    }

    let content = body.content || { sections: [], settings: {} }

    // If creating from template, copy template content
    if (body.template_id) {
      const { data: template, error: templateError } = await supabase
        .from("templates")
        .select("content, name")
        .eq("id", body.template_id)
        .single()

      if (templateError || !template) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 })
      }

      // Deep copy template content
      content = JSON.parse(JSON.stringify(template.content))

      const { data: currentTemplate } = await supabase
        .from("templates")
        .select("usage_count")
        .eq("id", body.template_id)
        .single()

      if (currentTemplate) {
        await supabase
          .from("templates")
          .update({ usage_count: (currentTemplate.usage_count || 0) + 1 })
          .eq("id", body.template_id)
      }
    }

    const { data: proposal, error } = await supabase
      .from("proposals")
      .insert({
        user_id: null,
        template_id: body.template_id || null,
        name: body.name,
        client_name: body.client_name || null,
        status: "draft",
        content,
        source_type: body.source_type || (body.template_id ? "template" : "blank"),
        is_favorite: false,
        last_edited_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[Proposals API] Error creating proposal:", error.message)
      return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
    }

    return NextResponse.json({ proposal }, { status: 201 })
  } catch (error) {
    console.error("[Proposals API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
