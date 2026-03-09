import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { GraphQLError } from 'graphql';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    publicId: string,
    data: Buffer,
    resourceType: 'image' | 'video' | 'raw' = 'image',
    folder = 'devmatch',
  ): Promise<string> {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: publicId,
              resource_type: resourceType,
              folder,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!);
            },
          )
          .end(data);
      });

      return result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw new GraphQLError('Upload error', {
        extensions: { code: 'UPLOAD_ERROR' },
      });
    }
  }

  async uploadVideo(publicId: string, data: Buffer, folder = 'devmatch/videos'): Promise<string> {
    return this.uploadFile(publicId, data, 'video', folder);
  }

  async uploadImage(publicId: string, data: Buffer, folder = 'devmatch/avatars'): Promise<string> {
    return this.uploadFile(publicId, data, 'image', folder);
  }

  async uploadThumbnail(publicId: string, data: Buffer): Promise<string> {
    return this.uploadFile(publicId, data, 'image', 'devmatch/thumbnails');
  }

  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
      console.error('Cloudinary delete error:', err);
      throw new InternalServerErrorException(err);
    }
  }

  async deleteVideo(publicId: string): Promise<void> {
    return this.deleteFile(publicId, 'video');
  }

  // Extract public_id from Cloudinary URL for deletion
  extractPublicId(url: string): string {
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/public_id.ext
    const matches = url.match(/\/v\d+\/(.+)\.[^.]+$/);
    return matches ? matches[1] : '';
  }

  // Get video thumbnail URL (Cloudinary generates automatically)
  getVideoThumbnailUrl(videoUrl: string, options: { width?: number; height?: number; second?: number } = {}): string {
    const { width = 640, height = 360, second = 1 } = options;
    // Transform video URL to thumbnail URL
    // From: .../video/upload/v123/folder/video.mp4
    // To:   .../video/upload/so_1,w_640,h_360,c_fill,f_jpg/v123/folder/video.jpg
    return videoUrl.replace(
      '/video/upload/',
      `/video/upload/so_${second},w_${width},h_${height},c_fill,f_jpg/`,
    ).replace(/\.[^.]+$/, '.jpg');
  }
}
