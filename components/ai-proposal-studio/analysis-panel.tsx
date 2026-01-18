"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Target,
  TrendingUp,
  BookOpen,
  Award,
  FileText,
  ChevronRight,
} from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import { cn } from "@/lib/utils"
import type { AnalysisResult } from "./index"

interface AnalysisPanelProps {
  analysis: AnalysisResult
  isImproving: boolean
  onImprove: () => void
  onReset: () => void
  proposalText?: string
}

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)] pointer-events-none"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "30%",
      }}
    />
  )
}

const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode
  containerClassName?: string
  className?: string
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (clientX - (rect.left + rect.width / 2)) / 20
    const y = (clientY - (rect.top + rect.height / 2)) / 20
    setMousePosition({ x, y })
  }

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={cn("mx-auto w-full relative rounded-2xl overflow-hidden", containerClassName)}
    >
      <div
        className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
        }}
      >
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.1s ease-out",
          }}
          className={cn("h-full px-6 py-8 sm:px-8 sm:py-10", className)}
        >
          <Noise />
          {children}
        </motion.div>
      </div>
    </motion.section>
  )
}

const ScoreCard = ({
  label,
  score,
  icon: Icon,
  gradientFrom,
  gradientTo,
}: {
  label: string
  score: number
  icon: React.ElementType
  gradientFrom: string
  gradientTo: string
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-300"
    if (score >= 60) return "text-amber-300"
    return "text-rose-300"
  }

  return (
    <WobbleCard containerClassName={`bg-gradient-to-br ${gradientFrom} ${gradientTo}`}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white/90">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-4xl font-bold tracking-tight", getScoreColor(score))}>{score}</span>
          <span className="text-white/50 text-base">/100</span>
        </div>
        <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-white/80"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </div>
      </div>
    </WobbleCard>
  )
}

const IssueItem = ({
  issue,
}: {
  issue: AnalysisResult["issues"][0]
}) => {
  const getIssueStyles = (type: string) => {
    switch (type) {
      case "critical":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200",
          icon: AlertCircle,
          iconBg: "bg-rose-100",
          iconColor: "text-rose-600",
          badge: "bg-rose-100 text-rose-700",
        }
      case "warning":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: AlertTriangle,
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          badge: "bg-amber-100 text-amber-700",
        }
      default:
        return {
          bg: "bg-sky-50",
          border: "border-sky-200",
          icon: Lightbulb,
          iconBg: "bg-sky-100",
          iconColor: "text-sky-600",
          badge: "bg-sky-100 text-sky-700",
        }
    }
  }

  const styles = getIssueStyles(issue.type)
  const Icon = styles.icon

  return (
    <motion.div
      className={cn(styles.bg, styles.border, "border rounded-xl p-4")}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", styles.iconBg)}>
          <Icon className={cn("h-5 w-5", styles.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h4 className="font-semibold text-slate-900">{issue.title}</h4>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold", styles.badge)}>
              {issue.category}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{issue.description}</p>
          {issue.location && <p className="text-xs text-slate-400 mt-2 font-medium">Location: {issue.location}</p>}
        </div>
      </div>
    </motion.div>
  )
}

export function AnalysisPanel({ analysis, isImproving, onImprove, onReset, proposalText }: AnalysisPanelProps) {
  const criticalCount = analysis.issues.filter((i) => i.type === "critical").length
  const warningCount = analysis.issues.filter((i) => i.type === "warning").length
  const suggestionCount = analysis.issues.filter((i) => i.type === "suggestion").length

  const previewText = proposalText?.substring(0, 200) || "Your proposal content will be displayed here..."

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <WobbleCard containerClassName="bg-gradient-to-br from-pink-800 via-fuchsia-800 to-purple-900 min-h-[300px]">
        <div className="relative z-10 flex flex-col lg:flex-row gap-8">
          {/* Left content */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white max-w-xl tracking-tight leading-tight">
              Your proposal scored{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                {analysis.overallScore}
              </span>{" "}
              out of 100
            </h2>
            <p className="text-base md:text-lg text-white/70 mt-4 max-w-lg leading-relaxed">
              {analysis.summary.substring(0, 150)}...
            </p>

            {/* Quick stats */}
            <div className="flex items-center gap-4 mt-6">
              {criticalCount > 0 && (
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full font-medium border border-white/20">
                  {criticalCount} Critical Issues
                </span>
              )}
              {warningCount > 0 && (
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full font-medium border border-white/20">
                  {warningCount} Warnings
                </span>
              )}
            </div>
          </div>

          {/* Right - Proposal Preview Image/Card */}
          <div className="lg:w-[300px] flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                <FileText className="h-4 w-4 text-white/60" />
                <span className="text-xs text-white/60 font-medium">Proposal Preview</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/20 rounded-full w-full" />
                <div className="h-2 bg-white/15 rounded-full w-4/5" />
                <div className="h-2 bg-white/10 rounded-full w-3/5" />
                <div className="h-2 bg-white/15 rounded-full w-4/5" />
                <div className="h-2 bg-white/10 rounded-full w-2/5" />
              </div>
              <p className="text-[10px] text-white/40 mt-4 line-clamp-3">{previewText}</p>
            </div>
          </div>
        </div>
      </WobbleCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          label="Clarity"
          score={analysis.scores.clarity}
          icon={Target}
          gradientFrom="from-blue-600"
          gradientTo="to-indigo-800"
        />
        <ScoreCard
          label="Persuasion"
          score={analysis.scores.persuasion}
          icon={TrendingUp}
          gradientFrom="from-emerald-600"
          gradientTo="to-teal-800"
        />
        <ScoreCard
          label="Readability"
          score={analysis.scores.readability}
          icon={BookOpen}
          gradientFrom="from-violet-600"
          gradientTo="to-purple-800"
        />
        <ScoreCard
          label="Professional"
          score={analysis.scores.professionalism}
          icon={Award}
          gradientFrom="from-orange-600"
          gradientTo="to-rose-800"
        />
      </div>

      {analysis.strengths.length > 0 && (
        <WobbleCard containerClassName="bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800">
          <div className="relative z-10 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Key Strengths</h3>
              </div>
              <p className="text-white/70 mb-6">These are the aspects of your proposal that are working well.</p>
              <div className="flex flex-wrap gap-2">
                {analysis.strengths.map((strength, i) => (
                  <motion.span
                    key={i}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm rounded-xl border border-white/20 font-medium"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    {strength}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </WobbleCard>
      )}

      <WobbleCard containerClassName="bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to improve your proposal?</h3>
            <p className="text-white/70">
              Our intelligent system will rewrite and enhance your proposal based on the analysis above.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <StyledButton
              variant="nextjs-white"
              className="flex-1 md:flex-none h-12 px-8"
              onClick={onImprove}
              disabled={isImproving}
            >
              {isImproving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Improving...
                </span>
              ) : (
                <span className="flex items-center gap-2 font-semibold">
                  Improve Proposal
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </StyledButton>
            <motion.button
              onClick={onReset}
              disabled={isImproving}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50 border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="h-5 w-5 text-white" />
            </motion.button>
          </div>
        </div>
      </WobbleCard>

      {/* Issues Section - Light theme for contrast */}
      {analysis.issues.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Issues Found</h3>
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-full font-semibold">
                  {criticalCount} Critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-semibold">
                  {warningCount} Warnings
                </span>
              )}
              {suggestionCount > 0 && (
                <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs rounded-full font-semibold">
                  {suggestionCount} Suggestions
                </span>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {analysis.issues.map((issue) => (
              <IssueItem key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 md:p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            Recommendations
          </h3>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <span className="w-8 h-8 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
