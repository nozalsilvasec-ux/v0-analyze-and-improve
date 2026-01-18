import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { UpdateProposalRequest } from "@/lib/supabase/types"

export const maxDuration = 30

// GET /api/proposals/[id] - Get a single proposal
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const supabase = createAdminClient()

    const { data: proposal, error } = await supabase.from("proposals").select("*").eq("id", id).single()

    if (error) {
      console.error("[Proposals API] Database error:", error)
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error("[Proposals API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function updateWithRetry(
  supabase: ReturnType<typeof createAdminClient>,
  id: string,
  body: UpdateProposalRequest,
  retries = 3,
) {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data: proposal, error } = await supabase
        .from("proposals")
        .update({
          ...body,
          last_edited_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return { proposal, error: null }
    } catch (error) {
      lastError = error as Error
      console.error(`[Proposals API] Update attempt ${attempt} failed:`, error)

      if (attempt < retries) {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100))
      }
    }
  }

  return { proposal: null, error: lastError }
}

// PUT /api/proposals/[id] - Update a proposal
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const body: UpdateProposalRequest = await request.json()

    const { proposal, error } = await updateWithRetry(supabase, id, body)

    if (error) {
      console.error("[Proposals API] Error updating proposal after retries:", error)
      return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 })
    }

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error("[Proposals API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/proposals/[id] - Delete a proposal
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { error } = await supabase.from("proposals").delete().eq("id", id)

    if (error) {
      console.error("[Proposals API] Error deleting proposal:", error)
      return NextResponse.json({ error: "Failed to delete proposal" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Proposals API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
