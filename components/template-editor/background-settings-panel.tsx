"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Palette, ImageIcon, Video, Check, Upload, X, ChevronDown, Pencil } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export interface BackgroundSettings {
  type: "color" | "image" | "video"
  backgroundColor: string
  backgroundImage: string | null
  backgroundTint: string
  tintOpacity: number
  tintStyle: "normal" | "blend"
  backgroundBlur: number
  position: "center" | "top" | "bottom" | "left" | "right" | "cover" | "contain"
  useBackgroundCard: boolean
}

interface BackgroundSettingsPanelProps {
  settings: BackgroundSettings
  onSettingsChange: (settings: BackgroundSettings) => void
  onClose?: () => void
  compact?: boolean
}

const colorSwatches = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Black", value: "#000000" },
  { name: "Dark Green", value: "#166534" },
  { name: "Dark Gray", value: "#4b5563" },
  { name: "Light Gray", value: "#e5e7eb" },
  { name: "White", value: "#ffffff" },
]

const tintColors = [
  { name: "None", value: "transparent" },
  { name: "Black", value: "#000000" },
  { name: "White", value: "#ffffff" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Green", value: "#22c55e" },
]

const stockBackgrounds = [
  { name: "Abstract Blue", url: "/abstract-gradient-blue-purple.png", thumbnail: "/abstract-gradient-blue-purple.png" },
  { name: "Geometric", url: "/geometric-pattern-minimal.jpg", thumbnail: "/geometric-pattern-minimal.jpg" },
  { name: "Paper", url: "/paper-texture-subtle.jpg", thumbnail: "/paper-texture-subtle.jpg" },
  {
    name: "Watercolor",
    url: "/watercolor-soft-pastel-background.jpg",
    thumbnail: "/watercolor-soft-pastel-background.jpg",
  },
  { name: "Business", url: "/professional-business-visual.jpg", thumbnail: "/professional-business-visual.jpg" },
  { name: "Office", url: "/modern-office.png", thumbnail: "/modern-office.png" },
]

const positionOptions = [
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Cover", value: "cover" },
  { label: "Contain", value: "contain" },
]

export function BackgroundSettingsPanel({
  settings,
  onSettingsChange,
  onClose,
  compact = false,
}: BackgroundSettingsPanelProps) {
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [showTintPicker, setShowTintPicker] = useState(false)
  const [customHex, setCustomHex] = useState(settings.backgroundColor)
  const gradientRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCustomHex(settings.backgroundColor)
  }, [settings.backgroundColor])

  const updateSettings = (updates: Partial<BackgroundSettings>) => {
    onSettingsChange({ ...settings, ...updates })
  }

  const handleGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return
    const rect = gradientRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // Calculate color based on position (simplified HSL approach)
    const hue = Math.round(x * 60) // Blue range (200-260)
    const lightness = Math.round((1 - y) * 50 + 25)
    const color = `hsl(220, 80%, ${lightness}%)`

    // Convert to hex (simplified)
    const tempEl = document.createElement("div")
    tempEl.style.color = color
    document.body.appendChild(tempEl)
    const computedColor = getComputedStyle(tempEl).color
    document.body.removeChild(tempEl)

    const rgb = computedColor.match(/\d+/g)
    if (rgb) {
      const hex = "#" + rgb.map((x) => Number.parseInt(x).toString(16).padStart(2, "0")).join("")
      updateSettings({ backgroundColor: hex })
      setCustomHex(hex)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className={`bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden ${compact ? "w-80" : "w-96"}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Background type</span>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Type Tabs */}
      <div className="px-4 pt-3">
        <div className="flex bg-slate-100 rounded-lg p-1">
          {[
            { type: "color" as const, icon: Palette, label: "Color" },
            { type: "image" as const, icon: ImageIcon, label: "Image" },
            { type: "video" as const, icon: Video, label: "Video" },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => updateSettings({ type })}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                settings.type === type ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on type */}
      <div className="p-4 space-y-4 max-h-[450px] overflow-y-auto">
        {settings.type === "color" && (
          <div className="space-y-4">
            <div className="flex gap-2 justify-center">
              {colorSwatches.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    updateSettings({ backgroundColor: color.value })
                    setCustomHex(color.value)
                  }}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                    settings.backgroundColor.toLowerCase() === color.value.toLowerCase()
                      ? "border-blue-500 ring-2 ring-blue-200 scale-110"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {settings.backgroundColor.toLowerCase() === color.value.toLowerCase() && (
                    <Check
                      className={`absolute inset-0 m-auto h-4 w-4 ${
                        ["#ffffff", "#e5e7eb"].includes(color.value) ? "text-blue-500" : "text-white"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>

            <div
              ref={gradientRef}
              onClick={handleGradientClick}
              className="h-40 rounded-lg cursor-crosshair relative overflow-hidden"
              style={{
                background: `linear-gradient(to bottom, 
                  hsl(220, 80%, 75%) 0%, 
                  hsl(220, 80%, 50%) 50%, 
                  hsl(220, 80%, 25%) 100%)`,
              }}
            >
              {/* Color indicator */}
              <div
                className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: settings.backgroundColor,
                }}
              />
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="360"
                defaultValue="220"
                onChange={(e) => {
                  const hue = Number.parseInt(e.target.value)
                  const color = `hsl(${hue}, 70%, 50%)`
                  const tempEl = document.createElement("div")
                  tempEl.style.color = color
                  document.body.appendChild(tempEl)
                  const computedColor = getComputedStyle(tempEl).color
                  document.body.removeChild(tempEl)
                  const rgb = computedColor.match(/\d+/g)
                  if (rgb) {
                    const hex = "#" + rgb.map((x) => Number.parseInt(x).toString(16).padStart(2, "0")).join("")
                    updateSettings({ backgroundColor: hex })
                    setCustomHex(hex)
                  }
                }}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 70%, 50%), 
                    hsl(60, 70%, 50%), 
                    hsl(120, 70%, 50%), 
                    hsl(180, 70%, 50%), 
                    hsl(240, 70%, 50%), 
                    hsl(300, 70%, 50%), 
                    hsl(360, 70%, 50%))`,
                }}
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
              <div
                className="w-8 h-8 rounded-md border border-slate-200 flex-shrink-0"
                style={{ backgroundColor: settings.backgroundColor }}
              />
              <input
                type="text"
                value={customHex.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value
                  setCustomHex(value)
                  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    updateSettings({ backgroundColor: value })
                  }
                }}
                className="flex-1 px-2 py-1.5 text-sm border border-slate-200 rounded-md font-mono bg-white"
                placeholder="#000000"
              />
              <button className="p-1.5 hover:bg-slate-200 rounded-md transition-colors">
                <Pencil className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {settings.type === "image" && (
          <div className="space-y-4">
            {/* Background Image Selector */}
            <div>
              <button
                onClick={() => setShowImageGallery(!showImageGallery)}
                className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  {settings.backgroundImage ? (
                    <Image
                      src={settings.backgroundImage || "/placeholder.svg"}
                      alt="Background"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-slate-400" />
                    </div>
                  )}
                </div>
                <span className="text-sm text-slate-600 flex-1 text-left">Background image</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${showImageGallery ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showImageGallery && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-lg">
                      {stockBackgrounds.map((bg) => (
                        <button
                          key={bg.name}
                          onClick={() => {
                            updateSettings({ backgroundImage: bg.url })
                            setShowImageGallery(false)
                          }}
                          className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                            settings.backgroundImage === bg.url
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-transparent hover:border-slate-300"
                          }`}
                        >
                          <Image src={bg.thumbnail || "/placeholder.svg"} alt={bg.name} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                    <label className="flex items-center justify-center gap-2 mt-2 py-2 border border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                      <Upload className="h-4 w-4 text-slate-400" />
                      <span className="text-xs text-slate-500">Upload custom image</span>
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Background Tint */}
            <div>
              <button
                onClick={() => setShowTintPicker(!showTintPicker)}
                className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg border border-slate-200 flex-shrink-0"
                  style={{
                    backgroundColor: settings.backgroundTint === "transparent" ? "white" : settings.backgroundTint,
                  }}
                >
                  {settings.backgroundTint === "transparent" && (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="absolute w-full h-0.5 bg-red-400 rotate-45" />
                    </div>
                  )}
                </div>
                <span className="text-sm text-slate-600 flex-1 text-left">Background tint</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${showTintPicker ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showTintPicker && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="grid grid-cols-4 gap-2 p-2 bg-slate-50 rounded-lg">
                      {tintColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateSettings({ backgroundTint: color.value })}
                          className={`relative aspect-square rounded-lg border-2 transition-all ${
                            settings.backgroundTint === color.value
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          style={{ backgroundColor: color.value === "transparent" ? "white" : color.value }}
                          title={color.name}
                        >
                          {color.value === "transparent" && (
                            <div className="absolute inset-2 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-red-400 rotate-45" />
                            </div>
                          )}
                          {settings.backgroundTint === color.value && color.value !== "transparent" && (
                            <Check
                              className={`absolute inset-0 m-auto h-4 w-4 ${
                                ["#ffffff"].includes(color.value) ? "text-blue-500" : "text-white"
                              }`}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-sm text-slate-600">Position</label>
              <select
                value={settings.position}
                onChange={(e) => updateSettings({ position: e.target.value as BackgroundSettings["position"] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              >
                {positionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tint Style */}
            <div className="space-y-2">
              <label className="text-sm text-slate-600">Tint style</label>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {(["normal", "blend"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => updateSettings({ tintStyle: style })}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all capitalize ${
                      settings.tintStyle === style
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Tint Opacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600">Tint opacity</label>
                <span className="text-sm font-medium text-slate-700">{settings.tintOpacity}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.tintOpacity}
                onChange={(e) => updateSettings({ tintOpacity: Number(e.target.value) })}
                className="w-full h-2 bg-gradient-to-r from-slate-200 to-blue-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Background Blur */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600">Background blur</label>
                <span className="text-sm font-medium text-slate-700">{settings.backgroundBlur}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={settings.backgroundBlur}
                onChange={(e) => updateSettings({ backgroundBlur: Number(e.target.value) })}
                className="w-full h-2 bg-gradient-to-r from-slate-200 to-blue-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Background Card Toggle */}
            <div className="flex items-center justify-between py-2">
              <label className="text-sm text-slate-600">Background card</label>
              <Switch
                checked={settings.useBackgroundCard}
                onCheckedChange={(checked) => updateSettings({ useBackgroundCard: checked })}
              />
            </div>
          </div>
        )}

        {settings.type === "video" && (
          <div className="text-center py-8 text-slate-500 text-sm">
            <Video className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>Video backgrounds coming soon</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export const defaultBackgroundSettings: BackgroundSettings = {
  type: "color",
  backgroundColor: "#ffffff",
  backgroundImage: null,
  backgroundTint: "transparent",
  tintOpacity: 36,
  tintStyle: "normal",
  backgroundBlur: 0,
  position: "center",
  useBackgroundCard: false,
}
