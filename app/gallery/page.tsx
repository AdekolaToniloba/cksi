// app/gallery/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Images as ImagesIcon, Filter, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
}

export default function GalleryPage() {
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
          title: "School Construction Project",
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container py-24">
          <div className="text-center mb-16">
            <div className="h-12 bg-muted/50 rounded-lg w-64 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-muted/50 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted/50 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted/50 rounded w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-muted/50 rounded w-1/4 animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our Impact in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">
              Pictures
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our journey through photos and videos showcasing the lives
            we've touched across Nigeria
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[200px] h-11">
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
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 text-center"
          >
            <div className="inline-block bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                Unable to load latest gallery events. Showing sample content.
              </p>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-muted-foreground">
            {filteredEvents.length} event
            {filteredEvents.length !== 1 ? "s" : ""}
            {selectedCategory !== "all" && (
              <span>
                {" "}
                in {categories.find((c) => c.value === selectedCategory)?.label}
              </span>
            )}
          </p>
        </motion.div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    layout: { duration: 0.3 },
                  }}
                >
                  <Link href={`/gallery/${event.slug}`} className="block group">
                    <Card className="overflow-hidden h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <motion.div
                        className="relative aspect-[4/3] overflow-hidden bg-muted"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <Image
                          src={event.coverImage || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

                        {/* Media Count Badge */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-2 font-medium"
                        >
                          <ImagesIcon className="h-4 w-4" />
                          {event.mediaCount}
                        </motion.div>

                        {/* Hover overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 text-white font-medium text-lg"
                          >
                            <span>View Gallery</span>
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                        </motion.div>

                        {/* Category Badge at bottom */}
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-white/95 dark:bg-black/95 backdrop-blur-sm text-foreground text-xs px-3 py-1.5 rounded-full font-medium capitalize">
                            {event.category}
                          </span>
                        </div>
                      </motion.div>

                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {event.location || "Nigeria"}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <ImagesIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
