"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike, Calendar, Users, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const stats = [
  { title: "Total Motors", value: "48", change: "+2 this month", icon: Bike, color: "#1ABC9C" },
  { title: "Active Bookings", value: "23", change: "+5 today", icon: Calendar, color: "#0A2540" },
  { title: "Total Customers", value: "1,247", change: "+89 this month", icon: Users, color: "#1ABC9C" },
  { title: "Revenue (Month)", value: "Rp 45.2M", change: "+12.5%", icon: TrendingUp, color: "#0A2540" },
];

const recentBookings = [
  { id: "SJ-2025-00156", customer: "John Doe", motor: "Honda Vario 160", date: "Dec 8, 2025", status: "Active" },
  { id: "SJ-2025-00155", customer: "Jane Smith", motor: "Yamaha NMAX", date: "Dec 8, 2025", status: "Pending" },
  { id: "SJ-2025-00154", customer: "Bob Wilson", motor: "Honda PCX", date: "Dec 7, 2025", status: "Active" },
  { id: "SJ-2025-00153", customer: "Alice Brown", motor: "Yamaha Aerox", date: "Dec 7, 2025", status: "Completed" },
];

const alerts = [
  { type: "warning", message: "3 motors require maintenance within 7 days" },
  { type: "info", message: "5 bookings pending confirmation" },
  { type: "warning", message: "Low inventory: Honda Beat (2 available)" },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 w-full lg:ml-64">
        <AdminHeader title="Dashboard" />

        <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color }}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Alerts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: alert.type === "warning" ? "#FEF3C7" : "#DBEAFE" }}>
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{alert.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest rental reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customer}</p>
                            <p className="text-xs text-gray-600">{booking.motor}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: booking.status === "Active" ? "#1ABC9C" : booking.status === "Pending" ? "#F59E0B" : "#6B7280",
                            }}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Motor Status */}
            <Card>
              <CardHeader>
                <CardTitle>Motor Fleet Status</CardTitle>
                <CardDescription>Current availability overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1ABC9C" }}>
                      <Bike className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Available</p>
                      <p className="text-sm text-gray-600">Ready to rent</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                    25
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F59E0B" }}>
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Rented</p>
                      <p className="text-sm text-gray-600">Currently in use</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                    18
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Maintenance</p>
                      <p className="text-sm text-gray-600">Under service</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                    5
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
