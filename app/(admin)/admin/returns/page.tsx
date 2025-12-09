"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertTriangle, Camera, FileText, Search } from "lucide-react";

const pendingReturns = [
  { id: "SJ-2025-00154", customer: "Bob Wilson", motor: "Honda PCX", plate: "B 6789 STU", returnDate: "Dec 8, 2025", status: "Due Today" },
  { id: "SJ-2025-00153", customer: "Alice Brown", motor: "Yamaha Aerox", plate: "B 3456 JKL", returnDate: "Dec 8, 2025", status: "Due Today" },
  { id: "SJ-2025-00089", customer: "John Doe", motor: "Yamaha NMAX", plate: "B 2345 PQR", returnDate: "Dec 9, 2025", status: "Upcoming" },
];

const inspectionChecklist = [
  { item: "Body Condition", checked: false },
  { item: "Headlight & Taillight", checked: false },
  { item: "Turn Signals", checked: false },
  { item: "Brake System", checked: false },
  { item: "Tire Condition", checked: false },
  { item: "Fuel Level", checked: false },
  { item: "Mirrors", checked: false },
  { item: "Seat & Storage", checked: false },
  { item: "Odometer Reading", checked: false },
  { item: "Engine Sound", checked: false },
];

export default function ReturnsInspectionPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 w-full lg:ml-64">
        <AdminHeader title="Return & Inspection Management" />

        <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">Pending Returns</TabsTrigger>
              <TabsTrigger value="inspection">Inspection Form</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-6">
              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Due Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      5
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Upcoming (7 days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#1ABC9C" }}>
                      12
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-500">2</div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Returns Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Returns</CardTitle>
                  <CardDescription>Motors scheduled for return</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search by booking ID or customer..." className="pl-10" />
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Motor</TableHead>
                        <TableHead>Plate Number</TableHead>
                        <TableHead>Return Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingReturns.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.customer}</TableCell>
                          <TableCell>{item.motor}</TableCell>
                          <TableCell>{item.plate}</TableCell>
                          <TableCell>{item.returnDate}</TableCell>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor: item.status === "Due Today" ? "#F59E0B" : "#1ABC9C",
                              }}
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" style={{ backgroundColor: "#1ABC9C" }}>
                              Start Inspection
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inspection" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Inspection Form */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Motor Inspection Form</CardTitle>
                    <CardDescription>Complete inspection checklist</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Booking Info */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Booking ID</p>
                          <p className="font-semibold">SJ-2025-00154</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-semibold">Bob Wilson</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Motor</p>
                          <p className="font-semibold">Honda PCX - B 6789 STU</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Return Date</p>
                          <p className="font-semibold">Dec 8, 2025</p>
                        </div>
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center">
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Inspection Checklist
                      </h3>
                      <div className="space-y-3">
                        {inspectionChecklist.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Checkbox id={`check-${idx}`} />
                            <label htmlFor={`check-${idx}`} className="flex-1 text-sm font-medium">
                              {item.item}
                            </label>
                            <Button variant="ghost" size="sm">
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Odometer */}
                    <div className="space-y-2">
                      <Label>Odometer Reading (km)</Label>
                      <Input type="number" placeholder="Enter current odometer reading" />
                    </div>

                    {/* Fuel Level */}
                    <div className="space-y-2">
                      <Label>Fuel Level</Label>
                      <div className="flex gap-2">
                        {["Empty", "1/4", "1/2", "3/4", "Full"].map((level) => (
                          <Button key={level} variant="outline" size="sm" className="flex-1">
                            {level}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Damage Report */}
                    <div className="space-y-2">
                      <Label>Damage / Issues Found</Label>
                      <Textarea placeholder="Describe any damage or issues found during inspection..." rows={4} />
                    </div>

                    {/* Additional Charges */}
                    <div className="space-y-2">
                      <Label>Additional Charges (if any)</Label>
                      <Input type="number" placeholder="Enter amount in Rupiah" />
                      <Textarea placeholder="Reason for additional charges..." rows={2} />
                    </div>

                    {/* Photos */}
                    <div className="space-y-2">
                      <Label>Upload Photos</Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Click to upload photos</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                      <Button className="flex-1" style={{ backgroundColor: "#1ABC9C" }}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Complete Inspection
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Save as Draft
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Inspection Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" style={{ backgroundColor: "#1ABC9C" }}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Pass Inspection
                    </Button>
                    <Button className="w-full" variant="outline">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Report Issues
                    </Button>
                    <Button className="w-full" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Inspection Tips</h4>
                      <ul className="text-sm space-y-2 text-gray-600">
                        <li>• Check all body panels for scratches</li>
                        <li>• Test all lights and signals</li>
                        <li>• Verify tire tread depth</li>
                        <li>• Check brake responsiveness</li>
                        <li>• Document any damage with photos</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inspection History</CardTitle>
                  <CardDescription>Past inspection records</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Motor</TableHead>
                        <TableHead>Inspector</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Dec 7, 2025</TableCell>
                        <TableCell className="font-medium">SJ-2025-00145</TableCell>
                        <TableCell>Honda Beat</TableCell>
                        <TableCell>Staff A</TableCell>
                        <TableCell>
                          <Badge style={{ backgroundColor: "#1ABC9C" }}>Passed</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dec 6, 2025</TableCell>
                        <TableCell className="font-medium">SJ-2025-00132</TableCell>
                        <TableCell>Yamaha Mio</TableCell>
                        <TableCell>Staff B</TableCell>
                        <TableCell>
                          <Badge className="bg-red-500">Issues Found</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
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
