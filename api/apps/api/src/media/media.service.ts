import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UUID } from 'crypto';
import { Media } from './models/media.entity';
import { BasicService } from '../shared/services/basic.service';
import { FileUpload } from '../upload/model/upload';
import { MediaType } from '../shared/enums/media-type.enum';
import { MediaProcessingStatus } from '../shared/enums/media-processing-status.enum';
import { CloudinaryService } from '../shared/services/cloudinary.service';

@Injectable()
export class MediaService extends BasicService<Media> {
  constructor(
    @InjectRepository(Media)
    protected repository: Repository<Media>,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    super(repository);
  }

  async createMedia(files: FileUpload[], entityId: string, type: MediaType) {
    const uploadMethod = type === MediaType.Video
      ? this.cloudinaryService.uploadVideo.bind(this.cloudinaryService)
      : this.cloudinaryService.uploadImage.bind(this.cloudinaryService);

    const urls = await Promise.all(
      files.map(async (file, index) => {
        const publicId = `${entityId}_${Date.now()}${files.length > 1 ? `_${index}` : ''}`;
        return await uploadMethod(publicId, file.buffer);
      }),
    );
    return this.create(urls.map((url) => ({ url, type })));
  }

  async deleteMedia(ids: UUID[]) {
    const media = await this.find({ where: { id: In(ids) } });
    await Promise.all(
      media.map(async (item) => {
        const publicId = this.cloudinaryService.extractPublicId(item.url);
        if (publicId) {
          if (item.type === MediaType.Video) {
            await this.cloudinaryService.deleteVideo(publicId);
          } else {
            await this.cloudinaryService.deleteFile(publicId);
          }
        }
      }),
    );
    return this.delete({ id: In(ids) });
  }

  async updateProcessingStatus(id: UUID, status: MediaProcessingStatus): Promise<Media> {
    await this.repository.update(id, { processingStatus: status });
    return this.repository.findOneBy({ id }) as Promise<Media>;
  }

  async updateUrl(id: UUID, url: string): Promise<Media> {
    await this.repository.update(id, { url });
    return this.repository.findOneBy({ id }) as Promise<Media>;
  }
}
