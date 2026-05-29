import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongodbUri);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
