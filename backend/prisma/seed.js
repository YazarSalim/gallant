import "dotenv/config";
import prisma from "../models/index.js";
import bcrypt from "bcryptjs";

async function main() {

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Validate env variables
  if (!adminEmail || !adminPassword) {
    throw new Error(" ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env file");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Upsert admin user
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      username: "admin",
      email: adminEmail,
      password: hashedPassword,
      phone:"1234569870",
      role:"admin"
    },
  });

  await prisma.kpi.createMany({
    data: [
      { name: "BLP", code: "BLP" },
      { name: "COMP", code: "COMP" },
      { name: "RVLV / STM TRPTs", code: "RVLV_STM" },
      { name: "BOLT & GASKET", code: "BOLT_GASKET" },
      { name: "CV", code: "CV" },
      { name: "PSV", code: "PSV" },
      { name: "EXCH", code: "EXCH" },
    ],
    skipDuplicates: true,
  });

  await prisma.category.createMany({
    data: [
      { name: "Original Planned", code: "OP" },
      { name: "Scope Change", code: "SC" },
      { name: "Total Cumulative", code: "TC" },
      { name: "Opened/Pulled", code: "OPUL" },
      { name: "3rd Party Inspected", code: "TPI" },
      { name: "Closed/Installed", code: "CI" },
      { name: "% Closed/Installed", code: "PCT_CI" },
    ],
    skipDuplicates: true,
  });

  console.log(" Admin user seeded:", user.email);
}

main()
  .catch((e) => {
    console.error(" Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
