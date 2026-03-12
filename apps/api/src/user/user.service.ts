import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicService } from '../shared/services/basic.service';
import { Auth0Service } from '../shared/services/auth0.service';
import { User } from './models/user.entity';
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

    if (user.role === UserRole.Developer) {
      const developer = await this.developerService.findByUserId(id);
      if (developer) {
        const mediaToDelete: UUID[] = [];
        if (developer.profilePhoto) {
          mediaToDelete.push(developer.profilePhoto.id);
        }
        if (developer.introVideo) {
          mediaToDelete.push(developer.introVideo.id);
        }
        if (mediaToDelete.length > 0) {
          await this.mediaService.deleteMedia(mediaToDelete);
        }

        await this.developerService.hardDeleteDeveloper(developer.id);
      }
    } else if (user.role === UserRole.Recruiter) {
      const recruiter = await this.recruiterService.findByUserId(id);
      if (recruiter) {
        await this.recruiterService.hardDeleteRecruiter(recruiter.id);
      }
    }

    await this.auth0Service.users.delete({
      id: user.auth0Id,
    });

    await this.delete({ id });

    return { affected: 1 };
  }

}
