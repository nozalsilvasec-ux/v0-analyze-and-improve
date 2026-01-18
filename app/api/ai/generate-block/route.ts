import { GoogleGenerativeAI } from "@google/generative-ai"

const blockContentSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "The main title/heading for this section" },
    subtitle: { type: "string", description: "An optional subtitle" },
    text: { type: "string", description: "The main body text content" },
    bulletPoints: { type: "array", items: { type: "string" }, description: "Optional bullet points" },
    callToAction: { type: "string", description: "Optional call to action button text" },
  },
  required: ["title", "text"],
}

export async function POST(req: Request) {
  try {
    const { prompt, blockType } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        {
          error: "Gemini API key not configured. Please add GEMINI_API_KEY to environment variables.",
        },
        { status: 500 },
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const systemPrompt = `You are a professional proposal and document content writer. 
Generate compelling, professional content for a ${blockType || "content"} section based on the user's description.
The content should be:
- Professional and polished
- Concise but impactful
- Suitable for business proposals and presentations
- Free of placeholder text like [Company Name] unless specifically asked

Respond with a JSON object with these fields:
- name: A short name for this block (string)
- type: One of "hero", "text", "pricing", "testimonial", "cta", "data" (string)
- content: An object with title (string), subtitle (optional string), text (string), bulletPoints (optional array of strings), callToAction (optional string)
- suggestedColors: Optional object with background, text, accent (all hex color strings)

User request: ${prompt}

Respond ONLY with valid JSON, no markdown or explanation.`

    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON from response, handling potential markdown code blocks
    let jsonText = text.trim()
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7)
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.slice(3)
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.slice(0, -3)
    }
    jsonText = jsonText.trim()

    const object = JSON.parse(jsonText)

    return Response.json({
      success: true,
      block: {
        id: `ai-${Date.now()}`,
        name: object.name || "AI Generated Block",
        type: object.type || "text",
        content: object.content || { title: "Generated Content", text: prompt },
        suggestedColors: object.suggestedColors,
        is_ai_generated: true,
      },
    })
  } catch (error) {
    console.error("[AI Generate Block] Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json({ error: `Failed to generate block content: ${errorMessage}` }, { status: 500 })
  }
}
