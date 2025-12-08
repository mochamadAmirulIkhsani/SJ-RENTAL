"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Clock, CreditCard, Bell, Mail, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader title="System Settings" />

        <div className="p-8">
          <Tabs defaultValue="company" className="space-y-6">
            <TabsList>
              <TabsTrigger value="company">Company Info</TabsTrigger>
              <TabsTrigger value="operations">Operation Hours</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Company Information
                  </CardTitle>
                  <CardDescription>Update your business details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" defaultValue="SJRent Motor Rental" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessReg">Business Registration Number</Label>
                      <Input id="businessReg" defaultValue="1234567890123" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+62 123 4567 890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="info@sjrent.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea id="address" defaultValue="Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110, Indonesia" rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea id="description" placeholder="Brief description of your business..." rows={4} />
                  </div>

                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload logo</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Operation Hours
                  </CardTitle>
                  <CardDescription>Configure your business operating hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-32">
                        <span className="font-medium">{day}</span>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Opening Time</Label>
                          <Input type="time" defaultValue="08:00" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Closing Time</Label>
                          <Input type="time" defaultValue="18:00" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked={day !== "Sunday"} />
                        <Label className="text-sm">Open</Label>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Holiday Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Close on Public Holidays</p>
                          <p className="text-sm text-gray-600">Automatically close on national holidays</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">24/7 Emergency Support</p>
                          <p className="text-sm text-gray-600">Provide support outside business hours</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Save Changes</Button>
                    <Button variant="outline">Reset to Default</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Settings
                  </CardTitle>
                  <CardDescription>Configure payment methods and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Bank Transfer", enabled: true },
                        { name: "Credit Card", enabled: true },
                        { name: "E-Wallet (GoPay, OVO, Dana)", enabled: true },
                        { name: "Cash on Pickup", enabled: true },
                        { name: "Virtual Account", enabled: false },
                      ].map((method) => (
                        <div key={method.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <span className="font-medium">{method.name}</span>
                          <Switch defaultChecked={method.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Pricing Settings</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tax">Tax Rate (%)</Label>
                        <Input id="tax" type="number" defaultValue="10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deposit">Security Deposit (Rp)</Label>
                        <Input id="deposit" type="number" defaultValue="500000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lateFee">Late Return Fee (per hour)</Label>
                        <Input id="lateFee" type="number" defaultValue="25000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cancelFee">Cancellation Fee (Rp)</Label>
                        <Input id="cancelFee" type="number" defaultValue="50000" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Discount Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Weekly Rental Discount</p>
                          <p className="text-sm text-gray-600">10% off for 7+ days rental</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Monthly Rental Discount</p>
                          <p className="text-sm text-gray-600">20% off for 30+ days rental</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Configure notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center">
                      <Mail className="mr-2 h-5 w-5" />
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: "New Booking Created", desc: "Notify when a new booking is made", enabled: true },
                        { name: "Booking Confirmed", desc: "Send confirmation to customer", enabled: true },
                        { name: "Payment Received", desc: "Notify when payment is completed", enabled: true },
                        { name: "Return Reminder", desc: "Remind customer 1 day before return", enabled: true },
                        { name: "Motor Maintenance Due", desc: "Alert when maintenance is needed", enabled: true },
                      ].map((notif) => (
                        <div key={notif.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{notif.name}</p>
                            <p className="text-sm text-gray-600">{notif.desc}</p>
                          </div>
                          <Switch defaultChecked={notif.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Email Settings</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input id="smtpHost" defaultValue="smtp.gmail.com" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">SMTP Port</Label>
                          <Input id="smtpPort" defaultValue="587" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpUser">SMTP Username</Label>
                          <Input id="smtpUser" defaultValue="noreply@sjrent.com" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Save Changes</Button>
                    <Button variant="outline">Test Email</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    System Settings
                  </CardTitle>
                  <CardDescription>Configure general system preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="asia-jakarta">
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asia-jakarta">Asia/Jakarta (GMT+7)</SelectItem>
                          <SelectItem value="asia-singapore">Asia/Singapore (GMT+8)</SelectItem>
                          <SelectItem value="asia-tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Default Language</Label>
                      <Select defaultValue="id">
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">Bahasa Indonesia</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="idr">
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="idr">Indonesian Rupiah (IDR)</SelectItem>
                          <SelectItem value="usd">US Dollar (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select defaultValue="dd-mm-yyyy">
                        <SelectTrigger id="dateFormat">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">System Features</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Enable Customer Registration", enabled: true },
                        { name: "Allow Online Booking", enabled: true },
                        { name: "Enable Customer Reviews", enabled: true },
                        { name: "Automatic Booking Approval", enabled: false },
                        { name: "SMS Notifications", enabled: false },
                      ].map((feature) => (
                        <div key={feature.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <span className="font-medium">{feature.name}</span>
                          <Switch defaultChecked={feature.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4 text-red-600">Danger Zone</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-red-600 border-red-300">
                        Clear All Cache
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 border-red-300">
                        Reset to Factory Settings
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
