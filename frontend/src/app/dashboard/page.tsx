"use client"

import { auth } from "@/auth"

import Image from "next/image";
import { redirect } from "next/navigation"
import React, { useState } from "react";
// import { getUserExpenses } from "@/lib/auth";
// onchange function
import { Bounce, toast, ToastContainer } from "react-toastify";

import { Expense } from "@/types/userTypes";

export default function Dashboard() {


  const [expenses, setExpenses] = useState({
    "name": "",
    "category": "",
    "amount": 0,
    "date": "",
  }
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setExpenses((prevExpenses: Expense) => ({
      ...prevExpenses,
      [name]:name==="amount" ?Number(value): value,
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenses),
    });

    if(response.ok){
      notify();
      setExpenses({name:"" , category:"" , amount:0, date:""});
    }
  };

  //toast
  const notify = () => {
    toast("Expense added successfully",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );
  }

  // const session = await auth();
  
  // if (!session) redirect("/login");

  // await fetch("http://localhost:3000/api/expenses", {
  //   headers: {
  //     Authorization: `Bearer ${session?.user?.id}`
  //   }
  // })
  // await fetch("http://localhost:5000/api/auth/me", {
  //   headers: {
  //     Authorization: `Bearer ${session?.user?.id}`, // this must be the actual JWT token (fix NextAuth if needed)
  //   }
  // });

  return <>
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
    {/* <div> Welcome , {session.user?.name}</div>
    <div>
      <Image
        src={session.user?.image || '/default-profile.png'}
        alt="Profile Picture"
        className="h-10 w-10 rounded-full"
      />
      <span>Welcome, {session.user?.name}</span> 
    </div> */}
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
            onChange={handleChange} required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter expense name"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600 font-medium">Category</label>
          <input
            type="text"
            name="category" required
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
            name="amount" required
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
            name="date" required
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


  </>;
}
