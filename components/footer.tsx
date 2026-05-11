import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-cksi-brand-dark text-cksi-brand-light border-t-2 border-cksi-brand-red font-sans">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <div className="relative w-32 h-12">
                <Image
                  src="/cksi-logo.png"
                  alt="CKSI Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm text-cksi-brand-light/80">
              Empowering families and children across Nigeria through education, healthcare, and community development
              programs.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild className="hover:bg-white/10 text-cksi-brand-light/80 hover:text-cksi-brand-light rounded-full">
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover:bg-white/10 text-cksi-brand-light/80 hover:text-cksi-brand-light rounded-full">
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover:bg-white/10 text-cksi-brand-light/80 hover:text-cksi-brand-light rounded-full">
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover:bg-white/10 text-cksi-brand-light/80 hover:text-cksi-brand-light rounded-full">
                <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cksi-brand-light">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-cksi-brand-light/80 hover:text-cksi-brand-light transition-colors">
                About Us
              </Link>
              <Link href="/programs" className="text-sm text-cksi-brand-light/80 hover:text-cksi-brand-light transition-colors">
                Our Programs
              </Link>
              <Link href="/gallery" className="text-sm text-cksi-brand-light/80 hover:text-cksi-brand-light transition-colors">
                Gallery
              </Link>
              <Link href="/blog" className="text-sm text-cksi-brand-light/80 hover:text-cksi-brand-light transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-sm text-cksi-brand-light/80 hover:text-cksi-brand-light transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cksi-brand-light">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-cksi-brand-light/80">
                <MapPin className="h-4 w-4 text-cksi-brand-red" />
                <span>Lagos, Nigeria</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-cksi-brand-light/80">
                <Phone className="h-4 w-4 text-cksi-brand-red" />
                <span>+234 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-cksi-brand-light/80">
                <Mail className="h-4 w-4 text-cksi-brand-red" />
                <span>info@cksi.org.ng</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cksi-brand-light">Stay Updated</h3>
            <p className="text-sm text-cksi-brand-light/80">
              Subscribe to our newsletter for updates on our programs and impact.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Your email" type="email" className="flex-1 bg-cksi-warm text-cksi-dark border-gray-600 focus:border-cksi-brand-red rounded-md placeholder:text-gray-400" />
              <Button type="submit" className="bg-cksi-brand-red hover:bg-cksi-brand-red/90 text-white rounded-full font-semibold px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-cksi-brand-light/10 text-center text-sm text-cksi-brand-light/60 max-w-[1400px] mx-auto">
          <p>&copy; {new Date().getFullYear()} Couples and Kids Social Initiatives (CKSI). All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
