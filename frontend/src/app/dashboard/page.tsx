import { auth } from "@/auth"
import Image from "next/image";
import { redirect } from "next/navigation"
// import { useEffect, useState } from "react";
// import { getUserExpenses } from "@/lib/auth";



export default async function Dashboard() {
  const session = await auth();

  if (!session) redirect("/login");

  await fetch("http://localhost:3000/api/expenses", {
    headers: {
      Authorization: `Bearer ${session?.user?.id}`
    }
  })
  await fetch("http://localhost:5000/api/auth/me", {
    headers: {
      Authorization: `Bearer ${session?.user?.id}`, // this must be the actual JWT token (fix NextAuth if needed)
    }
  });

  return <>

    <div> Welcome , {session.user?.name}</div>
    <div>
      <Image
        src={session.user?.image || '/default-profile.png'}
        alt="Profile Picture"
        className="h-10 w-10 rounded-full"
      />
      <span>Welcome, {session.user?.name}</span>
    </div>

  </>;
}
