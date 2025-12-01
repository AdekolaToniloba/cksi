"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md overflow-hidden border-4 border-red-600 bg-white shadow-[12px_12px_0px_0px_#1e3a8a]"
      >
        {/* Diagnostic Header Strip */}
        <div className="flex items-center gap-2 border-b-4 border-red-600 bg-red-600 p-3 text-white">
          <AlertTriangle className="h-6 w-6 animate-pulse" />
          <span className="font-mono font-bold uppercase tracking-widest">
            System Alert
          </span>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <h2 className="mb-4 text-3xl font-black uppercase leading-tight text-blue-950">
            Something went <span className="text-red-600">wrong.</span>
          </h2>

          <div className="mb-8 rounded border border-gray-200 bg-gray-50 p-4 font-mono text-xs text-gray-500">
            <p className="mb-1 font-bold text-black">ERROR_DIGEST:</p>
            <p>{error.digest || "UNKNOWN_ERR_001"}</p>
          </div>

          {/* Resuscitate Button */}
          <Button
            onClick={reset}
            className="group w-full border-2 border-black bg-blue-600 py-6 text-lg font-bold uppercase text-white shadow-[4px_4px_0px_0px_#000000] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000000]"
          >
            <RefreshCcw className="mr-2 h-5 w-5 animate-spin-slow" />
            Resuscitate Page
          </Button>
        </div>

        {/* Brutalist Decorative Footer */}
        <div className="flex h-4">
          <div className="w-1/3 bg-blue-600" />
          <div className="w-1/3 bg-red-600" />
          <div className="w-1/3 bg-black" />
        </div>
      </motion.div>
    </div>
  );
}
