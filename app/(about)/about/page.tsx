import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { organizationInfo, teamMembers, boardMembers } from "@/data/organization"
import Image from "next/image"
import { Calendar, Users, Target, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - CKSI",
  description:
    "Learn about Couples and Kids Social Initiatives (CKSI), our mission, vision, team, and impact in Nigerian communities.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/15">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-secondary">CKSI</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">{organizationInfo.mission}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{organizationInfo.founded}</div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{organizationInfo.beneficiaries}</div>
                  <div className="text-sm text-muted-foreground">Lives Impacted</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{organizationInfo.programs}</div>
                  <div className="text-sm text-muted-foreground">Active Programs</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{organizationInfo.mission}</p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{organizationInfo.vision}</p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {organizationInfo.values.map((value, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${index % 2 === 0 ? "bg-secondary" : "bg-primary"}`} />
                      <span className="text-muted-foreground">{value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Organization History */}
      <section className="py-16 bg-gradient-to-br from-muted/50 to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our <span className="text-secondary">Story</span>
            </h2>
            <div className="space-y-8">
              {organizationInfo.history.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-sm ${
                        index % 2 === 0 ? "border-secondary text-secondary" : "border-primary text-primary"
                      }`}
                    >
                      {milestone.year}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-secondary">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated professionals working tirelessly to make a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className={`text-center border-t-4 ${
                  index % 2 === 0 ? "border-t-secondary" : "border-t-primary"
                } hover:shadow-lg transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className={`font-medium mb-2 ${index % 2 === 0 ? "text-secondary" : "text-primary"}`}>
                    {member.position}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                  <div className="text-xs text-muted-foreground">{member.experience} years experience</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-16 bg-gradient-to-br from-muted/50 to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Board of <span className="text-secondary">Directors</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced leaders providing strategic guidance and oversight
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardMembers.map((member, index) => (
              <Card
                key={index}
                className={`text-center border-l-4 ${
                  index % 2 === 0 ? "border-l-secondary" : "border-l-primary"
                } hover:shadow-lg transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className={`text-sm mb-2 ${index % 2 === 0 ? "text-secondary" : "text-primary"}`}>
                    {member.position}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.background}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
