"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { allPrograms } from "@/data/programs"
import { motion } from "framer-motion"
import { MapPin, Calendar, Target, ArrowRight } from "lucide-react"

export default function ProgramsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Programs" },
    { id: "education", name: "Education" },
    { id: "healthcare", name: "Healthcare" },
    { id: "community", name: "Community Development" },
    { id: "family", name: "Family Support" },
  ]

  const filteredPrograms = allPrograms.filter(
    (program) => selectedCategory === "all" || program.category === selectedCategory,
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gradient-to-br from-secondary/10 via-background to-primary/10"
      >
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Our Programs
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Comprehensive initiatives designed to address the most pressing needs of families and children across
              Nigeria. Each program is carefully crafted to create lasting positive change in communities.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Filter Buttons */}
      <section className="py-8 bg-muted/50">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all duration-300 hover:scale-105"
              >
                {category.name}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-64">
                    <Image
                      src={program.image || "/placeholder.svg"}
                      alt={program.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className={`${
                          program.category === "education"
                            ? "bg-secondary text-white"
                            : program.category === "healthcare"
                              ? "bg-primary text-white"
                              : program.category === "community"
                                ? "bg-green-500 text-white"
                                : "bg-purple-500 text-white"
                        }`}
                      >
                        {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant={program.status === "active" ? "default" : "outline"}>
                        {program.status === "active" ? "Active" : "Completed"}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <program.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{program.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Program Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{program.beneficiaries}</div>
                        <div className="text-sm text-muted-foreground">Beneficiaries</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{program.duration}</div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </div>
                    </div>

                    {/* Progress */}
                    {program.progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>
                    )}

                    {/* Location and Date */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {program.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Started: {program.startDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Goal: {program.goal}
                      </div>
                    </div>

                    {/* Key Achievements */}
                    <div>
                      <h4 className="font-semibold mb-2">Key Achievements:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {program.achievements.slice(0, 3).map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <Button asChild className="w-full group">
                      <Link href={`/programs/${program.slug}`}>
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
