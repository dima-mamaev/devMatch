import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(publicId: string, data: Buffer, folder = 'devmatch/thumbnails'): Promise<string> {
    console.log('[Cloudinary] Uploading thumbnail...');
    console.log('[Cloudinary] publicId:', publicId);
    console.log('[Cloudinary] folder:', folder);
    console.log('[Cloudinary] buffer size:', data.length);

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: publicId,
              resource_type: 'image',
              folder,
            },
            (error, result) => {
              if (error) {
                console.error('[Cloudinary] Upload error:', error);
                reject(error);
              } else {
                console.log('[Cloudinary] Upload success:', result?.secure_url);
                resolve(result!);
              }
            },
          )
          .end(data);
      });

      return result.secure_url;
    } catch (err) {
      console.error('[Cloudinary] Upload failed:', err);
      throw new InternalServerErrorException(err);
    }
  }
}
