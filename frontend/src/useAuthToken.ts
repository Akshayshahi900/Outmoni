"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function useAuthToken() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetch("http://localhost:5000/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem("token", data.token); // or cookies
          }
        })
        .catch(console.error);
    }
  }, [session]);
}
