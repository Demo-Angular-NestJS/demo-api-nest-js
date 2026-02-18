import { Expose, Transform } from 'class-transformer';
import { BaseEntityModel } from 'common';

export class ShortToyResponseDTO extends BaseEntityModel {
  @Expose()
  name: string;

  @Expose()
  productSKU: string;

  @Expose()
  shortDescription: string;

  @Expose()
  price: number;

  @Expose()
  @Transform(({ obj }) => obj?.categoryId?._id?.toString() ?? obj?.categoryId ?? null)
  categoryId: string;

  @Expose()
  imageUrl: string;

  @Expose()
  inStock: number;

  constructor(partial: Partial<any>) {
    super();
    this.initialize(partial);
  }
}