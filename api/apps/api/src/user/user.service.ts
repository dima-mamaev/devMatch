import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicService } from '../shared/services/basic.service';
import { Auth0Service } from '../shared/services/auth0.service';
import { User } from './models/user.entity';
import { PagingInput } from '../shared/inputs/paging.input';
import { UserFilterInput } from './inputs/user-filter.input';
import { UserSortInput } from './inputs/user-sort.input';
import { getPagingQuery } from '../shared/utils/get-paging-query';
import { DeveloperService } from '../developer/developer.service';
import { RecruiterService } from '../recruiter/recruiter.service';
import { MediaService } from '../media/media.service';
import { UserRole } from '../shared/enums/user-role.enum';

@Injectable()
export class UserService extends BasicService<User> {
  constructor(
    @InjectRepository(User) protected repository: Repository<User>,
    private readonly auth0Service: Auth0Service,
    @Inject(forwardRef(() => DeveloperService))
    private readonly developerService: DeveloperService,
    @Inject(forwardRef(() => RecruiterService))
    private readonly recruiterService: RecruiterService,
    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService,
  ) {
    super(repository);
  }

  async deleteUser(id: UUID) {
    const user = await this.findOneBy({ id });
    if (!user) {
      return { affected: 0 };
    }

    // Delete role-specific data
    if (user.role === UserRole.Developer) {
      const developer = await this.developerService.findByUserId(id);
      if (developer) {
        // Delete media from Cloudinary
        const mediaToDelete: UUID[] = [];
        if (developer.profilePhoto) {
          mediaToDelete.push(developer.profilePhoto.id);
        }
        if (developer.introVideo) {
          mediaToDelete.push(developer.introVideo.id);
        }
        if (developer.introVideoThumbnail) {
          mediaToDelete.push(developer.introVideoThumbnail.id);
        }
        if (mediaToDelete.length > 0) {
          await this.mediaService.deleteMedia(mediaToDelete);
        }

        // Soft delete developer (experiences, projects, shortlists cascade via DB)
        await this.developerService.softDeleteDeveloper(developer.id);
      }
    } else if (user.role === UserRole.Recruiter) {
      const recruiter = await this.recruiterService.findByUserId(id);
      if (recruiter) {
        await this.recruiterService.softDeleteRecruiter(recruiter.id);
      }
    }

    // Delete from Auth0
    await this.auth0Service.users.delete({
      id: user.auth0Id,
    });

    // Soft delete user (shortlists cascade via DB)
    await this.softRemove(user);

    return { affected: 1 };
  }

  async getUsersWithSortAndPaging(
    paging: PagingInput,
    filter: UserFilterInput = {},
    order?: UserSortInput,
  ) {
    const { skip, take } = getPagingQuery(paging);
    const { search } = filter;
    const [results, total] = await this.repository.findAndCount({
      ...(search && {
        where: [{ email: ILike(`%${search}%`) }],
      }),
      order,
      skip,
      take,
    });

    return { results, total, ...paging };
  }

  async changePassword(newPassword: string, user: User) {
    await this.auth0Service.users.update(
      { id: user.auth0Id },
      { password: newPassword },
    );
    return this.findOneBy({ id: user.id });
  }
}
