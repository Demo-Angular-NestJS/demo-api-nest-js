import { Expose, Transform, Type } from 'class-transformer';
import { BaseEntityModel } from 'common';
import { ShortToyResponseDTO } from 'modules/toy/dto/short-toy-response.dto';

export class FavoriteResponseDTO extends BaseEntityModel {
  @Expose()
  @Transform(({ obj }) => obj?.userId?._id?.toString() ?? obj?.userId ?? null)
  userId: string;

  @Expose()
  @Transform(({ obj }) => obj?.toyId?._id?.toString() ?? obj?.toyId ?? null)
  toyId: string;

  @Expose()
  @Type(() => ShortToyResponseDTO)
  toy?: ShortToyResponseDTO

  constructor(partial: Partial<any>) {
    super();
    this.initialize(partial);
  }
}