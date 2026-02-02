import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User } from './schemas/user.schema';
import { BCryptService, IBaseRepository, SearchRequestDTO } from 'common';

@Injectable()
export class UserRepository implements IBaseRepository<User> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private bcryptService: BCryptService,
  ) { }

  async findAll(query: SearchRequestDTO): Promise<{ data: User[], total: number }> {
    const { filterField, filterValue, page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const filter: FilterQuery<User> = {};

    // Dynamically build the filter if both field and value are provided
    if (filterField && filterValue) {
      filter[filterField] = { $regex: filterValue, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password -__v') // Explicitly exclude sensitive fields at the DB level
        .sort(sortOptions as any)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return { data, total };
  }

  async findOne(filter: Partial<User>): Promise<User | null> {
    return await this.userModel.findOne(filter as any).lean<User>().exec();
  }

  async create(data: Partial<User>): Promise<User> {
    if (data?.password) {
      data.password = await this.bcryptService.hashPassword(data.password);
    }

    const newUser = new this.userModel(data);
    const savedUser = await newUser.save();

    return savedUser.toObject();
  }

  async update(filter: Record<string, any>, data: Partial<User>): Promise<User | null> {
    if (data?.password) {
      data.password = await this.bcryptService.hashPassword(data.password);
    }

    return await this.userModel
      .findOneAndUpdate(filter, { $set: data }, {
        new: true,
        runValidators: true,
        timestamps: true,
      })
      .lean<User>()
      .exec();
  }

  async delete(filter: Record<string, any>): Promise<boolean> {
    const result = await this.userModel.deleteOne(filter).exec();

    return result.deletedCount > 0;
  }
}
