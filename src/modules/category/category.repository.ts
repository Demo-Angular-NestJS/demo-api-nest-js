import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'modules/base.repository';
import { Category } from './schema/category.schema';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(
    @InjectModel(Category.name) categoryModel: Model<Category>,
  ) {
    super(categoryModel);
  }

  async deleteSoft(filter: Record<string, any>): Promise<Category | null> {
    const category = await super.findOne(filter);

    if (!category) {
      return null;
    };

    //TODO: PENDING TO VALIDATE IF IS USE ON TOYS COLLECTIONS

    const result = await super.deleteSoft(filter);
    return result;
  }
}
