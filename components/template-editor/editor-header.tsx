"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Users, ChevronDown, Eye, Download, MoreHorizontal, Check, X, Cloud, CloudOff, Loader2, Upload, FileText, FileIcon, History } from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import type { Proposal } from "@/lib/supabase/types"
import { exportDocument, downloadBlob, type ExportOptions } from "@/lib/document-exporter"

interface EditorHeaderProps {
  template: {
    id: string
    name: string
    status: "Draft" | "review" | "sent"
  }
  proposal?: Proposal | null
  onToggleRightSidebar: () => void
  showRightSidebar: boolean
  onUpdate?: (updates: Partial<Proposal>) => Promise<void>
  isLocal?: boolean
  onSaveToCloud?: () => Promise<void>
  isSavingToCloud?: boolean
  onShowVersionHistory?: () => void
}

export function EditorHeader({ template, proposal, onToggleRightSidebar, showRightSidebar, onUpdate, isLocal, onSaveToCloud, isSavingToCloud, onShowVersionHistory }: EditorHeaderProps) {
  const router = useRouter()
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(template.name)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleExport = async (format: "docx" | "pdf") => {
    if (!proposal) return
    
    setIsExporting(true)
    setShowExportMenu(false)

    try {
      const options: ExportOptions = {
        format,
        includeImages: true,
        includeMetadata: true,
      }

      const result = await exportDocument(proposal, options)

      if (result.success && result.blob && result.filename) {
        downloadBlob(result.blob, result.filename)
      } else if (result.success && format === "pdf") {
        // PDF uses print dialog, no blob needed
      } else if (result.error) {
        alert(`Export failed: ${result.error}`)
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleSaveName = async () => {
    if (editedName.trim() && editedName !== template.name && onUpdate) {
      await onUpdate({ name: editedName.trim() })
    }
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setEditedName(template.name)
    setIsEditingName(false)
  }

  return (
    <header className="h-14 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 flex-shrink-0 z-50">
      {/* Left: Back + Logo + Document Title */}
      <div className="flex items-center gap-3">
        <StyledButton
          variant="ghost"
          size="icon"
          onClick={() => router.push("/templates")}
          className="w-8 h-8 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </StyledButton>

        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName()
                  if (e.key === "Escape") handleCancelEdit()
                }}
                autoFocus
                className="font-semibold text-slate-800 text-sm px-2 py-1 border border-blue-300 rounded outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button onClick={handleSaveName} className="p-1 hover:bg-emerald-100 rounded text-emerald-600">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={handleCancelEdit} className="p-1 hover:bg-red-100 rounded text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-semibold text-slate-800 text-sm">{template.name}</h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <Pencil className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Center: Status + Storage Indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${template.status === "Draft" ? "bg-amber-500" : template.status === "sent" ? "bg-emerald-500" : "bg-blue-500"}`}
          />
          <span className="text-sm font-medium text-slate-600 capitalize">{template.status}</span>
        </div>
        
        {/* Storage Status */}
        {isLocal ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
            <CloudOff className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">Local Only</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
            <Cloud className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Synced</span>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Save to Cloud button - only for local proposals */}
        {isLocal && onSaveToCloud && (
          <button
            onClick={onSaveToCloud}
            disabled={isSavingToCloud}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium transition-all duration-200 shadow-sm"
          >
            {isSavingToCloud ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Save to Cloud</span>
              </>
            )}
          </button>
        )}
        
        {/* Collaborate button */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
          <Users className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Collaborate</span>
          <div className="flex -space-x-2 ml-1">
            {[
              { initials: "JD", color: "from-blue-500 to-cyan-500" },
              { initials: "MK", color: "from-emerald-500 to-teal-500" },
              { initials: "AS", color: "from-violet-500 to-purple-500" },
            ].map((user, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-[9px] font-semibold text-white border-2 border-white shadow-sm`}
              >
                {user.initials}
              </div>
            ))}
          </div>
        </button>

        {/* Preview button */}
        <button className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-all duration-200 shadow-sm">
          <Eye className="h-4 w-4 text-slate-500" />
        </button>

        {/* Version History button - only for local/template proposals */}
        {isLocal && onShowVersionHistory && (
          <button 
            onClick={onShowVersionHistory}
            className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-all duration-200 shadow-sm"
            title="Version History"
          >
            <History className="h-4 w-4 text-slate-500" />
          </button>
        )}

        {/* Download/Export button with dropdown */}
        <div className="relative" ref={exportMenuRef}>
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 text-slate-500 animate-spin" />
            ) : (
              <Download className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {/* Export Dropdown Menu */}
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Export As</p>
              </div>
              
              <button
                onClick={() => handleExport("docx")}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Word Document</p>
                  <p className="text-xs text-slate-400">.docx format</p>
                </div>
              </button>

              <button
                onClick={() => handleExport("pdf")}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileIcon className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">PDF Document</p>
                  <p className="text-xs text-slate-400">Print to PDF</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Share button */}
        <div className="flex rounded-lg overflow-hidden shadow-sm">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
            Share
          </button>
          <button className="px-2 py-2 bg-blue-600 hover:bg-blue-700 border-l border-blue-500 text-white transition-colors">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* More options */}
        <button className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
          <MoreHorizontal className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </header>
  )
}
