import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Developer } from '../../../../../libs/shared/src/entities/developer.entity.js';
import type {
  DeveloperSearchParams,
  DeveloperProfile,
} from '../../../../../libs/shared/src/types/agent.types.js';

// Role to search criteria mapping
const ROLE_MAPPINGS: Record<string, { techKeywords: string[]; jobTitleKeywords: string[] }> = {
  devops: {
    techKeywords: ['aws', 'gcp', 'azure', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'linux', 'prometheus', 'grafana'],
    jobTitleKeywords: ['devops', 'platform', 'sre', 'site reliability', 'infrastructure', 'cloud'],
  },
  backend: {
    techKeywords: ['node', 'python', 'java', 'go', 'golang', 'c#', 'ruby', 'php', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'graphql', 'rest'],
    jobTitleKeywords: ['backend', 'back-end', 'back end', 'server', 'api'],
  },
  frontend: {
    techKeywords: ['react', 'vue', 'angular', 'typescript', 'javascript', 'html', 'css', 'tailwind', 'next', 'nuxt', 'redux', 'svelte'],
    jobTitleKeywords: ['frontend', 'front-end', 'front end', 'ui developer', 'web developer'],
  },
  fullstack: {
    techKeywords: ['react', 'vue', 'angular', 'node', 'python', 'typescript', 'javascript', 'postgresql', 'mongodb'],
    jobTitleKeywords: ['full-stack', 'full stack', 'fullstack'],
  },
  mobile: {
    techKeywords: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'],
    jobTitleKeywords: ['mobile', 'ios', 'android', 'app developer'],
  },
  data: {
    techKeywords: ['python', 'sql', 'spark', 'airflow', 'tensorflow', 'pytorch', 'pandas', 'bigquery', 'kafka'],
    jobTitleKeywords: ['data engineer', 'ml engineer', 'machine learning', 'data scientist', 'analytics'],
  },
  qa: {
    techKeywords: ['selenium', 'cypress', 'jest', 'playwright', 'postman', 'jmeter', 'testing'],
    jobTitleKeywords: ['qa', 'test engineer', 'quality assurance', 'sdet', 'automation'],
  },
};

interface RoleSearchParams {
  role: string;
  seniorityLevels?: string[];
  location?: string;
  availabilityStatus?: string[];
  excludeIds?: string[];
  limit?: number;
}

@Injectable()
export class ToolHandlers {
  // Cache for tech stack (refreshed every 5 minutes)
  private techStackCache: string[] | null = null;
  private techStackCacheTime: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(Developer)
    private developerRepository: Repository<Developer>,
  ) {}

  async execute(toolName: string, args: Record<string, any>): Promise<unknown> {
    switch (toolName) {
      case 'search_by_role':
        return this.searchByRole(args as RoleSearchParams);
      case 'search_developers':
        return this.searchDevelopers(args as DeveloperSearchParams);
      case 'get_developer_details':
        return this.getDeveloperDetails(args.developerId as string);
      case 'get_available_tech_stack':
        return this.getAvailableTechStack();
      case 'get_developer_statistics':
        return this.getDeveloperStatistics();
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  /**
   * Search developers by role - combines tech stack and job title search
   */
  private async searchByRole(params: RoleSearchParams): Promise<DeveloperProfile[]> {
    const roleConfig = ROLE_MAPPINGS[params.role.toLowerCase()];
    if (!roleConfig) {
      throw new Error(`Unknown role: ${params.role}. Valid roles: ${Object.keys(ROLE_MAPPINGS).join(', ')}`);
    }

    // Get available tech stack to match against
    const availableTech = await this.getAvailableTechStack();

    // Find matching technologies (case-insensitive partial match)
    const matchingTech = availableTech.filter((tech) =>
      roleConfig.techKeywords.some((keyword) =>
        tech.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );

    // Build query with OR logic: matches tech stack OR has matching job title
    const query = this.developerRepository
      .createQueryBuilder('developer')
      .leftJoinAndSelect('developer.experiences', 'experiences')
      .leftJoinAndSelect('developer.projects', 'projects')
      .leftJoin('media', 'media', 'developer."profilePhotoId" = media.id')
      .addSelect('media.url', 'profilePhotoUrl')
      .where('developer.onboardingCompleted = :completed', { completed: true });

    // Build OR conditions for tech stack and job title
    const orConditions: string[] = [];
    const orParams: Record<string, unknown> = {};

    // Tech stack condition
    if (matchingTech.length > 0) {
      orConditions.push('developer.techStack && :techStack');
      orParams.techStack = matchingTech;
    }

    // Job title conditions (search in jobTitle, bio, and experience positions)
    roleConfig.jobTitleKeywords.forEach((keyword, index) => {
      orConditions.push(`developer.jobTitle ILIKE :title${index}`);
      orConditions.push(`developer.bio ILIKE :title${index}`);
      orParams[`title${index}`] = `%${keyword}%`;
    });

    if (orConditions.length > 0) {
      query.andWhere(`(${orConditions.join(' OR ')})`, orParams);
    }

    // Apply additional filters
    if (params.seniorityLevels?.length) {
      query.andWhere('developer.seniorityLevel IN (:...levels)', {
        levels: params.seniorityLevels,
      });
    }

    if (params.location) {
      query.andWhere('developer.location ILIKE :location', {
        location: `%${params.location}%`,
      });
    }

    if (params.availabilityStatus?.length) {
      query.andWhere('developer.availabilityStatus IN (:...statuses)', {
        statuses: params.availabilityStatus,
      });
    }

    if (params.excludeIds?.length) {
      query.andWhere('developer.id NOT IN (:...excludeIds)', {
        excludeIds: params.excludeIds,
      });
    }

    const limit = Math.min(params.limit || 3, 10);
    const result = await query.take(limit).getRawAndEntities();

    return result.entities.map((dev, index) =>
      this.mapToDeveloperProfile(dev, result.raw[index]?.profilePhotoUrl),
    );
  }

  private async searchDevelopers(
    params: DeveloperSearchParams,
  ): Promise<DeveloperProfile[]> {
    const query = this.developerRepository
      .createQueryBuilder('developer')
      .leftJoinAndSelect('developer.experiences', 'experiences')
      .leftJoinAndSelect('developer.projects', 'projects')
      .leftJoin('media', 'media', 'developer."profilePhotoId" = media.id')
      .addSelect('media.url', 'profilePhotoUrl')
      .where('developer.onboardingCompleted = :completed', { completed: true });

    if (params.techStack?.length) {
      query.andWhere('developer.techStack && :techStack', {
        techStack: params.techStack,
      });
    }

    if (params.seniorityLevels?.length) {
      query.andWhere('developer.seniorityLevel IN (:...levels)', {
        levels: params.seniorityLevels,
      });
    }

    if (params.location) {
      query.andWhere('developer.location ILIKE :location', {
        location: `%${params.location}%`,
      });
    }

    if (params.availabilityStatus?.length) {
      query.andWhere('developer.availabilityStatus IN (:...statuses)', {
        statuses: params.availabilityStatus,
      });
    }

    if (params.searchText) {
      query.andWhere(
        '(developer.firstName ILIKE :search OR developer.lastName ILIKE :search OR developer.jobTitle ILIKE :search OR developer.bio ILIKE :search)',
        { search: `%${params.searchText}%` },
      );
    }

    if (params.excludeIds?.length) {
      query.andWhere('developer.id NOT IN (:...excludeIds)', {
        excludeIds: params.excludeIds,
      });
    }

    const limit = Math.min(params.limit || 3, 10);
    const result = await query.take(limit).getRawAndEntities();

    return result.entities.map((dev, index) =>
      this.mapToDeveloperProfile(dev, result.raw[index]?.profilePhotoUrl),
    );
  }

  private async getDeveloperDetails(
    developerId: string,
  ): Promise<DeveloperProfile | null> {
    // Use raw query to join media table for profilePhotoUrl
    const result = await this.developerRepository
      .createQueryBuilder('developer')
      .leftJoinAndSelect('developer.experiences', 'experiences')
      .leftJoinAndSelect('developer.projects', 'projects')
      .leftJoin('media', 'media', 'developer."profilePhotoId" = media.id')
      .addSelect('media.url', 'profilePhotoUrl')
      .where('developer.id = :id', { id: developerId })
      .getRawAndEntities();

    if (!result.entities.length) return null;

    const developer = result.entities[0];
    const rawData = result.raw[0];

    return this.mapToDeveloperProfile(developer, rawData?.profilePhotoUrl);
  }

  private async getAvailableTechStack(): Promise<string[]> {
    // Return cached result if valid
    const now = Date.now();
    if (this.techStackCache && now - this.techStackCacheTime < this.CACHE_TTL) {
      return this.techStackCache;
    }

    // Fetch from database
    const result = await this.developerRepository
      .createQueryBuilder('developer')
      .select('DISTINCT unnest(developer.techStack)', 'tech')
      .orderBy('tech', 'ASC')
      .getRawMany();

    // Update cache
    this.techStackCache = result.map((r: { tech: string }) => r.tech);
    this.techStackCacheTime = now;

    return this.techStackCache;
  }

  private async getDeveloperStatistics(): Promise<{
    total: number;
    bySeniority: Record<string, number>;
    byAvailability: Record<string, number>;
    topTechnologies: { tech: string; count: number }[];
  }> {
    const total = await this.developerRepository.count({
      where: { onboardingCompleted: true },
    });

    const bySeniority = await this.developerRepository
      .createQueryBuilder('developer')
      .select('developer.seniorityLevel', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('developer.onboardingCompleted = true')
      .groupBy('developer.seniorityLevel')
      .getRawMany();

    const byAvailability = await this.developerRepository
      .createQueryBuilder('developer')
      .select('developer.availabilityStatus', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('developer.onboardingCompleted = true')
      .groupBy('developer.availabilityStatus')
      .getRawMany();

    const topTech = await this.developerRepository
      .createQueryBuilder('developer')
      .select('unnest(developer.techStack)', 'tech')
      .addSelect('COUNT(*)', 'count')
      .where('developer.onboardingCompleted = true')
      .groupBy('tech')
      .orderBy('count', 'DESC')
      .limit(20)
      .getRawMany();

    return {
      total,
      bySeniority: Object.fromEntries(
        bySeniority.map((r: { level: string; count: string }) => [
          r.level,
          +r.count,
        ]),
      ),
      byAvailability: Object.fromEntries(
        byAvailability.map((r: { status: string; count: string }) => [
          r.status,
          +r.count,
        ]),
      ),
      topTechnologies: topTech.map((r: { tech: string; count: string }) => ({
        tech: r.tech,
        count: +r.count,
      })),
    };
  }

  private mapToDeveloperProfile(
    developer: Developer,
    profilePhotoUrl?: string,
  ): DeveloperProfile {
    const currentYear = new Date().getFullYear();
    return {
      id: developer.id,
      firstName: developer.firstName,
      lastName: developer.lastName,
      jobTitle: developer.jobTitle,
      bio: developer.bio,
      techStack: developer.techStack || [],
      seniorityLevel: developer.seniorityLevel,
      location: developer.location,
      availabilityStatus: developer.availabilityStatus,
      profilePhotoUrl,
      experiences:
        developer.experiences?.map((exp) => ({
          companyName: exp.companyName,
          position: exp.position,
          yearsWorked: exp.endYear
            ? exp.endYear - exp.startYear
            : currentYear - exp.startYear,
        })) || [],
      projects:
        developer.projects?.map((proj) => ({
          name: proj.name,
          techStack: proj.techStack || [],
        })) || [],
    };
  }
}
