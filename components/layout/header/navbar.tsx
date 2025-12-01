"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Menu,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// --- Types ---
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
}

interface NavigationDropdown {
  id: string;
  label: string;
  description?: string;
  href?: string;
  image?: string;
  imageAlt?: string;
  items: NavigationItem[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface NavigationConfig {
  main: NavigationDropdown[];
  footer: {
    sections: { title: string; links: { label: string; href: string }[] }[];
    social: SocialLink[];
  };
}

// --- Configuration ---
const navigationConfig: NavigationConfig = {
  main: [
    {
      id: "about",
      label: "About",
      description:
        "Learn about our mission, values, and the people driving change.",
      href: "/about",
      image:
        "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1764332576/cksi/events/general/images/1764332572814-IMG_0258.jpg",
      imageAlt: "CKSI Team",
      items: [
        {
          id: "our-story",
          label: "Our Story",
          href: "/about",
          description: "Our journey & impact",
        },
        {
          id: "faq",
          label: "Foundation FAQ",
          href: "/about/faq",
          description: "Common questions",
        },
        {
          id: "leadership",
          label: "Leadership",
          href: "/about/leadership",
          description: "Meet the board",
        },
        {
          id: "contact",
          label: "Contact Us",
          href: "/contact",
          description: "Get in touch",
        },
      ],
    },
    {
      id: "work",
      label: "Our Work",
      description:
        "Explore our initiatives across education, health, and community.",
      href: "/work",
      image:
        "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1764332576/cksi/events/general/images/1764332572814-IMG_0258.jpg",
      imageAlt: "Community Outreach",
      items: [
        {
          id: "programs",
          label: "Explore Our Work",
          href: "/work",
          description: "All initiatives",
        },
        {
          id: "places",
          label: "Places",
          href: "/work/places",
          description: "Communities we serve",
        },
        {
          id: "gallery",
          label: "Event Gallery",
          href: "/gallery",
          description: "Photos & Videos",
        },
      ],
    },
    {
      id: "contribute",
      label: "Get Involved",
      description:
        "Join us in making a difference through volunteering or donations.",
      href: "/donate",
      image:
        "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1764332576/cksi/events/general/images/1764332572814-IMG_0258.jpg",
      imageAlt: "Volunteers",
      items: [
        {
          id: "donate",
          label: "Donate",
          href: "/donate",
          description: "Support us financially",
        },
        {
          id: "volunteer",
          label: "Volunteer",
          href: "/volunteer",
          description: "Give your time",
        },
        {
          id: "partner",
          label: "Partner with Us",
          href: "/partnerships",
          description: "Corporate alliances",
        },
      ],
    },
  ],
  footer: {
    sections: [],
    social: [
      {
        platform: "facebook",
        url: "https://facebook.com/cksi",
        icon: "facebook",
      },
      {
        platform: "instagram",
        url: "https://instagram.com/cksi",
        icon: "instagram",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/company/cksi",
        icon: "linkedin",
      },
    ],
  },
};

// --- Animations ---
const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

// --- Portal Component ---
function DropdownPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

// --- Desktop Dropdown Component (With Portal) ---
function DesktopDropdown({ dropdown }: { dropdown: NavigationDropdown }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        className={cn(
          "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          "text-slate-600 hover:text-blue-600 hover:bg-blue-50",
          "dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-blue-950/30",
          isOpen &&
            "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {dropdown.label}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <DropdownPortal>
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop - visual only, no mouse events */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-x-0 bottom-0 bg-black/5 backdrop-blur-sm z-40 pointer-events-none"
                style={{ top: "64px" }}
                aria-hidden="true"
              />

              {/* Dropdown Panel - handles mouse events */}
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="fixed left-0 right-0 z-50"
                style={{ top: "64px" }}
              >
                {/* Invisible bridge to connect header button to dropdown */}
                <div className="h-4" />

                <div className="px-4 md:px-6 lg:px-8">
                  <div className="mx-auto w-full max-w-[1400px]">
                    <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="grid grid-cols-12 min-h-[350px]">
                        {/* SECTION 1: Summary */}
                        <div className="col-span-3 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col justify-between border-r border-slate-100 dark:border-slate-800">
                          <div>
                            <h3 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-4">
                              {dropdown.label}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                              {dropdown.description}
                            </p>
                          </div>
                          {dropdown.href && (
                            <Link
                              href={dropdown.href}
                              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-6 group"
                            >
                              View Overview
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          )}
                        </div>

                        {/* SECTION 2: Links */}
                        <div className="col-span-5 p-8">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                            Direct Links
                          </p>
                          <div className="grid gap-2">
                            {dropdown.items.map((item, i) => (
                              <motion.div
                                key={item.id}
                                custom={i}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                <Link
                                  href={item.href}
                                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                                >
                                  <div>
                                    <span className="block text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {item.label}
                                    </span>
                                    {item.description && (
                                      <span className="block text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {item.description}
                                      </span>
                                    )}
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* SECTION 3: Image */}
                        <div className="col-span-4 relative">
                          <div className="absolute inset-4 rounded-xl overflow-hidden">
                            {dropdown.image ? (
                              <>
                                <Image
                                  src={dropdown.image}
                                  alt={dropdown.imageAlt || ""}
                                  fill
                                  className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                  <span className="inline-block px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded mb-2">
                                    Featured
                                  </span>
                                  <p className="text-white font-medium text-lg leading-tight">
                                    {dropdown.imageAlt}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                <span className="font-bold text-slate-300 text-2xl">
                                  CKSI
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DropdownPortal>
    </div>
  );
}

// --- Mobile Menu ---
function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] p-0 border-l-slate-200 dark:border-slate-800"
      >
        <div className="flex flex-col h-full bg-white dark:bg-slate-950">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-xl tracking-tight text-blue-950 dark:text-blue-50">
              CKSI
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            {navigationConfig.main.map((section) => (
              <div key={section.id} className="mb-6">
                <button
                  onClick={() =>
                    setActiveTab(activeTab === section.id ? null : section.id)
                  }
                  className="flex items-center justify-between w-full py-3 text-lg font-bold text-slate-900 dark:text-slate-100"
                >
                  {section.label}
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-transform",
                      activeTab === section.id && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {activeTab === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 space-y-2 pb-4 border-l-2 border-blue-100 dark:border-blue-900 ml-2">
                        {section.items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={onClose}
                            className="block py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 space-y-4">
            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Link href="/donate" onClick={onClose}>
                Donate Now
              </Link>
            </Button>
            <div className="flex justify-between items-center">
              <ThemeToggle />
              <div className="flex gap-4 text-slate-400">
                <Link href="https://facebook.com">
                  <Facebook className="h-5 w-5 hover:text-blue-600" />
                </Link>
                <Link href="https://instagram.com">
                  <Instagram className="h-5 w-5 hover:text-pink-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- Main Navbar Export ---
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full h-16 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-slate-200 dark:border-slate-800"
          : "bg-white dark:bg-slate-950 border-transparent"
      )}
    >
      <div className="h-full max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-blue-50 dark:bg-blue-900/20 p-1">
            <div className="w-full h-full bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
              CKSI
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">
              CKSI
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Social Initiative
            </span>
          </div>
        </Link>

        {/* Desktop Nav - Centered */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 h-full">
          {navigationConfig.main.map((dropdown) => (
            <DesktopDropdown key={dropdown.id} dropdown={dropdown} />
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 z-50">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Button
            asChild
            className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-600/20"
            size="sm"
          >
            <Link href="/donate">Donate</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
