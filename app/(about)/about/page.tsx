import type { Metadata } from "next"
import { organizationInfo } from "@/data/organization"
import { Flag, Eye, Heart, Shield, Users, FlaskConical, Globe } from "lucide-react"
import { AboutJourney } from "@/components/about-journey"

export const metadata: Metadata = {
  title: "About Us - CKSI",
  description:
    "Learn about Couples and Kids Social Initiatives (CKSI), our mission, vision, team, and impact in Nigerian communities.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container px-4 md:px-6 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left Content */}
            <div className="flex flex-col">
              <span className="block text-[11px] sm:text-xs font-sans font-bold tracking-widest text-cksi-brand-red uppercase mb-4">
                ABOUT CKSI
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif text-cksi-dark leading-[1.1] mb-8">
                Our Story, Our Mission, Our People
              </h1>
              <p className="text-base sm:text-lg font-sans text-cksi-body leading-relaxed max-w-xl">
                We are a coalition of advocates, medical professionals, and community leaders dedicated to reshaping the narrative around sickle cell disorder in Nigeria. Through empathy and action, we build a future defined by hope.
              </p>
            </div>

            {/* Right Stats */}
            <div className="flex flex-col justify-center space-y-12 lg:pl-20 border-t border-gray-200 pt-12 lg:border-t-0 lg:pt-0 lg:border-l lg:border-gray-200">
              <div className="flex flex-col">
                <span className="text-5xl lg:text-6xl font-serif text-cksi-brand-red mb-2">
                  {organizationInfo.founded ? `${new Date().getFullYear() - parseInt(organizationInfo.founded)}+` : "14+"}
                </span>
                <span className="text-[10px] sm:text-xs font-sans font-bold text-cksi-body tracking-widest uppercase">
                  Years of Advocacy
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-5xl lg:text-6xl font-serif text-cksi-brand-red mb-2">50k</span>
                <span className="text-[10px] sm:text-xs font-sans font-bold text-cksi-body tracking-widest uppercase">
                  Lives Touched
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-5xl lg:text-6xl font-serif text-cksi-brand-red mb-2">12</span>
                <span className="text-[10px] sm:text-xs font-sans font-bold text-cksi-body tracking-widest uppercase">
                  Community Centers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white rounded-[24px] p-8 sm:p-12 shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="w-12 h-12 rounded-full bg-cksi-brand-red/10 flex items-center justify-center mb-8">
                <Flag className="h-5 w-5 text-cksi-brand-red" />
              </div>
              <h2 className="text-3xl font-serif text-cksi-dark mb-6">Our Mission</h2>
              <p className="font-sans text-cksi-body leading-relaxed text-base">
                To empower individuals and families affected by sickle cell disorder through comprehensive support, evidence-based education, and unwavering advocacy. We strive to dismantle stigma and ensure equitable access to quality healthcare across all communities.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-[#C6E4F3] rounded-[24px] p-8 sm:p-12 shadow-sm border border-[#C9E7F6] flex flex-col items-start">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-8">
                <Eye className="h-5 w-5 text-[#4A6773]" />
              </div>
              <h2 className="text-3xl font-serif text-cksi-dark mb-6">Our Vision</h2>
              <p className="font-sans text-[#4A6773] leading-relaxed text-base">
                A society where every person living with sickle cell disorder can thrive without limitations. We envision a healthcare ecosystem that is culturally sensitive, universally accessible, and driven by continuous innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-24">
        <div className="container px-4 md:px-6 max-w-[1400px] mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-serif text-cksi-dark mb-6">Our Values</h2>
            <p className="text-base font-sans text-cksi-body">
              The principles that guide our daily interactions, our strategic decisions, and our commitment to the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
              <Heart className="h-6 w-6 text-cksi-brand-red mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-sans font-bold text-cksi-dark mb-3">Compassion</h3>
              <p className="font-sans text-sm text-cksi-body">Putting empathy at the core of every patient and family interaction.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
              <Shield className="h-6 w-6 text-cksi-brand-red mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-sans font-bold text-cksi-dark mb-3">Transparency</h3>
              <p className="font-sans text-sm text-cksi-body">Maintaining open, honest communication with our donors and the public.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
              <Users className="h-6 w-6 text-cksi-brand-red mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-sans font-bold text-cksi-dark mb-3">Community</h3>
              <p className="font-sans text-sm text-cksi-body">Building strong, resilient networks of support across neighborhoods.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
              <FlaskConical className="h-6 w-6 text-cksi-brand-red mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-sans font-bold text-cksi-dark mb-3">Evidence-Based</h3>
              <p className="font-sans text-sm text-cksi-body">Grounding our programs and advocacy in the latest medical research and verifiable data to ensure maximum impact.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
              <Globe className="h-6 w-6 text-cksi-brand-red mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-sans font-bold text-cksi-dark mb-3">Cultural Sensitivity</h3>
              <p className="font-sans text-sm text-cksi-body">Respecting and integrating local traditions and nuances into our outreach to build genuine, lasting trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <AboutJourney history={organizationInfo.history} />
    </main>
  )
}
