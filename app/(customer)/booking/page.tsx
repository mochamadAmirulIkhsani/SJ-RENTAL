"use client";

import { CustomerNavbar } from "@/components/customer-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, CreditCard, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function BookingPage() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { user } = useAuth();
  const router = useRouter();

  const handleProceedToPayment = () => {
    if (!user) {
      // Redirect to login if not logged in
      router.push("/login");
      return;
    }
    // Proceed to payment/confirmation page
    router.push("/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#0A2540" }}>
              Book Your Motor
            </h1>
            <p className="text-gray-600">Complete the form below to reserve your motorcycle</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Fill in your rental information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Motor Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="motor">Select Motor</Label>
                    <Select>
                      <SelectTrigger id="motor">
                        <SelectValue placeholder="Choose a motor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="honda-beat">Honda Beat - Rp 50,000/day</SelectItem>
                        <SelectItem value="yamaha-mio">Yamaha Mio - Rp 55,000/day</SelectItem>
                        <SelectItem value="honda-vario">Honda Vario 160 - Rp 65,000/day</SelectItem>
                        <SelectItem value="yamaha-aerox">Yamaha Aerox - Rp 70,000/day</SelectItem>
                        <SelectItem value="yamaha-nmax">Yamaha NMAX - Rp 75,000/day</SelectItem>
                        <SelectItem value="honda-pcx">Honda PCX - Rp 80,000/day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Customer Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+62 812 3456 7890" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Card Number</Label>
                      <Input id="idNumber" placeholder="3174012345678901" />
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Pickup & Return Location
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select pickup location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="central">Central Jakarta Office</SelectItem>
                          <SelectItem value="south">South Jakarta Branch</SelectItem>
                          <SelectItem value="north">North Jakarta Branch</SelectItem>
                          <SelectItem value="east">East Jakarta Branch</SelectItem>
                          <SelectItem value="west">West Jakarta Branch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address (Optional)</Label>
                      <Textarea id="address" placeholder="Enter delivery address if you want the motor delivered to you" rows={3} />
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">Additional Options</h3>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="helmet" />
                        <label htmlFor="helmet" className="text-sm font-medium leading-none">
                          Extra Helmet (Rp 10,000)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="insurance" />
                        <label htmlFor="insurance" className="text-sm font-medium leading-none">
                          Premium Insurance (Rp 25,000/day)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery" />
                        <label htmlFor="delivery" className="text-sm font-medium leading-none">
                          Delivery Service (Rp 50,000)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requests (Optional)</Label>
                    <Textarea id="notes" placeholder="Any special requirements or notes..." rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Motor Rental</span>
                      <span className="font-medium">Rp 65,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">3 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">Rp 195,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-medium">Rp 75,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-medium">Rp 27,000</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                        Rp 297,000
                      </span>
                    </div>

                    <Button className="w-full" size="lg" style={{ backgroundColor: "#1ABC9C" }} onClick={handleProceedToPayment}>
                      <CreditCard className="mr-2 h-5 w-5" />
                      {user ? "Proceed to Payment" : "Login to Continue"}
                    </Button>
                  </div>

                  <div className="pt-4 border-t space-y-2 text-xs text-gray-600">
                    <p>✓ Free cancellation up to 24 hours before pickup</p>
                    <p>✓ Full insurance coverage included</p>
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
