
import { redirect } from "next/navigation"

// onchange function


import { Expense } from "@/types/userTypes";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import DashboardClient from "@/components/DashboardClient";
import { getSession } from "next-auth/react";

export default async function Dashboard() {

  // auth logic

  const session = await getServerSession(authConfig);



  if (!session) redirect("/auth/signin");

  export async function sendToBackend(data:any){
    const session = await getSession();

    if(!session) throw new Error(" Not authenticated ");

    // The NextAuth JWT is stored in session.access

  }
  let initialExpenses:Expense[] = []
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/expenses`, {
      headers: {
        Authorization: `Bearer ${session.user?.id}`,
      },
      body: JSON.stringify({
      })

    if(response.ok){
        initialExpenses = await response.json()
      }
  }
  catch (error) {
    console.log("Failed to fetch expenses", error);
  }


  //toast



  return (
    <DashboardClient session={session} initialExpenses={initialExpenses} />
  )
}
