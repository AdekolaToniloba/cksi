// components/layout/header/navbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Menu,
  X,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationConfig, NavigationDropdown, NavigationItem } from "@/types";

// Navigation configuration
const navigationConfig: NavigationConfig = {
  main: [
    {
      id: "about",
      label: "About",
      items: [
        { id: "our-story", label: "Our Story", href: "/about" },
        { id: "foundation-faq", label: "Foundation FAQ", href: "/about/faq" },
        { id: "contact-us", label: "Contact Us", href: "/contact" },
        { id: "leadership", label: "Leadership", href: "/about/leadership" },
        { id: "ways-to-give", label: "Ways to Give", href: "/donate" },
      ],
    },
    {
      id: "our-work",
      label: "Our Work",
      items: [
        { id: "explore-our-work", label: "Explore Our Work", href: "/work" },
        { id: "programs", label: "Programs", href: "/programs" },
        { id: "places", label: "Places", href: "/work/places" },
      ],
    },
    {
      id: "ways-to-contribute",
      label: "Ways to Contribute",
      items: [
        { id: "donate", label: "Donate", href: "/donate" },
        { id: "volunteer", label: "Volunteer", href: "/volunteer" },
        {
          id: "partner-with-us",
          label: "Partner with Us",
          href: "/partnerships",
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

// Social Media Icons Component
function SocialMediaIcons({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {navigationConfig.footer.social.map((social) => {
        const Icon = {
          facebook: Facebook,
          instagram: Instagram,
          linkedin: Linkedin,
          twitter: Linkedin, // fallback
        }[social.platform];

        return (
          <Button
            key={social.platform}
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            data-testid={`social-${social.platform}`}
          >
            <Link
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
            >
              <Icon className="h-4 w-4" />
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

// Navigation Link Component
function NavLink({
  item,
  onClick,
}: {
  item: NavigationItem;
  onClick?: () => void;
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        onClick={onClick}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
        data-testid={`nav-link-${item.id}`}
      >
        {item.label}
        {item.description && (
          <span className="sr-only">{item.description}</span>
        )}
      </Link>
    </NavigationMenuLink>
  );
}

// Desktop Dropdown Component
function DesktopDropdown({ dropdown }: { dropdown: NavigationDropdown }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className="group h-10 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
        data-testid={`nav-trigger-${dropdown.id}`}
      >
        {dropdown.label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
          {dropdown.items.map((item) => (
            <NavigationMenuLink key={item.id} asChild>
              <Link
                href={item.href}
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                data-testid={`dropdown-item-${item.id}`}
              >
                <div className="text-sm font-medium leading-none">
                  {item.label}
                </div>
                {item.description && (
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </Link>
            </NavigationMenuLink>
          ))}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
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
            >
              <div className="relative w-8 h-8">
                <Image
                  src="/cksi-logo.png"
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
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="mobile-nav-close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            {navigationConfig.main.map((dropdown) => (
              <div key={dropdown.id} className="space-y-2">
                <button
                  onClick={() => toggleDropdown(dropdown.id)}
                  className="flex items-center justify-between w-full text-left text-lg font-medium py-2 hover:text-primary transition-colors"
                  data-testid={`mobile-nav-${dropdown.id}`}
                >
                  {dropdown.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openDropdown === dropdown.id && "rotate-180"
                    )}
                  />
                </button>

                {openDropdown === dropdown.id && (
                  <div className="pl-4 space-y-3 border-l-2 border-primary/20">
                    {dropdown.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                        data-testid={`mobile-dropdown-item-${item.id}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t space-y-4">
            <Button
              asChild
              className="w-full"
              data-testid="mobile-donate-button"
            >
              <Link href="/donate" onClick={onClose}>
                Donate Now
              </Link>
            </Button>

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        isScrolled && "shadow-sm"
      )}
      data-testid="main-navbar"
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          data-testid="logo-link"
        >
          <div className="relative w-10 h-10">
            <Image
              src="/cksi-logo.png"
              alt="CKSI Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">CKSI</span>
            <span className="text-xs text-primary font-medium">
              Social Initiative
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationConfig.main.map((dropdown) => (
                <DesktopDropdown key={dropdown.id} dropdown={dropdown} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Section - Donate Button and Social Icons */}
        <div className="flex items-center space-x-4">
          {/* Desktop Donate Button */}
          <Button
            asChild
            className="hidden md:inline-flex bg-primary hover:bg-primary/90"
            data-testid="desktop-donate-button"
          >
            <Link href="/donate">Donate Now</Link>
          </Button>

          {/* Desktop Social Icons */}
          <div className="hidden lg:flex">
            <SocialMediaIcons />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileNavOpen(true)}
            data-testid="mobile-menu-button"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </header>
  );
}
