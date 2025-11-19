export default function TransactionList() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span>Groceries</span>
          <span className="text-red-500">- $50</span>
        </li>
        <li className="flex justify-between">
          <span>Salary</span>
          <span className="text-green-500">+ $2000</span>
        </li>
      </ul>
    </div>
  )
}
