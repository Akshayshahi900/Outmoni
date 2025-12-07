import React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

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
    <div className="
      bg-card 
      border 
      border-app
      rounded-xl
      p-5 sm:p-6 
      transition-all
      duration-200
      hover:scale-[1.02]
      hover:shadow-lg
      group
      relative
      overflow-hidden
    ">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-sub uppercase tracking-wide">
            {title}
          </span>

          {/* Icon container with enhanced styling */}
          <div className="
            p-2.5 
            rounded-lg 
            bg-primary/10 
            text-primary
            group-hover:bg-primary/15
            transition-colors
            duration-200
          ">
            {icon}
          </div>
        </div>

        {/* Main value */}
        <div className="space-y-2">
          <p className="text-3xl sm:text-4xl font-bold text-app tracking-tight">
            {prefix}
            {typeof value === "number"
              ? value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : value}
            <span className="text-xl sm:text-2xl font-semibold text-sub ml-1">
              {suffix}
            </span>
          </p>

          {/* Change indicator with enhanced styling */}
          {change !== undefined && (
            <div className="flex items-center gap-1.5 pt-1">
              {isPositive && (
                <>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-success/10">
                    <TrendingUp className="w-3.5 h-3.5 text-success" />
                    <span className="text-xs font-semibold text-success">
                      +{change.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-sub">vs last period</span>
                </>
              )}

              {isNegative && (
                <>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-danger/10">
                    <TrendingDown className="w-3.5 h-3.5 text-danger" />
                    <span className="text-xs font-semibold text-danger">
                      {change.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-sub">vs last period</span>
                </>
              )}

              {!isPositive && !isNegative && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-sub/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-sub" />
                  <span className="text-xs font-medium text-sub">No change</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="
        absolute 
        bottom-0 
        left-0 
        right-0 
        h-1 
        bg-gradient-to-r 
        from-primary/0 
        via-primary/50 
        to-primary/0
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-300
      " />
    </div>
  )
}