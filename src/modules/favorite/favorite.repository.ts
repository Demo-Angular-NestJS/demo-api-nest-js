import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'modules/base.repository';
import { Favorite } from './schemas/favorite.schema';

@Injectable()
export class FavoriteRepository extends BaseRepository<Favorite> {
  constructor(
    @InjectModel(Favorite.name) favoriteModel: Model<Favorite>,
  ) {
    super(favoriteModel);
  }
}
