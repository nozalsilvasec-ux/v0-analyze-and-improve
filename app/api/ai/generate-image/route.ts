import { GoogleAuth } from "google-auth-library"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { prompt, aspectRatio = "16:9" } = body

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 })
    }

    // Check for required environment variables
    const projectId = process.env.GCP_PROJECT_ID
    const clientEmail = process.env.GCP_CLIENT_EMAIL
    const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n")

    if (!projectId || !clientEmail || !privateKey) {
      console.error("[AI Generate Image] Missing GCP credentials")
      // Return a placeholder image instead of error
      return NextResponse.json({
        success: true,
        image: {
          url: `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(prompt)} professional corporate`,
          prompt: prompt,
          is_ai_generated: false,
          source: "placeholder",
          error: "Google Cloud credentials not configured",
        },
      })
    }

    const enhancedPrompt = `Professional corporate business image: ${prompt}. High quality, clean, modern, suitable for business presentations and proposals.`

    try {
      // Initialize Google Auth with service account credentials
      const auth = new GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
        projectId: projectId,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      })

      // Get access token
      const client = await auth.getClient()
      const accessToken = await client.getAccessToken()

      if (!accessToken.token) {
        throw new Error("Failed to get access token")
      }

      const location = "us-central1"
      const modelId = "imagen-3.0-generate-002"
      const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:predict`

      const requestBody = {
        instances: [
          {
            prompt: enhancedPrompt,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: aspectRatio,
          safetyFilterLevel: "block_few",
          personGeneration: "allow_adult",
        },
      }

      console.log("[AI Generate Image] Calling Imagen 3 API...")

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[AI Generate Image] Imagen API error:", errorText)
        throw new Error(`Imagen API error: ${response.status}`)
      }

      const result = await response.json()

      if (result.predictions && result.predictions.length > 0) {
        const prediction = result.predictions[0]

        if (prediction.bytesBase64Encoded) {
          const base64Image = prediction.bytesBase64Encoded
          const mimeType = prediction.mimeType || "image/png"
          const dataUrl = `data:${mimeType};base64,${base64Image}`

          console.log("[AI Generate Image] Successfully generated image")

          return NextResponse.json({
            success: true,
            image: {
              url: dataUrl,
              prompt: prompt,
              enhancedPrompt: enhancedPrompt,
              is_ai_generated: true,
              source: "vertex-ai-imagen-3",
              aspectRatio: aspectRatio,
            },
          })
        }
      }

      throw new Error("No image generated in response")
    } catch (apiError) {
      console.error("[AI Generate Image] API Error:", apiError)

      // Fallback to placeholder
      const cleanPrompt = prompt.replace(/[^a-zA-Z0-9 ]/g, "").trim()
      const searchTerms = encodeURIComponent(cleanPrompt)

      return NextResponse.json({
        success: true,
        image: {
          url: `/placeholder.svg?height=600&width=800&query=${searchTerms} professional corporate`,
          prompt: prompt,
          is_ai_generated: false,
          source: "placeholder",
          error: apiError instanceof Error ? apiError.message : "Unknown error",
        },
      })
    }
  } catch (error) {
    console.error("[AI Generate Image] Error:", error)

    // Always return valid JSON
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
