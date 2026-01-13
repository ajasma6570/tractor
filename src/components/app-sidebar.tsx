"use client";

import * as React from "react";
import {
  Home,
  Users,
  History,
  Bell,
  Settings,
  ClipboardList,
  Map,
} from "lucide-react";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { open } = useSidebar();

  const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  };

  const routes = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard",
    },
    {
      name: "Customers",
      url: "/customers",
      icon: Users,
      isActive: pathname === "/customers",
    },
    {
      name: "Service History",
      url: "/service-history",
      icon: History,
      isActive: pathname === "/service-history",
    },
    {
      name: "Service Call Log",
      url: "/service-call-log",
      icon: ClipboardList,
      isActive: pathname === "/service-call-log",
    },
    {
      name: "Notifications",
      url: "/notifications",
      icon: Bell,
      isActive: pathname === "/notifications",
    },
    {
      name: "Reports",
      url: "/reports",
      icon: Map,
      isActive: pathname === "/reports",
    },
    {
      name: "Settings",
      url: "/settings",
      icon: Settings,
      isActive: pathname === "/settings",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Steer Logo"
              width={40}
              height={40}
            />
          </div>
          <div
            className={cn(
              open ? "block" : "hidden",
              "transition-all duration-300 ease-in-out overflow-hidden"
            )}
          >
            <h1 className="text-gray-900">Arunachala</h1>
            <p className="text-xs text-gray-500">Service Manager</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={routes} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
