import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { env } from "../../config/env";
import { ok } from "../../utils/api-response";
import { HttpError } from "../../utils/http-error";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export const productImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new HttpError(400, "Only image files are allowed"));
      return;
    }

    callback(null, true);
  },
}).single("image");

function uploadBuffer(buffer: Buffer): Promise<UploadApiResponse> {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new HttpError(500, "Cloudinary is not configured");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "nexa-grow/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Image upload failed"));
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
}

export async function uploadProductImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new HttpError(400, "Product image is required");
    }

    const uploaded = await uploadBuffer(req.file.buffer);
    res.status(201).json(
      ok(
        {
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
        },
        "Image uploaded",
      ),
    );
  } catch (error) {
    next(error);
  }
}
