"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Download,
  Calendar as CalendarIcon,
  DollarSign,
  User,
  CreditCard,
  Filter,
} from "lucide-react";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";

interface Donation {
  id: string;
  donorName: string | null;
  donorEmail: string;
  donorPhone: string | null;
  amount: number;
  currency: string;
  status: string;
  donationType: string;
  paymentReference: string;
  campaignId: string | null;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DonationStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalAmount: number;
}

export default function DonationsManagement() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [stats, setStats] = useState<DonationStats>({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchDonations();
  }, [statusFilter, startDate, endDate]);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());
      params.append("includeStats", "true");

      const response = await fetch(`/api/donations/list?${params}`);
      const result = await response.json();

      if (result.success) {
        setDonations(result.data);
        if (result.stats) {
          setStats(result.stats);
        }
      } else {
        console.error("Failed to fetch donations:", result.error);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.donorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.paymentReference
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const exportDonations = async (format: "csv" | "json" = "csv") => {
    try {
      setIsExporting(true);

      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());
      params.append("format", format);

      const response = await fetch(`/api/donations/export?${params}`);

      if (format === "csv") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        // Extract filename from response headers or generate one
        const startDateStr = startDate
          ? formatDate(startDate, "yyyy-MM-dd")
          : "all";
        const endDateStr = endDate ? formatDate(endDate, "yyyy-MM-dd") : "all";
        a.download = `cksi-donations-${startDateStr}-to-${endDateStr}.csv`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const result = await response.json();
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cksi-donations-${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting donations:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Donations</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Donations</h1>
          <p className="text-muted-foreground">
            Track and manage all donations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportDonations("json")}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={() => exportDonations("csv")} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Donations
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-primary">
                  ₦{stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search donations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      <div className="space-y-4">
        {filteredDonations.map((donation) => (
          <Card key={donation.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {donation.isAnonymous
                          ? "Anonymous"
                          : donation.donorName || "Unknown"}
                      </span>
                    </div>
                    <Badge
                      variant={
                        donation.status === "COMPLETED"
                          ? "default"
                          : donation.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {donation.status.toLowerCase()}
                    </Badge>
                    <Badge variant="outline">
                      {donation.donationType.replace("_", " ").toLowerCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {donation.donorEmail}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {donation.donorPhone || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Reference:</span>{" "}
                      {donation.paymentReference}
                    </div>
                  </div>
                  {donation.campaignId && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Campaign:</span>{" "}
                      {donation.campaignId}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ₦{Number(donation.amount).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {donation.currency}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDonations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No donations found</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all" || startDate || endDate
                ? "Try adjusting your search or filters"
                : "No donations have been made yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
