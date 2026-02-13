import { Expose, Transform } from 'class-transformer';
import { BaseEntityModel } from 'common';

export class ToyResponseDTO extends BaseEntityModel {
  @Expose()
  name: string;

  @Expose()
  productSKU: string;

  @Expose()
  shortDescription: string;

  @Expose()
  description: string;

  @Expose()
  tags: string[];

  @Expose()
  price: number;

  @Expose()
  @Transform(({ obj }) => obj?.categoryId?._id?.toString() ?? obj?.categoryId ?? null)
  categoryId: string;

  @Expose()
  imageUrl: string;

  @Expose()
  imageUrls: string[];

  @Expose()
  stars: number;

  @Expose()
  points: number;

  @Expose()
  inStock: number;

  @Expose()
  isActive: boolean;

  constructor(partial: Partial<any>) {
    super();
    this.initialize(partial);
  }
}