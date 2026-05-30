import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
  mongodbUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/nexa-grow",
  accessTokenSecret:
    process.env.ACCESS_TOKEN_SECRET ?? "dev-access-token-secret-change-me",
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET ?? "dev-refresh-token-secret-change-me",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
};

export const isProduction = env.nodeEnv === "production";
