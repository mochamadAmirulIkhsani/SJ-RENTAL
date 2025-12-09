"use client";

import { useState, useEffect } from "react";
import { CustomerNavbar } from "@/components/customer-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bike, Filter, Search, Loader2 } from "lucide-react";
import Link from "next/link";

interface Motor {
  id: number;
  name: string;
  plateNumber: string;
  type: string;
  cc: string;
  brand: string;
  model: string;
  year: number;
  color: string | null;
  status: string;
  location: string;
  pricePerDay: number;
  image: string | null;
  description: string | null;
}

export default function MotorsPage() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const fetchMotors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/motors?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        let filteredMotors = data.motors;

        // Filter by price range
        if (priceFilter !== "all") {
          filteredMotors = filteredMotors.filter((motor: Motor) => {
            const price = Number(motor.pricePerDay);
            if (priceFilter === "low") return price < 50000;
            if (priceFilter === "mid") return price >= 50000 && price <= 70000;
            if (priceFilter === "high") return price > 70000;
            return true;
          });
        }

        setMotors(filteredMotors);
      }
    } catch (error) {
      console.error("Failed to fetch motors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, [searchTerm, typeFilter, statusFilter, priceFilter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };
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
                <Input placeholder="Search by name..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
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
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
            </div>
          ) : motors.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Bike className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No motors found</p>
            </div>
          ) : (
            motors.map((motor) => (
              <Card key={motor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  {motor.image ? <img src={motor.image} alt={motor.name} className="w-full h-full object-cover" /> : <Bike className="h-20 w-20 text-gray-400" />}
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
                        Rp {formatPrice(motor.pricePerDay)}
                      </p>
                      <p className="text-sm text-gray-600">per day</p>
                    </div>
                  </div>
                  <Button className="w-full" style={{ backgroundColor: motor.status === "Available" ? "#1ABC9C" : "#6B7280" }} disabled={motor.status !== "Available"}>
                    {motor.status === "Available" ? <Link href="/booking">Book Now</Link> : "Not Available"}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
