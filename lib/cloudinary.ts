// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

// Server-side Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Client-side utility functions for Cloudinary URLs
export const buildCloudinaryUrl = (
  publicId: string,
  transformations?: string
) => {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  const transforms = transformations || "f_auto,q_auto";
  return `${baseUrl}/image/upload/${transforms}/${publicId}`;
};

export const buildVideoUrl = (publicId: string, transformations?: string) => {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  const transforms = transformations || "f_auto,q_auto";
  return `${baseUrl}/video/upload/${transforms}/${publicId}`;
};

// Responsive image transformations
export const getResponsiveImageUrl = (publicId: string, width: number) => {
  return buildCloudinaryUrl(publicId, `f_auto,q_auto,w_${width},c_limit`);
};

// Thumbnail generation
export const getThumbnailUrl = (
  publicId: string,
  width = 300,
  height = 300
) => {
  return buildCloudinaryUrl(
    publicId,
    `f_auto,q_auto,w_${width},h_${height},c_fill`
  );
};

// Video thumbnail
export const getVideoThumbnailUrl = (
  publicId: string,
  width = 300,
  height = 300
) => {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  return `${baseUrl}/video/upload/f_auto,q_auto,w_${width},h_${height},c_fill,so_auto/${publicId}.jpg`;
};

// Delete media from Cloudinary
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" = "image"
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

// Batch delete
export const batchDeleteFromCloudinary = async (
  publicIds: string[],
  resourceType: "image" | "video" = "image"
) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Error batch deleting from Cloudinary:", error);
    throw error;
  }
};
