"use client"
import { getSession } from "next-auth/react";

export async function sendToBackend(data: any) {
    const session = await getSession();
    if (!session) throw new Error("Not authenticated");

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/expenses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user?.id}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
}