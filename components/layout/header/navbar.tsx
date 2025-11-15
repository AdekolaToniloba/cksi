// components/layout/header/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Types
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

interface NavigationConfig {
  main: NavigationDropdown[];
  footer: {
    sections: any[];
    social: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
}

// Navigation configuration with enhanced data
const navigationConfig: NavigationConfig = {
  main: [
    {
      id: "about",
      label: "About",
      description:
        "Learn about our mission, values, and the people behind CKSI. Discover how we're making a difference in communities.",
      href: "/about",
      image: "/images/about-preview.jpg",
      imageAlt: "CKSI team members",
      items: [
        {
          id: "our-story",
          label: "Our Story",
          href: "/about",
          description: "The journey of CKSI and our impact",
        },
        {
          id: "foundation-faq",
          label: "Foundation FAQ",
          href: "/about/faq",
          description: "Common questions answered",
        },
        {
          id: "contact-us",
          label: "Contact Us",
          href: "/contact",
          description: "Get in touch with our team",
        },
        {
          id: "leadership",
          label: "Leadership",
          href: "/about/leadership",
          description: "Meet our dedicated leaders",
        },
        {
          id: "ways-to-give",
          label: "Ways to Give",
          href: "/donate",
          description: "Various donation options",
        },
      ],
    },
    {
      id: "our-work",
      label: "Our Work",
      description:
        "Explore our programs, initiatives, and the communities we serve. See the tangible impact of your support.",
      href: "/work",
      image: "/images/work-preview.jpg",
      imageAlt: "CKSI programs in action",
      items: [
        {
          id: "explore-our-work",
          label: "Explore Our Work",
          href: "/work",
          description: "Overview of all our initiatives",
        },
        {
          id: "events",
          label: "Events",
          href: "/gallery",
          description: "Photos and highlights from our events",
        },
        {
          id: "places",
          label: "Places",
          href: "/work/places",
          description: "Communities we serve",
        },
      ],
    },
    {
      id: "ways-to-contribute",
      label: "Ways to Contribute",
      description:
        "Join us in making a difference. Whether through donations, volunteering, or partnerships, your contribution matters.",
      href: "/donate",
      image: "/images/contribute-preview.jpg",
      imageAlt: "People contributing to CKSI",
      items: [
        {
          id: "donate",
          label: "Donate",
          href: "/donate",
          description: "Support our mission financially",
        },
        {
          id: "volunteer",
          label: "Volunteer",
          href: "/volunteer",
          description: "Give your time and skills",
        },
        {
          id: "partner-with-us",
          label: "Partner with Us",
          href: "/partnerships",
          description: "Collaborate for greater impact",
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

// Animation variants
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Social Media Icons Component
function SocialMediaIcons({ className }: { className?: string }) {
  const getIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return Facebook;
      case "instagram":
        return Instagram;
      case "linkedin":
        return Linkedin;
      case "twitter":
        return Linkedin;
      default:
        return Linkedin;
    }
  };

  return (
    <div
      className={cn("flex items-center space-x-2", className)}
      role="list"
      aria-label="Social media links"
    >
      {navigationConfig.footer.social.map((social) => {
        const IconComponent = getIcon(social.platform);

        return (
          <motion.div
            key={social.platform}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            role="listitem"
          >
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
              data-testid={`social-${social.platform}`}
            >
              <Link
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.platform}`}
              >
                <IconComponent className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

// Desktop Dropdown Component
function DesktopDropdown({ dropdown }: { dropdown: NavigationDropdown }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        className={cn(
          "group h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isOpen && "bg-accent/50 text-accent-foreground"
        )}
        data-testid={`nav-trigger-${dropdown.id}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="flex items-center gap-1">
          {dropdown.label}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/5 backdrop-blur-sm"
              style={{ top: "64px" }}
              aria-hidden="true"
            />

            {/* Dropdown content */}
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 right-0 pt-2 flex justify-center px-4"
              style={{ top: "64px" }}
              role="menu"
              aria-label={`${dropdown.label} menu`}
            >
              <div className="bg-background border rounded-lg shadow-xl p-8 w-full max-w-[1200px]">
                <div className="grid grid-cols-12 gap-8">
                  {/* Column 1: Description */}
                  <div className="col-span-4 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {dropdown.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {dropdown.description}
                      </p>
                    </div>
                    {dropdown.href && (
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={dropdown.href}
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4 group"
                          role="menuitem"
                        >
                          View all
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </motion.div>
                    )}
                  </div>

                  {/* Column 2: Navigation Links */}
                  <nav
                    className="col-span-4 space-y-1"
                    aria-label={`${dropdown.label} navigation`}
                  >
                    {dropdown.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "block rounded-md p-3 transition-colors",
                            "hover:bg-accent focus-visible:bg-accent",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "group"
                          )}
                          data-testid={`dropdown-item-${item.id}`}
                          role="menuitem"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                {item.label}
                              </div>
                              {item.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2 mt-0.5" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  {/* Column 3: Image (if available) */}
                  {dropdown.image && (
                    <motion.div
                      className="col-span-4 rounded-lg overflow-hidden bg-muted"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={dropdown.image}
                          alt={dropdown.imageAlt || `${dropdown.label} preview`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1200px) 33vw, 400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm font-medium">
                            {dropdown.imageAlt || dropdown.label}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile Navigation Component
function MobileNavigation({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center space-x-3"
              aria-label="CKSI Home"
            >
              <div className="relative w-8 h-8">
                <Image
                  src="/cksilogo.png"
                  alt="CKSI Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">CKSI</span>
                <span className="text-xs text-primary">Social Initiative</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <motion.nav
            className="flex-1 p-6 space-y-2 overflow-y-auto"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            aria-label="Mobile navigation"
          >
            {navigationConfig.main.map((dropdown) => (
              <motion.div
                key={dropdown.id}
                className="space-y-2"
                variants={mobileItemVariants}
              >
                <button
                  onClick={() => toggleDropdown(dropdown.id)}
                  className={cn(
                    "flex items-center justify-between w-full text-left text-lg font-medium py-2",
                    "hover:text-primary transition-colors rounded-md px-2",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                  data-testid={`mobile-nav-${dropdown.id}`}
                  aria-expanded={openDropdown === dropdown.id}
                  aria-controls={`mobile-dropdown-${dropdown.id}`}
                >
                  {dropdown.label}
                  <motion.div
                    animate={{ rotate: openDropdown === dropdown.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openDropdown === dropdown.id && (
                    <motion.div
                      id={`mobile-dropdown-${dropdown.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 space-y-3 border-l-2 border-primary/20 py-2">
                        {dropdown.items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={cn(
                                "block text-sm text-muted-foreground py-2 px-2 rounded-md",
                                "hover:text-primary hover:bg-accent transition-colors",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              )}
                              data-testid={`mobile-dropdown-item-${item.id}`}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.nav>

          {/* Footer */}
          <div className="p-6 border-t space-y-4">
            {/* Theme Toggle - Mobile */}
            <div className="flex items-center justify-between py-2 px-2 rounded-md bg-accent/50">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                className="w-full"
                data-testid="mobile-donate-button"
              >
                <Link href="/donate" onClick={onClose}>
                  Donate Now
                </Link>
              </Button>
            </motion.div>

            <div className="flex justify-center">
              <SocialMediaIcons />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Navbar Component
export function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-shadow duration-200",
        isScrolled && "shadow-sm"
      )}
      data-testid="main-navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      role="banner"
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center space-x-3 transition-opacity rounded-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          data-testid="logo-link"
          aria-label="CKSI Home"
        >
          <motion.div
            className="relative w-10 h-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/cksi-logo.png"
              alt="CKSI Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center space-x-1"
          aria-label="Main navigation"
        >
          {navigationConfig.main.map((dropdown) => (
            <DesktopDropdown key={dropdown.id} dropdown={dropdown} />
          ))}
        </nav>

        {/* Right Section - Theme Toggle, Donate Button and Social Icons */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Theme Toggle - Desktop */}
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          {/* Desktop Donate Button */}
          <motion.div
            className="hidden md:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 transition-colors"
              data-testid="desktop-donate-button"
            >
              <Link href="/donate">Donate Now</Link>
            </Button>
          </motion.div>

          {/* Desktop Social Icons */}
          <div className="hidden lg:flex">
            <SocialMediaIcons />
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            className="lg:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileNavOpen(true)}
              data-testid="mobile-menu-button"
              aria-label="Open menu"
              aria-expanded={isMobileNavOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </motion.header>
  );
}
