// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not set in .env");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Starting MIMS seed...");

  // ── Units ──────────────────────────────────────────
  const centralCmd = await prisma.unit.upsert({
    where:  { code: "CC-HQ" },
    update: {},
    create: {
      name:  "Central Command HQ",
      code:  "CC-HQ",
      level: "CENTRAL_COMMAND",
    },
  });

  const northernDepot = await prisma.unit.upsert({
    where:  { code: "NR-DEP" },
    update: {},
    create: {
      name:     "Northern Regional Depot",
      code:     "NR-DEP",
      level:    "REGIONAL_DEPOT",
      parentId: centralCmd.id,
    },
  });

  const base1 = await prisma.unit.upsert({
    where:  { code: "21-MSC" },
    update: {},
    create: {
      name:     "21 Mountain Strike Corps",
      code:     "21-MSC",
      level:    "ARMY_BASE",
      parentId: northernDepot.id,
    },
  });

  const base2 = await prisma.unit.upsert({
    where:  { code: "14-CORPS" },
    update: {},
    create: {
      name:     "14 Corps Leh",
      code:     "14-CORPS",
      level:    "ARMY_BASE",
      parentId: northernDepot.id,
    },
  });

  console.log("✅ Units created");

  // ── Users ──────────────────────────────────────────
  const hash = (p: string) => bcrypt.hash(p, 12);

  await prisma.user.upsert({
    where:  { email: "admin@army.in" },
    update: {},
    create: {
      name:         "Gen. Arjun Singh",
      email:        "admin@army.in",
      passwordHash: await hash("Admin@123"),
      role:         "SUPER_ADMIN",
      commandLevel: "CENTRAL_COMMAND",
      unitId:       centralCmd.id,
    },
  });

  await prisma.user.upsert({
    where:  { email: "regional@army.in" },
    update: {},
    create: {
      name:         "Col. Vikram Nair",
      email:        "regional@army.in",
      passwordHash: await hash("Region@123"),
      role:         "REGIONAL_ADMIN",
      commandLevel: "REGIONAL_DEPOT",
      unitId:       northernDepot.id,
    },
  });

  await prisma.user.upsert({
    where:  { email: "officer@army.in" },
    update: {},
    create: {
      name:         "Maj. Priya Sharma",
      email:        "officer@army.in",
      passwordHash: await hash("Base@1234"),
      role:         "BASE_OFFICER",
      commandLevel: "ARMY_BASE",
      unitId:       base1.id,
    },
  });

  await prisma.user.upsert({
    where:  { email: "officer2@army.in" },
    update: {},
    create: {
      name:         "Capt. Rahul Mehra",
      email:        "officer2@army.in",
      passwordHash: await hash("Base@5678"),
      role:         "BASE_OFFICER",
      commandLevel: "ARMY_BASE",
      unitId:       base2.id,
    },
  });

  await prisma.user.upsert({
    where:  { email: "auditor@army.in" },
    update: {},
    create: {
      name:         "Audit Officer Sinha",
      email:        "auditor@army.in",
      passwordHash: await hash("Audit@123"),
      role:         "AUDITOR",
      commandLevel: "CENTRAL_COMMAND",
      unitId:       centralCmd.id,
    },
  });

  console.log("✅ Users created");

  // ── Items ──────────────────────────────────────────
  const ak47 = await prisma.item.upsert({
    where:  { code: "WPN-AK47" },
    update: {},
    create: {
      name:           "AK-47 Rifle",
      code:           "WPN-AK47",
      category:       "WEAPONS",
      unit:           "units",
      minThreshold:   20,
      specifications: { caliber: "7.62mm", capacity: 30, weight_kg: 3.47 },
    },
  });

  const pistol = await prisma.item.upsert({
    where:  { code: "WPN-9MM" },
    update: {},
    create: {
      name:           "9mm Pistol",
      code:           "WPN-9MM",
      category:       "WEAPONS",
      unit:           "units",
      minThreshold:   15,
      specifications: { caliber: "9mm", capacity: 15, weight_kg: 0.90 },
    },
  });

  const rationPack = await prisma.item.upsert({
    where:  { code: "FOOD-CRP" },
    update: {},
    create: {
      name:         "Combat Ration Pack",
      code:         "FOOD-CRP",
      category:     "FOOD",
      unit:         "packs",
      minThreshold: 500,
    },
  });

  const waterTab = await prisma.item.upsert({
    where:  { code: "FOOD-WPT" },
    update: {},
    create: {
      name:         "Water Purification Tablets",
      code:         "FOOD-WPT",
      category:     "FOOD",
      unit:         "boxes",
      minThreshold: 100,
    },
  });

  const firstAid = await prisma.item.upsert({
    where:  { code: "MED-FAK" },
    update: {},
    create: {
      name:         "First Aid Kit",
      code:         "MED-FAK",
      category:     "MEDICAL",
      unit:         "units",
      minThreshold: 50,
    },
  });

  const morphine = await prisma.item.upsert({
    where:  { code: "MED-MRP" },
    update: {},
    create: {
      name:         "Morphine Injection",
      code:         "MED-MRP",
      category:     "MEDICAL",
      unit:         "vials",
      minThreshold: 100,
    },
  });

  console.log("✅ Items created");

  // ── Stock Items ────────────────────────────────────
  const stockData = [
    // Base 1 — 21 Mountain Strike Corps
    { baseId: base1.id, itemId: ak47.id,       quantity: 150  },
    { baseId: base1.id, itemId: pistol.id,      quantity: 8   }, // low stock
    { baseId: base1.id, itemId: rationPack.id,  quantity: 2000 },
    { baseId: base1.id, itemId: waterTab.id,    quantity: 75  }, // low stock
    { baseId: base1.id, itemId: firstAid.id,    quantity: 120 },
    { baseId: base1.id, itemId: morphine.id,    quantity: 500 },

    // Base 2 — 14 Corps Leh
    { baseId: base2.id, itemId: ak47.id,        quantity: 18  }, // low stock
    { baseId: base2.id, itemId: pistol.id,       quantity: 40  },
    { baseId: base2.id, itemId: rationPack.id,   quantity: 1200 },
    { baseId: base2.id, itemId: waterTab.id,     quantity: 200 },
    { baseId: base2.id, itemId: firstAid.id,     quantity: 30  }, // low stock
    { baseId: base2.id, itemId: morphine.id,     quantity: 80  }, // low stock
  ];

  for (const stock of stockData) {
    await prisma.stockItem.upsert({
      where:  { baseId_itemId: { baseId: stock.baseId, itemId: stock.itemId } },
      update: { quantity: stock.quantity },
      create: stock,
    });
  }

  console.log("✅ Stock items created");

  // ── Batches ────────────────────────────────────────
  await prisma.batch.upsert({
    where:  { batchCode: "B-CRP-2501" },
    update: {},
    create: {
      itemId:          rationPack.id,
      batchCode:       "B-CRP-2501",
      quantity:        1000,
      remainingQty:    1000,
      manufactureDate: new Date("2025-01-01"),
      expiryDate:      new Date("2026-02-28"), // expiring soon
    },
  });

  await prisma.batch.upsert({
    where:  { batchCode: "B-CRP-2502" },
    update: {},
    create: {
      itemId:          rationPack.id,
      batchCode:       "B-CRP-2502",
      quantity:        1200,
      remainingQty:    1200,
      manufactureDate: new Date("2025-06-01"),
      expiryDate:      new Date("2027-05-31"),
    },
  });

  await prisma.batch.upsert({
    where:  { batchCode: "B-AK47-2401" },
    update: {},
    create: {
      itemId:             ak47.id,
      batchCode:          "B-AK47-2401",
      quantity:           200,
      remainingQty:       200,
      maintenanceDueDate: new Date("2026-03-01"), // due soon
    },
  });

  await prisma.batch.upsert({
    where:  { batchCode: "B-MRP-2501" },
    update: {},
    create: {
      itemId:          morphine.id,
      batchCode:       "B-MRP-2501",
      quantity:        300,
      remainingQty:    300,
      manufactureDate: new Date("2024-06-01"),
      expiryDate:      new Date("2026-05-31"),
    },
  });

  console.log("✅ Batches created");

  // ── Alerts (Low stock + expiry) ────────────────────
  const alertData = [
    {
      unitId:  base1.id,
      itemId:  pistol.id,
      type:    "LOW_STOCK"  as const,
      message: "Low stock: 9mm Pistol has 8 units at 21 Mountain Strike Corps (min: 15)",
    },
    {
      unitId:  base1.id,
      itemId:  waterTab.id,
      type:    "LOW_STOCK" as const,
      message: "Low stock: Water Purification Tablets has 75 boxes (min: 100)",
    },
    {
      unitId:  base2.id,
      itemId:  ak47.id,
      type:    "LOW_STOCK" as const,
      message: "Low stock: AK-47 Rifle has 18 units at 14 Corps Leh (min: 20)",
    },
    {
      unitId:  base2.id,
      itemId:  firstAid.id,
      type:    "LOW_STOCK" as const,
      message: "Low stock: First Aid Kit has 30 units at 14 Corps Leh (min: 50)",
    },
    {
      unitId:  base1.id,
      itemId:  rationPack.id,
      type:    "EXPIRY" as const,
      message: "Batch B-CRP-2501 of Combat Ration Pack expires on 28-Feb-2026",
    },
    {
      unitId:  base1.id,
      itemId:  ak47.id,
      type:    "MAINTENANCE_DUE" as const,
      message: "Batch B-AK47-2401: AK-47 maintenance due on 01-Mar-2026",
    },
  ];

  for (const alert of alertData) {
    await prisma.alert.create({ data: alert });
  }

  console.log("✅ Alerts created");

  // ── Sample Request ─────────────────────────────────
  const officer = await prisma.user.findUnique({
    where: { email: "officer@army.in" },
  });

  if (officer) {
    const existingReq = await prisma.request.findFirst({
      where: { fromUnitId: base1.id, toUnitId: northernDepot.id },
    });

    if (!existingReq) {
      await prisma.request.create({
        data: {
          fromUnitId:  base1.id,
          toUnitId:    northernDepot.id,
          createdById: officer.id,
          status:      "PENDING",
          isEmergency: false,
          remarks:     "Monthly resupply request",
          items: {
            create: [
              { itemId: ak47.id,      quantity: 50  },
              { itemId: rationPack.id, quantity: 500 },
              { itemId: morphine.id,   quantity: 200 },
            ],
          },
        },
      });
      console.log("✅ Sample request created");
    }
  }

  console.log("\n🎉 MIMS seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Login Credentials:");
  console.log("  👑 admin@army.in      → Admin@123  (Super Admin)");
  console.log("  🎖  regional@army.in  → Region@123 (Regional Admin)");
  console.log("  🪖  officer@army.in   → Base@1234  (Base Officer)");
  console.log("  🪖  officer2@army.in  → Base@5678  (Base Officer 2)");
  console.log("  🔍  auditor@army.in   → Audit@123  (Auditor)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
