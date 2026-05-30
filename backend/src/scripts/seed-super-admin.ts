import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { randomBytes, randomUUID } from "node:crypto";
import { env } from "../config/env";
import { UserModel } from "../database/store";

const email = (process.env.SUPER_ADMIN_EMAIL ?? "superadmin@giotobangladesh.com")
  .trim()
  .toLowerCase();
const password = process.env.SUPER_ADMIN_PASSWORD ?? "SuperAdmin@12345";
const name = process.env.SUPER_ADMIN_NAME ?? "Super Admin";
const phone = process.env.SUPER_ADMIN_PHONE ?? "01900000000";

async function main() {
  await mongoose.connect(env.mongodbUri);

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await UserModel.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.phone = phone;
    existing.status = "Active";
    existing.role = "super-admin";
    existing.passwordHash = passwordHash;
    existing.referralCode = existing.referralCode || `GIOTO-${randomBytes(3).toString("hex").toUpperCase()}`;
    existing.joined = existing.joined || new Date().toISOString();
    await existing.save();
  } else {
    await UserModel.create({
      id: randomUUID(),
      name,
      email,
      phone,
      level: 1,
      status: "Active",
      referralCode: `GIOTO-${randomBytes(3).toString("hex").toUpperCase()}`,
      joined: new Date().toISOString(),
      earned: 0,
      referrals: 0,
      role: "super-admin",
      referredByUserId: null,
      referredByCode: null,
      passwordHash,
    });
  }

  console.log(`Super admin seeded: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
