"use client";

import * as React from "react";
import { Home, Users, Bell, PhoneCall, Settings } from "lucide-react";
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: string;
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
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
      name: "Call Register",
      url: "/call-register",
      icon: PhoneCall,
      isActive: pathname === "/call-register",
    },
    {
      name: "Notifications",
      url: "/notifications",
      icon: Bell,
      isActive: pathname === "/notifications",
    },
  ];

  if (userRole === "admin") {
    routes.push({
      name: "User Management",
      url: "/user-management",
      icon: Settings,
      isActive: pathname === "/user-management",
    });
  }

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
