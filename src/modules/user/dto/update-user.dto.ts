import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsString()
  @IsOptional()
  readonly id?: string;

  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password?: string;
}