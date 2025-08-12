import { redirect } from "next/navigation"
import { Expense } from "@/types/userTypes";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";
import DashboardClient from "@/components/DashboardClient";
import { getSession } from "next-auth/react";

export default async function Dashboard() {

  // auth logic

  const session = await getServerSession(authConfig);



  if (!session) redirect("/auth/signin");


  let initialExpenses:Expense[] = [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/expenses`, {
      method:"GET",
      headers: {
        Authorization: `Bearer ${session.user?.id}`,
      }
    });
    if(response.ok){
      initialExpenses = await response.json();
    }
  }
  catch (error) {
    console.log("Failed to fetch expenses", error);
  }
  return (
    <DashboardClient session={session} initialExpenses={initialExpenses} />
  )
}
