// components/KPICard.tsx
import React from "react"

interface KPICardProps {
  title: string
  value: string | number
  change?: number // positive or negative %
}

export default function KPICard({ title, value, change }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
      {/* Title */}
      <span className="text-gray-500 text-sm">{title}</span>

      {/* Value + Change */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {value}
        </span>

        {change !== undefined && (
          <span
            className={`text-sm px-2 py-0.5 rounded-full font-medium ${
              isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  )
}
