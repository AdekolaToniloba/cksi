import { boardMembers } from "@/data/organization";

// Helper function to extract initials
function getInitials(name: string) {
  // Remove titles like Prof., Mrs., Dr., Barr., Mr. for initials
  const cleanName = name.replace(/^(Prof\.|Mrs\.|Dr\.|Barr\.|Mr\.)\s+/i, "");
  return cleanName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

// Background colors for the avatars to match the design roughly
const avatarColors = [
  "bg-cksi-brand-red text-white",      // Prof. Chidi Okonkwo (CO)
  "bg-[#C6E4F3] text-[#4A6773]",       // Mrs. Kemi Adeleke (KA)
  "bg-[#6B6B6B] text-white",           // Dr. Ibrahim Musa (IM)
  "bg-[#FCE6E4] text-cksi-brand-red",  // Barr. Ngozi Okwu (NO)
  "bg-[#E2F2FA] text-[#4A6773]",       // Mr. Tunde Bakare (TB)
  "bg-[#EFEBE4] text-[#5C5549]",       // Dr. Aisha Abdullahi (AA)
];

export function BoardSection() {
  return (
    <section className="bg-[#C6E4F3] py-20 lg:py-28">
      <div className="container px-4 md:px-6 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif text-[#151C27]">
            Board of Directors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {boardMembers.map((member, index) => {
            const avatarClass = avatarColors[index % avatarColors.length];
            return (
              <div 
                key={member.name} 
                className="bg-white/80 sm:bg-white rounded-[20px] p-4 sm:p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-sans font-bold ${avatarClass}`}>
                  {getInitials(member.name)}
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <h3 className="text-base font-sans font-bold text-[#151C27] mb-0.5 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs font-sans text-cksi-body leading-tight">
                    {member.position}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
