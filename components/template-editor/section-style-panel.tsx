"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Type, ImageIcon, Palette, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Square, RectangleHorizontal, RectangleVertical, Check, LayoutTemplate, ImageIcon as ImageIconAlt, FileText } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface SectionStylePanelProps {
  sectionId: string
  sectionType: string
  currentContent: Record<string, unknown>
  currentStyle: {
    backgroundColor?: string
    backgroundImage?: string | null
    textColor?: string
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    fontStyle?: string
    textAlign?: string
    textDecoration?: string
  }
  imageSettings?: {
    width?: number
    height?: number
    aspectRatio?: string
    objectFit?: string
    borderRadius?: number
    position?: "left" | "center" | "right"
    layout?: "full" | "with-text-left" | "with-text-right"
    overlayText?: string
    overlayTextPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  }
  onStyleChange: (style: Record<string, unknown>) => void
  onContentChange: (content: Record<string, unknown>) => void
  onClose: () => void
}

const fontFamilies = [
  { name: "System Default", value: "system-ui, sans-serif" },
  { name: "Inter", value: "'Inter', sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Roboto Mono", value: "'Roboto Mono', monospace" },
  { name: "Merriweather", value: "'Merriweather', serif" },
]

const fontSizes = [
  { name: "Small", value: "14px" },
  { name: "Normal", value: "16px" },
  { name: "Medium", value: "18px" },
  { name: "Large", value: "20px" },
  { name: "XL", value: "24px" },
  { name: "2XL", value: "30px" },
]

const colorPresets = [
  { name: "Black", value: "#000000" },
  { name: "Dark Gray", value: "#374151" },
  { name: "Gray", value: "#6B7280" },
  { name: "Light Gray", value: "#9CA3AF" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#059669" },
  { name: "Red", value: "#DC2626" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Orange", value: "#EA580C" },
  { name: "White", value: "#FFFFFF" },
]

const backgroundPresets = [
  { name: "White", value: "#FFFFFF" },
  { name: "Off White", value: "#F9FAFB" },
  { name: "Light Gray", value: "#F3F4F6" },
  { name: "Blue Tint", value: "#EFF6FF" },
  { name: "Green Tint", value: "#F0FDF4" },
  { name: "Yellow Tint", value: "#FEFCE8" },
  { name: "Purple Tint", value: "#FAF5FF" },
  { name: "Rose Tint", value: "#FFF1F2" },
  { name: "Transparent", value: "transparent" },
]

const aspectRatios = [
  { name: "Auto", value: "auto", icon: Square },
  { name: "16:9", value: "16/9", icon: RectangleHorizontal },
  { name: "4:3", value: "4/3", icon: RectangleHorizontal },
  { name: "1:1", value: "1/1", icon: Square },
  { name: "3:4", value: "3/4", icon: RectangleVertical },
  { name: "9:16", value: "9/16", icon: RectangleVertical },
]

const objectFitOptions = [
  { name: "Cover", value: "cover" },
  { name: "Contain", value: "contain" },
  { name: "Fill", value: "fill" },
  { name: "None", value: "none" },
]

const layoutOptions = [
  { name: "Full Width", value: "full", icon: ImageIconAlt, description: "Image spans full width" },
  { name: "Text Left", value: "with-text-left", icon: LayoutTemplate, description: "Text on left, image on right" },
  { name: "Text Right", value: "with-text-right", icon: LayoutTemplate, description: "Image on left, text on right" },
]

const overlayPositions = [
  { name: "Top Left", value: "top-left" },
  { name: "Top Right", value: "top-right" },
  { name: "Center", value: "center" },
  { name: "Bottom Left", value: "bottom-left" },
  { name: "Bottom Right", value: "bottom-right" },
]

export function SectionStylePanel({
  sectionId,
  sectionType,
  currentContent,
  currentStyle,
  imageSettings = {},
  onStyleChange,
  onContentChange,
  onClose,
}: SectionStylePanelProps) {
  const [activeTab, setActiveTab] = useState<"layout" | "image" | "text" | "background">(
    sectionType === "image" ? "layout" : "text",
  )

  const updateImageSettings = (updates: Partial<typeof imageSettings>) => {
    const newSettings = { ...imageSettings, ...updates }
    onContentChange({
      ...currentContent,
      imageSettings: newSettings,
    })
  }

  const updateSideText = (text: string) => {
    onContentChange({
      ...currentContent,
      sideText: text,
    })
  }

  const updateTextStyle = (updates: Partial<typeof currentStyle>) => {
    console.log("[v0] updateTextStyle called with updates:", updates)
    console.log("[v0] current textStyle:", currentContent.textStyle)
    const newTextStyle = { ...((currentContent.textStyle as Record<string, unknown>) || {}), ...updates }
    console.log("[v0] new textStyle:", newTextStyle)
    onStyleChange({ ...currentStyle, ...updates })
    onContentChange({
      ...currentContent,
      textStyle: newTextStyle,
    })
  }

  const tabs =
    sectionType === "image"
      ? [
          { id: "layout" as const, label: "Layout", icon: LayoutTemplate },
          { id: "image" as const, label: "Image", icon: ImageIcon },
          { id: "text" as const, label: "Text", icon: Type },
          { id: "background" as const, label: "Background", icon: Palette },
        ]
      : [
          { id: "text" as const, label: "Text", icon: Type },
          { id: "background" as const, label: "Background", icon: Palette },
        ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800">Section Styling</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {activeTab === "layout" && sectionType === "image" && (
          <div className="space-y-5">
            {/* Layout Mode */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">Layout Mode</Label>
              <div className="space-y-2">
                {layoutOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateImageSettings({ layout: option.value as "full" | "with-text-left" | "with-text-right" })
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      (imageSettings.layout || "full") === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        (imageSettings.layout || "full") === option.value ? "bg-blue-100" : "bg-slate-100"
                      }`}
                    >
                      <option.icon
                        className={`h-5 w-5 ${
                          (imageSettings.layout || "full") === option.value ? "text-blue-600" : "text-slate-500"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p
                        className={`font-medium ${
                          (imageSettings.layout || "full") === option.value ? "text-blue-700" : "text-slate-700"
                        }`}
                      >
                        {option.name}
                      </p>
                      <p className="text-xs text-slate-500">{option.description}</p>
                    </div>
                    {(imageSettings.layout || "full") === option.value && (
                      <Check className="h-5 w-5 text-blue-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Side Text Editor (only when layout has text) */}
            {(imageSettings.layout === "with-text-left" || imageSettings.layout === "with-text-right") && (
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                  <FileText className="h-4 w-4 inline mr-1.5" />
                  Side Text Content
                </Label>
                <textarea
                  value={(currentContent.sideText as string) || ""}
                  onChange={(e) => updateSideText(e.target.value)}
                  placeholder="Enter text to display beside the image..."
                  className="w-full h-32 p-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  This text will appear{" "}
                  {imageSettings.layout === "with-text-left" ? "on the left side" : "on the right side"} of the image.
                </p>
              </div>
            )}

            {/* Image Position (only for full width layout) */}
            {(!imageSettings.layout || imageSettings.layout === "full") && (
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">Image Position</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["left", "center", "right"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => updateImageSettings({ position: pos })}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all ${
                        (imageSettings.position || "center") === pos
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      {pos === "left" && <AlignLeft className="h-4 w-4" />}
                      {pos === "center" && <AlignCenter className="h-4 w-4" />}
                      {pos === "right" && <AlignRight className="h-4 w-4" />}
                      <span className="text-sm font-medium capitalize">{pos}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Tab */}
        {activeTab === "image" && sectionType === "image" && (
          <div className="space-y-5">
            {/* Image Width */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-slate-700">Image Width</Label>
                <span className="text-sm text-blue-600 font-medium">{imageSettings.width || 100}%</span>
              </div>
              <Slider
                value={[imageSettings.width || 100]}
                onValueChange={([value]) => updateImageSettings({ width: value })}
                min={25}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>25%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Aspect Ratio</Label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => updateImageSettings({ aspectRatio: ratio.value })}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${
                      (imageSettings.aspectRatio || "16/9") === ratio.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <ratio.icon
                      className={`h-5 w-5 ${
                        (imageSettings.aspectRatio || "16/9") === ratio.value ? "text-blue-600" : "text-slate-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        (imageSettings.aspectRatio || "16/9") === ratio.value ? "text-blue-700" : "text-slate-600"
                      }`}
                    >
                      {ratio.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Object Fit */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Image Fit</Label>
              <div className="grid grid-cols-2 gap-2">
                {objectFitOptions.map((fit) => (
                  <button
                    key={fit.value}
                    onClick={() => updateImageSettings({ objectFit: fit.value })}
                    className={`p-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      (imageSettings.objectFit || "cover") === fit.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    {fit.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-slate-700">Corner Radius</Label>
                <span className="text-sm text-blue-600 font-medium">{imageSettings.borderRadius || 16}px</span>
              </div>
              <Slider
                value={[imageSettings.borderRadius || 16]}
                onValueChange={([value]) => updateImageSettings({ borderRadius: value })}
                min={0}
                max={48}
                step={4}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Text Tab */}
        {activeTab === "text" && (
          <div className="space-y-5">
            {/* Font Family */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Font Family</Label>
              <select
                value={currentStyle.fontFamily || "system-ui, sans-serif"}
                onChange={(e) => updateTextStyle({ fontFamily: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fontFamilies.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Font Size</Label>
              <div className="grid grid-cols-3 gap-2">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => updateTextStyle({ fontSize: size.value })}
                    className={`p-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      (currentStyle.fontSize || "16px") === size.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style Toggles */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Font Style</Label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateTextStyle({ fontWeight: currentStyle.fontWeight === "bold" ? "normal" : "bold" })
                  }
                  className={`flex-1 p-2.5 rounded-xl border-2 transition-all ${
                    currentStyle.fontWeight === "bold"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Bold className="h-4 w-4 mx-auto" />
                </button>
                <button
                  onClick={() =>
                    updateTextStyle({ fontStyle: currentStyle.fontStyle === "italic" ? "normal" : "italic" })
                  }
                  className={`flex-1 p-2.5 rounded-xl border-2 transition-all ${
                    currentStyle.fontStyle === "italic"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Italic className="h-4 w-4 mx-auto" />
                </button>
                <button
                  onClick={() =>
                    updateTextStyle({
                      textDecoration: currentStyle.textDecoration === "underline" ? "none" : "underline",
                    })
                  }
                  className={`flex-1 p-2.5 rounded-xl border-2 transition-all ${
                    currentStyle.textDecoration === "underline"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Underline className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Text Alignment</Label>
              <div className="flex gap-2">
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateTextStyle({ textAlign: align })}
                    className={`flex-1 p-2.5 rounded-xl border-2 transition-all ${
                      (currentStyle.textAlign || "left") === align
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    {align === "left" && <AlignLeft className="h-4 w-4 mx-auto" />}
                    {align === "center" && <AlignCenter className="h-4 w-4 mx-auto" />}
                    {align === "right" && <AlignRight className="h-4 w-4 mx-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Text Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateTextStyle({ textColor: color.value })}
                    className={`relative w-full aspect-square rounded-xl border-2 transition-all ${
                      currentStyle.textColor === color.value
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {currentStyle.textColor === color.value && (
                      <Check
                        className={`absolute inset-0 m-auto h-4 w-4 ${
                          color.value === "#FFFFFF" || color.value === "#F9FAFB" ? "text-blue-600" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Background Tab */}
        {activeTab === "background" && (
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Background Color</Label>
              <div className="grid grid-cols-3 gap-2">
                {backgroundPresets.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => updateTextStyle({ backgroundColor: bg.value })}
                    className={`relative p-3 rounded-xl border-2 transition-all ${
                      currentStyle.backgroundColor === bg.value
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    style={{ backgroundColor: bg.value }}
                  >
                    <span
                      className={`text-xs font-medium ${
                        bg.value === "#FFFFFF" || bg.value === "transparent" ? "text-slate-600" : "text-slate-700"
                      }`}
                    >
                      {bg.name}
                    </span>
                    {currentStyle.backgroundColor === bg.value && (
                      <Check className="absolute top-1 right-1 h-3 w-3 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Custom Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentStyle.backgroundColor || "#FFFFFF"}
                  onChange={(e) => updateTextStyle({ backgroundColor: e.target.value })}
                  className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={currentStyle.backgroundColor || "#FFFFFF"}
                  onChange={(e) => updateTextStyle({ backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
