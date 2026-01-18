"use client"

import type React from "react"
import { useState, useRef, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Play,
  BookOpen,
  Compass,
  ChevronRight,
  Upload,
  Loader2,
  Sparkles,
  Crown,
  ImageIcon,
  LayoutGrid,
  TrendingUp,
  Users,
  BarChart3,
  FileText,
  Zap,
  Star,
  Wand2,
  Bot,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StyledButton } from "@/components/ui/styled-button"
import { useMedia, useMediaUpload } from "@/hooks/use-media"
import { useToast } from "@/hooks/use-toast"
import {
  BLOCK_TEMPLATES,
  getBlocksByCategory,
  getSortedBlocks,
  type BlockTemplate,
} from "@/lib/constants/block-templates"
import { STOCK_IMAGES, getImagesByCategory } from "@/lib/constants/stock-images"

interface EditorLeftSidebarProps {
  activeTab: "all" | "blocks" | "images" | "videos"
  onTabChange: (tab: "all" | "blocks" | "images" | "videos") => void
  sidebarMode: "library" | "explore"
  onSidebarModeChange: (mode: "library" | "explore") => void
  proposalId?: string
  onInsertBlock?: (block: BlockTemplate) => void
  onInsertImage?: (imageUrl: string) => void
}

const blockCategories = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "header", label: "Headers", icon: FileText },
  { id: "content", label: "Content", icon: FileText },
  { id: "pricing", label: "Pricing", icon: BarChart3 },
  { id: "testimonial", label: "Testimonials", icon: Users },
  { id: "cta", label: "CTAs", icon: Zap },
  { id: "data", label: "Data", icon: TrendingUp },
]

const imageCategories = [
  { id: "all", label: "All" },
  { id: "business", label: "Business" },
  { id: "technology", label: "Technology" },
  { id: "team", label: "Team" },
  { id: "charts", label: "Charts" },
  { id: "abstract", label: "Abstract" },
]

const videos = [
  { id: "1", thumbnail: "/business-presentation-video.png", duration: "00:55", name: "Business Intro" },
  { id: "2", thumbnail: "/product-demo-video.png", duration: "00:30", name: "Product Demo" },
  { id: "3", thumbnail: "/team-introduction-video.jpg", duration: "01:15", name: "Team Intro" },
  { id: "4", thumbnail: "/explainer-animation-video.jpg", duration: "02:00", name: "Explainer" },
]

// AI Block Generator Component (keep as is)
function AIBlockGenerator({ onInsertBlock }: { onInsertBlock?: (block: BlockTemplate) => void }) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBlocks, setGeneratedBlocks] = useState<BlockTemplate[]>([])
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.success && data.block) {
        const newBlock: BlockTemplate = {
          id: data.block.id,
          name: data.block.name,
          description: `AI Generated: ${prompt.slice(0, 50)}...`,
          category: data.block.type as BlockTemplate["category"],
          preview_url: "/placeholder.svg?height=120&width=200",
          is_premium: false,
          content: {
            type: data.block.type === "hero" ? "hero" : "text",
            title: data.block.content.title,
            subtitle: data.block.content.subtitle,
            text: data.block.content.text,
            bulletPoints: data.block.content.bulletPoints,
            callToAction: data.block.content.callToAction,
          },
        }

        setGeneratedBlocks((prev) => [newBlock, ...prev].slice(0, 6))
        toast({
          title: "Block generated!",
          description: "Click on the block to add it to your proposal.",
        })
      }
    } catch (error) {
      console.error("Failed to generate block:", error)
      toast({
        title: "Generation failed",
        description: "Please try again with a different prompt.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          placeholder="Describe the block you want to create... e.g., 'A compelling hero section for a SaaS product launch'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px] pr-12 text-sm bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 focus:border-violet-400 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              handleGenerate()
            }
          }}
        />
        <StyledButton
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
        </StyledButton>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {["Hero section", "Feature list", "Pricing table", "Testimonial", "Call to action"].map((quickPrompt) => (
          <button
            key={quickPrompt}
            onClick={() => setPrompt(quickPrompt)}
            className="px-2 py-1 text-[10px] font-medium bg-violet-100 text-violet-600 rounded-full hover:bg-violet-200 transition-colors"
          >
            {quickPrompt}
          </button>
        ))}
      </div>

      {generatedBlocks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">Recently Generated</p>
          <div className="grid grid-cols-2 gap-2">
            {generatedBlocks.map((block) => (
              <motion.div
                key={block.id}
                onClick={() => onInsertBlock?.(block)}
                className="group cursor-pointer relative"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-violet-100 to-purple-100 border border-violet-200 group-hover:border-violet-400 group-hover:shadow-lg transition-all relative flex items-center justify-center">
                  <div className="text-center p-2">
                    <Sparkles className="h-6 w-6 text-violet-400 mx-auto mb-1" />
                    <p className="text-[10px] text-violet-600 font-medium line-clamp-2">{block.name}</p>
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-violet-400 to-purple-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5">
                    <Bot className="h-2.5 w-2.5" />
                    AI
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// AI Image Generator Component (keep as is)
function AIImageGenerator({ onInsertImage }: { onInsertImage?: (imageUrl: string) => void }) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<{ url: string; prompt: string }[]>([])
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      // Check if response is OK first
      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] AI Image API error:", response.status, errorText)
        throw new Error(`API error: ${response.status}`)
      }

      // Get response as text first to handle empty responses
      const responseText = await response.text()
      if (!responseText || responseText.trim() === "") {
        console.error("[v0] AI Image API returned empty response")
        throw new Error("Empty response from API")
      }

      // Parse JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("[v0] Failed to parse AI Image response:", responseText.slice(0, 200))
        throw new Error("Invalid JSON response from API")
      }

      if (data.success && data.image) {
        let imageUrl: string

        if (data.image.base64) {
          imageUrl = `data:${data.image.mediaType};base64,${data.image.base64}`
        } else {
          imageUrl = data.image.url
        }

        setGeneratedImages((prev) => [{ url: imageUrl, prompt }, ...prev].slice(0, 8))
        toast({
          title: "Image generated!",
          description:
            data.image.source === "vertex-ai-imagen-3" ? "AI-generated image added." : "Image found and added.",
        })
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        throw new Error("No image in response")
      }
    } catch (error) {
      console.error("Failed to generate image:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again with a different prompt.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          placeholder="Describe the image you want... e.g., 'A modern office with diverse team collaborating'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px] pr-12 text-sm bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 focus:border-emerald-400 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              handleGenerate()
            }
          }}
        />
        <StyledButton
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        </StyledButton>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {["Business meeting", "Data chart", "Modern office", "Team photo", "Abstract pattern"].map((quickPrompt) => (
          <button
            key={quickPrompt}
            onClick={() => setPrompt(quickPrompt)}
            className="px-2 py-1 text-[10px] font-medium bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors"
          >
            {quickPrompt}
          </button>
        ))}
      </div>

      {generatedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">Recently Generated</p>
          <div className="grid grid-cols-2 gap-2">
            {generatedImages.map((image, index) => (
              <motion.div
                key={index}
                onClick={() => onInsertImage?.(image.url)}
                className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all relative group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src={image.url || "/placeholder.svg"} alt={image.prompt} className="w-full h-full object-cover" />
                <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5">
                  <Bot className="h-2.5 w-2.5" />
                  AI
                </div>
                <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function EditorLeftSidebar({
  activeTab,
  onTabChange,
  sidebarMode,
  onSidebarModeChange,
  proposalId,
  onInsertBlock,
  onInsertImage,
}: EditorLeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [blockCategory, setBlockCategory] = useState("all")
  const [imageCategory, setImageCategory] = useState("all")
  const [imageSubTab, setImageSubTab] = useState<"stock" | "uploaded" | "ai">("stock")
  const [showAIBlocks, setShowAIBlocks] = useState(false)
  const [showAllBlocks, setShowAllBlocks] = useState(false)
  const [showAllImages, setShowAllImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter blocks based on category and search query
  const filteredBlocks = useMemo(() => {
    let blocks = blockCategory === "all" ? BLOCK_TEMPLATES : getBlocksByCategory(blockCategory)
    if (searchQuery) {
      blocks = blocks.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    return getSortedBlocks(blocks)
  }, [blockCategory, searchQuery])

  // Filter stock images based on category and search query
  const filteredStockImages = useMemo(() => {
    let images = imageCategory === "all" ? STOCK_IMAGES : getImagesByCategory(imageCategory)
    if (searchQuery) {
      images = images.filter(
        (img) =>
          img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }
    return images
  }, [imageCategory, searchQuery])

  // Keep uploaded images from backend (user-specific)
  const { assets: uploadedImages, mutate: mutateMedia } = useMedia({
    proposalId,
    fileType: "image",
  })

  const { upload, isUploading, progress, error: uploadError } = useMediaUpload()

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          alert("Please upload only image files")
          continue
        }

        try {
          await upload(file, proposalId)
          mutateMedia()
        } catch (err) {
          console.error("Upload failed:", err)
        }
      }
    },
    [upload, proposalId, mutateMedia],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileUpload(e.dataTransfer.files)
    },
    [handleFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleBlockClick = (block: BlockTemplate) => {
    if (onInsertBlock) {
      onInsertBlock(block)
    }
  }

  const handleImageClick = (imageUrl: string) => {
    if (onInsertImage) {
      onInsertImage(imageUrl)
    }
  }

  const tabs = [
    { id: "all" as const, label: "All" },
    { id: "blocks" as const, label: "Blocks" },
    { id: "images" as const, label: "Images" },
    { id: "videos" as const, label: "Videos" },
  ]

  const displayedBlocks = showAllBlocks ? filteredBlocks : filteredBlocks.slice(0, 6)
  const displayedStockImages = showAllImages ? filteredStockImages : filteredStockImages.slice(0, 8)

  return (
    <aside className="w-72 h-full bg-white/95 backdrop-blur-xl border-r border-slate-200/60 flex flex-col flex-shrink-0 overflow-hidden">
      {/* Mode Tabs */}
      <div className="p-3 border-b border-slate-200/60 flex-shrink-0">
        <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
          <StyledButton
            variant={sidebarMode === "library" ? "favourite" : "ghost"}
            size="sm"
            onClick={() => onSidebarModeChange("library")}
            className="flex-1 gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Library
          </StyledButton>
          <StyledButton
            variant={sidebarMode === "explore" ? "favourite" : "ghost"}
            size="sm"
            onClick={() => onSidebarModeChange("explore")}
            className="flex-1 gap-2"
          >
            <Compass className="h-4 w-4" />
            Explore
          </StyledButton>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-slate-200/60 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search blocks, images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-slate-50 border-slate-200 text-slate-700 text-sm rounded-xl placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200/60 px-4 flex-shrink-0">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 px-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 rounded-full"
                layoutId="activeFilterTab"
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {sidebarMode === "library" ? (
          <>
            {/* Blocks Section */}
            {(activeTab === "all" || activeTab === "blocks") && (
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-blue-500" />
                    Blocks
                    <span className="text-xs text-slate-400">({filteredBlocks.length})</span>
                  </h3>
                  <StyledButton
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs gap-1"
                    onClick={() => setShowAllBlocks(!showAllBlocks)}
                  >
                    {showAllBlocks ? "Show less" : "View all"}
                    <ChevronRight className={`h-3 w-3 transition-transform ${showAllBlocks ? "rotate-90" : ""}`} />
                  </StyledButton>
                </div>

                <div className="flex gap-1 mb-3">
                  <button
                    onClick={() => setShowAIBlocks(false)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                      !showAIBlocks ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <LayoutGrid className="h-3 w-3" />
                    Library
                  </button>
                  <button
                    onClick={() => setShowAIBlocks(true)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                      showAIBlocks
                        ? "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    AI Generate
                  </button>
                </div>

                {showAIBlocks ? (
                  <AIBlockGenerator onInsertBlock={onInsertBlock} />
                ) : (
                  <>
                    {/* Block Category Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {blockCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setBlockCategory(cat.id)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                            blockCategory === cat.id
                              ? "bg-blue-100 text-blue-700 shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Blocks Grid - No loading state needed for frontend data */}
                    {displayedBlocks.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <LayoutGrid className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No blocks found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {displayedBlocks.map((block) => (
                          <motion.div
                            key={block.id}
                            onClick={() => handleBlockClick(block)}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("application/json", JSON.stringify(block))
                              e.dataTransfer.effectAllowed = "copy"
                            }}
                            className="group cursor-pointer relative"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-blue-400 group-hover:shadow-lg transition-all relative">
                              {/* Block Preview Image */}
                              <img
                                src={block.preview_url || "/placeholder.svg?height=120&width=200"}
                                alt={block.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Premium Badge */}
                              {block.is_premium && (
                                <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 shadow-sm">
                                  <Crown className="h-2.5 w-2.5" />
                                  PRO
                                </div>
                              )}
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-blue-600 bg-white/90 px-2 py-1 rounded-full shadow-sm transition-opacity">
                                  + Add or Drag
                                </span>
                              </div>
                            </div>
                            <p className="mt-1.5 text-xs font-medium text-slate-700 truncate">{block.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{block.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Images Section */}
            {(activeTab === "all" || activeTab === "images") && (
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-emerald-500" />
                    Images
                  </h3>
                  <div className="flex items-center gap-1">
                    <StyledButton
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => {
                        setImageSubTab("uploaded")
                        fileInputRef.current?.click()
                      }}
                    >
                      <Upload className="h-3 w-3" />
                      Upload
                    </StyledButton>
                    <StyledButton
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs gap-1"
                      onClick={() => setShowAllImages(!showAllImages)}
                    >
                      {showAllImages ? "Show less" : "View all"}
                      <ChevronRight className={`h-3 w-3 transition-transform ${showAllImages ? "rotate-90" : ""}`} />
                    </StyledButton>
                  </div>
                </div>

                {/* Image Sub-tabs */}
                <div className="flex gap-1 mb-3">
                  <button
                    onClick={() => setImageSubTab("stock")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      imageSubTab === "stock"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Stock
                  </button>
                  <button
                    onClick={() => setImageSubTab("uploaded")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      imageSubTab === "uploaded"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Uploaded
                  </button>
                  <button
                    onClick={() => setImageSubTab("ai")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      imageSubTab === "ai"
                        ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </span>
                  </button>
                </div>

                {imageSubTab === "stock" && (
                  <>
                    {/* Image Category Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {imageCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setImageCategory(cat.id)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                            imageCategory === cat.id
                              ? "bg-emerald-100 text-emerald-700 shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Stock Images Grid - No loading state for frontend data */}
                    <div className="grid grid-cols-2 gap-2">
                      {displayedStockImages.map((image) => (
                        <motion.div
                          key={image.id}
                          onClick={() => handleImageClick(image.url)}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "application/json",
                              JSON.stringify({ type: "image", url: image.url }),
                            )
                            e.dataTransfer.effectAllowed = "copy"
                          }}
                          className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all relative group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                          {image.is_premium && (
                            <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5">
                              <Crown className="h-2.5 w-2.5" />
                              PRO
                            </div>
                          )}
                          <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}

                {imageSubTab === "uploaded" && (
                  <>
                    {/* Upload Area */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`border-2 border-dashed rounded-lg p-4 text-center mb-3 transition-all ${
                        isDragging
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      {isUploading ? (
                        <div className="py-2">
                          <Loader2 className="h-6 w-6 animate-spin text-emerald-500 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">Uploading... {progress}%</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">
                            Drop images here or{" "}
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-emerald-600 hover:underline font-medium"
                            >
                              browse
                            </button>
                          </p>
                        </>
                      )}
                    </div>

                    {uploadError && (
                      <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                        Upload failed: {uploadError}
                      </div>
                    )}

                    {/* Uploaded Images Grid */}
                    {uploadedImages && uploadedImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {uploadedImages.map((image) => (
                          <motion.div
                            key={image.id}
                            onClick={() => handleImageClick(image.file_url)}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                "application/json",
                                JSON.stringify({ type: "image", url: image.file_url }),
                              )
                              e.dataTransfer.effectAllowed = "copy"
                            }}
                            className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all relative group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <img
                              src={image.file_url || "/placeholder.svg"}
                              alt={image.file_name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors" />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-slate-400">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No uploaded images yet</p>
                      </div>
                    )}
                  </>
                )}

                {imageSubTab === "ai" && <AIImageGenerator onInsertImage={onInsertImage} />}
              </div>
            )}

            {/* Videos Section */}
            {(activeTab === "all" || activeTab === "videos") && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Play className="h-4 w-4 text-purple-500" />
                    Videos
                  </h3>
                  <StyledButton variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                    View all
                    <ChevronRight className="h-3 w-3" />
                  </StyledButton>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {videos.map((video) => (
                    <motion.div
                      key={video.id}
                      className="aspect-video rounded-lg overflow-hidden cursor-pointer relative group bg-slate-100"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Play className="h-4 w-4 text-slate-800 ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        {video.duration}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Explore Mode */
          <div className="p-4 space-y-6">
            {/* Trending Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                Trending
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {getSortedBlocks(BLOCK_TEMPLATES)
                  .filter((b) => b.is_premium)
                  .slice(0, 4)
                  .map((block) => (
                    <motion.div
                      key={block.id}
                      onClick={() => handleBlockClick(block)}
                      className="group cursor-pointer relative"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-orange-400 group-hover:shadow-lg transition-all relative">
                        <img
                          src={block.preview_url || "/placeholder.svg?height=120&width=200"}
                          alt={block.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-white/90 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-amber-600">
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          4.9
                        </div>
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-slate-700 truncate">{block.name}</p>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Suggested for You
              </h3>
              <p className="text-xs text-slate-500 mb-3">Based on your current proposal</p>
              <div className="space-y-2">
                {BLOCK_TEMPLATES.filter((b) => b.category === "data" || b.category === "testimonial")
                  .slice(0, 3)
                  .map((block) => (
                    <motion.div
                      key={block.id}
                      onClick={() => handleBlockClick(block)}
                      className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer transition-all group"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={block.preview_url || "/placeholder.svg?height=48&width=48"}
                          alt={block.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">{block.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{block.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 transition-colors" />
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Industry Templates */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-blue-500" />
                By Industry
              </h3>
              <div className="flex flex-wrap gap-2">
                {["SaaS", "Agency", "Consulting", "E-commerce", "Healthcare", "Finance"].map((industry) => (
                  <button
                    key={industry}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="p-4 border-t border-slate-200/60 bg-gradient-to-br from-slate-50 to-white flex-shrink-0">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
            <AvatarImage src="/helpful-assistant-avatar.jpg" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
              AI
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-800">NEED HELP?</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Click to talk with someone or look at our help docs</p>
            <StyledButton size="sm" className="mt-2 h-7 text-xs">
              Get Help
            </StyledButton>
          </div>
        </div>
      </div>
    </aside>
  )
}
