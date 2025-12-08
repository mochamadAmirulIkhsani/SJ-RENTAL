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
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="font-serif text-2xl font-semibold text-foreground">
              SJ<span className="gradient-text">Rent</span>
            </div>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
              Home
            </Link>
            <Link href="/motors" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
              Available Motors
            </Link>
            <Link href="/booking" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
              Book Now
            </Link>
            {user && (
              <Link href="/my-bookings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
                My Bookings
              </Link>
            )}
          </div>

          <div className="hidden items-center space-x-3 md:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
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
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon-sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-8 flex flex-col space-y-4">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-accent">
                  Home
                </Link>
                <Link href="/motors" className="text-sm font-medium transition-colors hover:text-accent">
                  Available Motors
                </Link>
                <Link href="/booking" className="text-sm font-medium transition-colors hover:text-accent">
                  Book Now
                </Link>
                {user && (
                  <Link href="/my-bookings" className="text-sm font-medium transition-colors hover:text-accent">
                    My Bookings
                  </Link>
                )}
                {user ? (
                  <>
                    <div className="text-sm font-medium text-muted-foreground">{user.name || user.email}</div>
                    <Button variant="ghost" size="sm" className="justify-start text-destructive" onClick={logout}>
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
                    <Button size="sm" asChild>
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
