// components/AddExpenseModal.tsx
"use client"

import { useState } from "react"

export default function AddExpenseModal({ onAdd }: { onAdd: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    date: new Date().toISOString().slice(0,10),
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onAdd(form)  // pass data to parent (or call API directly here)
    setOpen(false)
  }

  return (
    <>
      {/* Floating + Button */}
      <button 
        onClick={() => setOpen(true)} 
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg"
      >
        +
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-2xl ">
            <h2 className="text-xl mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input 
                name="title" 
                placeholder="Title" 
                value={form.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input 
                name="amount" 
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <select 
                name="type" 
                value={form.type} 
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input 
                name="date" 
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <button type="submit" className="bg-green-600 text-white w-full p-2 rounded">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
