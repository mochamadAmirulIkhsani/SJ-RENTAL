"use client";

import { CustomerNavbar } from "@/components/customer-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, CreditCard, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

interface Motor {
  id: number;
  name: string;
  brand: string;
  model: string;
  pricePerDay: number;
  status: string;
  image: string | null;
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function BookingPage() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedMotor, setSelectedMotor] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  // Fetch available motors
  useEffect(() => {
    fetchMotors();
  }, []);

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

  const fetchMotors = async () => {
    try {
      const response = await fetch("/api/motors?status=Available");
      const data = await response.json();
      if (response.ok) {
        setMotors(data.motors || []);
      }
    } catch (error) {
      console.error("Failed to fetch motors:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !selectedMotor) return 0;
    
    const motor = motors.find((m) => m.id.toString() === selectedMotor);
    if (!motor) return 0;

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return motor.pricePerDay * days;
  };

  const totalDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const selectedMotorData = motors.find((m) => m.id.toString() === selectedMotor);

  const handleBooking = async () => {
    if (!user) {
      alert("Please login to continue");
      router.push("/login");
      return;
    }

    if (!selectedMotor || !startDate || !endDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (totalDays() < 1) {
      alert("End date must be after start date");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motorId: parseInt(selectedMotor),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          userId: user.id,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create booking");
        setSubmitting(false);
        return;
      }

      // Open Midtrans Snap payment
      if (window.snap && data.payment?.token) {
        window.snap.pay(data.payment.token, {
          onSuccess: function (result: any) {
            alert("Payment successful!");
            router.push(`/confirmation?booking=${data.booking.bookingCode}`);
          },
          onPending: function (result: any) {
            alert("Waiting for payment...");
            router.push(`/confirmation?booking=${data.booking.bookingCode}`);
          },
          onError: function (result: any) {
            alert("Payment failed! Please try again.");
            setSubmitting(false);
          },
          onClose: function () {
            alert("Payment cancelled");
            setSubmitting(false);
          },
        });
      } else {
        alert("Payment gateway not available");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to create booking");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: "#0A2540" }}>
              Book Your Motor
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Complete the form below to reserve your motorcycle</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Fill in your rental information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Motor Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="motor">Select Motor *</Label>
                    {loading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      <Select value={selectedMotor} onValueChange={setSelectedMotor}>
                        <SelectTrigger id="motor">
                          <SelectValue placeholder="Choose a motor" />
                        </SelectTrigger>
                        <SelectContent>
                          {motors.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No motors available
                            </SelectItem>
                          ) : (
                            motors.map((motor) => (
                              <SelectItem key={motor.id} value={motor.id.toString()}>
                                {motor.brand} {motor.model} - Rp {motor.pricePerDay.toLocaleString("id-ID")}/day
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Date Selection */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date()} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => !startDate || date <= startDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requests (Optional)</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requirements or notes..." rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-4">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedMotorData && (
                    <div className="space-y-2">
                      <div className="font-medium text-sm sm:text-base">{selectedMotorData.brand} {selectedMotorData.model}</div>
                      {selectedMotorData.image && (
                        <img src={selectedMotorData.image} alt={selectedMotorData.name} className="w-full h-32 sm:h-40 object-cover rounded-lg" />
                      )}
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per day</span>
                      <span className="font-medium">Rp {selectedMotorData?.pricePerDay.toLocaleString("id-ID") || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{totalDays()} {totalDays() === 1 ? "day" : "days"}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl sm:text-2xl font-bold" style={{ color: "#0A2540" }}>
                        Rp {calculateTotal().toLocaleString("id-ID")}
                      </span>
                    </div>

                    <Button className="w-full" size="lg" style={{ backgroundColor: "#1ABC9C" }} onClick={handleBooking} disabled={submitting || !selectedMotor || !startDate || !endDate}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          {user ? "Proceed to Payment" : "Login to Continue"}
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-4 border-t space-y-2 text-xs text-gray-600">
                    <p>✓ Secure payment via Midtrans</p>
                    <p>✓ Insurance included</p>
                    <p>✓ 24/7 customer support</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
