import type { Metadata } from "next"
import { LeadershipHero } from "@/components/about/leadership/leadership-hero"
import { TeamSection } from "@/components/about/leadership/team-section"
import { BoardSection } from "@/components/about/leadership/board-section"

export const metadata: Metadata = {
  title: "Leadership - CKSI",
  description:
    "Meet the dedicated professionals and board of directors working behind the scenes at Couples and Kids Social Initiatives (CKSI).",
}

export default function LeadershipPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <LeadershipHero />
      <TeamSection />
      <BoardSection />
    </main>
  )
}
