"use client"

import { useEffect, useState } from "react"
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react"
import StatCard from "@/components/StatCard"
import Linechart from "@/components/Linechart"
import AddExpenseModal from "@/components/addExpenseModal"

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<any[]>([])

  function handleAdd(newExpense: any) {
    setExpenses((prev) => [...prev, newExpense])
  }

  useEffect(() => {
    async function fetchExpenses() {
      const res = await fetch("/api/expenses")
      if (res.ok) {
        const data = await res.json()
        setExpenses(data)
      }
    }
    fetchExpenses()
  }, [])

  // 🔹 Calculate KPIs
  const income = expenses
    .filter((e) => e.category === "income")
    .reduce((sum, e) => sum + e.amount, 0)

  const totalExpenses = expenses
    .filter((e) => e.category === "expense")
    .reduce((sum, e) => sum + e.amount, 0)

  const balance = income - totalExpenses

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Balance"
          value={balance}
          prefix="$"
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatCard
          title="Income"
          value={income}
          prefix="$"
          icon={<ArrowUpCircle className="w-5 h-5" />}
          change={income > 0 ? ((income - totalExpenses) / income) * 100 : 0}
        />
        <StatCard
          title="Expenses"
          value={totalExpenses}
          prefix="$"
          icon={<ArrowDownCircle className="w-5 h-5" />}
          change={income > 0 ? -(totalExpenses / income) * 100 : 0}
        />
      </div>

      {/* Chart Section */}
      <Linechart data={expenses} />

      {/* Optional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Savings"
          value={balance}
          prefix="$"
          change={income > 0 ? (balance / income) * 100 : 0}
        />
        <StatCard title="Transactions" value={expenses.length} />
        <StatCard
          title="Avg Expense"
          value={
            totalExpenses /
            (expenses.filter((e) => e.category === "expense").length || 1)
          }
          prefix="$"
        />
        <StatCard title="Budget Left" value={balance} prefix="$" />
      </div>

      {/* Expenses Table Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <button className="text-blue-600 text-sm hover:underline">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 text-sm font-medium text-gray-500">
                  Title
                </th>
                <th className="pb-3 text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="pb-3 text-sm font-medium text-gray-500">Type</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.slice(-5).reverse().map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">
                    {tx.title}
                  </td>
                  <td
                    className={`py-3 text-sm font-medium ${
                      tx.category === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.category === "income" ? "+" : "-"}${tx.amount}
                  </td>
                  <td>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        tx.category === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Expense Button */}
        <AddExpenseModal onAdd={handleAdd} />
      </div>
    </div>
  )
}
