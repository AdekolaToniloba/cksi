"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

// Update the interface to include initialCategory
interface BlogSearchProps {
  initialQuery?: string;
  initialCategory?: string;
}

export function BlogSearch({ initialQuery, initialCategory }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    // Preserve category if it exists
    if (initialCategory) {
      params.set("category", initialCategory);
    }

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    params.set("page", "1");
    router.replace(`/blog?${params.toString()}`);
  }, 300);

  return (
    <div className="relative max-w-md w-full mx-auto md:mx-0">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search stories..."
        className="pl-10 bg-white border-blue-100 focus:border-blue-300 focus:ring-blue-300"
        defaultValue={initialQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
