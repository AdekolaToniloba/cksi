"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, HandHeart, ArrowRight, Users } from "lucide-react";

export function VolunteerSection() {
  return (
    <section
      className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
      aria-labelledby="volunteer-heading"
      data-testid="volunteer-section"
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Image */}
          <div
            className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl"
            data-testid="volunteer-image-container"
          >
            <Image
              src="https://res.cloudinary.com/dyhbo6rzr/image/upload/v1764332576/cksi/events/general/images/1764332572814-IMG_0258.jpg"
              alt="Volunteers making a difference in the community"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay with stats or badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">50+ Volunteers</p>
                  <p className="text-sm text-muted-foreground">
                    Making impact across Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div
            className="flex flex-col justify-center"
            data-testid="volunteer-content"
          >
            {/* Section Header */}
            <div className="mb-8">
              <div
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4"
                aria-hidden="true"
              >
                <HandHeart className="h-4 w-4" />
                <span className="text-sm font-medium">Make a Difference</span>
              </div>
              <h2
                id="volunteer-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                Join Our Mission to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Transform Lives
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Your time, skills, and contributions can create lasting change
                in communities across Nigeria. Every action counts.
              </p>
            </div>

            {/* Benefits List */}
            <div className="mb-8 space-y-4" data-testid="volunteer-benefits">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HandHeart className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Volunteer Opportunities
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Flexible roles that match your skills and schedule. From
                    teaching to healthcare, find your perfect fit.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="h-3.5 w-3.5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Financial Support</h3>
                  <p className="text-sm text-muted-foreground">
                    One-time or recurring donations that directly fund our
                    programs. 100% tax deductible.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4"
              data-testid="volunteer-cta-buttons"
            >
              <Button
                asChild
                size="lg"
                className="group/btn"
                data-testid="volunteer-form-button"
              >
                <Link href="/volunteer">
                  Become a Volunteer
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="group/btn"
                data-testid="donate-button"
              >
                <Link href="/donate">
                  Make a Donation
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Additional Info */}
            <div
              className="mt-6 text-sm text-muted-foreground"
              data-testid="volunteer-footer-text"
            >
              <p>
                Questions about volunteering or donating?{" "}
                <Link
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  Contact us
                </Link>{" "}
                - we're here to help!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
