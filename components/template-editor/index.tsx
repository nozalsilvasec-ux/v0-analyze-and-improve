"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { EditorHeader } from "./editor-header"
import { EditorLeftSidebar } from "./editor-left-sidebar"
import { EditorCanvas } from "./editor-canvas"
import { EditorRightSidebar } from "./editor-right-sidebar"
import { VersionHistoryPanel } from "./version-history-panel"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { HelpCircle, Loader2, Save, Cloud, CloudOff } from "lucide-react"
import { useProposal } from "@/hooks/use-proposals"
import { isLocalProposal, getLocalProposal, saveLocalProposal, deleteLocalProposal } from "@/hooks/use-local-proposal"
import { templateToProposal, getAssetsFromStorage, type DocumentTemplate } from "@/lib/document-model"
import type { Proposal } from "@/lib/supabase/types"
import type { BlockTemplate } from "@/hooks/use-blocks"

interface TemplateEditorProps {
  templateId: string // This is actually proposalId
}

export function TemplateEditor({ templateId: proposalId }: TemplateEditorProps) {
  const router = useRouter()
  const isLocal = isLocalProposal(proposalId)
  
  const [activeLeftTab, setActiveLeftTab] = useState<"all" | "blocks" | "images" | "videos">("all")
  const [sidebarMode, setSidebarMode] = useState<"library" | "explore">("library")
  const [sectionType, setSectionType] = useState<"static" | "customizable">("static")
  const [selectedTags, setSelectedTags] = useState<string[]>(["Business", "Pricing"])
  const [contextPrompt, setContextPrompt] = useState("")
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isSavingToCloud, setIsSavingToCloud] = useState(false)
  const [localProposal, setLocalProposal] = useState<Proposal | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)

  const [pageSettings, setPageSettings] = useState({
    backgroundColor: "#ffffff",
    backgroundImage: null as string | null,
    backgroundOpacity: 100,
  })

  const canvasRef = useRef<{ insertBlock: (block: BlockTemplate) => void; insertImage: (url: string) => void } | null>(
    null,
  )

  // For local proposals, load from localStorage
  useEffect(() => {
    if (isLocal) {
      const stored = getLocalProposal(proposalId)
      setLocalProposal(stored)
    }
  }, [isLocal, proposalId])

  // For remote proposals, use the existing hook
  const { proposal: remoteProposal, isLoading: remoteLoading, error: remoteError, mutate } = useProposal(
    isLocal ? null : proposalId // Only fetch if not local
  )

  const proposal = isLocal ? localProposal : remoteProposal
  const isLoading = isLocal ? !localProposal : remoteLoading
  const error = isLocal ? (localProposal ? null : new Error("Local proposal not found")) : remoteError

  // Handle proposal update - works for both local and remote
  const handleProposalUpdate = async (updates: Partial<Proposal>) => {
    if (!proposal) return

    if (isLocal) {
      // Update local proposal in localStorage
      const updatedProposal = { ...proposal, ...updates, last_edited_at: new Date().toISOString() }
      saveLocalProposal(updatedProposal)
      setLocalProposal(updatedProposal)
    } else {
      // Update remote proposal via API
      try {
        const res = await fetch(`/api/proposals/${proposalId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })

        if (!res.ok) {
          throw new Error("Failed to update proposal")
        }

        mutate()
      } catch (err) {
        console.error("Failed to update proposal:", err)
      }
    }
  }

  // Save local proposal to cloud (Supabase)
  const handleSaveToCloud = async () => {
    if (!proposal || !isLocal) return

    setIsSavingToCloud(true)
    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: proposal.name,
          client_name: proposal.client_name,
          content: proposal.content,
          source_type: proposal.source_type,
          status: proposal.status,
          is_favorite: proposal.is_favorite,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save proposal")
      }

      const savedProposal = await response.json()
      
      // Delete local version
      deleteLocalProposal(proposalId)
      
      // Redirect to the new proposal URL
      router.push(`/editor/${savedProposal.id}`)
    } catch (err) {
      console.error("Failed to save to cloud:", err)
      alert("Failed to save proposal to cloud. Please try again.")
    } finally {
      setIsSavingToCloud(false)
    }
  }

  const handleInsertBlock = useCallback((block: BlockTemplate) => {
    if (canvasRef.current) {
      canvasRef.current.insertBlock(block)
    }
  }, [])

  const handleInsertImage = useCallback((imageUrl: string) => {
    if (canvasRef.current) {
      canvasRef.current.insertImage(imageUrl)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-600">Loading proposal...</p>
        </div>
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-red-500 font-medium">Failed to load proposal</p>
          <p className="text-slate-500 text-sm">{error?.message || "Proposal not found"}</p>
          <a href="/templates" className="text-blue-500 hover:underline">
            Back to Templates
          </a>
        </div>
      </div>
    )
  }

  const templateData = {
    id: proposal.id,
    name: proposal.name,
    date: new Date(proposal.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    status: proposal.status as "Draft" | "review" | "sent",
    content: proposal.content,
  }

  return (
    <BackgroundGradientAnimation
      containerClassName="h-screen"
      className="h-full"
      interactive={true}
      gradientBackgroundStart="rgb(248, 250, 252)"
      gradientBackgroundEnd="rgb(241, 245, 249)"
      firstColor="99, 102, 241"
      secondColor="139, 92, 246"
      thirdColor="59, 130, 246"
      pointerColor="147, 51, 234"
      blendingValue="hard-light"
      size="100%"
    >
      <div className="h-full flex flex-col overflow-hidden">
        <EditorHeader
          template={templateData}
          proposal={proposal}
          onToggleRightSidebar={() => setShowRightSidebar(!showRightSidebar)}
          showRightSidebar={showRightSidebar}
          onUpdate={handleProposalUpdate}
          isLocal={isLocal}
          onSaveToCloud={isLocal ? handleSaveToCloud : undefined}
          isSavingToCloud={isSavingToCloud}
          onShowVersionHistory={isLocal ? () => setShowVersionHistory(true) : undefined}
        />

        {/* Version History Panel */}
        {isLocal && (
          <VersionHistoryPanel
            templateId={proposalId}
            isOpen={showVersionHistory}
            onClose={() => setShowVersionHistory(false)}
            onVersionRestore={(restoredTemplate: DocumentTemplate) => {
              // Convert restored template to proposal and update local state
              const assets = getAssetsFromStorage()
              const restoredProposal = templateToProposal(restoredTemplate, assets)
              setLocalProposal(restoredProposal)
              saveLocalProposal(restoredProposal)
              setShowVersionHistory(false)
            }}
          />
        )}

        <div className="flex-1 flex overflow-hidden min-h-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-shrink-0 h-full min-h-0 overflow-hidden"
          >
            <EditorLeftSidebar
              activeTab={activeLeftTab}
              onTabChange={setActiveLeftTab}
              sidebarMode={sidebarMode}
              onSidebarModeChange={setSidebarMode}
              proposalId={proposalId}
              onInsertBlock={handleInsertBlock}
              onInsertImage={handleInsertImage}
            />
          </motion.div>

          <motion.div
            className="flex-1 h-full min-h-0 overflow-y-auto p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EditorCanvas
              ref={canvasRef}
              proposal={proposal}
              onUpdate={handleProposalUpdate}
              pageSettings={pageSettings}
            />
          </motion.div>

          {showRightSidebar && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 h-full min-h-0 overflow-hidden"
            >
              <EditorRightSidebar
                sectionType={sectionType}
                onSectionTypeChange={setSectionType}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                contextPrompt={contextPrompt}
                onContextPromptChange={setContextPrompt}
                onClose={() => setShowRightSidebar(false)}
                pageSettings={pageSettings}
                onPageSettingsChange={setPageSettings}
              />
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-lg border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
          >
            <HelpCircle className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
              HELP
            </span>
          </button>
        </motion.div>
      </div>
    </BackgroundGradientAnimation>
  )
}
