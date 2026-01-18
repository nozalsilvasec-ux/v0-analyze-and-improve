"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  History,
  X,
  Clock,
  RotateCcw,
  Save,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  FileText,
} from "lucide-react"
import {
  type DocumentTemplate,
  type DocumentVersion,
  saveVersion,
  restoreVersion,
  saveTemplateToStorage,
  getTemplateFromStorage,
} from "@/lib/document-model"

interface VersionHistoryPanelProps {
  templateId: string
  isOpen: boolean
  onClose: () => void
  onVersionRestore: (template: DocumentTemplate) => void
}

export function VersionHistoryPanel({
  templateId,
  isOpen,
  onClose,
  onVersionRestore,
}: VersionHistoryPanelProps) {
  const [template, setTemplate] = useState<DocumentTemplate | null>(() =>
    getTemplateFromStorage(templateId)
  )
  const [savingVersion, setSavingVersion] = useState(false)
  const [versionName, setVersionName] = useState("")
  const [versionNotes, setVersionNotes] = useState("")
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)

  const handleSaveVersion = () => {
    if (!template) return

    setSavingVersion(true)
    const name = versionName.trim() || `Version ${template.version}`
    const notes = versionNotes.trim() || undefined

    const updatedTemplate = saveVersion(template, name, notes)
    saveTemplateToStorage(updatedTemplate)
    setTemplate(updatedTemplate)

    setVersionName("")
    setVersionNotes("")
    setShowSaveForm(false)
    setSavingVersion(false)
  }

  const handleRestoreVersion = (versionId: string) => {
    if (!template) return

    const restored = restoreVersion(template, versionId)
    if (restored) {
      saveTemplateToStorage(restored)
      setTemplate(restored)
      onVersionRestore(restored)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="h-full w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <History className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Version History</h2>
                <p className="text-sm text-slate-500">
                  {template?.versions.length || 0} saved versions
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Save New Version */}
          <div className="px-6 py-4 border-b border-slate-200">
            {!showSaveForm ? (
              <button
                onClick={() => setShowSaveForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Save Current Version</span>
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder={`Version ${template?.version || 1}`}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  value={versionNotes}
                  onChange={(e) => setVersionNotes(e.target.value)}
                  placeholder="Add notes (optional)"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSaveForm(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveVersion}
                    disabled={savingVersion}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                  >
                    {savingVersion ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Current Version Info */}
          <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Check className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-800">Current Version</p>
                <p className="text-xs text-emerald-600">
                  Version {template?.version || 1} - Last edited{" "}
                  {template ? formatDate(template.lastEditedAt) : "Never"}
                </p>
              </div>
            </div>
          </div>

          {/* Version List */}
          <div className="flex-1 overflow-y-auto">
            {template?.versions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium mb-1">No saved versions yet</p>
                <p className="text-sm text-slate-400">
                  Save a version to create a restore point you can come back to later.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {template?.versions
                  .slice()
                  .reverse()
                  .map((version) => (
                    <div key={version.id} className="px-6 py-4">
                      <button
                        onClick={() =>
                          setExpandedVersion(
                            expandedVersion === version.id ? null : version.id
                          )
                        }
                        className="w-full flex items-center gap-3 text-left"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {version.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(version.createdAt)}
                          </p>
                        </div>
                        {expandedVersion === version.id ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedVersion === version.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 pl-13 space-y-3">
                              {version.notes && (
                                <p className="text-sm text-slate-500 italic">
                                  "{version.notes}"
                                </p>
                              )}
                              <button
                                onClick={() => handleRestoreVersion(version.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm"
                              >
                                <RotateCcw className="h-4 w-4" />
                                <span>Restore this version</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 text-center">
              Versions are saved locally and will persist across sessions.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
