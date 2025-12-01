// components/layout/main-layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/header/navbar";
import { Footer } from "@/components/footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Check if the current path starts with /admin
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Render ONLY children (the AdminLayout will handle the rest)
    return <div className="flex flex-col min-h-screen">{children}</div>;
  }

  // Render Public Layout
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
