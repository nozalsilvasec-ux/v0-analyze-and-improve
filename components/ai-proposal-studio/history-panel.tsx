"use client"

import { motion } from "framer-motion"
import { X, Clock, TrendingUp, FileText } from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import type { HistoryEntry } from "./index"

interface HistoryPanelProps {
  history: HistoryEntry[]
  onSelect: (entry: HistoryEntry) => void
  onClose: () => void
}

export function HistoryPanel({ history, onSelect, onClose }: HistoryPanelProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-amber-600 bg-amber-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Analysis History</h2>
              <p className="text-sm text-slate-500">{history.length} recent analyses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No analysis history yet</p>
              <p className="text-sm text-slate-400 mt-1">Your recent analyses will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <motion.button
                  key={entry.id}
                  onClick={() => onSelect(entry)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 line-clamp-2 mb-2">{entry.content}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(entry.createdAt)}
                        </span>
                        {entry.improvement && (
                          <span className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            Improved
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getScoreColor(entry.analysis.overallScore)}`}
                    >
                      {entry.analysis.overallScore}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <StyledButton variant="outline" className="w-full" onClick={onClose}>
            Close
          </StyledButton>
        </div>
      </motion.div>
    </motion.div>
  )
}
