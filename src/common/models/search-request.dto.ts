import { IsOptional, IsInt, Min, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterCriteriaDTO } from './filter-criteria.dto';

export class SearchRequestDTO {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterCriteriaDTO)
  searchCriteria?: FilterCriteriaDTO[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  itemsPerPage: number;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder: 'asc' | 'desc' = 'desc';
}