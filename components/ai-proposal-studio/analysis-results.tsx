"use client"

import { motion } from "framer-motion"
import { BarChart3, FileSearch } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export function AnalysisResults() {
  return (
    <motion.div
      className="card-primary overflow-hidden flex-1"
      whileHover={{ boxShadow: "0 8px 30px rgba(15, 23, 42, 0.12)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-900/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Analysis Results</h3>
        </div>
        {/* Progress Indicator */}
        <div className="flex gap-1">
          <motion.div
            className="w-8 h-1 rounded-full bg-slate-900"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <div className="w-8 h-1 rounded-full bg-slate-900/20" />
        </div>
      </div>

      <motion.div
        className="min-h-[320px] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <EmptyState
          icon={<FileSearch className="h-8 w-8 text-slate-400" />}
          title="Ready for analysis"
          description="Upload a document above to see detailed improvements and suggestions here."
        />
      </motion.div>
    </motion.div>
  )
}
