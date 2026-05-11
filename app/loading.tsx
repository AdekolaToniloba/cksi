"use client";
import { motion } from "framer-motion";
import { Umbrella } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5]">
      <motion.div
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-100/50 mb-6 shadow-sm border border-red-100"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <Umbrella className="h-10 w-10 text-cksi-brand-red" fill="currentColor" strokeWidth={1} />
        
        {/* Shadow */}
        <motion.div
          className="absolute -bottom-8 h-1.5 w-12 rounded-[50%] bg-black/10"
          animate={{ scale: [1, 0.6, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.h2
        className="font-serif text-xl font-bold text-[#151C27] tracking-tight mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        CKSI
      </motion.h2>
      <motion.p
        className="font-sans text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Loading...
      </motion.p>
    </div>
  );
}
