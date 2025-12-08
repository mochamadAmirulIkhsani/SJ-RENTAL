"use client";

import { CustomerNavbar } from "@/components/customer-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, Mail, Printer } from "lucide-react";
import Link from "next/link";

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <Card className="mb-6 border-2" style={{ borderColor: "#1ABC9C" }}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: "#1ABC9C" }}>
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: "#0A2540" }}>
                  Booking Confirmed!
                </h1>
                <p className="text-gray-600 mb-4">Your reservation has been successfully processed</p>
                <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">Booking Reference</p>
                  <p className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                    SJ-2025-00123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Motor</p>
                  <p className="font-semibold">Honda Vario 160</p>
                  <p className="text-sm text-gray-600">Automatic • 160cc</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge style={{ backgroundColor: "#1ABC9C" }}>Confirmed</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pickup Date</p>
                  <p className="font-semibold">December 10, 2025</p>
                  <p className="text-sm text-gray-600">10:00 AM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Return Date</p>
                  <p className="font-semibold">December 13, 2025</p>
                  <p className="text-sm text-gray-600">10:00 AM</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                <p className="font-semibold">Central Jakarta Office</p>
                <p className="text-sm text-gray-600">Jl. Sudirman No. 123, Jakarta Pusat</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-1">Customer Information</p>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-600">john.doe@example.com</p>
                <p className="text-sm text-gray-600">+62 812 3456 7890</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Motor Rental (3 days)</span>
                <span>Rp 195,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Premium Insurance</span>
                <span>Rp 75,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span>Rp 27,000</span>
              </div>
              <div className="pt-3 border-t flex justify-between items-center">
                <span className="font-semibold">Total Paid</span>
                <span className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                  Rp 297,000
                </span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <Badge variant="outline">Bank Transfer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="mb-6" style={{ backgroundColor: "#FEF3C7" }}>
            <CardHeader>
              <CardTitle className="text-base">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Please bring your ID card and driver's license for pickup</p>
              <p>• Arrive 15 minutes before your scheduled pickup time</p>
              <p>• A security deposit of Rp 500,000 will be required at pickup</p>
              <p>• Free cancellation available up to 24 hours before pickup</p>
              <p>• Late return may incur additional charges</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Print Confirmation
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Email Receipt
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">A confirmation email has been sent to your email address</p>
            <div className="flex gap-4 justify-center">
              <Button style={{ backgroundColor: "#1ABC9C" }}>
                <Link href="/my-bookings">View My Bookings</Link>
              </Button>
              <Button variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
