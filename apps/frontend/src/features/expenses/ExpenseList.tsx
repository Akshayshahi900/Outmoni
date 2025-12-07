"use client"
import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  DollarSign,
  ArrowUpDown,
  Coffee,
  Home,
  Car,
  CreditCard,
  ShoppingCart,
  Smartphone,
  Heart,
  Filter,
  Trash2,
  Calendar,
  X,
  TrendingDown,
} from "lucide-react";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  paymentMethod: string;
}

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<"date" | "amount" | "title">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/expenses");
      if (res.ok) setExpenses(await res.json());
    } finally {
      setLoading(false);
    }
  };

  async function handleDelete(id: string) {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (res.ok) setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  const categories = [
    "all",
    "Food",
    "Housing",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Shopping",
    "Health",
  ];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "food": return <Coffee className="w-4 h-4" />;
      case "housing": return <Home className="w-4 h-4" />;
      case "transportation": return <Car className="w-4 h-4" />;
      case "entertainment": return <CreditCard className="w-4 h-4" />;
      case "utilities": return <Smartphone className="w-4 h-4" />;
      case "shopping": return <ShoppingCart className="w-4 h-4" />;
      case "health": return <Heart className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      food: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
      housing: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
      transportation: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
      entertainment: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
      utilities: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400",
      shopping: "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400",
      health: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
    };
    return colors[category.toLowerCase() as keyof typeof colors] ?? "bg-primary/10 text-primary border-primary/20";
  };

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses;

    if (searchTerm) {
      filtered = filtered.filter(
        (expense) =>
          expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((expense) => expense.category === selectedCategory);
    }

    filtered = [...filtered].sort((a, b) => {
      let aValue: any, bValue: any;
      if (sortField === "amount") (aValue = a.amount), (bValue = b.amount);
      else if (sortField === "title") (aValue = a.title.toLowerCase()), (bValue = b.title.toLowerCase());
      else (aValue = new Date(a.date).getTime()), (bValue = new Date(b.date).getTime());

      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? -1 : 1);
    });

    return filtered;
  }, [expenses, searchTerm, selectedCategory, sortField, sortDirection]);

  const totalAmount = filteredAndSortedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const toggleSort = (field: "date" | "amount" | "title") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen w-full bg-app flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sub">Loading expenses...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-app">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-app/80 backdrop-blur-lg border-b border-app">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-app bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                All Expenses
              </h1>
              <p className="text-sub mt-1 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Manage and track all your expenses
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Filters Section */}
        <div className="bg-card rounded-xl border border-app p-5 sm:p-6 mb-6 relative overflow-hidden group">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row gap-4">

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sub hover:text-app transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Search by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-app text-app pl-10 pr-10 py-2.5 border border-app rounded-lg placeholder:text-sub
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>

              {/* Category Select */}
              <div className="relative sm:w-56">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sub pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-app text-app pl-10 pr-4 py-2.5 border border-app rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer
                           hover:border-primary transition-colors font-medium"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary Bar */}
            <div className="mt-5 pt-5 border-t border-app">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-sub uppercase tracking-wide font-medium">Showing</p>
                    <p className="text-lg font-bold text-app">
                      {filteredAndSortedExpenses.length}
                      <span className="text-sub font-normal text-sm"> of {expenses.length}</span>
                    </p>
                  </div>
                  
                  <div className="h-10 w-px bg-border"></div>
                  
                  <div>
                    <p className="text-xs text-sub uppercase tracking-wide font-medium">Total Amount</p>
                    <p className="text-lg font-bold text-danger">
                      -${totalAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                {/* Active Filters */}
                {(searchTerm || selectedCategory !== "all") && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                        Search: {searchTerm}
                        <button onClick={() => setSearchTerm("")}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedCategory !== "all" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory("all")}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-app overflow-hidden relative group">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.01] to-transparent pointer-events-none" />
          
          <div className="relative overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-app">

              <thead className="bg-card/60 backdrop-blur-sm">
                <tr>
                  <th
                    onClick={() => toggleSort("title")}
                    className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-sub uppercase tracking-wider cursor-pointer hover:text-app transition-colors group/th"
                  >
                    <div className="flex items-center gap-2">
                      <span>Description</span>
                      <ArrowUpDown className={`w-4 h-4 transition-colors ${sortField === 'title' ? 'text-primary' : 'text-sub/50 group-hover/th:text-sub'}`} />
                    </div>
                  </th>

                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-sub uppercase tracking-wider">
                    Category
                  </th>

                  <th
                    onClick={() => toggleSort("date")}
                    className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-sub uppercase tracking-wider cursor-pointer hover:text-app transition-colors group/th"
                  >
                    <div className="flex items-center gap-2">
                      <span>Date</span>
                      <ArrowUpDown className={`w-4 h-4 transition-colors ${sortField === 'date' ? 'text-primary' : 'text-sub/50 group-hover/th:text-sub'}`} />
                    </div>
                  </th>

                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-sub uppercase tracking-wider">
                    Payment
                  </th>

                  <th
                    onClick={() => toggleSort("amount")}
                    className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-sub uppercase tracking-wider cursor-pointer hover:text-app transition-colors group/th"
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>Amount</span>
                      <ArrowUpDown className={`w-4 h-4 transition-colors ${sortField === 'amount' ? 'text-primary' : 'text-sub/50 group-hover/th:text-sub'}`} />
                    </div>
                  </th>

                  <th className="px-4 sm:px-6 py-4 text-center text-xs font-semibold text-sub uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-card divide-y divide-border">
                {filteredAndSortedExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center">
                          <DollarSign className="w-10 h-10 text-danger/50" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-app mb-1">No expenses found</p>
                          <p className="text-sm text-sub">Try adjusting your search or filters</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedExpenses.map((expense, index) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-primary/5 transition-all duration-200 group/row animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-app group-hover/row:text-primary transition-colors">
                            {expense.title}
                          </div>
                          {expense.description && (
                            <div className="text-xs text-sub mt-0.5 line-clamp-1">
                              {expense.description}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                            expense.category
                          )}`}
                        >
                          {getCategoryIcon(expense.category)}
                          <span>{expense.category}</span>
                        </span>
                      </td>

                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2 text-sub">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/5 text-app text-xs font-medium border border-primary/10">
                          <CreditCard className="w-3 h-3" />
                          {expense.paymentMethod}
                        </span>
                      </td>

                      <td className="px-4 sm:px-6 py-4 text-right">
                        <span className="text-base font-bold text-danger">
                          -${expense.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>

                      <td className="px-4 sm:px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            confirm("Are you sure you want to delete this expense?") &&
                            handleDelete(expense.id)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 text-sm font-medium transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          {/* Bottom accent line */}
          <div className="
            absolute 
            bottom-0 
            left-0 
            right-0 
            h-1 
            bg-gradient-to-r 
            from-danger/0 
            via-primary/40
            to-danger/0
          " />
        </div>

      </div>
    </div>
  );
};

export default ExpenseList;