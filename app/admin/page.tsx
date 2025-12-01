// cksi/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Users,
  ImageIcon,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface DashboardStats {
  blogPosts: number;
  programs: number;
  galleryItems: number;
  donations: number;
  totalDonations: number;
  recentDonations: RecentDonation[];
}

interface RecentDonation {
  id: string;
  donorName: string | null;
  amount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    blogPosts: 0,
    programs: 0,
    galleryItems: 0,
    donations: 0,
    totalDonations: 0,
    recentDonations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all stats from our API endpoints
      const [
        blogResponse,
        programsResponse,
        galleryResponse,
        donationsResponse,
      ] = await Promise.all([
        fetch("/api/admin/stats/blog"),
        fetch("/api/admin/stats/programs"),
        fetch("/api/admin/stats/gallery"),
        fetch("/api/admin/stats/donations"),
      ]);

      if (
        !blogResponse.ok ||
        !programsResponse.ok ||
        !galleryResponse.ok ||
        !donationsResponse.ok
      ) {
        throw new Error("Failed to fetch dashboard statistics");
      }

      const [blogStats, programStats, galleryStats, donationStats] =
        await Promise.all([
          blogResponse.json(),
          programsResponse.json(),
          galleryResponse.json(),
          donationsResponse.json(),
        ]);

      setStats({
        blogPosts: blogStats.count || 0,
        programs: programStats.count || 0,
        galleryItems: galleryStats.count || 0,
        donations: donationStats.count || 0,
        totalDonations: donationStats.totalAmount || 0,
        recentDonations: donationStats.recent || [],
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      setError(error.message || "Failed to connect to database");

      // Set demo data for preview when there's an error
      setStats({
        blogPosts: 4,
        programs: 8,
        galleryItems: 12,
        donations: 25,
        totalDonations: 1250000,
        recentDonations: [
          {
            id: "1",
            donorName: "Anonymous",
            amount: 50000,
            status: "COMPLETED",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            donorName: "John Doe",
            amount: 25000,
            status: "COMPLETED",
            createdAt: new Date().toISOString(),
          },
          {
            id: "3",
            donorName: "Jane Smith",
            amount: 15000,
            status: "PENDING",
            createdAt: new Date().toISOString(),
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session?.user) {
    return null;
  }

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
    );
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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Database Connection Error:</strong> {error}
            <br />
            <span className="text-sm mt-2 block">
              Please ensure your Neon database connection is properly
              configured:
              <br />• DATABASE_URL in .env.local
              <br />• Prisma client is generated: npx prisma generate
              <br />• Database is accessible: npx prisma db push
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
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
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
              <span className="text-sm text-muted-foreground">
                Total Donations
              </span>
              <span className="font-semibold">{stats.donations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Active Programs
              </span>
              <span className="font-semibold">{stats.programs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Published Posts
              </span>
              <span className="font-semibold">{stats.blogPosts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Gallery Photos
              </span>
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
                {stats.recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {donation.donorName || "Anonymous"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₦{donation.amount.toLocaleString()}
                      </p>
                      <p
                        className={`text-xs ${
                          donation.status === "COMPLETED"
                            ? "text-green-600"
                            : donation.status === "PENDING"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {donation.status.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {error
                  ? "Demo data shown - connect database to see real donations"
                  : "No recent donations"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
