"use client"
import { useEffect, useRef } from "react"
import { motion, stagger, useAnimate, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.3,
}: {
  words: string
  className?: string
  filter?: boolean
  duration?: number
}) => {
  const [scope, animate] = useAnimate()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })
  const wordsArray = words.split(" ")

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration,
          delay: stagger(0.02),
        },
      )
    }
  }, [isInView, animate, duration, filter])

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-slate-700 opacity-0"
              style={{
                filter: filter ? "blur(8px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          )
        })}
      </motion.div>
    )
  }

  return (
    <div ref={containerRef} className={cn("", className)}>
      <div className="leading-relaxed tracking-wide">{renderWords()}</div>
    </div>
  )
}
