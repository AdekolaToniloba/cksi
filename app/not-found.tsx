"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Umbrella, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const links = [
    { title: "Our Programs", href: "/programs" },
    { title: "Volunteer", href: "/volunteer" },
    { title: "Donate", href: "/donate" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FAF8F5] px-4 py-20 text-center relative overflow-hidden">
      
      {/* Background large 404 Visual */}
      <div className="relative mb-8 flex justify-center items-center">
        <h1 className="font-sans font-bold text-[12rem] sm:text-[18rem] md:text-[22rem] leading-none text-[#F0F3FF] tracking-tighter select-none">
          404
        </h1>
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <Umbrella className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 text-cksi-brand-red drop-shadow-xl" fill="currentColor" strokeWidth={1} />
        </motion.div>
      </div>

      <motion.div 
        className="max-w-md mx-auto mb-10 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="mb-4 font-serif text-2xl text-[#151C27]">
          You've wandered off the path
        </h2>
        <p className="text-sm font-sans text-gray-600 leading-relaxed">
          The page you're looking for has moved or no longer exists. Let's get you back to familiar ground.
        </p>
      </motion.div>

      <motion.div 
        className="flex flex-col sm:flex-row gap-4 mb-20 relative z-10 w-full sm:w-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button asChild className="w-full sm:w-auto bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white rounded-full px-8 h-12 font-sans font-bold shadow-sm transition-transform hover:scale-105 active:scale-95">
          <Link href="/">Back to Homepage</Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent border-2 border-gray-300 text-[#151C27] hover:border-cksi-brand-red hover:text-cksi-brand-red rounded-full px-8 h-12 font-sans font-bold transition-all hover:scale-105 active:scale-95">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </motion.div>

      <motion.div 
        className="w-full max-w-3xl mx-auto relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="block text-[10px] sm:text-xs font-sans font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">
          OR TRY THESE HELPFUL LINKS
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {links.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Link href={link.href}>
                <div 
                  className="bg-white border border-gray-100 rounded-xl p-6 flex items-center justify-center sm:justify-start gap-4 hover:border-cksi-brand-red/30 hover:shadow-md transition-all group h-full"
                >
                  <ArrowRight className="h-5 w-5 text-cksi-brand-red group-hover:translate-x-1 transition-transform" />
                  <span className="font-sans font-bold text-sm text-[#151C27]">
                    {link.title}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
