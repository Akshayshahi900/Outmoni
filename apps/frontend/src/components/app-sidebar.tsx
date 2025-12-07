"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Home,
  Inbox,
  User2,
  ChevronUp,
  Wallet,
  LogOut,
  Settings,
  CreditCard,
  Sparkles,
} from "lucide-react";

import { signOut } from "@/lib/auth";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Transactions", url: "/dashboard/expenses", icon: Inbox },
];

interface SidebarProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  };
}

export function AppSidebar({ session }: SidebarProps) {
  return (
    <Sidebar className="bg-card text-app border-r border-app">
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-app bg-card">
        <div className="flex items-center gap-3 bg-card">
          <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center ">
            <Wallet className="w-6 h-6 text-app" />
          </div>
          <div className="bg-card">
            <h2 className="text-lg font-bold text-app">Outmoni</h2>
            <p className="text-xs text-sub">Manage your money</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-card text-app px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sub uppercase tracking-wider text-xs font-semibold px-3 mb-2">
           Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="
                      group
                      bg-transparent
                      text-app
                      hover:bg-primary/10
                      hover:text-primary
                      transition-all
                      duration-200
                      rounded-lg
                      px-3
                      py-2.5
                      relative
                      overflow-hidden
                    "
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      {/* Hover accent line */}
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-200 rounded-r" />
                      
                      <div className="w-9 h-9 rounded-lg bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <item.icon className="w-5 h-5 text-sub group-hover:text-primary transition-colors" />
                      </div>
                      
                      <span className="font-medium text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sub uppercase tracking-wider text-xs font-semibold px-3 mb-3">
            Quick Stats
          </SidebarGroupLabel>
          
          <div className="px-3 space-y-2">
            <div className="bg-success/5 border border-success/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-sub">This Month</span>
                <Sparkles className="w-3 h-3 text-success" />
              </div>
              <p className="text-lg font-bold text-success mt-1">$2,450</p>
              <p className="text-xs text-sub">Income</p>
            </div>

            <div className="bg-danger/5 border border-danger/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-sub">This Month</span>
                <CreditCard className="w-3 h-3 text-danger" />
              </div>
              <p className="text-lg font-bold text-danger mt-1">$1,680</p>
              <p className="text-xs text-sub">Expenses</p>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="bg-card border-t border-app p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="
                  group
                  bg-primary/5
                  hover:bg-primary/10
                  text-app
                  transition-all
                  duration-200
                  
                  px-3
                  py-7
                  
                  hover:border-primary/20
                ">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-app truncate">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs text-sub truncate">
                        {session.user?.email || "user@example.com"}
                      </p>
                    </div>

                    <ChevronUp className="w-4 h-4 text-sub group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                className="w-56 bg-card border border-app text-app shadow-xl rounded-xl overflow-hidden"
                sideOffset={8}
              >
                <div className="px-3 py-3 border-b border-app bg-primary/5">
                  <p className="text-sm font-semibold text-app">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-xs text-sub truncate">
                    {session.user?.email || "user@example.com"}
                  </p>
                </div>

                <div className="py-1">
                  <DropdownMenuItem className="
                    hover:bg-primary/10
                    cursor-pointer
                    rounded-md
                    mx-1
                    px-3
                    py-2
                    text-app
                    hover:text-primary
                    transition-colors
                    flex
                    items-center
                    gap-2
                  ">
                    <User2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Account</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="
                    hover:bg-primary/10
                    cursor-pointer
                    rounded-md
                    mx-1
                    px-3
                    py-2
                    text-app
                    hover:text-primary
                    transition-colors
                    flex
                    items-center
                    gap-2
                  ">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="
                    hover:bg-primary/10
                    cursor-pointer
                    rounded-md
                    mx-1
                    px-3
                    py-2
                    text-app
                    hover:text-primary
                    transition-colors
                    flex
                    items-center
                    gap-2
                  ">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">Billing</span>
                  </DropdownMenuItem>
                </div>

                <div className="py-1 border-t border-app">
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="
                      hover:bg-danger/10
                      cursor-pointer
                      rounded-md
                      mx-1
                      px-3
                      py-2
                      text-danger
                      hover:text-danger
                      transition-colors
                      flex
                      items-center
                      gap-2
                      font-medium
                    "
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}