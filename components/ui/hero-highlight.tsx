"use client"
import { cn } from "@/lib/utils"
import { useMotionValue, motion, useMotionTemplate } from "framer-motion"
import type React from "react"

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const dotPatterns = {
    light: {
      default: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23e2e8f0' id='pattern-circle' cx='10' cy='10' r='1.5'%3E%3C/circle%3E%3C/svg%3E")`,
      hover: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%2310b981' id='pattern-circle' cx='10' cy='10' r='1.5'%3E%3C/circle%3E%3C/svg%3E")`,
    },
  }

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={cn("group relative w-full overflow-hidden rounded-3xl bg-white", containerClassName)}
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: dotPatterns.light.default,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: dotPatterns.light.hover,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  )
}

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <motion.span
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={{
        backgroundSize: "100% 100%",
      }}
      transition={{
        duration: 1.5,
        ease: "easeOut",
        delay: 0.3,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        "relative inline-block rounded-lg bg-gradient-to-r from-emerald-200 to-green-200 px-1.5 pb-0.5",
        className,
      )}
    >
      {children}
    </motion.span>
  )
}
