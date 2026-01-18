"use client"

/**
 * Document Parser v3 - Turbopack Compatible
 * Uses script tag loading for PDF.js (NO dynamic imports from CDN)
 */

import JSZip from "jszip"
import {
  type DocumentTemplate,
  type TemplateSection,
  type ContentBlock,
  type DocumentAsset,
  createTemplate,
  createSection,
  createBlock,
  generateId,
  type HeadingBlock,
  type ParagraphBlock,
  type ListBlock,
  type TableBlock,
  type ImageBlock,
  createAssetStore,
} from "./document-model"

// ============================================
// TYPES
// ============================================

export interface ExtractedImage {
  id: string
  name: string
  mimeType: string
  data: string
  width?: number
  height?: number
}

export interface ExtractedTable {
  id: string
  headers: string[]
  rows: string[][]
}

export interface DocumentStructure {
  headings: Array<{ level: number; text: string; position: number }>
  paragraphs: Array<{ text: string; position: number }>
  lists: Array<{ items: string[]; type: "bullet" | "numbered"; position: number }>
  tables: ExtractedTable[]
  images: ExtractedImage[]
}

export interface ParseResult {
  success: boolean
  error?: string
  template?: DocumentTemplate
  assets?: Record<string, DocumentAsset>
  data: {
    title: string
    rawText: string
    sections: Array<{
      id: string
      type: string
      title: string
      content: Record<string, unknown>
      order: number
    }>
    images?: ExtractedImage[]
    structure?: DocumentStructure
  }
}

// ============================================
// MAIN PARSER
// ============================================

export async function parseDocument(file: File): Promise<ParseResult> {
  const fileType = file.name.split(".").pop()?.toLowerCase()

  try {
    switch (fileType) {
      case "txt":
        return await parseTxtFile(file)
      case "docx":
        return await parseDocxFile(file)
      case "pdf":
        return await parsePdfFile(file)
      default:
        return {
          success: false,
          error: `Unsupported file type: ${fileType}`,
          data: { title: "", rawText: "", sections: [] },
        }
    }
  } catch (error) {
    console.error("[v0] Document parsing error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse document",
      data: { title: "", rawText: "", sections: [] },
    }
  }
}

// ============================================
// TXT PARSER
// ============================================

async function parseTxtFile(file: File): Promise<ParseResult> {
  const text = await file.text()
  const { sections, structure } = convertTextToSections(text)
  
  const title = structure.headings[0]?.text || 
    file.name.replace(".txt", "") ||
    "Untitled Document"

  const template = createTemplate(
    title,
    {
      type: "upload",
      originalFilename: file.name,
      originalFormat: "txt",
      uploadedAt: new Date().toISOString(),
    },
    sections
  )

  return {
    success: true,
    template,
    assets: {},
    data: {
      title,
      rawText: text,
      sections: sections.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title,
        content: blocksToLegacyContent(s.blocks),
        order: s.order,
      })),
      structure,
    },
  }
}

// ============================================
// DOCX PARSER
// ============================================

async function parseDocxFile(file: File): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(arrayBuffer)
  
  const assetStore = createAssetStore()
  const extractedImages: ExtractedImage[] = []
  
  // Extract images from media folder
  const mediaFolder = zip.folder("word/media")
  if (mediaFolder) {
    const imageFiles = Object.keys(zip.files).filter(
      name => name.startsWith("word/media/") && /\.(png|jpg|jpeg|gif|bmp)$/i.test(name)
    )
    
    for (const imagePath of imageFiles) {
      try {
        const imageData = await zip.file(imagePath)?.async("base64")
        if (imageData) {
          const ext = imagePath.split(".").pop()?.toLowerCase() || "png"
          const mimeType = ext === "jpg" ? "image/jpeg" : `image/${ext}`
          const name = imagePath.split("/").pop() || `image_${extractedImages.length}`
          
          const image: ExtractedImage = {
            id: generateId(),
            name,
            mimeType,
            data: `data:${mimeType};base64,${imageData}`,
          }
          extractedImages.push(image)
          
          assetStore.add({
            id: image.id,
            type: "image",
            name: image.name,
            mimeType: image.mimeType,
            data: image.data,
            metadata: { source: "docx", originalPath: imagePath },
          })
        }
      } catch (e) {
        console.error("[v0] Failed to extract image:", imagePath, e)
      }
    }
  }
  
  // Extract document.xml
  const documentXml = await zip.file("word/document.xml")?.async("string")
  if (!documentXml) {
    return {
      success: false,
      error: "Invalid DOCX file: missing document.xml",
      data: { title: "", rawText: "", sections: [] },
    }
  }
  
  // Parse XML to extract text and structure
  const { text, structure } = parseDocxXml(documentXml)
  structure.images = extractedImages
  
  const sections = convertStructureToSections(structure, assetStore)
  
  const title = structure.headings[0]?.text || 
    file.name.replace(".docx", "") ||
    "Untitled Document"

  const template = createTemplate(
    title,
    {
      type: "upload",
      originalFilename: file.name,
      originalFormat: "docx",
      uploadedAt: new Date().toISOString(),
    },
    sections
  )

  return {
    success: true,
    template,
    assets: assetStore.toJSON(),
    data: {
      title,
      rawText: text,
      sections: sections.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title,
        content: blocksToLegacyContent(s.blocks),
        order: s.order,
      })),
      images: extractedImages,
      structure,
    },
  }
}

function parseDocxXml(xml: string): { text: string; structure: DocumentStructure } {
  const structure: DocumentStructure = {
    headings: [],
    paragraphs: [],
    lists: [],
    tables: [],
    images: [],
  }
  
  const textParts: string[] = []
  let position = 0
  
  // Extract paragraphs with <w:p> tags
  const paragraphRegex = /<w:p[^>]*>([\s\S]*?)<\/w:p>/g
  let match
  
  while ((match = paragraphRegex.exec(xml)) !== null) {
    const paragraphContent = match[1]
    
    // Extract text from <w:t> tags
    const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g
    let textMatch
    let paragraphText = ""
    
    while ((textMatch = textRegex.exec(paragraphContent)) !== null) {
      paragraphText += textMatch[1]
    }
    
    if (paragraphText.trim()) {
      textParts.push(paragraphText)
      
      // Check if it's a heading (has pStyle with Heading)
      const styleMatch = /<w:pStyle[^>]*w:val="([^"]*)"/.exec(paragraphContent)
      const style = styleMatch?.[1] || ""
      
      if (style.toLowerCase().includes("heading") || style.match(/^h[1-6]$/i)) {
        const level = parseInt(style.replace(/\D/g, "")) || 1
        structure.headings.push({
          level: Math.min(Math.max(level, 1), 6),
          text: paragraphText.trim(),
          position,
        })
      } else {
        structure.paragraphs.push({
          text: paragraphText.trim(),
          position,
        })
      }
      
      position++
    }
  }
  
  // Extract tables with <w:tbl> tags
  const tableRegex = /<w:tbl>([\s\S]*?)<\/w:tbl>/g
  while ((match = tableRegex.exec(xml)) !== null) {
    const tableContent = match[1]
    const rows: string[][] = []
    
    const rowRegex = /<w:tr[^>]*>([\s\S]*?)<\/w:tr>/g
    let rowMatch
    
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      const rowContent = rowMatch[1]
      const cells: string[] = []
      
      const cellRegex = /<w:tc[^>]*>([\s\S]*?)<\/w:tc>/g
      let cellMatch
      
      while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        const cellContent = cellMatch[1]
        let cellText = ""
        
        const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g
        let textMatch
        while ((textMatch = textRegex.exec(cellContent)) !== null) {
          cellText += textMatch[1]
        }
        
        cells.push(cellText.trim())
      }
      
      if (cells.length > 0) {
        rows.push(cells)
      }
    }
    
    if (rows.length > 0) {
      structure.tables.push({
        id: generateId(),
        headers: rows[0] || [],
        rows: rows.slice(1),
      })
    }
  }
  
  return {
    text: textParts.join("\n\n"),
    structure,
  }
}

// ============================================
// PDF PARSER - Script Tag Loading (Turbopack Compatible)
// ============================================

// Global cache for PDF.js library
let pdfJsLib: PDFJsLibrary | null = null
let pdfJsLoadPromise: Promise<PDFJsLibrary> | null = null

interface PDFJsLibrary {
  getDocument: (params: { data: ArrayBuffer }) => { promise: Promise<PDFDocument> }
  GlobalWorkerOptions: { workerSrc: string }
}

interface PDFDocument {
  numPages: number
  getPage: (num: number) => Promise<PDFPage>
}

interface PDFPage {
  getTextContent: () => Promise<{ items: Array<{ str?: string }> }>
  getOperatorList: () => Promise<unknown>
}

async function loadPdfJsLibrary(): Promise<PDFJsLibrary> {
  console.log("[v0] loadPdfJsLibrary called")
  
  // Return cached library
  if (pdfJsLib) {
    console.log("[v0] Returning cached pdfJsLib")
    return pdfJsLib
  }
  
  // Return existing promise if loading
  if (pdfJsLoadPromise) {
    console.log("[v0] Returning existing load promise")
    return pdfJsLoadPromise
  }
  
  // Return existing load promise to avoid duplicate loading
  if (pdfJsLoadPromise) {
    return pdfJsLoadPromise
  }
  
  // Check if already loaded on window
  if (typeof window !== "undefined" && (window as { pdfjsLib?: PDFJsLibrary }).pdfjsLib) {
    pdfJsLib = (window as { pdfjsLib: PDFJsLibrary }).pdfjsLib
    return pdfJsLib
  }
  
  // Create load promise
  pdfJsLoadPromise = new Promise<PDFJsLibrary>((resolve, reject) => {
    // Check for existing script
    const existingScript = document.querySelector('script[src*="pdf.min.js"]')
    
    if (existingScript) {
      // Wait for existing script to load
      const waitForLib = () => {
        const lib = (window as { pdfjsLib?: PDFJsLibrary }).pdfjsLib
        if (lib) {
          pdfJsLib = lib
          resolve(lib)
        } else {
          setTimeout(waitForLib, 100)
        }
      }
      waitForLib()
      return
    }
    
    // Create and append script
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
    script.async = true
    
    script.onload = () => {
      console.log("[v0] PDF.js script onload fired")
      const lib = (window as { pdfjsLib?: PDFJsLibrary }).pdfjsLib
      console.log("[v0] window.pdfjsLib:", !!lib)
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc = 
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
        pdfJsLib = lib
        console.log("[v0] PDF.js configured and ready")
        resolve(lib)
      } else {
        console.error("[v0] PDF.js library not on window after script load")
        reject(new Error("PDF.js library not found after script load"))
      }
    }
    
    script.onerror = (e) => {
      console.error("[v0] PDF.js script onerror:", e)
      pdfJsLoadPromise = null
      reject(new Error("Failed to load PDF.js from CDN"))
    }
    
    console.log("[v0] Appending PDF.js script to head")
    
    document.head.appendChild(script)
  })
  
  return pdfJsLoadPromise
}

async function parsePdfFile(file: File): Promise<ParseResult> {
  console.log("[v0] parsePdfFile started for:", file.name)
  try {
    console.log("[v0] Loading PDF.js library...")
    const pdfjsLib = await loadPdfJsLibrary()
    console.log("[v0] PDF.js loaded successfully:", !!pdfjsLib)
    
    const arrayBuffer = await file.arrayBuffer()
    console.log("[v0] File converted to ArrayBuffer, size:", arrayBuffer.byteLength)
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    console.log("[v0] PDF document loaded, pages:", pdf.numPages)
    
    const assetStore = createAssetStore()
    const allText: string[] = []
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item) => item.str || "")
        .join(" ")
      allText.push(pageText)
    }
    
    const rawText = allText.join("\n\n")
    const { sections, structure } = convertTextToSections(rawText)
    
    const title = structure.headings[0]?.text || 
      file.name.replace(".pdf", "") ||
      "Untitled Document"

    const template = createTemplate(
      title,
      {
        type: "upload",
        originalFilename: file.name,
        originalFormat: "pdf",
        uploadedAt: new Date().toISOString(),
      },
      sections
    )

    return {
      success: true,
      template,
      assets: assetStore.toJSON(),
      data: {
        title,
        rawText,
        sections: sections.map(s => ({
          id: s.id,
          type: s.type,
          title: s.title,
          content: blocksToLegacyContent(s.blocks),
          order: s.order,
        })),
        structure,
      },
    }
  } catch (error) {
    console.error("[v0] PDF parsing error:", error)
    return {
      success: false,
      error: "Failed to parse PDF. The file may be corrupted or password-protected.",
      data: { title: "", rawText: "", sections: [] },
    }
  }
}

// ============================================
// TEXT CONVERSION UTILITIES
// ============================================

function convertTextToSections(text: string): { sections: TemplateSection[]; structure: DocumentStructure } {
  const structure: DocumentStructure = {
    headings: [],
    paragraphs: [],
    lists: [],
    tables: [],
    images: [],
  }
  
  const lines = text.split("\n")
  let position = 0
  let currentListItems: string[] = []
  let currentListType: "bullet" | "numbered" = "bullet"
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      position++
      continue
    }
    
    // Check for headings (lines in ALL CAPS or starting with #)
    if (trimmed.startsWith("#")) {
      const level = (trimmed.match(/^#+/)?.[0].length || 1) as 1 | 2 | 3 | 4 | 5 | 6
      const text = trimmed.replace(/^#+\s*/, "").trim()
      if (text) {
        structure.headings.push({ level: Math.min(level, 6) as 1 | 2 | 3 | 4 | 5 | 6, text, position })
      }
    } else if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 100 && /[A-Z]/.test(trimmed)) {
      structure.headings.push({ level: 2, text: trimmed, position })
    }
    // Check for list items
    else if (/^[-*•]\s/.test(trimmed)) {
      currentListItems.push(trimmed.replace(/^[-*•]\s*/, ""))
      currentListType = "bullet"
    } else if (/^\d+[.)]\s/.test(trimmed)) {
      currentListItems.push(trimmed.replace(/^\d+[.)]\s*/, ""))
      currentListType = "numbered"
    }
    // Regular paragraph
    else {
      // Save any accumulated list
      if (currentListItems.length > 0) {
        structure.lists.push({ items: [...currentListItems], type: currentListType, position: position - currentListItems.length })
        currentListItems = []
      }
      structure.paragraphs.push({ text: trimmed, position })
    }
    
    position++
  }
  
  // Save any remaining list
  if (currentListItems.length > 0) {
    structure.lists.push({ items: currentListItems, type: currentListType, position: position - currentListItems.length })
  }
  
  const sections = convertStructureToSections(structure, createAssetStore())
  return { sections, structure }
}

function convertStructureToSections(structure: DocumentStructure, assetStore: ReturnType<typeof createAssetStore>): TemplateSection[] {
  const sections: TemplateSection[] = []
  let sectionOrder = 0
  
  // If no headings, create a single content section
  if (structure.headings.length === 0) {
    const blocks: ContentBlock[] = []
    
    for (const para of structure.paragraphs) {
      blocks.push(createBlock<ParagraphBlock>("paragraph", { text: para.text }))
    }
    
    for (const list of structure.lists) {
      blocks.push(createBlock<ListBlock>("list", { items: list.items, listType: list.type }))
    }
    
    if (blocks.length === 0) {
      blocks.push(createBlock<ParagraphBlock>("paragraph", { text: "Empty document" }))
    }
    
    sections.push(createSection("Content", "text", blocks, 0))
    return sections
  }
  
  // Create sections from headings
  for (let i = 0; i < structure.headings.length; i++) {
    const heading = structure.headings[i]
    const nextHeading = structure.headings[i + 1]
    
    const blocks: ContentBlock[] = [
      createBlock<HeadingBlock>("heading", {
        text: heading.text,
        level: heading.level as 1 | 2 | 3 | 4 | 5 | 6,
      }),
    ]
    
    // Add paragraphs between this heading and next
    const relevantParagraphs = structure.paragraphs.filter(
      p => p.position > heading.position && 
           (!nextHeading || p.position < nextHeading.position)
    )
    
    for (const para of relevantParagraphs) {
      blocks.push(createBlock<ParagraphBlock>("paragraph", { text: para.text }))
    }
    
    // Add relevant lists
    const relevantLists = structure.lists.filter(
      l => l.position > heading.position &&
           (!nextHeading || l.position < nextHeading.position)
    )
    
    for (const list of relevantLists) {
      blocks.push(createBlock<ListBlock>("list", { items: list.items, listType: list.type }))
    }
    
    sections.push(createSection(heading.text, "text", blocks, sectionOrder++))
  }

  // Add tables as separate sections
  for (const table of structure.tables) {
    const tableBlocks: ContentBlock[] = [
      createBlock<TableBlock>("table", { headers: table.headers, rows: table.rows }),
    ]
    sections.push(createSection("Data Table", "table", tableBlocks, sectionOrder++))
  }

  // Add images as separate sections
  const assets = assetStore.getAll()
  for (const asset of assets) {
    const imageBlocks: ContentBlock[] = [
      createBlock<ImageBlock>("image", { assetId: asset.id, alt: asset.name, alignment: "center" }),
    ]
    sections.push(createSection("Image", "image", imageBlocks, sectionOrder++))
  }

  return sections
}

function blocksToLegacyContent(blocks: ContentBlock[]): Record<string, unknown> {
  const content: Record<string, unknown> = {}
  
  for (const block of blocks) {
    switch (block.type) {
      case "heading":
        content.heading = (block.data as HeadingBlock["data"]).text
        content.headingLevel = (block.data as HeadingBlock["data"]).level
        break
      case "paragraph":
        if (content.body) {
          content.body = `${content.body}\n\n${(block.data as ParagraphBlock["data"]).text}`
        } else {
          content.body = (block.data as ParagraphBlock["data"]).text
        }
        break
      case "list":
        content.listItems = (block.data as ListBlock["data"]).items
        content.listType = (block.data as ListBlock["data"]).listType
        break
      case "table":
        content.tableHeaders = (block.data as TableBlock["data"]).headers
        content.tableRows = (block.data as TableBlock["data"]).rows
        break
      case "image":
        content.imageId = (block.data as ImageBlock["data"]).assetId
        content.imageAlt = (block.data as ImageBlock["data"]).alt
        break
    }
  }
  
  return content
}
