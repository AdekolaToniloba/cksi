import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FaqCta() {
  return (
    <section className="bg-[#151C27] py-20 w-full">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-3xl md:text-4xl font-serif text-white text-center md:text-left">
            Still have questions?
          </h2>
          <Button 
            asChild
            className="bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white rounded-full px-8 h-12 font-sans font-bold shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <Link href="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
