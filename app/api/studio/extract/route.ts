import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Max duration for file processing
export const maxDuration = 60

// Supported MIME types
const SUPPORTED_TYPES = {
  "application/pdf": "pdf",
  "text/plain": "txt",
} as const

async function extractTextFromPDFWithGemini(buffer: ArrayBuffer, fileName: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  // Convert buffer to base64
  const uint8Array = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i])
  }
  const base64Data = btoa(binary)

  const prompt = `Extract ALL text content from this PDF document. 
Return ONLY the extracted text, preserving the original structure and formatting as much as possible.
Do not add any commentary, explanations, or markdown formatting.
Do not summarize - extract the complete text verbatim.
If there are headers, paragraphs, lists, or sections, preserve them with appropriate line breaks.`

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64Data,
      },
    },
    { text: prompt },
  ])

  const response = result.response
  const text = response.text()

  if (!text || text.length < 10) {
    throw new Error("Could not extract text from PDF")
  }

  return text
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    const fileType = SUPPORTED_TYPES[file.type as keyof typeof SUPPORTED_TYPES]
    if (!fileType) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: ${file.type}. PDF files are processed on the server. DOCX files should be handled client-side.`,
        },
        { status: 400 },
      )
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    let extractedText = ""

    if (fileType === "txt") {
      // Plain text - just read directly
      extractedText = await file.text()
    } else if (fileType === "pdf") {
      const arrayBuffer = await file.arrayBuffer()
      try {
        extractedText = await extractTextFromPDFWithGemini(arrayBuffer, file.name)
      } catch (error) {
        console.error("[Extract API] PDF extraction error:", error)
        return NextResponse.json(
          {
            success: false,
            error:
              "Could not extract text from this PDF. Please try copying and pasting the text directly, or save as a .txt file.",
          },
          { status: 400 },
        )
      }
    }

    // Clean up extracted text - remove markdown artifacts
    extractedText = extractedText
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/__/g, "")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/^#+\s*/gm, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+/g, " ")
      .trim()

    if (!extractedText || extractedText.length < 10) {
      return NextResponse.json(
        { success: false, error: "Could not extract text from file. The file may be empty or corrupted." },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
      fileName: file.name,
      fileType: fileType,
      wordCount: extractedText.split(/\s+/).filter(Boolean).length,
      charCount: extractedText.length,
    })
  } catch (error) {
    console.error("[Extract API] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to extract text from file",
      },
      { status: 500 },
    )
  }
}
