import Image from "next/image";
import { teamMembers } from "@/data/organization";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

const avatarColors = [
  "bg-cksi-brand-red text-white",
  "bg-[#C6E4F3] text-[#4A6773]",
  "bg-[#6B6B6B] text-white",
  "bg-[#FCE6E4] text-cksi-brand-red",
  "bg-[#E2F2FA] text-[#4A6773]",
  "bg-[#EFEBE4] text-[#5C5549]",
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
                className="group bg-white rounded-xl border border-gray-100 p-8 pt-12 relative flex flex-col items-center text-center shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-white hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {member.experience ? (
                  <div className="absolute top-4 right-4 bg-[#E5F0F9] text-[#4A6773] px-3 py-1 rounded-full text-xs font-sans font-medium">
                    {member.experience} yrs
                  </div>
                ) : null}

                <div
                  aria-hidden="true"
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-full flex items-center justify-center text-xl sm:text-2xl font-serif mb-6 shadow-sm ring-4 ring-white transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none ${member.image ? "bg-white" : avatarClass}`}
                >
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 96px, 80px"
                      className="object-cover"
                    />
                  ) : (
                    getInitials(member.name)
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-sans font-bold text-cksi-dark mb-1">
                  {member.name}
                </h3>
                <p className={`text-sm font-sans font-medium text-cksi-brand-red ${member.bio ? "mb-4" : "mb-0"}`}>
                  {member.position}
                </p>
                {member.bio ? (
                  <p className="text-sm font-sans text-cksi-body leading-relaxed max-w-xs">
                    {member.bio}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
