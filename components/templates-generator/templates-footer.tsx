import { Settings } from "lucide-react"
import Link from "next/link"

export function TemplatesFooter() {
  return (
    <footer className="h-14 px-6 flex items-center justify-between bg-white/60 backdrop-blur-xl border-t border-slate-200/50 mt-auto">
      {/* Left - Copyright & Links */}
      <div className="flex items-center gap-6 text-sm">
        <span className="text-slate-400">© 2026 LightNote</span>
        <Link href="#" className="hidden sm:inline text-slate-400 hover:text-slate-700 transition-colors duration-200">
          Documentation
        </Link>
        <Link href="#" className="hidden sm:inline text-slate-400 hover:text-slate-700 transition-colors duration-200">
          Support
        </Link>
      </div>

      {/* Right - Workspace Info */}
      <div className="flex items-center gap-4 text-sm">
        <span className="hidden md:inline text-slate-400">
          Workspace: <span className="font-medium text-slate-700">Design Agency Elite</span>
        </span>
        <div className="hidden md:block w-px h-4 bg-slate-200" />
        <Link
          href="#"
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
        >
          <Settings className="h-4 w-4" />
          Manage Studio
        </Link>
      </div>
    </footer>
  )
}
