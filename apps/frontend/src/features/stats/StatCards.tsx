export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">Balance: $5000</div>
      <div className="bg-white p-4 rounded-lg shadow">Income: $2000</div>
      <div className="bg-white p-4 rounded-lg shadow">Expenses: $1200</div>
      <div className="bg-white p-4 rounded-lg shadow">Savings: $800</div>
    </div>
  )
}
