"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignInPage() {
  const { status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (status === "authenticated") redirect("/dashboard")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 px-4">
      <Card className="w-full max-w-md border-white/10 bg-white/95 shadow-2xl">
        <CardHeader className="text-center">
          <Link className="text-3xl font-black tracking-tight text-gray-950" href="/">OUTMONI</Link>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in with Google or your email and password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full bg-emerald-600 hover:bg-emerald-700">Continue with Google</Button>
          <div className="relative text-center text-xs uppercase text-gray-500"><span className="bg-white px-2">or email login</span></div>
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); signIn("credentials", { email, password, callbackUrl: "/dashboard" }) }}>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Email" className="w-full rounded-xl border px-3 py-2" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={6} placeholder="Password" className="w-full rounded-xl border px-3 py-2" />
            <Button type="submit" className="w-full bg-slate-950 hover:bg-slate-800">Sign in with email</Button>
          </form>
          <p className="text-center text-sm text-gray-600">Don&apos;t have an account? <Link href="/auth/signup" className="text-emerald-600 hover:underline">Sign up</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
