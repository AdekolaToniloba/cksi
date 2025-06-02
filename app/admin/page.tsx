"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { FileText, Users, ImageIcon, DollarSign, TrendingUp, Calendar, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    programs: 0,
    galleryItems: 0,
    donations: 0,
    totalDonations: 0,
    recentDonations: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Test Supabase connection first
        const { data: testData, error: testError } = await supabase
          .from("admin_users")
          .select("count", { count: "exact", head: true })

        if (testError) {
          throw new Error("Supabase connection failed. Please check your environment variables.")
        }

        // Fetch blog posts count
        const { count: blogCount } = await supabase.from("blog_posts").select("*", { count: "exact", head: true })

        // Fetch programs count
        const { count: programsCount } = await supabase.from("programs").select("*", { count: "exact", head: true })

        // Fetch gallery items count
        const { count: galleryCount } = await supabase.from("gallery_items").select("*", { count: "exact", head: true })

        // Fetch donations stats
        const { count: donationsCount } = await supabase.from("donations").select("*", { count: "exact", head: true })

        // Fetch total donation amount
        const { data: donationSum } = await supabase.from("donations").select("amount").eq("status", "completed")

        const totalAmount = donationSum?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0

        // Fetch recent donations
        const { data: recentDonations } = await supabase
          .from("donations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        setStats({
          blogPosts: blogCount || 0,
          programs: programsCount || 0,
          galleryItems: galleryCount || 0,
          donations: donationsCount || 0,
          totalDonations: totalAmount,
          recentDonations: recentDonations || [],
        })
      } catch (error: any) {
        console.error("Error fetching stats:", error)
        setError(error.message || "Failed to connect to database")

        // Set demo data for preview
        setStats({
          blogPosts: 4,
          programs: 8,
          galleryItems: 12,
          donations: 25,
          totalDonations: 1250000,
          recentDonations: [
            {
              id: 1,
              donor_name: "Anonymous",
              amount: 50000,
              status: "completed",
              created_at: new Date().toISOString(),
            },
            { id: 2, donor_name: "John Doe", amount: 25000, status: "completed", created_at: new Date().toISOString() },
            { id: 3, donor_name: "Jane Smith", amount: 15000, status: "pending", created_at: new Date().toISOString() },
          ],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  const statCards = [
    {
      title: "Blog Posts",
      value: stats.blogPosts,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Programs",
      value: stats.programs,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Gallery Items",
      value: stats.galleryItems,
      icon: ImageIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Donations",
      value: `₦${stats.totalDonations.toLocaleString()}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to the CKSI admin dashboard</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Database Connection Error:</strong> {error}
            <br />
            <span className="text-sm mt-2 block">
              Please ensure your Supabase environment variables are properly configured:
              <br />• NEXT_PUBLIC_SUPABASE_URL
              <br />• NEXT_PUBLIC_SUPABASE_ANON_KEY
              <br />• SUPABASE_SERVICE_ROLE_KEY
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Donations</span>
              <span className="font-semibold">{stats.donations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Programs</span>
              <span className="font-semibold">{stats.programs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Published Posts</span>
              <span className="font-semibold">{stats.blogPosts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gallery Photos</span>
              <span className="font-semibold">{stats.galleryItems}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentDonations.length > 0 ? (
              <div className="space-y-3">
                {stats.recentDonations.map((donation: any, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{donation.donor_name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₦{Number(donation.amount).toLocaleString()}</p>
                      <p
                        className={`text-xs ${
                          donation.status === "completed"
                            ? "text-green-600"
                            : donation.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {donation.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {error ? "Demo data shown - connect database to see real donations" : "No recent donations"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
