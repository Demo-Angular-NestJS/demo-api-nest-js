import { Controller, Get, NotFoundException, Req } from '@nestjs/common';
import { BaseController } from 'modules/base.controller';
import { UserConfiguration } from './schemas/user-configuration.schema';
import { UserConfigResponseDTO } from './dto/user-config-response.dto';
import { UserConfigurationService } from './user-configuration.service';
import { CreateUserConfigurationDTO } from './dto/create-user-configuration.dto';
import { UpdateUserConfigurationDTO } from './dto/update-user-configuration.dto';
import type { AuthenticatedRequestModel } from 'common/models';

@Controller('userConfiguration')
export class UserConfigurationController extends BaseController<UserConfiguration, CreateUserConfigurationDTO, UpdateUserConfigurationDTO, UserConfigResponseDTO> {
  constructor(
    private readonly userConfigurationService: UserConfigurationService,
  ) {
    super(userConfigurationService, UserConfigResponseDTO);
  }

  @Get('current')
  public async current(@Req() req: AuthenticatedRequestModel) {
    const current = await this.userConfigurationService.getByFilter({ userId: req?.user?.sub });

    if (!current) {
      throw new NotFoundException('Configuration not found');
    }

    return new UserConfigResponseDTO(current);
  }
}
