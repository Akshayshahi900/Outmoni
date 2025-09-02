"use client"
import StatCards from "@/features/stats/StatCards"
import ExpenseList from "@/features/expenses/ExpenseList"
import { useState } from "react";
import AddExpenseModal from "@/components/addExpenseModal";
import KPICard from "@/components/KPICards";
import InfoCard from "@/components/InfoCard";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";


export default function DashboardPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  function handleAdd(newExpense: any) {
    setExpenses([...expenses, { id: Date.now(), ...newExpense }]);
  }
  return (<>
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard title="Balance" value="$5190.19" icon={Wallet} color="blue"  />
        <InfoCard title="Income" value="$2187.14" icon={ArrowUpCircle} color="green" />
        <InfoCard title="Expenses" value="$1912.52" icon={ArrowDownCircle} color="red" />
      </div>

      {/* Statistics Cards - Optional additional metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Monthly Savings" value="$1,275" change={8.2} />
        <KPICard title="Active Cards" value="3" />
        <KPICard title="Pending" value="$250.00" change={-1.5} />
        <KPICard title="Budget Left" value="$2,100" change={5.4} />
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
                <th className="pb-3 text-sm font-medium text-gray-500">Title</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Type</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{tx.title}</td>
                  <td className="py-3 text-sm text-gray-900">${tx.amount}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{tx.date}</td>
                  <td className="py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Completed
                    </span>
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
  </>
  )
}
