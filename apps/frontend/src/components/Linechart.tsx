import React, { useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Expense {
  id: number
  title: string
  amount: number
  category: "income" | "expense"
  date: string
}

interface LinechartProps {
  data: Expense[]
}

export default function Linechart({ data }: LinechartProps) {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null)

  const monthlyData: Record<string, { income: number; expense: number }> = {}

  data.forEach((expense) => {
    const month = new Date(expense.date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })

    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 }
    }

    if (expense.category === "income") {
      monthlyData[month].income += expense.amount
    } else {
      monthlyData[month].expense += expense.amount
    }
  })

  const months = Object.keys(monthlyData).slice(-6)
  const maxValue = Math.max(
    ...months.map((m) =>
      Math.max(monthlyData[m].income, monthlyData[m].expense)
    ),
    1 // Prevent division by zero
  )

  // Calculate totals
  const totalIncome = months.reduce((sum, m) => sum + monthlyData[m].income, 0)
  const totalExpense = months.reduce((sum, m) => sum + monthlyData[m].expense, 0)
  const netAmount = totalIncome - totalExpense

  return (
    <div className="
      bg-card 
      rounded-xl 
      border 
      border-app
      p-5 sm:p-6 
      relative
      overflow-visible
      group
    ">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none rounded-xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-app mb-2">
              Financial Overview
            </h2>
            <p className="text-sm text-sub">Last 6 months trend</p>
          </div>

          {/* Summary Cards */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
              <TrendingUp className="w-4 h-4 text-success" />
              <div className="text-left">
                <p className="text-xs text-sub">Total Income</p>
                <p className="text-sm font-bold text-success">
                  ${totalIncome.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20">
              <TrendingDown className="w-4 h-4 text-danger" />
              <div className="text-left">
                <p className="text-xs text-sub">Total Expenses</p>
                <p className="text-sm font-bold text-danger">
                  ${totalExpense.toLocaleString()}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              netAmount >= 0 
                ? 'bg-primary/10 border-primary/20' 
                : 'bg-warning/10 border-warning/20'
            }`}>
              <div className="text-left">
                <p className="text-xs text-sub">Net</p>
                <p className={`text-sm font-bold ${
                  netAmount >= 0 ? 'text-primary' : 'text-warning'
                }`}>
                  ${Math.abs(netAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success shadow-sm"></div>
            <span className="text-sub font-medium">Income</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger shadow-sm"></div>
            <span className="text-sub font-medium">Expenses</span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative" style={{ height: '320px', paddingTop: '60px', paddingBottom: '30px' }}>
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ top: '60px', bottom: '30px' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full border-t border-border/30" />
            ))}
          </div>

          {/* Bars Container */}
          <div className="absolute inset-0 flex items-end justify-between gap-2 sm:gap-4 px-2" style={{ top: '60px', bottom: '30px' }}>
            {months.map((month, i) => {
              const incomeHeight = (monthlyData[month].income / maxValue) * 100
              const expenseHeight = (monthlyData[month].expense / maxValue) * 100
              const isHovered = hoveredMonth === month

              return (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col items-center relative h-full"
                  onMouseEnter={() => setHoveredMonth(month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  {/* Hover tooltip */}
                  {isHovered && (
                    <div className="
                      absolute 
                      bottom-full 
                      left-1/2
                      -translate-x-1/2
                      mb-3
                      bg-card 
                      border 
                      border-app
                      rounded-lg 
                      shadow-xl
                      p-3 
                      min-w-[160px]
                      z-50
                      whitespace-nowrap
                    ">
                      {/* Tooltip arrow */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-card" />
                      </div>

                      <p className="text-xs font-semibold text-app mb-2">{month}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs text-success flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            Income:
                          </span>
                          <span className="text-xs font-bold text-success">
                            ${monthlyData[month].income.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs text-danger flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-danger" />
                            Expenses:
                          </span>
                          <span className="text-xs font-bold text-danger">
                            ${monthlyData[month].expense.toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-1.5 mt-1.5 border-t border-border/50">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-sub font-medium">Net:</span>
                            <span className={`text-xs font-bold ${
                              monthlyData[month].income - monthlyData[month].expense >= 0
                                ? 'text-primary'
                                : 'text-warning'
                            }`}>
                              ${Math.abs(monthlyData[month].income - monthlyData[month].expense).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bars */}
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Income Bar */}
                    <div
                      className={`
                        w-full 
                        max-w-[40px] 
                        bg-success
                        rounded-t-lg
                        transition-all 
                        duration-300
                        cursor-pointer
                        relative
                        ${isHovered ? 'opacity-100 scale-105' : 'opacity-90'}
                      `}
                      style={{ 
                        height: `${incomeHeight}%`,
                        boxShadow: isHovered ? '0 -4px 12px rgba(34, 197, 94, 0.3)' : 'none'
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg" />
                    </div>

                    {/* Expense Bar */}
                    <div
                      className={`
                        w-full 
                        max-w-[40px] 
                        bg-danger
                        rounded-t-lg
                        transition-all 
                        duration-300
                        cursor-pointer
                        relative
                        ${isHovered ? 'opacity-100 scale-105' : 'opacity-90'}
                      `}
                      style={{ 
                        height: `${expenseHeight}%`,
                        boxShadow: isHovered ? '0 -4px 12px rgba(239, 68, 68, 0.3)' : 'none'
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg" />
                    </div>
                  </div>

                  {/* Month Label */}
                  <span className={`
                    text-xs 
                    text-center 
                    font-medium
                    transition-colors
                    absolute
                    -bottom-7
                    left-1/2
                    -translate-x-1/2
                    whitespace-nowrap
                    ${isHovered ? 'text-primary' : 'text-sub'}
                  `}>
                    {month.split(" ")[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Y-axis labels */}
        <div className="flex justify-between text-xs text-sub/60 px-2 mt-2">
          <span>$0</span>
          <span>${(maxValue / 2).toLocaleString()}</span>
          <span>${maxValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="
        absolute 
        bottom-0 
        left-0 
        right-0 
        h-1 
        bg-gradient-to-r 
        from-success/0 
        via-primary/30
        to-danger/0
      " />
    </div>
  )
}