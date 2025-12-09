"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, Eye, Mail, Plus, Trash2, Edit, Loader2 } from "lucide-react";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  totalBookings?: number;
  activeBookings?: number;
}

interface Stats {
  totalCustomers: number;
  activeCustomers: number;
  totalAdmins: number;
  totalUsers: number;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCustomers: 0, activeCustomers: 0, totalAdmins: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form state for adding new user
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "CUSTOMER",
  });

  const [tempPassword, setTempPassword] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      // Always filter for customer role only
      params.append("role", "customer");

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when items per page changes
  }, [itemsPerPage]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create user");
        return;
      }

      setTempPassword(data.temporaryPassword);
      alert(`User created successfully!\n\nTemporary Password: ${data.temporaryPassword}\n\nPlease save this password.`);
      setNewUser({ email: "", name: "", role: "CUSTOMER" });
      setIsAddDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete user");
        return;
      }

      alert("User deleted successfully");
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 w-full lg:ml-64">
        <AdminHeader title="Customer Management" />

        <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">User List</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4 sm:space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalCustomers}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#1ABC9C" }}>
                      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.activeCustomers}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Admins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">{loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalAdmins}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: "#0A2540" }}>
                      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalUsers}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search & Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search by name or email..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Users</CardTitle>
                      <CardDescription>Manage users and customers</CardDescription>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button style={{ backgroundColor: "#1ABC9C" }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>Create a new user account. A temporary password will be generated.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddUser} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="user@example.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CUSTOMER">Customer</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" style={{ backgroundColor: "#1ABC9C" }}>
                              Create User
                            </Button>
                          </div>
                        </form>
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
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Total Bookings</TableHead>
                              <TableHead>Active Bookings</TableHead>
                              <TableHead>Joined</TableHead>
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
                            ) : !users || users.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                  No users found
                                </TableCell>
                              </TableRow>
                            ) : (
                              currentUsers.map((user, index) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">{indexOfFirstItem + index + 1}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: user.role === "ADMIN" ? "#F59E0B" : "#1ABC9C" }}>
                                        <Users className="h-4 w-4 text-white" />
                                      </div>
                                      <span className="font-medium">{user.name || "-"}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">{user.email}</div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge style={{ backgroundColor: user.role === "ADMIN" ? "#F59E0B" : "#1ABC9C" }}>{user.role}</Badge>
                                  </TableCell>
                                  <TableCell>{user.totalBookings || 0}</TableCell>
                                  <TableCell>{user.activeBookings || 0}</TableCell>
                                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setIsDetailDialogOpen(true);
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setUserToDelete(user);
                                          setIsDeleteDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
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
                  {!loading && users.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border-t">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} users
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

                  {/* Detail Dialog */}
                  <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                      </DialogHeader>
                      {selectedUser && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">User ID</p>
                              <p className="font-semibold">{selectedUser.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Role</p>
                              <Badge style={{ backgroundColor: selectedUser.role === "ADMIN" ? "#F59E0B" : "#1ABC9C" }}>{selectedUser.role}</Badge>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Name</p>
                              <p className="font-semibold">{selectedUser.name || "-"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-semibold">{selectedUser.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Bookings</p>
                              <p className="font-semibold">{selectedUser.totalBookings || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Active Bookings</p>
                              <p className="font-semibold">{selectedUser.activeBookings || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Joined</p>
                              <p className="font-semibold">{formatDate(selectedUser.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Delete Dialog */}
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.</DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-4 justify-end">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button style={{ backgroundColor: "#EF4444" }} onClick={handleDeleteUser}>
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
