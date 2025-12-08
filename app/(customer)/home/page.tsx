"use client"

import Link from "next/link"
import { CustomerNavbar } from "@/components/customer-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bike, Clock, Shield, Star, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      {/* Hero Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#0A2540' }}>
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Rent Your Perfect Motor Today
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience freedom on two wheels. Quality motors, flexible rentals, and unbeatable service.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" style={{ backgroundColor: '#1ABC9C' }} className="hover:opacity-90">
              <Link href="/motors" className="flex items-center">
                Browse Motors
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white">
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#0A2540' }}>
              Why Choose SJRent?
            </h2>
            <p className="text-gray-600">We make motor rental easy, safe, and affordable</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#1ABC9C' }}>
                  <Bike className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Wide Selection</CardTitle>
                <CardDescription>
                  Choose from our extensive fleet of well-maintained motors
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#1ABC9C' }}>
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Flexible Rental</CardTitle>
                <CardDescription>
                  Daily, weekly, or monthly options to fit your schedule
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#1ABC9C' }}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Full Insurance</CardTitle>
                <CardDescription>
                  Ride with peace of mind with comprehensive coverage
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#1ABC9C' }}>
                  <Star className="h-6 w-6 text-white" />
                </div>
                <CardTitle>5-Star Service</CardTitle>
                <CardDescription>
                  Rated excellent by thousands of satisfied customers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Motors */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#0A2540' }}>
              Featured Motors
            </h2>
            <p className="text-gray-600">Our most popular rentals</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Honda Beat", type: "Automatic", price: "50,000", rating: "4.8" },
              { name: "Yamaha Mio", type: "Automatic", price: "55,000", rating: "4.7" },
              { name: "Honda Vario 160", type: "Automatic", price: "65,000", rating: "4.9" },
            ].map((motor, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Bike className="h-20 w-20 text-gray-400" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{motor.name}</CardTitle>
                    <Badge style={{ backgroundColor: '#1ABC9C' }}>Available</Badge>
                  </div>
                  <CardDescription>{motor.type} • {motor.rating} ★</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: '#0A2540' }}>
                        Rp {motor.price}
                      </p>
                      <p className="text-sm text-gray-600">per day</p>
                    </div>
                    <Button style={{ backgroundColor: '#1ABC9C' }} className="hover:opacity-90">
                      <Link href="/booking">Rent Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <Link href="/motors" className="flex items-center">
                View All Motors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#1ABC9C' }}>
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Book your motor in just a few clicks
          </p>
          <Button size="lg" className="bg-white" style={{ color: '#0A2540' }}>
            <Link href="/booking">Book Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t" style={{ backgroundColor: '#0A2540' }}>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">SJRent</h3>
              <p className="text-gray-400 text-sm">
                Your trusted motor rental partner in Indonesia
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/motors">Available Motors</Link></li>
                <li><Link href="/booking">Book Now</Link></li>
                <li><Link href="/my-bookings">My Bookings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Terms & Conditions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Phone: +62 123 4567 890</li>
                <li>Email: info@sjrent.com</li>
                <li>Address: Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            © 2025 SJRent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
