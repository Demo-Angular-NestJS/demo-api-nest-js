import { Expose, Transform } from 'class-transformer';

export class BaseEntityModel {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id?.toString())
  id: string;

  @Expose()
  createdBy: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedBy: string;

  @Expose()
  updatedAt: Date;
}
