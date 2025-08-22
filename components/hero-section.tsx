// components/hero-section.tsx - Updated to use API
"use client";

import { useState, useEffect } from "react";
import { HeroCarousel } from "@/components/hero-carousel";
import { HeroCarousel as HeroCarouselType } from "@/types";

export function HeroSection() {
  const [heroItems, setHeroItems] = useState<HeroCarouselType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroItems();
  }, []);

  const fetchHeroItems = async () => {
    try {
      const response = await fetch("/api/hero");
      const result = await response.json();

      if (result.success) {
        setHeroItems(result.data);
      } else {
        console.error("Failed to fetch hero items:", result.error);
        setHeroItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch hero items:", error);
      setHeroItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </section>
    );
  }

  return <HeroCarousel items={heroItems} />;
}
