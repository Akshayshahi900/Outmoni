import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Check,
  DollarSign,
  PieChart,
  Target,
  Bell,
  FolderSyncIcon as Sync,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth"
import { authConfig } from "@/auth.config"

export default async function Home() {
  const session = await getServerSession(authConfig)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 px-6 lg:px-12 h-16 flex items-center border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <Link className="flex items-center gap-2 hover:opacity-80 transition-opacity group" href="/">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            OUTMONI
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-8">
          <Link className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors" href="#about">
            About
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors" href="/dashboard">
            Dashboard
          </Link>
        </nav>

        {session ? (
          <div className="ml-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-sm text-emerald-900 font-semibold">
              Welcome Back 👋
            </p>
          </div>
        ) : (
          <div className="ml-6">
            <Link href="/auth/signin">
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="flex-1">

        {/* HERO */}
        <section className="relative py-24 lg:py-40 overflow-hidden">
          {/* Enhanced gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-50"></div>
          
          {/* Animated glow accents */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-teal-400/20 blur-[110px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/10 blur-[120px] rounded-full"></div>

          <div className="container relative mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[1fr_500px] gap-16 items-center">

              {/* LEFT */}
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                <Badge className="w-fit bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg animate-in fade-in slide-in-from-left-4 duration-700 px-4 py-1.5">
                  <Sparkles className="w-3 h-3 mr-1.5 inline" />
                  AI-Powered Insights Just Launched
                </Badge>

                <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900 animate-in fade-in slide-in-from-left-6 duration-800">
                  Take Control of Your{" "}
                  <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient">
                    Financial Future
                  </span>
                </h1>

                <p className="text-xl text-slate-600 max-w-xl leading-relaxed animate-in fade-in slide-in-from-left-8 duration-900">
                  Track expenses, plan budgets, and visualize your financial life with a clean, powerful dashboard built for the modern age.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-left-10 duration-1000">
                  <Link href="/auth/signin">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-7 text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group"
                    >
                      Start For Free 
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-600 px-8 py-7 text-lg rounded-2xl hover:bg-emerald-50/50 transition-all duration-300"
                  >
                    Watch Demo
                  </Button>
                </div>

                <div className="flex items-center gap-8 text-slate-600 text-sm animate-in fade-in slide-in-from-left-12 duration-1100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="font-medium">Free Trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="font-medium">No Card Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Shield className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="font-medium">Bank-Level Security</span>
                  </div>
                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <Image
                    src="/home.png"
                    width={600}
                    height={500}
                    alt="Dashboard preview"
                    className="relative rounded-2xl shadow-2xl ring-1 ring-slate-200/50 group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  
                  {/* Floating elements */}
                  <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Monthly Savings</p>
                        <p className="text-lg font-bold text-emerald-600">+$2,450</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Smart Alerts</p>
                        <p className="text-lg font-bold text-slate-900">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-32 bg-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          
          <div className="container mx-auto px-6 md:px-12">

            <div className="text-center space-y-6 mb-20">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-1.5">
                Features
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                Powerful Tools To{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Manage Your Money
                </span>
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                Simplify your financial life with clean visualizations and smart automation that works for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                { 
                  icon: PieChart, 
                  title: "Smart Expense Tracking", 
                  desc: "AI categorizes your transactions instantly with machine learning.",
                  color: "from-blue-500 to-cyan-500"
                },
                { 
                  icon: Target, 
                  title: "Budget Planner", 
                  desc: "Plan, manage, and stick to your monthly goals effortlessly.",
                  color: "from-purple-500 to-pink-500"
                },
                { 
                  icon: TrendingUp, 
                  title: "Investment Dashboard", 
                  desc: "Track portfolio performance and growth in real-time.",
                  color: "from-emerald-500 to-teal-500"
                },
                { 
                  icon: Bell, 
                  title: "Smart Alerts", 
                  desc: "Bill reminders and unusual activity notifications instantly.",
                  color: "from-orange-500 to-red-500"
                },
                { 
                  icon: Sync, 
                  title: "Bank Sync", 
                  desc: "Connect all your accounts securely with bank-level encryption.",
                  color: "from-indigo-500 to-purple-500"
                },
                { 
                  icon: BarChart3, 
                  title: "Deep Analytics", 
                  desc: "Visual insights to improve financial decisions and habits.",
                  color: "from-green-500 to-emerald-500"
                },
              ].map((f, i) => (
                <Card
                  key={i}
                  className="group p-8 bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-2xl relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <CardHeader className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <f.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {f.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-base leading-relaxed">
                      {f.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/20 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="container relative mx-auto px-6 md:px-12 text-center space-y-8">

            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1.5">
              Ready to start?
            </Badge>

            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Ready to Transform{" "}
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Your Finances?
              </span>
            </h2>

            <p className="text-emerald-100 max-w-2xl mx-auto text-xl leading-relaxed">
              Join thousands who already manage their money smarter with OUTMONI. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/signin">
                <Button className="bg-white text-emerald-600 px-10 py-7 text-lg rounded-2xl hover:bg-emerald-50 shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:-translate-y-1 group font-semibold">
                  Start Now 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button variant="outline" className="border-2 border-white/20 hover:border-white/40 text-white hover:bg-white/10 px-8 py-7 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300">
                Schedule Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-emerald-200 text-sm pt-6">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" /> 
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" /> 
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> 
                <span>Secure & private</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-12 border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-slate-900">OUTMONI</span>
                <p className="text-xs text-slate-500">Smart finance tracking</p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Made with <span className="text-red-500">❤️</span> by{" "}
              <span className="font-semibold text-slate-900">Akshay Shahi</span>
            </p>

            <nav className="flex gap-8 text-slate-600 text-sm">
              <Link href="#" className="hover:text-emerald-600 transition-colors font-medium">
                Terms
              </Link>
              <Link href="#" className="hover:text-emerald-600 transition-colors font-medium">
                Privacy
              </Link>
              <Link href="#" className="hover:text-emerald-600 transition-colors font-medium">
                Support
              </Link>
            </nav>

          </div>
        </div>
      </footer>

    </div>
  )
}