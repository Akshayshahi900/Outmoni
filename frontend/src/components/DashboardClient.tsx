"use client"

import { Expense } from "@/types/userTypes"
import { Session } from "next-auth"
import React, { useState } from "react"
import { Bounce, toast, ToastContainer } from "react-toastify"



interface DashboardClientProps {
    session: Session
    initialExpenses?: any[]
}

export default function DashboardClient({ session, initialExpenses }: DashboardClientProps) {
    const [expenses, setExpenses] = useState<Expense>({
        name: "",
        category: "",
        amount: 0,
        date: "",
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setExpenses((prevExpenses: Expense) => ({
            ...prevExpenses,
            [name]: name === "amount" ? Number(value) : value,
        }))
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": session.user?.id || "",
                    "Authorization": `Bearer ${session.user?.id}`,
                },
                body: JSON.stringify({
                    ...expenses,
                    userId: session.user?.id
                }),
            })
            if (response.ok) {
                notify();
                setExpenses({ name: "", category: "", amount: 0, date: "" })
            } else {
                const error = await response.json();
                toast.error(`Failed to add expenses:${error.message}`)
            }

        }
        catch (error) {
            toast.error("Network error. Please try again later.");
            console.error("Submit error:", error)
        }
    }

    const notify = () => {
        toast.success("Expense added successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        })
    }

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />

            {/* User Welcome Section */}


            {/* Expense Form */}

            <div className="flex justify-center items-center min-h-screen bg-slate-100">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-5"
                >
                    <h2 className="text-2xl font-bold text-gray-700 text-center">Add Expense</h2>

                    <div>
                        <label className="block mb-1 text-gray-600 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={expenses.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="Enter expense name"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-600 font-medium">Category</label>
                        <input
                            type="text"
                            name="category"
                            required
                            value={expenses.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="e.g. Food, Travel"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-600 font-medium">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            required
                            value={expenses.amount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="Enter amount"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-600 font-medium">Date</label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={expenses.date}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
                    >
                        Submit
                    </button>
                </form>
            </div>

        </>
    )
}