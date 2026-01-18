"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, ArrowRight, RotateCcw, Copy, Check, TrendingUp, FileText, GitCompare, Award } from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import { TextCompare } from "@/components/ui/text-compare"
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import type { AnalysisResult, ImprovementResult } from "./index"

interface ImprovementPanelProps {
  original: string
  improvement: ImprovementResult
  analysis: AnalysisResult
  onAccept: () => void
  onReset: () => void
}

export function ImprovementPanel({ original, improvement, analysis, onAccept, onReset }: ImprovementPanelProps) {
  const [viewMode, setViewMode] = useState<"improved" | "comparison" | "changes">("improved")
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(improvement.improvedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <HeroHighlight containerClassName="border border-slate-200 shadow-lg" className="p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/40 p-4">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-md"
            >
              <Award className="h-3.5 w-3.5 text-emerald-600" />
            </motion.div>
          </motion.div>
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-slate-900"
            >
              Proposal <Highlight>Enhanced</Highlight>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 mt-1 text-lg"
            >
              Your content has been professionally refined and optimized
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-right bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-8 py-5 rounded-2xl border border-emerald-200 shadow-inner"
          >
            <div className="flex items-center justify-end gap-2 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
              <span className="text-4xl font-black">+{improvement.overallImprovement}%</span>
            </div>
            <p className="text-sm text-emerald-600/80 font-semibold mt-1">quality improvement</p>
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {improvement.keyImprovements.map((imp, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 300 }}
              className="px-5 py-2.5 bg-white/80 backdrop-blur-sm text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200 shadow-sm hover:shadow-md hover:bg-white transition-all cursor-default"
            >
              <CheckCircle2 className="h-4 w-4 inline mr-2 text-emerald-500" />
              {imp}
            </motion.span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 p-2 bg-slate-100/80 backdrop-blur-sm rounded-2xl mb-6 border border-slate-200">
          {[
            { id: "improved", label: "Improved", icon: FileText },
            { id: "comparison", label: "Compare", icon: GitCompare },
            { id: "changes", label: "Changes", icon: ArrowRight },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as typeof viewMode)}
              className={`flex-1 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                viewMode === tab.id
                  ? "bg-white text-slate-900 shadow-lg ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
            >
              <tab.icon className="h-4 w-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Views */}
        <AnimatePresence mode="wait">
          {viewMode === "improved" && (
            <motion.div
              key="improved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 max-h-[500px] overflow-y-auto border border-slate-200 shadow-inner"
            >
              <TextGenerateEffect
                words={improvement.improvedContent}
                className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans"
                duration={0.2}
              />
            </motion.div>
          )}

          {viewMode === "comparison" && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TextCompare
                originalText={original}
                improvedText={improvement.improvedContent}
                className="h-[500px]"
                initialSliderPercentage={50}
                slideMode="drag"
                originalLabel="Original Proposal"
                improvedLabel="Enhanced Proposal"
              />
              <p className="text-center text-sm text-slate-500 mt-4 font-medium">
                Drag the slider to compare original and improved versions
              </p>
            </motion.div>
          )}

          {viewMode === "changes" && (
            <motion.div
              key="changes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
            >
              {improvement.changes.map((change, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-4 py-1.5 text-xs rounded-full font-bold uppercase tracking-wide ${
                        change.type === "addition"
                          ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                          : change.type === "removal"
                            ? "bg-red-100 text-red-700 ring-1 ring-red-200"
                            : "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                      }`}
                    >
                      {change.type}
                    </span>
                    <span className="text-sm text-slate-600 font-medium flex-1">{change.reason}</span>
                  </div>
                  {change.type !== "addition" && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 mb-3 border border-red-100">
                      <p className="text-sm text-red-700 line-through opacity-75">{change.original}</p>
                    </div>
                  )}
                  {change.type !== "removal" && (
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                      <p className="text-sm text-emerald-700 font-medium">{change.improved}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4 pt-8 mt-8 border-t border-slate-200">
          <StyledButton variant="connect" className="flex-1 h-14 text-base" onClick={onAccept}>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Accept & Continue Editing
            </span>
          </StyledButton>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="h-14 w-14 rounded-xl bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition-all duration-200"
            title="Copy improved text"
          >
            {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5 text-slate-600" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, rotate: -180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={onReset}
            className="h-14 w-14 rounded-xl bg-slate-100 hover:bg-red-100 border border-slate-200 hover:border-red-300 flex items-center justify-center transition-colors duration-200"
            title="Reset and start over"
          >
            <RotateCcw className="h-5 w-5 text-slate-600" />
          </motion.button>
        </div>
      </HeroHighlight>
    </motion.div>
  )
}
