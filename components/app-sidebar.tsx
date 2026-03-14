"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  SquareTerminal,
  ChartBar
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Gestão Financeira",
      logo: "/logo.svg",
      plan: "Finanças",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/home",
      icon: ChartBar,
    },
    {
      title: "Caixa",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Ganhos",
          url: "/ganhos",
        },
        {
          title: "Despesas",
          url: "/despesas",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/home"> 
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar text-sidebar-primary-foreground">
              <Image src={data.teams[0].logo} alt="Logo" width={32} height={32} />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{data.teams[0].name}</span>
              <span className="truncate text-xs">{data.teams[0].plan}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
