import { Quote, Building2, ShieldCheck, Globe2 } from "lucide-react";

export function DonateInfo() {
  return (
    <div className="flex flex-col gap-10 sticky top-24">
      {/* Impact Section */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#151C27] mb-8">
          Your Gift Creates Change
        </h2>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-gray-200 pb-4">
            <span className="font-sans font-bold text-[#151C27] min-w-[100px]">₦10,000</span>
            <span className="font-sans text-sm text-gray-600 sm:text-right mt-1 sm:mt-0">Provides essential medications for a child for one month.</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-gray-200 pb-4">
            <span className="font-sans font-bold text-[#151C27] min-w-[100px]">₦50,000</span>
            <span className="font-sans text-sm text-gray-600 sm:text-right mt-1 sm:mt-0">Covers comprehensive lab tests and screening.</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-gray-200 pb-4">
            <span className="font-sans font-bold text-[#151C27] min-w-[100px]">₦100,000</span>
            <span className="font-sans text-sm text-gray-600 sm:text-right mt-1 sm:mt-0">Funds community outreach and education programs.</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pb-4">
            <span className="font-sans font-bold text-[#151C27] min-w-[100px]">₦500,000+</span>
            <span className="font-sans text-sm text-gray-600 sm:text-right mt-1 sm:mt-0">Supports long-term care facilities and major interventions.</span>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-[#E6F3FA] rounded-2xl p-6 sm:p-8">
        <Quote className="h-8 w-8 text-cksi-brand-red mb-4" />
        <p className="font-serif text-lg text-[#0066CC] leading-relaxed italic mb-6">
          "The support from CKSI didn't just provide medical help; it gave our family hope when we felt completely overwhelmed. This community is a lifeline."
        </p>
        <p className="font-sans font-bold text-sm text-[#151C27]">
          — Adeola, Beneficiary
        </p>
      </div>

      {/* Trust & Transparency */}
      <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center border border-gray-100">
        <h3 className="font-sans font-bold text-xs tracking-[0.15em] text-[#151C27] uppercase mb-4">
          TRANSPARENCY & TRUST
        </h3>
        <p className="font-sans text-xs text-gray-500 leading-relaxed mb-6">
          CKSI is a registered Non-Governmental Organization in Nigeria. All donations are processed securely through Paystack. We are committed to financial transparency.
        </p>
        <div className="flex items-center justify-center gap-4 text-gray-400">
          <Building2 className="h-5 w-5" />
          <ShieldCheck className="h-5 w-5" />
          <Globe2 className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
