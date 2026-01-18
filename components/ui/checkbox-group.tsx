"use client"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  className?: string
}

export function Checkbox({ id, checked, onCheckedChange, label, className }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn("flex items-center gap-3 cursor-pointer group py-1", className)}>
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 focus-ring",
          checked ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300 group-hover:border-blue-500/50",
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </button>
      <span className="text-sm text-slate-900">{label}</span>
    </label>
  )
}
