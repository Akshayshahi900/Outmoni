"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Plus,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import Linechart from "@/components/Linechart";
import AddExpenseModal from "@/components/addExpenseModal";
import ThemeToggle from "@/components/theme-toggle";

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: "income" | "expense";
  date: string;
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const handleAdd = (newExpense: Expense) => {
    setExpenses((prev) => [...prev, newExpense]);
  };

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch("/api/expenses");
        if (res.ok) {
          const data = await res.json();
          setExpenses(data);
        }
      } catch (error) {
        setExpenses([
          { id: 1, title: "Salary", amount: 5000, category: "income", date: "2025-01-15" },
          { id: 2, title: "Rent", amount: 1200, category: "expense", date: "2025-01-20" },
          { id: 3, title: "Groceries", amount: 350, category: "expense", date: "2025-01-22" },
          { id: 4, title: "Freelance", amount: 800, category: "income", date: "2025-02-05" },
          { id: 5, title: "Utilities", amount: 150, category: "expense", date: "2025-02-10" },
        ]);
      }
    }
    fetchExpenses();
  }, []);

  const income = expenses
    .filter((e) => e.category === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses
    .filter((e) => e.category === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = income - totalExpenses;

  const filteredExpenses =
    filter === "all" ? expenses : expenses.filter((e) => e.category === filter);

  return (
    <div className="min-h-screen bg-app">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-app/80 backdrop-blur-lg border-b border-app">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-app bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Financial Dashboard
              </h1>
              <p className="text-sm sm:text-base text-sub mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Track your expenses in real-time
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="
                px-4 
                py-2 
                rounded-lg 
                bg-card 
                border 
                border-app
                text-sub
                hover:text-app
                hover:border-primary
                transition-all
                duration-200
                flex
                items-center
                gap-2
                text-sm
                font-medium
              ">
                <Download className="w-4 h-4" />
                Export
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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

        {/* Chart Section */}
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
        <div className="bg-card rounded-xl border border-app overflow-hidden group relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.01] to-transparent pointer-events-none" />
          
          <div className="relative">
            {/* Table Header */}
            <div className="p-5 sm:p-6 border-b border-app">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-app">
                    Recent Transactions
                  </h2>
                  <p className="text-sm text-sub mt-1">
                    {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub pointer-events-none" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as "all" | "income" | "expense")}
                    className="
                      pl-10 
                      pr-4 
                      py-2.5 
                      text-sm 
                      font-medium
                      border 
                      border-app
                      rounded-lg 
                      bg-card
                      text-app
                      outline-none
                      cursor-pointer
                      hover:border-primary
                      transition-colors
                      duration-200
                      appearance-none
                      min-w-[140px]
                    "
                  >
                    <option value="all">All Transactions</option>
                    <option value="income">Income Only</option>
                    <option value="expense">Expenses Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card/60 backdrop-blur-sm">
                  <tr className="border-b border-app">
                    {["Title", "Amount", "Type", "Date"].map((h) => (
                      <th
                        key={h}
                        className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-sub uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border bg-card">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 sm:px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-8 h-8 text-primary/50" />
                          </div>
                          <div>
                            <p className="text-app font-medium">No transactions found</p>
                            <p className="text-sm text-sub mt-1">Add your first transaction to get started</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses
                      .slice(-8)
                      .reverse()
                      .map((tx, index) => (
                        <tr 
                          key={tx.id} 
                          className="
                            hover:bg-primary/5 
                            transition-all
                            duration-200
                            group/row
                            animate-in
                            fade-in
                            slide-in-from-bottom-2
                          "
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-10 h-10 
                                rounded-lg 
                                flex 
                                items-center 
                                justify-center
                                ${tx.category === "income" 
                                  ? "bg-success/10 text-success" 
                                  : "bg-danger/10 text-danger"
                                }
                              `}>
                                {tx.category === "income" 
                                  ? <ArrowUpCircle className="w-5 h-5" />
                                  : <ArrowDownCircle className="w-5 h-5" />
                                }
                              </div>
                              <span className="text-app font-medium group-hover/row:text-primary transition-colors">
                                {tx.title}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`text-base font-bold ${
                                tx.category === "income"
                                  ? "text-success"
                                  : "text-danger"
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
                              className={`
                                inline-flex 
                                items-center 
                                px-3 
                                py-1 
                                rounded-full 
                                text-xs 
                                font-semibold
                                capitalize
                                ${tx.category === "income"
                                  ? "bg-success/10 text-success border border-success/20"
                                  : "bg-danger/10 text-danger border border-danger/20"
                                }
                              `}
                            >
                              {tx.category}
                            </span>
                          </td>

                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center gap-2 text-sub">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {new Date(tx.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Add Button */}
            <div className="p-5 sm:p-6 border-t border-app bg-card/40 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-sub">
                  Showing {Math.min(8, filteredExpenses.length)} of {filteredExpenses.length} transactions
                </p>
                <AddExpenseModal onAdd={handleAdd} />
              </div>
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
            from-success/0 
            via-primary/40
            to-danger/0
          " />
        </div>
      </div>
    </div>
  );
}