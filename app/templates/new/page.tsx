"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, FileText, Layout, Wand2, Loader2, Layers, Users } from "lucide-react"
import Link from "next/link"
import { StyledButton } from "@/components/ui/styled-button"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"

const categories = [
  "Sales",
  "Marketing",
  "Engineering",
  "Design",
  "Consulting",
  "Finance",
  "Product",
  "HR",
  "Legal",
  "Other",
]

const templateStarters = [
  {
    id: "blank",
    name: "Blank Template",
    description: "Start from scratch with a clean slate",
    icon: FileText,
    color: "bg-slate-100 text-slate-600",
  },
  {
    id: "business",
    name: "Business Proposal",
    description: "Professional proposal with executive summary, scope, and pricing",
    icon: Layout,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "project",
    name: "Project Proposal",
    description: "Detailed project plan with timeline, deliverables, and milestones",
    icon: Layers,
    color: "bg-violet-100 text-violet-600",
  },
  {
    id: "consulting",
    name: "Consulting Proposal",
    description: "Service-focused proposal with methodology and approach",
    icon: Users,
    color: "bg-emerald-100 text-emerald-600",
  },
]

export default function NewTemplatePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Sales")
  const [selectedStarter, setSelectedStarter] = useState("blank")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Please enter a template name")
      return
    }

    setIsCreating(true)
    try {
      // Create template via API
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          category,
          content: getStarterContent(selectedStarter),
          is_public: false,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to create template")
      }

      const { template } = await res.json()

      // Create a proposal from this template and redirect to editor
      const proposalRes = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: template.id,
          name: name.trim(),
          source_type: "template",
        }),
      })

      if (!proposalRes.ok) {
        // If proposal creation fails, still redirect to templates
        router.push("/templates")
        return
      }

      const { proposal } = await proposalRes.json()
      router.push(`/editor/${proposal.id}`)
    } catch (error) {
      console.error("Failed to create template:", error)
      alert("Failed to create template. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const getStarterContent = (starter: string) => {
    const baseContent = {
      settings: {
        font: "Inter",
        primaryColor: "#3b82f6",
        layout: "standard",
      },
      sections: [] as Array<{
        id: string
        type: string
        title: string
        content: Record<string, unknown>
        order: number
      }>,
    }

    switch (starter) {
      case "business":
        baseContent.sections = [
          {
            id: crypto.randomUUID(),
            type: "hero",
            title: "Business Proposal",
            content: { subtitle: "Professional Services Proposal" },
            order: 0,
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            title: "Executive Summary",
            content: { text: "Enter your executive summary here..." },
            order: 1,
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            title: "Scope of Work",
            content: { text: "Define the scope of work..." },
            order: 2,
          },
          {
            id: crypto.randomUUID(),
            type: "pricing",
            title: "Pricing",
            content: { items: [] },
            order: 3,
          },
        ]
        break
      case "project":
        baseContent.sections = [
          {
            id: crypto.randomUUID(),
            type: "hero",
            title: "Project Proposal",
            content: { subtitle: "Project Overview" },
            order: 0,
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            title: "Project Overview",
            content: { text: "Describe your project..." },
            order: 1,
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            title: "Timeline & Milestones",
            content: { text: "Define your timeline..." },
            order: 2,
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            title: "Deliverables",
            content: { text: "List your deliverables..." },
            order: 3,
          },
        ]
        break
      case "consulting":
        baseContent.sections = [
          {
            id: crypto.randomUUID(),
            type: "hero",
            title: "Consulting Proposal",
            content: { subtitle: "Strategic Consulting Services" },
            order: 0,
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            title: "Understanding Your Needs",
            content: { text: "We understand your challenges..." },
            order: 1,
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            title: "Our Approach",
            content: { text: "Our methodology includes..." },
            order: 2,
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            title: "Expected Outcomes",
            content: { text: "You can expect..." },
            order: 3,
          },
        ]
        break
      default:
        // Blank template
        baseContent.sections = [
          {
            id: crypto.randomUUID(),
            type: "hero",
            title: "Untitled Proposal",
            content: { subtitle: "" },
            order: 0,
          },
        ]
    }

    return baseContent
  }

  return (
    <BackgroundGradientAnimation
      containerClassName="min-h-screen"
      className="min-h-screen"
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
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/templates">
                <StyledButton variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Templates
                </StyledButton>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <h1 className="text-lg font-semibold text-slate-900">Create New Template</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-5xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Template Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Template Details</h2>

              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Sales Proposal Template"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this template is for..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Template Starters */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Choose a Starting Point</h2>
              <p className="text-slate-500 mb-6">Select a template structure to get started quickly</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateStarters.map((starter) => {
                  const Icon = starter.icon
                  return (
                    <motion.button
                      key={starter.id}
                      onClick={() => setSelectedStarter(starter.id)}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                        selectedStarter === starter.id
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-12 h-12 rounded-xl ${starter.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{starter.name}</h3>
                      <p className="text-sm text-slate-500">{starter.description}</p>

                      {selectedStarter === starter.id && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Create Button */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/templates">
                <StyledButton variant="secondary">Cancel</StyledButton>
              </Link>
              <StyledButton variant="gradient" size="lg" onClick={handleCreate} disabled={isCreating || !name.trim()}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Create Template
                  </>
                )}
              </StyledButton>
            </div>
          </motion.div>
        </main>
      </div>
    </BackgroundGradientAnimation>
  )
}
