"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bike, Filter, Search, Eye, Loader2 } from "lucide-react";

interface Motor {
  id: number;
  name: string;
  plateNumber: string;
  type: string;
  cc: string;
  brand: string;
  status: string;
  location: string;
  pricePerDay: number;
}

interface Stats {
  totalFleet: number;
  available: number;
  rented: number;
  maintenance: number;
}

export default function MotorAvailabilityPage() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [stats, setStats] = useState<Stats>({ totalFleet: 0, available: 0, rented: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    location: "all",
    type: "all",
  });

  const fetchMotors = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.status !== "all") queryParams.append("status", filters.status);
      if (filters.location !== "all") queryParams.append("location", filters.location);
      if (filters.type !== "all") queryParams.append("type", filters.type);
      if (filters.search) queryParams.append("search", filters.search);

      const response = await fetch(`/api/motors?${queryParams.toString()}`);
      const data = await response.json();

      setMotors(data.motors);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch motors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch motors on mount and when filters change
  useEffect(() => {
    fetchMotors();
  }, [filters.status, filters.location, filters.type]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchMotors();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const handleApplyFilters = () => {
    fetchMotors();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 w-full lg:ml-64">
        <AdminHeader title="Motor Availability" />

        <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Fleet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                  {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats?.totalFleet || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: "#1ABC9C" }}>
                  {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats?.available || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Rented</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats?.rented || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats?.maintenance || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filter Motors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search..." className="pl-10" value={filters.search} onChange={handleSearchChange} />
                </div>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="central">Central Office</SelectItem>
                    <SelectItem value="north">North Branch</SelectItem>
                    <SelectItem value="south">South Branch</SelectItem>
                    <SelectItem value="east">East Branch</SelectItem>
                    <SelectItem value="west">West Branch</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                <Button style={{ backgroundColor: "#1ABC9C" }} onClick={handleApplyFilters} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Motor List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Motor Fleet</CardTitle>
                  <CardDescription>Real-time availability monitoring</CardDescription>
                </div>
                <Button style={{ backgroundColor: "#1ABC9C" }}>
                  <Bike className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Motor ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="mt-2 text-gray-500">Loading motors...</p>
                      </TableCell>
                    </TableRow>
                  ) : !motors || motors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No motors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    motors.map((motor) => (
                      <TableRow key={motor.id}>
                        <TableCell className="font-medium">M{String(motor.id).padStart(3, "0")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                              <Bike className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{motor.name}</p>
                              <p className="text-xs text-gray-600">{motor.cc}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{motor.plateNumber}</TableCell>
                        <TableCell>{motor.type}</TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: motor.status === "Available" ? "#1ABC9C" : motor.status === "Rented" ? "#F59E0B" : "#EF4444",
                            }}
                          >
                            {motor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{motor.location}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
