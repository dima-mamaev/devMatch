import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicService } from '../shared/services/basic.service';
import { Recruiter } from './models/recruiter.entity';
import { UpdateRecruiterInput } from './inputs/update-recruiter.input';
import { User } from '../user/models/user.entity';

@Injectable()
export class RecruiterService extends BasicService<Recruiter> {
  constructor(
    @InjectRepository(Recruiter)
    protected repository: Repository<Recruiter>,
  ) {
    super(repository);
  }

  async findByUserId(userId: UUID): Promise<Recruiter | null> {
    return this.repository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findById(id: UUID): Promise<Recruiter | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createRecruiter(user: User, firstName: string, lastName: string): Promise<Recruiter> {
    const recruiter = this.repository.create({
      user,
      firstName,
      lastName,
    });
    return this.repository.save(recruiter);
  }

  async updateRecruiter(
    recruiterId: UUID,
    input: UpdateRecruiterInput,
  ): Promise<Recruiter> {
    await this.repository.update(recruiterId, input);
    return this.findById(recruiterId) as Promise<Recruiter>;
  }

  async softDeleteRecruiter(recruiterId: UUID): Promise<boolean> {
    const result = await this.repository.softDelete(recruiterId);
    return (result.affected ?? 0) > 0;
  }

  async hardDeleteRecruiter(recruiterId: UUID): Promise<boolean> {
    const result = await this.repository.delete(recruiterId);
    return (result.affected ?? 0) > 0;
  }
}
