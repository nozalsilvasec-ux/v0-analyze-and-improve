"use client"

import { Bell, Search, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { motion } from "framer-motion"

export function TemplatesHeader() {
  return (
    <header className="sticky top-0 z-50 py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <nav className="bg-white/80 backdrop-blur-xl border border-slate-200/50 px-2 py-2 flex items-center justify-between rounded-full shadow-lg shadow-slate-200/50">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-sm">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </Link>

          {/* Center - Search */}
          <div className="flex-1 max-w-xs mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search templates..."
                className="pl-10 h-9 bg-slate-100/80 border-slate-200 rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">ACTIVITY</span>
            </motion.button>
            <Avatar className="h-9 w-9 ring-2 ring-white shadow-md">
              <AvatarImage src="/professional-man-avatar.png" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-medium">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </div>
    </header>
  )
}
