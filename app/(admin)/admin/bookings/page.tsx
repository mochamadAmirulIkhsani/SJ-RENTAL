"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Search, UserCheck, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const bookings = [
  { id: "SJ-2025-00156", customer: "John Doe", motor: "Honda Vario 160", pickupDate: "Dec 10, 2025", returnDate: "Dec 13, 2025", status: "Confirmed", assigned: "Staff A" },
  { id: "SJ-2025-00155", customer: "Jane Smith", motor: "Yamaha NMAX", pickupDate: "Dec 9, 2025", returnDate: "Dec 16, 2025", status: "Pending", assigned: null },
  { id: "SJ-2025-00154", customer: "Bob Wilson", motor: "Honda PCX", pickupDate: "Dec 11, 2025", returnDate: "Dec 18, 2025", status: "Active", assigned: "Staff B" },
  { id: "SJ-2025-00153", customer: "Alice Brown", motor: "Yamaha Aerox", pickupDate: "Dec 8, 2025", returnDate: "Dec 12, 2025", status: "Active", assigned: "Staff C" },
  { id: "SJ-2025-00152", customer: "Charlie Davis", motor: "Honda Beat", pickupDate: "Dec 15, 2025", returnDate: "Dec 20, 2025", status: "Pending", assigned: null },
];

export default function BookingManagementPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader title="Booking Management" />

        <div className="p-8">
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Booking List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="assignment">Staff Assignment</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      156
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">5</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#1ABC9C" }}>
                      23
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      8
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search..." className="pl-10" />
                    </div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Apply Filters</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bookings Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Bookings</CardTitle>
                      <CardDescription>Manage rental reservations</CardDescription>
                    </div>
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Export to Excel</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Motor</TableHead>
                        <TableHead>Pickup Date</TableHead>
                        <TableHead>Return Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.customer}</TableCell>
                          <TableCell>{booking.motor}</TableCell>
                          <TableCell>{booking.pickupDate}</TableCell>
                          <TableCell>{booking.returnDate}</TableCell>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor: booking.status === "Active" ? "#1ABC9C" : booking.status === "Confirmed" ? "#3B82F6" : booking.status === "Pending" ? "#F59E0B" : "#6B7280",
                              }}
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{booking.assigned || <Badge variant="outline">Not Assigned</Badge>}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {booking.status === "Pending" && (
                                <>
                                  <Button variant="ghost" size="sm" title="Approve">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="Reject">
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              {!booking.assigned && (
                                <Button variant="ghost" size="sm" title="Assign Staff">
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Booking Calendar</CardTitle>
                    <CardDescription>View bookings by date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bookings on {date?.toDateString()}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="p-4 border rounded-lg">
                        <p className="font-semibold text-sm mb-1">{booking.customer}</p>
                        <p className="text-sm text-gray-600 mb-2">{booking.motor}</p>
                        <Badge
                          style={{
                            backgroundColor: booking.status === "Active" ? "#1ABC9C" : "#F59E0B",
                          }}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assignment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Assignment</CardTitle>
                  <CardDescription>Assign staff members to bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Motor</TableHead>
                        <TableHead>Pickup Date</TableHead>
                        <TableHead>Current Assignment</TableHead>
                        <TableHead>Assign To</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.customer}</TableCell>
                          <TableCell>{booking.motor}</TableCell>
                          <TableCell>{booking.pickupDate}</TableCell>
                          <TableCell>{booking.assigned ? <Badge style={{ backgroundColor: "#1ABC9C" }}>{booking.assigned}</Badge> : <Badge variant="outline">Not Assigned</Badge>}</TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select staff" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="staff-a">Staff A</SelectItem>
                                <SelectItem value="staff-b">Staff B</SelectItem>
                                <SelectItem value="staff-c">Staff C</SelectItem>
                                <SelectItem value="staff-d">Staff D</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" style={{ backgroundColor: "#1ABC9C" }}>
                              Assign
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
