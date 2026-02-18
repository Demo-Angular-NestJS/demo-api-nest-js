
import { Injectable } from '@nestjs/common';
import { BaseService } from 'common/services/base.service';
import { Favorite } from './schemas/favorite.schema';
import { FavoriteRepository } from './favorite.repository';
import { FavoriteResponseDTO } from './dto/favorite-response.dto';
import { Types } from 'mongoose';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Injectable()
export class FavoriteService extends BaseService<Favorite, FavoriteResponseDTO> {
  constructor(
    protected readonly favoriteRepository: FavoriteRepository,
  ) {
    super(favoriteRepository, FavoriteResponseDTO);
  }

  async toggleFavorite(userId: string, dto: UpdateFavoriteDto): Promise<Favorite | null> {
    const userObjectId = new Types.ObjectId(userId) as any;
    const toyObjectId = new Types.ObjectId(dto.toyId) as any;

    const filter = {
      userId: userObjectId,
      toyId: toyObjectId,
    };

    const existingFavorite = await this.favoriteRepository.findOne(filter);

    if (existingFavorite) {
      await this.favoriteRepository.delete({ _id: existingFavorite._id });
      return null;
    } else {
      const newFavoriteData: Partial<Favorite> = {
        userId: userObjectId,
        toyId: toyObjectId,
        personalNote: dto.personalNote,
      };

      return await this.favoriteRepository.create(newFavoriteData);
    }
  }
}
