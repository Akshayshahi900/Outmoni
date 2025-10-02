"use client"
import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  ArrowUpDown,
  Download,
  Plus,
  Coffee,
  Home,
  Car,
  CreditCard,
  ShoppingCart,
  Smartphone,
  MoreHorizontal,
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
  const [sortField, setSortField] = useState<"date" | "amount" | "title">(
    "date"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/expenses");
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleDelete(id: string) {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
    if (res.ok) {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    } else {
      alert("Failed to delete expense")
    }
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
      case "food":
        return <Coffee className="w-4 h-4" />;
      case "housing":
        return <Home className="w-4 h-4" />;
      case "transportation":
        return <Car className="w-4 h-4" />;
      case "entertainment":
        return <CreditCard className="w-4 h-4" />;
      case "utilities":
        return <Smartphone className="w-4 h-4" />;
      case "shopping":
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      food: "bg-orange-50 text-orange-700 border-orange-200",
      housing: "bg-blue-50 text-blue-700 border-blue-200",
      transportation: "bg-green-50 text-green-700 border-green-200",
      entertainment: "bg-purple-50 text-purple-700 border-purple-200",
      utilities: "bg-yellow-50 text-yellow-700 border-yellow-200",
      shopping: "bg-pink-50 text-pink-700 border-pink-200",
      health: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      colors[category.toLowerCase() as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
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
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory
      );
    }

    filtered = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "date":
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [expenses, searchTerm, selectedCategory, sortField, sortDirection]);

  const totalAmount = filteredAndSortedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleSort = (field: "date" | "amount" | "title") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading expenses...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              All Expenses
            </h1>
            <p className="text-gray-600">
              Manage and track all your expenses in one place
            </p>
          </div>
          <div className="flex gap-3">
            {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </button> */}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedExpenses.length} of {expenses.length}{" "}
              expenses
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Total:{" "}
              <span className="text-red-600">${totalAmount.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort("title")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Description</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th
                    onClick={() => handleSort("date")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Method
                  </th>
                  <th
                    onClick={() => handleSort("amount")}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Amount</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedExpenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No expenses found</p>
                      <p className="text-sm">
                        Try adjusting your search or filter criteria
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {expense.title}
                          </div>
                          {expense.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {expense.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
                            expense.category
                          )}`}
                        >
                          {getCategoryIcon(expense.category)}
                          <span className="ml-1">{expense.category}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-red-600">
                        -${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this expense?")) {
                              handleDelete(expense.id)
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
