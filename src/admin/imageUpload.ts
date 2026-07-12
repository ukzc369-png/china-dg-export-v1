const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 700 * 1024;
const MAX_EDGE = 1600;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function optimizeUploadImage(file: File): Promise<File> {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error("Please upload a JPG, PNG or WebP image.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("The original image must be smaller than 20 MB.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot process images.");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.84;
  let blob: Blob | null = null;
  do {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    quality -= 0.08;
  } while (blob && blob.size > MAX_OUTPUT_BYTES && quality >= 0.52);

  if (!blob) throw new Error("Image compression failed. Please try another image.");
  const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "image";
  return new File([blob], `${baseName}.webp`, { type: "image/webp", lastModified: Date.now() });
}

export function imageSizeLabel(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
