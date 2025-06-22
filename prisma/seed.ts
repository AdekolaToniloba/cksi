// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@cksi.org" },
    update: {},
    create: {
      email: "admin@cksi.org",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ adminUser });

  // Create sample blog post
  const blogPost = await prisma.blogPost.create({
    data: {
      title: "Welcome to CKSI",
      slug: "welcome-to-cksi",
      excerpt:
        "Learn about our mission to empower communities through education and healthcare.",
      content: "This is the full content of the blog post...",
      category: "News",
      tags: ["welcome", "introduction"],
      status: "PUBLISHED",
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
  });

  console.log({ blogPost });

  // Create sample program
  const program = await prisma.program.create({
    data: {
      title: "Education for All",
      slug: "education-for-all",
      description: "Providing quality education to underserved communities",
      category: "Education",
      beneficiaries: "500+ children",
      location: "Lagos State",
      duration: "Ongoing",
      startDate: new Date("2024-01-01"),
      status: "ACTIVE",
      progress: 75,
      goal: "Educate 1000 children by 2026",
      achievements: ["Built 3 schools", "Trained 50 teachers"],
    },
  });

  console.log({ program });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
