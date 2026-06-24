import Image from "next/image";
import { boardMembers } from "@/data/organization";

function getInitials(name: string) {
  const cleanName = name.replace(/^(Prof\.|Mrs\.|Dr\.|Barr\.|Mr\.|Mr)\s+/i, "");
  return cleanName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

const avatarColors = [
  "bg-cksi-brand-red text-white",
  "bg-[#C6E4F3] text-[#4A6773]",
  "bg-[#6B6B6B] text-white",
  "bg-[#FCE6E4] text-cksi-brand-red",
  "bg-[#E2F2FA] text-[#4A6773]",
  "bg-[#EFEBE4] text-[#5C5549]",
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
                className="group bg-white/85 sm:bg-white rounded-[24px] border border-white/70 p-4 sm:p-5 flex items-center gap-4 shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-white hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div
                  aria-hidden="true"
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-full ring-4 ring-white shadow-sm transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none ${member.image ? "bg-white" : avatarClass}`}
                >
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 80px, 64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-lg sm:text-xl font-sans font-bold">
                      {getInitials(member.name)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <h3 className="text-base font-sans font-bold text-[#151C27] mb-0.5 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-cksi-body leading-tight">
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
