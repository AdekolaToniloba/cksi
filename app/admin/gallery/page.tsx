"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  AlertTriangle,
  Images,
  Play,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GalleryEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  location: string | null;
  eventDate: string | null;
  coverImage: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  mediaCount: number;
  imageCount: number;
  videoCount: number;
}

export default function EventGalleryManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "community", label: "Community" },
    { value: "events", label: "Events" },
    { value: "facilities", label: "Facilities" },
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchEvents();
    }
  }, [session]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/admin/gallery/events", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError(error.message || "Failed to fetch events");

      // Set demo data for preview
      setEvents([
        {
          id: "1",
          title: "School Construction - Phase 1",
          slug: "school-construction-phase-1",
          description: "Building new classroom blocks in Lagos community",
          category: "education",
          location: "Lagos, Nigeria",
          eventDate: "2024-01-15T00:00:00Z",
          coverImage: "/placeholder.svg",
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mediaCount: 25,
          imageCount: 20,
          videoCount: 5,
        },
        {
          id: "2",
          title: "Healthcare Outreach 2024",
          slug: "healthcare-outreach-2024",
          description: "Medical camp providing free healthcare services",
          category: "healthcare",
          location: "Abuja, Nigeria",
          eventDate: "2024-02-20T00:00:00Z",
          coverImage: "/placeholder.svg",
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mediaCount: 18,
          imageCount: 15,
          videoCount: 3,
        },
        {
          id: "3",
          title: "Clean Water Initiative",
          slug: "clean-water-initiative",
          description: "Installing water pumps in rural communities",
          category: "community",
          location: "Kano, Nigeria",
          eventDate: "2024-03-10T00:00:00Z",
          coverImage: "/placeholder.svg",
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mediaCount: 12,
          imageCount: 10,
          videoCount: 2,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this event and all its media? This action cannot be undone."
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/gallery/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Remove from local state
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error: any) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event status");
      }

      // Update local state
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, isPublished: !currentStatus } : event
        )
      );
    } catch (error: any) {
      console.error("Error updating event status:", error);
      alert("Failed to update event status. Please try again.");
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gallery Events</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="aspect-video bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
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
          <h1 className="text-2xl font-bold">Gallery Events</h1>
          <p className="text-muted-foreground">
            Manage photo and video collections by event
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/gallery/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
            <br />
            <span className="text-sm mt-1 block">
              Showing demo data. Please check your database connection and API
              endpoints.
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-video">
              <Image
                src={event.coverImage || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />

              {/* Status and Category Badges */}
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="secondary">{event.category}</Badge>
                {!event.isPublished && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Draft
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/admin/gallery/events/edit/${event.id}`}>
                    <Edit className="h-3 w-3" />
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Media Count Overlay */}
              <div className="absolute bottom-2 right-2 flex gap-2">
                {event.imageCount > 0 && (
                  <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Images className="h-3 w-3" />
                    {event.imageCount}
                  </div>
                )}
                {event.videoCount > 0 && (
                  <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    {event.videoCount}
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePublished(event.id, event.isPublished)}
                  className={`ml-2 ${
                    event.isPublished ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {event.isPublished ? "Published" : "Draft"}
                </Button>
              </div>

              {event.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="space-y-2 text-sm text-muted-foreground">
                {event.eventDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.eventDate).toLocaleDateString()}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/admin/gallery/events/${event.id}`}>
                    View Media ({event.mediaCount})
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/gallery/events/${event.id}/upload`}>
                    <Plus className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filter"
                : "Get started by creating your first gallery event"}
            </p>
            <Button asChild>
              <Link href="/admin/gallery/events/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
