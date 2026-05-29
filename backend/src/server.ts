import { createApp } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./database/connection";
import { seedDatabase } from "./database/seed";

async function bootstrap() {
  await connectDatabase();
  await seedDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`GIOTO API running on http://localhost:${env.port}`);
    console.log("MongoDB connected");
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start GIOTO API", error);
  process.exit(1);
});
