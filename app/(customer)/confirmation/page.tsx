"use client";

import { CustomerNavbar } from "@/components/customer-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Loader2, Download, Home } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { format } from "date-fns";

interface Booking {
  id: number;
  bookingCode: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: string;
  motor: {
    brand: string;
    model: string;
    name: string;
    image: string | null;
  };
  user: {
    name: string;
    email: string;
  };
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingCode = searchParams.get("booking");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookingCode) {
      fetchBooking();
    } else {
      setError("No booking code provided");
      setLoading(false);
    }
  }, [bookingCode]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings?bookingCode=${bookingCode}`);
      const data = await response.json();

      if (response.ok && data.bookings?.length > 0) {
        setBooking(data.bookings[0]);
      } else {
        setError("Booking not found");
      }
    } catch (err) {
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!booking) return null;

    switch (booking.paymentStatus) {
      case "Paid":
        return <CheckCircle2 className="h-16 w-16 sm:h-20 sm:w-20 text-green-500" />;
      case "Unpaid":
        return <Clock className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-500" />;
      case "Refunded":
        return <XCircle className="h-16 w-16 sm:h-20 sm:w-20 text-red-500" />;
      default:
        return <Clock className="h-16 w-16 sm:h-20 sm:w-20 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    if (!booking) return "";

    switch (booking.paymentStatus) {
      case "Paid":
        return "Your booking has been confirmed and payment received!";
      case "Unpaid":
        return "Payment is pending. Please complete your payment.";
      case "Refunded":
        return "Your booking has been cancelled and refunded.";
      default:
        return "Processing your booking...";
    }
  };

  const getStatusColor = () => {
    if (!booking) return "default";

    switch (booking.paymentStatus) {
      case "Paid":
        return "default";
      case "Unpaid":
        return "secondary";
      case "Refunded":
        return "destructive";
      default:
        return "outline";
    }
  };

  const calculateDays = () => {
    if (!booking) return 0;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavbar />
        <div className="container mx-auto px-3 sm:px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
              <p className="text-gray-600">Loading booking details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavbar />
        <div className="container mx-auto px-3 sm:px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
              <p className="text-gray-600 text-center mb-6">{error}</p>
              <Button onClick={() => router.push("/home")} style={{ backgroundColor: "#1ABC9C" }}>
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Status Card */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <div className="mb-4">{getStatusIcon()}</div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#0A2540" }}>
                {booking.paymentStatus === "Paid" ? "Booking Confirmed!" : "Booking Created"}
              </h1>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">{getStatusMessage()}</p>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <Badge variant={getStatusColor() as any} className="text-xs sm:text-sm px-3 py-1">
                  {booking.paymentStatus}
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm px-3 py-1">
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Booking Code: {booking.bookingCode}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Motor Info */}
              <div className="flex flex-col sm:flex-row gap-4">
                {booking.motor.image && <img src={booking.motor.image} alt={booking.motor.name} className="w-full sm:w-40 h-32 sm:h-28 object-cover rounded-lg" />}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {booking.motor.brand} {booking.motor.model}
                  </h3>
                  <p className="text-sm text-gray-600">{booking.motor.name}</p>
                </div>
              </div>

              {/* Rental Period */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Start Date</p>
                  <p className="font-medium">{format(new Date(booking.startDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="font-medium">{format(new Date(booking.endDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="font-medium">{calculateDays()} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Price</p>
                  <p className="font-medium text-lg" style={{ color: "#0A2540" }}>
                    Rp {booking.totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              {booking.transactionId && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                  <p className="font-mono text-sm">{booking.transactionId}</p>
                </div>
              )}

              {/* Customer Info */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium">{booking.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{booking.user.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={() => router.push("/my-bookings")}>
              View My Bookings
            </Button>
            <Button className="flex-1" style={{ backgroundColor: "#1ABC9C" }} onClick={() => router.push("/home")}>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {/* Next Steps */}
          {booking.paymentStatus === "Paid" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">1</div>
                  <p>We'll send you a confirmation email with pickup instructions</p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">2</div>
                  <p>Bring your ID and this booking code to our location</p>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">3</div>
                  <p>Pick up your motorcycle on the start date</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <CustomerNavbar />
          <div className="container mx-auto px-3 sm:px-4 py-12 flex items-center justify-center">
            <Card className="max-w-md w-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
                <p className="text-gray-600">Loading booking details...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
