
import { Injectable } from '@nestjs/common';
import { BaseService } from 'common/services/base.service';
import { UserConfiguration } from './schemas/user-configuration.schema';
import { UserConfigurationRepository } from './user-configuration.repository';
import { UserConfigResponseDTO } from './dto/user-config-response.dto';

@Injectable()
export class UserConfigurationService extends BaseService<UserConfiguration, UserConfigResponseDTO> {
  constructor(
    protected readonly userConfigurationRepository: UserConfigurationRepository,
  ) {
    super(userConfigurationRepository, UserConfigResponseDTO);
  }
}
