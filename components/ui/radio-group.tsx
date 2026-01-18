"use client"

import type * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />
}

interface RadioGroupItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  label?: string
}

function RadioGroupItem({ className, label, ...props }: RadioGroupItemProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
      <RadioGroupPrimitive.Item
        data-slot="radio-group-item"
        className={cn(
          "aspect-square size-5 shrink-0 rounded-full border-2 border-slate-300 bg-white transition-all duration-200 outline-none",
          "focus-visible:ring-2 focus-visible:ring-blue-500/30",
          "group-hover:border-blue-500/50",
          "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="flex items-center justify-center">
          <CircleIcon className="size-2 fill-white text-white" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && <span className="text-sm text-slate-900">{label}</span>}
    </label>
  )
}

export { RadioGroup, RadioGroupItem }
