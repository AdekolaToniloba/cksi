import { teamMembers } from "@/data/organization";

// Helper function to extract initials
function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

// Background colors for the avatars to match the design roughly
const avatarColors = [
  "bg-cksi-brand-red text-white",      // AT
  "bg-[#C6E4F3] text-[#4A6773]",       // AY
  "bg-[#6B6B6B] text-white",           // EO
  "bg-[#FCE6E4] text-cksi-brand-red",  // GA
  "bg-[#E2F2FA] text-[#4A6773]",       // DE
  "bg-[#EFEBE4] text-[#5C5549]",       // FH
];

export function TeamSection() {
  return (
    <section className="bg-cksi-warm py-20 lg:py-28">
      <div className="container px-4 md:px-6 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif text-cksi-dark">Our Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => {
            const avatarClass = avatarColors[index % avatarColors.length];
            return (
              <div 
                key={member.name} 
                className="bg-white rounded-xl border border-gray-100 p-8 pt-12 relative flex flex-col items-center text-center shadow-sm"
              >
                {/* Years of Experience Badge */}
                <div className="absolute top-4 right-4 bg-[#E5F0F9] text-[#4A6773] px-3 py-1 rounded-full text-xs font-sans font-medium">
                  {member.experience} yrs
                </div>

                {/* Avatar */}
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-xl sm:text-2xl font-serif mb-6 ${avatarClass}`}>
                  {getInitials(member.name)}
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-sans font-bold text-cksi-dark mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-sans font-medium text-cksi-brand-red mb-4">
                  {member.position}
                </p>
                <p className="text-sm font-sans text-cksi-body leading-relaxed max-w-xs">
                  {member.bio}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
