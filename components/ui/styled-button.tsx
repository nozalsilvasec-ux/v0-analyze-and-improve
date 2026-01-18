"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary" // Next.js Blue - main CTA
    | "secondary" // Simple - subtle actions
    | "outline" // Outline - bordered
    | "ghost" // Minimal styling
    | "gradient" // Gradient rounded
    | "shimmer" // Animated shimmer
    | "figma" // Figma style lift
    | "sketch" // Sketch shadow
    | "invert" // Invert on hover
    | "brutal" // Brutal shadow
    | "spotify" // Spotify green
    | "connect" // Tailwind Connect
    | "magic" // Border magic spinning
    | "lit" // Lit up borders
    | "top-gradient" // Top gradient accent
    | "unapologetic" // Yellow offset background
    | "favourite" // Black rounded with shadow
    | "backdrop-blur" // Blurred background
    | "playlist" // Inset border uppercase
    | "figma-outline" // Outline with inset shadow
    | "nextjs-white" // White with subtle shadow
  size?: "sm" | "md" | "lg" | "icon"
  children: React.ReactNode
  asChild?: boolean
}

const StyledButton = React.forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    }

    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none"

    const variants: Record<string, string> = {
      // Next.js Blue - primary CTA
      primary:
        "shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] bg-[#0070f3] rounded-md text-white font-medium",

      // Simple - subtle hover
      secondary:
        "rounded-md border border-neutral-300 bg-neutral-100 text-neutral-600 hover:-translate-y-1 hover:shadow-md",

      // Outline
      outline: "rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400",

      // Ghost
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg",

      // Gradient rounded
      gradient:
        "rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl",

      // Shimmer - animated
      shimmer:
        "animate-shimmer rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",

      // Figma - lift effect
      figma: "bg-slate-900 text-white rounded-lg font-semibold hover:-translate-y-1",

      // Sketch - shadow offset
      sketch: "rounded-md border border-slate-900 bg-white text-slate-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]",

      // Invert on hover
      invert:
        "rounded-md bg-teal-500 text-white font-semibold border-2 border-transparent hover:bg-white hover:text-slate-900 hover:border-teal-500",

      // Brutal - stacked shadow
      brutal:
        "border-2 border-slate-900 uppercase bg-white text-slate-900 shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]",

      // Spotify
      spotify:
        "rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase hover:scale-105 hover:bg-[#21e065]",

      // Tailwind Connect
      connect: "group relative rounded-full bg-slate-800 p-px text-xs font-semibold text-white overflow-hidden",

      // Border Magic - spinning gradient
      magic:
        "relative rounded-full p-[1px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 overflow-hidden",

      // Lit up borders
      lit: "relative p-[3px]",

      // Top gradient
      "top-gradient":
        "rounded-full relative bg-slate-700 text-white hover:shadow-2xl hover:shadow-white/[0.1] border border-slate-600",

      // Unapologetic - yellow offset
      unapologetic: "relative border border-black bg-transparent text-black group",

      // Favourite - black rounded
      favourite: "bg-black text-white rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg",

      // Backdrop blur
      "backdrop-blur":
        "text-black backdrop-blur-sm border border-black rounded-md hover:shadow-[0px_0px_4px_4px_rgba(0,0,0,0.1)] bg-white/[0.2]",

      // Playlist - inset border
      playlist:
        "shadow-[inset_0_0_0_2px_#616467] text-black rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white",

      // Figma outline
      "figma-outline":
        "shadow-[0_0_0_3px_#000000_inset] bg-transparent border border-black text-black rounded-lg font-bold hover:-translate-y-1",

      // Next.js White
      "nextjs-white":
        "shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] bg-white text-[#696969] rounded-md font-light",
    }

    // Special render for unapologetic button with offset background
    if (variant === "unapologetic") {
      return (
        <motion.button
          ref={ref}
          className={cn(baseClasses, variants[variant], sizeClasses[size], className)}
          disabled={disabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...props}
        >
          <div className="absolute -bottom-2 -right-2 bg-yellow-300 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />
          <span className="relative">{children}</span>
        </motion.button>
      )
    }

    // Special render for connect button
    if (variant === "connect") {
      return (
        <motion.button
          ref={ref}
          className={cn(baseClasses, variants[variant], sizeClasses[size], className)}
          disabled={disabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...props}
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <span className="relative flex items-center gap-2 z-10 rounded-full bg-slate-950 py-1.5 px-4 ring-1 ring-white/10">
            {children}
          </span>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </motion.button>
      )
    }

    if (variant === "magic") {
      return (
        <motion.button
          ref={ref}
          className={cn(baseClasses, variants[variant], className)}
          disabled={disabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...props}
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span
            className={cn(
              "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 backdrop-blur-3xl text-white",
              sizeClasses[size],
            )}
          >
            {children}
          </span>
        </motion.button>
      )
    }

    if (variant === "lit") {
      return (
        <motion.button
          ref={ref}
          className={cn(baseClasses, variants[variant], className)}
          disabled={disabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...props}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <span
            className={cn(
              "relative bg-slate-900 rounded-[6px] text-white hover:bg-transparent transition-all",
              sizeClasses[size],
            )}
          >
            {children}
          </span>
        </motion.button>
      )
    }

    if (variant === "top-gradient") {
      return (
        <motion.button
          ref={ref}
          className={cn(baseClasses, variants[variant], sizeClasses[size], className)}
          disabled={disabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...props}
        >
          <span className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
          <span className="relative z-20">{children}</span>
        </motion.button>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizeClasses[size], className)}
        disabled={disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)
StyledButton.displayName = "StyledButton"

export { StyledButton }
