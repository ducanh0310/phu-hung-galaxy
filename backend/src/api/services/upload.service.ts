import cloudinary from '../../config/cloudinary.js';
import { AppError } from '../../middlewares.js';
import { Readable } from 'stream';

class UploadService {
  /**
   * Uploads an image buffer to Cloudinary.
   * @param fileBuffer The buffer of the image file.
   * @returns A promise that resolves to the secure URL of the uploaded image.
   */
  public uploadImage(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!fileBuffer) {
        return reject(new AppError('No file buffer provided for upload.', 400));
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'gourmet-grove', // Optional: organize uploads in a folder
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new AppError('Image could not be uploaded.', 500));
          }
          if (!result) {
            return reject(new AppError('Cloudinary did not return a result.', 500));
          }
          resolve(result.secure_url);
        },
      );

      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }
}

export const uploadService = new UploadService();