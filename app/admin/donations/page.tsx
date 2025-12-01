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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Use Table component for cleaner admin view
import { Search, Download, Filter, RefreshCcw } from "lucide-react";
import { format as formatDate } from "date-fns";

interface Donation {
  id: string;
  donorName: string | null;
  donorEmail: string;
  amount: number;
  currency: string;
  status: string;
  paymentReference: string;
  createdAt: string;
  isAnonymous: boolean;
}

interface Meta {
  total: number;
  total_raised: number;
  page: number;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    total_raised: 0,
    page: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`/api/donations/list?${params}`);
      const data = await res.json();
      if (data.success) {
        setDonations(data.data);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [statusFilter]);

  return (
    <div className="space-y-6 p-6 bg-gray-50/50 min-h-screen">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-green-600 font-bold">₦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{meta.total_raised.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime donations collected
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button size="sm" variant="outline" onClick={fetchDonations}>
              <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Donations</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Loading records...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      {formatDate(new Date(d.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {d.isAnonymous ? (
                        <span className="italic text-gray-500">Anonymous</span>
                      ) : (
                        d.donorName
                      )}
                    </TableCell>
                    <TableCell>{d.donorEmail}</TableCell>
                    <TableCell className="font-bold">
                      {d.currency === "USD"
                        ? "$"
                        : d.currency === "GBP"
                        ? "£"
                        : "₦"}
                      {d.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          d.status === "COMPLETED"
                            ? "default"
                            : d.status === "FAILED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-gray-500">
                      {d.paymentReference}
                    </TableCell>
                  </TableRow>
                ))}
                {donations.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
