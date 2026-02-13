import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'modules/base.repository';
import { Toy } from './schemas/toy.schema';
import { SearchRequestDTO } from 'common';

@Injectable()
export class ToyRepository extends BaseRepository<Toy> {
  constructor(
    @InjectModel(Toy.name) toyModel: Model<Toy>,
  ) {
    super(toyModel);
  }

  async findAll(query: SearchRequestDTO) {
    return await super.findAll(query, '-__v', ['categoryId']);
  }
}
