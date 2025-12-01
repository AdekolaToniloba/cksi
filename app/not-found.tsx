"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-blue-50 px-4 text-center">
      {/* Animated 404 Text - Brutalist Style */}
      <div className="relative">
        <motion.h1
          className="font-black text-[12rem] leading-none text-blue-900 opacity-10 md:text-[18rem]"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 0.1 }}
          transition={{ duration: 0.8 }}
        >
          404
        </motion.h1>

        {/* Floating Interaction Layer */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#ef4444]">
            <SearchX className="mx-auto mb-4 h-16 w-16 text-red-600" />
            <h2 className="mb-2 font-mono text-2xl font-bold uppercase text-black">
              Sequence Not Found
            </h2>
            <p className="max-w-xs text-sm text-gray-600">
              The genetic marker you are looking for doesn't exist in our
              database.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Interaction Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12"
      >
        <Button
          asChild
          className="group relative h-14 overflow-hidden border-2 border-blue-600 bg-transparent px-8 text-blue-600 hover:bg-blue-600 hover:text-white"
        >
          <Link href="/">
            <span className="relative z-10 flex items-center gap-2 font-bold uppercase tracking-wider">
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Return to Base
            </span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
