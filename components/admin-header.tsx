"use client";

import { Bell, Search, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/AuthContext";

export function AdminHeader({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 lg:px-6 xl:px-8 gap-2 sm:gap-3 lg:gap-4">
        {/* Mobile spacing for hamburger menu */}
        <div className="w-11 lg:hidden"></div>

        <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold truncate" style={{ color: "#0A2540" }}>
          {title}
        </h1>

        <div className="flex-1 flex items-center justify-end space-x-1 sm:space-x-2 lg:space-x-3 xl:space-x-4">
          {/* Hide search on mobile */}
          <div className="hidden md:block relative w-40 lg:w-48 xl:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-8 text-sm" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs" style={{ backgroundColor: "#1ABC9C" }}>
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 sm:w-72 lg:w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">New booking request received</DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Motor return scheduled for today</DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Low inventory alert: Honda Beat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 sm:h-10 sm:w-10">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || user?.email || "Admin User"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
