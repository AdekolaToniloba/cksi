// components/featured-events.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Images, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface GalleryEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  location: string | null;
  eventDate: string | null;
  coverImage: string | null;
  mediaCount: number;
  imageCount: number;
  videoCount: number;
}

interface FeaturedEventsProps {
  limit?: number;
}

export function FeaturedEvents({ limit = 6 }: FeaturedEventsProps) {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/gallery/events");

      if (!response.ok) {
        throw new Error("Failed to fetch gallery events");
      }

      const data = await response.json();
      const featuredEvents = (data.events || [])
        .sort(
          (a: GalleryEvent, b: GalleryEvent) =>
            new Date(b.eventDate || 0).getTime() -
            new Date(a.eventDate || 0).getTime()
        )
        .slice(0, limit);

      setEvents(featuredEvents);
    } catch (error) {
      console.error("Error fetching featured events:", error);
      setError("Failed to load events");

      // Set demo data
      setEvents([
        {
          id: "1",
          title: "School Construction Project",
          slug: "school-construction-phase-1",
          description:
            "Building new classroom blocks in Lagos community to provide quality education",
          category: "education",
          location: "Lagos, Nigeria",
          eventDate: "2024-01-15T00:00:00Z",
          coverImage: "/placeholder.svg",
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
          mediaCount: 12,
          imageCount: 10,
          videoCount: 2,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section
        className="py-24 bg-muted/30"
        aria-labelledby="featured-events-heading"
      >
        <div className="container">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted rounded-lg w-64 mx-auto mb-6 animate-pulse" />
            <div className="h-6 bg-muted rounded-lg w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-3 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0 && !error) {
    return null;
  }

  return (
    <section
      className="py-24 bg-muted/30"
      aria-labelledby="featured-events-heading"
      data-testid="featured-events-section"
    >
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="featured-events-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">
              Events
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Witness the transformative work happening across Nigeria
          </p>
        </motion.div>

        {/* Events Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
          data-testid="featured-events-carousel"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {events.map((event, index) => (
                <CarouselItem
                  key={event.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                  data-testid={`featured-event-${event.id}`}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                  >
                    <Link
                      href={`/gallery/${event.slug}`}
                      className="block group"
                      aria-label={`View ${event.title} gallery`}
                    >
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
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-2 font-medium"
                          >
                            <Images className="h-4 w-4" />
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

                          {/* Category Badge */}
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className="hidden md:flex -left-4 lg:-left-12"
              aria-label="Previous events"
            />
            <CarouselNext
              className="hidden md:flex -right-4 lg:-right-12"
              aria-label="Next events"
            />
          </Carousel>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
          data-testid="view-all-events"
        >
          <Button asChild size="lg" className="group">
            <Link href="/gallery">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
