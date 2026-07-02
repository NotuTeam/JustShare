import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadImage(
  buffer: Buffer,
  filename: string
): Promise<{ url: string; name: string }> {
  const base64 = buffer.toString("base64");
  const dataUri = `data:image/jpeg;base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "justshare",
    public_id: filename.replace(/\.[^/.]+$/, ""),
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    name: filename,
  };
}
