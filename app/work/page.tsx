import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OurWorkPage() {
  return (
    <div className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-blue-950 mb-4">Our Impact</h1>
        <p className="text-lg text-slate-600">
          We focus on three core pillars to build stronger families.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Repeat this block for Education, Health, Community */}
        {["Health", "Education", "Community"].map((item) => (
          <div
            key={item}
            className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all"
          >
            <h3 className="text-2xl font-bold text-blue-900 mb-4">{item}</h3>
            <p className="text-slate-600 mb-6">
              Detailed description of {item} initiatives...
            </p>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
