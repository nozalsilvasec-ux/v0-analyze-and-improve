import { type NextRequest, NextResponse } from "next/server"
import { generateSection } from "@/lib/gemini"
import { VALIDATION } from "@/lib/prompts"

export const maxDuration = 30
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sectionType, context, tone } = body

    // Validate section type
    const validSectionTypes = [
      "executive-summary",
      "problem-statement",
      "solution",
      "scope-of-work",
      "timeline",
      "pricing",
      "about-us",
      "case-study",
      "call-to-action",
    ]

    if (!sectionType || !validSectionTypes.includes(sectionType)) {
      return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 })
    }

    // Validate tone
    const validTone = VALIDATION.allowedTones.includes(tone) ? tone : "formal"

    // Generate section content
    const generatedContent = await generateSection(sectionType, context || {}, validTone)

    return NextResponse.json({
      success: true,
      content: generatedContent,
      sectionType,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Studio Generate API] Error:", error)

    return NextResponse.json(
      { success: false, error: "Failed to generate content. Please try again." },
      { status: 500 },
    )
  }
}
