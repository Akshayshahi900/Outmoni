import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authConfig } from "@/auth.config";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  const session = await getServerSession(authConfig);
  if (!session) redirect("/auth/signin");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-app text-app">
        
        {/* ← Sidebar */}
        <AppSidebar session={session} />

        {/* → Main Content */}
        <div className="flex-1 overflow-y-auto bg-app border-l border-border">
          
          <main className="p-6 overflow-y-auto sm:p-2">
            {/* Sidebar Toggle Button */}
            <SidebarTrigger />

            {/* Page Content */}
            {children}
          </main>

        </div>
      </div>
    </SidebarProvider>
  )
}
