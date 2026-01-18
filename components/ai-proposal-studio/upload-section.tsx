"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Upload } from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import { cn } from "@/lib/utils"

export function UploadSection() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0]
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

      if (!validTypes.includes(file.type)) {
        alert("Please upload a PDF or DOCX file")
        return
      }

      setIsUploading(true)
      setTimeout(() => {
        router.push(`/editor/uploaded-${Date.now()}`)
      }, 800)
    },
    [router],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileUpload(e.dataTransfer.files)
    },
    [handleFileUpload],
  )

  const handleFileSelect = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.docx"
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      handleFileUpload(target.files)
    }
    input.click()
  }, [handleFileUpload])

  return (
    <motion.div
      className="card-primary p-8"
      whileHover={{ boxShadow: "0 8px 30px rgba(15, 23, 42, 0.12)" }}
      transition={{ duration: 0.3 }}
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center py-12 rounded-xl transition-all duration-200",
          isDragging && "bg-slate-900/5 border-2 border-dashed border-slate-900/20",
        )}
      >
        {/* Upload Icon */}
        <motion.div
          className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-5 shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="spinner"
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : (
              <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Upload className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Title & Description */}
        <motion.h2
          className="text-xl font-semibold text-slate-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {isUploading ? "Processing your file..." : "Upload your proposal"}
        </motion.h2>
        <motion.p
          className="text-sm text-slate-500 mb-8 text-center max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          {isUploading
            ? "Please wait while we analyze your document."
            : "Drag and drop your PDF or DOCX file here to start analyzing."}
        </motion.p>

        {/* Button hover/tap animation */}
        <StyledButton variant="gradient" onClick={handleFileSelect} disabled={isUploading} className="h-11 px-8">
          {isUploading ? "Uploading..." : "Select File"}
        </StyledButton>

        {/* Link button */}
        <StyledButton
          variant="backdrop-blur"
          className="mt-4"
          disabled={isUploading}
          onClick={() => router.push("/editor/new")}
        >
          Paste proposal text instead
        </StyledButton>
      </div>
    </motion.div>
  )
}
