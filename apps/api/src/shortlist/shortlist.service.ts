import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicService } from '../shared/services/basic.service';
import { Shortlist } from './models/shortlist.entity';
import { User } from '../user/models/user.entity';
import { Developer } from '../developer/models/developer.entity';

@Injectable()
export class ShortlistService extends BasicService<Shortlist> {
  constructor(
    @InjectRepository(Shortlist)
    protected repository: Repository<Shortlist>,
    @InjectRepository(Developer)
    private developerRepository: Repository<Developer>,
  ) {
    super(repository);
  }

  async getShortlist(userId: UUID): Promise<Shortlist[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      relations: ['developer', 'developer.profilePhoto'],
      order: { createdAt: 'DESC' },
    });
  }

  async getShortlistCount(userId: UUID): Promise<number> {
    return this.repository.count({
      where: { user: { id: userId } },
    });
  }

  async isInShortlist(userId: UUID, developerId: UUID): Promise<boolean> {
    const entry = await this.repository.findOne({
      where: {
        user: { id: userId },
        developer: { id: developerId },
      },
    });
    return !!entry;
  }

  async addToShortlist(user: User, developerId: UUID): Promise<Shortlist> {
    const developer = await this.developerRepository.findOne({
      where: { id: developerId },
    });

    if (!developer) {
      throw new BadRequestException('Developer not found');
    }

    if (user.role === 'Developer') {
      const userDeveloper = await this.developerRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (userDeveloper && userDeveloper.id === developerId) {
        throw new BadRequestException('You cannot shortlist yourself');
      }
    }

    const existing = await this.repository.findOne({
      where: {
        user: { id: user.id },
        developer: { id: developerId },
      },
    });

    if (existing) {
      throw new BadRequestException('Developer is already in your shortlist');
    }

    const shortlistEntry = this.repository.create({
      user,
      developer,
    });

    const saved = await this.repository.save(shortlistEntry);

    return this.repository.findOne({
      where: { id: saved.id },
      relations: ['developer', 'developer.profilePhoto'],
    }) as Promise<Shortlist>;
  }

  async removeFromShortlist(userId: UUID, developerId: UUID): Promise<boolean> {
    const result = await this.repository.delete({
      user: { id: userId },
      developer: { id: developerId },
    });

    return (result.affected ?? 0) > 0;
  }

  async clearShortlist(userId: UUID): Promise<boolean> {
    const result = await this.repository.delete({
      user: { id: userId },
    });

    return (result.affected ?? 0) > 0;
  }
}
