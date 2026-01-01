import * as Minio from 'minio';

const endPoint = process.env.MINIO_ENDPOINT || '172.17.0.1';
const port = Number(process.env.MINIO_PORT || '9000');
const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
const bucketName = process.env.S3_BUCKET_NAME || 'resumes';

console.log({
  endPoint: endPoint,
  port: port,
  useSSL: false,
  accessKey: accessKey,
  secretKey: secretKey
});

export const minioClient = new Minio.Client({
  endPoint: endPoint,
  port: port,
  useSSL: false,
  accessKey: accessKey,
  secretKey: secretKey
});

export async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket '${bucketName}' created successfully.`);
    }
  } catch (err) {
    console.error("Error checking/creating bucket:", err);
  }
}
