// app/volunteer/page.tsx
import { Metadata } from "next";
import { VolunteerForm } from "@/components/volunteer/volunteer-form";
import { VolunteerFAQ } from "@/components/volunteer/volunteer-faq";
import { Heart, Users, Clock, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Volunteer with CKSI | Make a Difference in Your Community",
  description:
    "Join CKSI's volunteer community and help transform lives through education, healthcare, and community development programs. Flexible opportunities available for all skill levels.",
  keywords: [
    "volunteer Nigeria",
    "volunteer opportunities",
    "community service",
    "CKSI volunteer",
    "social impact",
    "volunteer work",
    "give back",
    "community development",
  ],
  openGraph: {
    title: "Volunteer with CKSI | Make a Difference",
    description:
      "Transform lives through volunteering. Join CKSI and contribute your time and skills to meaningful community development projects.",
    type: "website",
  },
};

const impactStats = [
  {
    icon: Users,
    value: "500+",
    label: "Active Volunteers",
    description: "Dedicated individuals making a difference",
  },
  {
    icon: Heart,
    value: "10,000+",
    label: "Lives Impacted",
    description: "Through volunteer-led programs",
  },
  {
    icon: Clock,
    value: "25,000+",
    label: "Hours Served",
    description: "Contributing to community development",
  },
  {
    icon: Award,
    value: "50+",
    label: "Programs Supported",
    description: "Across education, health, and community",
  },
];

const volunteerBenefits = [
  {
    title: "Personal Growth",
    description:
      "Develop new skills, gain valuable experience, and expand your professional network while making a meaningful impact.",
  },
  {
    title: "Community Connection",
    description:
      "Build lasting relationships with like-minded individuals and connect deeply with the communities we serve.",
  },
  {
    title: "Flexible Commitment",
    description:
      "Choose opportunities that fit your schedule, from one-time events to ongoing programs that match your availability.",
  },
  {
    title: "Recognition & Support",
    description:
      "Receive comprehensive training, ongoing support, and recognition for your valuable contributions to our mission.",
  },
];

export default function VolunteerPage() {
  return (
    <main className="min-h-screen" data-testid="volunteer-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/0 to-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Volunteer with <span className="text-primary">CKSI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our community of passionate volunteers and help us create
              lasting change through education, healthcare, and community
              development programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a
                href="#volunteer-form"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                data-testid="hero-apply-button"
              >
                Apply to Volunteer
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                data-testid="hero-learn-more-button"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-muted/30" data-testid="impact-stats-section">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-background border hover:shadow-md transition-shadow"
                  data-testid={`impact-stat-${index}`}
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="font-semibold">{stat.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="py-16 md:py-24" data-testid="why-volunteer-section">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Volunteer with CKSI?
            </h2>
            <p className="text-lg text-muted-foreground">
              Volunteering is more than giving your time—it's about building
              connections, developing skills, and creating positive change in
              communities that need it most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {volunteerBenefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                data-testid={`benefit-card-${index}`}
              >
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Form Section */}
      <section
        id="volunteer-form"
        className="py-16 md:py-24 bg-muted/30"
        data-testid="volunteer-form-section"
      >
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Volunteer Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below to join our volunteer community. We'll
              review your application and get in touch within 5-7 business days.
            </p>
          </div>

          <VolunteerForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24" data-testid="faq-section">
        <div className="container px-4 md:px-6">
          <VolunteerFAQ />
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 bg-primary text-primary-foreground"
        data-testid="cta-section"
      >
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg opacity-90">
              Your time and talents can transform lives. Join CKSI today and be
              part of a movement creating lasting positive change in communities
              across Nigeria.
            </p>
            <a
              href="#volunteer-form"
              className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-8 py-3 text-sm font-medium hover:bg-background/90 transition-colors"
              data-testid="cta-button"
            >
              Apply Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
