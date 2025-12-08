"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, Eye, Mail, Phone, MapPin, Calendar } from "lucide-react";

const customers = [
  { id: "C001", name: "John Doe", email: "john.doe@email.com", phone: "+62 812 3456 7890", totalBookings: 12, totalSpent: "3,500,000", lastBooking: "Dec 5, 2025", status: "Active" },
  { id: "C002", name: "Jane Smith", email: "jane.smith@email.com", phone: "+62 813 2345 6789", totalBookings: 8, totalSpent: "2,100,000", lastBooking: "Dec 3, 2025", status: "Active" },
  { id: "C003", name: "Bob Wilson", email: "bob.wilson@email.com", phone: "+62 814 3456 7890", totalBookings: 15, totalSpent: "4,800,000", lastBooking: "Dec 7, 2025", status: "VIP" },
  { id: "C004", name: "Alice Brown", email: "alice.brown@email.com", phone: "+62 815 4567 8901", totalBookings: 5, totalSpent: "1,200,000", lastBooking: "Nov 28, 2025", status: "Active" },
  { id: "C005", name: "Charlie Davis", email: "charlie.davis@email.com", phone: "+62 816 5678 9012", totalBookings: 3, totalSpent: "850,000", lastBooking: "Nov 15, 2025", status: "Inactive" },
];

const recentActivity = [
  { customer: "John Doe", action: "Completed booking", date: "2 hours ago" },
  { customer: "Jane Smith", action: "New booking created", date: "5 hours ago" },
  { customer: "Bob Wilson", action: "Payment received", date: "1 day ago" },
  { customer: "Alice Brown", action: "Booking extended", date: "2 days ago" },
];

export default function CustomersPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader title="Customer Management" />

        <div className="p-8">
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Customer List</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      1,247
                    </div>
                    <p className="text-xs text-gray-600 mt-1">+89 this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#1ABC9C" }}>
                      892
                    </div>
                    <p className="text-xs text-gray-600 mt-1">71.5% of total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">VIP Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">156</div>
                    <p className="text-xs text-gray-600 mt-1">12.5% of total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">New This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      89
                    </div>
                    <p className="text-xs text-gray-600 mt-1">+12% vs last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Search & Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search by name, email, or phone..." className="pl-10" />
                    </div>
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Search</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Customers</CardTitle>
                      <CardDescription>Manage your customer database</CardDescription>
                    </div>
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Export List</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Total Bookings</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Last Booking</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1ABC9C" }}>
                                <Users className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium">{customer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </p>
                              <p className="flex items-center gap-1 text-gray-600">
                                <Phone className="h-3 w-3" />
                                {customer.phone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{customer.totalBookings}</TableCell>
                          <TableCell className="font-semibold">Rp {customer.totalSpent}</TableCell>
                          <TableCell>{customer.lastBooking}</TableCell>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor: customer.status === "VIP" ? "#F59E0B" : customer.status === "Active" ? "#1ABC9C" : "#6B7280",
                              }}
                            >
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Customer Details - {customer.name}</DialogTitle>
                                  <DialogDescription>Complete customer information</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-600">Customer ID</p>
                                      <p className="font-semibold">{customer.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Status</p>
                                      <Badge
                                        style={{
                                          backgroundColor: customer.status === "VIP" ? "#F59E0B" : "#1ABC9C",
                                        }}
                                      >
                                        {customer.status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Email</p>
                                      <p className="font-semibold">{customer.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Phone</p>
                                      <p className="font-semibold">{customer.phone}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Total Bookings</p>
                                      <p className="font-semibold">{customer.totalBookings}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Total Spent</p>
                                      <p className="font-semibold">Rp {customer.totalSpent}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Last Booking</p>
                                      <p className="font-semibold">{customer.lastBooking}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Member Since</p>
                                      <p className="font-semibold">Jan 15, 2024</p>
                                    </div>
                                  </div>

                                  <div className="pt-4 border-t">
                                    <h4 className="font-semibold mb-3">Recent Bookings</h4>
                                    <div className="space-y-2">
                                      <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                        <div>
                                          <p className="font-medium text-sm">Honda Vario 160</p>
                                          <p className="text-xs text-gray-600">Dec 5 - Dec 8, 2025</p>
                                        </div>
                                        <Badge style={{ backgroundColor: "#1ABC9C" }}>Completed</Badge>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                        <div>
                                          <p className="font-medium text-sm">Yamaha NMAX</p>
                                          <p className="text-xs text-gray-600">Nov 20 - Nov 25, 2025</p>
                                        </div>
                                        <Badge style={{ backgroundColor: "#1ABC9C" }}>Completed</Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Customer Activity</CardTitle>
                  <CardDescription>Latest customer interactions and transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1ABC9C" }}>
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.customer}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {activity.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                    <CardDescription>By total spending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customers.slice(0, 5).map((customer, idx) => (
                        <div key={customer.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#0A2540" }}>
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-xs text-gray-600">{customer.totalBookings} bookings</p>
                            </div>
                          </div>
                          <p className="font-bold" style={{ color: "#1ABC9C" }}>
                            Rp {customer.totalSpent}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Growth</CardTitle>
                    <CardDescription>Monthly new registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["December", "November", "October", "September"].map((month, idx) => (
                        <div key={month} className="flex items-center justify-between">
                          <span className="font-medium">{month} 2025</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  backgroundColor: "#1ABC9C",
                                  width: `${100 - idx * 15}%`,
                                }}
                              />
                            </div>
                            <span className="font-bold w-12 text-right">{89 - idx * 12}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
