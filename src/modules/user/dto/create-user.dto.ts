import { Expose, Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  userName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isAdmin?: boolean;
}
