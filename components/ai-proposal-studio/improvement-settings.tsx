"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings2, ArrowRight } from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox-group"

export function ImprovementSettings() {
  const [selectedTone, setSelectedTone] = useState("executive")
  const [goals, setGoals] = useState({
    clarity: true,
    persuasion: false,
    readability: true,
    legalRisk: false,
  })

  const toggleGoal = (key: keyof typeof goals) => {
    setGoals((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="card-primary p-6 sticky top-28"
      whileHover={{ boxShadow: "0 8px 30px rgba(15, 23, 42, 0.12)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Settings2 className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900">Improvement Settings</h3>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Tone Profile Section */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 block">Tone Profile</label>
          <RadioGroup value={selectedTone} onValueChange={setSelectedTone} className="gap-2">
            <RadioGroupItem value="formal" label="Formal" />
            <RadioGroupItem value="persuasive" label="Persuasive" />
            <RadioGroupItem value="executive" label="Executive" />
          </RadioGroup>
        </motion.div>

        {/* Optimization Goals Section */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 block">
            Optimization Goals
          </label>
          <div className="flex flex-col gap-3">
            <Checkbox
              id="clarity"
              checked={goals.clarity}
              onCheckedChange={() => toggleGoal("clarity")}
              label="Clarity & Conciseness"
            />
            <Checkbox
              id="persuasion"
              checked={goals.persuasion}
              onCheckedChange={() => toggleGoal("persuasion")}
              label="Persuasion Power"
            />
            <Checkbox
              id="readability"
              checked={goals.readability}
              onCheckedChange={() => toggleGoal("readability")}
              label="Readability Score"
            />
            <Checkbox
              id="legalRisk"
              checked={goals.legalRisk}
              onCheckedChange={() => toggleGoal("legalRisk")}
              label="Legal Risk Check"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <StyledButton variant="shimmer" className="w-full h-12">
            <span className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Analyze & Improve
            </span>
          </StyledButton>
          <p className="text-xs text-slate-500 text-center mt-3">Uses 1 credit per analysis.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
