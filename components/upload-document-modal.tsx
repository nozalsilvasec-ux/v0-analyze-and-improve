"use client"

import React from "react"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  X,
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ImageIcon,
  Table2,
  Type,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { parseDocument, type ParseResult, type ExtractedImage } from "@/lib/document-parser"
import { createProposalFromUpload, saveLocalProposal } from "@/hooks/use-local-proposal"
import { 
  templateToProposal, 
  saveTemplateToStorage, 
  saveAssetsToStorage,
  type DocumentTemplate 
} from "@/lib/document-model"

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
}

type UploadState = "idle" | "dragging" | "parsing" | "success" | "error"

export function UploadDocumentModal({ isOpen, onClose }: UploadDocumentModalProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [state, setState] = useState<UploadState>("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [customTitle, setCustomTitle] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [parseProgress, setParseProgress] = useState(0)

  const resetState = () => {
    setState("idle")
    setSelectedFile(null)
    setParseResult(null)
    setCustomTitle("")
    setShowPreview(false)
    setParseProgress(0)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setState("dragging")
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setState("idle")
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setState("idle")
    
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const processFile = async (file: File) => {
    setSelectedFile(file)
    setState("parsing")
    setParseProgress(0)
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setParseProgress(prev => Math.min(prev + 10, 90))
    }, 200)
    
    const result = await parseDocument(file)
    
    clearInterval(progressInterval)
    setParseProgress(100)
    setParseResult(result)
    
    if (result.success) {
      setCustomTitle(result.data.title)
      setState("success")
    } else {
      setState("error")
    }
  }

  const handleContinue = () => {
    if (!parseResult?.success) return

    // IMPORTANT: We convert the uploaded document to our INTERNAL EDITABLE MODEL
    // The original file is NEVER returned as-is - it becomes a template source
    
    if (parseResult.template) {
      // New path: Use the fully converted template
      const template: DocumentTemplate = {
        ...parseResult.template,
        name: customTitle || parseResult.template.name,
      }
      
      // Save template to storage (for versioning and reuse)
      saveTemplateToStorage(template)
      
      // Save assets separately (images are linked, not embedded)
      if (parseResult.assets) {
        saveAssetsToStorage(parseResult.assets)
      }
      
      // Convert template to proposal format for the editor
      const proposal = templateToProposal(template, parseResult.assets || {})
      
      // Also save as local proposal for backward compatibility
      saveLocalProposal(proposal)
      
      // Navigate to editor with the template ID
      router.push(`/editor/${template.id}`)
    } else {
      // Fallback: Legacy path using sections directly
      const proposal = createProposalFromUpload(
        customTitle || parseResult.data.title,
        parseResult.data.sections
      )
      saveLocalProposal(proposal)
      router.push(`/editor/${proposal.id}`)
    }
    
    handleClose()
  }

  const getFileIcon = (file: File | null) => {
    if (!file) return <Upload className="h-12 w-12 text-slate-400" />
    
    const ext = file.name.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "pdf":
        return <FileText className="h-12 w-12 text-red-500" />
      case "docx":
      case "doc":
        return <FileSpreadsheet className="h-12 w-12 text-blue-500" />
      case "txt":
        return <File className="h-12 w-12 text-slate-500" />
      default:
        return <File className="h-12 w-12 text-slate-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Upload Document</h2>
              <p className="text-sm text-slate-500">Import a document to convert into a proposal</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Idle / Drag State */}
            {(state === "idle" || state === "dragging") && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${state === "dragging" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                  }
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.docx,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-4">
                  <div className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center transition-colors
                    ${state === "dragging" ? "bg-blue-100" : "bg-slate-100"}
                  `}>
                    <Upload className={`h-10 w-10 ${state === "dragging" ? "text-blue-500" : "text-slate-400"}`} />
                  </div>
                  
                  <div>
                    <p className="text-base font-medium text-slate-700 mb-1">
                      {state === "dragging" ? "Drop your file here" : "Drag and drop your file here"}
                    </p>
                    <p className="text-sm text-slate-500">
                      or <span className="text-blue-600 font-medium">browse</span> to select
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">PDF</span>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">DOCX</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">TXT</span>
                  </div>

                  <p className="text-xs text-slate-400">Maximum file size: 10MB</p>
                </div>
              </div>
            )}

            {/* Parsing State */}
            {state === "parsing" && selectedFile && (
              <div className="flex flex-col items-center gap-6 py-8">
                <div className="relative">
                  {getFileIcon(selectedFile)}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-slate-700 mb-1">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">Extracting content...</p>
                </div>

                <div className="w-full max-w-xs">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {state === "success" && selectedFile && parseResult?.success && (
              <div className="space-y-4">
                {/* File Info */}
                <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex-shrink-0">
                    {getFileIcon(selectedFile)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 truncate">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>

                {/* Extracted Content Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Type className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium text-slate-500">Sections</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-700">{parseResult.data.sections.length}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <ImageIcon className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-medium text-slate-500">Images</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-700">{parseResult.data.images?.length || 0}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Table2 className="h-4 w-4 text-purple-500" />
                      <span className="text-xs font-medium text-slate-500">Tables</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-700">{parseResult.data.structure?.tables?.length || 0}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <List className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-medium text-slate-500">Characters</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-700">{(parseResult.data.rawText.length / 1000).toFixed(1)}k</p>
                  </div>
                </div>

                {/* Preview Toggle */}
                {(parseResult.data.images?.length > 0 || parseResult.data.sections.length > 0) && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-600">Preview Extracted Content</span>
                    {showPreview ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </button>
                )}

                {/* Preview Content */}
                {showPreview && (
                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
                    {/* Images Preview */}
                    {parseResult.data.images && parseResult.data.images.length > 0 && (
                      <div className="p-3 border-b border-slate-200">
                        <p className="text-xs font-medium text-slate-500 mb-2">Extracted Images</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {parseResult.data.images.slice(0, 5).map((img: ExtractedImage, idx: number) => (
                            <div key={img.id} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              <img src={img.data || "/placeholder.svg"} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {parseResult.data.images.length > 5 && (
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-slate-500">+{parseResult.data.images.length - 5}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sections Preview */}
                    <div className="p-3">
                      <p className="text-xs font-medium text-slate-500 mb-2">Document Structure</p>
                      <div className="space-y-1">
                        {parseResult.data.sections.slice(0, 6).map((section, idx) => (
                          <div key={section.id} className="flex items-center gap-2 text-sm">
                            <span className="w-5 h-5 flex items-center justify-center bg-slate-200 rounded text-xs font-medium text-slate-600">
                              {idx + 1}
                            </span>
                            <span className="text-slate-600 truncate">
                              {section.type === "hero" ? (section.content.title as string) : (section.content.heading as string) || section.title}
                            </span>
                            <span className="text-xs text-slate-400 capitalize">{section.type}</span>
                          </div>
                        ))}
                        {parseResult.data.sections.length > 6 && (
                          <p className="text-xs text-slate-400 pl-7">+{parseResult.data.sections.length - 6} more sections</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Enter a title for your proposal"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Error State */}
            {state === "error" && parseResult && !parseResult.success && (
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700 mb-1">Upload Failed</p>
                    <p className="text-sm text-red-600">{parseResult.error.message}</p>
                  </div>
                </div>

                <button
                  onClick={resetState}
                  className="w-full py-3 px-4 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {state === "success" && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <button
                onClick={resetState}
                className="px-4 py-2.5 text-slate-600 font-medium hover:text-slate-800 transition-colors"
              >
                Upload Different File
              </button>
              
              <motion.button
                onClick={handleContinue}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Continue to Editor</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UploadDocumentModal
