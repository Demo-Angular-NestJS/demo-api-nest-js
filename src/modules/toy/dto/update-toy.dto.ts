import { PartialType } from '@nestjs/mapped-types';
import { CreateToyDTO } from './create-toy.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateToyDTO extends PartialType(CreateToyDTO) {
    @IsString()
    @IsOptional()
    readonly id?: string;
}