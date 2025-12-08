"use client";

import { CustomerNavbar } from "@/components/customer-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bike, Filter, Search } from "lucide-react";
import Link from "next/link";

const motors = [
  { id: 1, name: "Honda Beat", type: "Automatic", price: "50,000", cc: "110cc", year: "2023", status: "Available" },
  { id: 2, name: "Yamaha Mio", type: "Automatic", price: "55,000", cc: "125cc", year: "2023", status: "Available" },
  { id: 3, name: "Honda Vario 160", type: "Automatic", price: "65,000", cc: "160cc", year: "2024", status: "Available" },
  { id: 4, name: "Yamaha Aerox", type: "Automatic", price: "70,000", cc: "155cc", year: "2024", status: "Available" },
  { id: 5, name: "Honda Scoopy", type: "Automatic", price: "48,000", cc: "110cc", year: "2023", status: "Rented" },
  { id: 6, name: "Yamaha NMAX", type: "Automatic", price: "75,000", cc: "155cc", year: "2024", status: "Available" },
  { id: 7, name: "Honda PCX", type: "Automatic", price: "80,000", cc: "160cc", year: "2024", status: "Available" },
  { id: 8, name: "Yamaha Freego", type: "Automatic", price: "52,000", cc: "125cc", year: "2023", status: "Rented" },
];

export default function MotorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#0A2540" }}>
            Available Motors
          </h1>
          <p className="text-gray-600">Browse our complete fleet of quality motorcycles</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter Motors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under 50k</SelectItem>
                  <SelectItem value="mid">50k - 70k</SelectItem>
                  <SelectItem value="high">Above 70k</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Motors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {motors.map((motor) => (
            <Card key={motor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                <Bike className="h-20 w-20 text-gray-400" />
                <Badge className="absolute top-4 right-4" style={{ backgroundColor: motor.status === "Available" ? "#1ABC9C" : "#6B7280" }}>
                  {motor.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{motor.name}</CardTitle>
                <CardDescription>
                  {motor.type} • {motor.cc} • {motor.year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                      Rp {motor.price}
                    </p>
                    <p className="text-sm text-gray-600">per day</p>
                  </div>
                </div>
                <Button className="w-full" style={{ backgroundColor: motor.status === "Available" ? "#1ABC9C" : "#6B7280" }} disabled={motor.status !== "Available"}>
                  {motor.status === "Available" ? <Link href="/booking">Book Now</Link> : "Not Available"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
