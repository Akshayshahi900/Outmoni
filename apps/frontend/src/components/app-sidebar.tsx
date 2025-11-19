// components/app-sidebar.tsx
"use client"
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
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { Calendar, Home, Inbox, Search, Settings, User2, ChevronUp, DollarSign } from "lucide-react"
import { signOut } from "@/lib/auth"
import Link from "next/link"

// Menu items
const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Transactions", url: "/dashboard/expenses", icon: Inbox },
  // { title: "Search", url: "/dashboard/search", icon: Search },
  // { title: "Settings", url: "/dashboard/settings", icon: Settings },
]
interface SidebarProps {
  session: {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
export function AppSidebar({ session }: SidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link className="flex items-center justify-center" href="/">
              {/* <DollarSign className="h-8 w-8 text-emerald-600" /> */}
              <span className="ml-2 text-2xl font-bold text-gray-900">OUTMONI</span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="mr-2" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ✅ Footer with account dropdown */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 className="mr-2" />{session.user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {/* <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => signOut()}>
                  <span >Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
