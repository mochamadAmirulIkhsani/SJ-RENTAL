"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Plus, Edit, Trash2, Users } from "lucide-react";

const users = [
  { id: "U001", name: "Admin User", email: "admin@sjrent.com", role: "Super Admin", status: "Active", lastLogin: "Dec 8, 2025" },
  { id: "U002", name: "Manager User", email: "manager@sjrent.com", role: "Manager", status: "Active", lastLogin: "Dec 8, 2025" },
  { id: "U003", name: "Staff A", email: "staffa@sjrent.com", role: "Staff", status: "Active", lastLogin: "Dec 7, 2025" },
  { id: "U004", name: "Staff B", email: "staffb@sjrent.com", role: "Staff", status: "Active", lastLogin: "Dec 7, 2025" },
  { id: "U005", name: "Viewer User", email: "viewer@sjrent.com", role: "Viewer", status: "Inactive", lastLogin: "Nov 30, 2025" },
];

const roles = [
  { name: "Super Admin", users: 2, description: "Full system access" },
  { name: "Manager", users: 3, description: "Manage operations" },
  { name: "Staff", users: 8, description: "Handle bookings & returns" },
  { name: "Viewer", users: 5, description: "View-only access" },
];

const permissions = {
  dashboard: { label: "Dashboard", modules: ["View Dashboard", "View Analytics"] },
  bookings: { label: "Bookings", modules: ["View Bookings", "Create Booking", "Edit Booking", "Delete Booking", "Approve Booking"] },
  motors: { label: "Motors", modules: ["View Motors", "Add Motor", "Edit Motor", "Delete Motor"] },
  customers: { label: "Customers", modules: ["View Customers", "Edit Customer", "Delete Customer"] },
  reports: { label: "Reports", modules: ["View Reports", "Generate Reports", "Export Reports"] },
  settings: { label: "Settings", modules: ["View Settings", "Edit Settings"] },
  users: { label: "Users", modules: ["View Users", "Add User", "Edit User", "Delete User", "Manage Roles"] },
};

export default function UsersRolesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader title="User & Role Management" />

        <div className="p-8">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions Matrix</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      18
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#1ABC9C" }}>
                      13
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Roles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      4
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Pending Invites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">2</div>
                  </CardContent>
                </Card>
              </div>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>System Users</CardTitle>
                      <CardDescription>Manage user accounts and access</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button style={{ backgroundColor: "#1ABC9C" }}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>Create a new user account</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john@sjrent.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <select className="w-full border rounded-md p-2">
                              <option>Super Admin</option>
                              <option>Manager</option>
                              <option>Staff</option>
                              <option>Viewer</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Temporary Password</Label>
                            <Input id="password" type="password" placeholder="Enter password" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="sendEmail" />
                            <label htmlFor="sendEmail" className="text-sm">
                              Send welcome email with login credentials
                            </label>
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button className="flex-1" style={{ backgroundColor: "#1ABC9C" }}>
                              Create User
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Cancel
                            </Button>
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
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1ABC9C" }}>
                                <Users className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor: user.status === "Active" ? "#1ABC9C" : "#6B7280",
                              }}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
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

            <TabsContent value="roles" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>System Roles</CardTitle>
                      <CardDescription>Define and manage user roles</CardDescription>
                    </div>
                    <Button style={{ backgroundColor: "#1ABC9C" }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Role
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {roles.map((role) => (
                      <Card key={role.name}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1ABC9C" }}>
                                <Shield className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{role.name}</CardTitle>
                                <CardDescription>{role.description}</CardDescription>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{role.users} users</span>
                            <Button variant="outline" size="sm">
                              View Permissions
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Permissions Matrix</CardTitle>
                  <CardDescription>Configure role-based permissions for each module</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(permissions).map(([key, section]) => (
                      <div key={key} className="border rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                          <Shield className="mr-2 h-5 w-5" style={{ color: "#1ABC9C" }} />
                          {section.label}
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-64">Permission</TableHead>
                              <TableHead className="text-center">Super Admin</TableHead>
                              <TableHead className="text-center">Manager</TableHead>
                              <TableHead className="text-center">Staff</TableHead>
                              <TableHead className="text-center">Viewer</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {section.modules.map((module) => (
                              <TableRow key={module}>
                                <TableCell className="font-medium">{module}</TableCell>
                                <TableCell className="text-center">
                                  <Checkbox defaultChecked />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox defaultChecked={!module.includes("Delete")} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox defaultChecked={module.includes("View") || module.includes("Create")} />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox defaultChecked={module.includes("View")} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline">Reset to Default</Button>
                    <Button style={{ backgroundColor: "#1ABC9C" }}>Save Changes</Button>
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
