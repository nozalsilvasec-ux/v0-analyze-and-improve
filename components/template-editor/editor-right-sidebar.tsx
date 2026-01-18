"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  MessageCircle,
  ChevronDown,
  Settings,
  PenLine,
  Send,
  Check,
  X,
  Palette,
  ImageIcon,
  Upload,
  Trash2,
} from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

interface EditorRightSidebarProps {
  sectionType: "static" | "customizable"
  onSectionTypeChange: (type: "static" | "customizable") => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  contextPrompt: string
  onContextPromptChange: (prompt: string) => void
  onClose: () => void
  pageSettings?: {
    backgroundColor: string
    backgroundImage: string | null
    backgroundOpacity: number
  }
  onPageSettingsChange?: (settings: {
    backgroundColor: string
    backgroundImage: string | null
    backgroundOpacity: number
  }) => void
}

const availableTags = ["Business", "Pricing", "Technology", "Custom", "Process"]

const writingSuggestions = [
  "Add market analysis data and competitive positioning.",
  "Include methodology breakdown and technical specifications.",
  "Generate ROI projections and success metrics.",
]

const colorPalette = [
  { name: "White", value: "#ffffff" },
  { name: "Slate", value: "#f8fafc" },
  { name: "Gray", value: "#f3f4f6" },
  { name: "Blue Tint", value: "#eff6ff" },
  { name: "Green Tint", value: "#f0fdf4" },
  { name: "Purple Tint", value: "#faf5ff" },
  { name: "Amber Tint", value: "#fffbeb" },
  { name: "Rose Tint", value: "#fff1f2" },
]

const stockBackgrounds = [
  { name: "Abstract Gradient", url: "/abstract-gradient-blue-purple.png" },
  { name: "Geometric Pattern", url: "/geometric-pattern-minimal.jpg" },
  { name: "Paper Texture", url: "/paper-texture-subtle.jpg" },
  { name: "Watercolor", url: "/watercolor-soft-pastel-background.jpg" },
]

export function EditorRightSidebar({
  sectionType,
  onSectionTypeChange,
  selectedTags,
  onTagsChange,
  contextPrompt,
  onContextPromptChange,
  onClose,
  pageSettings = { backgroundColor: "#ffffff", backgroundImage: null, backgroundOpacity: 100 },
  onPageSettingsChange,
}: EditorRightSidebarProps) {
  const [assistantExpanded, setAssistantExpanded] = useState(true)
  const [pageSettingsExpanded, setPageSettingsExpanded] = useState(true)
  const [activeSettingsTab, setActiveSettingsTab] = useState<"color" | "image">("color")

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleColorChange = (color: string) => {
    onPageSettingsChange?.({
      ...pageSettings,
      backgroundColor: color,
    })
  }

  const handleBackgroundImageChange = (url: string | null) => {
    onPageSettingsChange?.({
      ...pageSettings,
      backgroundImage: url,
    })
  }

  const handleOpacityChange = (opacity: number) => {
    onPageSettingsChange?.({
      ...pageSettings,
      backgroundOpacity: opacity,
    })
  }

  return (
    <aside className="w-80 h-full bg-white/90 backdrop-blur-xl border-l border-slate-200/60 flex flex-col flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/60 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-slate-400" />
          <h2 className="font-semibold text-slate-800 text-sm">Page Settings</h2>
        </div>
        <StyledButton variant="ghost" size="icon" onClick={onClose} className="w-8 h-8">
          <X className="h-4 w-4 text-slate-400" />
        </StyledButton>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar space-y-6">
        <div>
          <StyledButton
            variant="ghost"
            onClick={() => setPageSettingsExpanded(!pageSettingsExpanded)}
            className="flex items-center justify-between w-full mb-3 px-0"
          >
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Page Background</h3>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${pageSettingsExpanded ? "rotate-180" : ""}`}
            />
          </StyledButton>

          <AnimatePresence>
            {pageSettingsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                {/* Tabs for Color/Image */}
                <div className="flex rounded-lg bg-slate-100 p-1">
                  <button
                    onClick={() => setActiveSettingsTab("color")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                      activeSettingsTab === "color"
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Palette className="h-3.5 w-3.5" />
                    Color
                  </button>
                  <button
                    onClick={() => setActiveSettingsTab("image")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                      activeSettingsTab === "image"
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Image
                  </button>
                </div>

                {activeSettingsTab === "color" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">Select a background color</p>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPalette.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => handleColorChange(color.value)}
                          className={`group relative aspect-square rounded-lg border-2 transition-all ${
                            pageSettings.backgroundColor === color.value
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {pageSettings.backgroundColor === color.value && (
                            <Check className="absolute inset-0 m-auto h-4 w-4 text-blue-500" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-slate-500">Custom:</span>
                      <input
                        type="color"
                        value={pageSettings.backgroundColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={pageSettings.backgroundColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md font-mono"
                      />
                    </div>
                  </div>
                )}

                {activeSettingsTab === "image" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">Set a background image</p>

                    {/* Upload Button */}
                    <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                      <Upload className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-500">Upload Image</span>
                      <input type="file" accept="image/*" className="hidden" />
                    </label>

                    {/* Stock Backgrounds */}
                    <div className="grid grid-cols-2 gap-2">
                      {stockBackgrounds.map((bg) => (
                        <button
                          key={bg.name}
                          onClick={() => handleBackgroundImageChange(bg.url)}
                          className={`relative aspect-[3/2] rounded-lg overflow-hidden border-2 transition-all ${
                            pageSettings.backgroundImage === bg.url
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Image src={bg.url || "/placeholder.svg"} alt={bg.name} fill className="object-cover" />
                          {pageSettings.backgroundImage === bg.url && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <Check className="h-5 w-5 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Clear Background Image */}
                    {pageSettings.backgroundImage && (
                      <StyledButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBackgroundImageChange(null)}
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Remove Background Image
                      </StyledButton>
                    )}

                    {/* Opacity Slider */}
                    {pageSettings.backgroundImage && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Image Opacity</span>
                          <span className="text-xs font-medium text-slate-700">{pageSettings.backgroundOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={pageSettings.backgroundOpacity}
                          onChange={(e) => handleOpacityChange(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section Type */}
        <div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Section Type</h3>
          <div className="flex rounded-lg bg-slate-100 p-1">
            <StyledButton
              variant={sectionType === "static" ? "favourite" : "ghost"}
              size="sm"
              onClick={() => onSectionTypeChange("static")}
              className="flex-1"
            >
              Static
            </StyledButton>
            <StyledButton
              variant={sectionType === "customizable" ? "favourite" : "ghost"}
              size="sm"
              onClick={() => onSectionTypeChange("customizable")}
              className="flex-1"
            >
              AI Customizable
            </StyledButton>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Available Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <StyledButton
                key={tag}
                variant={selectedTags.includes(tag) ? "sketch" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className="h-8"
              >
                {selectedTags.includes(tag) && <Check className="h-3 w-3 mr-1" />}
                {tag}
              </StyledButton>
            ))}
          </div>
        </div>

        {/* Collaboration */}
        <div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Collaboration</h3>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="h-9 w-9 border-2 border-white shadow-sm">
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-violet-500 text-white font-medium">
                  {["JD", "MK", "AS"][i - 1]}
                </AvatarFallback>
              </Avatar>
            ))}
            <StyledButton variant="backdrop-blur" size="icon" className="h-9 w-9 rounded-full border-dashed">
              <Plus className="h-4 w-4" />
            </StyledButton>
          </div>
        </div>

        {/* Context Prompt */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide">AI Context Prompt</h3>
          </div>
          <Textarea
            placeholder="Describe the client's pain points here..."
            value={contextPrompt}
            onChange={(e) => onContextPromptChange(e.target.value)}
            className="min-h-[80px] bg-slate-50 border-slate-200 text-slate-700 text-sm resize-none rounded-lg placeholder:text-slate-400"
          />
        </div>

        {/* Writing Assistant */}
        <div>
          <StyledButton
            variant="ghost"
            onClick={() => setAssistantExpanded(!assistantExpanded)}
            className="flex items-center justify-between w-full mb-3 px-0"
          >
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Writing Assistant</h3>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${assistantExpanded ? "rotate-180" : ""}`}
            />
          </StyledButton>
          <AnimatePresence>
            {assistantExpanded && (
              <motion.div
                className="space-y-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {writingSuggestions.map((suggestion, index) => (
                  <StyledButton
                    key={index}
                    variant="nextjs-white"
                    className="w-full text-left p-3 h-auto justify-start text-xs"
                  >
                    {suggestion}
                  </StyledButton>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate Button */}
        <StyledButton variant="magic" className="w-full h-12">
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Generate Content
          </span>
        </StyledButton>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/60 flex-shrink-0 flex items-center gap-2">
        <StyledButton variant="unapologetic" className="flex-1">
          Save Template
        </StyledButton>
        <StyledButton variant="secondary" size="icon">
          <Settings className="h-4 w-4 text-slate-500" />
        </StyledButton>
      </div>
    </aside>
  )
}
