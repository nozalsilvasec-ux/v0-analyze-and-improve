"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface FloatingNavProps {
  activeTab?: "improve" | "templates"
}

export function FloatingNav({ activeTab = "improve" }: FloatingNavProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="nav-floating px-2 py-2 flex items-center gap-1">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-3 py-1.5">
          <div className="w-7 h-7 rounded-lg bg-[#222831] flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#DFD0B8]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
        </Link>

        <div className="w-px h-6 bg-[#222831]/10 mx-1" />

        {/* Nav Items */}
        <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#222831] hover:bg-[#222831]/5 rounded-full transition-colors">
          Product
          <ChevronDown className="w-4 h-4" />
        </button>
        <Link
          href="/templates"
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === "templates" ? "bg-[#222831]/5 text-[#222831]" : "text-[#222831] hover:bg-[#222831]/5"
          }`}
        >
          Templates
        </Link>
        <Link
          href="/improve-proposal"
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === "improve" ? "bg-[#222831]/5 text-[#222831]" : "text-[#222831] hover:bg-[#222831]/5"
          }`}
        >
          Improve
        </Link>
        <Link
          href="#"
          className="px-4 py-2 text-sm font-medium text-[#222831] hover:bg-[#222831]/5 rounded-full transition-colors"
        >
          Documentation
        </Link>

        <div className="w-px h-6 bg-[#222831]/10 mx-1" />

        {/* Auth */}
        <Link
          href="#"
          className="px-4 py-2 text-sm font-medium text-[#222831] hover:bg-[#222831]/5 rounded-full transition-colors"
        >
          Login
        </Link>
        <Link href="#" className="btn-primary px-4 py-2 text-sm rounded-full">
          Register
        </Link>

        <Avatar className="h-8 w-8 ml-1 ring-2 ring-white shadow-sm">
          <AvatarImage src="/professional-man-avatar.png" />
          <AvatarFallback className="bg-[#222831] text-[#DFD0B8] text-xs">JD</AvatarFallback>
        </Avatar>
      </nav>
    </div>
  )
}
