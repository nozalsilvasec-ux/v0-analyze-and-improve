"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"

interface TextCompareProps {
  originalText: string
  improvedText: string
  className?: string
  initialSliderPercentage?: number
  slideMode?: "hover" | "drag"
  showHandlebar?: boolean
  originalLabel?: string
  improvedLabel?: string
}

export function TextCompare({
  originalText,
  improvedText,
  className,
  initialSliderPercentage = 50,
  slideMode = "drag",
  showHandlebar = true,
  originalLabel = "Original",
  improvedLabel = "Improved",
}: TextCompareProps) {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage)
  const [isDragging, setIsDragging] = useState(false)
  const [isMouseOver, setIsMouseOver] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === "drag") {
        setIsDragging(true)
      }
    },
    [slideMode],
  )

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false)
    }
  }, [slideMode])

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const percent = (x / rect.width) * 100
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(5, Math.min(95, percent)))
        })
      }
    },
    [slideMode, isDragging],
  )

  const handleMouseDown = useCallback((e: React.MouseEvent) => handleStart(e.clientX), [handleStart])
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd])
  const handleMouseMove = useCallback((e: React.MouseEvent) => handleMove(e.clientX), [handleMove])

  const handleTouchStart = useCallback((e: React.TouchEvent) => handleStart(e.touches[0].clientX), [handleStart])
  const handleTouchEnd = useCallback(() => handleEnd(), [handleEnd])
  const handleTouchMove = useCallback((e: React.TouchEvent) => handleMove(e.touches[0].clientX), [handleMove])

  function mouseEnterHandler() {
    setIsMouseOver(true)
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false)
    if (slideMode === "hover") {
      setSliderXPercent(initialSliderPercentage)
    }
    if (slideMode === "drag") {
      setIsDragging(false)
    }
  }

  return (
    <div
      ref={sliderRef}
      className={cn(
        "relative w-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 bg-white",
        className,
      )}
      style={{
        cursor: slideMode === "drag" ? (isDragging ? "grabbing" : "grab") : "col-resize",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Original Text (Full Width Background) */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 sticky top-0 bg-gradient-to-br from-red-50 to-rose-50 py-2 z-10">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-rose-500 shadow-sm" />
          <span className="text-sm font-semibold text-red-700">{originalLabel}</span>
        </div>
        <div className="prose prose-slate max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed m-0 bg-transparent">
            {originalText}
          </pre>
        </div>
      </div>

      {/* Improved Text (Clipped) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 p-6 overflow-y-auto z-20"
        style={{
          clipPath: `inset(0 0 0 ${sliderXPercent}%)`,
        }}
        transition={{ duration: 0 }}
      >
        <div className="flex items-center gap-2 mb-4 sticky top-0 bg-gradient-to-br from-emerald-50 to-green-50 py-2 z-10">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-sm" />
          <span className="text-sm font-semibold text-emerald-700">{improvedLabel}</span>
        </div>
        <div className="prose prose-slate max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed m-0 bg-transparent">
            {improvedText}
          </pre>
        </div>
      </motion.div>

      {/* Slider Line */}
      <AnimatePresence initial={false}>
        <motion.div
          className="absolute top-0 bottom-0 w-1 z-30"
          style={{
            left: `${sliderXPercent}%`,
            transform: "translateX(-50%)",
          }}
          transition={{ duration: 0 }}
        >
          {/* Main Slider Line */}
          <div className="h-full w-1 bg-gradient-to-b from-indigo-400 via-violet-500 to-indigo-400 shadow-lg" />

          {/* Glow Effect Left */}
          <div
            className="absolute top-0 bottom-0 -left-8 w-8 opacity-30"
            style={{
              background: "linear-gradient(to right, transparent, rgba(139, 92, 246, 0.5))",
            }}
          />

          {/* Glow Effect Right */}
          <div
            className="absolute top-0 bottom-0 left-1 w-8 opacity-30"
            style={{
              background: "linear-gradient(to left, transparent, rgba(16, 185, 129, 0.5))",
            }}
          />

          {/* Handlebar */}
          {showHandlebar && (
            <motion.div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2",
                "h-12 w-8 rounded-lg bg-white shadow-xl border border-slate-200",
                "flex items-center justify-center",
                "transition-transform duration-200",
                isMouseOver && "scale-110",
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <GripVertical className="h-5 w-5 text-slate-400" />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Percentage Indicators */}
      <div className="absolute bottom-4 left-4 z-40">
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-md">
          {Math.round(sliderXPercent)}% Original
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-40">
        <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-md">
          {Math.round(100 - sliderXPercent)}% Improved
        </span>
      </div>
    </div>
  )
}
