"use client"
import React, { useEffect, useState } from "react";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<any[]>([]);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://localhost:5000/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setExpenses(data);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`http://localhost:5000/api/expenses`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }), // backend expects {id}
    });

    if (res.ok) {
      fetchExpenses(); // refresh list after delete
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="border rounded-3xl bg-stone-300 p-4">
      <h2 className="font-bold mb-2">My Expenses</h2>
      <ul className="space-y-2">
        {expenses.map((exp) => (
          <li key={exp.id} className="flex justify-between items-center">
            <span>
              {exp.name} - ${exp.amount} ({exp.category})
            </span>
            <button
              onClick={() => handleDelete(exp.id)}
              className="text-red-600 hover:text-red-800"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
