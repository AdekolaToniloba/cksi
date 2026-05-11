"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Umbrella } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FAF8F5] px-4 py-20 text-center relative overflow-hidden">
      
      {/* Background large 500 Visual */}
      <div className="relative mb-8 flex justify-center items-center">
        <h1 className="font-sans font-bold text-[12rem] sm:text-[18rem] md:text-[22rem] leading-none text-[#F0F3FF] tracking-tighter select-none">
          500
        </h1>
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ rotate: 15, scale: 0.8, opacity: 0 }}
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
          Something went wrong on our end
        </h2>
        <p className="text-sm font-sans text-gray-600 leading-relaxed">
          We're aware of the issue and working to fix it...
        </p>
      </motion.div>

      <motion.div 
        className="flex flex-col sm:flex-row gap-4 mb-20 relative z-10 w-full sm:w-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          onClick={reset} 
          className="w-full sm:w-auto bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white rounded-full px-10 h-12 font-sans font-bold shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          Try Again
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent border-2 border-gray-300 text-[#151C27] hover:border-cksi-brand-red hover:text-cksi-brand-red rounded-full px-10 h-12 font-sans font-bold transition-all hover:scale-105 active:scale-95">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </motion.div>

      <motion.div 
        className="mt-auto pt-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm font-sans text-gray-500">
          If this keeps happening, contact us at <a href="mailto:info@cksi.org" className="text-cksi-brand-red font-bold hover:underline">info@cksi.org</a>
        </p>
      </motion.div>

    </div>
  );
}
