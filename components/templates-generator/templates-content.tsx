"use client"

import { useState, useCallback, useRef, useEffect, memo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Plus,
  Heart,
  Clock,
  Layers,
  ChevronDown,
  ArrowRight,
  Star,
  TrendingUp,
  FileUp,
  Loader2,
  Crown,
  Sparkles,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StyledButton } from "@/components/ui/styled-button"
import { cn } from "@/lib/utils"
import { useTemplates } from "@/hooks/use-templates"
import { createProposalFromTemplate } from "@/hooks/use-proposals"
import type { Template } from "@/lib/supabase/types"
import { UploadDocumentModal } from "@/components/upload-document-modal"
import { createLocalProposal, saveLocalProposal, starterTemplates } from "@/hooks/use-local-proposal"

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, rootMargin: "100px", ...options },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

interface TemplatesContentProps {
  activeFilter: "all" | "recent" | "favorites"
  onFilterChange: (filter: "all" | "recent" | "favorites") => void
  sortBy: string
  onSortChange: (sort: string) => void
}

const categoryColors: Record<string, string> = {
  Sales: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Fundraising: "bg-violet-100 text-violet-700 border border-violet-200",
  Marketing: "bg-pink-100 text-pink-700 border border-pink-200",
  Engineering: "bg-blue-100 text-blue-700 border border-blue-200",
  Design: "bg-amber-100 text-amber-700 border border-amber-200",
  Product: "bg-cyan-100 text-cyan-700 border border-cyan-200",
  Consulting: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  Finance: "bg-green-100 text-green-700 border border-green-200",
  Management: "bg-slate-100 text-slate-700 border border-slate-200",
  HR: "bg-orange-100 text-orange-700 border border-orange-200",
  Events: "bg-purple-100 text-purple-700 border border-purple-200",
  Strategy: "bg-red-100 text-red-700 border border-red-200",
  Legal: "bg-gray-100 text-gray-700 border border-gray-200",
  Other: "bg-slate-100 text-slate-700 border border-slate-200",
}

interface TemplateCardProps {
  template: Template
  index: number
  isHovered: boolean
  hasAnyHover: boolean
  onHover: (index: number | null) => void
  onOpenTemplate: (template: Template) => void
  onToggleFavorite: (template: Template) => void
}

const TemplateCard = memo(
  function TemplateCard({
    template,
    index,
    isHovered,
    hasAnyHover,
    onHover,
    onOpenTemplate,
    onToggleFavorite,
  }: TemplateCardProps) {
    const { ref, isInView } = useInView()

    const shouldBlur = hasAnyHover && !isHovered

    // Calculate time ago from updated_at
    const getTimeAgo = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 60) return `${diffMins} minutes ago`
      if (diffHours < 24) return `${diffHours} hours ago`
      if (diffDays < 7) return `${diffDays} days ago`
      return date.toLocaleDateString()
    }

    // Check if recently edited (within last 24 hours)
    const isRecent = () => {
      const date = new Date(template.updated_at)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      return diffMs < 24 * 60 * 60 * 1000
    }

    const sectionCount = template.content?.sections?.length || 0

    const isPremium = template.is_premium

    return (
      <div
        ref={ref}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        className="relative"
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}
      >
        {isInView ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-out",
              "will-change-transform",
              shouldBlur && "blur-sm scale-[0.97] opacity-70",
              isPremium && "ring-2 ring-amber-400/50",
            )}
            style={{
              boxShadow: isHovered
                ? isPremium
                  ? "0 25px 50px -12px rgba(251, 191, 36, 0.35)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                : isPremium
                  ? "0 4px 20px -1px rgba(251, 191, 36, 0.2)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {isPremium && (
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </div>
            )}

            <div className="relative h-48 md:h-56 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
              {isPremium && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/10 z-[1]" />
              )}

              <img
                src={(() => {
                  if (template.thumbnail_url) return template.thumbnail_url
                  const category = (template.category || "").toLowerCase().trim()
                  const validCategories = ["product", "fundraising", "consulting", "design", "sales", "marketing", "engineering"]
                  if (validCategories.includes(category)) {
                    return `/templates/${category}-template.jpg`
                  }
                  return "/templates/default-template.jpg"
                })()}
                alt={template.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/templates/default-template.jpg"
                }}
              />

              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5 transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0",
                )}
              >
                <h3
                  className={cn(
                    "text-xl md:text-2xl font-bold bg-clip-text text-transparent mb-2",
                    isPremium
                      ? "bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-400"
                      : "bg-gradient-to-b from-white to-white/80",
                  )}
                >
                  {template.name}
                </h3>
                <p className="text-sm text-white/70 line-clamp-2">{template.description || "No description"}</p>
              </div>

              {isPremium && (
                <div
                  className={cn(
                    "absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg shadow-lg shadow-amber-500/30 z-20 transition-all duration-300",
                    isHovered ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0",
                  )}
                >
                  <Crown className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold tracking-wide">PREMIUM</span>
                </div>
              )}

              <span
                className={cn(
                  `absolute px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-sm transition-opacity duration-300`,
                  categoryColors[template.category] || categoryColors.Other,
                  isHovered ? "opacity-0" : "opacity-100",
                  isPremium ? "top-12 left-3" : "top-3 left-3",
                )}
              >
                {template.category}
              </span>

              {isRecent() && !isPremium && (
                <span
                  className={cn(
                    "absolute top-3 left-3 mt-8 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded flex items-center gap-1 shadow-md transition-opacity duration-300",
                    isHovered ? "opacity-0" : "opacity-100",
                  )}
                >
                  <TrendingUp className="h-3 w-3" />
                  NEW
                </span>
              )}

              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onToggleFavorite(template)
                }}
                className={cn(
                  `absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-20`,
                  isPremium
                    ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/40"
                    : template.is_premium
                      ? "bg-pink-500 text-white shadow-lg shadow-pink-500/40"
                      : "bg-white/90 backdrop-blur-sm text-slate-400 hover:text-pink-500 hover:bg-white shadow-md",
                )}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`h-4 w-4 ${isPremium ? "fill-current" : ""}`} />
              </motion.button>

              <div
                className={cn(
                  "absolute top-3 right-14 flex items-center gap-1 px-2 py-1 backdrop-blur-sm rounded-lg shadow-md transition-all duration-300 z-20",
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
                  isPremium ? "bg-gradient-to-r from-amber-100 to-yellow-100" : "bg-white/90",
                )}
              >
                <Star className={cn("h-3.5 w-3.5 fill-current", isPremium ? "text-amber-500" : "text-amber-500")} />
                <span className={cn("text-xs font-semibold", isPremium ? "text-amber-700" : "text-slate-700")}>
                  {template.rating || 0}
                </span>
              </div>
            </div>

            <div className={cn("p-4", isPremium ? "bg-gradient-to-b from-white to-amber-50/50" : "bg-white")}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    {sectionCount} sections
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className={isRecent() ? "text-blue-500 font-medium" : ""}>
                      {getTimeAgo(template.updated_at)}
                    </span>
                  </span>
                </div>
                {isPremium && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    Pro Quality
                  </span>
                )}
              </div>

              <motion.button
                onClick={() => onOpenTemplate(template)}
                className={cn(
                  "group/btn relative w-full rounded-full p-px text-sm font-semibold overflow-hidden",
                  isPremium
                    ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white"
                    : "bg-slate-900 text-white",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100",
                      isPremium
                        ? "bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_75%)]"
                        : "bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)]",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "relative flex items-center justify-center gap-2 z-10 rounded-full py-2.5 px-4 ring-1",
                    isPremium
                      ? "bg-gradient-to-r from-amber-600 to-yellow-600 ring-amber-400/30"
                      : "bg-slate-950 ring-white/10",
                  )}
                >
                  {isPremium && <Crown className="h-4 w-4" />}
                  Open Template
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </span>
                <span
                  className={cn(
                    "absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r transition-opacity duration-500 group-hover/btn:opacity-40",
                    isPremium
                      ? "from-white/0 via-white/90 to-white/0"
                      : "from-emerald-400/0 via-emerald-400/90 to-emerald-400/0",
                  )}
                />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div
            className={cn(
              "rounded-2xl h-[340px] animate-pulse",
              isPremium ? "bg-gradient-to-br from-amber-100 to-yellow-50" : "bg-slate-100",
            )}
          />
        )}
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.template.id === nextProps.template.id &&
      prevProps.isHovered === nextProps.isHovered &&
      prevProps.hasAnyHover === nextProps.hasAnyHover
    )
  },
)

export function TemplatesContent({ activeFilter, onFilterChange, sortBy, onSortChange }: TemplatesContentProps) {
  const router = useRouter()
  const [hoveredCardRaw, setHoveredCardRaw] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const hoveredCard = useDebounce(hoveredCardRaw, 30)

  // Handle Create Template - creates local proposal and navigates to editor
  const handleCreateTemplate = () => {
    const proposal = createLocalProposal("Untitled Proposal", "blank", "blank")
    saveLocalProposal(proposal)
    router.push(`/editor/${proposal.id}`)
  }

  const { templates, total, isLoading, error, mutate } = useTemplates({
    filter: activeFilter === "all" ? undefined : activeFilter,
  })

  const handleHover = useCallback((index: number | null) => {
    setHoveredCardRaw(index)
  }, [])

  const handleOpenTemplate = async (template: Template) => {
    setIsCreating(true)
    try {
      const result = await createProposalFromTemplate(template.id, `${template.name} - Copy`)
      router.push(`/editor/${result.proposal.id}`)
    } catch (err) {
      console.error("Failed to create proposal:", err)
      alert("Failed to open template. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleFavorite = async (template: Template) => {
    console.log("Toggle favorite for template:", template.id)
  }

  const filters = [
    { id: "all" as const, label: "All Templates" },
    { id: "recent" as const, label: "Recently Edited" },
    { id: "favorites" as const, label: "Favorites" },
  ]

  const hasAnyHover = hoveredCard !== null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-500">Loading templates...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-red-500 font-medium">Failed to load templates</p>
          <p className="text-slate-500 text-sm">{error.message}</p>
          <StyledButton variant="secondary" onClick={() => mutate()}>
            Try Again
          </StyledButton>
        </div>
      </div>
    )
  }

  return (
    <div>
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-slate-700 font-medium">Creating your proposal...</p>
          </div>
      </div>
      )}

      {/* Upload Document Modal */}
      <UploadDocumentModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
      
      {/* Premium Announcement Banner */}
      <div className="mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full">
                  <Crown className="h-4 w-4 text-white" />
                  <span className="text-xs font-bold text-white tracking-wide">RECOMMENDED</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                  Best Practice
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Create Your Own Template
              </h2>
              
              <p className="text-slate-300 leading-relaxed mb-4 max-w-xl">
                The pre-built templates below are <span className="text-amber-400 font-medium">AI-generated</span> and 
                may not meet your quality standards. For professional results, we strongly recommend 
                <span className="text-white font-semibold"> creating a custom template</span> or 
                <span className="text-white font-semibold"> uploading your existing document</span>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  onClick={handleCreateTemplate}
                  className="group relative flex items-center gap-2.5 px-6 py-3 bg-white text-slate-900 rounded-xl text-sm font-semibold shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Template</span>
                  <ArrowRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </motion.button>

                <motion.button
                  onClick={() => setShowUploadModal(true)}
                  className="group flex items-center gap-2.5 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FileUp className="h-5 w-5" />
                  <span>Upload Document</span>
                </motion.button>
              </div>
            </div>

            {/* Right - Premium Coming Soon */}
            <div className="md:w-72 p-5 bg-gradient-to-br from-amber-500/20 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-amber-500/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-amber-400 text-xs font-bold tracking-wider">COMING SOON</p>
                  <p className="text-white font-semibold">Premium Templates</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                Professionally designed, human-crafted templates for every industry and use case.
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                Actively in development
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-slate-900">AI-Generated Templates</h2>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
              Beta Quality
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Browse AI-generated templates below. For best results, create your own template above.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{total}</span> templates
          </span>
          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              AI Powered
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl backdrop-blur-sm">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
              whileHover={{ scale: activeFilter === filter.id ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sort by: <span className="font-semibold text-slate-900">Recently Modified</span>
              <ChevronDown className="h-4 w-4" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white/95 backdrop-blur-xl border-slate-200 shadow-xl rounded-xl p-1.5 min-w-[180px]"
          >
            <DropdownMenuItem
              onClick={() => onSortChange("recently-modified")}
              className="text-slate-700 hover:bg-slate-100 rounded-lg focus:bg-slate-100 cursor-pointer px-3 py-2"
            >
              Recently Modified
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("name")}
              className="text-slate-700 hover:bg-slate-100 rounded-lg focus:bg-slate-100 cursor-pointer px-3 py-2"
            >
              Name (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("rating")}
              className="text-slate-700 hover:bg-slate-100 rounded-lg focus:bg-slate-100 cursor-pointer px-3 py-2"
            >
              Highest Rated
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("created")}
              className="text-slate-700 hover:bg-slate-100 rounded-lg focus:bg-slate-100 cursor-pointer px-3 py-2"
            >
              Date Created
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates yet</h3>
          <p className="text-slate-500 text-center max-w-md mb-6">
            Create your first template to get started with professional proposals.
          </p>
          <Link href="/templates/new">
            <StyledButton variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </StyledButton>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {templates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              isHovered={hoveredCard === index}
              hasAnyHover={hasAnyHover}
              onHover={handleHover}
              onOpenTemplate={handleOpenTemplate}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}

          <Link href="/templates/new">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "group relative bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all duration-300 cursor-pointer min-h-[340px] flex flex-col items-center justify-center",
                hasAnyHover && "blur-sm scale-[0.97] opacity-70",
              )}
            >
              <motion.div
                className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center mb-4 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Plus className="h-7 w-7 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </motion.div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">New Template</h3>
              <p className="text-xs text-slate-500 text-center px-6">Start from scratch or use assistance</p>
            </motion.div>
          </Link>
        </div>
      )}
    </div>
  )
}
