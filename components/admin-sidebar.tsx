"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Bike, Calendar, ClipboardCheck, Package, Users, FileText, Shield, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/availability", icon: Bike, label: "Motor Availability" },
  { href: "/admin/bookings", icon: Calendar, label: "Booking Management" },
  { href: "/admin/returns", icon: ClipboardCheck, label: "Return & Inspection" },
  { href: "/admin/inventory", icon: Package, label: "Motor Inventory" },
  { href: "/admin/customers", icon: Users, label: "Customer Management" },
  { href: "/admin/reports", icon: FileText, label: "Reports" },
  { href: "/admin/users", icon: Shield, label: "User & Role Management" },
  { href: "/admin/settings", icon: Settings, label: "System Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-white">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="font-bold text-xl" style={{ color: "#0A2540" }}>
            SJRent CMS
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors", isActive ? "bg-[#1ABC9C] text-white" : "text-gray-700 hover:bg-gray-100")}>
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
