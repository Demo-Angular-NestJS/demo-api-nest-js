import { PartialType } from '@nestjs/mapped-types';
import { CreateUserConfigurationDTO } from './create-user-configuration.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserConfigurationDTO extends PartialType(CreateUserConfigurationDTO) {
    @IsString()
    @IsOptional()
    readonly id?: string;
}