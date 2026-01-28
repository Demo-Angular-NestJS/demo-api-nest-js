import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserSearchCriteriaDTO } from './dto/user-search-criteria.dto';

@Injectable()
export class UserRepository {
  // We inject the Mongoose Model specifically for the User schema
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async findAll(query: UserSearchCriteriaDTO): Promise<{ data: User[], total: number }> {
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
  // async findAll(limit: number, skip: number) {
  //   return this.userModel
  //     .find()
  //     .select('-password -__v') // Exclude sensitive/internal fields
  //     .limit(limit)
  //     .skip(skip)
  //     .sort({ createdAt: -1 }) // Newest first
  //     .lean() // Return plain objects, not Mongoose documents
  //     .exec();
  // }

  async findOne(query: FilterQuery<User>): Promise<User | null> {
    return this.userModel.findOne(query).exec();
  }

  async countAll(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(
    query: FilterQuery<User>,
    update: UpdateQuery<User>,
  ): Promise<User | null> {
    return this.userModel.findOneAndUpdate(query, update, { new: true, runValidators: true }).exec();
  }

  async delete(query: FilterQuery<User>): Promise<boolean> {
    const result = await this.userModel.deleteOne(query).exec();
    return result.deletedCount > 0;
  }
}
