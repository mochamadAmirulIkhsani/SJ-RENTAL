"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { MotorImageUpload } from "@/components/motor-image-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bike, Plus, Edit, Trash2, Eye, Search, Filter, Loader2 } from "lucide-react";

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

interface Stats {
  totalFleet: number;
  available: number;
  rented: number;
  maintenance: number;
}

export default function InventoryPage() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [stats, setStats] = useState<Stats>({ totalFleet: 0, available: 0, rented: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [motorToDelete, setMotorToDelete] = useState<Motor | null>(null);

  // Form state for adding new motor
  const [newMotor, setNewMotor] = useState({
    name: "",
    plateNumber: "",
    brand: "",
    model: "",
    year: new Date().getFullYear().toString(),
    cc: "",
    color: "",
    type: "",
    pricePerDay: "",
    location: "Central Office",
    description: "",
  });

  // Fetch motors from API
  const fetchMotors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);
      if (brandFilter !== "all") params.append("brand", brandFilter);

      const response = await fetch(`/api/motors?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setMotors(data.motors);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch motors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new motor
  const handleAddMotor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/motors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMotor,
          year: parseInt(newMotor.year),
          pricePerDay: parseFloat(newMotor.pricePerDay),
        }),
      });

      if (response.ok) {
        setIsAddDialogOpen(false);
        setNewMotor({
          name: "",
          plateNumber: "",
          brand: "",
          model: "",
          year: new Date().getFullYear().toString(),
          cc: "",
          color: "",
          type: "",
          pricePerDay: "",
          location: "Central Office",
          description: "",
        });
        fetchMotors();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add motor");
      }
    } catch (error) {
      console.error("Failed to add motor:", error);
      alert("Failed to add motor");
    }
  };

  // Delete motor
  const handleDeleteMotor = async () => {
    if (!motorToDelete) return;
    try {
      const response = await fetch(`/api/motors/${motorToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setMotorToDelete(null);
        fetchMotors();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete motor");
      }
    } catch (error) {
      console.error("Failed to delete motor:", error);
      alert("Failed to delete motor");
    }
  };

  // View motor details
  const handleViewMotor = async (motorId: number) => {
    try {
      const response = await fetch(`/api/motors/${motorId}`);
      const data = await response.json();
      if (response.ok) {
        setSelectedMotor(data.motor);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch motor details:", error);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, [statusFilter, brandFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMotors();
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when items per page changes
  }, [itemsPerPage]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMotors = motors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(motors.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 w-full lg:ml-64">
        <AdminHeader title="Motor Inventory Management" />

        <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Motor List</TabsTrigger>
              <TabsTrigger value="add">Add New Motor</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4 sm:space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Motors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalFleet}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#1ABC9C" }}>
                      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.available}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">In Use</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">{loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.rented}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-500">{loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.maintenance}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
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
                      <Input placeholder="Search..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <Select value={brandFilter} onValueChange={setBrandFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        <SelectItem value="honda">Honda</SelectItem>
                        <SelectItem value="yamaha">Yamaha</SelectItem>
                        <SelectItem value="suzuki">Suzuki</SelectItem>
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
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button style={{ backgroundColor: "#1ABC9C" }} onClick={fetchMotors} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply Filters"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Motor Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Motor Inventory</CardTitle>
                      <CardDescription>Manage your motor fleet</CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Motor Details</DialogTitle>
                          <DialogDescription>View complete motor information</DialogDescription>
                        </DialogHeader>
                        {selectedMotor && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Motor ID</p>
                                <p className="font-semibold">{selectedMotor.id}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <Badge
                                  style={{
                                    backgroundColor: selectedMotor.status === "Available" ? "#1ABC9C" : selectedMotor.status === "Rented" ? "#F59E0B" : "#EF4444",
                                  }}
                                >
                                  {selectedMotor.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                              {selectedMotor.image ? <img src={selectedMotor.image} alt={selectedMotor.name} className="w-full h-full object-cover" /> : <Bike className="h-20 w-20 text-gray-400" />}
                            </div>
                            <div className="border-t pt-4">
                              <MotorImageUpload
                                motorId={selectedMotor.id}
                                currentImageUrl={selectedMotor.image}
                                onUploadSuccess={(imageUrl) => {
                                  setSelectedMotor({ ...selectedMotor, image: imageUrl });
                                  fetchMotors();
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Brand & Model</p>
                                <p className="font-semibold">
                                  {selectedMotor.brand} {selectedMotor.model}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Year</p>
                                <p className="font-semibold">{selectedMotor.year}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Engine</p>
                                <p className="font-semibold">{selectedMotor.cc}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Plate Number</p>
                                <p className="font-semibold">{selectedMotor.plateNumber}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Type</p>
                                <p className="font-semibold">{selectedMotor.type}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Color</p>
                                <p className="font-semibold">{selectedMotor.color || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Location</p>
                                <p className="font-semibold">{selectedMotor.location}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Daily Rate</p>
                                <p className="font-semibold">Rp {formatPrice(selectedMotor.pricePerDay)}</p>
                              </div>
                            </div>
                            {selectedMotor.description && (
                              <div>
                                <p className="text-sm text-gray-600">Description</p>
                                <p className="text-sm">{selectedMotor.description}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Motor</DialogTitle>
                          <DialogDescription>Are you sure you want to delete {motorToDelete?.name}? This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-4 justify-end">
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button style={{ backgroundColor: "#EF4444" }} onClick={handleDeleteMotor}>
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>No</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Brand</TableHead>
                              <TableHead>Plate Number</TableHead>
                              <TableHead>Year</TableHead>
                              <TableHead>Daily Rate</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loading ? (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                </TableCell>
                              </TableRow>
                            ) : motors.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                  No motors found
                                </TableCell>
                              </TableRow>
                            ) : (
                              currentMotors.map((motor, index) => (
                                <TableRow key={motor.id}>
                                  <TableCell className="font-medium">{indexOfFirstItem + index + 1}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {motor.image ? <img src={motor.image} alt={motor.name} className="w-full h-full object-cover" /> : <Bike className="h-4 w-4 text-gray-600" />}
                                      </div>
                                      <div>
                                        <p className="font-medium">{motor.name}</p>
                                        <p className="text-xs text-gray-600">{motor.cc}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{motor.brand}</TableCell>
                                  <TableCell>{motor.plateNumber}</TableCell>
                                  <TableCell>{motor.year}</TableCell>
                                  <TableCell className="font-semibold">Rp {formatPrice(motor.pricePerDay)}</TableCell>
                                  <TableCell>
                                    <Badge
                                      style={{
                                        backgroundColor: motor.status === "Available" ? "#1ABC9C" : motor.status === "Rented" ? "#F59E0B" : "#EF4444",
                                      }}
                                    >
                                      {motor.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button variant="ghost" size="sm" onClick={() => handleViewMotor(motor.id)}>
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setMotorToDelete(motor);
                                          setIsDeleteDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  {/* Pagination */}
                  {!loading && motors.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border-t">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, motors.length)} of {motors.length} motors
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-600">Show:</span>
                          <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="border rounded-md px-2 py-1 text-xs sm:text-sm">
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="min-w-20 h-8 sm:h-9 text-xs sm:text-sm">
                          Previous
                        </Button>
                        <div className="hidden md:flex gap-1.5">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              style={currentPage === page ? { backgroundColor: "#1ABC9C" } : {}}
                              className="h-8 sm:h-9 w-8 sm:w-9 p-0 text-xs sm:text-sm"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <div className="md:hidden text-xs sm:text-sm text-gray-600 flex items-center px-2">
                          Page {currentPage} of {totalPages}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="min-w-20 h-8 sm:h-9 text-xs sm:text-sm">
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Motor</CardTitle>
                  <CardDescription>Enter motor details to add to inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddMotor} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand *</Label>
                        <Select value={newMotor.brand} onValueChange={(value) => setNewMotor({ ...newMotor, brand: value })}>
                          <SelectTrigger id="brand">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Honda">Honda</SelectItem>
                            <SelectItem value="Yamaha">Yamaha</SelectItem>
                            <SelectItem value="Suzuki">Suzuki</SelectItem>
                            <SelectItem value="Kawasaki">Kawasaki</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model">Model *</Label>
                        <Input id="model" placeholder="e.g., Beat, Vario" value={newMotor.model} onChange={(e) => setNewMotor({ ...newMotor, model: e.target.value })} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Motor Name *</Label>
                        <Input id="name" placeholder="e.g., Honda Beat 2024" value={newMotor.name} onChange={(e) => setNewMotor({ ...newMotor, name: e.target.value })} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Year *</Label>
                        <Input id="year" type="number" placeholder="2024" value={newMotor.year} onChange={(e) => setNewMotor({ ...newMotor, year: e.target.value })} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cc">Engine CC *</Label>
                        <Input id="cc" placeholder="110cc" value={newMotor.cc} onChange={(e) => setNewMotor({ ...newMotor, cc: e.target.value })} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="plate">Plate Number *</Label>
                        <Input id="plate" placeholder="B 1234 ABC" value={newMotor.plateNumber} onChange={(e) => setNewMotor({ ...newMotor, plateNumber: e.target.value })} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" placeholder="Red" value={newMotor.color} onChange={(e) => setNewMotor({ ...newMotor, color: e.target.value })} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select value={newMotor.type} onValueChange={(value) => setNewMotor({ ...newMotor, type: value })}>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dailyRate">Daily Rate (Rp) *</Label>
                        <Input id="dailyRate" type="number" placeholder="50000" value={newMotor.pricePerDay} onChange={(e) => setNewMotor({ ...newMotor, pricePerDay: e.target.value })} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="Central Office" value={newMotor.location} onChange={(e) => setNewMotor({ ...newMotor, location: e.target.value })} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Additional details about the motor..." rows={4} value={newMotor.description} onChange={(e) => setNewMotor({ ...newMotor, description: e.target.value })} />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1" style={{ backgroundColor: "#1ABC9C" }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Motor
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setNewMotor({
                            name: "",
                            plateNumber: "",
                            brand: "",
                            model: "",
                            year: new Date().getFullYear().toString(),
                            cc: "",
                            color: "",
                            type: "",
                            pricePerDay: "",
                            location: "Central Office",
                            description: "",
                          });
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>Track motor maintenance and service history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Motor</TableHead>
                        <TableHead>Plate Number</TableHead>
                        <TableHead>Last Service</TableHead>
                        <TableHead>Next Service</TableHead>
                        <TableHead>Odometer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Honda Beat</TableCell>
                        <TableCell>B 1234 ABC</TableCell>
                        <TableCell>Nov 15, 2025</TableCell>
                        <TableCell>Feb 15, 2026</TableCell>
                        <TableCell>12,450 km</TableCell>
                        <TableCell>
                          <Badge style={{ backgroundColor: "#1ABC9C" }}>Good</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Schedule Service
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Honda Scoopy</TableCell>
                        <TableCell>B 7890 MNO</TableCell>
                        <TableCell>Dec 1, 2025</TableCell>
                        <TableCell>Dec 8, 2025</TableCell>
                        <TableCell>8,900 km</TableCell>
                        <TableCell>
                          <Badge className="bg-orange-500">Due Soon</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Schedule Service
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
