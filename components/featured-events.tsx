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
import { ArrowRight, MapPin } from "lucide-react";

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

      // Set demo data matching the new clean design
      setEvents([
        {
          id: "1",
          title: "School Construction Project",
          slug: "school-construction-phase-1",
          description: "Building new classroom blocks in Lagos community to provide quality education",
          category: "education",
          location: "Lagos, Nigeria",
          eventDate: "2024-01-15T00:00:00Z",
          coverImage: "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1764332576/cksi/events/general/images/1764332572814-IMG_0258.jpg",
          mediaCount: 25,
        },
        {
          id: "2",
          title: "Healthcare Outreach 2024",
          slug: "healthcare-outreach-2024",
          description: "Medical camp providing free healthcare services",
          category: "healthcare",
          location: "Abuja, Nigeria",
          eventDate: "2024-02-20T00:00:00Z",
          coverImage: "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1764332576/cksi/events/general/images/1764332572814-IMG_0258.jpg",
          mediaCount: 18,
        },
        {
          id: "3",
          title: "Clean Water Initiative",
          slug: "clean-water-initiative",
          description: "Installing water pumps in rural communities",
          category: "community",
          location: "Kano, Nigeria",
          eventDate: "2024-03-10T00:00:00Z",
          coverImage: "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1764332576/cksi/events/general/images/1764332572814-IMG_0258.jpg",
          mediaCount: 12,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <div className="text-center mb-12">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
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
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Section Header */}
        <div className="text-left mb-16 flex flex-col items-start">
          <span className="block text-[11px] sm:text-xs font-sans font-bold tracking-widest text-cksi-brand-red uppercase mb-4">
            LATEST UPDATES
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-cksi-dark tracking-tight">
            Latest Updates from CKSI
          </h2>
        </div>

        {/* Events Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-8">
              {events.map((event) => (
                <CarouselItem
                  key={event.id}
                  className="pl-4 sm:pl-8 md:basis-1/2 lg:basis-1/3"
                >
                  <Link
                    href={`/gallery/${event.slug}`}
                    className="block group h-full"
                    aria-label={`View ${event.title} gallery`}
                  >
                    <Card className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <Image
                          src={event.coverImage || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-cksi-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-white font-sans font-semibold">
                            <span>View Gallery</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-cksi-brand-red text-white text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1.5 rounded-md shadow-sm">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-sans font-bold text-cksi-dark mb-3 group-hover:text-cksi-brand-red transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-sans text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{event.location || "Nigeria"}</span>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-cksi-brand-red transition-colors group-hover:translate-x-1 transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12 border-gray-200 text-cksi-dark hover:text-cksi-brand-red hover:border-cksi-brand-red transition-colors" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-12 border-gray-200 text-cksi-dark hover:text-cksi-brand-red hover:border-cksi-brand-red transition-colors" />
          </Carousel>
        </div>

        {/* View All Button */}
        <div className="text-left mt-16">
          <Button 
            asChild 
            size="lg" 
            variant="outline"
            className="border-2 border-cksi-brand-red text-cksi-brand-red hover:bg-cksi-brand-red/5 rounded-full font-sans font-bold px-8 h-12 sm:h-14 group"
          >
            <Link href="/gallery">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
