"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
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
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";

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
  standalone: NavigationItem[];
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
  standalone: [
    {
      id: "blog",
      label: "Blog",
      href: "/blog",
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

function DesktopNavigation() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const prefersReducedMotion = useReducedMotion();
  const activeDropdown =
    navigationConfig.main.find((item) => item.id === activeId) ?? null;

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (id: string) => {
      cancelClose();
      setActiveId(id);
    },
    [cancelClose]
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => setActiveId(null), 220);
  }, [cancelClose]);

  const closeMenu = useCallback(() => {
    cancelClose();
    setActiveId(null);
  }, [cancelClose]);

  useEffect(() => {
    return cancelClose;
  }, [cancelClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu]);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 h-full"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {navigationConfig.main.map((dropdown) => {
          const isActive = dropdown.id === activeId;

          return (
            <div key={dropdown.id} className="relative flex h-full items-center">
              <button
                type="button"
                className={cn(
                  "group relative z-50 flex touch-manipulation items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold font-sans",
                  "text-cksi-dark/80 transition-[color,background-color,box-shadow] duration-200",
                  "hover:bg-cksi-brand-red/5 hover:text-cksi-brand-red",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cksi-brand-red focus-visible:ring-offset-2",
                  isActive &&
                    "bg-cksi-brand-red/10 text-cksi-brand-red shadow-sm ring-1 ring-cksi-brand-red/20"
                )}
                aria-expanded={isActive}
                aria-controls={menuId}
                aria-haspopup="menu"
                onMouseEnter={() => openMenu(dropdown.id)}
                onFocus={() => openMenu(dropdown.id)}
                onClick={() =>
                  isActive ? closeMenu() : openMenu(dropdown.id)
                }
              >
                <span className="relative">
                  {dropdown.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-cksi-brand-red",
                      "transition-[width,opacity] duration-200",
                      isActive
                        ? "w-full opacity-100"
                        : "opacity-0 group-hover:w-3/4 group-hover:opacity-70"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "inline-flex transition-[transform,opacity] duration-200",
                    isActive ? "rotate-180 opacity-100" : "opacity-70"
                  )}
                >
                  <ChevronDown
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                  />
                </span>
              </button>
            </div>
          );
        })}

        {navigationConfig.standalone.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onMouseEnter={closeMenu}
            onFocus={closeMenu}
            className={cn(
              "group relative z-50 flex touch-manipulation items-center rounded-full px-4 py-2 font-sans text-sm font-semibold",
              "text-cksi-dark/80 transition-[color,background-color] duration-200",
              "hover:bg-cksi-brand-red/5 hover:text-cksi-brand-red",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cksi-brand-red focus-visible:ring-offset-2"
            )}
          >
            {item.label}
            <span
              aria-hidden="true"
              className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-cksi-brand-red opacity-0 transition-[width,opacity] duration-200 group-hover:w-1/2 group-hover:opacity-70"
            />
          </Link>
        ))}
      </nav>

      <DropdownPortal>
        <AnimatePresence>
          {activeDropdown ? (
            <motion.div
              id={menuId}
              aria-label={`${activeDropdown.label} menu`}
              variants={prefersReducedMotion ? undefined : dropdownVariants}
              initial={prefersReducedMotion ? { opacity: 0 } : "hidden"}
              animate={prefersReducedMotion ? { opacity: 1 } : "visible"}
              exit={prefersReducedMotion ? { opacity: 0 } : "exit"}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="fixed inset-x-0 top-16 z-50 origin-top"
            >
              <div
                aria-hidden="true"
                className="absolute -top-4 left-0 h-6 w-full"
              />

              <div className="px-4 pt-2 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1400px]">
                  <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-cksi-brand-surface shadow-[0_18px_60px_-20px_rgba(28,25,23,0.28)]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={activeDropdown.id}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, x: 10 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 0, x: -10 }
                        }
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="grid min-h-[350px] grid-cols-12"
                      >
                        <div className="col-span-4 flex flex-col justify-between border-r border-gray-100 p-8">
                          <div>
                            <span className="mb-4 block text-[11px] font-bold uppercase tracking-widest text-cksi-blue-dark">
                              {activeDropdown.label}
                            </span>
                            <h2 className="mb-4 text-pretty font-serif text-3xl leading-snug tracking-tight text-cksi-dark">
                              {activeDropdown.description}
                            </h2>
                            <p className="font-sans text-sm leading-relaxed text-cksi-gray">
                              Discover how CKSI turns care, collaboration, and
                              community action into lasting impact.
                            </p>
                          </div>

                          {activeDropdown.href ? (
                            <Link
                              href={activeDropdown.href}
                              onClick={closeMenu}
                              className="group mt-6 inline-flex w-fit items-center gap-2 rounded-md font-sans text-sm font-bold text-cksi-brand-red transition-colors hover:text-cksi-brand-red/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cksi-brand-red focus-visible:ring-offset-2"
                            >
                              View Overview
                              <span className="inline-flex transition-transform duration-200 group-hover:translate-x-1">
                                <ArrowRight
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                />
                              </span>
                            </Link>
                          ) : null}
                        </div>

                        <div className="col-span-4 px-8 py-10">
                          <div className="grid gap-2">
                            {activeDropdown.items.map((item, index) => (
                              <motion.div
                                key={item.id}
                                initial={
                                  prefersReducedMotion
                                    ? false
                                    : { opacity: 0, y: 6 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: prefersReducedMotion
                                    ? 0
                                    : index * 0.035,
                                }}
                              >
                                <Link
                                  href={item.href}
                                  onClick={closeMenu}
                                  className="group relative flex min-w-0 flex-col rounded-xl px-4 py-3 transition-[background-color,transform] duration-200 hover:translate-x-1 hover:bg-cksi-brand-red/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cksi-brand-red"
                                >
                                  <span className="font-sans text-lg font-bold text-cksi-dark transition-colors group-hover:text-cksi-brand-red">
                                    {item.label}
                                  </span>
                                  {item.description ? (
                                    <span className="mt-1 font-sans text-sm text-cksi-gray transition-colors group-hover:text-cksi-dark/70">
                                      {item.description}
                                    </span>
                                  ) : null}
                                  <span
                                    aria-hidden="true"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-1 opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                                  >
                                    <ArrowRight className="h-4 w-4 text-cksi-brand-red" />
                                  </span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="relative col-span-4 p-4">
                          <motion.div
                            className="absolute inset-4 overflow-hidden rounded-xl shadow-inner"
                            variants={
                              prefersReducedMotion ? undefined : imageVariants
                            }
                          >
                            {activeDropdown.image ? (
                              <>
                                <Image
                                  src={activeDropdown.image}
                                  alt={activeDropdown.imageAlt || ""}
                                  fill
                                  sizes="(min-width: 1024px) 33vw, 0px"
                                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cksi-dark/80 via-transparent to-transparent" />
                                <div className="absolute left-0 top-0 p-4">
                                  <span className="inline-block bg-cksi-brand-red px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                    {activeDropdown.label}
                                  </span>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-6">
                                  <p className="text-pretty font-serif text-2xl leading-tight text-white">
                                    Small actions. Shared purpose. Lasting
                                    change.
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                <span className="text-2xl font-bold text-gray-300">
                                  CKSI
                                </span>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DropdownPortal>
    </>
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[300px] overscroll-contain border-l-gray-200 p-0 sm:w-[400px]"
      >
        <div className="flex flex-col h-full bg-cksi-brand-surface">
          <div className="p-6 border-b border-gray-100 flex items-center h-[89px]">
            <div className="relative w-28 h-10">
              <Image
                src="/cksi-logo.png"
                alt="CKSI Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            {navigationConfig.main.map((section) => (
              <div key={section.id} className="mb-6">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === section.id ? null : section.id)
                  }
                  aria-expanded={activeTab === section.id}
                  aria-controls={`mobile-nav-${section.id}`}
                  className={cn(
                    "flex items-center justify-between w-full py-3 text-2xl font-serif tracking-tight",
                    activeTab === section.id ? "text-cksi-brand-red" : "text-cksi-dark"
                  )}
                >
                  {section.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "h-5 w-5 transition-transform",
                      activeTab === section.id && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {activeTab === section.id && (
                    <motion.div
                      id={`mobile-nav-${section.id}`}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
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

            {navigationConfig.standalone.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="block rounded-lg py-3 font-serif text-2xl tracking-tight text-cksi-dark transition-[color,transform] duration-200 hover:translate-x-1 hover:text-cksi-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cksi-brand-red"
              >
                {item.label}
              </Link>
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
                <Link
                  href="https://facebook.com"
                  aria-label="CKSI on Facebook"
                  className="rounded-sm transition-colors hover:text-cksi-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cksi-brand-red"
                >
                  <Facebook aria-hidden="true" className="h-5 w-5" />
                </Link>
                <Link
                  href="https://instagram.com"
                  aria-label="CKSI on Instagram"
                  className="rounded-sm transition-colors hover:text-cksi-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cksi-brand-red"
                >
                  <Instagram aria-hidden="true" className="h-5 w-5" />
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
        "fixed top-0 z-50 h-16 w-full transition-[background-color,border-color,box-shadow] duration-300",
        isScrolled
          ? "bg-cksi-brand-surface shadow-[0_4px_24px_-8px_rgba(28,25,23,0.08)] border-b border-gray-200"
          : "bg-cksi-brand-surface border-transparent"
      )}
    >
      <div className="h-full max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group z-50">
          <div className="relative w-28 h-10">
            <Image
              src="/cksi-logo.png"
              alt="CKSI Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <DesktopNavigation />

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
            aria-label="Open navigation menu"
            className="lg:hidden text-cksi-dark hover:bg-cksi-brand-red/10 hover:text-cksi-brand-red"
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden="true" className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
