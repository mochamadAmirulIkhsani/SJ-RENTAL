"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { FileText, Download, TrendingUp, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const reportTypes = [
  { value: "revenue", label: "Revenue Report", icon: DollarSign },
  { value: "bookings", label: "Booking Report", icon: FileText },
  { value: "motors", label: "Motor Utilization Report", icon: TrendingUp },
  { value: "customers", label: "Customer Analysis Report", icon: FileText },
];

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader title="Reports Module" />

        <div className="p-8">
          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList>
              <TabsTrigger value="generate">Generate Reports</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              <TabsTrigger value="history">Report History</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Report Generator */}
                <Card>
                  <CardHeader>
                    <CardTitle>Generate New Report</CardTitle>
                    <CardDescription>Create custom reports for your business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="yesterday">Yesterday</SelectItem>
                          <SelectItem value="this-week">This Week</SelectItem>
                          <SelectItem value="last-week">Last Week</SelectItem>
                          <SelectItem value="this-month">This Month</SelectItem>
                          <SelectItem value="last-month">Last Month</SelectItem>
                          <SelectItem value="this-year">This Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Excel
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full" style={{ backgroundColor: "#1ABC9C" }}>
                        <Download className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Statistics</CardTitle>
                      <CardDescription>Overview of key metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Total Revenue (Month)</p>
                          <p className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                            Rp 45.2M
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1ABC9C" }}>
                          <DollarSign className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Total Bookings (Month)</p>
                          <p className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                            156
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1ABC9C" }}>
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Average Utilization</p>
                          <p className="text-2xl font-bold" style={{ color: "#0A2540" }}>
                            72%
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1ABC9C" }}>
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Select Custom Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Report Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Report Templates</CardTitle>
                  <CardDescription>Pre-configured report templates for quick access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {reportTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div key={type.value} className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#1ABC9C" }}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold mb-2">{type.label}</h3>
                          <Button variant="outline" size="sm" className="w-full mt-4">
                            Generate
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Scheduled Reports</CardTitle>
                      <CardDescription>Automated report generation schedule</CardDescription>
                    </div>
                    <Button style={{ backgroundColor: "#1ABC9C" }}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      New Schedule
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Next Run</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Monthly Revenue Report</TableCell>
                        <TableCell>Revenue</TableCell>
                        <TableCell>Monthly</TableCell>
                        <TableCell>admin@sjrent.com</TableCell>
                        <TableCell>Jan 1, 2026</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: "#1ABC9C", color: "white" }}>
                            Active
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Weekly Booking Summary</TableCell>
                        <TableCell>Bookings</TableCell>
                        <TableCell>Weekly</TableCell>
                        <TableCell>admin@sjrent.com</TableCell>
                        <TableCell>Dec 15, 2025</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: "#1ABC9C", color: "white" }}>
                            Active
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Report History</CardTitle>
                      <CardDescription>Previously generated reports</CardDescription>
                    </div>
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="bookings">Bookings</SelectItem>
                        <SelectItem value="motors">Motor Utilization</SelectItem>
                        <SelectItem value="customers">Customer Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date Range</TableHead>
                        <TableHead>Generated</TableHead>
                        <TableHead>Generated By</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Revenue Report - November 2025</TableCell>
                        <TableCell>Revenue</TableCell>
                        <TableCell>Nov 1 - Nov 30, 2025</TableCell>
                        <TableCell>Dec 1, 2025</TableCell>
                        <TableCell>Admin User</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Booking Summary - Week 48</TableCell>
                        <TableCell>Bookings</TableCell>
                        <TableCell>Nov 25 - Dec 1, 2025</TableCell>
                        <TableCell>Dec 2, 2025</TableCell>
                        <TableCell>Admin User</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Motor Utilization - Q4 2025</TableCell>
                        <TableCell>Motor Utilization</TableCell>
                        <TableCell>Oct 1 - Dec 31, 2025</TableCell>
                        <TableCell>Dec 5, 2025</TableCell>
                        <TableCell>Admin User</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
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
