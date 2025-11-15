// app/admin/volunteers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  VolunteerSubmission,
  VolunteerStatus,
  VolunteerCapacity,
  VolunteerMetrics,
} from "@/types/volunteer";
import {
  Search,
  Filter,
  Download,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerSubmission[]>([]);
  const [metrics, setMetrics] = useState<VolunteerMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVolunteers();
    fetchMetrics();
  }, [page, statusFilter, capacityFilter]);

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(capacityFilter !== "all" && { capacity: capacityFilter }),
      });

      const response = await fetch(`/api/volunteer?${params}`);
      const data = await response.json();

      if (data.success) {
        setVolunteers(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch volunteers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/volunteer/metrics");
      const data = await response.json();

      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const updateVolunteerStatus = async (
    id: string,
    newStatus: VolunteerStatus
  ) => {
    try {
      const response = await fetch(`/api/volunteer/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchVolunteers();
        fetchMetrics();
      }
    } catch (error) {
      console.error("Failed to update volunteer status:", error);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Phone",
        "State",
        "Country",
        "Capacity",
        "Status",
        "Created At",
      ],
      ...volunteers.map((v) => [
        v.name,
        v.email,
        v.phone,
        v.state,
        v.country,
        v.capacity,
        v.status,
        new Date(v.createdAt).toISOString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volunteers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredVolunteers = volunteers.filter((volunteer) =>
    searchTerm
      ? volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const getStatusBadge = (status: VolunteerStatus) => {
    const variants: Record<VolunteerStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      REVIEWED: "bg-blue-100 text-blue-800 border-blue-300",
      APPROVED: "bg-green-100 text-green-800 border-green-300",
      CONTACTED: "bg-purple-100 text-purple-800 border-purple-300",
      DECLINED: "bg-red-100 text-red-800 border-red-300",
    };

    return (
      <Badge className={`${variants[status]} border`} variant="outline">
        {status}
      </Badge>
    );
  };

  return (
    <div
      className="container mx-auto py-8 px-4"
      data-testid="admin-volunteers-page"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Volunteer Management</h1>
        <p className="text-muted-foreground">
          View and manage volunteer applications
        </p>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card data-testid="metric-total">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalSubmissions}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="metric-pending">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pendingReview}</div>
            </CardContent>
          </Card>

          <Card data-testid="metric-approved">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.approved}</div>
            </CardContent>
          </Card>

          <Card data-testid="metric-rate">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approval Rate
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalSubmissions > 0
                  ? Math.round(
                      (metrics.approved / metrics.totalSubmissions) * 100
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="volunteer-search-input"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-full md:w-[200px]"
                data-testid="status-filter"
              >
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.values(VolunteerStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger
                className="w-full md:w-[200px]"
                data-testid="capacity-filter"
              >
                <SelectValue placeholder="Filter by capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Capacities</SelectItem>
                {Object.values(VolunteerCapacity).map((capacity) => (
                  <SelectItem key={capacity} value={capacity}>
                    {capacity.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={volunteers.length === 0}
              data-testid="export-button"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No volunteers found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-testid="volunteers-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVolunteers.map((volunteer) => (
                    <TableRow
                      key={volunteer.id}
                      data-testid={`volunteer-row-${volunteer.id}`}
                    >
                      <TableCell className="font-medium">
                        {volunteer.name}
                      </TableCell>
                      <TableCell>{volunteer.email}</TableCell>
                      <TableCell>{volunteer.phone}</TableCell>
                      <TableCell>
                        {volunteer.state}, {volunteer.country}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {volunteer.capacity.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(volunteer.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={volunteer.status}
                          onValueChange={(value) =>
                            updateVolunteerStatus(
                              volunteer.id,
                              value as VolunteerStatus
                            )
                          }
                        >
                          <SelectTrigger
                            className="w-[130px]"
                            data-testid={`status-select-${volunteer.id}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(VolunteerStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  data-testid="pagination-prev"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  data-testid="pagination-next"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
