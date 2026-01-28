import { PaginationMetaDTO } from './pagination-meta.dto';
import { Expose, Type } from 'class-transformer';

export class SearchResponseDTO<T> {
  @Expose()
  data: T[];

  @Expose()
  @Type(() => PaginationMetaDTO) // Tells transformer how to handle this object
  meta: PaginationMetaDTO;

  constructor(data: T[], meta: PaginationMetaDTO) {
    this.data = data;
    this.meta = meta;
  }
}