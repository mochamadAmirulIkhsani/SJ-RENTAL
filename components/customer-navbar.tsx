"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function CustomerNavbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-bold text-xl" style={{ color: "#0A2540" }}>
              SJRent
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-[#1ABC9C] transition-colors">
              Home
            </Link>
            <Link href="/motors" className="text-sm font-medium hover:text-[#1ABC9C] transition-colors">
              Available Motors
            </Link>
            <Link href="/booking" className="text-sm font-medium hover:text-[#1ABC9C] transition-colors">
              Book Now
            </Link>
            <Link href="/my-bookings" className="text-sm font-medium hover:text-[#1ABC9C] transition-colors">
              My Bookings
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" style={{ backgroundColor: "#1ABC9C" }} className="hover:opacity-90" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-sm font-medium">
                  Home
                </Link>
                <Link href="/motors" className="text-sm font-medium">
                  Available Motors
                </Link>
                <Link href="/booking" className="text-sm font-medium">
                  Book Now
                </Link>
                <Link href="/my-bookings" className="text-sm font-medium">
                  My Bookings
                </Link>
                {user ? (
                  <>
                    <div className="text-sm font-medium text-gray-600">{user.name || user.email}</div>
                    <Button variant="ghost" size="sm" className="justify-start text-red-600" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" style={{ backgroundColor: "#1ABC9C" }} asChild>
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
