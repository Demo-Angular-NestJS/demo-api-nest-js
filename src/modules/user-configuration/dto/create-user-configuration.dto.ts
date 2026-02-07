import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserConfigurationDTO {
  @Expose()
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  enableEmailNotifications?: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  enableOrderStatus?: boolean;

  @Expose()
  @IsString()
  @IsOptional()
  systemTimeZone?: string;
}
