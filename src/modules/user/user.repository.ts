import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, HydratedDocument } from 'mongoose';
import { User } from './schemas/user.schema';
import { BCryptService, IBaseRepository, SearchRequestDTO } from 'common';
import { BaseRepository } from 'modules/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> implements IBaseRepository<User> {
  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    private bcryptService: BCryptService,
  ) {
    super(userModel);
  }

  async findAll(query: SearchRequestDTO) {
    return super.findAll(query, '-password -__v');
  }

  async create(data: Partial<User>): Promise<HydratedDocument<User>> {
    if (data.password) {
      data.password = await this.bcryptService.hashPassword(data.password);
    }

    return super.create(data);
  }

  async update(filter: Record<string, any>, data: Partial<User>): Promise<User | null> {
    if (data.password) {
      data.password = await this.bcryptService.hashPassword(data.password);
    }
    return super.update(filter, data);
  }

 async delete(filter: Record<string, any>): Promise<boolean> {
    const user = await this.findOne(filter);

    if (!user) {
      return false
    };
    
    if (user.isAdmin) {
      throw new ConflictException(`The user cannot be deleted, it's a system account.`);
    }

    const result = await this.deleteSoft(filter);
    return !!result;
  }
}
