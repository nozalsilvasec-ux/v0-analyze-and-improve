"use client"

import { motion } from "framer-motion"
import { Clock, LayoutGrid, FileEdit } from "lucide-react"
import Link from "next/link"

interface SubHeaderProps {
  activeTab?: "improve" | "templates"
}

export function SubHeader({ activeTab = "improve" }: SubHeaderProps) {
  const tabs = [
    { label: "Templates & Generator", id: "templates", href: "/templates", icon: LayoutGrid },
    { label: "Improve Proposal", id: "improve", href: "/improve-proposal", icon: FileEdit },
  ]

  return (
    <motion.div
      className="px-6 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-900/8 px-6 py-3 flex items-center justify-between">
          {/* Left - Title & Tabs */}
          <div className="flex items-center gap-6">
            <h1 className="text-sm font-semibold text-slate-900">Proposal Studio</h1>
            <div className="w-px h-5 bg-slate-900/15" />
            <div className="flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Link key={tab.id} href={tab.href}>
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:bg-slate-900/5 hover:text-slate-900"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right - Timestamp */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>Last saved 2m ago</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
