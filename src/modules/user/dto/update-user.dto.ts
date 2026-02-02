import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}