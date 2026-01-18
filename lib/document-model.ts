"use client"

/**
 * Internal Document Model & Asset Store
 * 
 * This module defines the internal editable model for documents.
 * Uploaded files are ALWAYS converted to this model - never returned as-is.
 * 
 * Key principles:
 * - Documents are decoupled from their source files
 * - Images are stored as separate linked assets
 * - Every section has a unique ID and is independently editable
 * - Supports versioning, reuse, and multiple recipients
 */

// ============================================
// ASSET STORE - Images stored separately
// ============================================

export interface DocumentAsset {
  id: string
  type: "image" | "logo" | "chart" | "graphic"
  name: string
  mimeType: string
  data: string // base64 data URL
  width?: number
  height?: number
  originalFilename?: string
  createdAt: string
  updatedAt: string
}

export interface AssetStore {
  assets: Map<string, DocumentAsset>
  add: (asset: Omit<DocumentAsset, "id" | "createdAt" | "updatedAt">) => string
  get: (id: string) => DocumentAsset | undefined
  update: (id: string, updates: Partial<DocumentAsset>) => void
  remove: (id: string) => void
  getAll: () => DocumentAsset[]
  toJSON: () => Record<string, DocumentAsset>
  fromJSON: (data: Record<string, DocumentAsset>) => void
}

export function createAssetStore(): AssetStore {
  const assets = new Map<string, DocumentAsset>()

  return {
    assets,
    
    add(asset) {
      const id = `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const now = new Date().toISOString()
      assets.set(id, {
        ...asset,
        id,
        createdAt: now,
        updatedAt: now,
      })
      return id
    },

    get(id) {
      return assets.get(id)
    },

    update(id, updates) {
      const asset = assets.get(id)
      if (asset) {
        assets.set(id, {
          ...asset,
          ...updates,
          updatedAt: new Date().toISOString(),
        })
      }
    },

    remove(id) {
      assets.delete(id)
    },

    getAll() {
      return Array.from(assets.values())
    },

    toJSON() {
      const obj: Record<string, DocumentAsset> = {}
      assets.forEach((value, key) => {
        obj[key] = value
      })
      return obj
    },

    fromJSON(data) {
      assets.clear()
      Object.entries(data).forEach(([key, value]) => {
        assets.set(key, value)
      })
    },
  }
}

// ============================================
// EDITABLE CONTENT BLOCKS
// ============================================

export type BlockType = 
  | "heading"
  | "paragraph"
  | "list"
  | "table"
  | "image"
  | "quote"
  | "divider"
  | "spacer"

export interface BaseBlock {
  id: string
  type: BlockType
  createdAt: string
  updatedAt: string
}

export interface HeadingBlock extends BaseBlock {
  type: "heading"
  content: {
    text: string
    level: 1 | 2 | 3 | 4 | 5 | 6
    style?: {
      color?: string
      fontSize?: string
      fontWeight?: string
      textAlign?: "left" | "center" | "right"
    }
  }
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph"
  content: {
    text: string
    style?: {
      color?: string
      fontSize?: string
      fontWeight?: string
      fontStyle?: string
      textAlign?: "left" | "center" | "right" | "justify"
      lineHeight?: string
    }
  }
}

export interface ListBlock extends BaseBlock {
  type: "list"
  content: {
    items: string[]
    listType: "bullet" | "numbered"
    style?: {
      color?: string
      fontSize?: string
    }
  }
}

export interface TableBlock extends BaseBlock {
  type: "table"
  content: {
    headers: string[]
    rows: string[][]
    style?: {
      headerBackground?: string
      headerColor?: string
      borderColor?: string
      alternateRowColor?: string
    }
  }
}

export interface ImageBlock extends BaseBlock {
  type: "image"
  content: {
    assetId: string // Reference to asset store, NOT embedded data
    alt: string
    caption?: string
    width?: number
    height?: number
    alignment?: "left" | "center" | "right"
  }
}

export interface QuoteBlock extends BaseBlock {
  type: "quote"
  content: {
    text: string
    author?: string
    role?: string
    style?: {
      borderColor?: string
      backgroundColor?: string
    }
  }
}

export interface DividerBlock extends BaseBlock {
  type: "divider"
  content: {
    style?: "solid" | "dashed" | "dotted"
    color?: string
  }
}

export interface SpacerBlock extends BaseBlock {
  type: "spacer"
  content: {
    height: number // in pixels
  }
}

export type ContentBlock = 
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | TableBlock
  | ImageBlock
  | QuoteBlock
  | DividerBlock
  | SpacerBlock

// ============================================
// EDITABLE SECTIONS
// ============================================

export interface TemplateSection {
  id: string
  title: string
  type: "hero" | "text" | "image" | "table" | "quote" | "pricing" | "team" | "dashboard" | "comparison" | "roadmap" | "testimonial" | "investment" | "custom"
  blocks: ContentBlock[]
  order: number
  isCollapsed?: boolean
  isLocked?: boolean
  style?: {
    backgroundColor?: string
    backgroundImage?: string
    padding?: string
    margin?: string
  }
  createdAt: string
  updatedAt: string
}

// ============================================
// DOCUMENT TEMPLATE (Main Model)
// ============================================

export interface DocumentTemplate {
  id: string
  name: string
  description?: string
  
  // Source information (for reference only, not used for output)
  source: {
    type: "upload" | "created" | "ai-generated"
    originalFilename?: string
    originalFormat?: "docx" | "pdf" | "txt"
    uploadedAt?: string
  }
  
  // Editable content
  sections: TemplateSection[]
  
  // Linked assets (images stored separately)
  assetIds: string[]
  
  // Metadata
  metadata: {
    author?: string
    company?: string
    clientName?: string
    projectName?: string
    tags?: string[]
    category?: string
  }
  
  // Style settings
  style: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
    headingFont?: string
    bodyFont?: string
    backgroundColor?: string
  }
  
  // Versioning
  version: number
  versions: DocumentVersion[]
  
  // Timestamps
  createdAt: string
  updatedAt: string
  lastEditedAt: string
}

export interface DocumentVersion {
  id: string
  version: number
  name: string
  snapshot: string // JSON stringified sections
  createdAt: string
  createdBy?: string
  notes?: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function createBlock<T extends ContentBlock>(
  type: T["type"],
  content: T["content"]
): T {
  const now = new Date().toISOString()
  return {
    id: generateId("block"),
    type,
    content,
    createdAt: now,
    updatedAt: now,
  } as T
}

export function createSection(
  title: string,
  type: TemplateSection["type"],
  blocks: ContentBlock[] = [],
  order: number = 0
): TemplateSection {
  const now = new Date().toISOString()
  return {
    id: generateId("section"),
    title,
    type,
    blocks,
    order,
    createdAt: now,
    updatedAt: now,
  }
}

export function createTemplate(
  name: string,
  source: DocumentTemplate["source"],
  sections: TemplateSection[] = []
): DocumentTemplate {
  const now = new Date().toISOString()
  return {
    id: generateId("template"),
    name,
    source,
    sections,
    assetIds: [],
    metadata: {},
    style: {},
    version: 1,
    versions: [],
    createdAt: now,
    updatedAt: now,
    lastEditedAt: now,
  }
}

// ============================================
// VERSION MANAGEMENT
// ============================================

export function createVersion(
  template: DocumentTemplate,
  name: string,
  notes?: string
): DocumentVersion {
  return {
    id: generateId("version"),
    version: template.version,
    name,
    snapshot: JSON.stringify(template.sections),
    createdAt: new Date().toISOString(),
    notes,
  }
}

export function saveVersion(
  template: DocumentTemplate,
  name: string = `Version ${template.version}`,
  notes?: string
): DocumentTemplate {
  const version = createVersion(template, name, notes)
  return {
    ...template,
    version: template.version + 1,
    versions: [...template.versions, version],
    updatedAt: new Date().toISOString(),
  }
}

export function restoreVersion(
  template: DocumentTemplate,
  versionId: string
): DocumentTemplate | null {
  const version = template.versions.find(v => v.id === versionId)
  if (!version) return null

  try {
    const sections = JSON.parse(version.snapshot) as TemplateSection[]
    return {
      ...template,
      sections,
      version: template.version + 1,
      updatedAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

// ============================================
// LOCAL STORAGE PERSISTENCE
// ============================================

const TEMPLATES_STORAGE_KEY = "lightnote_templates"
const ASSETS_STORAGE_KEY = "lightnote_assets"

export function saveTemplateToStorage(template: DocumentTemplate): void {
  if (typeof window === "undefined") return
  
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    const templates: Record<string, DocumentTemplate> = stored ? JSON.parse(stored) : {}
    templates[template.id] = template
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))
  } catch (error) {
    console.error("Failed to save template to storage:", error)
  }
}

export function getTemplateFromStorage(id: string): DocumentTemplate | null {
  if (typeof window === "undefined") return null
  
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    if (!stored) return null
    const templates: Record<string, DocumentTemplate> = JSON.parse(stored)
    return templates[id] || null
  } catch {
    return null
  }
}

export function getAllTemplatesFromStorage(): DocumentTemplate[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    if (!stored) return []
    const templates: Record<string, DocumentTemplate> = JSON.parse(stored)
    return Object.values(templates)
  } catch {
    return []
  }
}

export function deleteTemplateFromStorage(id: string): void {
  if (typeof window === "undefined") return
  
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    if (!stored) return
    const templates: Record<string, DocumentTemplate> = JSON.parse(stored)
    delete templates[id]
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))
  } catch (error) {
    console.error("Failed to delete template from storage:", error)
  }
}

export function saveAssetsToStorage(assets: Record<string, DocumentAsset>): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets))
  } catch (error) {
    console.error("Failed to save assets to storage:", error)
  }
}

export function getAssetsFromStorage(): Record<string, DocumentAsset> {
  if (typeof window === "undefined") return {}
  
  try {
    const stored = localStorage.getItem(ASSETS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// ============================================
// CONVERSION: Template -> Proposal (for editor)
// ============================================

import type { Section, Proposal } from "@/lib/supabase/types"

export function templateToProposal(
  template: DocumentTemplate,
  assets: Record<string, DocumentAsset>
): Proposal {
  const sections: Section[] = template.sections.map((section, index) => {
    // Convert blocks to section content
    const content = blocksToSectionContent(section.blocks, assets)
    
    return {
      id: section.id,
      type: mapSectionType(section.type),
      title: section.title,
      content: {
        ...content,
        style: section.style,
      },
      order: index,
    }
  })

  return {
    id: template.id,
    name: template.name,
    client_name: template.metadata.clientName || "",
    content: { sections },
    source_type: template.source.type === "upload" ? "upload" : "created",
    status: "draft",
    is_favorite: false,
    created_at: template.createdAt,
    last_edited_at: template.lastEditedAt,
    user_id: "",
    template_id: null,
  }
}

function mapSectionType(type: TemplateSection["type"]): Section["type"] {
  const typeMap: Record<TemplateSection["type"], Section["type"]> = {
    hero: "hero",
    text: "text",
    image: "image",
    table: "table",
    quote: "quote",
    pricing: "pricing",
    team: "team",
    dashboard: "dashboard",
    comparison: "comparison",
    roadmap: "roadmap",
    testimonial: "testimonial",
    investment: "investment",
    custom: "text",
  }
  return typeMap[type] || "text"
}

function blocksToSectionContent(
  blocks: ContentBlock[],
  assets: Record<string, DocumentAsset>
): Record<string, unknown> {
  const content: Record<string, unknown> = {}
  
  // Extract main text content
  const textBlocks = blocks.filter(b => b.type === "paragraph" || b.type === "heading")
  if (textBlocks.length > 0) {
    const firstHeading = blocks.find(b => b.type === "heading") as HeadingBlock | undefined
    const firstParagraph = blocks.find(b => b.type === "paragraph") as ParagraphBlock | undefined
    
    if (firstHeading) {
      content.heading = firstHeading.content.text
      content.title = firstHeading.content.text
    }
    
    if (firstParagraph) {
      content.text = firstParagraph.content.text
    }
    
    // Combine all paragraph text
    const allText = blocks
      .filter(b => b.type === "paragraph")
      .map(b => (b as ParagraphBlock).content.text)
      .join("\n\n")
    if (allText) {
      content.text = allText
    }
  }
  
  // Extract images
  const imageBlocks = blocks.filter(b => b.type === "image") as ImageBlock[]
  if (imageBlocks.length > 0) {
    const firstImage = imageBlocks[0]
    const asset = assets[firstImage.content.assetId]
    if (asset) {
      content.image = asset.data
      content.imageAlt = firstImage.content.alt
      content.imageCaption = firstImage.content.caption
    }
  }
  
  // Extract tables
  const tableBlocks = blocks.filter(b => b.type === "table") as TableBlock[]
  if (tableBlocks.length > 0) {
    const firstTable = tableBlocks[0]
    content.headers = firstTable.content.headers
    content.rows = firstTable.content.rows
  }
  
  // Extract lists
  const listBlocks = blocks.filter(b => b.type === "list") as ListBlock[]
  if (listBlocks.length > 0) {
    content.items = listBlocks.flatMap(b => b.content.items)
  }
  
  // Extract quotes
  const quoteBlocks = blocks.filter(b => b.type === "quote") as QuoteBlock[]
  if (quoteBlocks.length > 0) {
    const firstQuote = quoteBlocks[0]
    content.quote = firstQuote.content.text
    content.author = firstQuote.content.author
    content.role = firstQuote.content.role
  }
  
  return content
}

// ============================================
// CONVERSION: Proposal -> Template (for saving)
// ============================================

export function proposalToTemplate(
  proposal: Proposal,
  existingTemplate?: DocumentTemplate
): DocumentTemplate {
  const sections: TemplateSection[] = (proposal.content?.sections || []).map((section, index) => {
    const blocks = sectionContentToBlocks(section.content)
    
    return createSection(
      section.title || `Section ${index + 1}`,
      section.type as TemplateSection["type"],
      blocks,
      index
    )
  })

  if (existingTemplate) {
    return {
      ...existingTemplate,
      name: proposal.name,
      sections,
      metadata: {
        ...existingTemplate.metadata,
        clientName: proposal.client_name,
      },
      updatedAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
    }
  }

  return createTemplate(
    proposal.name,
    { type: "created" },
    sections
  )
}

function sectionContentToBlocks(content: Record<string, unknown>): ContentBlock[] {
  const blocks: ContentBlock[] = []
  
  // Add heading if present
  if (content.heading || content.title) {
    blocks.push(createBlock<HeadingBlock>("heading", {
      text: (content.heading || content.title) as string,
      level: 2,
    }))
  }
  
  // Add text if present
  if (content.text) {
    blocks.push(createBlock<ParagraphBlock>("paragraph", {
      text: content.text as string,
    }))
  }
  
  // Add table if present
  if (content.headers && content.rows) {
    blocks.push(createBlock<TableBlock>("table", {
      headers: content.headers as string[],
      rows: content.rows as string[][],
    }))
  }
  
  // Add list if present
  if (content.items && Array.isArray(content.items)) {
    blocks.push(createBlock<ListBlock>("list", {
      items: content.items as string[],
      listType: "bullet",
    }))
  }
  
  return blocks
}
