"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Search, Download, Calendar, DollarSign, User, CreditCard } from "lucide-react"

export default function DonationsManagement() {
  const [donations, setDonations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalAmount: 0,
  })

  useEffect(() => {
    fetchDonations()
    fetchStats()
  }, [])

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setDonations(data || [])
    } catch (error) {
      console.error("Error fetching donations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { count: total } = await supabase.from("donations").select("*", { count: "exact", head: true })

      const { count: completed } = await supabase
        .from("donations")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")

      const { count: pending } = await supabase
        .from("donations")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      const { data: completedDonations } = await supabase.from("donations").select("amount").eq("status", "completed")

      const totalAmount = completedDonations?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0

      setStats({
        total: total || 0,
        completed: completed || 0,
        pending: pending || 0,
        totalAmount,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const filteredDonations = donations.filter((donation) => {
    const matchesStatus = statusFilter === "all" || donation.status === statusFilter
    const matchesSearch =
      donation.donor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.donor_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.payment_reference.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const exportDonations = () => {
    const csvContent = [
      ["Date", "Donor Name", "Email", "Amount", "Status", "Reference"].join(","),
      ...filteredDonations.map((donation) =>
        [
          new Date(donation.created_at).toLocaleDateString(),
          donation.donor_name || "Anonymous",
          donation.donor_email,
          donation.amount,
          donation.status,
          donation.payment_reference,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `donations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Donations</h1>
          <p className="text-muted-foreground">Track and manage all donations</p>
        </div>
        <Button onClick={exportDonations}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
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
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">₦{stats.totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search donations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
                        {donation.is_anonymous ? "Anonymous" : donation.donor_name || "Unknown"}
                      </span>
                    </div>
                    <Badge
                      variant={
                        donation.status === "completed"
                          ? "default"
                          : donation.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {donation.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Email:</span> {donation.donor_email}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ₦{Number(donation.amount).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(donation.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Reference:</span> {donation.payment_reference}
                    </div>
                  </div>
                  {donation.campaign_id && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Campaign:</span> {donation.campaign_id}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">₦{Number(donation.amount).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{donation.currency}</div>
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
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "No donations have been made yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
