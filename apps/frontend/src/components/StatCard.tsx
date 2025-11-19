import React from "react"
import { TrendingUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  change?: number
}

export default function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon,
  change,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className=" bg-blue-50 rounded-lg text-blue-600">{icon}</div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          {prefix}
          {typeof value === "number"
            ? value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : value}
          {suffix}
        </p>
        {change !== undefined && (
          <div className="flex items-center gap-1">
            {isPositive && (
              <>
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  +{change.toFixed(1)}%
                </span>
              </>
            )}
            {isNegative && (
              <>
                <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />
                <span className="text-xs font-medium text-red-600">
                  {change.toFixed(1)}%
                </span>
              </>
            )}
            {!isPositive && !isNegative && (
              <span className="text-xs font-medium text-gray-500">
                No change
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}