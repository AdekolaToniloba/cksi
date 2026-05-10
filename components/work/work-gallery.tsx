"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, MapPin, ArrowRight } from "lucide-react";

type Category = "All" | "Healthcare" | "Community" | "Education";

export function WorkGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filters: Category[] = ["All", "Healthcare", "Community", "Education"];

  const items = [
    {
      id: 1,
      title: "Unilag Free Genotype Testing",
      location: "Lagos",
      category: "Healthcare",
      photoCount: 12,
      imageUrl: "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1739507996/cksi/events/2025-02-14-11-28-26/1739507993080-IMG_3155.jpg",
      span: "md:col-span-2",
    },
    {
      id: 2,
      title: "Red Umbrella Walk 2025",
      location: "Lagos",
      category: "Community",
      photoCount: 8,
      imageUrl: "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1739665551/cksi/events/2025-02-14-14-38-02/1739535039304-IMG_2181.jpg",
      span: "md:col-span-1",
    },
    {
      id: 3,
      title: "Iwaya Genotype Testing Outreach",
      location: "Iwaya, Lagos",
      category: "Healthcare",
      photoCount: 24,
      imageUrl: "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1739535805/cksi/events/2025-02-14-12-00-54/1739529243764-IMG_1483.jpg",
      span: "md:col-span-3",
    },
  ];

  const filteredItems = items.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  return (
    <section id="gallery" className="bg-[#FAF8F5] py-20 lg:py-24">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-serif text-[#151C27] mb-4">
              Our Impact in Pictures
            </h2>
            <p className="text-sm md:text-base font-sans text-gray-600">
              Explore our journey through photos and videos across Nigeria.
            </p>
          </div>
          
          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveCategory(filter)}
                className={`px-5 py-2 rounded-full font-sans font-bold text-xs transition-colors ${
                  activeCategory === filter
                    ? "bg-cksi-brand-red text-white"
                    : "bg-[#EAEFF8] text-[#151C27] hover:bg-[#DCE2F3]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[350px]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden group ${item.span}`}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151C27]/90 via-[#151C27]/20 to-transparent" />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="bg-white/90 backdrop-blur-sm text-[#151C27] px-3 py-1.5 rounded-full flex items-center gap-1.5 font-sans font-bold text-[10px] uppercase">
                  <Camera className="h-3 w-3" />
                  {item.photoCount} Photos
                </div>
                <div className="bg-[#151C27]/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-sans font-bold text-[10px] uppercase tracking-wider">
                  {item.category}
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <div className="flex items-center gap-1 text-gray-300 font-sans text-[10px] uppercase tracking-wider mb-1.5">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-white">
                    {item.title}
                  </h3>
                </div>
                
                <Link
                  href={`/gallery/${item.id}`} // Dummy link for now
                  className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white font-sans font-bold text-[10px] uppercase tracking-wider transition-colors shrink-0"
                >
                  View Gallery <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
