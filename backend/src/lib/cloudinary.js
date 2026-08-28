import { v2 as cloudinary } from 'cloudinary';

const configured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const isCloudinaryConfigured = configured;

/**
 * Uploads an in-memory image buffer (from multer) to Cloudinary and
 * returns its secure URL. Images are auto-resized on the way in so we
 * never store unnecessarily large originals.
 */
export function uploadBuffer(buffer, { folder = 'raksha-bandhan' } = {}) {
  if (!configured) {
    return Promise.reject(
      new Error('Image uploads are not configured. Set CLOUDINARY_* env vars on the backend.')
    );
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1600, height: 1600, crop: 'limit' }, { quality: 'auto:good' }, { fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}
