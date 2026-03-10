import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { UUID } from 'crypto';
import { Developer } from './models/developer.entity';
import { Experience } from './models/experience.entity';
import { Project } from './models/project.entity';
import { Media } from '../media/models/media.entity';
import { DeveloperService } from './developer.service';
import { MediaService } from '../media/media.service';
import { ConverterQueueService } from '../queues/converter-queue.service';
import { UpdateDeveloperInput } from './inputs/update-developer.input';
import { CreateExperienceInput } from './inputs/create-experience.input';
import { UpdateExperienceInput } from './inputs/update-experience.input';
import { CreateProjectInput } from './inputs/create-project.input';
import { UpdateProjectInput } from './inputs/update-project.input';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { User } from '../user/models/user.entity';
import { CustomUpload } from '../custom-upload/model/upload';
import { MediaType } from '../shared/enums/media-type.enum';
import { MediaProcessingStatus } from '../shared/enums/media-processing-status.enum';
import { CloudinaryService } from '../shared/services/cloudinary.service';

@Resolver(() => Developer)
export class DeveloperMutationResolver {
  constructor(
    private readonly developerService: DeveloperService,
    private readonly mediaService: MediaService,
    private readonly converterQueueService: ConverterQueueService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  private async getDeveloperOrFail(userId: UUID): Promise<Developer> {
    const developer = await this.developerService.findByUserId(userId);
    if (!developer) {
      throw new NotFoundException('Developer profile not found');
    }
    return developer;
  }

  @Mutation(() => Developer, { description: 'Create initial developer profile' })
  @Roles([UserRole.Developer])
  async createDeveloperProfile(
    @ActiveUser() user: User,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ): Promise<Developer> {
    const existing = await this.developerService.findByUserId(user.id);
    if (existing) {
      throw new ForbiddenException('Developer profile already exists');
    }
    return this.developerService.createDeveloper(user, firstName, lastName);
  }

  @Mutation(() => Developer, { description: 'Update developer profile (creates if not exists)' })
  @Roles([UserRole.Developer])
  async updateDeveloperProfile(
    @ActiveUser() user: User,
    @Args('input') input: UpdateDeveloperInput,
  ): Promise<Developer> {
    let developer = await this.developerService.findByUserId(user.id);

    if (!developer) {
      if (!input.firstName || !input.lastName) {
        throw new NotFoundException(
          'Developer profile not found. firstName and lastName are required to create a new profile.',
        );
      }
      developer = await this.developerService.createDeveloper(
        user,
        input.firstName,
        input.lastName,
      );
    }

    return this.developerService.updateDeveloper(developer.id, input);
  }

  @Mutation(() => Media, { description: 'Upload profile photo (direct S3 upload)' })
  @Roles([UserRole.Developer])
  async uploadProfilePhoto(
    @ActiveUser() user: User,
    @Args('file', { type: () => CustomUpload }) file: CustomUpload,
  ): Promise<Media> {
    console.log('[uploadProfilePhoto] file received:', {
      filename: file.filename,
      mimetype: file.mimetype,
      bufferExists: !!file.buffer,
      bufferLength: file.buffer?.length,
    });

    const developer = await this.getDeveloperOrFail(user.id);
    console.log('[uploadProfilePhoto] developer found:', developer.id);

    const oldPhotoId = developer.profilePhoto?.id;

    const [media] = await this.mediaService.createMedia([file], developer.id, MediaType.Image);
    await this.developerService.updateProfilePhoto(developer.id, media.id);

    if (oldPhotoId) {
      await this.mediaService.deleteMedia([oldPhotoId]);
    }

    return media;
  }

  @Mutation(() => Boolean, { description: 'Delete profile photo' })
  @Roles([UserRole.Developer])
  async deleteProfilePhoto(@ActiveUser() user: User): Promise<boolean> {
    const developer = await this.getDeveloperOrFail(user.id);

    if (developer.profilePhoto) {
      await this.mediaService.deleteMedia([developer.profilePhoto.id]);
      await this.developerService.updateProfilePhoto(developer.id, null);
    }

    return true;
  }

  @Mutation(() => Boolean, { description: 'Upload intro video (queued for processing)' })
  @Roles([UserRole.Developer])
  async uploadIntroVideo(
    @ActiveUser() user: User,
    @Args('file', { type: () => CustomUpload }) file: CustomUpload,
  ): Promise<boolean> {
    const developer = await this.getDeveloperOrFail(user.id);

    if (developer.introVideo) {
      await this.mediaService.deleteMedia([developer.introVideo.id]);
    }
    if (developer.introVideoThumbnail) {
      await this.mediaService.deleteMedia([developer.introVideoThumbnail.id]);
    }
    const publicId = `${developer.id}_${Date.now()}`;
    const url = await this.cloudinaryService.uploadVideo(
      publicId,
      file.buffer,
      'devmatch/videos-temp',
    );

    const [placeholderMedia] = await this.mediaService.create([
      {
        url: url,
        type: MediaType.Video,
        processingStatus: MediaProcessingStatus.Processing,
      },
    ]);

    await this.developerService.updateIntroVideo(developer.id, placeholderMedia.id);

    await this.converterQueueService.enqueueConvertVideo({
      inputPath: url,
      developerId: developer.id,
      videoMediaId: placeholderMedia.id,
    });

    return true;
  }

  @Mutation(() => Boolean, { description: 'Delete intro video and thumbnail' })
  @Roles([UserRole.Developer])
  async deleteIntroVideo(@ActiveUser() user: User): Promise<boolean> {
    const developer = await this.getDeveloperOrFail(user.id);

    if (developer.introVideo) {
      await this.mediaService.deleteMedia([developer.introVideo.id]);
    }
    if (developer.introVideoThumbnail) {
      await this.mediaService.deleteMedia([developer.introVideoThumbnail.id]);
    }
    await this.developerService.updateIntroVideo(developer.id, null, null);

    return true;
  }

  @Mutation(() => Experience, { description: 'Add work experience' })
  @Roles([UserRole.Developer])
  async addExperience(
    @ActiveUser() user: User,
    @Args('input') input: CreateExperienceInput,
  ): Promise<Experience> {
    const developer = await this.getDeveloperOrFail(user.id);
    return this.developerService.addExperience(developer.id, input);
  }

  @Mutation(() => Experience, { description: 'Update work experience' })
  @Roles([UserRole.Developer])
  async updateExperience(
    @ActiveUser() user: User,
    @Args('input') input: UpdateExperienceInput,
  ): Promise<Experience> {
    const developer = await this.getDeveloperOrFail(user.id);
    return this.developerService.updateExperience(developer.id, input);
  }

  @Mutation(() => Boolean, { description: 'Delete work experience' })
  @Roles([UserRole.Developer])
  async deleteExperience(
    @ActiveUser() user: User,
    @Args('id', { type: () => ID }) experienceId: UUID,
  ): Promise<boolean> {
    const developer = await this.getDeveloperOrFail(user.id);
    return this.developerService.deleteExperience(developer.id, experienceId);
  }

  @Mutation(() => Project, { description: 'Add portfolio project' })
  @Roles([UserRole.Developer])
  async addProject(
    @ActiveUser() user: User,
    @Args('input') input: CreateProjectInput,
  ): Promise<Project> {
    const developer = await this.getDeveloperOrFail(user.id);
    return this.developerService.addProject(developer.id, input);
  }

  @Mutation(() => Project, { description: 'Update portfolio project' })
  @Roles([UserRole.Developer])
  async updateProject(
    @ActiveUser() user: User,
    @Args('input') input: UpdateProjectInput,
  ): Promise<Project> {
    const developer = await this.getDeveloperOrFail(user.id);
    return this.developerService.updateProject(developer.id, input);
  }

  @Mutation(() => Boolean, { description: 'Delete portfolio project' })
  @Roles([UserRole.Developer])
  async deleteProject(
    @ActiveUser() user: User,
    @Args('id', { type: () => ID }) projectId: UUID,
  ): Promise<boolean> {
    const developer = await this.getDeveloperOrFail(user.id);
    return this.developerService.deleteProject(developer.id, projectId);
  }
}
