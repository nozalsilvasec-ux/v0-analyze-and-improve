"use client"

import { motion } from "framer-motion"
import { Sliders, ArrowRight, FileText, Loader2, History } from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox-group"

interface SettingsSidebarProps {
  selectedTone: "formal" | "persuasive" | "executive"
  onToneChange: (tone: "formal" | "persuasive" | "executive") => void
  optimizationGoals: {
    clarity: boolean
    persuasion: boolean
    readability: boolean
    legalRisk: boolean
  }
  onToggleGoal: (goal: keyof SettingsSidebarProps["optimizationGoals"]) => void
  onAnalyze: () => void
  isAnalyzing: boolean
  hasContent: boolean
  currentStep: string
  onShowHistory?: () => void
  historyCount?: number
}

export function SettingsSidebar({
  selectedTone,
  onToneChange,
  optimizationGoals,
  onToggleGoal,
  onAnalyze,
  isAnalyzing,
  hasContent,
  currentStep,
  onShowHistory,
  historyCount = 0,
}: SettingsSidebarProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  const isDisabled = !hasContent || isAnalyzing || currentStep !== "input"

  return (
    <motion.div
      className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-6 sticky top-28"
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
            <Sliders className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Analysis Settings</h3>
            <p className="text-xs text-slate-500">Configure preferences</p>
          </div>
        </div>

        {/* History Button */}
        {onShowHistory && (
          <motion.button
            onClick={onShowHistory}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            title="View History"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <History className="h-5 w-5 text-slate-600" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-violet-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg">
                {historyCount}
              </span>
            )}
          </motion.button>
        )}
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Tone Profile */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
            Tone Profile
          </label>
          <RadioGroup
            value={selectedTone}
            onValueChange={(v) => onToneChange(v as typeof selectedTone)}
            className="gap-2"
          >
            <RadioGroupItem value="formal" label="Formal" />
            <RadioGroupItem value="persuasive" label="Persuasive" />
            <RadioGroupItem value="executive" label="Executive" />
          </RadioGroup>
        </motion.div>

        {/* Optimization Goals */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
            Optimization Goals
          </label>
          <div className="flex flex-col gap-3">
            <Checkbox
              id="clarity"
              checked={optimizationGoals.clarity}
              onCheckedChange={() => onToggleGoal("clarity")}
              label="Clarity & Conciseness"
            />
            <Checkbox
              id="persuasion"
              checked={optimizationGoals.persuasion}
              onCheckedChange={() => onToggleGoal("persuasion")}
              label="Persuasion Power"
            />
            <Checkbox
              id="readability"
              checked={optimizationGoals.readability}
              onCheckedChange={() => onToggleGoal("readability")}
              label="Readability Score"
            />
            <Checkbox
              id="legalRisk"
              checked={optimizationGoals.legalRisk}
              onCheckedChange={() => onToggleGoal("legalRisk")}
              label="Legal Risk Check"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <StyledButton variant="connect" className="w-full h-14" onClick={onAnalyze} disabled={isDisabled}>
            <span className="flex items-center gap-2 text-base font-semibold">
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5" />
                  Analyze Proposal
                </>
              )}
            </span>
          </StyledButton>
          <p className="text-xs text-slate-500 text-center mt-3 font-medium">
            {hasContent ? "Uses 1 credit per analysis" : "Enter content to enable"}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-200/60">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Pro Tip</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Include your full proposal with executive summary, scope, and pricing for best results.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
