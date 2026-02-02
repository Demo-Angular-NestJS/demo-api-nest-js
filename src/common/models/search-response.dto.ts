import { Expose, Type } from 'class-transformer';
import { PaginationMetaDTO } from './pagination-meta.dto';

export class SearchResponseDTO<T> {
  @Expose()
  data: T[];

  @Expose()
  @Type(() => PaginationMetaDTO)
  meta: PaginationMetaDTO;

  constructor(data: T[], meta: PaginationMetaDTO) {
    this.data = data;
    this.meta = meta;
  }
}