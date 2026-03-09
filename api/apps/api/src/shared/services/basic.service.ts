import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';

export class BasicService<Entity extends ObjectLiteral> {
  constructor(protected repository: Repository<Entity>) {}

  createEntity(...args: Parameters<Repository<Entity>['create']>) {
    return this.repository.create(...args);
  }
  save(...args: Parameters<Repository<Entity>['save']>) {
    return this.repository.save(...args);
  }
  merge(...args: Parameters<Repository<Entity>['merge']>) {
    return this.repository.merge(...args);
  }
  async create(data: DeepPartial<Entity>[]) {
    return this.repository.save(this.repository.create(data));
  }
  find(...args: Parameters<Repository<Entity>['find']>) {
    return this.repository.find(...args);
  }
  findOne(...args: Parameters<Repository<Entity>['findOne']>) {
    return this.repository.findOne(...args);
  }
  findOneBy(...args: Parameters<Repository<Entity>['findOneBy']>) {
    return this.repository.findOneBy(...args);
  }
  update(...args: Parameters<Repository<Entity>['update']>) {
    return this.repository.update(...args);
  }
  upsert(...args: Parameters<Repository<Entity>['upsert']>) {
    return this.repository.upsert(...args);
  }
  async updateOne(data: DeepPartial<Entity>) {
    const entity = await this.repository.preload(data);
    if (entity) {
      return this.save(entity);
    }
    return undefined;
  }
  delete(...args: Parameters<Repository<Entity>['delete']>) {
    return this.repository.delete(...args);
  }
  remove(...args: Parameters<Repository<Entity>['remove']>) {
    return this.repository.remove(...args);
  }
  softDelete(...args: Parameters<Repository<Entity>['softDelete']>) {
    return this.repository.softDelete(...args);
  }
  softRemove(...args: Parameters<Repository<Entity>['softRemove']>) {
    return this.repository.softRemove(...args);
  }
  countBy(...args: Parameters<Repository<Entity>['countBy']>) {
    return this.repository.countBy(...args);
  }
}
