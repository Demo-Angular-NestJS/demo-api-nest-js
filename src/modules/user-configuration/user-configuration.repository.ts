import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBaseRepository } from 'common';
import { BaseRepository } from 'modules/base.repository';
import { UserConfiguration } from './schemas/user-configuration.schema';

@Injectable()
export class UserConfigurationRepository extends BaseRepository<UserConfiguration> implements IBaseRepository<UserConfiguration> {
  constructor(
    @InjectModel(UserConfiguration.name) userConfigurationModel: Model<UserConfiguration>,
  ) {
    super(userConfigurationModel);
  }
}
