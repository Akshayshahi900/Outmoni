"use client"

import { useEffect, useState } from "react"
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
} from "lucide-react"
import StatCard from "@/components/StatCard"
import Linechart from "@/components/Linechart"
import AddExpenseModal from "@/components/addExpenseModal"

interface Expense {
  id: number
  title: string
  amount: number
  category: "income" | "expense"
  date: string
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all")

  const handleAdd = (newExpense: Expense) => {
    setExpenses((prev) => [...prev, newExpense])
  }

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch("/api/expenses")
        if (res.ok) {
          const data = await res.json()
          setExpenses(data)
        }
      } catch (error) {
        // Demo data if API fails
        const demoData: Expense[] = [
          { id: 1, title: "Salary", amount: 5000, category: "income", date: "2025-01-15" },
          { id: 2, title: "Rent", amount: 1200, category: "expense", date: "2025-01-20" },
          { id: 3, title: "Groceries", amount: 350, category: "expense", date: "2025-01-22" },
          { id: 4, title: "Freelance", amount: 800, category: "income", date: "2025-02-05" },
          { id: 5, title: "Utilities", amount: 150, category: "expense", date: "2025-02-10" },
        ]
        setExpenses(demoData)
      }
    }
    fetchExpenses()
  }, [])

  // Calculate totals
  const income = expenses
    .filter((e) => e.category === "income")
    .reduce((sum, e) => sum + e.amount, 0)

  const totalExpenses = expenses
    .filter((e) => e.category === "expense")
    .reduce((sum, e) => sum + e.amount, 0)

  const balance = income - totalExpenses

  const filteredExpenses =
    filter === "all" ? expenses : expenses.filter((e) => e.category === filter)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Financial Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Track your income and expenses in real-time
          </p>
        </div>
        {/* <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">This Month</span>
          </button>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div> */}
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Balance"
          value={balance}
          prefix="$"
          icon={<Wallet className="w-5 h-5" />}
          change={income > 0 ? (balance / income) * 100 : 0}
        />
        <StatCard
          title="Total Income"
          value={income}
          prefix="$"
          icon={<ArrowUpCircle className="w-5 h-5" />}
          change={12.5}
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          prefix="$"
          icon={<ArrowDownCircle className="w-5 h-5" />}
          change={income > 0 ? -(totalExpenses / income) * 100 : 0}
        />
      </div>

      {/* Chart */}
      <Linechart data={expenses} />

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Savings Rate"
          value={income > 0 ? parseFloat(((balance / income) * 100).toFixed(1)) : 0}
          suffix="%"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          title="Transactions"
          value={expenses.length}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatCard
          title="Avg Expense"
          value={totalExpenses / (expenses.filter((e) => e.category === "expense").length || 1)}
          prefix="$"
          icon={<ArrowDownCircle className="w-4 h-4" />}
        />
        <StatCard
          title="Monthly Goal"
          value={Math.max(0, 3000 - totalExpenses)}
          prefix="$"
          icon={<Wallet className="w-4 h-4" />}
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "income" | "expense")}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 sm:px-6 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredExpenses
                  .slice(-8)
                  .reverse()
                  .map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {tx.title}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            tx.category === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {tx.category === "income" ? "+" : "-"}$
                          {tx.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.category === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-100">
          <AddExpenseModal onAdd={handleAdd} />
        </div>
      </div>
    </div>
  )
}