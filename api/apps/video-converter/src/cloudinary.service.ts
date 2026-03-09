import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import https from 'https';
import http from 'http';

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
    resourceType: 'image' | 'video' | 'raw' = 'video',
    folder = 'devmatch/videos',
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
      throw new InternalServerErrorException(err);
    }
  }

  async getFileStream(url: string): Promise<NodeJS.ReadableStream> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      protocol.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch file: ${response.statusCode}`));
          return;
        }
        resolve(response);
      }).on('error', reject);
    });
  }

  async getFileBuffer(url: string): Promise<Buffer> {
    const stream = await this.getFileStream(url);
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  extractPublicId(url: string): string | null {
    // Extract public_id from Cloudinary URL
    // e.g., https://res.cloudinary.com/cloud/video/upload/v123/folder/file.mp4
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  }

  async deleteVideo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      console.log('[Cloudinary] Deleted video:', publicId);
    } catch (err) {
      console.error('[Cloudinary] Failed to delete video:', publicId, err);
      // Don't throw - deletion failure shouldn't break the flow
    }
  }
}
