import { PartialType } from '@nestjs/mapped-types';
import { CreateUserConfigurationDTO } from './create-user-configuration.dto';

export class UpdateUserConfigurationDTO extends PartialType(CreateUserConfigurationDTO) { }