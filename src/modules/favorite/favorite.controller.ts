import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { BaseController } from 'modules/base.controller';
import { Favorite } from './schemas/favorite.schema';
import { CreateFavoriteDTO } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { FavoriteResponseDTO } from './dto/favorite-response.dto';
import { FavoriteService } from './favorite.service';
import type { AuthenticatedRequestModel } from 'common/models';
import { ToyService } from 'modules/toy/toy.service';
import { Types } from 'mongoose';

@Controller('favorite')
export class FavoriteController extends BaseController<Favorite, CreateFavoriteDTO, UpdateFavoriteDto, FavoriteResponseDTO> {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly toyService: ToyService,
  ) {
    super(favoriteService, FavoriteResponseDTO);
  }

  @Post('toggle')
  async toggle(@Req() req: AuthenticatedRequestModel, @Body() dto: UpdateFavoriteDto) {
    const result = await this.favoriteService.toggleFavorite(req.user.sub, dto);

    if (!result) {
      return null;
    }

    return this.transform(result.toObject());
  }

  @Get('current')
  async getCurrentFavorites(@Req() req: AuthenticatedRequestModel) {
    const { data } = await this.favoriteService.search({ userId: req.user.sub });

    const enrichedData = await Promise.all(
      data.map(async (favorite) => {
        const toy = await this.toyService.getById(favorite.toyId ?? '');
        return this.transform({ ...favorite, toy });
      })
    );

    return enrichedData;
  }
}
