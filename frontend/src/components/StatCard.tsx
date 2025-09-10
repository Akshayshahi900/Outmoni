import React from "react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number // optional % change
  prefix?: string // optional (e.g. $, ₹, etc.)
  icon?: React.ReactNode // optional icon for InfoCard-style
}

export default function StatCard({ title, value, change, prefix, icon }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0

  // Format numbers with commas
  const formattedValue =
    typeof value === "number"
      ? `${prefix ?? ""}${value.toLocaleString()}`
      : `${prefix ?? ""}${value}`

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 transition hover:shadow-md">
      {/* Title */}
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span>{title}</span>
      </div>

      {/* Value + Change */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-900">{formattedValue}</span>

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
