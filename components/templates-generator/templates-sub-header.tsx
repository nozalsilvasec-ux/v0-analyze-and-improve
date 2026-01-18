"use client"

import { LayoutGrid, FileEdit } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function TemplatesSubHeader() {
  const tabs = [
    {
      label: "Templates & Generator",
      id: "templates",
      href: "/templates",
      icon: LayoutGrid,
      active: true,
    },
    {
      label: "Improve Proposal",
      id: "improve",
      href: "/improve-proposal",
      icon: FileEdit,
      active: false,
    },
  ]

  return (
    <div className="px-6 mb-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 px-4 py-3 flex items-center shadow-sm">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Link key={tab.id} href={tab.href}>
                  <motion.div
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      tab.active
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200"
                    }`}
                    whileHover={{ scale: tab.active ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
