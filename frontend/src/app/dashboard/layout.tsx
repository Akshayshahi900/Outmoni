

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authConfig } from "@/auth.config";
import { Header } from "@/components/layout/Header";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
const session = await getServerSession(authConfig);
if(!session) redirect("/auth/signin");



  return (
      <SidebarProvider>
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <AppSidebar session={session} />

        {/* Main Area */}
        <div className="flex flex-col flex-1">
          {/* Optional header */}
          {/* <Header session={session} /> */}

          <main className="p-6 flex-1 w-full overflow-y-auto">
            {/* Sidebar toggle button */}
            <SidebarTrigger />

            {/* Page content injected here */}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
