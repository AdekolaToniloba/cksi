// app/gallery/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Calendar,
  MapPin,
  Images,
  Play,
  ExternalLink,
  Filter,
} from "lucide-react";

interface GalleryEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  location: string | null;
  eventDate: string | null;
  coverImage: string | null;
  createdAt: string;
  mediaCount: number;
  imageCount: number;
  videoCount: number;
  featuredMedia: MediaItem[];
}

interface MediaItem {
  id: string;
  title: string | null;
  description: string | null;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  width: number | null;
  height: number | null;
  duration: number | null;
}

export default function GalleryPage() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "community", label: "Community" },
    { value: "events", label: "Events" },
    { value: "facilities", label: "Facilities" },
  ];

  useEffect(() => {
    fetchGalleryEvents();
  }, []);

  const fetchGalleryEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/gallery/events");

      if (!response.ok) {
        throw new Error("Failed to fetch gallery events");
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error: any) {
      console.error("Error fetching gallery events:", error);
      setError(error.message || "Failed to fetch gallery events");

      // Set demo data for development
      setEvents([
        {
          id: "1",
          title: "School Construction - Phase 1",
          slug: "school-construction-phase-1",
          description:
            "Building new classroom blocks in Lagos community to provide quality education for children",
          category: "education",
          location: "Lagos, Nigeria",
          eventDate: "2024-01-15T00:00:00Z",
          coverImage: "/placeholder.svg",
          createdAt: new Date().toISOString(),
          mediaCount: 25,
          imageCount: 20,
          videoCount: 5,
          featuredMedia: [
            {
              id: "1",
              title: "Foundation Work",
              description: "Laying the foundation for the new classroom",
              mediaUrl: "/placeholder.svg",
              mediaType: "IMAGE",
              width: 1920,
              height: 1080,
              duration: null,
            },
            {
              id: "2",
              title: "Construction Progress",
              description: "Timelapse of the construction process",
              mediaUrl: "/placeholder.svg",
              mediaType: "VIDEO",
              width: 1920,
              height: 1080,
              duration: 120,
            },
          ],
        },
        {
          id: "2",
          title: "Healthcare Outreach 2024",
          slug: "healthcare-outreach-2024",
          description:
            "Medical camp providing free healthcare services to underserved communities",
          category: "healthcare",
          location: "Abuja, Nigeria",
          eventDate: "2024-02-20T00:00:00Z",
          coverImage: "/placeholder.svg",
          createdAt: new Date().toISOString(),
          mediaCount: 18,
          imageCount: 15,
          videoCount: 3,
          featuredMedia: [],
        },
        {
          id: "3",
          title: "Clean Water Initiative",
          slug: "clean-water-initiative",
          description:
            "Installing water pumps and purification systems in rural communities",
          category: "community",
          location: "Kano, Nigeria",
          eventDate: "2024-03-10T00:00:00Z",
          coverImage: "/placeholder.svg",
          createdAt: new Date().toISOString(),
          mediaCount: 12,
          imageCount: 10,
          videoCount: 2,
          featuredMedia: [],
        },
      ]);
    } finally {
      setIsLoading(false);
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

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container py-24">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Impact in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Pictures
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our journey through photos and videos showcasing the lives
            we've touched and communities we've transformed across Nigeria.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
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
        </div>

        {error && (
          <div className="mb-8 text-center">
            <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Unable to load latest gallery events. Showing sample content.
              </p>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Showing {filteredEvents.length} event
            {filteredEvents.length !== 1 ? "s" : ""}
            {selectedCategory !== "all" && (
              <span>
                {" "}
                in {categories.find((c) => c.value === selectedCategory)?.label}
              </span>
            )}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={event.coverImage || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-black/70 text-white border-none"
                    >
                      {event.category}
                    </Badge>
                  </div>

                  {/* Media Count Overlay */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {event.imageCount > 0 && (
                      <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Images className="h-3 w-3" />
                        {event.imageCount}
                      </div>
                    )}
                    {event.videoCount > 0 && (
                      <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        {event.videoCount}
                      </div>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      View Gallery
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {event.eventDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.eventDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium text-primary">
                      {event.mediaCount} media items
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Images className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filter to see more results."
                  : "We're working on adding more gallery content. Check back soon!"}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory("all")}
                  >
                    Show all categories
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Event Detail Modal */}
        <Dialog
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedEvent.title}</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/gallery/${selectedEvent.slug}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Full Gallery
                      </Link>
                    </Button>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto">
                  {/* Cover Image */}
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={selectedEvent.coverImage || "/placeholder.svg"}
                      alt={selectedEvent.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Category
                      </div>
                      <Badge variant="secondary">
                        {selectedEvent.category}
                      </Badge>
                    </div>
                    {selectedEvent.eventDate && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Date
                        </div>
                        <div className="text-sm">
                          {new Date(
                            selectedEvent.eventDate
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {selectedEvent.location && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Location
                        </div>
                        <div className="text-sm">{selectedEvent.location}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Media
                      </div>
                      <div className="text-sm">
                        {selectedEvent.mediaCount} items
                      </div>
                    </div>
                  </div>

                  {selectedEvent.description && (
                    <div>
                      <h4 className="font-semibold mb-2">About this event</h4>
                      <p className="text-muted-foreground">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}

                  {/* Featured Media Preview */}
                  {selectedEvent.featuredMedia &&
                    selectedEvent.featuredMedia.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4">Featured Media</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedEvent.featuredMedia
                            .slice(0, 6)
                            .map((media) => (
                              <div
                                key={media.id}
                                className="relative aspect-square rounded overflow-hidden"
                              >
                                {media.mediaType === "IMAGE" ? (
                                  <Image
                                    src={media.mediaUrl}
                                    alt={media.title || "Media"}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-black flex items-center justify-center">
                                    <Play className="h-8 w-8 text-white" />
                                    {media.duration && (
                                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {formatDuration(media.duration)}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  <div className="pt-4 border-t">
                    <Button asChild className="w-full">
                      <Link href={`/gallery/${selectedEvent.slug}`}>
                        Explore Full Gallery ({selectedEvent.mediaCount} items)
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
