"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Plus, ChevronDown } from "lucide-react"

export interface BlockSettings {
  width: "s" | "m" | "l" | "custom"
  customWidth?: number
  spacing: "s" | "m" | "l" | "custom"
  customSpacing?: number
  minHeight: "none" | "1/3" | "1/2" | "full"
  animation: "none" | "fade" | "slide"
  animationDirection?: "up" | "down" | "left" | "right"
  backgroundColor?: string
  backgroundImage?: string | null
}

interface BlockSettingsPanelProps {
  settings: BlockSettings
  onSettingsChange: (settings: BlockSettings) => void
  onClose?: () => void
}

// Block style presets
const blockStylePresets = [
  { id: 1, name: "Light", bg: "#ffffff", textColor: "#3b82f6", dark: false },
  { id: 2, name: "Dark", bg: "#1e3a5f", textColor: "#60a5fa", dark: true },
  { id: 3, name: "Light Alt", bg: "#f8fafc", textColor: "#3b82f6", dark: false },
  { id: 4, name: "Navy", bg: "#1e293b", textColor: "#93c5fd", dark: true },
  { id: 5, name: "Gray", bg: "#f1f5f9", textColor: "#3b82f6", dark: false },
  { id: 6, name: "Slate", bg: "#334155", textColor: "#a5b4fc", dark: true },
]

export function BlockSettingsPanel({ settings, onSettingsChange, onClose }: BlockSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"library" | "customize">("library")
  const [activeCustomizeTab, setActiveCustomizeTab] = useState<"block" | "text" | "widgets">("block")
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false)

  const updateSettings = (updates: Partial<BlockSettings>) => {
    onSettingsChange({ ...settings, ...updates })
  }

  const SizeSelector = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string
    value: string
    onChange: (value: string) => void
    options: { label: string; value: string }[]
  }) => (
    <div className="space-y-2">
      <label className="text-sm text-slate-600">{label}</label>
      <div className="flex bg-slate-100 rounded-lg p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              value === opt.value ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden w-64"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Main Tabs: Style library / Customize */}
      <div className="flex border-b border-slate-100">
        {[
          { id: "library" as const, label: "Style library" },
          { id: "customize" as const, label: "Customize" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-slate-800 border-b-2 border-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 max-h-[500px] overflow-y-auto">
        {activeTab === "library" && (
          <div className="space-y-4">
            {/* Block styles header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Block styles</span>
              <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                <Plus className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Block style presets grid */}
            <div className="grid grid-cols-2 gap-2">
              {blockStylePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() =>
                    updateSettings({
                      backgroundColor: preset.bg,
                    })
                  }
                  className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    settings.backgroundColor === preset.bg
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  style={{ backgroundColor: preset.bg }}
                >
                  <div className="text-left">
                    <p className="text-xs font-semibold" style={{ color: preset.textColor }}>
                      Block Heading
                    </p>
                    <p className={`text-[8px] mt-0.5 ${preset.dark ? "text-slate-400" : "text-slate-500"}`}>
                      Prepared for Product Marketing - by ACME
                    </p>
                    <p className={`text-[7px] mt-0.5 ${preset.dark ? "text-slate-500" : "text-slate-400"}`}>
                      sample@acme.com | acme.com
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "customize" && (
          <div className="space-y-4">
            {/* Sub-tabs: Block / Text / Widgets */}
            <div className="flex gap-4 border-b border-slate-100 pb-2">
              {[
                { id: "block" as const, label: "Block" },
                { id: "text" as const, label: "Text" },
                { id: "widgets" as const, label: "Widgets" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCustomizeTab(tab.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeCustomizeTab === tab.id ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeCustomizeTab === "block" && (
              <div className="space-y-4">
                {/* Background button */}
                <button
                  onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
                  className="w-full flex items-center gap-3 p-2 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-md border border-slate-200 flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: settings.backgroundColor || "#ffffff" }}
                  >
                    {settings.backgroundImage && (
                      <Image
                        src={settings.backgroundImage || "/placeholder.svg"}
                        alt="Background"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-sm text-slate-600">Background</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 ml-auto transition-transform ${showBackgroundPicker ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showBackgroundPicker && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-4 gap-2 p-2 bg-slate-50 rounded-lg">
                        {["#ffffff", "#f8fafc", "#1e3a5f", "#1e293b", "#f0fdf4", "#faf5ff", "#fffbeb", "#fff1f2"].map(
                          (color) => (
                            <button
                              key={color}
                              onClick={() => updateSettings({ backgroundColor: color, backgroundImage: null })}
                              className={`aspect-square rounded-lg border-2 transition-all ${
                                settings.backgroundColor === color
                                  ? "border-blue-500 ring-2 ring-blue-200"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ),
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Width */}
                <SizeSelector
                  label="Width"
                  value={settings.width}
                  onChange={(v) => updateSettings({ width: v as BlockSettings["width"] })}
                  options={[
                    { label: "S", value: "s" },
                    { label: "M", value: "m" },
                    { label: "L", value: "l" },
                    { label: "Custom", value: "custom" },
                  ]}
                />

                {/* Block spacing */}
                <SizeSelector
                  label="Block spacing"
                  value={settings.spacing}
                  onChange={(v) => updateSettings({ spacing: v as BlockSettings["spacing"] })}
                  options={[
                    { label: "S", value: "s" },
                    { label: "M", value: "m" },
                    { label: "L", value: "l" },
                    { label: "Custom", value: "custom" },
                  ]}
                />

                {/* Minimum height */}
                <SizeSelector
                  label="Minimum height"
                  value={settings.minHeight}
                  onChange={(v) => updateSettings({ minHeight: v as BlockSettings["minHeight"] })}
                  options={[
                    { label: "None", value: "none" },
                    { label: "1/3", value: "1/3" },
                    { label: "1/2", value: "1/2" },
                    { label: "Full", value: "full" },
                  ]}
                />

                {/* Animation */}
                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Animation</label>
                  <select
                    value={settings.animation}
                    onChange={(e) => updateSettings({ animation: e.target.value as BlockSettings["animation"] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="none">None</option>
                    <option value="fade">Animate by section</option>
                    <option value="slide">Animate by element</option>
                  </select>
                </div>

                {settings.animation !== "none" && (
                  <>
                    {/* Type */}
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600">Type</label>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                        {[
                          { label: "Fade in", value: "fade" },
                          { label: "Slide in", value: "slide" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => updateSettings({ animation: opt.value as "fade" | "slide" })}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                              settings.animation === opt.value
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Direction (only for slide) */}
                    {settings.animation === "slide" && (
                      <div className="space-y-2">
                        <label className="text-sm text-slate-600">Direction</label>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                          {[
                            { label: "Up", value: "up" },
                            { label: "Down", value: "down" },
                            { label: "Left", value: "left" },
                            { label: "Right", value: "right" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() =>
                                updateSettings({ animationDirection: opt.value as BlockSettings["animationDirection"] })
                              }
                              className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                                settings.animationDirection === opt.value
                                  ? "bg-white text-slate-800 shadow-sm"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeCustomizeTab === "text" && (
              <div className="py-8 text-center text-slate-400 text-sm">
                <p>Text customization options</p>
                <p className="text-xs mt-1">Font, size, color settings</p>
              </div>
            )}

            {activeCustomizeTab === "widgets" && (
              <div className="py-8 text-center text-slate-400 text-sm">
                <p>Widget options</p>
                <p className="text-xs mt-1">Buttons, dividers, etc.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export const defaultBlockSettings: BlockSettings = {
  width: "l",
  spacing: "m",
  minHeight: "none",
  animation: "none",
  backgroundColor: "#ffffff",
  backgroundImage: null,
}
