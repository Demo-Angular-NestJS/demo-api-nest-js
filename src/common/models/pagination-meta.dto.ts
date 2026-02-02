import { Expose } from "class-transformer";

export class PaginationMetaDTO {
  @Expose()
  totalItems: number;

  @Expose()
  itemCount: number;

  @Expose()
  itemsPerPage: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;

  constructor(partial: Partial<PaginationMetaDTO>) {
    Object.assign(this, partial);
  }
}