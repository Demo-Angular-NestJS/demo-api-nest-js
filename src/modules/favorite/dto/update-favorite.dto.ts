import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoriteDTO } from './create-favorite.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFavoriteDto extends PartialType(CreateFavoriteDTO) {
    @IsString()
    @IsOptional()
    readonly id?: string;
}