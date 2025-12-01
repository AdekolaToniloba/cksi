// components/hero-carousel.tsx - Gates Foundation style hero
"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUp, ArrowDown, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { HeroCarousel as HeroCarouselType } from "@/types";

interface HeroCarouselProps {
  items: HeroCarouselType[];
  autoPlayInterval?: number;
}

export function HeroCarousel({
  items,
  autoPlayInterval = 8000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initial load animation trigger
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying, items.length, autoPlayInterval]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Handlers
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    // Optional: Pause autoplay temporarily on user interaction
  };

  if (!items || items.length === 0) {
    return (
      <section className="relative h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="text-white/50 text-center">
          <p>No hero items configured.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-950">
      {/* 1. Background Slides with Transitions */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }} // Crossfade transition
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          {items[currentIndex].mediaType === "VIDEO" ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={items[currentIndex].mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${items[currentIndex].mediaUrl})`,
              }}
            />
          )}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>

      {/* 2. Content Layer */}
      <div className="relative z-10 container h-full flex items-center px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex} // Remounts text on slide change
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2, // Wait for bg to start transitioning
              }}
            >
              {/* Animated Reveal Title */}
              <div className="overflow-hidden mb-6">
                <motion.h1
                  className="text-5xl md:text-7xl font-bold leading-tight"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {items[currentIndex].title}
                </motion.h1>
              </div>

              <motion.p
                className="text-lg md:text-2xl mb-8 text-white/90 max-w-2xl font-light leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                {items[currentIndex].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-10 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all duration-300"
                  asChild
                >
                  <a href={items[currentIndex].ctaLink}>
                    {items[currentIndex].ctaText}
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Custom Controls (Right Side) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-8">
        {/* Vertical Indicators + Arrows Group */}
        <div className="flex flex-col items-center gap-6">
          {/* Dots */}
          <div className="flex flex-col gap-4">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className="group relative flex items-center justify-center w-4 h-4"
              >
                <motion.div
                  className={cn(
                    "rounded-full transition-all duration-500",
                    idx === currentIndex
                      ? "w-3 h-3 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                      : "w-2 h-2 bg-white/40 group-hover:bg-white/80"
                  )}
                  layoutId="activeDot"
                />
                {/* Pulse effect for active dot */}
                {idx === currentIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-yellow-500"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={prevSlide}
              className="text-white/70 hover:text-white hover:-translate-y-1 transition-all duration-300 p-1"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="text-white/70 hover:text-white hover:translate-y-1 transition-all duration-300 p-1"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Play/Pause Button (Separated at bottom) */}
        <div className="mt-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-500 group"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </Button>
        </div>
      </div>

      {/* 4. Initial "Curtain" Load Animation */}
      <motion.div
        className="absolute inset-0 z-50 bg-slate-950 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, pointerEvents: "none" }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0 }} // Fade out logo while zooming
          transition={{ duration: 0.4 }}
          className="text-white text-4xl font-bold"
        >
          CKSI
        </motion.div>
      </motion.div>
    </section>
  );
}
