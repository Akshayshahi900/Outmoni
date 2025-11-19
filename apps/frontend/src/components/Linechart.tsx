import React from "react"

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
    )
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Financial Overview
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
        {months.map((month, i) => {
          const incomeHeight = (monthlyData[month].income / maxValue) * 100
          const expenseHeight = (monthlyData[month].expense / maxValue) * 100

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center gap-1 h-48">
                <div
                  className="w-full max-w-[40px] bg-green-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${incomeHeight}%` }}
                  title={`Income: $${monthlyData[month].income.toFixed(2)}`}
                ></div>
                <div
                  className="w-full max-w-[40px] bg-red-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{ height: `${expenseHeight}%` }}
                  title={`Expense: $${monthlyData[month].expense.toFixed(2)}`}
                ></div>
              </div>
              <span className="text-xs text-gray-600 text-center">
                {month.split(" ")[0]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}