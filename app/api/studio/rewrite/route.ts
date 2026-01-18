import { type NextRequest, NextResponse } from "next/server"
import { rewriteProposal, generateImprovements } from "@/lib/gemini"
import { VALIDATION, RATE_LIMITS } from "@/lib/prompts"

export const maxDuration = 60
export const dynamic = "force-dynamic"

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMITS.rewrite.windowMs })
    return { allowed: true }
  }

  if (limit.count >= RATE_LIMITS.rewrite.maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((limit.resetAt - now) / 1000) }
  }

  limit.count++
  return { allowed: true }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous"
    const rateLimit = checkRateLimit(ip)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: RATE_LIMITS.rewrite.message,
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter) },
        },
      )
    }

    // Parse and validate request
    const body = await req.json()
    const { content, tone, issues } = body

    // Validate content
    if (!content || typeof content !== "string") {
      return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 })
    }

    if (content.length < VALIDATION.minContentLength) {
      return NextResponse.json(
        { success: false, error: `Content must be at least ${VALIDATION.minContentLength} characters` },
        { status: 400 },
      )
    }

    // Validate tone
    const validTone = VALIDATION.allowedTones.includes(tone) ? tone : "formal"

    // Validate issues array
    const validIssues = Array.isArray(issues)
      ? issues.filter((i) => i && typeof i.title === "string" && typeof i.description === "string")
      : []

    // Perform rewrite
    const improvedContent = await rewriteProposal(content, validTone, validIssues)

    // Generate improvement comparison
    const improvements = await generateImprovements(content, improvedContent)

    return NextResponse.json({
      success: true,
      improvedContent,
      ...improvements,
      rewrittenAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Studio Rewrite API] Error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
      return NextResponse.json(
        {
          success: false,
          error: "Service temporarily unavailable. Please try again in a few moments.",
          isRateLimited: true,
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to rewrite proposal. Please try again." },
      { status: 500 },
    )
  }
}
