import prisma from "../models/index.js"; // Your Prisma client
import bcrypt from "bcryptjs";

async function main() {
  // Hash the password
  const password = "admin123"; // default password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Seed user
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" }, // unique field
    update: {}, // do nothing if user exists
    create: {
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
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


  console.log("✅ User seeded:", user);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
