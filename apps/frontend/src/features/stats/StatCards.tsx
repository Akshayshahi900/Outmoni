export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-card text-app border border-border p-4 rounded-lg shadow-sm">
        Balance: $5000
      </div>
      <div className="bg-card text-app border border-border p-4 rounded-lg shadow-sm">
        Income: $2000
      </div>
      <div className="bg-card text-app border border-border p-4 rounded-lg shadow-sm">
        Expenses: $1200
      </div>
      <div className="bg-card text-app border border-border p-4 rounded-lg shadow-sm">
        Savings: $800
      </div>
    </div>
  );
}
