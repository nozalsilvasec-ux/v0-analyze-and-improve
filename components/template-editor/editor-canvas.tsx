"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  MoreHorizontal,
  Scissors,
  Undo,
  Redo,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  GripVertical,
  Plus,
  Loader2,
  ImageIcon,
  Quote,
  Table,
  DollarSign,
  Upload,
  X,
  Palette,
  Check,
  Settings2,
  BarChart3,
  Users,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import type { Proposal, Section } from "@/lib/supabase/types"
import {
  BackgroundSettingsPanel,
  defaultBackgroundSettings,
  type BackgroundSettings,
} from "./background-settings-panel"
import { BlockSettingsPanel, defaultBlockSettings, type BlockSettings } from "./block-settings-panel"
import { createPortal } from "react-dom"
import type { BlockTemplate } from "@/hooks/use-blocks"
import { SectionStylePanel } from "./section-style-panel"
import {
  defaultSectionContent,
  defaultImageSettings,
  getPositionClasses,
  getContextualPlaceholder,
  type ImageSettings,
} from "./canvas-types"

interface EditorCanvasProps {
  proposal: Proposal
  onUpdate: (updates: Partial<Proposal>) => Promise<void>
  pageSettings?: {
    backgroundColor: string
    backgroundImage: string | null
    backgroundOpacity: number
  }
}

export interface EditorCanvasRef {
  insertBlock: (block: BlockTemplate) => void
  insertImage: (imageUrl: string) => void
}

export const EditorCanvas = forwardRef<EditorCanvasRef, EditorCanvasProps>(function EditorCanvas(
  { proposal, onUpdate, pageSettings = { backgroundColor: "#ffffff", backgroundImage: null, backgroundOpacity: 100 } },
  ref,
) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showAddMenu, setShowAddMenu] = useState<string | null>(null)
  const [showImagePicker, setShowImagePicker] = useState<string | null>(null)
  const [showSectionStyler, setShowSectionStyler] = useState<string | null>(null)
  const [showHeroBackgroundPanel, setShowHeroBackgroundPanel] = useState(false)
  const [showBlockSettingsPanel, setShowBlockSettingsPanel] = useState(false)
  const [showSectionStylePanel, setShowSectionStylePanel] = useState<string | null>(null) // Added state for section style panel
  const [heroBackgroundSettings, setHeroBackgroundSettings] = useState<BackgroundSettings>(defaultBackgroundSettings)
  const [blockSettings, setBlockSettings] = useState<BlockSettings>(defaultBlockSettings)
  const [isDragOver, setIsDragOver] = useState(false)

  const [localContent, setLocalContent] = useState(proposal.content)

  useEffect(() => {
    setLocalContent(proposal.content)
    if (proposal.content?.heroBackground) {
      setHeroBackgroundSettings(proposal.content.heroBackground as BackgroundSettings)
    }
  }, [proposal.content])

  const debouncedSave = useCallback(
    (content: typeof localContent) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true)
        try {
          await onUpdate({ content, last_edited_at: new Date().toISOString() })
          setLastSaved(new Date())
        } catch (error) {
          console.error("Auto-save failed:", error)
        } finally {
          setIsSaving(false)
        }
      }, 1500)
    },
    [onUpdate],
  )

  const updateSectionContent = (sectionId: string, newContent: Record<string, unknown>) => {
    const updatedSections = localContent.sections.map((section: Section) =>
      section.id === sectionId ? { ...section, content: newContent } : section,
    )
    const newLocalContent = { ...localContent, sections: updatedSections }
    setLocalContent(newLocalContent)
    debouncedSave(newLocalContent)
  }

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    const updatedSections = localContent.sections.map((section: Section) =>
      section.id === sectionId ? { ...section, title: newTitle } : section,
    )
    const newLocalContent = { ...localContent, sections: updatedSections }
    setLocalContent(newLocalContent)
    debouncedSave(newLocalContent)
  }

  const updateSectionStyle = (
    sectionId: string,
    style: {
      backgroundColor?: string
      backgroundImage?: string | null
      backgroundTint?: string
      tintOpacity?: number
      backgroundBlur?: number
      width?: "S" | "M" | "L" | "full"
      spacing?: "S" | "M" | "L"
      minHeight?: "none" | "1/3" | "1/2" | "full"
    },
  ) => {
    const updatedSections = localContent.sections.map((Section: Section) =>
      Section.id === sectionId
        ? { ...Section, content: { ...Section.content, style: { ...(Section.content?.style || {}), ...style } } }
        : Section,
    )

    const newLocalContent = { ...localContent, sections: updatedSections }
    setLocalContent(newLocalContent)
    debouncedSave(newLocalContent)
  }

  const updateSectionTextStyle = (sectionId: string, style: Record<string, unknown>) => {
    const updatedSections = localContent.sections.map((s: Section) =>
      s.id === sectionId ? { ...s, content: { ...s.content, textStyle: style } } : s,
    )
    const newLocalContent = { ...localContent, sections: updatedSections }
    setLocalContent(newLocalContent)
    debouncedSave(newLocalContent)
  }

  const updateHeroBackgroundSettings = (newSettings: BackgroundSettings) => {
    setHeroBackgroundSettings(newSettings)
    const newLocalContent = { ...localContent, heroBackground: newSettings }
    setLocalContent(newLocalContent)
    debouncedSave(newLocalContent)
  }

  const addSection = (afterSectionId?: string, type: Section["type"] = "text") => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      type,
      title:
        type === "hero"
          ? "Proposal Title"
          : type === "image"
            ? ""
            : type === "pricing"
              ? "Pricing"
              : type === "quote"
                ? ""
                : type === "table"
                  ? "Comparison"
                  : type === "dashboard"
                    ? "Dashboard"
                    : type === "team"
                      ? "Team"
                      : type === "comparison"
                        ? "Comparison"
                        : type === "roadmap"
                          ? "Roadmap"
                          : type === "testimonial"
                            ? "Testimonials"
                            : type === "investment"
                              ? "Investment"
                              : "New Section",
      content: defaultSectionContent[type],
      order: localContent.sections.length,
    }

    let updatedSections
    if (afterSectionId) {
      const index = localContent.sections.findIndex((s: Section) => s.id === afterSectionId)
      updatedSections = [
        ...localContent.sections.slice(0, index + 1),
        newSection,
        ...localContent.sections.slice(index + 1),
      ].map((s: Section, i: number) => ({ ...s, order: i }))
    } else {
      updatedSections = [...localContent.sections, newSection]
    }

    const newLocalContent = { ...localContent, sections: updatedSections }
    setLocalContent(newLocalContent)
    debouncedSave(newLocalContent)
    setShowAddMenu(null)
  }

  const deleteSection = (sectionId: string) => {
    const updatedSections = localContent.sections
      .filter((s: Section) => s.id !== sectionId)
      .map((s: Section, i: number) => ({ ...s, order: i }))
    const newLocalContent = { ...localContent, sections: updatedSections }
    setLocalContent(newLocalContent)
    debouncedSave(newLocalContent)
  }

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const sections = [...localContent.sections]
    const index = sections.findIndex((s: Section) => s.id === sectionId)

    if (direction === "up" && index > 0) {
      ;[sections[index], sections[index - 1]] = [sections[index - 1], sections[index]]
    } else if (direction === "down" && index < sections.length - 1) {
      ;[sections[index], sections[index + 1]] = [sections[index + 1], sections[index]]
    }

    const updatedSections = sections.map((s: Section, i: number) => ({ ...s, order: i }))
    const newLocalContent = { ...localContent, sections: updatedSections }
    setLocalContent(newLocalContent)
    debouncedSave(newLocalContent)
  }

  const duplicateSection = (sectionId: string) => {
    const sectionToDuplicate = localContent.sections.find((s: Section) => s.id === sectionId)
    if (!sectionToDuplicate) return

    const index = localContent.sections.findIndex((s: Section) => s.id === sectionId)
    const newSection: Section = {
      ...sectionToDuplicate,
      id: crypto.randomUUID(),
      title: `${sectionToDuplicate.title} (Copy)`,
    }

    const updatedSections = [
      ...localContent.sections.slice(0, index + 1),
      newSection,
      ...localContent.sections.slice(index + 1),
    ].map((s: Section, i: number) => ({ ...s, order: i }))

    const newLocalContent = { ...localContent, sections: updatedSections }
    setLocalContent(newLocalContent)
    debouncedSave(newLocalContent)
  }

  const handleSave = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    setIsSaving(true)
    try {
      await onUpdate({ content: localContent, last_edited_at: new Date().toISOString() })
      setLastSaved(new Date())
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSectionImage = (sectionId: string, imageUrl?: string) => {
    const section = localContent.sections.find((s: Section) => s.id === sectionId)
    if (!section) return

    const newContent = imageUrl ? { ...section.content, image: imageUrl } : { ...section.content, image: undefined }

    updateSectionContent(sectionId, newContent)
    setShowImagePicker(null)
  }

  // Removed stockImages as it's now defined within ImagePickerPopup

  const sectionBackgroundImages = [
    { name: "Gradient", url: "/abstract-gradient-blue-purple.png" },
    { name: "Geometric", url: "/geometric-pattern-minimal.jpg" },
    { name: "Paper", url: "/paper-texture-subtle.jpg" },
    { name: "Watercolor", url: "/watercolor-soft-pastel-background.jpg" },
  ]

  const SectionTypeMenu = ({ afterSectionId }: { afterSectionId?: string }) => {
    const popupRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
          setShowAddMenu(null)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const sectionTypes = [
      { type: "text" as const, icon: MoreHorizontal, label: "Text Block", description: "Add paragraphs and headings" },
      { type: "image" as const, icon: ImageIcon, label: "Image", description: "Add visual content" },
      { type: "pricing" as const, icon: DollarSign, label: "Pricing Table", description: "Display pricing options" },
      { type: "quote" as const, icon: Quote, label: "Quote", description: "Add testimonials or quotes" },
      { type: "table" as const, icon: Table, label: "Comparison Table", description: "Compare features or options" },
      { type: "dashboard" as const, icon: BarChart3, label: "Dashboard", description: "Showcase metrics and charts" },
      { type: "team" as const, icon: Users, label: "Team", description: "Introduce your team members" },
      {
        type: "comparison" as const,
        icon: Table,
        label: "Competitive Analysis",
        description: "Compare against competitors",
      },
      { type: "roadmap" as const, icon: ArrowUp, label: "Roadmap", description: "Outline project timelines" },
      { type: "testimonial" as const, icon: Quote, label: "Testimonials", description: "Share client feedback" },
      {
        type: "investment" as const,
        icon: DollarSign,
        label: "Investment",
        description: "Present investment opportunities",
      },
    ]

    return createPortal(
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed z-[9999] bg-white rounded-2xl shadow-2xl border border-slate-200"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "320px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Add Section</p>
              <p className="text-xs text-slate-500">Choose a section type</p>
            </div>
          </div>
          <button onClick={() => setShowAddMenu(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Section Type Options */}
        <div className="p-3">
          {sectionTypes.map(({ type, icon: Icon, label, description }) => (
            <button
              key={type}
              onClick={() => {
                addSection(afterSectionId, type)
                setShowAddMenu(null)
              }}
              className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Icon className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
              </div>
              <div>
                <p className="font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-500">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>,
      document.body,
    )
  }

  // Added ImagePickerPopup component
  const ImagePickerPopup = ({
    sectionId,
    currentSrc,
    onClose,
  }: {
    sectionId: string
    currentSrc: string | null
    onClose: () => void
  }) => {
    const popupRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
          onClose()
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose])

    const stockImages = [
      { name: "Business Analytics", url: "/business-analytics-chart-with-colorful-data-visual.jpg" },
      { name: "Market Growth", url: "/market-growth-chart-showing-upward-trend-with-pie-.jpg" },
      { name: "Dashboard", url: "/modern-saas-product-dashboard-interface-with-metri.jpg" },
      { name: "Financial ROI", url: "/financial-growth-chart-with-roi-metrics-and-curren.jpg" },
      { name: "Timeline", url: "/project-timeline-roadmap-with-milestones-and-phase.jpg" },
      { name: "Workflow", url: "/business-process-workflow-diagram-with-connected-s.jpg" },
      { name: "Team Meeting", url: "/professional-business-meeting.png" },
      { name: "Modern Office", url: "/modern-office.png" },
    ]

    const handleImageSelect = (imageUrl: string) => {
      const section = localContent.sections.find((s: Section) => s.id === sectionId)
      if (section?.type === "image") {
        // Spread existing content to preserve alt, caption, etc.
        updateSectionContent(sectionId, { ...section.content, src: imageUrl })
      } else if (section?.type === "text") {
        updateSectionContent(sectionId, { ...section.content, image: imageUrl })
      }
      onClose()
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          const section = localContent.sections.find((s: Section) => s.id === sectionId)
          if (section?.type === "image") {
            // Spread existing content to preserve alt, caption, etc.
            updateSectionContent(sectionId, { ...section.content, src: base64 })
          } else if (section?.type === "text") {
            updateSectionContent(sectionId, { ...section.content, image: base64 })
          }
          onClose()
        }
        reader.readAsDataURL(file)
      }
    }

    return createPortal(
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[500px] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Change Image</h3>
              <p className="text-xs text-slate-500">Select or upload a new image</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Upload New Image</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="h-8 w-8 text-slate-400" />
              <span className="text-sm text-slate-600">Click to upload or drag and drop</span>
              <span className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB</span>
            </button>
          </div>

          {/* Stock Images */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Stock Images</p>
            <div className="grid grid-cols-2 gap-3">
              {stockImages.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => handleImageSelect(img.url)}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                    currentSrc === img.url
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-slate-200 hover:border-blue-400"
                  }`}
                >
                  <Image src={img.url || "/placeholder.svg"} alt={img.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1 rounded-full">
                      {img.name}
                    </span>
                  </div>
                  {currentSrc === img.url && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* URL Input */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Or paste image URL</p>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const url = (e.target as HTMLInputElement).value
                    if (url) handleImageSelect(url)
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  if (input.value) handleImageSelect(input.value)
                }}
                className="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </motion.div>,
      document.body,
    )
  }

  const SectionStylerPopup = ({
    sectionId,
    currentStyle,
  }: {
    sectionId: string
    currentStyle?: {
      backgroundColor?: string
      backgroundImage?: string | null
    }
  }) => {
    const popupRef = useRef<HTMLDivElement>(null)
    const [activeTab, setActiveTab] = useState<"color" | "image">("color")

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
          setShowSectionStyler(null)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Color palette
    const colorOptions = [
      { value: "#3B82F6", name: "Blue" },
      { value: "#1E293B", name: "Dark" },
      { value: "#059669", name: "Green" },
      { value: "#EF4444", name: "Red" },
      { value: "#8B5CF6", name: "Purple" },
      { value: "#F59E0B", name: "Amber" },
      { value: "#6B7280", name: "Gray" },
      { value: "#E5E7EB", name: "Light Gray" },
      { value: "#FFFFFF", name: "White" },
    ]

    // Style presets
    const stylePresets = [
      { id: "light-blue", bg: "#EFF6FF", text: "#1E40AF", name: "Light Blue" },
      { id: "dark-blue", bg: "#1E3A8A", text: "#FFFFFF", name: "Dark Blue" },
      { id: "light-green", bg: "#F0FDF4", text: "#166534", name: "Light Green" },
      { id: "dark-green", bg: "#166534", text: "#FFFFFF", name: "Dark Green" },
      { id: "light-gray", bg: "#F3F4F6", text: "#374151", name: "Light Gray" },
      { id: "dark-gray", bg: "#1F2937", text: "#FFFFFF", name: "Dark Gray" },
    ]

    const handleColorChange = (color: string) => {
      updateSectionStyle(sectionId, { backgroundColor: color, backgroundImage: null })
    }

    const handlePresetApply = (preset: (typeof stylePresets)[0]) => {
      updateSectionStyle(sectionId, { backgroundColor: preset.bg, backgroundImage: null })
    }

    return createPortal(
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        style={{
          top: "80px",
          right: "20px",
          width: "300px",
          maxHeight: "calc(100vh - 100px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Section Style</h3>
          <button
            onClick={() => setShowSectionStyler(null)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {/* Quick Presets */}
          <div className="p-3 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase mb-2">Quick Styles</p>
            <div className="grid grid-cols-3 gap-2">
              {stylePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetApply(preset)}
                  className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 transition-all"
                  style={{ backgroundColor: preset.bg }}
                  title={preset.name}
                >
                  <div className="text-xs font-medium truncate" style={{ color: preset.text }}>
                    Aa
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Background Type Tabs */}
          <div className="p-3">
            <p className="text-xs font-medium text-slate-500 uppercase mb-2">Background</p>
            <div className="flex bg-slate-100 rounded-lg p-0.5 mb-3">
              <button
                onClick={() => setActiveTab("color")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "color" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"
                }`}
              >
                Color
              </button>
              <button
                onClick={() => setActiveTab("image")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "image" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"
                }`}
              >
                Image
              </button>
            </div>

            {activeTab === "color" && (
              <div className="space-y-3">
                {/* Color Swatches */}
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorChange(color.value)}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        currentStyle?.backgroundColor === color.value
                          ? "ring-2 ring-blue-500 ring-offset-1"
                          : "hover:ring-2 hover:ring-slate-300"
                      }`}
                      style={{
                        backgroundColor: color.value,
                        border: color.value === "#FFFFFF" || color.value === "#E5E7EB" ? "1px solid #E5E7EB" : "none",
                      }}
                      title={color.name}
                    >
                      {currentStyle?.backgroundColor === color.value && (
                        <Check
                          className="h-3 w-3 m-auto"
                          style={{
                            color: color.value === "#FFFFFF" || color.value === "#E5E7EB" ? "#374151" : "#FFFFFF",
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyle?.backgroundColor || "#FFFFFF"}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={currentStyle?.backgroundColor || "#FFFFFF"}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            )}

            {activeTab === "image" && (
              <div className="space-y-3">
                {/* Current Background Image Preview */}
                {currentStyle?.backgroundImage && (
                  <div className="relative">
                    <img
                      src={currentStyle.backgroundImage || "/placeholder.svg"}
                      alt="Background"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => updateSectionStyle(sectionId, { backgroundImage: null })}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Image URL Input */}
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    onBlur={(e) => {
                      if (e.target.value) {
                        updateSectionStyle(sectionId, {
                          backgroundImage: e.target.value,
                          backgroundColor: "transparent",
                        })
                      }
                    }}
                  />
                </div>

                {/* Sample Background Images */}
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">Or choose from samples</label>
                  <div className="grid grid-cols-3 gap-1">
                    {["/abstract-blue-gradient.png", "/modern-office.png", "/technology-network-pattern.jpg"].map(
                      (img, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            updateSectionStyle(sectionId, { backgroundImage: img, backgroundColor: "transparent" })
                          }
                          className="h-12 rounded overflow-hidden border border-slate-200 hover:border-blue-400"
                        >
                          <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>,
      document.body,
    )
  }

  const FloatingToolbar = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 p-1.5 bg-white rounded-xl shadow-lg border border-slate-200/60"
    >
      <StyledButton variant="ghost" size="icon" className="w-8 h-8">
        <MoreHorizontal className="h-4 w-4" />
      </StyledButton>
      <StyledButton variant="ghost" size="icon" className="w-8 h-8">
        <Scissors className="h-4 w-4" />
      </StyledButton>
      <StyledButton
        variant="ghost"
        size="icon"
        className={`w-8 h-8 relative ${showBlockSettingsPanel ? "bg-blue-100 text-blue-600" : ""}`}
        onClick={() => {
          setShowBlockSettingsPanel(!showBlockSettingsPanel)
          setShowHeroBackgroundPanel(false)
        }}
        title="Block Settings"
      >
        <Settings2 className="h-4 w-4" />
        {showBlockSettingsPanel && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />}
      </StyledButton>
      <StyledButton
        variant="ghost"
        size="icon"
        className={`w-8 h-8 relative ${showHeroBackgroundPanel ? "bg-purple-100 text-purple-600" : ""}`}
        onClick={() => {
          setShowHeroBackgroundPanel(!showHeroBackgroundPanel)
          setShowBlockSettingsPanel(false)
        }}
        title="Background Settings"
      >
        <Palette className="h-4 w-4" />
        {showHeroBackgroundPanel && <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full" />}
      </StyledButton>
      <div className="w-px h-5 bg-slate-200 mx-1" />
      <StyledButton variant="ghost" size="icon" className="w-8 h-8">
        <Undo className="h-4 w-4" />
      </StyledButton>
      <StyledButton variant="ghost" size="icon" className="w-8 h-8">
        <Redo className="h-4 w-4" />
      </StyledButton>
      <div className="w-px h-5 bg-slate-200 mx-1" />
      <StyledButton variant="ghost" size="icon" className="w-8 h-8">
        <ArrowUp className="h-4 w-4" />
      </StyledButton>
      <StyledButton variant="ghost" size="icon" className="w-8 h-8">
        <ArrowDown className="h-4 w-4" />
      </StyledButton>
      <div className="w-px h-5 bg-slate-200 mx-1" />
      <StyledButton variant="ghost" size="icon" className="w-8 h-8">
        <Copy className="h-4 w-4" />
      </StyledButton>
      <StyledButton variant="ghost" size="icon" className="w-8 h-8 hover:bg-red-50 hover:text-red-500">
        <Trash2 className="h-4 w-4" />
      </StyledButton>
    </motion.div>
  )

  const renderSection = (section: Section, index: number) => {
    const isHovered = hoveredSection === section.id
    const sectionContent = section.content || {}
    const sectionStyle =
      (section.content?.style as {
        backgroundColor?: string
        backgroundImage?: string | null
        backgroundTint?: string
        tintOpacity?: number
        backgroundBlur?: number
        width?: "S" | "M" | "L" | "full"
        spacing?: "S" | "M" | "L"
        minHeight?: "none" | "1/3" | "1/2" | "full"
      }) || {}

    console.log(
      "[v0] renderSection - id:",
      section.id,
      "type:",
      section.type,
      "content keys:",
      Object.keys(sectionContent),
    )

    const getContextualPlaceholder = (caption?: string, alt?: string) => {
      const text = (caption || alt || "").toLowerCase()
      if (text.includes("chart") || text.includes("graph") || text.includes("data") || text.includes("analytics")) {
        return "/business-analytics-chart-with-colorful-data-visual.jpg"
      }
      if (text.includes("market") || text.includes("tam") || text.includes("growth")) {
        return "/market-growth-chart-showing-upward-trend-with-pie-.jpg"
      }
      if (text.includes("team") || text.includes("people") || text.includes("collaboration")) {
        return "/images/hero-image.png"
      }
      if (
        text.includes("product") ||
        text.includes("saas") ||
        text.includes("software") ||
        text.includes("dashboard")
      ) {
        return "/modern-saas-product-dashboard-interface-with-metri.jpg"
      }
      if (
        text.includes("roi") ||
        text.includes("revenue") ||
        text.includes("financial") ||
        text.includes("investment")
      ) {
        return "/financial-growth-chart-with-roi-metrics-and-curren.jpg"
      }
      if (text.includes("timeline") || text.includes("roadmap") || text.includes("milestone")) {
        return "/project-timeline-roadmap-with-milestones-and-phase.jpg"
      }
      if (text.includes("process") || text.includes("workflow") || text.includes("framework")) {
        return "/business-process-workflow-diagram-with-connected-s.jpg"
      }
      return "/professional-business-presentation-visual.jpg"
    }

    const renderHeroSection = () => {
      const defaultDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      const displayDate = (sectionContent.date as string) || defaultDate
      
      return (
      <div className="mb-12">
        <p 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateSectionContent(section.id, { ...sectionContent, date: e.currentTarget.textContent || defaultDate })}
          className="text-sm text-slate-500 mb-4 outline-none focus:bg-blue-50/50 rounded px-1 -mx-1 cursor-text"
        >
          {displayDate}
        </p>
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateSectionTitle(section.id, e.currentTarget.textContent || "")}
          className="text-5xl md:text-6xl font-light text-slate-900 tracking-tight outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
        >
          {section.title || "Untitled"}
        </h1>
        {sectionContent.subtitle && (
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              updateSectionContent(section.id, { ...sectionContent, subtitle: e.currentTarget.textContent })
            }
            className="text-xl text-slate-500 mt-4 outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
          >
            {sectionContent.subtitle as string}
          </p>
        )}
      </div>
    )}

    const renderTextSection = () => {
      const hasImage = sectionContent.image
      const textStyle = (sectionContent.textStyle as Record<string, string>) || {}
      console.log("[v0] renderTextSection - sectionId:", section.id, "textStyle:", textStyle, "sectionContent:", sectionContent)
      return (
        <div
          className="mb-12 relative rounded-xl overflow-hidden"
          style={{
            backgroundColor: sectionStyle.backgroundColor || "transparent",
          }}
        >
          {/* Background image for section */}
          {sectionStyle.backgroundImage && (
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: `url(${sectionStyle.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          <div
            className={`relative z-10 ${sectionStyle.backgroundColor && sectionStyle.backgroundColor !== "transparent" ? "p-6" : ""}`}
          >
            {section.title && (
              <div className="flex items-center justify-between mb-4">
                <h2
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateSectionTitle(section.id, e.currentTarget.textContent || "")}
                  className="text-2xl font-semibold text-slate-800 uppercase tracking-wide outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
                >
                  {section.title}
                </h2>
                <div className="flex items-center gap-1 relative">
                  <button
                    onClick={() => setShowSectionStyler(showSectionStyler === section.id ? null : section.id)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Section Background"
                  >
                    <Palette className="h-4 w-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => setShowImagePicker(showImagePicker === section.id ? null : section.id)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Add Visual"
                  >
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                  </button>
                  {/* Style Panel Button */}
                  <button
                    type="button"
                    onClick={() => setShowSectionStylePanel(section.id)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Text Styling"
                  >
                    <Settings2 className="h-4 w-4 text-slate-400" />
                  </button>
                  <AnimatePresence>
                    {showSectionStyler === section.id && (
                      <SectionStylerPopup sectionId={section.id} currentStyle={sectionStyle} />
                    )}
                    {showImagePicker === section.id && (
                      <ImagePickerPopup
                        sectionId={section.id}
                        currentSrc={section.content?.image as string | null}
                        onClose={() => setShowImagePicker(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
            <div className={`flex flex-col ${hasImage ? "lg:flex-row lg:gap-8" : ""}`}>
              <div className={hasImage ? "lg:flex-1" : ""}>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    updateSectionContent(section.id, { ...sectionContent, text: e.currentTarget.innerHTML })
                  }
                  dangerouslySetInnerHTML={{ __html: (sectionContent.text as string) || "Enter your content here..." }}
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed outline-none focus:bg-blue-50/50 rounded px-2 -mx-2 py-1"
                  style={{
                    fontSize: textStyle.fontSize,
                    fontWeight: textStyle.fontWeight,
                    fontStyle: textStyle.fontStyle,
                    textDecoration: textStyle.textDecoration,
                    color: textStyle.textColor,
                    textAlign: textStyle.textAlign as React.CSSProperties["textAlign"],
                  }}
                />
              </div>
              {hasImage && (
                <div className="lg:w-80 mt-6 lg:mt-0 flex-shrink-0 relative group/sideimg">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={(sectionContent.image as string) || "/placeholder.svg"}
                      alt="Section visual"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/sideimg:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/sideimg:opacity-100">
                      <button
                        onClick={() => toggleSectionImage(section.id, undefined)}
                        className="px-3 py-1.5 bg-white rounded-lg shadow-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Section Style Panel for text sections */}
          <AnimatePresence>
            {showSectionStylePanel === section.id && (
              <SectionStylePanel
                sectionId={section.id}
                sectionType="text"
                currentContent={sectionContent as Record<string, unknown>}
                currentStyle={(sectionContent.textStyle as Record<string, string>) || {}}
                onStyleChange={(style) => updateSectionTextStyle(section.id, style)}
                onContentChange={(content) => updateSectionContent(section.id, content)}
                onClose={() => setShowSectionStylePanel(null)}
              />
            )}
          </AnimatePresence>
        </div>
      )
    }

    const renderImageSection = () => {
      const imageSrc =
        (sectionContent.src as string) ||
        getContextualPlaceholder(sectionContent.caption as string, sectionContent.alt as string)

      const imageSettings =
        (sectionContent.imageSettings as {
          width?: number
          aspectRatio?: string
          objectFit?: string
          borderRadius?: number
          position?: "left" | "center" | "right"
          layout?: "full" | "with-text-left" | "with-text-right"
        }) || {}

      const sideText = (sectionContent.sideText as string) || ""
      const imgWidth = imageSettings.width || 100
      const imgAspectRatio = imageSettings.aspectRatio || "16/9"
      const imgObjectFit = imageSettings.objectFit || "cover"
      const imgBorderRadius = imageSettings.borderRadius || 16
      const imgPosition = imageSettings.position || "center"
      const imgLayout = imageSettings.layout || "full"

      // Calculate aspect ratio for style
      const getAspectRatioStyle = () => {
        if (imgAspectRatio === "auto") return {}
        const [w, h] = imgAspectRatio.split("/").map(Number)
        return { aspectRatio: `${w}/${h}` }
      }

      const getPositionClasses = () => {
        if (imgWidth >= 100 || imgLayout !== "full") return "mx-auto"
        switch (imgPosition) {
          case "left":
            return "mr-auto"
          case "right":
            return "ml-auto"
          case "center":
          default:
            return "mx-auto"
        }
      }

      if (imgLayout === "with-text-left" || imgLayout === "with-text-right") {
        const isTextLeft = imgLayout === "with-text-left"

        return (
          <div className="mb-12">
            <div className={`flex gap-8 items-start ${isTextLeft ? "flex-row" : "flex-row-reverse"}`}>
              {/* Text Side */}
              <div className="flex-1 min-w-0">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    updateSectionContent(section.id, {
                      ...sectionContent,
                      sideText: e.currentTarget.innerHTML,
                    })
                  }}
                  className="prose prose-slate max-w-none outline-none focus:bg-blue-50/30 rounded-lg p-4 min-h-[200px] border-2 border-dashed border-transparent hover:border-slate-200 focus:border-blue-300 transition-colors"
                  dangerouslySetInnerHTML={{
                    __html:
                      sideText ||
                      `<h3 class="text-xl font-semibold text-slate-800 mb-4">Add Your Heading</h3><p class="text-slate-600 leading-relaxed">Click here to add text content that appears beside your image. You can write paragraphs, add bullet points, or any other content.</p><ul class="mt-4 space-y-2"><li class="text-slate-600">Key point one</li><li class="text-slate-600">Key point two</li><li class="text-slate-600">Key point three</li></ul>`,
                  }}
                />
              </div>

              {/* Image Side */}
              <div className="flex-1 min-w-0">
                <div
                  className="relative group/image overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 shadow-lg"
                  style={{
                    borderRadius: `${imgBorderRadius}px`,
                    ...getAspectRatioStyle(),
                  }}
                >
                  {imgAspectRatio === "auto" ? (
                    <Image
                      src={imageSrc || "/placeholder.svg"}
                      alt={(sectionContent.alt as string) || "Image"}
                      width={600}
                      height={400}
                      className="w-full h-auto"
                      style={{
                        objectFit: imgObjectFit as "cover" | "contain" | "fill" | "none",
                        borderRadius: `${imgBorderRadius}px`,
                      }}
                    />
                  ) : (
                    <div className="relative w-full h-full" style={getAspectRatioStyle()}>
                      <Image
                        src={imageSrc || "/placeholder.svg"}
                        alt={(sectionContent.alt as string) || "Image"}
                        fill
                        className="transition-all duration-300"
                        style={{
                          objectFit: imgObjectFit as "cover" | "contain" | "fill" | "none",
                        }}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover/image:opacity-100">
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(section.id)}
                      className="px-4 py-2 bg-white rounded-xl shadow-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 transform scale-95 group-hover/image:scale-100"
                    >
                      <Upload className="h-4 w-4" />
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSectionStylePanel(section.id)}
                      className="px-4 py-2 bg-white rounded-xl shadow-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 transform scale-95 group-hover/image:scale-100"
                    >
                      <Settings2 className="h-4 w-4" />
                      Style
                    </button>
                  </div>
                </div>

                {/* Caption */}
                {sectionContent.caption && (
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateSectionContent(section.id, { ...sectionContent, caption: e.currentTarget.textContent })
                    }
                    className="text-sm text-slate-500 text-center mt-4 italic outline-none focus:bg-blue-50/50 rounded px-2 py-1"
                  >
                    {sectionContent.caption as string}
                  </p>
                )}
              </div>
            </div>

            {/* Image Picker Popup */}
            {showImagePicker === section.id && (
              <ImagePickerPopup
                sectionId={section.id}
                currentSrc={section.content?.src as string | null}
                onClose={() => setShowImagePicker(null)}
              />
            )}

            {/* Section Style Panel */}
            <AnimatePresence>
              {showSectionStylePanel === section.id && (
                <SectionStylePanel
                  sectionId={section.id}
                  sectionType="image"
                  currentContent={sectionContent as Record<string, unknown>}
                  currentStyle={{}}
                  imageSettings={imageSettings}
                  onStyleChange={() => {}}
                  onContentChange={(content) => updateSectionContent(section.id, content)}
                  onClose={() => setShowSectionStylePanel(null)}
                />
              )}
            </AnimatePresence>
          </div>
        )
      }

      return (
        <div className="mb-12">
          <div
            className={`relative transition-all duration-300 ${getPositionClasses()}`}
            style={{ width: `${imgWidth}%` }}
          >
            <div
              className="relative group/image overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 shadow-lg"
              style={{
                borderRadius: `${imgBorderRadius}px`,
                ...getAspectRatioStyle(),
              }}
            >
              {imgAspectRatio === "auto" ? (
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt={(sectionContent.alt as string) || "Image"}
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                  style={{
                    objectFit: imgObjectFit as "cover" | "contain" | "fill" | "none",
                    borderRadius: `${imgBorderRadius}px`,
                  }}
                />
              ) : (
                <div className="relative w-full h-full" style={getAspectRatioStyle()}>
                  <Image
                    src={imageSrc || "/placeholder.svg"}
                    alt={(sectionContent.alt as string) || "Image"}
                    fill
                    className="transition-all duration-300"
                    style={{
                      objectFit: imgObjectFit as "cover" | "contain" | "fill" | "none",
                    }}
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover/image:opacity-100">
                <button
                  type="button"
                  onClick={() => setShowImagePicker(section.id)}
                  className="px-4 py-2 bg-white rounded-xl shadow-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 transform scale-95 group-hover/image:scale-100"
                >
                  <Upload className="h-4 w-4" />
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => setShowSectionStylePanel(section.id)}
                  className="px-4 py-2 bg-white rounded-xl shadow-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 transform scale-95 group-hover/image:scale-100"
                >
                  <Settings2 className="h-4 w-4" />
                  Style
                </button>
              </div>
            </div>

            {/* Caption */}
            {sectionContent.caption && (
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  updateSectionContent(section.id, { ...sectionContent, caption: e.currentTarget.textContent })
                }
                className="text-sm text-slate-500 text-center mt-4 italic outline-none focus:bg-blue-50/50 rounded px-2 py-1"
              >
                {sectionContent.caption as string}
              </p>
            )}

            {/* Image Picker Popup */}
            {showImagePicker === section.id && (
              <ImagePickerPopup
                sectionId={section.id}
                currentSrc={section.content?.src as string | null}
                onClose={() => setShowImagePicker(null)}
              />
            )}

            {/* Section Style Panel */}
            <AnimatePresence>
              {showSectionStylePanel === section.id && (
                <SectionStylePanel
                  sectionId={section.id}
                  sectionType="image"
                  currentContent={sectionContent as Record<string, unknown>}
                  currentStyle={{}}
                  imageSettings={imageSettings}
                  onStyleChange={() => {}}
                  onContentChange={(content) => updateSectionContent(section.id, content)}
                  onClose={() => setShowSectionStylePanel(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      )
    }

    const renderPricingSection = () => {
      const items = (sectionContent.items as Array<{ name: string; price: string; description: string }>) || []
      return (
        <div className="mb-12">
          {section.title && (
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateSectionTitle(section.id, e.currentTarget.textContent || "")}
              className="text-2xl font-semibold text-slate-800 mb-6 uppercase tracking-wide outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
            >
              {section.title}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-slate-800 mb-2">{item.name}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-2">{item.price}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }

    const renderQuoteSection = () => (
      <div className="mb-12">
        <blockquote className="relative pl-8 border-l-4 border-blue-500 py-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-r-xl">
          <Quote className="absolute -left-3 -top-2 h-8 w-8 text-blue-200" />
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSectionContent(section.id, { ...sectionContent, text: e.currentTarget.textContent })}
            className="text-xl text-slate-700 italic leading-relaxed outline-none focus:bg-blue-50/50 rounded"
          >
            {(sectionContent.text as string) || "Enter your quote here..."}
          </p>
          <footer className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
            <div>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  updateSectionContent(section.id, { ...sectionContent, author: e.currentTarget.textContent })
                }
                className="font-semibold text-slate-800 outline-none focus:bg-blue-50/50 rounded"
              >
                {(sectionContent.author as string) || "Author Name"}
              </p>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  updateSectionContent(section.id, { ...sectionContent, role: e.currentTarget.textContent })
                }
                className="text-sm text-slate-500 outline-none focus:bg-blue-50/50 rounded"
              >
                {(sectionContent.role as string) || "Position, Company"}
              </p>
            </div>
          </footer>
        </blockquote>
      </div>
    )

    const renderTableSection = () => {
      const headers = (sectionContent.headers as string[]) || []
      const rows = (sectionContent.rows as string[][]) || []
      return (
        <div className="mb-12">
          {section.title && (
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateSectionTitle(section.id, e.currentTarget.textContent || "")}
              className="text-2xl font-semibold text-slate-800 mb-6 uppercase tracking-wide outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
            >
              {section.title}
            </h2>
          )}
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 text-sm text-slate-600 border-b border-slate-100">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    // Professional Block Renderers
    const renderDashboardSection = () => {
      const metrics =
        (sectionContent.metrics as Array<{
          label: string
          value: string
          change: string
          trend: "up" | "down" | "neutral"
        }>) || []
      const title = (sectionContent.title as string) || section.title || "Key Performance Indicators"
      const showChart = sectionContent.showChart !== false

      const updateMetric = (index: number, field: string, value: string) => {
        const updatedMetrics = [...metrics]
        updatedMetrics[index] = { ...updatedMetrics[index], [field]: value }
        updateSectionContent(section.id, { ...sectionContent, metrics: updatedMetrics })
      }

      return (
        <div className="mb-12">
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSectionContent(section.id, { ...sectionContent, title: e.currentTarget.textContent })}
            className="text-2xl font-bold text-slate-800 mb-6 outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
          >
            {title}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateMetric(i, "label", e.currentTarget.textContent || "")}
                  className="text-sm text-slate-500 mb-1 outline-none focus:bg-blue-50/50 rounded"
                >
                  {metric.label}
                </p>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateMetric(i, "value", e.currentTarget.textContent || "")}
                  className="text-2xl font-bold text-slate-800 outline-none focus:bg-blue-50/50 rounded"
                >
                  {metric.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : metric.trend === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-slate-400" />
                  )}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateMetric(i, "change", e.currentTarget.textContent || "")}
                    className={`text-sm font-medium outline-none focus:bg-blue-50/50 rounded ${
                      metric.trend === "up"
                        ? "text-green-600"
                        : metric.trend === "down"
                          ? "text-red-600"
                          : "text-slate-500"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {showChart && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                {(sectionContent.chartData as { title?: string })?.title || "Trend Analysis"}
              </h3>
              <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-blue-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Chart visualization</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }

    const renderTeamSection = () => {
      const members =
        (sectionContent.members as Array<{
          name: string
          role: string
          bio: string
          image?: string
        }>) || []
      const title = (sectionContent.title as string) || section.title || "Leadership Team"

      const updateMember = (index: number, field: string, value: string) => {
        const updatedMembers = [...members]
        updatedMembers[index] = { ...updatedMembers[index], [field]: value }
        updateSectionContent(section.id, { ...sectionContent, members: updatedMembers })
      }

      return (
        <div className="mb-12">
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSectionContent(section.id, { ...sectionContent, title: e.currentTarget.textContent })}
            className="text-2xl font-bold text-slate-800 mb-8 outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
          >
            {title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 shadow-lg group-hover:shadow-xl transition-shadow">
                  {member.image ? (
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                </div>
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateMember(i, "name", e.currentTarget.textContent || "")}
                  className="font-semibold text-slate-800 text-lg outline-none focus:bg-blue-50/50 rounded px-1"
                >
                  {member.name}
                </h3>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateMember(i, "role", e.currentTarget.textContent || "")}
                  className="text-blue-600 font-medium text-sm mb-2 outline-none focus:bg-blue-50/50 rounded px-1"
                >
                  {member.role}
                </p>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateMember(i, "bio", e.currentTarget.textContent || "")}
                  className="text-sm text-slate-500 leading-relaxed outline-none focus:bg-blue-50/50 rounded px-1"
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // ENHANCED COMPARISON SECTION START
    const renderComparisonSection = () => {
      const competitors = (sectionContent.competitors as string[]) || ["Us", "Competitor A", "Competitor B"]
      const features =
        (sectionContent.features as Array<{
          name: string
          values: boolean[]
        }>) || []
      const title = (sectionContent.title as string) || section.title || "Competitive Analysis"
      const subtitle = (sectionContent.subtitle as string) || "See how we compare to the competition"

      const updateCompetitor = (index: number, value: string) => {
        const updatedCompetitors = [...competitors]
        updatedCompetitors[index] = value
        updateSectionContent(section.id, { ...sectionContent, competitors: updatedCompetitors })
      }

      const updateFeatureName = (index: number, value: string) => {
        const updatedFeatures = [...features]
        updatedFeatures[index] = { ...updatedFeatures[index], name: value }
        updateSectionContent(section.id, { ...sectionContent, features: updatedFeatures })
      }

      const toggleFeatureValue = (featureIndex: number, valueIndex: number) => {
        const updatedFeatures = [...features]
        const currentValues = [...(updatedFeatures[featureIndex].values || [])]
        currentValues[valueIndex] = !currentValues[valueIndex]
        updatedFeatures[featureIndex] = { ...updatedFeatures[featureIndex], values: currentValues }
        updateSectionContent(section.id, { ...sectionContent, features: updatedFeatures })
      }

      const addFeature = () => {
        const newFeature = { name: "New Feature", values: competitors.map(() => false) }
        updateSectionContent(section.id, { ...sectionContent, features: [...features, newFeature] })
      }

      const removeFeature = (index: number) => {
        const updatedFeatures = features.filter((_, i) => i !== index)
        updateSectionContent(section.id, { ...sectionContent, features: updatedFeatures })
      }

      if (!features || features.length === 0) {
        return (
          <div className="mb-12 p-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl text-center border border-slate-200">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-2">No comparison data defined</p>
            <p className="text-slate-400 text-sm mb-4">Add features to compare against competitors</p>
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add First Feature
            </button>
          </div>
        )
      }

      return (
        <div className="mb-12">
          {/* Header */}
          <div className="mb-8">
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                updateSectionContent(section.id, { ...sectionContent, title: e.currentTarget.textContent })
              }
              className="text-3xl font-bold text-slate-800 mb-2 outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
            >
              {title}
            </h2>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                updateSectionContent(section.id, { ...sectionContent, subtitle: e.currentTarget.textContent })
              }
              className="text-slate-500 outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
            >
              {subtitle}
            </p>
          </div>

          {/* Comparison Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div
              className="grid"
              style={{ gridTemplateColumns: `minmax(200px, 2fr) repeat(${competitors.length}, 1fr)` }}
            >
              <div className="p-5 bg-slate-50 border-b border-r border-slate-200">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Features</span>
              </div>
              {competitors.map((comp, i) => (
                <div
                  key={i}
                  className={`p-5 border-b border-slate-200 text-center ${i === 0 ? "bg-blue-50" : "bg-slate-50"} ${i < competitors.length - 1 ? "border-r" : ""}`}
                >
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateCompetitor(i, e.currentTarget.textContent || "")}
                    className={`font-bold text-lg outline-none focus:bg-white/50 rounded px-2 -mx-2 ${i === 0 ? "text-blue-600" : "text-slate-700"}`}
                  >
                    {comp}
                  </div>
                  {i === 0 && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Table Body */}
            {features.map((feature, i) => (
              <div
                key={i}
                className="grid group"
                style={{ gridTemplateColumns: `minmax(200px, 2fr) repeat(${competitors.length}, 1fr)` }}
              >
                <div className="p-5 border-b border-r border-slate-100 flex items-center justify-between bg-white group-hover:bg-slate-50 transition-colors">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateFeatureName(i, e.currentTarget.textContent || "")}
                    className="text-slate-700 font-medium outline-none focus:bg-blue-50/50 rounded px-1"
                  >
                    {feature.name || "Feature"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                    title="Remove feature"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
                {(feature.values || []).map((val, j) => (
                  <div
                    key={j}
                    className={`p-5 border-b border-slate-100 flex items-center justify-center ${j === 0 ? "bg-blue-50/30" : "bg-white"} ${j < competitors.length - 1 ? "border-r" : ""} group-hover:bg-slate-50 transition-colors`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFeatureValue(i, j)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        val ? "bg-green-100 hover:bg-green-200 shadow-sm" : "bg-slate-100 hover:bg-slate-200"
                      }`}
                      title="Click to toggle"
                    >
                      {val ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-slate-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ))}

            {/* Add Feature Row */}
            <div
              className="grid"
              style={{ gridTemplateColumns: `minmax(200px, 2fr) repeat(${competitors.length}, 1fr)` }}
            >
              <div className="p-4 col-span-full">
                <button
                  type="button"
                  onClick={addFeature}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature Row
                </button>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {competitors.map((comp, i) => {
              const trueCount = features.filter((f) => f.values?.[i]).length
              const percentage = features.length > 0 ? Math.round((trueCount / features.length) * 100) : 0
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl ${i === 0 ? "bg-blue-50 border border-blue-100" : "bg-slate-50 border border-slate-100"}`}
                >
                  <div className={`text-2xl font-bold ${i === 0 ? "text-blue-600" : "text-slate-700"}`}>
                    {percentage}%
                  </div>
                  <div className="text-sm text-slate-500">
                    {comp} coverage ({trueCount}/{features.length})
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    // ENHANCED COMPARISON SECTION END

    const renderRoadmapSection = () => {
      const phases =
        (sectionContent.phases as Array<{
          name: string
          period: string
          status: string
          milestones: Array<{ task: string; complete: boolean }>
        }>) || []
      const title = (sectionContent.title as string) || section.title || "Implementation Roadmap"

      const updatePhase = (phaseIndex: number, field: string, value: string) => {
        const updatedPhases = [...phases]
        updatedPhases[phaseIndex] = { ...updatedPhases[phaseIndex], [field]: value }
        updateSectionContent(section.id, { ...sectionContent, phases: updatedPhases })
      }

      const updateMilestone = (phaseIndex: number, milestoneIndex: number, value: string) => {
        const updatedPhases = [...phases]
        const updatedMilestones = [...(updatedPhases[phaseIndex].milestones || [])]
        updatedMilestones[milestoneIndex] = { ...updatedMilestones[milestoneIndex], task: value }
        updatedPhases[phaseIndex] = { ...updatedPhases[phaseIndex], milestones: updatedMilestones }
        updateSectionContent(section.id, { ...sectionContent, phases: updatedPhases })
      }

      if (!phases || phases.length === 0) {
        return (
          <div className="mb-12 p-8 bg-slate-50 rounded-xl text-center">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No roadmap phases defined</p>
          </div>
        )
      }

      return (
        <div className="mb-12">
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSectionContent(section.id, { ...sectionContent, title: e.currentTarget.textContent })}
            className="text-2xl font-bold text-slate-800 mb-8 outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
          >
            {title}
          </h2>
          <div className="space-y-6">
            {phases.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="relative pl-8 pb-6 border-l-2 border-blue-200 last:border-l-0">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                  {phaseIndex + 1}
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updatePhase(phaseIndex, "name", e.currentTarget.textContent || "")}
                      className="text-lg font-semibold text-slate-800 outline-none focus:bg-blue-50/50 rounded px-1"
                    >
                      {phase.name || `Phase ${phaseIndex + 1}`}
                    </h3>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updatePhase(phaseIndex, "status", e.currentTarget.textContent || "")}
                      className={`px-3 py-1 rounded-full text-xs font-medium outline-none focus:ring-2 focus:ring-blue-300 ${
                        phase.status === "Complete"
                          ? "bg-green-100 text-green-700"
                          : phase.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {phase.status || "TBD"}
                    </span>
                  </div>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updatePhase(phaseIndex, "period", e.currentTarget.textContent || "")}
                    className="text-sm text-slate-500 mb-3 outline-none focus:bg-blue-50/50 rounded px-1"
                  >
                    {phase.period || "Timeline TBD"}
                  </p>
                  <ul className="space-y-2">
                    {(phase.milestones || []).map((milestone, milestoneIndex) => (
                      <li key={milestoneIndex} className="flex items-center gap-2 text-sm">
                        <div
                          className={`w-2 h-2 rounded-full ${milestone.complete ? "bg-green-500" : "bg-slate-300"}`}
                        />
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateMilestone(phaseIndex, milestoneIndex, e.currentTarget.textContent || "")}
                          className="text-slate-600 outline-none focus:bg-blue-50/50 rounded px-1"
                        >
                          {milestone.task || "Task"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    const renderTestimonialSection = () => {
      const testimonials =
        (sectionContent.testimonials as Array<{
          quote: string
          author: string
          company: string
          metric?: string
          rating?: number
        }>) || []
      const title = (sectionContent.title as string) || section.title || "Client Success Stories"

      const updateTestimonial = (index: number, field: string, value: string | number) => {
        const updatedTestimonials = [...testimonials]
        updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value }
        updateSectionContent(section.id, { ...sectionContent, testimonials: updatedTestimonials })
      }

      return (
        <div className="mb-12">
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSectionContent(section.id, { ...sectionContent, title: e.currentTarget.textContent })}
            className="text-2xl font-bold text-slate-800 mb-8 outline-none focus:bg-blue-50/50 rounded px-2 -mx-2"
          >
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`h-4 w-4 ${starIndex < (testimonial.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateTestimonial(i, "quote", e.currentTarget.textContent || "")}
                  className="text-slate-600 italic mb-4 leading-relaxed outline-none focus:bg-blue-50/50 rounded px-1"
                >
                  "{testimonial.quote}"
                </p>
                {testimonial.metric && (
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateTestimonial(i, "metric", e.currentTarget.textContent || "")}
                      className="outline-none focus:bg-green-100 rounded"
                    >
                      {testimonial.metric}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.author?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateTestimonial(i, "author", e.currentTarget.textContent || "")}
                      className="font-semibold text-slate-800 text-sm outline-none focus:bg-blue-50/50 rounded"
                    >
                      {testimonial.author}
                    </p>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateTestimonial(i, "company", e.currentTarget.textContent || "")}
                      className="text-slate-500 text-xs outline-none focus:bg-blue-50/50 rounded"
                    >
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    const renderInvestmentSection = () => {
      const tiers =
        (sectionContent.tiers as Array<{
          name: string
          amount: string
          equity?: string
          terms?: string
          features: string[]
          highlighted?: boolean
        }>) || []
      const title = (sectionContent.title as string) || section.title || "Investment Options"

      const updateTier = (index: number, field: string, value: string | boolean) => {
        const updatedTiers = [...tiers]
        updatedTiers[index] = { ...updatedTiers[index], [field]: value }
        updateSectionContent(section.id, { ...sectionContent, tiers: updatedTiers })
      }

      const updateTierFeature = (tierIndex: number, featureIndex: number, value: string) => {
        const updatedTiers = [...tiers]
        const updatedFeatures = [...(updatedTiers[tierIndex].features || [])]
        updatedFeatures[featureIndex] = value
        updatedTiers[tierIndex] = { ...updatedTiers[tierIndex], features: updatedFeatures }
        updateSectionContent(section.id, { ...sectionContent, tiers: updatedTiers })
      }

      return (
        <div className="mb-12">
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateSectionContent(section.id, { ...sectionContent, title: e.currentTarget.textContent })}
            className="text-2xl font-bold text-slate-800 mb-8 text-center outline-none focus:bg-blue-50/50 rounded px-2"
          >
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className={`rounded-xl p-6 border-2 transition-shadow ${
                  tier.highlighted
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105"
                    : "border-slate-200 bg-white hover:shadow-md"
                }`}
              >
                {tier.highlighted && (
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Recommended</div>
                )}
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateTier(i, "name", e.currentTarget.textContent || "")}
                  className="text-xl font-bold text-slate-800 mb-2 outline-none focus:bg-blue-50/50 rounded"
                >
                  {tier.name}
                </h3>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateTier(i, "amount", e.currentTarget.textContent || "")}
                  className="text-3xl font-bold text-blue-600 mb-1 outline-none focus:bg-blue-50/50 rounded"
                >
                  {tier.amount}
                </p>
                {tier.equity && (
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateTier(i, "equity", e.currentTarget.textContent || "")}
                    className="text-sm text-slate-500 mb-4 outline-none focus:bg-blue-50/50 rounded"
                  >
                    {tier.equity}
                  </p>
                )}
                {tier.terms && (
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateTier(i, "terms", e.currentTarget.textContent || "")}
                    className="text-sm text-slate-500 mb-4 outline-none focus:bg-blue-50/50 rounded"
                  >
                    {tier.terms}
                  </p>
                )}
                <ul className="space-y-2 mt-4">
                  {(tier.features || []).map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateTierFeature(i, j, e.currentTarget.textContent || "")}
                        className="text-slate-600 outline-none focus:bg-blue-50/50 rounded"
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <motion.div
        key={section.id}
        className="relative group"
        onMouseEnter={() => setHoveredSection(section.id)}
        onMouseLeave={() => setHoveredSection(null)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        {isHovered && (
          <div className="absolute -left-12 top-0 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-grab">
              <GripVertical className="h-4 w-4 text-slate-400" />
            </button>
            <button
              onClick={() => moveSection(section.id, "up")}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => moveSection(section.id, "down")}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        )}

        {isHovered && (
          <div className="absolute -right-10 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => duplicateSection(section.id)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Copy className="h-3.5 w-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => deleteSection(section.id)}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
            </button>
          </div>
        )}

        <div
          className={`transition-all duration-200 ${isHovered ? "bg-blue-50/30 -mx-4 px-4 py-2 rounded-xl ring-1 ring-blue-200/50" : ""}`}
        >
          {section.type === "hero" && renderHeroSection()}
          {section.type === "text" && renderTextSection()}
          {section.type === "image" && renderImageSection()}
          {section.type === "pricing" && renderPricingSection()}
          {section.type === "quote" && renderQuoteSection()}
          {section.type === "table" && renderTableSection()}
          {/* Professional block types */}
          {section.type === "dashboard" && renderDashboardSection()}
          {section.type === "team" && renderTeamSection()}
          {section.type === "comparison" && renderComparisonSection()}
          {section.type === "roadmap" && renderRoadmapSection()}
          {section.type === "testimonial" && renderTestimonialSection()}
          {section.type === "investment" && renderInvestmentSection()}
        </div>

        {/* Add section button (between sections) */}
        <div className="relative h-8 -my-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <button
            onClick={() => setShowAddMenu(showAddMenu === section.id ? null : section.id)}
            className="relative z-10 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <Plus className="h-3.5 w-3.5 text-slate-400" />
          </button>
          {showAddMenu === section.id && <SectionTypeMenu afterSectionId={section.id} />}
        </div>
      </motion.div>
    )
  }

  const getBackgroundStyles = () => {
    if (heroBackgroundSettings.type === "color") {
      return {
        backgroundColor: heroBackgroundSettings.backgroundColor,
      }
    }
    return {
      backgroundColor: heroBackgroundSettings.backgroundColor || "#ffffff",
    }
  }

  const getBackgroundImageStyles = () => {
    if (heroBackgroundSettings.type === "image" && heroBackgroundSettings.backgroundImage) {
      const positionMap: Record<string, string> = {
        center: "center center",
        top: "center top",
        bottom: "center bottom",
        left: "left center",
        right: "right center",
        cover: "center center",
        contain: "center center",
      }
      return {
        backgroundImage: `url(${heroBackgroundSettings.backgroundImage})`,
        backgroundSize: heroBackgroundSettings.position === "contain" ? "contain" : "cover",
        backgroundPosition: positionMap[heroBackgroundSettings.position] || "center center",
        filter:
          heroBackgroundSettings.backgroundBlur > 0 ? `blur(${heroBackgroundSettings.backgroundBlur}px)` : undefined,
      }
    }
    return {}
  }

  const getTintStyles = () => {
    if (heroBackgroundSettings.backgroundTint && heroBackgroundSettings.backgroundTint !== "transparent") {
      return {
        backgroundColor: heroBackgroundSettings.backgroundTint,
        opacity: heroBackgroundSettings.tintOpacity / 100,
        mixBlendMode: heroBackgroundSettings.tintStyle === "blend" ? ("multiply" as const) : ("normal" as const),
      }
    }
    return {}
  }

  const insertBlock = useCallback(
    (block: BlockTemplate) => {
      const currentSections = localContent?.sections || []
      const blockContent = block.content as Record<string, unknown>

      // Check if block has nested sections array (multi-section block)
      const nestedSections = blockContent?.sections as Section[] | undefined

      if (nestedSections && Array.isArray(nestedSections)) {
        // Block template has multiple sections - add them all
        const newSections = nestedSections.map((section, index) => ({
          ...section,
          id: `section-${Date.now()}-${index}`,
          order: currentSections.length + index,
        }))

        const updatedSections = [...currentSections, ...newSections]
        const newLocalContent = { ...localContent, sections: updatedSections }
        setLocalContent(newLocalContent)
        debouncedSave(newLocalContent)
      } else {
        // Block template is a single section - create from block data
        const sectionType = (blockContent?.type as Section["type"]) || "text"
        const newSection: Section = {
          id: `section-${Date.now()}`,
          type: sectionType,
          title: (blockContent?.title as string) || block.name,
          content: blockContent,
          order: currentSections.length,
        }

        const updatedSections = [...currentSections, newSection]
        const newLocalContent = { ...localContent, sections: updatedSections }
        setLocalContent(newLocalContent)
        debouncedSave(newLocalContent)
      }
    },
    [localContent, debouncedSave],
  )

  const insertImage = useCallback(
    (imageUrl: string) => {
      const currentSections = localContent?.sections || []
      const newSection: Section = {
        id: `section-${Date.now()}`,
        type: "image",
        title: "Image",
        content: {
          src: imageUrl,
          alt: "Inserted image",
          caption: "Image caption",
        },
        order: currentSections.length,
      }

      const updatedSections = [...currentSections, newSection]
      const newLocalContent = { ...localContent, sections: updatedSections }
      setLocalContent(newLocalContent)
      debouncedSave(newLocalContent)
    },
    [localContent, debouncedSave],
  )

  useImperativeHandle(
    ref,
    () => ({
      insertBlock,
      insertImage,
    }),
    [insertBlock, insertImage],
  )

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleCanvasDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      // Check for block data
      const blockData = e.dataTransfer.getData("application/json")
      if (blockData) {
        try {
          const parsed = JSON.parse(blockData)
          const block = parsed.block ? parsed.block : parsed
          console.log("[v0] handleCanvasDrop - parsed block:", block.name, "content type:", block.content?.type)
          insertBlock(block as BlockTemplate)
          return
        } catch (err) {
          console.error("Failed to parse dropped block:", err)
        }
      }

      // Check for image URL
      const imageUrl = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain")
      if (imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/"))) {
        insertImage(imageUrl)
        return
      }

      // Check for dropped files
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        if (file.type.startsWith("image/")) {
          // Create a temporary URL for the dropped image
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target && event.target.result) {
              const base64Image = event.target.result as string
              insertImage(base64Image)
            }
          }
          reader.readAsDataURL(file)
        }
      }
    },
    [insertBlock, insertImage],
  )

  return (
    <div
      className={`relative min-h-[70vh] w-full rounded-xl bg-white p-12 shadow-lg ring-1 ring-gray-200/50 ${
        isDragOver ? "ring-2 ring-blue-500 bg-blue-50/50" : ""
      }`}
      onDragOver={handleCanvasDragOver}
      onDragLeave={handleCanvasDragLeave}
      onDrop={handleCanvasDrop}
    >
      {/* Save Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        {isSaving && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white rounded-full text-xs font-medium">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </div>
        )}
        {!isSaving && lastSaved && (
          <div className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-500">
            Last saved: {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>

      {/* Hero Background Settings Panel */}
      <AnimatePresence>
        {showHeroBackgroundPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-0 right-0 h-full w-[380px] z-[9999] bg-white border-l border-slate-200 shadow-xl p-6"
          >
            <BackgroundSettingsPanel
              settings={heroBackgroundSettings}
              onChange={updateHeroBackgroundSettings}
              onClose={() => setShowHeroBackgroundPanel(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block Settings Panel */}
      <AnimatePresence>
        {showBlockSettingsPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-0 right-0 h-full w-[380px] z-[9999] bg-white border-l border-slate-200 shadow-xl p-6"
          >
            <BlockSettingsPanel
              settings={blockSettings}
              onChange={setBlockSettings}
              onClose={() => setShowBlockSettingsPanel(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas Content */}
      <div
        className="relative z-10 h-full"
        style={
          heroBackgroundSettings.type === "image"
            ? {
                ...getBackgroundStyles(),
                ...getBackgroundImageStyles(),
                ...getTintStyles(),
              }
            : getBackgroundStyles()
        }
      >
        {/* Add section button (top of canvas) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => setShowAddMenu("top")}
            className="p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <Plus className="h-5 w-5 text-slate-400" />
          </button>
          {showAddMenu === "top" && <SectionTypeMenu />}
        </div>

        {localContent?.sections?.length === 0 && !showAddMenu && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-slate-400 text-lg">
            Click '+' to add your first section
          </div>
        )}

        <div className="space-y-12">
          {localContent?.sections
            ?.sort((a, b) => a.order - b.order)
            .map((section, index) => renderSection(section, index))}
        </div>

        {/* Add section button (bottom of canvas) */}
        <div className="mt-12 relative h-8 flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <button
            onClick={() => setShowAddMenu("bottom")}
            className="relative z-10 p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <Plus className="h-5 w-5 text-slate-400" />
          </button>
          {showAddMenu === "bottom" && <SectionTypeMenu />}
        </div>
      </div>

      {/* Top Toolbar - shows contextually */}
      {editingSection && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-lg border border-slate-200/60"
        >
          <button
            onClick={() => setEditingSection(null)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <FloatingToolbar />
        </motion.div>
      )}
    </div>
  )
})
