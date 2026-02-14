import { IsOptional, IsString } from 'class-validator';
import { CreateCategoryDTO } from './create-category.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {
    @IsString()
    @IsOptional()
    readonly id?: string;
}