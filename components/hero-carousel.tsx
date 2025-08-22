// components/hero-carousel.tsx - Gates Foundation style hero
"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroItem {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
}

interface HeroCarouselProps {
  items: HeroItem[];
  autoPlayInterval?: number;
}

export function HeroCarousel({
  items,
  autoPlayInterval = 8000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoPaused, setVideoPaused] = useState(false);

  const currentItem = items[currentIndex];

  // Auto-advance carousel
  useEffect(() => {
    if (!isPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, items.length, autoPlayInterval]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const togglePlayPause = () => {
    if (currentItem?.mediaType === "VIDEO") {
      setVideoPaused(!videoPaused);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  if (!items || items.length === 0) {
    return (
      <section className="relative h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to CKSI</h1>
          <p className="text-xl">
            Configure your hero content in the admin panel
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {currentItem?.mediaType === "VIDEO" ? (
          <video
            key={currentItem.id}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.7)" }}
          >
            <source src={currentItem.mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${currentItem?.mediaUrl})`,
              filter: "brightness(0.7)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {currentItem?.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              {currentItem?.description}
            </p>
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3"
              asChild
            >
              <a href={currentItem?.ctaLink}>{currentItem?.ctaText}</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col space-y-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrev}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            disabled={items.length <= 1}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            disabled={items.length <= 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            {(currentItem?.mediaType === "VIDEO" ? videoPaused : !isPlaying) ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
