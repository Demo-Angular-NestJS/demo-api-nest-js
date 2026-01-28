import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
// import { IsOptional, IsEnum } from 'class-validator';

// PartialType inherits all properties from CreateUserDto but makes them optional
export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  
  // You can add properties here that are ONLY for updates
//   @IsOptional()
//   @IsEnum(['active', 'inactive', 'suspended'])
//   status?: string;
}