import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedHero() {
  // Create sample hero items
  const heroItems = [
    {
      title: "Empowering Communities Through Education",
      description:
        "We provide quality education and healthcare services to underserved communities across Nigeria, creating lasting change for families and children.",
      ctaText: "Learn More",
      ctaLink: "/about",
      mediaUrl:
        "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1/cksi-uploads/hero-1.jpg",
      mediaType: "IMAGE" as const,
      orderIndex: 0,
    },
    {
      title: "Transforming Lives Through Healthcare",
      description:
        "Our comprehensive healthcare programs reach thousands of families, providing essential medical services and health education.",
      ctaText: "Our Programs",
      ctaLink: "/programs",
      mediaUrl:
        "https://res.cloudinary.com/dyhbo6rzr/image/upload/v1/cksi-uploads/hero-2.jpg",
      mediaType: "IMAGE" as const,
      orderIndex: 1,
    },
    {
      title: "Building Stronger Communities",
      description:
        "Through community development initiatives, we empower local leaders and create sustainable solutions for lasting impact.",
      ctaText: "Get Involved",
      ctaLink: "/volunteer",
      mediaUrl:
        "https://res.cloudinary.com/dyhbo6rzr/video/upload/v1/cksi-uploads/hero-video.mp4",
      mediaType: "VIDEO" as const,
      orderIndex: 2,
    },
  ];

  for (const item of heroItems) {
    await prisma.heroCarousel.upsert({
      where: { id: `hero-${item.orderIndex}` },
      update: item,
      create: { id: `hero-${item.orderIndex}`, ...item },
    });
  }

  console.log("Hero carousel items seeded successfully");
}

seedHero()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
