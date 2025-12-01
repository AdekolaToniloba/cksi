"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Pulsing Cell Container */}
        <motion.div
          className="relative flex h-24 w-24 items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          {/* Outer Ripple (Blue - Support) */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-600 opacity-20"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
          />

          {/* Inner Core (Red - Life/Passion) */}
          <div className="h-16 w-16 rounded-full bg-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </motion.div>

        {/* Text with Typing Effect */}
        <motion.h2
          className="mt-8 font-mono text-xl font-bold uppercase tracking-widest text-blue-900"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Initializing System...
        </motion.h2>
      </div>
    </div>
  );
}
