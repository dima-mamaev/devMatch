import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicService } from '../shared/services/basic.service';
import { Developer } from './models/developer.entity';
import { Experience } from './models/experience.entity';
import { Project } from './models/project.entity';
import { PagingInput } from '../shared/inputs/paging.input';
import { DeveloperFilterInput } from './inputs/developer-filter.input';
import { DeveloperSortInput } from './inputs/developer-sort.input';
import { getPagingQuery } from '../shared/utils/get-paging-query';
import { UpdateDeveloperInput } from './inputs/update-developer.input';
import { CreateExperienceInput } from './inputs/create-experience.input';
import { UpdateExperienceInput } from './inputs/update-experience.input';
import { CreateProjectInput } from './inputs/create-project.input';
import { UpdateProjectInput } from './inputs/update-project.input';
import { User } from '../user/models/user.entity';

@Injectable()
export class DeveloperService extends BasicService<Developer> {
  constructor(
    @InjectRepository(Developer)
    protected repository: Repository<Developer>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {
    super(repository);
  }

  async findByUserId(userId: UUID): Promise<Developer | null> {
    return this.repository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'profilePhoto', 'introVideo', 'introVideoThumbnail', 'experiences', 'projects'],
    });
  }

  async findById(id: UUID): Promise<Developer | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'profilePhoto', 'introVideo', 'introVideoThumbnail', 'experiences', 'projects'],
    });
  }

  async createDeveloper(user: User, firstName: string, lastName: string): Promise<Developer> {
    const developer = this.repository.create({
      user,
      firstName,
      lastName,
      techStack: [],
    });
    return this.repository.save(developer);
  }

  async updateDeveloper(
    developerId: UUID,
    input: UpdateDeveloperInput,
  ): Promise<Developer> {
    await this.repository.update(developerId, input);
    return this.findById(developerId) as Promise<Developer>;
  }

  async getDevelopersWithPaging(
    paging: PagingInput,
    filter: DeveloperFilterInput = {},
    order?: DeveloperSortInput,
  ) {
    const { skip, take } = getPagingQuery(paging);
    const {
      ids,
      excludeIds,
      search,
      techStack,
      location,
      seniorityLevels,
      availabilityStatus,
      hasIntroVideo,
    } = filter;

    const queryBuilder = this.repository.createQueryBuilder('developer')
      .leftJoinAndSelect('developer.user', 'user')
      .leftJoinAndSelect('developer.profilePhoto', 'profilePhoto')
      .leftJoinAndSelect('developer.introVideo', 'introVideo')
      .leftJoinAndSelect('developer.introVideoThumbnail', 'introVideoThumbnail')
      .leftJoinAndSelect('developer.experiences', 'experiences')
      .leftJoinAndSelect('developer.projects', 'projects');

    if (ids && ids.length > 0) {
      queryBuilder.andWhere('developer.id IN (:...ids)', { ids });
    }

    if (excludeIds && excludeIds.length > 0) {
      queryBuilder.andWhere('developer.id NOT IN (:...excludeIds)', { excludeIds });
    }

    if (search) {
      queryBuilder.andWhere(
        '(developer.firstName ILIKE :search OR developer.lastName ILIKE :search OR developer.jobTitle ILIKE :search OR developer.bio ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (techStack && techStack.length > 0) {
      queryBuilder.andWhere('developer.techStack && :techStack', { techStack });
    }

    if (location) {
      queryBuilder.andWhere('developer.location ILIKE :location', { location: `%${location}%` });
    }

    if (seniorityLevels && seniorityLevels.length > 0) {
      queryBuilder.andWhere('developer.seniorityLevel IN (:...seniorityLevels)', { seniorityLevels });
    }

    if (availabilityStatus && availabilityStatus.length > 0) {
      queryBuilder.andWhere('developer.availabilityStatus IN (:...availabilityStatus)', { availabilityStatus });
    }

    if (hasIntroVideo === true) {
      queryBuilder.andWhere('introVideo.id IS NOT NULL');
    } else if (hasIntroVideo === false) {
      queryBuilder.andWhere('introVideo.id IS NULL');
    }

    if (order) {
      Object.entries(order).forEach(([key, value]) => {
        if (value) {
          queryBuilder.addOrderBy(`developer.${key}`, value);
        }
      });
    } else {
      queryBuilder.orderBy('developer.createdAt', 'DESC');
    }

    const [results, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { results, total, ...paging };
  }

  async softDeleteDeveloper(developerId: UUID): Promise<boolean> {
    const result = await this.repository.softDelete(developerId);
    return (result.affected ?? 0) > 0;
  }

  async hardDeleteDeveloper(developerId: UUID): Promise<boolean> {
    const result = await this.repository.delete(developerId);
    return (result.affected ?? 0) > 0;
  }

  async addExperience(developerId: UUID, input: CreateExperienceInput): Promise<Experience> {
    const developer = await this.findById(developerId);
    if (!developer) {
      throw new Error('Developer not found');
    }

    const experience = this.experienceRepository.create({
      ...input,
      developer,
    });
    return this.experienceRepository.save(experience);
  }

  async updateExperience(
    developerId: UUID,
    input: UpdateExperienceInput,
  ): Promise<Experience> {
    const experience = await this.experienceRepository.findOne({
      where: { id: input.id, developer: { id: developerId } },
    });

    if (!experience) {
      throw new Error('Experience not found or not owned by developer');
    }

    const { id, ...updateData } = input;
    await this.experienceRepository.update(id, updateData);
    return this.experienceRepository.findOneBy({ id }) as Promise<Experience>;
  }

  async deleteExperience(developerId: UUID, experienceId: UUID): Promise<boolean> {
    const result = await this.experienceRepository.delete({
      id: experienceId,
      developer: { id: developerId },
    });
    return (result.affected ?? 0) > 0;
  }

  async addProject(developerId: UUID, input: CreateProjectInput): Promise<Project> {
    const developer = await this.findById(developerId);
    if (!developer) {
      throw new Error('Developer not found');
    }

    const project = this.projectRepository.create({
      ...input,
      techStack: input.techStack ?? [],
      developer,
    });
    return this.projectRepository.save(project);
  }

  async updateProject(
    developerId: UUID,
    input: UpdateProjectInput,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: input.id, developer: { id: developerId } },
    });

    if (!project) {
      throw new Error('Project not found or not owned by developer');
    }

    const { id, ...updateData } = input;
    await this.projectRepository.update(id, updateData);
    return this.projectRepository.findOneBy({ id }) as Promise<Project>;
  }

  async deleteProject(developerId: UUID, projectId: UUID): Promise<boolean> {
    const result = await this.projectRepository.delete({
      id: projectId,
      developer: { id: developerId },
    });
    return (result.affected ?? 0) > 0;
  }

  async updateProfilePhoto(developerId: UUID, mediaId: UUID | null): Promise<Developer> {
    await this.repository.update(developerId, { profilePhoto: mediaId ? { id: mediaId } : null } as any);
    return this.findById(developerId) as Promise<Developer>;
  }

  async updateIntroVideo(developerId: UUID, mediaId: UUID | null, thumbnailId?: UUID | null): Promise<Developer> {
    const updateData: any = { introVideo: mediaId ? { id: mediaId } : null };
    if (thumbnailId !== undefined) {
      updateData.introVideoThumbnail = thumbnailId ? { id: thumbnailId } : null;
    }
    await this.repository.update(developerId, updateData);
    return this.findById(developerId) as Promise<Developer>;
  }
}
