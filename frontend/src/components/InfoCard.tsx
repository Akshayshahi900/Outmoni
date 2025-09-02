// components/InfoCard.tsx
import React from "react"
import { LucideIcon } from "lucide-react"

interface InfoCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color?: string // Tailwind color classes for background
  highlight?: boolean
}

export default function InfoCard({ title, value, icon: Icon, color = "blue", highlight = false }: InfoCardProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl p-5 shadow-sm relative ${
        highlight ? `bg-${color}-600 text-white` : "bg-white text-gray-900"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full ${
          highlight ? "bg-white/20 text-white" : `bg-${color}-100 text-${color}-600`
        }`}
      >
        <Icon size={20} />
      </div>

      {/* Title */}
      <span className={`mt-4 text-sm ${highlight ? "text-white/80" : "text-gray-500"}`}>
        {title}
      </span>

      {/* Value */}
      <span className="text-2xl font-bold">{value}</span>

      {/* Menu dots (optional) */}
      <button
        className={`absolute top-3 right-3 text-lg ${
          highlight ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        ⋮
      </button>
    </div>
  )
}
