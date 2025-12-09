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
import { Calendar as CalendarIcon, Search, UserCheck, X, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Booking {
  id: number;
  bookingCode: string;
  userId: number;
  motorId: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: string;
  motor: {
    id: number;
    name: string;
    brand: string;
    model: string;
  };
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}

export default function BookingManagementPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings");
      const data = await response.json();

      if (response.ok) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${booking.motor.brand} ${booking.motor.model}`.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || booking.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    active: bookings.filter((b) => b.status === "Active").length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    paid: bookings.filter((b) => b.paymentStatus === "Paid").length,
    unpaid: bookings.filter((b) => b.paymentStatus === "Unpaid").length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 w-full lg:ml-64">
        <AdminHeader title="Booking Management" />

        <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Booking List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="assignment">Staff Assignment</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.total}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">{loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.pending}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#1ABC9C" }}>
                      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.active}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Paid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.paid}
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
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search bookings..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Payment Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Payments</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button style={{ backgroundColor: "#1ABC9C" }} onClick={fetchBookings}>
                      Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bookings Table */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>All Bookings</CardTitle>
                      <CardDescription>Manage rental reservations ({filteredBookings.length} bookings)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Booking ID</TableHead>
                          <TableHead className="whitespace-nowrap">Customer</TableHead>
                          <TableHead className="whitespace-nowrap">Motor</TableHead>
                          <TableHead className="whitespace-nowrap">Start Date</TableHead>
                          <TableHead className="whitespace-nowrap">End Date</TableHead>
                          <TableHead className="whitespace-nowrap">Days</TableHead>
                          <TableHead className="whitespace-nowrap">Total</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap">Payment</TableHead>
                          <TableHead className="whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center py-8">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                              <p className="mt-2 text-gray-500">Loading bookings...</p>
                            </TableCell>
                          </TableRow>
                        ) : filteredBookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                              No bookings found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredBookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium font-mono text-xs sm:text-sm">{booking.bookingCode}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">{booking.user.name || "N/A"}</span>
                                  <span className="text-xs text-gray-500">{booking.user.email}</span>
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {booking.motor.brand} {booking.motor.model}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-sm">{format(new Date(booking.startDate), "MMM dd, yyyy")}</TableCell>
                              <TableCell className="whitespace-nowrap text-sm">{format(new Date(booking.endDate), "MMM dd, yyyy")}</TableCell>
                              <TableCell className="text-center">{booking.totalDays}</TableCell>
                              <TableCell className="whitespace-nowrap font-medium">Rp {booking.totalPrice.toLocaleString("id-ID")}</TableCell>
                              <TableCell>
                                <Badge
                                  style={{
                                    backgroundColor: booking.status === "Active" ? "#1ABC9C" : booking.status === "Confirmed" ? "#3B82F6" : booking.status === "Pending" ? "#F59E0B" : booking.status === "Completed" ? "#10B981" : "#6B7280",
                                  }}
                                >
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={booking.paymentStatus === "Paid" ? "default" : "secondary"} className={booking.paymentStatus === "Paid" ? "bg-green-600" : ""}>
                                  {booking.paymentStatus}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {booking.status === "Pending" && (
                                    <>
                                      <Button variant="ghost" size="sm" title="Confirm" onClick={() => updateBookingStatus(booking.id, "Confirmed")}>
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                      </Button>
                                      <Button variant="ghost" size="sm" title="Cancel" onClick={() => updateBookingStatus(booking.id, "Cancelled")}>
                                        <X className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </>
                                  )}
                                  {booking.status === "Active" && (
                                    <Button variant="ghost" size="sm" title="Complete" onClick={() => updateBookingStatus(booking.id, "Completed")}>
                                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
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
