"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
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
import { Bike, Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";

const motors = [
  { id: "M001", name: "Honda Beat", brand: "Honda", model: "Beat", year: "2023", cc: "110cc", plate: "B 1234 ABC", color: "Red", price: "50,000", status: "Available" },
  { id: "M002", name: "Yamaha Mio", brand: "Yamaha", model: "Mio M3", year: "2023", cc: "125cc", plate: "B 5678 DEF", color: "Blue", price: "55,000", status: "Rented" },
  { id: "M003", name: "Honda Vario 160", brand: "Honda", model: "Vario 160", year: "2024", cc: "160cc", plate: "B 9012 GHI", color: "Black", price: "65,000", status: "Available" },
  { id: "M004", name: "Yamaha Aerox", brand: "Yamaha", model: "Aerox 155", year: "2024", cc: "155cc", plate: "B 3456 JKL", color: "White", price: "70,000", status: "Rented" },
  { id: "M005", name: "Honda Scoopy", brand: "Honda", model: "Scoopy", year: "2023", cc: "110cc", plate: "B 7890 MNO", color: "Pink", price: "48,000", status: "Maintenance" },
];

export default function InventoryPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader title="Motor Inventory Management" />

        <div className="p-8">
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Motor List</TabsTrigger>
              <TabsTrigger value="add">Add New Motor</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Motors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      48
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#1ABC9C" }}>
                      25
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">In Use</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">18</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-500">5</div>
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
                      <Input placeholder="Search..." className="pl-10" />
                    </div>
                    <Select>
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
                    <Select>
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
                    <Select>
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
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Apply Filters</Button>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button style={{ backgroundColor: "#1ABC9C" }}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Motor
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Motor Details</DialogTitle>
                          <DialogDescription>View complete motor information</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Motor ID</p>
                              <p className="font-semibold">M001</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Status</p>
                              <Badge style={{ backgroundColor: "#1ABC9C" }}>Available</Badge>
                            </div>
                          </div>
                          <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Bike className="h-20 w-20 text-gray-400" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Brand & Model</p>
                              <p className="font-semibold">Honda Beat</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Year</p>
                              <p className="font-semibold">2023</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Engine</p>
                              <p className="font-semibold">110cc</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Plate Number</p>
                              <p className="font-semibold">B 1234 ABC</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Color</p>
                              <p className="font-semibold">Red</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Daily Rate</p>
                              <p className="font-semibold">Rp 50,000</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Motor ID</TableHead>
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
                      {motors.map((motor) => (
                        <TableRow key={motor.id}>
                          <TableCell className="font-medium">{motor.id}</TableCell>
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
                          <TableCell>{motor.brand}</TableCell>
                          <TableCell>{motor.plate}</TableCell>
                          <TableCell>{motor.year}</TableCell>
                          <TableCell className="font-semibold">Rp {motor.price}</TableCell>
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
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Select>
                          <SelectTrigger id="brand">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="honda">Honda</SelectItem>
                            <SelectItem value="yamaha">Yamaha</SelectItem>
                            <SelectItem value="suzuki">Suzuki</SelectItem>
                            <SelectItem value="kawasaki">Kawasaki</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input id="model" placeholder="e.g., Beat, Vario" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" type="number" placeholder="2024" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cc">Engine CC</Label>
                        <Input id="cc" placeholder="110cc" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="plate">Plate Number</Label>
                        <Input id="plate" placeholder="B 1234 ABC" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" placeholder="Red" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dailyRate">Daily Rate (Rp)</Label>
                        <Input id="dailyRate" type="number" placeholder="50000" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Additional details about the motor..." rows={4} />
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Photos</Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Bike className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Click to upload motor photos</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button className="flex-1" style={{ backgroundColor: "#1ABC9C" }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Motor
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Cancel
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
