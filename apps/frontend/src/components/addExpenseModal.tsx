"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Plus, X, DollarSign, Calendar, Tag } from "lucide-react";
import { createPortal } from "react-dom";

export default function AddExpenseModal({ onAdd }: { onAdd: (data: any) => void }) {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues for portals
  useEffect(() => setMounted(true), []);

  const [form, setForm] = useState({
    title: "",
    amount: 0,
    category: "expense",
    date: new Date().toISOString().slice(0, 10),
  });

  const notify = () => {
    toast.success("Transaction added successfully!", {
      autoClose: 3000,
      pauseOnHover: true,
      theme: "colored",
      transition: Bounce,
    });
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "amount"
          ? Number(value)
          : name === "date"
          ? new Date(value).toISOString()
          : value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session) {
      toast.error("You must be logged in to add a transaction.");
      return;
    }

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const newExpense = await res.json();
      onAdd(newExpense);
      notify();
      setForm({
        title: "",
        amount: 0,
        category: "expense",
        date: new Date().toISOString().slice(0, 10),
      });
      setOpen(false);
    } else {
      toast.error("Network error. Please try again later.");
    }
  }

  /* ---------------------- PORTAL RENDER FUNCTIONS ---------------------- */

  const FloatingButton = mounted
    ? createPortal(
        <button
          onClick={() => setOpen(true)}
          className="
            fixed bottom-6 right-6 z-[9998]
            group flex items-center gap-2
            bg-gradient-to-r from-primary to-accent
            text-white px-6 py-3 rounded-full
            shadow-xl hover:shadow-2xl hover:scale-105
            transition-all duration-200 font-semibold
          "
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          Add
        </button>,
        document.body
      )
    : null;

  const Modal = mounted && open
    ? createPortal(
        <div
          className="
            fixed inset-0 z-[9999]
            bg-black/60 backdrop-blur-md
            flex items-center justify-center
            animate-in fade-in duration-200
            p-4
          "
          onClick={() => setOpen(false)}
        >
          <div
            className="
              relative bg-card text-app border border-app
              p-6 sm:p-8 rounded-2xl shadow-2xl
              w-full max-w-md animate-in zoom-in-95 duration-200
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent rounded-2xl pointer-events-none" />

            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-app">Add Transaction</h2>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setOpen(false)}
                  className="
                    w-8 h-8 rounded-lg
                    bg-danger/10 hover:bg-danger/20
                    text-danger flex items-center justify-center
                    transition-colors duration-200
                  "
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-sub mb-2">Title</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub" />
                    <input
                      name="title"
                      placeholder="e.g., Grocery Shopping"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="
                        w-full bg-app text-app border border-app
                        pl-10 pr-4 py-3 rounded-lg
                        focus:ring-2 focus:ring-primary focus:border-primary
                        outline-none transition-all
                      "
                    />
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-sub mb-2">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub" />
                    <input
                      name="amount"
                      type="number"
                      placeholder="0.00"
                      value={form.amount || ""}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="
                        w-full bg-app text-app border border-app
                        pl-10 pr-4 py-3 rounded-lg
                        focus:ring-2 focus:ring-primary focus:border-primary
                        outline-none transition-all
                      "
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-sub mb-2">Type</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="
                      w-full bg-app text-app border border-app
                      px-4 py-3 rounded-lg
                      focus:ring-2 focus:ring-primary focus:border-primary
                      outline-none transition-all cursor-pointer
                    "
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-sub mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub pointer-events-none" />
                    <input
                      name="date"
                      type="date"
                      value={form.date.slice(0, 10)}
                      onChange={handleChange}
                      required
                      className="
                        w-full bg-app text-app border border-app
                        pl-10 pr-4 py-3 rounded-lg
                        focus:ring-2 focus:ring-primary focus:border-primary
                        outline-none transition-all
                      "
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="
                      flex-1 bg-app text-app border border-app
                      px-4 py-3 rounded-xl font-semibold
                      hover:bg-danger/10 hover:text-danger hover:border-danger/20
                      transition-all duration-200
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      flex-1 bg-gradient-to-r from-primary to-accent
                      text-white px-4 py-3 rounded-xl font-semibold
                      hover:shadow-lg hover:scale-105
                      transition-all duration-200
                      flex items-center justify-center gap-2
                    "
                  >
                    <Plus className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <ToastContainer />
      {FloatingButton}
      {Modal}
    </>
  );
}
