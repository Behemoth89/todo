const MAX_FULL_SIZE = 2048;
const FULL_QUALITY = 80;
const THUMBNAIL_SIZE = 150;
const THUMBNAIL_QUALITY = 60;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface PhotoProcessingResult {
  data: Buffer;
  thumbnail: Buffer;
}

export function validatePhotoSize(buffer: Buffer): boolean {
  return buffer.length <= MAX_FILE_SIZE;
}

export async function convertToWebP(buffer: Buffer): Promise<PhotoProcessingResult> {
  const sharpModule = await import('sharp');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharpInstance: any = sharpModule.default ? sharpModule.default : sharpModule;
  
  const metadata = await sharpInstance(buffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  
  let fullWidth = width;
  let fullHeight = height;
  
  if (width > MAX_FULL_SIZE || height > MAX_FULL_SIZE) {
    if (width > height) {
      fullWidth = MAX_FULL_SIZE;
      fullHeight = Math.round((height / width) * MAX_FULL_SIZE);
    } else {
      fullHeight = MAX_FULL_SIZE;
      fullWidth = Math.round((width / height) * MAX_FULL_SIZE);
    }
  }
  
  const data = await sharpInstance(buffer)
    .resize(fullWidth, fullHeight, { fit: 'inside' })
    .webp({ quality: FULL_QUALITY })
    .toBuffer();
  
  const thumbnail = await sharpInstance(buffer)
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'cover' })
    .webp({ quality: THUMBNAIL_QUALITY })
    .toBuffer();
  
  return { data, thumbnail };
}

export async function generateThumbnail(buffer: Buffer): Promise<Buffer> {
  const sharpModule = await import('sharp');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharp: any = sharpModule.default ? sharpModule.default : sharpModule;
  return sharp(buffer)
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'cover' })
    .webp({ quality: THUMBNAIL_QUALITY })
    .toBuffer();
}