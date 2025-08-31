import StatCards from "@/features/stats/StatCards"
import TransactionList from "@/features/expenses/TransactionList"
import { useState } from "react";

export default function DashboardPage() 
{
  const [expenses , setExpenses] = useState<any[]>([]);
  function handleAdd(newExpense: any) {
    setExpenses([...expenses, {id:Date.now(), ...newExpense}]);
  }
  return (
    <div className="grid gap-6">
       <div className="p-6">
      <h1 className="text-2xl mb-4">expenses</h1>
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Title</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Type</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(tx => (
            <tr key={tx.id} className="border-b">
              <td className="p-2">{tx.title}</td>
              <td className="p-2">${tx.amount}</td>
              <td className="p-2">{tx.type}</td>
              <td className="p-2">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Expense Button & Modal */}
      <AddExpenseModal onAdd={handleAdd} />
    </div>
      <StatCards />
      <TransactionList />
    </div>
  )
}
