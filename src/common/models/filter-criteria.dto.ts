import { IsOptional, IsString, IsEnum } from 'class-validator';
import { FilterConditionEnum } from 'common/enum';

export class FilterCriteriaDTO {
  @IsString()
  fieldName: string;

  @IsOptional()
  value: any;

  @IsEnum(FilterConditionEnum)
  condition: FilterConditionEnum;

  @IsOptional()
  @IsString()
  dataType: 'string' | 'number' | 'boolean' | 'date' = 'string';
}
