
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Check,
  Star,
  DollarSign,
  PieChart,
  Target,
  Bell,
  FolderSyncIcon as Sync,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authConfig } from "@/auth.config"

export default async function Home() {
  const session = await getServerSession(authConfig);
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-100">
        <Link className="flex items-center justify-center" href="/">
          <DollarSign className="h-8 w-8 text-emerald-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">OUTMONI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-emerald-600 transition-colors" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-emerald-600 transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-emerald-600 transition-colors" href="#about">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-emerald-600 transition-colors" href="#contact">
            Contact
          </Link>
        </nav>
        {session ? (
          <div className="ml-6 flex gap-2">
            <p className="text-md p-2 bg-green-300  border-2 rounded-3xl font-medium text-gray-900">
              Welcome Back!
            </p>
          </div>
        ) : (
          <div className="ml-6 flex gap-2">
            <Link href="/auth/signin">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    {"🚀 New: AI-Powered Insights Available"}
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                    Take Control of Your
                    <span className="text-emerald-600"> Financial Future</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    OUTMONI helps you track expenses, manage budgets, and achieve your financial goals with intelligent
                    insights and beautiful visualizations.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row" >
                  <Link href="/auth/signin">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg blur-3xl opacity-30"></div>
                  <Image
                    alt="OUTMONI Dashboard"
                    className="relative rounded-lg shadow-2xl"
                    height="400"
                    src="/placeholder.svg?height=400&width=600"
                    width="600"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  Everything you need to manage your money
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From expense tracking to investment monitoring, OUTMONI provides all the tools you need in one
                  beautiful, easy-to-use platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <PieChart className="h-10 w-10 text-emerald-600" />
                  <CardTitle>Smart Expense Tracking</CardTitle>
                  <CardDescription>
                    Automatically categorize and track your expenses with AI-powered transaction analysis.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Target className="h-10 w-10 text-emerald-600" />
                  <CardTitle>Budget Management</CardTitle>
                  <CardDescription>
                    Set realistic budgets and get real-time alerts when you're approaching your limits.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-emerald-600" />
                  <CardTitle>Investment Tracking</CardTitle>
                  <CardDescription>
                    Monitor your portfolio performance and get insights on your investment strategy.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Bell className="h-10 w-10 text-emerald-600" />
                  <CardTitle>Smart Notifications</CardTitle>
                  <CardDescription>
                    Get timely alerts about bill due dates, unusual spending, and savings opportunities.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Sync className="h-10 w-10 text-emerald-600" />
                  <CardTitle>Bank Sync</CardTitle>
                  <CardDescription>
                    Securely connect all your accounts and credit cards for automatic transaction import.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-emerald-600" />
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>
                    Visualize your financial data with beautiful charts and detailed spending reports.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="text-4xl font-bold text-emerald-600">50K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="text-4xl font-bold text-emerald-600">$2.5B+</div>
                <div className="text-gray-600">Money Tracked</div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="text-4xl font-bold text-emerald-600">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for you. All plans include our core features with a 14-day free trial.
                </p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 mx-auto max-w-5xl py-12">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>Perfect for individuals getting started</CardDescription>
                  <div className="text-4xl font-bold">
                    $9<span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Up to 3 bank accounts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Basic expense tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Budget management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Mobile app access</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-transparent" variant="outline">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-emerald-200 relative">
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-600">
                  Most Popular
                </Badge>
                <CardHeader>
                  <CardTitle>Professional</CardTitle>
                  <CardDescription>For serious money managers</CardDescription>
                  <div className="text-4xl font-bold">
                    $19<span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Unlimited bank accounts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">AI-powered insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Investment tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Start Free Trial</Button>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For teams and businesses</CardDescription>
                  <div className="text-4xl font-bold">
                    $49<span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Everything in Professional</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Team collaboration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Custom integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Dedicated support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-transparent" variant="outline">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  Loved by thousands of users
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our customers have to say about OUTMONI
                </p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 mx-auto max-w-5xl py-12">
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "OUTMONI completely transformed how I manage my finances. The AI insights helped me save $500 last
                    month alone!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">SJ</span>
                    </div>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-sm text-gray-600">Marketing Manager</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "The investment tracking feature is incredible. I can see all my portfolios in one place with
                    real-time updates."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">MC</span>
                    </div>
                    <div>
                      <div className="font-semibold">Michael Chen</div>
                      <div className="text-sm text-gray-600">Software Engineer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Finally, a finance app that's both powerful and beautiful. The interface is so intuitive and the
                    insights are spot-on."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">ER</span>
                    </div>
                    <div>
                      <div className="font-semibold">Emily Rodriguez</div>
                      <div className="text-sm text-gray-600">Small Business Owner</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Ready to take control of your finances?
                </h2>
                <p className="max-w-[600px] text-emerald-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who have already transformed their financial lives with OUTMONI.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-emerald-600" />
          <span className="text-sm font-semibold">OUTMONI</span>
        </div>
        <p className="text-xs text-gray-600 sm:ml-auto">© 2024 OUTMONI. All rights reserved.</p>
        <nav className="sm:ml-6 flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600" href="#">
            Support
          </Link>
        </nav>
      </footer>
    </div>
  )
}
