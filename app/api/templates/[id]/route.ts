import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { UpdateTemplateRequest } from "@/lib/supabase/types"

export const maxDuration = 30

// GET /api/templates/[id] - Get a single template
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    // Fetch template
    const { data: template, error } = await supabase.from("templates").select("*").eq("id", id).single()

    if (error || !template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Increment usage count
    await supabase
      .from("templates")
      .update({ usage_count: (template.usage_count || 0) + 1 })
      .eq("id", id)

    return NextResponse.json({ template })
  } catch (error) {
    console.error("[Templates API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/templates/[id] - Update a template
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    const body: UpdateTemplateRequest = await request.json()

    // Update template
    const { data: template, error } = await supabase
      .from("templates")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[Templates API] Error updating template:", error)
      return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
    }

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error("[Templates API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    // Delete template
    const { error } = await supabase.from("templates").delete().eq("id", id)

    if (error) {
      console.error("[Templates API] Error deleting template:", error)
      return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Templates API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
