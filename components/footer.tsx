import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-muted/50 to-secondary/5 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image src="/cksi-logo.png" alt="CKSI Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">CKSI</span>
                <span className="text-xs text-secondary font-medium">Social Initiative</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering families and children across Nigeria through education, healthcare, and community development
              programs.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild className="hover:bg-secondary/10 hover:text-secondary">
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover:bg-secondary/10 hover:text-secondary">
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover:bg-secondary/10 hover:text-secondary">
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover:bg-secondary/10 hover:text-secondary">
                <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                About Us
              </Link>
              <Link href="/programs" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Our Programs
              </Link>
              <Link href="/gallery" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Gallery
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>Lagos, Nigeria</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-secondary" />
                <span>+234 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-secondary" />
                <span>info@cksi.org.ng</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates on our programs and impact.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Your email" type="email" className="flex-1" />
              <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Couples and Kids Social Initiatives (CKSI). All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
