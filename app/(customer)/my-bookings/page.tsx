"use client";

import { CustomerNavbar } from "@/components/customer-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, FileText, Clock, MapPin, Phone, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const activeBookings = [
  {
    id: "SJ-2025-00123",
    motor: "Honda Vario 160",
    pickupDate: "Dec 10, 2025",
    returnDate: "Dec 13, 2025",
    status: "Active",
    total: "297,000",
    location: "Central Jakarta Office",
  },
  {
    id: "SJ-2025-00089",
    motor: "Yamaha NMAX",
    pickupDate: "Dec 8, 2025",
    returnDate: "Dec 15, 2025",
    status: "Active",
    total: "525,000",
    location: "South Jakarta Branch",
  },
];

const upcomingBookings = [
  {
    id: "SJ-2025-00156",
    motor: "Honda PCX",
    pickupDate: "Dec 20, 2025",
    returnDate: "Dec 27, 2025",
    status: "Confirmed",
    total: "560,000",
    location: "Central Jakarta Office",
  },
];

const pastBookings = [
  {
    id: "SJ-2025-00045",
    motor: "Yamaha Mio",
    pickupDate: "Nov 15, 2025",
    returnDate: "Nov 18, 2025",
    status: "Completed",
    total: "165,000",
    location: "North Jakarta Branch",
  },
  {
    id: "SJ-2024-00891",
    motor: "Honda Beat",
    pickupDate: "Oct 5, 2024",
    returnDate: "Oct 7, 2024",
    status: "Completed",
    total: "100,000",
    location: "Central Jakarta Office",
  },
];

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#0A2540" }}>
            My Bookings
          </h1>
          <p className="text-gray-600">View and manage your rental reservations</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{booking.motor}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span>{booking.id}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.location}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge style={{ backgroundColor: "#1ABC9C" }}>{booking.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Pickup Date
                      </p>
                      <p className="font-semibold">{booking.pickupDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Return Date
                      </p>
                      <p className="font-semibold">{booking.returnDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                      <p className="font-semibold text-lg" style={{ color: "#0A2540" }}>
                        Rp {booking.total}
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Booking Details - {booking.id}</DialogTitle>
                            <DialogDescription>Complete information about your rental</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Motor</p>
                                <p className="font-semibold">{booking.motor}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <Badge style={{ backgroundColor: "#1ABC9C" }}>{booking.status}</Badge>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Pickup Date</p>
                                <p className="font-semibold">{booking.pickupDate}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Return Date</p>
                                <p className="font-semibold">{booking.returnDate}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Location</p>
                                <p className="font-semibold">{booking.location}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="font-semibold">Rp {booking.total}</p>
                              </div>
                            </div>
                            <div className="pt-4 border-t">
                              <p className="text-sm text-gray-600 mb-2">Emergency Contact</p>
                              <p className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                +62 812 3456 7890
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" style={{ backgroundColor: "#1ABC9C" }}>
                        <Clock className="h-4 w-4 mr-2" />
                        Extend
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{booking.motor}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span>{booking.id}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.location}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{booking.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Pickup Date
                      </p>
                      <p className="font-semibold">{booking.pickupDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Return Date
                      </p>
                      <p className="font-semibold">{booking.returnDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="font-semibold text-lg" style={{ color: "#0A2540" }}>
                        Rp {booking.total}
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Past Bookings</CardTitle>
                <CardDescription>Your rental history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Motor</TableHead>
                      <TableHead>Pickup Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.motor}</TableCell>
                        <TableCell>{booking.pickupDate}</TableCell>
                        <TableCell>{booking.returnDate}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{booking.status}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">Rp {booking.total}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
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
  );
}
