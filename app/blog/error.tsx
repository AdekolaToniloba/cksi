"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function BlogError({
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="h-16 w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Unable to load stories
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        We encountered an issue while fetching the latest updates. This might be
        a temporary connection problem.
      </p>
      <Button onClick={reset} className="gap-2">
        <RefreshCcw className="h-4 w-4" /> Try Again
      </Button>
    </div>
  );
}
