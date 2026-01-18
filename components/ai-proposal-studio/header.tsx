"use client"

import { motion } from "framer-motion"
import { FileText, ChevronDown } from "lucide-react"
import Link from "next/link"

export function Header() {
  const navItems = [
    { label: "Product", href: "#", hasDropdown: true },
    { label: "Pricing", href: "#" },
    { label: "Documentation", href: "#" },
  ]

  return (
    <motion.header
      className="sticky top-0 z-50 py-4 px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-4xl mx-auto">
        <nav className="nav-floating px-2 py-2 flex items-center justify-between">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2">
            <motion.div
              className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="h-4 w-4 text-white" />
            </motion.div>
          </Link>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-900/5 rounded-full transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-4 w-4 text-slate-500" />}
              </motion.a>
            ))}
          </div>

          {/* Right - Login & Register */}
          <div className="flex items-center gap-2">
            <motion.a
              href="#"
              className="px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-900/5 rounded-full transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.a>
            <motion.button
              className="btn-primary h-9 px-5 rounded-full text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Register
            </motion.button>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
