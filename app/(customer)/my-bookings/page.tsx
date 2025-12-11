"use client";

import { CustomerNavbar } from "@/components/customer-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Clock, MapPin, CreditCard, Package, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

declare global {
  interface Window {
    snap: any;
  }
}

interface Booking {
  id: number;
  bookingCode: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentUrl: string | null;
  transactionId: string | null;
  notes: string | null;
  createdAt: string;
  motor: {
    id: number;
    name: string;
    brand: string;
    model: string;
    plateNumber: string;
    image: string | null;
    pricePerDay: number;
  };
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [payingBooking, setPayingBooking] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchBookings();
  }, [user, router]);

  // Load Midtrans Snap script
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey || "");
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/bookings?userId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setBookings(data.bookings || []);
      } else {
        console.error("Failed to fetch bookings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Paid":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Active":
        return "bg-green-100 text-green-800 border-green-300";
      case "Completed":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-300";
      case "Unpaid":
        return "bg-red-100 text-red-800 border-red-300";
      case "Refunded":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const handleViewDetails = (bookingCode: string) => {
    router.push(`/confirmation?booking=${bookingCode}`);
  };

  const handlePayNow = async (booking: Booking) => {
    try {
      setPayingBooking(booking.id);

      // Get payment token from API
      const response = await fetch(`/api/bookings/${booking.bookingCode}/payment`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to initiate payment");
        setPayingBooking(null);
        return;
      }

      // Open Midtrans Snap payment
      if (window.snap && data.token) {
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            alert("Payment successful!");
            fetchBookings(); // Refresh bookings
            setPayingBooking(null);
          },
          onPending: function (result: any) {
            alert("Waiting for payment confirmation...");
            fetchBookings(); // Refresh bookings
            setPayingBooking(null);
          },
          onError: function (result: any) {
            alert("Payment failed! Please try again.");
            setPayingBooking(null);
          },
          onClose: function () {
            setPayingBooking(null);
          },
        });
      } else {
        alert("Payment gateway not available");
        setPayingBooking(null);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment");
      setPayingBooking(null);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: "#0A2540" }}>
              My Bookings
            </h1>
            <p className="text-sm sm:text-base text-gray-600">View and manage your motorcycle rental bookings</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
              All Bookings
            </Button>
            <Button variant={filter === "Pending" ? "default" : "outline"} onClick={() => setFilter("Pending")} size="sm">
              Pending
            </Button>
            <Button variant={filter === "Paid" ? "default" : "outline"} onClick={() => setFilter("Paid")} size="sm">
              Paid
            </Button>
            <Button variant={filter === "Active" ? "default" : "outline"} onClick={() => setFilter("Active")} size="sm">
              Active
            </Button>
            <Button variant={filter === "Completed" ? "default" : "outline"} onClick={() => setFilter("Completed")} size="sm">
              Completed
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center">
                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
                <p className="text-gray-600 mb-6">{filter === "all" ? "You haven't made any bookings yet." : `No ${filter.toLowerCase()} bookings found.`}</p>
                <Button onClick={() => router.push("/booking")} style={{ backgroundColor: "#1ABC9C" }}>
                  Book a Motor
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-[200px_1fr] gap-4">
                      {/* Motor Image */}
                      <div className="relative h-48 md:h-full bg-gray-100">
                        {booking.motor.image ? (
                          <img src={booking.motor.image} alt={booking.motor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="h-16 w-16" />
                          </div>
                        )}
                      </div>

                      {/* Booking Details */}
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold">
                              {booking.motor.brand} {booking.motor.model}
                            </h3>
                            <p className="text-sm text-gray-600">{booking.motor.plateNumber}</p>
                            <p className="text-xs text-gray-500 mt-1">Booking Code: {booking.bookingCode}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            <Badge className={getPaymentStatusColor(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
                          </div>
                        </div>

                        {/* Rental Period */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start gap-2">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Rental Period</p>
                              <p className="text-sm font-medium">
                                {format(new Date(booking.startDate), "PPP")} - {format(new Date(booking.endDate), "PPP")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Duration</p>
                              <p className="text-sm font-medium">
                                {booking.totalDays} {booking.totalDays === 1 ? "day" : "days"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total Price</p>
                            <p className="text-xl font-bold" style={{ color: "#0A2540" }}>
                              Rp {booking.totalPrice.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {booking.paymentStatus === "Unpaid" && booking.status === "Pending" && (
                              <Button onClick={() => handlePayNow(booking)} disabled={payingBooking === booking.id} style={{ backgroundColor: "#1ABC9C" }} size="sm">
                                {payingBooking === booking.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Pay Now
                                  </>
                                )}
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking.bookingCode)}>
                              View Details
                            </Button>
                          </div>
                        </div>

                        {/* Unpaid Warning */}
                        {booking.paymentStatus === "Unpaid" && booking.status === "Pending" && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-amber-900 mb-1">Payment Required</p>
                                <p className="text-xs text-amber-700 mb-2">Please complete payment to confirm your booking. You can pay using various methods including QRIS, Bank Transfer, Credit Card, and e-Wallet.</p>
                                <div className="flex flex-wrap gap-2 text-xs text-amber-600">
                                  <span className="inline-flex items-center gap-1">💳 Credit/Debit Card</span>
                                  <span className="inline-flex items-center gap-1">🏦 Bank Transfer</span>
                                  <span className="inline-flex items-center gap-1">📱 QRIS</span>
                                  <span className="inline-flex items-center gap-1">💰 e-Wallet (GoPay, OVO, Dana)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {booking.notes && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-700">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
