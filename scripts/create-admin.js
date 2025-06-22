// scripts/create-admin.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user in Neon database
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@cksi.org",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created:", adminUser);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
