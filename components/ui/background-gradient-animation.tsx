"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState, useCallback } from "react"

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(255, 255, 255)",
  gradientBackgroundEnd = "rgb(248, 250, 252)",
  firstColor = "59, 130, 246",
  secondColor = "139, 92, 246",
  thirdColor = "6, 182, 212",
  pointerColor = "59, 130, 246",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string
  gradientBackgroundEnd?: string
  firstColor?: string
  secondColor?: string
  thirdColor?: string
  pointerColor?: string
  size?: string
  blendingValue?: string
  children?: React.ReactNode
  className?: string
  interactive?: boolean
  containerClassName?: string
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const gradientsRef = useRef<HTMLDivElement>(null)

  const curXRef = useRef(0)
  const curYRef = useRef(0)
  const tgXRef = useRef(0)
  const tgYRef = useRef(0)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastMouseMoveRef = useRef(0)

  const [isSafari, setIsSafari] = useState(false)

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current
      el.style.setProperty("--gradient-background-start", gradientBackgroundStart)
      el.style.setProperty("--gradient-background-end", gradientBackgroundEnd)
      el.style.setProperty("--first-color", firstColor)
      el.style.setProperty("--second-color", secondColor)
      el.style.setProperty("--third-color", thirdColor)
      el.style.setProperty("--pointer-color", pointerColor)
      el.style.setProperty("--size", size)
      el.style.setProperty("--blending-value", blendingValue)
    }
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    pointerColor,
    size,
    blendingValue,
  ])

  useEffect(() => {
    const handleScroll = () => {
      isScrollingRef.current = true

      // Pause CSS animations during scroll
      if (gradientsRef.current) {
        gradientsRef.current.style.animationPlayState = "paused"
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Resume animations after scroll ends (150ms debounce)
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
        if (gradientsRef.current) {
          gradientsRef.current.style.animationPlayState = "running"
        }
      }, 150)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!interactive) return

    let animationId: number

    function move() {
      // Skip updates while scrolling
      if (!isScrollingRef.current) {
        curXRef.current += (tgXRef.current - curXRef.current) / 20
        curYRef.current += (tgYRef.current - curYRef.current) / 20

        if (interactiveRef.current) {
          interactiveRef.current.style.transform = `translate3d(${curXRef.current}px, ${curYRef.current}px, 0)`
        }
      }
      animationId = requestAnimationFrame(move)
    }

    move()
    return () => cancelAnimationFrame(animationId)
  }, [interactive])

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now()
    if (now - lastMouseMoveRef.current < 50) return // Throttle to 20fps
    lastMouseMoveRef.current = now

    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect()
      tgXRef.current = event.clientX - rect.left
      tgYRef.current = event.clientY - rect.top
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "h-full w-full relative overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        "[content-visibility:auto] [contain:layout_style_paint]",
        containerClassName,
      )}
    >
      <div
        ref={gradientsRef}
        className={cn(
          "gradients-container pointer-events-none absolute inset-0 h-full w-full opacity-50",
          "transform-gpu",
          isSafari ? "blur-2xl" : "blur-[30px]",
        )}
      >
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.8)_0,_rgba(var(--first-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `animate-first opacity-100 transform-gpu`,
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `animate-second opacity-100 transform-gpu`,
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `animate-third opacity-100 transform-gpu`,
          )}
        />

        {interactive && (
          <div
            ref={interactiveRef}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `-left-1/2 -top-1/2 h-full w-full [mix-blend-mode:var(--blending-value)]`,
              `opacity-70 transform-gpu`,
            )}
          />
        )}
      </div>

      {/* Content layer */}
      <div className={cn("relative z-10 h-full", className)}>{children}</div>
    </div>
  )
}
