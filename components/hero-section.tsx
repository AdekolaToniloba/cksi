"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/15"
    >
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              Empowering Families,
              <span className="text-primary"> Transforming</span>
              <span className="text-secondary"> Lives</span>
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl"
            >
              CKSI is dedicated to improving the lives of couples and children across Nigeria through education,
              healthcare, and community development programs that create lasting change.
            </motion.p>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button size="lg" asChild>
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg blur-3xl"></div>
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Children and families benefiting from CKSI programs"
              width={800}
              height={600}
              className="relative rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
