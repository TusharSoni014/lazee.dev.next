import { S3Client } from "@aws-sdk/client-s3";

export function getS3Client() {
  const cloudflareBucketUrl = process.env.CLOUDFLARE_S3_BUCKET || "";
  let endpointUrl = "https://example.r2.cloudflarestorage.com";
  let bucketName = "lazee-dev";

  try {
    if (cloudflareBucketUrl) {
      const url = new URL(cloudflareBucketUrl);
      endpointUrl = `${url.protocol}//${url.host}`;
      bucketName = url.pathname.slice(1);
    }
  } catch (e) {
    console.error("Failed to parse CLOUDFLARE_S3_BUCKET", e);
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: endpointUrl,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "mock-access-key",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "mock-secret-key",
    },
  });

  return { s3, bucketName };
}
