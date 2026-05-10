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

// --- Types (Unchanged) ---
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

// --- Configuration (Unchanged) ---
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

// --- Improved Animations (Smoother Spring Physics) ---

// The main panel animation - faster exit, bouncy entrance
const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.8,
      staggerChildren: 0.05, // Stagger internal items
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.99,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

// Internal items (links) slide in slightly
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

// Image reveal animation
const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// --- Portal Component (Unchanged) ---
function DropdownPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

// --- Desktop Dropdown Component (With Improved Transitions) ---
function DesktopDropdown({ dropdown }: { dropdown: NavigationDropdown }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Increased timeout slightly to allow diagonal movement
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
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
          "group flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cksi-brand-red relative z-50",
          "text-cksi-dark/80 hover:text-cksi-brand-red hover:bg-cksi-brand-red/5 font-sans",
          isOpen &&
            "text-cksi-brand-red bg-cksi-brand-red/10 shadow-sm ring-1 ring-cksi-brand-red/20"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {dropdown.label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
        </motion.div>
      </button>

      <DropdownPortal>
        <AnimatePresence mode="wait">
          {/* mode="wait" ensures one exits before next enters if keys overlap, though here they are independent */}
          {isOpen && (
            <>
              {/* Backdrop - invisible but catches events to close if clicked outside */}
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onMouseEnter={handleMouseLeave} // Close if mouse moves to empty space
              />

              {/* Dropdown Panel */}
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="fixed left-0 right-0 z-50 origin-top"
                style={{ top: "64px" }}
              >
                {/* Invisible bridge */}
                <div className="h-3 w-full absolute -top-3 left-0 bg-transparent" />

                <div className="px-4 md:px-6 lg:px-8 pt-2">
                  <div className="mx-auto w-full max-w-[1400px]">
                    <div className="bg-cksi-brand-surface rounded-2xl shadow-[0_12px_40px_-12px_rgba(28,25,23,0.15)] border border-gray-200/60 overflow-hidden">
                      <div className="grid grid-cols-12 min-h-[350px]">
                        {/* SECTION 1: Summary */}
                        <div className="col-span-4 p-8 flex flex-col justify-between border-r border-gray-100 bg-transparent">
                          <motion.div variants={itemVariants}>
                            <span className="block text-[11px] font-bold text-cksi-blue-dark uppercase tracking-widest mb-4">
                              WHO WE ARE
                            </span>
                            <h3 className="text-3xl font-serif text-cksi-dark mb-4 tracking-tight leading-snug">
                              Our mission, story, and the people behind CKSI
                            </h3>
                            <p className="text-sm text-cksi-gray leading-relaxed font-sans">
                              We are dedicated to improving healthcare outcomes through community-driven initiatives.
                            </p>
                          </motion.div>
                          {dropdown.href && (
                            <motion.div variants={itemVariants}>
                              <Link
                                href={dropdown.href}
                                className="inline-flex items-center gap-2 text-sm font-bold text-cksi-brand-red hover:text-cksi-brand-red/80 font-sans mt-6 group"
                              >
                                View Overview
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            </motion.div>
                          )}
                        </div>

                        {/* SECTION 2: Links */}
                        <div className="col-span-4 p-8 py-10">
                          <div className="grid gap-6">
                            {dropdown.items.map((item, i) => (
                              <motion.div key={item.id} variants={itemVariants}>
                                <Link
                                  href={item.href}
                                  className="group flex flex-col"
                                >
                                  <span className="block text-lg font-bold font-sans text-cksi-dark group-hover:text-cksi-brand-red transition-colors">
                                    {item.label}
                                  </span>
                                  {item.description && (
                                    <span className="block text-sm font-sans text-cksi-gray mt-1 transition-colors group-hover:text-cksi-dark/70">
                                      {item.description}
                                    </span>
                                  )}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* SECTION 3: Image */}
                        <div className="col-span-4 relative p-4">
                          <motion.div
                            className="absolute inset-4 rounded-[12px] overflow-hidden shadow-inner"
                            variants={imageVariants}
                          >
                            {dropdown.image ? (
                              <>
                                <Image
                                  src={dropdown.image}
                                  alt={dropdown.imageAlt || ""}
                                  fill
                                  className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cksi-dark/80 via-transparent to-transparent" />
                                <div className="absolute top-0 left-0 p-4">
                                  <span className="inline-block px-3 py-1 bg-cksi-brand-red text-white text-[10px] font-bold font-sans uppercase tracking-wider shadow-sm">
                                    OUR TEAM
                                  </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                  <p className="text-white font-serif text-2xl leading-tight">
                                    The people driving change
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <span className="font-bold text-gray-300 text-2xl">
                                  CKSI
                                </span>
                              </div>
                            )}
                          </motion.div>
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

// --- Mobile Menu (Unchanged structure, just export) ---
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
        className="w-[300px] sm:w-[400px] p-0 border-l-gray-200"
      >
        <div className="flex flex-col h-full bg-cksi-brand-surface">
          <div className="p-6 border-b border-gray-100">
            <span className="font-serif font-bold text-2xl tracking-tight text-cksi-dark">
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
                  className={cn(
                    "flex items-center justify-between w-full py-3 text-2xl font-serif tracking-tight",
                    activeTab === section.id ? "text-cksi-brand-red" : "text-cksi-dark"
                  )}
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
                      <div className="pl-4 space-y-4 pt-2 pb-4 border-l-2 border-cksi-brand-red ml-2">
                        {section.items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={onClose}
                            className="block text-base font-sans font-medium text-cksi-dark hover:text-cksi-brand-red transition-colors"
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

          <div className="p-6 bg-white space-y-4 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.05)]">
            <Button
              asChild
              className="w-full bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white rounded-full font-sans"
              size="lg"
            >
              <Link href="/donate" onClick={onClose}>
                Donate
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-2 border-cksi-dark text-cksi-dark hover:bg-gray-50 rounded-full font-sans bg-transparent"
              size="lg"
            >
              <Link href="/contact" onClick={onClose}>
                Contact Us
              </Link>
            </Button>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-cksi-gray">
                <Link href="https://facebook.com">
                  <Facebook className="h-5 w-5 hover:text-cksi-brand-red" />
                </Link>
                <Link href="https://instagram.com">
                  <Instagram className="h-5 w-5 hover:text-cksi-brand-red" />
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
        "fixed top-0 z-50 w-full h-16 transition-all duration-300",
        isScrolled
          ? "bg-cksi-brand-surface shadow-[0_4px_24px_-8px_rgba(28,25,23,0.08)] border-b border-gray-200"
          : "bg-cksi-brand-surface border-transparent"
      )}
    >
      <div className="h-full max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="relative w-10 h-10 overflow-hidden rounded-md bg-cksi-brand-red/10 p-1">
            <div className="w-full h-full bg-cksi-brand-red rounded flex items-center justify-center text-white font-serif font-bold text-xs">
              CKSI
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold leading-none text-cksi-dark tracking-tight group-hover:text-cksi-brand-red transition-colors">
              CKSI
            </span>
            <span className="text-[10px] font-sans font-bold text-cksi-gray uppercase tracking-widest mt-0.5">
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
          <Button
            asChild
            className="hidden sm:flex bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white rounded-full px-6 shadow-sm font-sans font-semibold"
            size="sm"
          >
            <Link href="/donate">Donate</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-cksi-dark hover:bg-cksi-brand-red/10 hover:text-cksi-brand-red"
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
