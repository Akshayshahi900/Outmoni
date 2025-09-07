// components/AddExpenseModal.tsx
"use client"

import { getSession, useSession } from "next-auth/react"
import { useState } from "react"

export default function AddExpenseModal({ onAdd }: { onAdd: (data: any) => void }) {


  const { data: session } = useSession();

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: "",
    amount: 0,
    category: "expense",
    date: new Date().toISOString().slice(0, 10),
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const {name , value} = e.target;
     setForm({
    ...form,
    [name]:
      name === "amount"
        ? Number(value) // convert string → number
        : name === "date"
        ? new Date(value).toISOString() // convert string → ISO DateTime
        : value,
  })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!session) {
      alert("You must be logged in to add an expense.");
      return;
    }
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const newExpense = await res.json();
      onAdd(newExpense);
      setForm({
        title: "",
        amount: 0,
        category: "expense",
        date: new Date().toISOString().slice(0, 10),
      })
      setOpen(false);
    }
    else {
      const error = await res.json();
      alert("Error creating expense:" + error.error);
    }
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
            <button onClick={() => setOpen(false)} className="w-fit p-2 rounded-sm  relative left-[calc(100%-1.8rem)] bottom-10 transform -translate-x-1/2 bg-red-400 text-white border">
              Cancel
            </button>

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
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                name="date"
                type="date"
                value={form.date.slice(0,10)}
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
