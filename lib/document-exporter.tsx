import type { Proposal, Section } from "@/lib/supabase/types"
import JSZip from "jszip"

export interface ExportOptions {
  format: "docx" | "pdf"
  includeImages: boolean
  includeMetadata: boolean
}

export interface ExportResult {
  success: boolean
  blob?: Blob
  filename?: string
  error?: string
}

// Main export function
export const exportDocument = async (
  proposal: Proposal,
  options: ExportOptions
): Promise<ExportResult> => {
  try {
    if (options.format === "docx") {
      return await exportToDocx(proposal, options)
    } else if (options.format === "pdf") {
      return await exportToPdf(proposal, options)
    }
    
    return { success: false, error: "Unsupported format" }
  } catch (error) {
    console.error("Export error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Export failed" 
    }
  }
}

// Export to DOCX format
const exportToDocx = async (
  proposal: Proposal,
  options: ExportOptions
): Promise<ExportResult> => {
  const zip = new JSZip()
  const sections = (proposal.content?.sections || []) as Section[]
  
  // Create document.xml content
  const documentXml = generateDocumentXml(proposal, sections, options)
  
  // Create relationships
  const { relsXml, contentTypesXml, mediaFiles } = await generateDocxRelationships(
    sections, 
    options.includeImages
  )
  
  // Create core.xml for metadata
  const coreXml = generateCoreXml(proposal, options.includeMetadata)
  
  // Create app.xml
  const appXml = generateAppXml()
  
  // Create styles.xml
  const stylesXml = generateStylesXml()
  
  // Create settings.xml
  const settingsXml = generateSettingsXml()
  
  // Create numbering.xml for lists
  const numberingXml = generateNumberingXml()
  
  // Create the DOCX structure
  zip.file("[Content_Types].xml", contentTypesXml)
  zip.file("_rels/.rels", generateRootRels())
  zip.file("docProps/core.xml", coreXml)
  zip.file("docProps/app.xml", appXml)
  zip.file("word/document.xml", documentXml)
  zip.file("word/_rels/document.xml.rels", relsXml)
  zip.file("word/styles.xml", stylesXml)
  zip.file("word/settings.xml", settingsXml)
  zip.file("word/numbering.xml", numberingXml)
  
  // Add media files (images)
  for (const [filename, data] of Object.entries(mediaFiles)) {
    zip.file(`word/media/${filename}`, data, { base64: true })
  }
  
  // Generate the DOCX file
  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
  
  const filename = `${sanitizeFilename(proposal.name || "proposal")}.docx`
  
  return { success: true, blob, filename }
}

// Generate document.xml
const generateDocumentXml = (
  proposal: Proposal, 
  sections: Section[],
  options: ExportOptions
): string => {
  let body = ""
  let imageCounter = 1
  
  for (const section of sections) {
    switch (section.type) {
      case "hero":
        body += generateHeroParagraphs(section.content)
        break
      case "text":
        body += generateTextParagraphs(section.content)
        break
      case "image":
        if (options.includeImages) {
          body += generateImageParagraph(section.content, imageCounter++)
        }
        break
      case "table":
        body += generateTable(section.content)
        break
      case "quote":
        body += generateQuoteParagraph(section.content)
        break
      case "pricing":
        body += generatePricingTable(section.content)
        break
      default:
        // Generic text handling for other section types
        if (section.content?.text) {
          body += generateTextParagraphs({ heading: section.title, text: section.content.text })
        }
    }
  }
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
            xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720"/>
    </w:sectPr>
  </w:body>
</w:document>`
}

// Generate hero section paragraphs
const generateHeroParagraphs = (content: Record<string, unknown>): string => {
  const title = escapeXml(String(content.title || ""))
  const subtitle = escapeXml(String(content.subtitle || ""))
  
  return `
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Title"/>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="72"/>
        </w:rPr>
        <w:t>${title}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Subtitle"/>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="32"/>
          <w:color w:val="666666"/>
        </w:rPr>
        <w:t>${subtitle}</w:t>
      </w:r>
    </w:p>
    <w:p/>`
}

// Generate text section paragraphs
const generateTextParagraphs = (content: Record<string, unknown>): string => {
  const heading = escapeXml(String(content.heading || ""))
  const text = String(content.text || "")
  
  let xml = ""
  
  // Add heading
  if (heading) {
    xml += `
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="28"/>
        </w:rPr>
        <w:t>${heading}</w:t>
      </w:r>
    </w:p>`
  }
  
  // Add text paragraphs
  const paragraphs = text.split("\n\n").filter(p => p.trim())
  for (const para of paragraphs) {
    const lines = para.split("\n")
    for (const line of lines) {
      // Check if it's a bullet point
      if (/^[-*•]\s/.test(line)) {
        xml += `
    <w:p>
      <w:pPr>
        <w:pStyle w:val="ListParagraph"/>
        <w:numPr>
          <w:ilvl w:val="0"/>
          <w:numId w:val="1"/>
        </w:numPr>
      </w:pPr>
      <w:r>
        <w:t>${escapeXml(line.replace(/^[-*•]\s*/, ""))}</w:t>
      </w:r>
    </w:p>`
      } else {
        xml += `
    <w:p>
      <w:r>
        <w:t>${escapeXml(line)}</w:t>
      </w:r>
    </w:p>`
      }
    }
  }
  
  // Add spacing
  xml += "<w:p/>"
  
  return xml
}

// Generate image paragraph
const generateImageParagraph = (content: Record<string, unknown>, imageId: number): string => {
  const caption = escapeXml(String(content.caption || ""))
  
  // Image dimensions (in EMUs - 1 inch = 914400 EMUs)
  const width = 5486400 // ~6 inches
  const height = 3200400 // ~3.5 inches
  
  return `
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:drawing>
          <wp:inline distT="0" distB="0" distL="0" distR="0">
            <wp:extent cx="${width}" cy="${height}"/>
            <wp:docPr id="${imageId}" name="Image ${imageId}"/>
            <a:graphic>
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:pic>
                  <pic:nvPicPr>
                    <pic:cNvPr id="${imageId}" name="Image ${imageId}"/>
                    <pic:cNvPicPr/>
                  </pic:nvPicPr>
                  <pic:blipFill>
                    <a:blip r:embed="rId${imageId + 10}"/>
                    <a:stretch>
                      <a:fillRect/>
                    </a:stretch>
                  </pic:blipFill>
                  <pic:spPr>
                    <a:xfrm>
                      <a:off x="0" y="0"/>
                      <a:ext cx="${width}" cy="${height}"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect"/>
                  </pic:spPr>
                </pic:pic>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>
    ${caption ? `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:sz w:val="20"/></w:rPr><w:t>${caption}</w:t></w:r></w:p>` : ""}
    <w:p/>`
}

// Generate table
const generateTable = (content: Record<string, unknown>): string => {
  const headers = (content.headers || []) as string[]
  const rows = (content.rows || []) as string[][]
  const title = escapeXml(String(content.title || ""))
  
  let xml = ""
  
  if (title) {
    xml += `
    <w:p>
      <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
      <w:r><w:rPr><w:b/></w:rPr><w:t>${title}</w:t></w:r>
    </w:p>`
  }
  
  xml += `
    <w:tbl>
      <w:tblPr>
        <w:tblStyle w:val="TableGrid"/>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="4" w:color="000000"/>
          <w:left w:val="single" w:sz="4" w:color="000000"/>
          <w:bottom w:val="single" w:sz="4" w:color="000000"/>
          <w:right w:val="single" w:sz="4" w:color="000000"/>
          <w:insideH w:val="single" w:sz="4" w:color="000000"/>
          <w:insideV w:val="single" w:sz="4" w:color="000000"/>
        </w:tblBorders>
      </w:tblPr>`
  
  // Header row
  if (headers.length > 0) {
    xml += `
      <w:tr>
        ${headers.map(h => `
        <w:tc>
          <w:tcPr><w:shd w:fill="E7E6E6"/></w:tcPr>
          <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(h)}</w:t></w:r></w:p>
        </w:tc>`).join("")}
      </w:tr>`
  }
  
  // Data rows
  for (const row of rows) {
    xml += `
      <w:tr>
        ${row.map(cell => `
        <w:tc>
          <w:p><w:r><w:t>${escapeXml(cell)}</w:t></w:r></w:p>
        </w:tc>`).join("")}
      </w:tr>`
  }
  
  xml += `
    </w:tbl>
    <w:p/>`
  
  return xml
}

// Generate quote paragraph
const generateQuoteParagraph = (content: Record<string, unknown>): string => {
  const text = escapeXml(String(content.text || ""))
  const author = escapeXml(String(content.author || ""))
  const role = escapeXml(String(content.role || ""))
  
  return `
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Quote"/>
        <w:ind w:left="720" w:right="720"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:i/>
          <w:sz w:val="28"/>
        </w:rPr>
        <w:t>"${text}"</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="right"/>
        <w:ind w:right="720"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>— ${author}${role ? `, ${role}` : ""}</w:t>
      </w:r>
    </w:p>
    <w:p/>`
}

// Generate pricing table
const generatePricingTable = (content: Record<string, unknown>): string => {
  const title = escapeXml(String(content.title || "Pricing"))
  const items = (content.items || []) as Array<{ name: string; price: string; description?: string }>
  
  let xml = `
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:rPr><w:b/></w:rPr><w:t>${title}</w:t></w:r>
    </w:p>
    <w:tbl>
      <w:tblPr>
        <w:tblStyle w:val="TableGrid"/>
        <w:tblW w:w="5000" w:type="pct"/>
      </w:tblPr>
      <w:tr>
        <w:tc><w:tcPr><w:shd w:fill="E7E6E6"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Package</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:shd w:fill="E7E6E6"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Price</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:shd w:fill="E7E6E6"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Description</w:t></w:r></w:p></w:tc>
      </w:tr>`
  
  for (const item of items) {
    xml += `
      <w:tr>
        <w:tc><w:p><w:r><w:t>${escapeXml(item.name)}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${escapeXml(item.price)}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>${escapeXml(item.description || "")}</w:t></w:r></w:p></w:tc>
      </w:tr>`
  }
  
  xml += `
    </w:tbl>
    <w:p/>`
  
  return xml
}

// Generate DOCX relationships
const generateDocxRelationships = async (
  sections: Section[],
  includeImages: boolean
): Promise<{ relsXml: string; contentTypesXml: string; mediaFiles: Record<string, string> }> => {
  const mediaFiles: Record<string, string> = {}
  let relationships = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>`
  
  let imageExtensions = new Set<string>()
  let imageId = 11
  
  if (includeImages) {
    for (const section of sections) {
      if (section.type === "image" && section.content?.src) {
        const src = String(section.content.src)
        
        // Handle base64 images
        if (src.startsWith("data:image/")) {
          const match = src.match(/data:image\/(\w+);base64,(.+)/)
          if (match) {
            const ext = match[1] === "jpeg" ? "jpg" : match[1]
            const data = match[2]
            const filename = `image${imageId - 10}.${ext}`
            
            mediaFiles[filename] = data
            imageExtensions.add(ext)
            
            relationships += `
  <Relationship Id="rId${imageId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${filename}"/>`
            imageId++
          }
        }
      }
    }
  }
  
  relationships += `
</Relationships>`
  
  // Generate content types
  let contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>`
  
  for (const ext of imageExtensions) {
    const mimeType = ext === "jpg" ? "image/jpeg" : `image/${ext}`
    contentTypes += `
  <Default Extension="${ext}" ContentType="${mimeType}"/>`
  }
  
  contentTypes += `
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`
  
  return { relsXml: relationships, contentTypesXml: contentTypes, mediaFiles }
}

// Generate core.xml
const generateCoreXml = (proposal: Proposal, includeMetadata: boolean): string => {
  const now = new Date().toISOString()
  const title = escapeXml(proposal.name || "Proposal")
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
                   xmlns:dc="http://purl.org/dc/elements/1.1/"
                   xmlns:dcterms="http://purl.org/dc/terms/"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${title}</dc:title>
  ${includeMetadata ? `<dc:creator>LightNote AI</dc:creator>` : ""}
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`
}

// Generate app.xml
const generateAppXml = (): string => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>LightNote AI</Application>
  <AppVersion>1.0</AppVersion>
</Properties>`
}

// Generate styles.xml
const generateStylesXml = (): string => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
        <w:sz w:val="22"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:pPr><w:spacing w:after="200"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="72"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:pPr><w:spacing w:after="400"/></w:pPr>
    <w:rPr><w:sz w:val="32"/><w:color w:val="666666"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="Heading 1"/>
    <w:pPr><w:spacing w:before="400" w:after="200"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="32"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="Heading 2"/>
    <w:pPr><w:spacing w:before="200" w:after="100"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="28"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Quote">
    <w:name w:val="Quote"/>
    <w:pPr><w:spacing w:before="200" w:after="200"/></w:pPr>
    <w:rPr><w:i/><w:sz w:val="28"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="ListParagraph">
    <w:name w:val="List Paragraph"/>
    <w:pPr><w:ind w:left="720"/></w:pPr>
  </w:style>
  <w:style w:type="table" w:styleId="TableGrid">
    <w:name w:val="Table Grid"/>
  </w:style>
</w:styles>`
}

// Generate settings.xml
const generateSettingsXml = (): string => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
  <w:characterSpacingControl w:val="doNotCompress"/>
</w:settings>`
}

// Generate numbering.xml
const generateNumberingXml = (): string => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/>
      <w:numFmt w:val="bullet"/>
      <w:lvlText w:val="•"/>
      <w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1">
    <w:abstractNumId w:val="0"/>
  </w:num>
</w:numbering>`
}

// Generate root .rels
const generateRootRels = (): string => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`
}

// Export to PDF (uses browser print API)
const exportToPdf = async (
  proposal: Proposal,
  options: ExportOptions
): Promise<ExportResult> => {
  // For PDF export, we'll generate HTML and use the browser's print functionality
  // This provides the best cross-browser compatibility
  const sections = (proposal.content?.sections || []) as Section[]
  const html = generatePdfHtml(proposal, sections, options)
  
  // Create a hidden iframe for printing
  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.right = "0"
  iframe.style.bottom = "0"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "none"
  document.body.appendChild(iframe)
  
  const iframeDoc = iframe.contentWindow?.document
  if (!iframeDoc) {
    document.body.removeChild(iframe)
    return { success: false, error: "Could not create print frame" }
  }
  
  iframeDoc.open()
  iframeDoc.write(html)
  iframeDoc.close()
  
  // Wait for images to load
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Trigger print
  iframe.contentWindow?.print()
  
  // Clean up after print dialog
  setTimeout(() => {
    document.body.removeChild(iframe)
  }, 1000)
  
  return { 
    success: true, 
    filename: `${sanitizeFilename(proposal.name || "proposal")}.pdf` 
  }
}

// Generate HTML for PDF export
const generatePdfHtml = (
  proposal: Proposal,
  sections: Section[],
  options: ExportOptions
): string => {
  let body = ""
  
  for (const section of sections) {
    switch (section.type) {
      case "hero":
        body += `
          <div class="hero">
            <h1>${escapeHtml(String(section.content.title || ""))}</h1>
            <p class="subtitle">${escapeHtml(String(section.content.subtitle || ""))}</p>
          </div>`
        break
      case "text":
        body += `
          <div class="section">
            <h2>${escapeHtml(String(section.content.heading || ""))}</h2>
            <p>${escapeHtml(String(section.content.text || "")).replace(/\n/g, "<br>")}</p>
          </div>`
        break
      case "image":
        if (options.includeImages && section.content.src) {
          body += `
            <div class="image-section">
              <img src="${section.content.src}" alt="${escapeHtml(String(section.content.alt || ""))}">
              ${section.content.caption ? `<p class="caption">${escapeHtml(String(section.content.caption))}</p>` : ""}
            </div>`
        }
        break
      case "quote":
        body += `
          <blockquote>
            <p>"${escapeHtml(String(section.content.text || ""))}"</p>
            <cite>— ${escapeHtml(String(section.content.author || ""))}${section.content.role ? `, ${escapeHtml(String(section.content.role))}` : ""}</cite>
          </blockquote>`
        break
      case "table":
        const headers = (section.content.headers || []) as string[]
        const rows = (section.content.rows || []) as string[][]
        body += `
          <div class="table-section">
            ${section.content.title ? `<h3>${escapeHtml(String(section.content.title))}</h3>` : ""}
            <table>
              <thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
              <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
            </table>
          </div>`
        break
    }
  }
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(proposal.name || "Proposal")}</title>
  <style>
    @media print {
      @page { margin: 1in; }
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .hero {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #eee;
    }
    .hero h1 {
      font-size: 36px;
      margin-bottom: 10px;
    }
    .hero .subtitle {
      font-size: 18px;
      color: #666;
    }
    .section {
      margin-bottom: 30px;
    }
    h2 {
      font-size: 24px;
      color: #222;
      margin-bottom: 15px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }
    h3 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    .image-section {
      text-align: center;
      margin: 30px 0;
    }
    .image-section img {
      max-width: 100%;
      height: auto;
    }
    .caption {
      font-style: italic;
      color: #666;
      margin-top: 10px;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 20px;
      margin: 30px 0;
      font-style: italic;
    }
    blockquote cite {
      display: block;
      margin-top: 10px;
      font-style: normal;
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #f5f5f5;
      font-weight: bold;
    }
  </style>
</head>
<body>
  ${body}
</body>
</html>`
}

// Helper functions
const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

const sanitizeFilename = (name: string): string => {
  return name
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 100)
}

// Download helper
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default exportDocument
