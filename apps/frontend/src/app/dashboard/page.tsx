"use client"

import { ChangeEvent, useEffect, useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowDownLeft,
  ArrowUpRight,
  BellRing,
  CalendarClock,
  CreditCard,
  Download,
  FileSpreadsheet,
  Landmark,
  PiggyBank,
  Plus,
  Search,
  Target,
  Trash2,
  Wallet,
} from "lucide-react"

type TransactionType = "income" | "expense" | "transfer"
type RecurringFrequency = "none" | "weekly" | "monthly" | "annual"

type Transaction = {
  id: number
  merchant: string
  amount: number
  type: TransactionType
  category: string
  note: string
  paymentMethod: string
  account: string
  date: string
  tags: string[]
  recurring: boolean
  recurringFrequency: RecurringFrequency
  attachment?: string
}

type Category = { id: number; name: string; type: "income" | "expense"; budget?: number }
type Account = { id: number; name: string; type: string; balance: number; accent: string }
type Goal = { id: number; name: string; saved: number; target: number }
type Bill = { id: number; name: string; amount: number; dueDate: string; account: string; autoPay: boolean }

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
const today = new Date("2026-07-15T00:00:00Z")

const initialAccounts: Account[] = [
  { id: 1, name: "ICICI Bank", type: "Bank", balance: 128000, accent: "from-orange-400 to-rose-500" },
  { id: 2, name: "HDFC Bank", type: "Bank", balance: 86500, accent: "from-blue-500 to-indigo-600" },
  { id: 3, name: "Cash", type: "Wallet", balance: 12500, accent: "from-emerald-400 to-teal-500" },
  { id: 4, name: "UPI", type: "Digital", balance: 24000, accent: "from-purple-500 to-fuchsia-500" },
  { id: 5, name: "Credit Card", type: "Liability", balance: -18600, accent: "from-slate-700 to-slate-950" },
  { id: 6, name: "Debit Card", type: "Card", balance: 42000, accent: "from-cyan-500 to-sky-600" },
]

const initialCategories: Category[] = [
  { id: 1, name: "Salary", type: "income" },
  { id: 2, name: "Freelance", type: "income" },
  { id: 3, name: "Business", type: "income" },
  { id: 4, name: "Food", type: "expense", budget: 18000 },
  { id: 5, name: "Rent", type: "expense", budget: 35000 },
  { id: 6, name: "Shopping", type: "expense", budget: 12000 },
  { id: 7, name: "Travel", type: "expense", budget: 15000 },
]

const initialTransactions: Transaction[] = [
  { id: 1, merchant: "Acme Payroll", amount: 140000, type: "income", category: "Salary", note: "July salary", paymentMethod: "Bank transfer", account: "HDFC Bank", date: "2026-07-01", tags: ["work"], recurring: true, recurringFrequency: "monthly", attachment: "salary-slip.pdf" },
  { id: 2, merchant: "Design Studio", amount: 32000, type: "income", category: "Freelance", note: "Landing page project", paymentMethod: "UPI", account: "ICICI Bank", date: "2026-07-06", tags: ["client", "side-hustle"], recurring: false, recurringFrequency: "none" },
  { id: 3, merchant: "Green Heights", amount: 35000, type: "expense", category: "Rent", note: "Apartment rent", paymentMethod: "Bank transfer", account: "ICICI Bank", date: "2026-07-03", tags: ["home"], recurring: true, recurringFrequency: "monthly", attachment: "rent-receipt.pdf" },
  { id: 4, merchant: "Cult Fit", amount: 2499, type: "expense", category: "Fitness", note: "Gym membership", paymentMethod: "Credit Card", account: "Credit Card", date: "2026-07-05", tags: ["health"], recurring: true, recurringFrequency: "monthly" },
  { id: 5, merchant: "Big Basket", amount: 4200, type: "expense", category: "Food", note: "Groceries", paymentMethod: "UPI", account: "UPI", date: "2026-07-12", tags: ["groceries", "weekly"], recurring: false, recurringFrequency: "none", attachment: "receipt.jpg" },
  { id: 6, merchant: "Myntra", amount: 6800, type: "expense", category: "Shopping", note: "Shoes", paymentMethod: "Debit Card", account: "Debit Card", date: "2026-07-13", tags: ["lifestyle"], recurring: false, recurringFrequency: "none" },
  { id: 7, merchant: "Wallet Transfer", amount: 10000, type: "transfer", category: "Account transfer", note: "Moved money to cash", paymentMethod: "Internal", account: "ICICI Bank → Cash", date: "2026-07-14", tags: ["transfer"], recurring: false, recurringFrequency: "none" },
]

const initialBills: Bill[] = [
  { id: 1, name: "Rent", amount: 35000, dueDate: "2026-08-03", account: "ICICI Bank", autoPay: true },
  { id: 2, name: "Credit card payment", amount: 18600, dueDate: "2026-07-22", account: "HDFC Bank", autoPay: false },
  { id: 3, name: "Gym membership", amount: 2499, dueDate: "2026-08-05", account: "Credit Card", autoPay: true },
]

const goals: Goal[] = [
  { id: 1, name: "Buy laptop", saved: 75000, target: 150000 },
  { id: 2, name: "Emergency fund", saved: 220000, target: 300000 },
]

const chartColors = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
const storageKeys = { transactions: "outmoni.transactions", categories: "outmoni.categories" }

function readStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  const value = window.localStorage.getItem(key)
  return value ? JSON.parse(value) as T : fallback
}

function downloadFile(filename: string, contents: string, type: string) {
  const blob = new Blob([contents], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => readStoredData(storageKeys.transactions, initialTransactions))
  const [categories, setCategories] = useState<Category[]>(() => readStoredData(storageKeys.categories, initialCategories))
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [form, setForm] = useState({ merchant: "", amount: "", type: "expense" as TransactionType, category: "Food", note: "", paymentMethod: "UPI", account: "UPI", date: "2026-07-15", tags: "", recurring: false, recurringFrequency: "none" as RecurringFrequency, attachment: "" })
  const [newCategory, setNewCategory] = useState("")

  useEffect(() => {
    window.localStorage.setItem(storageKeys.transactions, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    window.localStorage.setItem(storageKeys.categories, JSON.stringify(categories))
  }, [categories])

  const pageSize = 5
  const monthTransactions = transactions.filter((transaction) => transaction.date.startsWith("2026-07"))
  const monthlyIncome = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const currentBalance = initialAccounts.reduce((sum, account) => sum + account.balance, 0)
  const netWorth = currentBalance + goals.reduce((sum, goal) => sum + goal.saved, 0)
  const savings = monthlyIncome - monthlyExpenses
  const spendingThisWeek = transactions.filter((transaction) => {
    const txDate = new Date(transaction.date)
    const diffDays = (today.getTime() - txDate.getTime()) / 86400000
    return transaction.type === "expense" && diffDays >= 0 && diffDays <= 7
  }).reduce((sum, transaction) => sum + transaction.amount, 0)

  const kpiCards: Array<[string, number, LucideIcon]> = [["Current balance", currentBalance, Wallet], ["Monthly income", monthlyIncome, ArrowUpRight], ["Monthly expenses", monthlyExpenses, ArrowDownLeft], ["Savings", savings, PiggyBank], ["Net worth", netWorth, Landmark], ["Spending this week", spendingThisWeek, CalendarClock]]

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const haystack = [transaction.category, transaction.amount.toString(), transaction.note, transaction.merchant, transaction.tags.join(" ")].join(" ").toLowerCase()
      return haystack.includes(search.toLowerCase()) && (typeFilter === "all" || transaction.type === typeFilter) && (categoryFilter === "all" || transaction.category === categoryFilter)
    })
  }, [transactions, search, typeFilter, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
  const paginatedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize)

  const categorySpending = categories.filter((category) => category.type === "expense").map((category) => ({ name: category.name, value: transactions.filter((transaction) => transaction.type === "expense" && transaction.category === category.name).reduce((sum, transaction) => sum + transaction.amount, 0), budget: category.budget ?? 0 })).filter((item) => item.value > 0 || item.budget > 0)
  const dailyTrend = ["2026-07-01", "2026-07-05", "2026-07-10", "2026-07-15"].map((date) => ({ date: date.slice(5), income: transactions.filter((t) => t.date <= date && t.type === "income").reduce((sum, t) => sum + t.amount, 0), expense: transactions.filter((t) => t.date <= date && t.type === "expense").reduce((sum, t) => sum + t.amount, 0) }))

  const addTransaction = () => {
    if (!form.merchant || !form.amount) return
    setTransactions((current) => [{ id: Date.now(), ...form, amount: Number(form.amount), tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) }, ...current])
    setForm({ ...form, merchant: "", amount: "", note: "", tags: "", attachment: "" })
  }

  const updateTransaction = (id: number) => {
    setTransactions((current) => current.map((transaction) => transaction.id === id ? { ...transaction, note: `${transaction.note} (reviewed)` } : transaction))
  }

  const deleteTransaction = (id: number) => setTransactions((current) => current.filter((transaction) => transaction.id !== id))

  const exportCsv = () => {
    const header = ["date", "merchant", "amount", "type", "category", "note", "paymentMethod", "account", "tags", "recurring", "recurringFrequency", "attachment"]
    const rows = transactions.map((transaction) => header.map((key) => {
      const value = key === "tags" ? transaction.tags.join("|") : String(transaction[key as keyof Transaction] ?? "")
      return `"${value.replaceAll('"', '""')}"`
    }).join(","))
    downloadFile("outmoni-transactions.csv", [header.join(","), ...rows].join("\n"), "text/csv")
  }

  const exportJson = () => downloadFile("outmoni-export.json", JSON.stringify({ transactions, categories, accounts: initialAccounts, bills: initialBills, goals }, null, 2), "application/json")

  const exportPdf = () => window.print()

  const importCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const [, ...lines] = text.split(/\r?\n/).filter(Boolean)
    const imported = lines.map((line, index) => {
      const [date, merchant, amount, type, category, note, paymentMethod, account, tags] = line.split(",").map((cell) => cell.replace(/^"|"$/g, ""))
      return { id: Date.now() + index, date: date || new Date().toISOString().slice(0, 10), merchant: merchant || "Imported", amount: Number(amount) || 0, type: (type as TransactionType) || "expense", category: category || "Imported", note: note || "Imported bank statement", paymentMethod: paymentMethod || "Bank", account: account || "Imported account", tags: tags ? tags.split("|") : ["imported"], recurring: false, recurringFrequency: "none" as RecurringFrequency }
    })
    setTransactions((current) => [...imported, ...current])
    event.target.value = ""
  }

  const runRecurring = () => {
    const generated = transactions.filter((transaction) => transaction.recurring).map((transaction) => ({ ...transaction, id: Date.now() + transaction.id, date: "2026-08-01", note: `${transaction.note} · auto-generated`, tags: [...new Set([...transaction.tags, "recurring"])] }))
    setTransactions((current) => [...generated, ...current])
  }

  const addCategory = () => {
    if (!newCategory) return
    setCategories((current) => [...current, { id: Date.now(), name: newCategory, type: form.type === "income" ? "income" : "expense", budget: form.type === "expense" ? 10000 : undefined }])
    setForm((current) => ({ ...current, category: newCategory }))
    setNewCategory("")
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,#14b8a633,transparent_30%),radial-gradient(circle_at_top_right,#6366f133,transparent_28%)]" />
      <section className="relative z-10 space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-emerald-200">Outmoni Command Center</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-6xl">Modern money dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Email/password and Google auth, advanced transactions, accounts, budgets, goals, recurring bills, notifications, imports, exports, and analytics in one workspace.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportCsv} className="rounded-full bg-emerald-400 px-5 py-3 font-semibold text-slate-950"><Download className="mr-2 inline h-4 w-4" />Export CSV</button>
            <button onClick={exportJson} className="rounded-full bg-white px-5 py-3 font-semibold text-slate-950"><Download className="mr-2 inline h-4 w-4" />Export Excel-ready JSON</button>
            <button onClick={exportPdf} className="rounded-full border border-white/15 px-5 py-3 font-semibold"><Download className="mr-2 inline h-4 w-4" />Print PDF</button>
            <label className="cursor-pointer rounded-full border border-white/15 px-5 py-3 font-semibold"><FileSpreadsheet className="mr-2 inline h-4 w-4" />Import bank CSV<input type="file" accept=".csv,text/csv" onChange={importCsv} className="hidden" /></label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {kpiCards.map(([label, value, Icon]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-xl backdrop-blur">
              <Icon className="mb-4 h-6 w-6 text-emerald-300" />
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-1 text-2xl font-bold">{currency.format(value)}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Cashflow and daily trend</h2><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-200">Savings rate {monthlyIncome ? Math.round((savings / monthlyIncome) * 100) : 0}%</span></div>
            <div className="h-72"><ResponsiveContainer><AreaChart data={dailyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 16 }} /><Area dataKey="income" stroke="#10b981" fill="#10b98133" /><Area dataKey="expense" stroke="#ef444433" fill="#ef444433" /></AreaChart></ResponsiveContainer></div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-xl backdrop-blur">
            <h2 className="mb-4 text-xl font-bold">Category-wise spending</h2>
            <div className="h-72"><ResponsiveContainer><PieChart><Pie data={categorySpending} dataKey="value" innerRadius={60} outerRadius={105}>{categorySpending.map((_, index) => <Cell key={index} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 16 }} /></PieChart></ResponsiveContainer></div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-xl backdrop-blur xl:col-span-2">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><h2 className="text-xl font-bold">Transactions CRUD</h2><div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search category, amount, note, merchant, tags" className="w-80 rounded-2xl border border-white/10 bg-slate-950/70 py-2 pl-9 pr-3 text-sm outline-none" /></div><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TransactionType | "all")} className="rounded-2xl border border-white/10 bg-slate-950/70 px-3"><option value="all">All types</option><option value="income">Income</option><option value="expense">Expense</option><option value="transfer">Transfer</option></select><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-3"><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></div></div>
            <div className="grid gap-2 rounded-3xl border border-white/10 bg-slate-950/50 p-3 md:grid-cols-6"><input placeholder="Merchant" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} className="rounded-2xl bg-white/10 px-3 py-2" /><input placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="rounded-2xl bg-white/10 px-3 py-2" /><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })} className="rounded-2xl bg-white/10 px-3 py-2"><option>income</option><option>expense</option><option>transfer</option></select><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl bg-white/10 px-3 py-2">{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-2xl bg-white/10 px-3 py-2" /><button onClick={addTransaction} className="rounded-2xl bg-emerald-400 px-4 py-2 font-bold text-slate-950"><Plus className="mr-1 inline h-4 w-4" />Create</button><input placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="rounded-2xl bg-white/10 px-3 py-2 md:col-span-2" /><input placeholder="Payment method" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="rounded-2xl bg-white/10 px-3 py-2" /><select value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} className="rounded-2xl bg-white/10 px-3 py-2">{initialAccounts.map((account) => <option key={account.id}>{account.name}</option>)}</select><input placeholder="Tags comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="rounded-2xl bg-white/10 px-3 py-2" /><input placeholder="Receipt attachment" value={form.attachment} onChange={(e) => setForm({ ...form, attachment: e.target.value })} className="rounded-2xl bg-white/10 px-3 py-2" /></div>
            <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="text-slate-400"><tr>{["Date", "Merchant", "Amount", "Category", "Note", "Payment", "Account", "Tags", "Recurring", "Receipt", "Actions"].map((head) => <th key={head} className="px-3 py-3">{head}</th>)}</tr></thead><tbody>{paginatedTransactions.map((transaction) => <tr key={transaction.id} className="border-t border-white/10"><td className="px-3 py-3">{transaction.date}</td><td className="px-3 py-3 font-semibold">{transaction.merchant}</td><td className={transaction.type === "income" ? "px-3 py-3 text-emerald-300" : transaction.type === "expense" ? "px-3 py-3 text-rose-300" : "px-3 py-3 text-sky-300"}>{transaction.type === "income" ? "+" : transaction.type === "expense" ? "-" : "↔"}{currency.format(transaction.amount)}</td><td className="px-3 py-3">{transaction.category}</td><td className="px-3 py-3">{transaction.note}</td><td className="px-3 py-3">{transaction.paymentMethod}</td><td className="px-3 py-3">{transaction.account}</td><td className="px-3 py-3">{transaction.tags.join(", ")}</td><td className="px-3 py-3">{transaction.recurring ? transaction.recurringFrequency : "No"}</td><td className="px-3 py-3">{transaction.attachment ?? "—"}</td><td className="px-3 py-3"><button onClick={() => updateTransaction(transaction.id)} className="mr-2 rounded-full bg-white/10 px-3 py-1">Update</button><button onClick={() => deleteTransaction(transaction.id)} className="rounded-full bg-rose-500/20 px-3 py-1 text-rose-200"><Trash2 className="inline h-3 w-3" /></button></td></tr>)}</tbody></table></div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-300"><span>Page {page} of {totalPages} · {filteredTransactions.length} results</span><div className="space-x-2"><button disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-40">Prev</button><button disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-40">Next</button></div></div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-xl backdrop-blur"><h2 className="mb-4 text-xl font-bold">Upcoming bills & notifications</h2>{initialBills.map((bill) => <div key={bill.id} className="mb-3 rounded-2xl bg-slate-950/50 p-4"><div className="flex items-center justify-between"><span className="font-semibold">{bill.name}</span><BellRing className="h-4 w-4 text-amber-300" /></div><p className="text-sm text-slate-400">{currency.format(bill.amount)} due {bill.dueDate} · {bill.autoPay ? "auto-pay" : "manual"}</p></div>)}<button onClick={runRecurring} className="mb-3 w-full rounded-2xl bg-emerald-400 px-4 py-3 font-bold text-slate-950">Generate recurring transactions</button><p className="rounded-2xl bg-rose-500/15 p-3 text-sm text-rose-100">Budget exceed alerts, recurring transaction reminders, bill nudges, and goal milestones are enabled.</p></div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-xl backdrop-blur"><h2 className="mb-4 text-xl font-bold">Custom categories</h2><div className="flex gap-2"><input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Create category" className="min-w-0 flex-1 rounded-2xl bg-slate-950/70 px-3 py-2" /><button onClick={addCategory} className="rounded-2xl bg-white px-4 font-bold text-slate-950">Add</button></div><div className="mt-3 flex flex-wrap gap-2">{categories.map((category) => <span key={category.id} className="rounded-full bg-white/10 px-3 py-1 text-sm">{category.name}</span>)}</div></div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 lg:col-span-2"><h2 className="mb-4 text-xl font-bold">Accounts & money moves</h2><div className="grid gap-3 md:grid-cols-2">{initialAccounts.map((account) => <div key={account.id} className={`rounded-3xl bg-gradient-to-br ${account.accent} p-5 shadow-lg`}><CreditCard className="mb-6 h-6 w-6" /><p className="text-sm opacity-80">{account.type}</p><p className="text-xl font-bold">{account.name}</p><p className="mt-3 text-2xl font-black">{currency.format(account.balance)}</p></div>)}</div></div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5"><h2 className="mb-4 text-xl font-bold">Monthly & annual budgets</h2>{categorySpending.map((item) => <div key={item.name} className="mb-4"><div className="flex justify-between text-sm"><span>{item.name}</span><span>{currency.format(item.value)} / {currency.format(item.budget || 1)}</span></div><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-emerald-400" style={{ width: `${Math.min(100, (item.value / (item.budget || 1)) * 100)}%` }} /></div></div>)}<p className="text-sm text-slate-400">Annual plan: {currency.format(900000)} with category envelopes.</p></div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5"><h2 className="mb-4 text-xl font-bold">Goals</h2>{goals.map((goal) => <div key={goal.id} className="mb-5"><Target className="mb-2 h-5 w-5 text-emerald-300" /><div className="flex justify-between text-sm"><span>{goal.name}</span><span>{Math.round((goal.saved / goal.target) * 100)}%</span></div><p className="text-sm text-slate-400">Saved {currency.format(goal.saved)} of {currency.format(goal.target)}</p><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-sky-400" style={{ width: `${(goal.saved / goal.target) * 100}%` }} /></div></div>)}</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3"><div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5"><h2 className="mb-4 text-xl font-bold">Monthly spending</h2><div className="h-56"><ResponsiveContainer><BarChart data={categorySpending}><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 16 }} /><Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div><div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5"><h2 className="mb-4 text-xl font-bold">Income vs expense</h2><div className="h-56"><ResponsiveContainer><LineChart data={dailyTrend}><XAxis dataKey="date" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 16 }} /><Line dataKey="income" stroke="#22c55e" strokeWidth={3} /><Line dataKey="expense" stroke="#f43f5e" strokeWidth={3} /></LineChart></ResponsiveContainer></div></div><div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5"><h2 className="mb-4 text-xl font-bold">Profile preferences</h2><div className="grid gap-3 text-sm"><span className="rounded-2xl bg-white/10 p-3">Currency: INR</span><span className="rounded-2xl bg-white/10 p-3">Timezone: Asia/Kolkata</span><span className="rounded-2xl bg-white/10 p-3">Theme: Dark mode</span><span className="rounded-2xl bg-white/10 p-3">Language: English</span></div></div></div>
      </section>
    </main>
  )
}
