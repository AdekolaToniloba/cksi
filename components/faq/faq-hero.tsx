import React from 'react';

export function FaqHero() {
  return (
    <section className="bg-[#FAF8F5] pt-28 pb-12 w-full">
      <div className="container mx-auto px-4 max-w-3xl">
        <span className="block text-[11px] sm:text-xs font-sans font-bold tracking-[0.15em] text-cksi-brand-red uppercase mb-4">
          SUPPORT & INFORMATION
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#151C27] tracking-tight mb-6 leading-tight">
          Frequently <span className="font-serif">Asked Questions</span>
        </h1>
        <p className="text-sm sm:text-base font-sans text-gray-600 leading-relaxed max-w-2xl">
          Find answers to common questions about our organization, sickle cell disorder,
          and how you can make a difference in our community.
        </p>
      </div>
    </section>
  );
}
