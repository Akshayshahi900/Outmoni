"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpPage() {
  const { status } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (status === "authenticated") redirect("/dashboard")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 px-4">
      <Card className="w-full max-w-md border-white/10 bg-white/95 shadow-2xl">
        <CardHeader className="text-center">
          <Link className="text-3xl font-black tracking-tight text-gray-950" href="/">OUTMONI</Link>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Use Google or email/password to start tracking money.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full bg-emerald-600 hover:bg-emerald-700">Continue with Google</Button>
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); signIn("credentials", { name, email, password, mode: "register", callbackUrl: "/dashboard" }) }}>
            <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Full name" className="w-full rounded-xl border px-3 py-2" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Email" className="w-full rounded-xl border px-3 py-2" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={6} placeholder="Password" className="w-full rounded-xl border px-3 py-2" />
            <Button type="submit" className="w-full bg-slate-950 hover:bg-slate-800">Create account</Button>
          </form>
          <p className="text-center text-sm text-gray-600">Already have an account? <Link href="/auth/signin" className="text-emerald-600 hover:underline">Sign in</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
