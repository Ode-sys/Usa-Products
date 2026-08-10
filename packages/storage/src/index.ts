// ============================================================
// Odé AI Platform — Storage (S3-compatible)
// ============================================================

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const s3 = new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = process.env.S3_BUCKET ?? "ode-platform-files";

// ─── Upload ───────────────────────────────────────────────────

export interface UploadResult {
  key: string;
  url: string;
}

export async function uploadFile(params: {
  tenantId: string;
  file: Buffer;
  filename: string;
  mimeType: string;
  moduleKey?: string;
}): Promise<UploadResult> {
  const ext = params.filename.split(".").pop() ?? "bin";
  const key = `${params.tenantId}/${params.moduleKey ?? "general"}/${nanoid(16)}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: params.file,
      ContentType: params.mimeType,
      Metadata: { tenantId: params.tenantId, originalName: params.filename },
    })
  );

  const url = `${process.env.S3_PUBLIC_URL}/${key}`;
  return { key, url };
}

// ─── Signed URL (private files) ───────────────────────────────

export async function getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn }
  );
}

// ─── Delete ───────────────────────────────────────────────────

export async function deleteFile(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

// ─── Pre-signed Upload URL (for direct browser upload) ────────

export async function getPresignedUploadUrl(params: {
  tenantId: string;
  filename: string;
  mimeType: string;
  moduleKey?: string;
}): Promise<{ uploadUrl: string; key: string }> {
  const ext = params.filename.split(".").pop() ?? "bin";
  const key = `${params.tenantId}/${params.moduleKey ?? "general"}/${nanoid(16)}.${ext}`;

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: params.mimeType }),
    { expiresIn: 300 } // 5 minutes
  );

  return { uploadUrl, key };
}

// ─── Allowed file types ───────────────────────────────────────

export const ALLOWED_MIME_TYPES = {
  AMAZON: ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain"],
  REPORTING: ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/pdf"],
  CONTENT: ["image/jpeg", "image/png", "image/webp", "video/mp4"],
};

export function isAllowedMimeType(mimeType: string, category: keyof typeof ALLOWED_MIME_TYPES): boolean {
  return ALLOWED_MIME_TYPES[category].includes(mimeType);
}

export const MAX_FILE_SIZES = {
  AMAZON: 50 * 1024 * 1024,     // 50MB
  REPORTING: 100 * 1024 * 1024, // 100MB
  CONTENT: 20 * 1024 * 1024,    // 20MB
};
