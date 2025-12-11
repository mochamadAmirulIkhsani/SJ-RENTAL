"use client";

import "./calendar-custom.css";
import { CustomerNavbar } from "@/components/customer-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, CreditCard, Loader2, AlertCircle, XCircle, CheckCircle2, Clock } from "lucide-react";
import { format, isWithinInterval, parseISO, isSameDay } from "date-fns";
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

interface BookedSlot {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function BookingPage() {
  const [step, setStep] = useState<1 | 2>(1); // 1: Select Motor, 2: Select Date/Time
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [notes, setNotes] = useState("");
  const [motors, setMotors] = useState<Motor[]>([]);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  // Load all motors on mount
  useEffect(() => {
    fetchAllMotors();
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

  // Fetch booked slots when motor is selected
  useEffect(() => {
    if (selectedMotor) {
      fetchBookedSlots(selectedMotor.id);
    }
  }, [selectedMotor]);

  // Auto-adjust time selection based on available hours
  useEffect(() => {
    if (startDate && startTime) {
      const availableStartHours = getAvailableHours(startDate, false);
      
      // If selected start time is not available, select first available hour
      if (availableStartHours.length > 0 && !availableStartHours.includes(startTime)) {
        setStartTime(availableStartHours[0]);
      }
    }

    if (endDate && endTime && startDate && startTime) {
      const availableEndHours = getAvailableHours(endDate, true);
      
      // Filter end hours based on start time if same day
      let validEndHours = availableEndHours;
      if (startDate.toDateString() === endDate.toDateString()) {
        const startHour = parseInt(startTime.split(":")[0]);
        validEndHours = availableEndHours.filter((hour) => {
          const currentHour = parseInt(hour.split(":")[0]);
          return currentHour > startHour;
        });
      }
      
      // If selected end time is not valid, select first valid hour
      if (validEndHours.length > 0 && !validEndHours.includes(endTime)) {
        setEndTime(validEndHours[0]);
      }
    }
  }, [startDate, endDate, startTime, bookedSlots]);

  const fetchAllMotors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/motors");
      const data = await response.json();

      if (response.ok) {
        // Only show available motors
        setMotors(data.motors.filter((m: Motor) => m.status === "Available"));
      }
    } catch (error) {
      console.error("Failed to fetch motors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlots = async (motorId: number) => {
    try {
      setLoadingSlots(true);
      const response = await fetch(`/api/motors/${motorId}/booked-slots`);
      const data = await response.json();

      if (response.ok) {
        setBookedSlots(data.bookedSlots || []);
      }
    } catch (error) {
      console.error("Failed to fetch booked slots:", error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const isDateBlocked = (date: Date): boolean => {
    if (!bookedSlots.length) return false;

    return bookedSlots.some((slot) => {
      const slotStart = parseISO(slot.startDate);
      const slotEnd = parseISO(slot.endDate);

      // Reset time to compare only dates
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      const start = new Date(slotStart);
      start.setHours(0, 0, 0, 0);

      const end = new Date(slotEnd);
      end.setHours(0, 0, 0, 0);

      return isWithinInterval(checkDate, { start, end });
    });
  };

  // Get booking info for a specific date (for tooltip/display)
  const getDateBookingInfo = (date: Date): BookedSlot | null => {
    if (!bookedSlots.length) return null;

    const booking = bookedSlots.find((slot) => {
      const slotStart = parseISO(slot.startDate);
      const slotEnd = parseISO(slot.endDate);

      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      const start = new Date(slotStart);
      start.setHours(0, 0, 0, 0);

      const end = new Date(slotEnd);
      end.setHours(0, 0, 0, 0);

      return isWithinInterval(checkDate, { start, end });
    });

    return booking || null;
  };

  // Check if a specific time is blocked on a specific date
  const isTimeBlocked = (date: Date | undefined, time: string, isEndTime: boolean = false): boolean => {
    if (!date || !bookedSlots.length) return false;

    const checkDateTime = new Date(date);
    const [hour, minute] = time.split(":").map(Number);
    checkDateTime.setHours(hour, minute, 0, 0);

    return bookedSlots.some((slot) => {
      const slotStart = new Date(slot.startDate);
      const slotEnd = new Date(slot.endDate);

      if (isEndTime) {
        // For end time, check if it would create an overlap
        // The end time should not be within any booked slot
        return checkDateTime > slotStart && checkDateTime <= slotEnd;
      } else {
        // For start time, check if it's within any booked slot
        return checkDateTime >= slotStart && checkDateTime < slotEnd;
      }
    });
  };

  // Get available hours for a specific date
  const getAvailableHours = (date: Date | undefined, isEndTime: boolean = false): string[] => {
    if (!date) return [];

    const allHours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

    // If no booked slots, all hours are available
    if (!bookedSlots.length) return allHours;

    // Filter out blocked hours
    return allHours.filter((hour) => !isTimeBlocked(date, hour, isEndTime));
  };

  const hasTimeConflict = (): boolean => {
    if (!startDate || !endDate || !startTime || !endTime || !bookedSlots.length) {
      return false;
    }

    const requestStart = new Date(startDate);
    requestStart.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);

    const requestEnd = new Date(endDate);
    requestEnd.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);

    return bookedSlots.some((slot) => {
      const slotStart = new Date(slot.startDate);
      const slotEnd = new Date(slot.endDate);

      // Check for overlap
      return requestStart < slotEnd && requestEnd > slotStart;
    });
  };

  const handleMotorSelect = (motor: Motor) => {
    setSelectedMotor(motor);
    setStep(2);
    // Reset dates when changing motor
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("09:00");
    setEndTime("17:00");
  };

  const handleBackToMotors = () => {
    setStep(1);
    setSelectedMotor(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setBookedSlots([]);
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !selectedMotor) return 0;

    const start = new Date(startDate);
    start.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);

    const end = new Date(endDate);
    end.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);
    return selectedMotor.pricePerDay * days;
  };

  const totalDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    start.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);

    const end = new Date(endDate);
    end.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);
    return days > 0 ? days : 1;
  };

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

    if (hasTimeConflict()) {
      alert("The selected time period conflicts with an existing booking. Please choose different dates or times.");
      return;
    }

    if (totalDays() < 1) {
      alert("End date must be after start date");
      return;
    }

    try {
      setSubmitting(true);

      const startDateTime = new Date(startDate);
      startDateTime.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);

      const endDateTime = new Date(endDate);
      endDateTime.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motorId: selectedMotor.id,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          userId: user.id,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          alert(data.error || "This motor is already booked for the selected period.");
          // Refresh booked slots
          fetchBookedSlots(selectedMotor.id);
        } else {
          alert(data.error || "Failed to create booking");
        }
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

  const timeConflict = hasTimeConflict();
  const isTimeInvalid =
    startDate &&
    endDate &&
    startTime &&
    endTime &&
    (() => {
      const start = new Date(startDate);
      start.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]), 0, 0);
      const end = new Date(endDate);
      end.setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), 0, 0);
      return end <= start;
    })();

  const isInvalid = Boolean(isTimeInvalid);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: "#0A2540" }}>
              Book Your Motor
            </h1>
            <p className="text-sm sm:text-base text-gray-600">{step === 1 ? "Select a motorcycle to start your booking" : `Configure rental period for ${selectedMotor?.brand} ${selectedMotor?.model}`}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{step === 1 ? "Step 1: Choose Your Motorcycle" : "Step 2: Select Rental Period"}</CardTitle>
                  <CardDescription>{step === 1 ? "Select from our available motorcycles" : "Pick your rental dates and times"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Step 1: Motor Selection */}
                  {step === 1 && (
                    <>
                      {loading ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      ) : motors.length === 0 ? (
                        <div className="text-center p-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-600">No motors available at the moment</p>
                          <p className="text-sm text-gray-500 mt-2">Please check back later</p>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {motors.map((motor) => (
                            <div key={motor.id} onClick={() => handleMotorSelect(motor)} className="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:border-[#1ABC9C] border-gray-200">
                              <div className="flex gap-3">
                                {motor.image && <img src={motor.image} alt={motor.name} className="w-24 h-24 object-cover rounded-md" />}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-base">
                                    {motor.brand} {motor.model}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">{motor.name}</p>
                                  <div className="mt-3 flex items-center justify-between">
                                    <p className="text-lg font-semibold" style={{ color: "#1ABC9C" }}>
                                      Rp {motor.pricePerDay.toLocaleString("id-ID")}/day
                                    </p>
                                    <Button size="sm" style={{ backgroundColor: "#1ABC9C" }}>
                                      Select
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Step 2: Date & Time Selection */}
                  {step === 2 && selectedMotor && (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img src={selectedMotor.image || ""} alt={selectedMotor.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-semibold">
                            {selectedMotor.brand} {selectedMotor.model}
                          </p>
                          <p className="text-sm text-gray-600">{selectedMotor.name}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleBackToMotors}>
                          Change
                        </Button>
                      </div>

                      {loadingSlots && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                          Loading availability calendar...
                        </div>
                      )}

                      {/* Legend untuk calendar */}
                      {!loadingSlots && bookedSlots.length > 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-gray-900 mb-2">📋 Calendar Legend:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded border-2 border-green-500 bg-green-50 flex items-center justify-center">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                              </div>
                              <span className="text-gray-700">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded border-2 border-red-500 bg-red-100 flex items-center justify-center">
                                <XCircle className="h-3 w-3 text-red-600" />
                              </div>
                              <span className="text-gray-700">Booked (Disabled)</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-300">
                            💡 Dates marked with ❌ are already booked and cannot be selected.
                          </p>
                        </div>
                      )}

                      {/* Date Selection with blocked dates */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date * {startDate && !isDateBlocked(startDate) && <span className="text-green-600 text-xs">✓ Available</span>}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                disabled={(date) => {
                                  const isPast = date < new Date();
                                  const isBlocked = isDateBlocked(date);
                                  return isPast || isBlocked;
                                }}
                                modifiers={{
                                  booked: (date) => isDateBlocked(date),
                                }}
                                modifiersClassNames={{
                                  booked: "bg-red-100 text-red-900 line-through opacity-40 cursor-not-allowed relative after:content-['❌'] after:absolute after:top-0 after:right-0 after:text-[10px]",
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {startDate && isDateBlocked(startDate) && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              This date is fully booked
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>End Date * {endDate && !isDateBlocked(endDate) && <span className="text-green-600 text-xs">✓ Available</span>}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                disabled={(date) => {
                                  const isPast = !startDate || date < startDate;
                                  const isBlocked = isDateBlocked(date);
                                  return isPast || isBlocked;
                                }}
                                modifiers={{
                                  booked: (date) => isDateBlocked(date),
                                }}
                                modifiersClassNames={{
                                  booked: "bg-red-100 text-red-900 line-through opacity-40 cursor-not-allowed relative after:content-['❌'] after:absolute after:top-0 after:right-0 after:text-[10px]",
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {endDate && isDateBlocked(endDate) && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              This date is fully booked
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Time Selection */}
                      <div className="space-y-4">
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-indigo-900 mb-1 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Select Rental Hours
                          </p>
                          <p className="text-xs text-indigo-700">
                            Only available time slots are shown. Blocked hours are automatically filtered out.
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="start-time" className="flex items-center justify-between">
                              <span>Start Time *</span>
                              {startDate && getAvailableHours(startDate, false).length > 0 && (
                                <span className="text-xs text-green-600">
                                  {getAvailableHours(startDate, false).length} hours available
                                </span>
                              )}
                            </Label>
                            <Select value={startTime} onValueChange={setStartTime} disabled={!startDate}>
                              <SelectTrigger id="start-time" className={cn(!startDate && "opacity-50")}>
                                <SelectValue placeholder={startDate ? "Select time" : "Select date first"} />
                              </SelectTrigger>
                              <SelectContent>
                                {startDate ? (
                                  getAvailableHours(startDate, false).length > 0 ? (
                                    getAvailableHours(startDate, false).map((hour) => (
                                      <SelectItem key={hour} value={hour} className="flex items-center justify-between">
                                        <span>{hour}</span>
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="none" disabled className="text-red-600">
                                      ❌ No available hours
                                    </SelectItem>
                                  )
                                ) : (
                                  <SelectItem value="none" disabled className="text-gray-500">
                                    📅 Select date first
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            {startDate && getAvailableHours(startDate, false).length === 0 && (
                              <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700 flex items-start gap-2">
                                <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold">Fully Booked</p>
                                  <p>This date has no available hours. Please select another date.</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="end-time" className="flex items-center justify-between">
                              <span>End Time *</span>
                              {endDate && startTime && getAvailableHours(endDate, true).filter((hour) => {
                                if (startDate && endDate && startDate.toDateString() === endDate.toDateString()) {
                                  const startHour = parseInt(startTime.split(":")[0]);
                                  const currentHour = parseInt(hour.split(":")[0]);
                                  return currentHour > startHour;
                                }
                                return true;
                              }).length > 0 && (
                                <span className="text-xs text-green-600">
                                  {
                                    getAvailableHours(endDate, true).filter((hour) => {
                                      if (startDate && endDate && startDate.toDateString() === endDate.toDateString()) {
                                        const startHour = parseInt(startTime.split(":")[0]);
                                        const currentHour = parseInt(hour.split(":")[0]);
                                        return currentHour > startHour;
                                      }
                                      return true;
                                    }).length
                                  }{" "}
                                  hours available
                                </span>
                              )}
                            </Label>
                            <Select value={endTime} onValueChange={setEndTime} disabled={!endDate || !startDate}>
                              <SelectTrigger id="end-time" className={cn((!endDate || !startDate) && "opacity-50")}>
                                <SelectValue placeholder={endDate ? "Select time" : "Select date first"} />
                              </SelectTrigger>
                              <SelectContent>
                                {endDate && startDate ? (
                                  getAvailableHours(endDate, true).length > 0 ? (
                                    getAvailableHours(endDate, true)
                                      .filter((hour) => {
                                        if (startDate.toDateString() === endDate.toDateString()) {
                                          const startHour = parseInt(startTime.split(":")[0]);
                                          const currentHour = parseInt(hour.split(":")[0]);
                                          return currentHour > startHour;
                                        }
                                        return true;
                                      })
                                      .map((hour) => (
                                        <SelectItem key={hour} value={hour}>
                                          {hour}
                                        </SelectItem>
                                      ))
                                  ) : (
                                    <SelectItem value="none" disabled className="text-red-600">
                                      ❌ No available hours
                                    </SelectItem>
                                  )
                                ) : (
                                  <SelectItem value="none" disabled className="text-gray-500">
                                    📅 Select dates first
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            {endDate && getAvailableHours(endDate, true).length === 0 && (
                              <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700 flex items-start gap-2">
                                <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold">Fully Booked</p>
                                  <p>This date has no available hours. Please select another date.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Validation Messages */}
                      {isTimeInvalid && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                          <span>End date and time must be after start date and time. Please adjust your selection.</span>
                        </div>
                      )}

                      {timeConflict && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Time Conflict Detected!</p>
                            <p className="mt-1">This motorcycle is already booked for the selected period. Please choose different dates or times.</p>
                          </div>
                        </div>
                      )}

                      {bookedSlots.length > 0 && !loadingSlots && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-blue-900 mb-2">📅 Currently Booked Periods:</p>
                          <div className="space-y-1">
                            {bookedSlots.map((slot) => {
                              const start = parseISO(slot.startDate);
                              const end = parseISO(slot.endDate);
                              return (
                                <div key={slot.id} className="text-xs text-blue-800 flex items-start gap-2">
                                  <span className="mt-0.5">•</span>
                                  <div>
                                    <p className="font-medium">{format(start, "PPP")} - {format(end, "PPP")}</p>
                                    <p className="text-blue-600">
                                      Time: {format(start, "HH:mm")} - {format(end, "HH:mm")} ({slot.status})
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-blue-700 mt-3 pt-3 border-t border-blue-200">
                            💡 Tip: Blocked dates and times are automatically disabled in the selection above.
                          </p>
                        </div>
                      )}

                      {/* Special Requests */}
                      <div className="space-y-2">
                        <Label htmlFor="notes">Special Requests (Optional)</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requirements or notes..." rows={3} />
                      </div>
                    </>
                  )}
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
                  {step === 1 || !selectedMotor ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-sm text-gray-500">Select a motorcycle to continue</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="font-medium text-sm sm:text-base">
                          {selectedMotor.brand} {selectedMotor.model}
                        </div>
                        {selectedMotor.image && <img src={selectedMotor.image} alt={selectedMotor.name} className="w-full h-32 sm:h-40 object-cover rounded-lg" />}
                      </div>

                      {startDate && endDate && (
                        <>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price per day</span>
                              <span className="font-medium">Rp {selectedMotor.pricePerDay.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration</span>
                              <span className="font-medium">
                                {totalDays()} {totalDays() === 1 ? "day" : "days"}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Period</span>
                              <span>
                                {format(startDate, "PP")} {startTime} - {format(endDate, "PP")} {endTime}
                              </span>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-semibold">Total</span>
                              <span className="text-xl sm:text-2xl font-bold" style={{ color: "#0A2540" }}>
                                Rp {calculateTotal().toLocaleString("id-ID")}
                              </span>
                            </div>

                            <Button className="w-full" size="lg" style={{ backgroundColor: "#1ABC9C" }} onClick={handleBooking} disabled={submitting || !startDate || !endDate || timeConflict || isInvalid}>
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
                        </>
                      )}

                      {!startDate && !endDate && (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">Select rental period to see pricing</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
