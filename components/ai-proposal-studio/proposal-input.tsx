"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { FileText, Upload, Loader2, File, CheckCircle2, AlertCircle, X } from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import { useCallback, useRef, useState } from "react"
import JSZip from "jszip"

interface ProposalInputProps {
  content: string
  onChange: (content: string) => void
  isAnalyzing: boolean
}

type UploadStatus = "idle" | "uploading" | "success" | "error"

interface UploadState {
  status: UploadStatus
  fileName?: string
  fileType?: string
  error?: string
}

async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(arrayBuffer)

  // Get the main document content
  const documentXml = zip.file("word/document.xml")
  if (!documentXml) {
    throw new Error("Invalid DOCX file: document.xml not found")
  }

  const xmlContent = await documentXml.async("string")

  // Extract text from <w:t> tags
  const textMatches: string[] = []
  const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g
  let match
  while ((match = regex.exec(xmlContent)) !== null) {
    if (match[1]) {
      textMatches.push(match[1])
    }
  }

  // Also check for paragraph breaks <w:p>
  // Split by paragraph markers to preserve structure
  let result = ""
  const paragraphs = xmlContent.split(/<w:p[^>]*>/)

  for (const paragraph of paragraphs) {
    const paraText: string[] = []
    const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g
    let textMatch
    while ((textMatch = textRegex.exec(paragraph)) !== null) {
      if (textMatch[1]) {
        paraText.push(textMatch[1])
      }
    }
    if (paraText.length > 0) {
      result += paraText.join("") + "\n"
    }
  }

  // Clean up result
  result = result
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim()

  if (!result || result.length < 10) {
    throw new Error("Could not extract text from DOCX file")
  }

  return result
}

export function ProposalInput({ content, onChange, isAnalyzing }: ProposalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" })

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Validate file type
      const supportedTypes = [
        "text/plain",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (!supportedTypes.includes(file.type)) {
        setUploadState({
          status: "error",
          fileName: file.name,
          error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
        })
        return
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setUploadState({
          status: "error",
          fileName: file.name,
          error: "File size exceeds 10MB limit.",
        })
        return
      }

      setUploadState({
        status: "uploading",
        fileName: file.name,
        fileType: file.type.includes("pdf") ? "PDF" : file.type.includes("word") ? "DOCX" : "TXT",
      })

      try {
        // For plain text, read directly
        if (file.type === "text/plain") {
          const text = await file.text()
          onChange(text)
          setUploadState({
            status: "success",
            fileName: file.name,
            fileType: "TXT",
          })
          setTimeout(() => setUploadState({ status: "idle" }), 3000)
          return
        }

        if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          try {
            const extractedText = await extractTextFromDOCX(file)
            onChange(extractedText)
            setUploadState({
              status: "success",
              fileName: file.name,
              fileType: "DOCX",
            })
            setTimeout(() => setUploadState({ status: "idle" }), 3000)
            return
          } catch (docxError) {
            console.error("DOCX extraction error:", docxError)
            setUploadState({
              status: "error",
              fileName: file.name,
              error: "Could not extract text from DOCX. Please try copying and pasting the text directly.",
            })
            return
          }
        }

        // For PDF, use the server-side extraction API
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/studio/extract", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to extract text from file")
        }

        onChange(data.text)
        setUploadState({
          status: "success",
          fileName: file.name,
          fileType: data.fileType?.toUpperCase(),
        })

        setTimeout(() => setUploadState({ status: "idle" }), 3000)
      } catch (error) {
        setUploadState({
          status: "error",
          fileName: file.name,
          error: error instanceof Error ? error.message : "Failed to process file",
        })
      }
    },
    [onChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFileUpload(file)
    },
    [handleFileUpload],
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const text = e.clipboardData.getData("text")
      if (text) {
        onChange(text)
      }
    },
    [onChange],
  )

  const clearUploadState = () => setUploadState({ status: "idle" })

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const charCount = content.length

  const isProcessing = uploadState.status === "uploading" || isAnalyzing

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card-primary overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Proposal</h2>
            <p className="text-sm text-slate-500">Paste, type, or upload your proposal content</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">PDF, DOCX, TXT</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <StyledButton
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            {uploadState.status === "uploading" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </>
            )}
          </StyledButton>
        </div>
      </div>

      <AnimatePresence>
        {uploadState.status !== "idle" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className={`px-6 py-3 flex items-center justify-between ${
                uploadState.status === "uploading"
                  ? "bg-blue-50 border-b border-blue-100"
                  : uploadState.status === "success"
                    ? "bg-green-50 border-b border-green-100"
                    : "bg-red-50 border-b border-red-100"
              }`}
            >
              <div className="flex items-center gap-3">
                {uploadState.status === "uploading" && (
                  <>
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    <span className="text-sm text-blue-700">
                      Extracting text from <strong>{uploadState.fileName}</strong>...
                    </span>
                  </>
                )}
                {uploadState.status === "success" && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Successfully loaded <strong>{uploadState.fileName}</strong> ({uploadState.fileType})
                    </span>
                  </>
                )}
                {uploadState.status === "error" && (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{uploadState.error}</span>
                  </>
                )}
              </div>
              {(uploadState.status === "success" || uploadState.status === "error") && (
                <button onClick={clearUploadState} className="p-1 hover:bg-black/5 rounded transition-colors">
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Area with drag & drop zone */}
      <div className="relative" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-700">
                {uploadState.status === "uploading"
                  ? `Extracting text from ${uploadState.fileType || "file"}...`
                  : "Analyzing your proposal..."}
              </p>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste your proposal here, drag and drop a file, or click 'Upload File' above...

Supported formats: PDF, DOCX, TXT (up to 10MB)

Example:
Dear [Client Name],

We are pleased to submit this proposal for your consideration. Our team has extensive experience in delivering high-quality solutions that meet and exceed client expectations.

Project Overview:
We propose to develop a comprehensive solution that addresses your key business challenges..."
          className="w-full min-h-[400px] p-6 text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none text-[15px] leading-relaxed"
          disabled={isProcessing}
        />

        {!content && !isProcessing && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute inset-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50/50">
              <div className="text-center">
                <File className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Drop your file here</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>{wordCount.toLocaleString()} words</span>
          <span className="text-slate-300">|</span>
          <span>{charCount.toLocaleString()} characters</span>
        </div>
        <div className="text-sm">
          {charCount < 50 ? (
            <span className="text-amber-600">Minimum 50 characters required</span>
          ) : (
            <span className="text-green-600">Ready to analyze</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
