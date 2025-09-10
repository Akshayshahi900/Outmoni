"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function Linechart({ data }: { data: any[] }) {
  // 🔹 Group expenses by date
  const dailyTotals: { [date: string]: number } = {}

  data.forEach((tx) => {
    const date = new Date(tx.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

    // expense = negative, income = positive
    const amount = tx.category === "income" ? tx.amount : -tx.amount
    dailyTotals[date] = (dailyTotals[date] || 0) + amount
  })

  // 🔹 Convert into array sorted by date
  const chartData = Object.keys(dailyTotals).map((date) => ({
    date,
    balance: dailyTotals[date],
  }))

  // 🔹 Sort chronologically (important!)
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Cash Flow</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
