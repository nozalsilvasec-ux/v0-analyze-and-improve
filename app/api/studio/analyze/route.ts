import { type NextRequest, NextResponse } from "next/server"
import { analyzeProposal } from "@/lib/gemini"
import { VALIDATION, RATE_LIMITS } from "@/lib/prompts"

export const maxDuration = 60
export const dynamic = "force-dynamic"

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMITS.analyze.windowMs })
    return { allowed: true }
  }

  if (limit.count >= RATE_LIMITS.analyze.maxRequests) {
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
          error: RATE_LIMITS.analyze.message,
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter) },
        },
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const { content, tone, goals } = body

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

    if (content.length > VALIDATION.maxContentLength) {
      return NextResponse.json(
        { success: false, error: `Content must not exceed ${VALIDATION.maxContentLength} characters` },
        { status: 400 },
      )
    }

    // Validate tone
    const validTone = VALIDATION.allowedTones.includes(tone) ? tone : "formal"

    // Perform analysis
    const analysis = await analyzeProposal(content, validTone, goals)

    return NextResponse.json({
      success: true,
      ...analysis,
      analyzedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Studio Analyze API] Error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // Check for specific error types
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

    if (errorMessage.includes("API_KEY") || errorMessage.includes("authentication")) {
      return NextResponse.json({ success: false, error: "Service configuration error" }, { status: 500 })
    }

    return NextResponse.json(
      { success: false, error: "Failed to analyze proposal. Please try again." },
      { status: 500 },
    )
  }
}
