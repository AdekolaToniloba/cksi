import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-[#151C27] mb-6">Our Office</h2>
        
        <div className="space-y-6">
          {/* Address */}
          <div className="flex items-start gap-4">
            <MapPin className="h-5 w-5 text-cksi-brand-red mt-1 shrink-0" />
            <div>
              <h4 className="font-sans font-bold text-sm text-[#151C27] mb-1">Headquarters</h4>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                124 Health Avenue, Victoria Island<br />
                Lagos, Nigeria
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <Phone className="h-5 w-5 text-cksi-brand-red mt-1 shrink-0" />
            <div>
              <h4 className="font-sans font-bold text-sm text-[#151C27] mb-1">Phone</h4>
              <p className="font-sans text-sm text-gray-600">
                +234 1234 5678
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <Mail className="h-5 w-5 text-cksi-brand-red mt-1 shrink-0" />
            <div>
              <h4 className="font-sans font-bold text-sm text-[#151C27] mb-1">Email</h4>
              <p className="font-sans text-sm text-gray-600">
                hello@cksi.org
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-start gap-4">
            <Clock className="h-5 w-5 text-cksi-brand-red mt-1 shrink-0" />
            <div>
              <h4 className="font-sans font-bold text-sm text-[#151C27] mb-1">Working Hours</h4>
              <p className="font-sans text-sm text-gray-600">
                Mon - Fri, 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-[#EAEFF8] rounded-xl p-8 flex flex-col items-center justify-center text-center aspect-[4/3] sm:aspect-video lg:aspect-auto lg:h-[240px]">
        <MapPin className="h-8 w-8 text-cksi-brand-red mb-3" />
        <span className="font-sans font-bold text-[#151C27] text-sm mb-1">
          View on Map
        </span>
        <span className="font-sans text-xs text-gray-500">
          Get Directions
        </span>
      </div>
    </div>
  );
}
